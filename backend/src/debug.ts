
import express from 'express'
import http from 'http'
import { Server } from 'socket.io'

const app = express()
const server = http.createServer(app)
const io = new Server(server)

io.on('connection', (socket) => {
  console.log('Test connection successful')
})

server.listen(3001, () => {
  console.log('DEBUG SERVER ON 3001')
})
