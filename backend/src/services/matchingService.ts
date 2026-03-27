import { Socket } from 'socket.io'
import { db } from '../config/firebase'

interface QueueUser {
  uid: string
  socket: Socket
  joinedAt: number
}

export class MatchingService {
  private queue: QueueUser[] = []

  addToQueue(uid: string, socket: Socket) {
    // Avoid duplicates
    if (this.queue.some(u => u.uid === uid)) return

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

    // Simply take the first two members from the queue
    const userA = this.queue.shift()!
    let userB = this.queue.shift()!

    // Prevent matching someone on each other's denial list (basic implementation)
    // For MVP, we will assume simple matching, but we could re-insert B into queue and pop the next user if denied.

    console.log(`Matched ${userA.uid} and ${userB.uid}`)

    try {
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

    } catch (error) {
      console.error('Error during match retrieval:', error)
      // re-queue
      this.addToQueue(userA.uid, userA.socket)
      this.addToQueue(userB.uid, userB.socket)
    }

    // Attempt recursive matching if there are more people
    if (this.queue.length >= 2) {
      this.tryMatch()
    }
  }
}
