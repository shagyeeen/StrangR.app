import express from 'express'
import http from 'http'
import { Server as SocketIOServer } from 'socket.io'
import cors from 'cors'
import * as dotenv from 'dotenv'
import { setupSocketHandlers } from './socket/handlers'
import { authMiddleware } from './middleware/auth'

import userRoutes from './routes/users'
import premiumRoutes from './routes/premium'

dotenv.config()

const app = express()
app.use(express.json())
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
}))

const server = http.createServer(app)

const io = new SocketIOServer(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true
  }
})

// basic health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() })
})

// API Routes
app.use('/api/users', userRoutes)
app.use('/api/premium', premiumRoutes)

// Setup socket io connections
setupSocketHandlers(io)

const PORT = process.env.PORT || 3001
server.listen(PORT, () => {
  console.log(`StrangR backend running on port ${PORT}`)
})
