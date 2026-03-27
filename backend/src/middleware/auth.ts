import { Request, Response, NextFunction } from 'express'
import { auth } from '../config/firebase'

export interface AuthRequest extends Request {
  user?: import('firebase-admin/auth').DecodedIdToken
}

export const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing or invalid token' })
  }

  const token = authHeader.split('Bearer ')[1]
  try {
    const decodedToken = await auth.verifyIdToken(token)
    req.user = decodedToken
    next()
  } catch (error) {
    console.error('Auth middleware error:', error)
    res.status(401).json({ error: 'Unauthorized: Token verification failed' })
  }
}
