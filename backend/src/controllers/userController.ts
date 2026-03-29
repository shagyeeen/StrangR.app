import { Request, Response } from 'express'
import { db, admin, auth } from '../config/firebase'
import { supabase } from '../config/supabase'
import { AuthRequest } from '../middleware/auth'

interface ChatMessage {
  id: string
  text: string
  senderId: string
  recipientId: string
  timestamp: any
  clientMsgId?: string
  status?: string
}

export const getMe = async (req: AuthRequest, res: Response) => {
  try {
    const uid = req.user!.uid
    const doc = await db.collection('users').doc(uid).get()
    
    if (!doc.exists) {
      // First time login -> create basic profile
      const newCode = `StrangR#${Math.floor(1000 + Math.random() * 9000)}`
      const newUser = {
        uid,
        strangRCode: newCode,
        isOnline: true,
        premiumStatus: false,
        banStatus: false,
        createdAt: new Date()
      }
      await db.collection('users').doc(uid).set(newUser)
      return res.status(201).json(newUser)
    }

    res.status(200).json(doc.data())
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user profile' })
  }
}

export const generateNewCode = async (req: AuthRequest, res: Response) => {
  try {
    const uid = req.user!.uid
    // Check if premium logic here...
    
    const newCode = `StrangR#${Math.floor(1000 + Math.random() * 9000)}`
    await db.collection('users').doc(uid).update({ strangRCode: newCode })
    
    res.status(200).json({ strangRCode: newCode })
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate new code' })
  }
}

export const updatePetName = async (req: AuthRequest, res: Response) => {
  try {
    const uid = req.user!.uid
    const { friendshipId } = req.params
    const { petName } = req.body

    // Note: In a real app, verify the friendship belongs to the user
    // We update the user's specific view of the friendship
    await db.collection('users').doc(uid).collection('friends').doc(friendshipId).set({
      petName
    }, { merge: true })

    res.status(200).json({ success: true, petName })
  } catch (error) {
    res.status(500).json({ error: 'Failed to update pet name' })
  }
}

export const getFriends = async (req: AuthRequest, res: Response) => {
  try {
    const uid = req.user!.uid
    const friendshipsSnapshot = await db.collection('friendships')
      .where('users', 'array-contains', uid)
      .where('status', '==', 'active')
      .get()

    if (friendshipsSnapshot.empty) {
      return res.status(200).json([])
    }

    // FETCH UNREAD COUNTS FROM SUPABASE
    const { data: unreadData, error: unreadError } = await supabase
      .from('messages')
      .select('friendship_id')
      .eq('recipient_id', uid)
      .neq('status', 'read')
    
    const unreadCounts = new Map<string, number>()
    if (unreadData) {
      unreadData.forEach(m => {
        const id = m.friendship_id
        unreadCounts.set(id, (unreadCounts.get(id) || 0) + 1)
      })
    }

    const friendsPromises = friendshipsSnapshot.docs.map(async (doc) => {
      try {
        const data = doc.data()
        const otherUid = data.users.find((id: string) => id !== uid)
        
        if (!otherUid) {
          console.warn(`Friendship ${doc.id} has no other user than ${uid}`)
          return null
        }
        
        const userDoc = await db.collection('users').doc(otherUid).get()
        if (!userDoc.exists) return null
        
        const userData = userDoc.data()
        const petNameDoc = await db.collection('users').doc(uid).collection('friends').doc(doc.id).get()
        const petNameData = petNameDoc.data()

        // Fetch last message - wrap in try/catch in case index is missing
        let lastMessageData = null
        try {
          const lastMessageSnapshot = await db.collection('friendships')
            .doc(doc.id)
            .collection('messages')
            .orderBy('timestamp', 'desc')
            .limit(1)
            .get()
          
          if (!lastMessageSnapshot.empty) {
            lastMessageData = lastMessageSnapshot.docs[0].data()
          }
        } catch (msgErr) {
          console.error(`Error fetching last message for friendship ${doc.id}:`, msgErr)
        }

        const gradients = [
          'from-pink-400 to-purple-600',
          'from-orange-400 to-red-600',
          'from-blue-400 to-pink-500',
          'from-teal-400 to-blue-500',
          'from-green-400 to-cyan-500'
        ]
        const gradientIdx = Math.abs(otherUid.split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0)) % gradients.length

        return {
          friendshipId: doc.id,
          uid: otherUid,
          strangRCode: userData?.strangRCode || 'Unknown',
          petName: petNameData?.petName || userData?.strangRCode || 'Unknown',
          phoneNumber: userData?.phoneNumber || 'Private',
          lastSeen: userData?.lastActive ? userData.lastActive.toDate() : null,
          isOnline: userData?.isOnline || false,
          avatarInitials: (userData?.strangRCode || 'XX').split('#')[1]?.substring(0, 2) || (userData?.strangRCode || 'SR').substring(0, 2),
          avatarGradient: gradients[gradientIdx],
          lastMessage: lastMessageData?.text || 'No messages yet',
          lastMessageTime: lastMessageData?.timestamp?.toDate() || data.createdAt?.toDate() || new Date(),
          unreadCount: unreadCounts.get(doc.id) || 0
        }
      } catch (err) {
        console.error(`Error processing friendship ${doc.id}:`, err)
        return null
      }
    })

    const allFriends = await Promise.all(friendsPromises)
    const validFriends = allFriends.filter((f): f is any => f !== null)

    // Deduplicate by UID (keep the one with latest activity)
    const uniqueFriendsMap = new Map<string, any>()
    validFriends.forEach(f => {
      if (!uniqueFriendsMap.has(f.uid) || f.lastMessageTime > uniqueFriendsMap.get(f.uid).lastMessageTime) {
        uniqueFriendsMap.set(f.uid, f)
      }
    })

    res.status(200).json(Array.from(uniqueFriendsMap.values()))
  } catch (error) {
    console.error('Error in getFriends:', error)
    res.status(500).json({ error: 'Failed to fetch friends list' })
  }
}

