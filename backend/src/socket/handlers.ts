import { Server, Socket } from 'socket.io'
import { auth, db, admin } from '../config/firebase'
import { MatchingService } from '../services/matchingService'
import { supabase } from '../config/supabase'

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

    // Notify friends they are online
    ;(async () => {
      try {
        const friendshipsSnapshot = await db.collection('friendships')
          .where('users', 'array-contains', userId)
          .where('status', '==', 'active')
          .get()
        
        friendshipsSnapshot.docs.forEach(doc => {
          const data = doc.data()
          const otherUid = data.users.find((id: string) => id !== userId)
          if (otherUid) {
            io.to(otherUid).emit('friend_online', userId)
          }
        })
      } catch (e) {
        console.error('Online notification error:', e)
      }
    })()

    // --- Matching flow ---
    socket.on('start_matching', () => {
      matchingService.addToQueue(userId, socket)
    })

    socket.on('stop_matching', () => {
      matchingService.removeFromQueue(userId)
    })

    socket.on('skip_stranger', (data: { strangerId: string }) => {
      matchingService.removeFromQueue(userId)
    })

    // --- Messaging ---
    socket.on('send_message', async (data: { recipientId: string, message: any, friendshipId?: string, clientMsgId?: string }) => {
      const recipientId = data.recipientId
      const friendshipId = data.friendshipId
      const clientMsgId = data.clientMsgId

      // Robustly extract the message text whether it's an object or string
      const text = typeof data.message === 'string' ? data.message : data.message?.text

      if (!text) {
        console.error('Socket: Received empty or invalid message from', userId)
        return
      }

      // We reconstruct the object to ensure only allowed fields are sent
      const messageObj = {
        id: (typeof data.message === 'object' && data.message?.id) || Math.random().toString(36).substr(2, 9),
        senderId: userId,
        recipientId: recipientId,
        text: text,
        timestamp: new Date().toISOString(),
        readBy: [],
        clientMsgId,
        friendshipId: friendshipId,
        status: 'sent'
      }

      // If they are friends, we persist the message
      if (friendshipId) {
        try {
          // Check if this friendship exists and includes both users for security
          const friendshipDoc = await db.collection('friendships').doc(friendshipId).get()
          if (friendshipDoc.exists && friendshipDoc.data()?.users.includes(userId) && friendshipDoc.data()?.users.includes(recipientId)) {
            await db.collection('friendships').doc(friendshipId).collection('messages').add({
              ...messageObj,
              timestamp: admin.firestore.FieldValue.serverTimestamp() // Use server date
            })

            // SYNC TO SUPABASE
            const { error: supabaseError } = await supabase
              .from('messages')
              .insert({
                friendship_id: friendshipId,
                sender_id: userId,
                recipient_id: recipientId,
                text: text, // Corrected from content
                client_msg_id: clientMsgId,
                status: 'sent'
              })
            
            if (supabaseError) {
              console.error('SERVER: Failed to sync message to Supabase:', supabaseError)
            } else {
              console.log('SERVER: Message synced to Supabase successfully')
            }
          }
        } catch (e) {
          console.error('Failed to save message to history:', e)
        }
      }

      // Send to recipient and the entire friendship room
      // Using .to().to() ensures a single delivery attempt to each socket in both rooms
      const targetRoom = friendshipId || recipientId
      console.log(`--- SERVER: send_message from ${userId} to ${targetRoom} ---`, { text: text.substring(0, 10), clientMsgId })
      
      const outgoing = io.to(targetRoom)
      if (friendshipId && recipientId) {
        // Redundantly target the recipient's personal room in case they haven't joined the friendship room yet
        outgoing.to(recipientId)
      }
      
      outgoing.emit('receive_message', messageObj)
      
      // Also confirm back to the sender specifically 
      socket.emit('message_sent', messageObj)
    })

    socket.on('message_status_update', async (data: { messageId?: string, clientMsgId?: string, friendshipId?: string, recipientId?: string, status: 'delivered' | 'read' }) => {
      const { messageId, clientMsgId, friendshipId, recipientId, status } = data
      const targetRoom = friendshipId || recipientId
      
      try {
        if (status === 'read' && friendshipId) {
          // Mark all messages in this friendship from the OTHER user as read
          await supabase
            .from('messages')
            .update({ status: 'read' })
            .eq('friendship_id', friendshipId)
            .neq('sender_id', userId)
            .neq('status', 'read')

          // Notify the other user (sender)
          io.to(friendshipId).emit('message_status_changed', { friendshipId, status: 'read', updaterId: userId })
        } else if (status === 'read' && recipientId) {
          // Random chat notification
          io.to(recipientId).emit('message_status_changed', { recipientId, status: 'read', updaterId: userId })
        } else if ((messageId || clientMsgId) && targetRoom) {
          // Specific message delivered
          if (friendshipId && messageId) {
            await supabase
              .from('messages')
              .update({ status: 'delivered' })
              .eq('id', messageId)
          }
          
          // Notify the sender
          io.to(targetRoom).emit('message_status_changed', { 
            messageId, 
            clientMsgId, 
            friendshipId, 
            recipientId, 
            status: 'delivered', 
            updaterId: userId 
          })
        }
      } catch (err) {
        console.error('Failed to update message status:', err)
      }
    })

    // --- Typing & Chat Rooms ---
    socket.on('join_private_chat', async (data: { otherUid: string, friendshipId?: string }) => {
      const { otherUid, friendshipId } = data
      
      if (friendshipId) {
        console.log(`User ${userId} joining friendship room: ${friendshipId}`)
        socket.join(friendshipId)
      }

      try {
        // Force a status broadcast to the other user
        io.to(otherUid).emit('friend_online', userId)
        // And check if the other user is online to tell the requester
        const otherSockets = await io.in(otherUid).fetchSockets()
        if (otherSockets.length > 0) {
          socket.emit('friend_online', otherUid)
        }
      } catch (e) {
        console.error('Join private chat error:', e)
      }
    })

    socket.on('typing', (data: { recipientId: string, friendshipId?: string }) => {
      const targetRoom = data.friendshipId || data.recipientId
      io.to(targetRoom).emit('user_typing', { senderId: userId })
    })

    socket.on('stop_typing', (data: { recipientId: string, friendshipId?: string }) => {
      const targetRoom = data.friendshipId || data.recipientId
      io.to(targetRoom).emit('user_stopped_typing', { senderId: userId })
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
      console.log(`Connection ${data.connectionId} accepted by ${userId} (Acceptor) for ${data.requesterId} (Requester)`)
      
      try {
        // Use a deterministic ID for the friendship to prevent race-condition duplicates
        const sortedIds = [userId, data.requesterId].sort()
        const friendshipId = `bond_${sortedIds[0]}_${sortedIds[1]}`
        
        // Check if there is already an active friendship (atomic-ish check)
        const friendshipRef = db.collection('friendships').doc(friendshipId)
        const doc = await friendshipRef.get()
        
        if (doc.exists && doc.data()?.status === 'active') {
          console.log('Friendship already exists and is active:', friendshipId)
        } else {
          // Create or update to active
          await friendshipRef.set({
            users: [userId, data.requesterId],
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            status: 'active'
          }, { merge: true })
        }

        // SYNC FRIENDSHIP TO SUPABASE (Upsert)
        const { error: fSyncError } = await supabase
          .from('friendships')
          .upsert({
            id: friendshipId,
            user1_id: userId,
            user2_id: data.requesterId,
            status: 'active',
            updated_at: new Date().toISOString()
          }, { onConflict: 'id' })
        
        if (fSyncError) {
          console.error('SERVER: Failed to sync friendship to Supabase:', fSyncError)
        }
        
        // Notify the Requester (P1)
        io.to(data.requesterId).emit('connection_accepted', { 
          friendshipId, 
          userId, // The UID of the person who accepted (P2)
          strangerCode: 'Matched' 
        })

        // Notify the Acceptor (P2)
        socket.emit('connection_accepted', { 
          friendshipId, 
          userId: data.requesterId 
        })
      } catch (error) {
        console.error('Error in accept_connection:', error)
      }
    })

    socket.on('decline_connection', (data: { connectionId: string, requesterId: string }) => {
      // Notify the requester
      io.to(data.requesterId).emit('connection_declined', { connectionId: data.connectionId })
      socket.emit('connection_declined', { connectionId: data.connectionId })
    })

    socket.on('disconnect_friendship', async (data: { friendshipId: string }) => {
      const { friendshipId } = data
      try {
        const doc = await db.collection('friendships').doc(friendshipId).get()
        let otherUid: string | undefined
        let users: string[] = []

        if (doc.exists) {
          users = doc.data()?.users || []
          otherUid = users.find((id: string) => id !== userId)
        }

        if (otherUid) {
          // 1. Mark ALL possible bonds between these two as inactive
          const sortedIds = [userId, otherUid].sort()
          const deterministicId = `bond_${sortedIds[0]}_${sortedIds[1]}`

          // Batch update
          const batch = db.batch()
          
          // Trace the deterministic doc
          batch.update(db.collection('friendships').doc(deterministicId), { status: 'inactive' })
          
          // Also trace the specific ID if different
          if (friendshipId !== deterministicId) {
            batch.update(db.collection('friendships').doc(friendshipId), { status: 'inactive' })
          }

          // Optional: still try to find any leftovers via query just in case
          const leftovers = await db.collection('friendships')
            .where('users', 'array-contains', userId)
            .get()
          
          leftovers.docs.forEach(d => {
            if (d.data().users.includes(otherUid) && d.data().status === 'active') {
              batch.update(d.ref, { status: 'inactive' })
            }
          })

          await batch.commit()

          // Sync ONE to Supabase (Supabase is less sensitive but good for records)
          await supabase.from('friendships').update({ status: 'inactive' }).eq('id', deterministicId)
          if (friendshipId !== deterministicId) {
            await supabase.from('friendships').update({ status: 'inactive' }).eq('id', friendshipId)
          }

          // Notify both users
          io.to(friendshipId).emit('bond_disconnected', { friendshipId })
          io.to(deterministicId).emit('bond_disconnected', { friendshipId: deterministicId })
          
          users.forEach((uid: string) => {
            io.to(uid).emit('bond_disconnected', { friendshipId })
          })

          console.log(`Bond(s) severed between ${userId} and ${otherUid}.`)
        }
      } catch (err) {
        console.error('SERVER: Aggressive disconnect failed:', err)
      }
    })

    // --- Moderation (Skip / Report) ---
    socket.on('skip_stranger', (data: { strangerId: string }) => {
      // End chat session for the OTHER person with a specific skip event
      io.to(data.strangerId).emit('match_skipped_you')
      // We do NOT emit back to `socket` because the sender already skipped and is re-queuing locally
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
      
      // Get current report count for the reported user
      const reportsSnapshot = await db.collection('reports')
        .where('reportedId', '==', data.strangerId)
        .get()
      
      const reportCount = reportsSnapshot.size

      // Notify the OTHER person they were reported and show status
      io.to(data.strangerId).emit('you_were_reported', { 
        count: reportCount,
        max: 5
      })
      
      // Notify the user who reported that it was received
      socket.emit('report_acknowledged')

      // Simple ban logic: ban if >= 5 reports (per user request n/5)
      await checkBanThreshold(data.strangerId, reportCount)
    })

    socket.on('disconnect', async () => {
      console.log(`User disconnected: ${userId}`)
      matchingService.removeFromQueue(userId)
      updateUserStatus(userId, false)

      // Notify friends they are offline
      try {
        const friendshipsSnapshot = await db.collection('friendships')
          .where('users', 'array-contains', userId)
          .where('status', '==', 'active')
          .get()
        
        friendshipsSnapshot.docs.forEach(doc => {
          const data = doc.data()
          const otherUid = data.users.find((id: string) => id !== userId)
          if (otherUid) {
            io.to(otherUid).emit('friend_offline', userId)
          }
        })
      } catch (e) {
        console.error('Offline notification error:', e)
      }
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

async function checkBanThreshold(uid: string, reportCount: number) {
  try {
    if (reportCount >= 5) {
      // Action: 24 hour ban
      const expiry = new Date()
      expiry.setHours(expiry.getHours() + 24)
      await db.collection('users').doc(uid).update({
        banStatus: true,
        banExpiryTime: expiry
      })
      console.log(`User ${uid} has been banned due to ${reportCount} reports.`)
    }
  } catch (error) {
    console.error('Error checking ban status', error)
  }
}
