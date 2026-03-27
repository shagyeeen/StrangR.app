import { Server, Socket } from 'socket.io'
import { auth, db } from '../config/firebase'
import { MatchingService } from '../services/matchingService'

interface AuthenticatedSocket extends Socket {
  user?: import('firebase-admin/auth').DecodedIdToken
}

const matchingService = new MatchingService()

export const setupSocketHandlers = (io: Server) => {
  // Socket auth middleware
  io.use(async (socket: AuthenticatedSocket, next) => {
    const token = socket.handshake.auth.token
    if (!token) {
      return next(new Error('Authentication error'))
    }
    try {
      const decodedToken = await auth.verifyIdToken(token)
      // Check if user is banned
      const userDoc = await db.collection('users').doc(decodedToken.uid).get()
      const userData = userDoc.data()
      if (userData?.banStatus && userData.banExpiryTime) {
        if (userData.banExpiryTime.toDate() > new Date()) {
          return next(new Error('Account suspended'))
        } else {
          // Ban expired, lift it
          await userDoc.ref.update({ banStatus: false, banExpiryTime: null })
        }
      }

      socket.user = decodedToken
      next()
    } catch (err) {
      next(new Error('Authentication failed'))
    }
  })

  io.on('connection', (socket: AuthenticatedSocket) => {
    const userId = socket.user!.uid
    console.log(`User connected: ${userId} (${socket.id})`)

    // Join personal room for private events
    socket.join(userId)

    // Update real-time status
    updateUserStatus(userId, true)

    // --- Matching flow ---
    socket.on('start_matching', () => {
      matchingService.addToQueue(userId, socket)
    })

    socket.on('skip_stranger', (data: { strangerId: string }) => {
      matchingService.removeFromQueue(userId)
    })

    // --- Messaging ---
    socket.on('send_message', async (data: { recipientId: string, message: any }) => {
      const recipientId = data.recipientId
      
      // We reconstruct the object to ensure only allowed fields are sent
      const messageObj = {
        id: data.message.id || Math.random().toString(36).substr(2, 9),
        senderId: userId,
        text: data.message.text,
        timestamp: new Date().toISOString(),
        readBy: []
      }

      // Send to recipient
      io.to(recipientId).emit('receive_message', messageObj)
      // Echo back to sender acknowledging the server received it
      socket.emit('message_sent', messageObj)
    })

    // --- Typing ---
    socket.on('typing', (data: { recipientId: string }) => {
      io.to(data.recipientId).emit('user_typing', { senderId: userId })
    })

    socket.on('stop_typing', (data: { recipientId: string }) => {
      io.to(data.recipientId).emit('user_stopped_typing', { senderId: userId })
    })

    // --- Connections (Friendship Request) ---
    socket.on('send_connection_request', (data: { recipientId: string }) => {
      // Create connection request ID
      const connectionId = `conn_${Date.now()}_${userId}`
      // Send pending state to recipient
      io.to(data.recipientId).emit('connection_request_received', { 
        connectionId, 
        requesterId: userId 
      })
      // Send confirmation to sender
      socket.emit('connection_pending', { connectionId })
    })

    socket.on('accept_connection', async (data: { connectionId: string, requesterId: string }) => {
      console.log(`Connection ${data.connectionId} accepted by ${userId}`)
      // Create friendship record in Firebase
      const friendshipId = await createFriendship(userId, data.requesterId)
      
      // Notify both parties
      io.to(data.requesterId).emit('connection_accepted', { friendshipId, userId })
      socket.emit('connection_accepted', { friendshipId, userId: data.requesterId })
    })

    socket.on('decline_connection', (data: { connectionId: string, requesterId: string }) => {
      // Notify the requester
      io.to(data.requesterId).emit('connection_declined', { connectionId: data.connectionId })
      socket.emit('connection_declined', { connectionId: data.connectionId })
    })

    // --- Moderation (Skip / Report) ---
    socket.on('skip_stranger', (data: { strangerId: string }) => {
      // End chat session
      io.to(data.strangerId).emit('match_skipped_you')
      socket.emit('chat_ended')
    })
    
    socket.on('report_stranger', async (data: { strangerId: string, reason: string }) => {
      console.log(`User ${userId} reported ${data.strangerId} for ${data.reason}`)
      // File report in DB
      await db.collection('reports').add({
        reporterId: userId,
        reportedId: data.strangerId,
        reason: data.reason,
        timestamp: new Date()
      })
      // End chat session
      io.to(data.strangerId).emit('match_skipped_you')
      socket.emit('chat_ended')
      
      // Notify the user that the report was received
      socket.emit('report_acknowledged')

      // Simple ban logic: ban if > 3 reports
      await checkBanThreshold(data.strangerId)
    })

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${userId}`)
      matchingService.removeFromQueue(userId)
      updateUserStatus(userId, false)
    })
  })
}

// Helpers
async function updateUserStatus(uid: string, isOnline: boolean) {
  try {
    await db.collection('users').doc(uid).update({ 
      isOnline, 
      lastActive: new Date() 
    })
  } catch (e) {
    // ignore if user doesn't exist yet
  }
}

async function createFriendship(user1: string, user2: string) {
  const docRef = await db.collection('friendships').add({
    users: [user1, user2],
    createdAt: new Date(),
    status: 'active'
  })
  return docRef.id
}

async function checkBanThreshold(uid: string) {
  try {
    const reportsSnapshot = await db.collection('reports')
      .where('reportedId', '==', uid)
      .get()
    
    if (reportsSnapshot.size >= 3) {
      // Action: 24 hour ban
      const expiry = new Date()
      expiry.setHours(expiry.getHours() + 24)
      await db.collection('users').doc(uid).update({
        banStatus: true,
        banExpiryTime: expiry
      })
      console.log(`User ${uid} has been banned.`)
    }
  } catch (error) {
    console.error('Error checking ban status', error)
  }
}