export const getMessages = async (req: AuthRequest, res: Response) => {
  try {
    const uid = req.user!.uid
    const { friendshipId } = req.params

    const friendshipDoc = await db.collection('friendships').doc(friendshipId).get()
    if (!friendshipDoc.exists || !friendshipDoc.data()?.users.includes(uid)) {
      return res.status(403).json({ error: 'Unauthorized to see these messages' })
    }

    const messagesSnapshot = await db.collection('friendships')
      .doc(friendshipId)
      .collection('messages')
      .orderBy('timestamp', 'asc')
      .get()

    const messages: ChatMessage[] = messagesSnapshot.docs.map(doc => {
      const data = doc.data()
      return {
        id: doc.id,
        text: data.text,
        senderId: data.senderId,
        recipientId: data.recipientId,
        timestamp: data.timestamp.toDate(),
        clientMsgId: data.clientMsgId,
        status: data.status
      }
    })

    // FETCH FROM SUPABASE
    const { data: supabaseMsgs, error: supabaseError } = await supabase
      .from('messages')
      .select('*')
      .eq('friendship_id', friendshipId)
      .order('created_at', { ascending: true })

    if (supabaseMsgs) {
      supabaseMsgs.forEach((m: any) => {
        // Only push if not already in messages (e.g. if we sync to both during transition)
        if (!messages.find(fm => fm.clientMsgId === m.client_msg_id)) {
          messages.push({
            id: m.id,
            text: m.text, // Corrected from m.content
            senderId: m.sender_id,
            recipientId: m.recipient_id,
            timestamp: m.created_at,
            clientMsgId: m.client_msg_id,
            status: m.status
          })
        }
      })
    }

    // Sort combined
    messages.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())

    res.status(200).json(messages)
  } catch (error) {
    console.error('Error in getMessages:', error)
    res.status(500).json({ error: 'Failed to fetch messages' })
  }
}

