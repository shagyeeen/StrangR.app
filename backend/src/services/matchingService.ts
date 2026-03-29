import { Socket } from 'socket.io'
import { db } from '../config/firebase'
import { supabase } from '../config/supabase'

interface QueueUser {
  uid: string
  socket: Socket
  joinedAt: number
}

export class MatchingService {
  private queue: QueueUser[] = []

  addToQueue(uid: string, socket: Socket) {
    // Avoid double-queuing EXACT same socket
    if (this.queue.some(u => u.socket.id === socket.id)) return

    // If same user joins from another tab, remove the old one first
    this.queue = this.queue.filter(u => u.uid !== uid)

    this.queue.push({ uid, socket, joinedAt: Date.now() })
    console.log(`User ${uid} joined queue. Queue length: ${this.queue.length}`)
    
    // Sort by longest waiting
    this.queue.sort((a, b) => a.joinedAt - b.joinedAt)

    this.tryMatch()
  }

  removeFromQueue(uid: string) {
    this.queue = this.queue.filter(u => u.uid !== uid)
  }

  private async tryMatch() {
    if (this.queue.length < 2) return

    // Simply take the first member from the queue
    const userA = this.queue.shift()!
    
    try {
      // 1. Fetch current active friends - manual filter for maximum reliability/speed
      const friendUids = new Set<string>()
      
      try {
        const friendshipSnapshot = await db.collection('friendships')
          .where('users', 'array-contains', userA.uid)
          .get()
        
        friendshipSnapshot.docs.forEach(doc => {
          const data = doc.data()
          // ONLY skip if strictly active
          if (data.status === 'active') {
            const uids = data.users as string[]
            uids.forEach(id => {
              if (id !== userA.uid) friendUids.add(id)
            })
          }
        })
      } catch (err) {
        console.warn('MatchingService: Firestore friend check failed', err)
      }

      console.log(`MatchingService: User ${userA.uid} matches ${friendUids.size} active friends to skip.`)

      const matchIndex = this.queue.findIndex(u => u.uid !== userA.uid && !friendUids.has(u.uid))
      
      if (matchIndex === -1) {
        // No valid partners yet. To avoid tight loops, we push to back instead of unshift
        // This gives others a chance to join and provides a natural delay
        this.queue.push(userA)
        console.log(`MatchingService: No match for ${userA.uid}, moving to back of queue.`)
        return
      }

      const userB = this.queue.splice(matchIndex, 1)[0]

      console.log(`Matched ${userA.uid} and ${userB.uid}`)

      // Get base user data containing StrangR Codes
      const [docA, docB] = await Promise.all([
        db.collection('users').doc(userA.uid).get(),
        db.collection('users').doc(userB.uid).get()
      ])

      const strangrCodeA = docA.data()?.strangRCode || 'StrangR#XXXX'
      const strangrCodeB = docB.data()?.strangRCode || 'StrangR#XXXX'

      // Notify User A
      userA.socket.emit('new_match', {
        uid: userB.uid,
        strangRCode: strangrCodeB,
        roomId: `room_${userA.uid}_${userB.uid}`,
        isOnline: true
      })

      // Notify User B
      userB.socket.emit('new_match', {
        uid: userA.uid,
        strangRCode: strangrCodeA,
        roomId: `room_${userA.uid}_${userB.uid}`,
        isOnline: true
      })

      // Attempt recursive matching if there are more people
      if (this.queue.length >= 2) {
        setImmediate(() => this.tryMatch())
      }
    } catch (error) {
      console.error('Error during match retrieval:', error)
      // re-queue User A at the back to try again later
      this.queue.push(userA)
    }
  }
}
