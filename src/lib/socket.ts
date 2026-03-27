// Socket.io client singleton
import { io, Socket } from 'socket.io-client'
import { SOCKET_URL } from '@/config/constants'

let socket: Socket | null = null

export function getSocket(token?: string): Socket {
  if (!socket) {
    socket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      autoConnect: false,
    })
  }
  return socket
}

export function connectSocket(token: string): Socket {
  const s = getSocket(token)
  if (!s.connected) {
    s.auth = { token }
    s.connect()
  }
  return s
}

export function disconnectSocket(): void {
  if (socket?.connected) {
    socket.disconnect()
    socket = null
  }
}

export default getSocket