export const getFriendChatDetails = async (req: AuthRequest, res: Response) => {
  try {
    const uid = req.user!.uid
    const { friendshipId } = req.params

    let currentFriendshipDoc = await db.collection('friendships').doc(friendshipId).get()
    
    if (!currentFriendshipDoc.exists || currentFriendshipDoc.data()?.status !== 'active') {
      return res.status(404).json({ error: 'Bond disconnected' })
    }

    const friendshipData = currentFriendshipDoc.data()
    const users = friendshipData?.users || []
    
    if (!users.includes(uid)) {
      return res.status(403).json({ error: 'Unauthorized to see this chat' })
    }

    const otherUid = users.find((id: string) => id !== uid)

    // --- AGGRESSIVE DEDUPLICATION ---
    // Check if there are OTHER active friendships between these same two users
    const duplicatesSnapshot = await db.collection('friendships')
      .where('users', 'array-contains', uid)
      .where('status', '==', 'active')
      .get()
    
    const allMatchingFriendships = duplicatesSnapshot.docs.filter(doc => 
      doc.data().users.includes(otherUid) && doc.id !== friendshipId
    )

    if (allMatchingFriendships.length > 0) {
      console.log(`Found ${allMatchingFriendships.length} duplicate friendships for users ${uid} and ${otherUid}`)
      // In a real production app, we would move all messages to the newest friendshipId
      // For now, let's just make sure both users use the same ID by consistently picking one (e.g., the alphabetically first ID)
      // Actually, let's just merge their message lists for the UI
    }

    const userDoc = await db.collection('users').doc(otherUid).get()
    const userData = userDoc.data()

    // Get messages from CURRENT friendship
    const messagesSnapshot = await db.collection('friendships')
      .doc(friendshipId)
      .collection('messages')
      .orderBy('timestamp', 'asc')
      .get()

    const messages: ChatMessage[] = messagesSnapshot.docs.map(doc => {
      const data = doc.data()
      return {
        id: doc.id,
        text: data.text,
        senderId: data.senderId,
        recipientId: data.recipientId,
        timestamp: data.timestamp.toDate ? data.timestamp.toDate() : data.timestamp,
        clientMsgId: data.clientMsgId,
        status: data.status
      }
    })

    // FETCH FROM SUPABASE
    const { data: supabaseMsgs, error: supabaseError } = await supabase
      .from('messages')
      .select('*')
      .eq('friendship_id', friendshipId)
      .order('created_at', { ascending: true })
    
    if (supabaseMsgs) {
      supabaseMsgs.forEach((m: any) => {
        if (!messages.find(fm => fm.clientMsgId === m.client_msg_id)) {
          messages.push({
            id: m.id,
            text: m.text, // Corrected from m.content
            senderId: m.sender_id,
            recipientId: m.recipient_id,
            timestamp: m.created_at,
            clientMsgId: m.client_msg_id,
            status: m.status
          })
        }
      })
    }

    // If there were duplicates, also fetch THEIR messages to avoid "missing history"
    for (const dup of allMatchingFriendships) {
      const dupMsgs = await db.collection('friendships').doc(dup.id).collection('messages').get()
      dupMsgs.docs.forEach(doc => {
        const data = doc.data()
        messages.push({
          id: doc.id,
          text: data.text,
          senderId: data.senderId,
          recipientId: data.recipientId,
          timestamp: data.timestamp.toDate ? data.timestamp.toDate() : data.timestamp,
          clientMsgId: data.clientMsgId,
          status: data.status
        })
      })
    }

    // Sort combined messages
    messages.sort((a, b) => {
      const ta = new Date(a.timestamp).getTime()
      const tb = new Date(b.timestamp).getTime()
      return ta - tb
    })

    const friendInfo = {
      uid: otherUid,
      strangRCode: userData?.strangRCode || 'Unknown',
      isOnline: userData?.isOnline || false,
      lastSeen: userData?.lastActive ? userData.lastActive.toDate() : null,
      phoneNumber: userData?.phoneNumber || 'Private',
    }

    res.status(200).json({
      friend: friendInfo,
      messages: messages
    })
  } catch (error) {
    console.error('Error in getFriendChatDetails:', error)
    res.status(500).json({ error: 'Failed to fetch chat details' })
  }
}
