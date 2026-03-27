import { Router } from 'express'
import { authMiddleware } from '../middleware/auth'
import { getMe, updatePetName, generateNewCode } from '../controllers/userController'

const router = Router()

// All user routes require authentication
router.use(authMiddleware)

router.get('/me', getMe)
router.post('/code', generateNewCode)
router.patch('/friends/:friendshipId/petname', updatePetName)

export default router
