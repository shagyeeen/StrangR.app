import { Request, Response } from 'express'
import { db } from '../config/firebase'
import { AuthRequest } from '../middleware/auth'

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
