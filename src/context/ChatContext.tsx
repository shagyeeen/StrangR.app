'use client'

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { Socket } from 'socket.io-client'
import { connectSocket, disconnectSocket } from '@/lib/socket'
import { SOCKET_EVENTS } from '@/config/constants'
import { Message, Stranger, ChatState } from '@/types'
import { useAuthContext } from './AuthContext'

interface ChatContextType {
  chatState: ChatState
  socket: Socket | null
  sendMessage: (text: string) => void
  startMatching: () => void
  skipStranger: () => void
  reportStranger: (reason?: string) => void
  sendConnectionRequest: () => void
  acceptConnection: (connectionId: string) => void
  declineConnection: (connectionId: string) => void
  resetChat: () => void
}

const defaultChatState: ChatState = {
  currentMatch: null,
  messages: [],
  isTyping: false,
  connectionStatus: 'idle',
  connectionId: null,
  friendshipId: null,
}

const ChatContext = createContext<ChatContextType | null>(null)

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const { token, isAuthenticated } = useAuthContext()
  const [chatState, setChatState] = useState<ChatState>(defaultChatState)
  const [socket, setSocket] = useState<Socket | null>(null)

  useEffect(() => {
    if (isAuthenticated && token) {
      const s = connectSocket(token)
      setSocket(s)

      // Listen for events
      s.on(SOCKET_EVENTS.NEW_MATCH, (stranger: Stranger) => {
        setChatState(prev => ({
          ...prev,
          currentMatch: stranger,
          messages: [],
          connectionStatus: 'chatting',
          connectionId: null,
          friendshipId: null,
          isTyping: false,
        }))
      })

      s.on(SOCKET_EVENTS.RECEIVE_MESSAGE, (message: Message) => {
        setChatState(prev => ({
          ...prev,
          messages: [...prev.messages, message],
        }))
      })

      s.on(SOCKET_EVENTS.USER_TYPING, () => {
        setChatState(prev => ({ ...prev, isTyping: true }))
      })

      s.on(SOCKET_EVENTS.USER_STOPPED_TYPING, () => {
        setChatState(prev => ({ ...prev, isTyping: false }))
      })

      s.on(SOCKET_EVENTS.MATCH_SKIPPED_YOU, () => {
        setChatState(prev => ({
          ...prev,
          currentMatch: null,
          messages: [],
          connectionStatus: 'matching',
          connectionId: null,
          isTyping: false,
        }))
      })

      s.on(SOCKET_EVENTS.CONNECTION_REQUEST_RECEIVED, ({ connectionId }: { connectionId: string }) => {
        setChatState(prev => ({
          ...prev,
          connectionId,
          connectionStatus: 'pending_connection',
        }))
      })

      s.on(SOCKET_EVENTS.CONNECTION_ACCEPTED, ({ friendshipId }: { friendshipId: string }) => {
        setChatState(prev => ({
          ...prev,
          connectionStatus: 'friends',
          friendshipId,
        }))
      })

      s.on(SOCKET_EVENTS.CONNECTION_EXPIRED, () => {
        setChatState(prev => ({
          ...prev,
          connectionId: null,
          connectionStatus: 'chatting',
        }))
      })

      return () => {
        s.off(SOCKET_EVENTS.NEW_MATCH)
        s.off(SOCKET_EVENTS.RECEIVE_MESSAGE)
        s.off(SOCKET_EVENTS.USER_TYPING)
        s.off(SOCKET_EVENTS.USER_STOPPED_TYPING)
        s.off(SOCKET_EVENTS.MATCH_SKIPPED_YOU)
        s.off(SOCKET_EVENTS.CONNECTION_REQUEST_RECEIVED)
        s.off(SOCKET_EVENTS.CONNECTION_ACCEPTED)
        s.off(SOCKET_EVENTS.CONNECTION_EXPIRED)
        disconnectSocket()
      }
    }
  }, [isAuthenticated, token])

  const sendMessage = useCallback((text: string) => {
    if (!socket || !chatState.currentMatch) return
    const message: Partial<Message> = {
      id: Date.now().toString(),
      senderId: 'me',
      text,
      timestamp: new Date(),
      readBy: [],
    }
    socket.emit(SOCKET_EVENTS.SEND_MESSAGE, { recipientId: chatState.currentMatch.uid, message })
    setChatState(prev => ({
      ...prev,
      messages: [...prev.messages, message as Message],
    }))
  }, [socket, chatState.currentMatch])

  const startMatching = useCallback(() => {
    if (!socket) return
    setChatState(prev => ({ ...prev, connectionStatus: 'matching', currentMatch: null, messages: [] }))
    socket.emit(SOCKET_EVENTS.START_MATCHING, {})
  }, [socket])

  const skipStranger = useCallback(() => {
    if (!socket || !chatState.currentMatch) return
    socket.emit(SOCKET_EVENTS.SKIP_STRANGER, { strangerId: chatState.currentMatch.uid })
    setChatState(prev => ({ ...prev, currentMatch: null, messages: [], connectionStatus: 'matching', isTyping: false }))
  }, [socket, chatState.currentMatch])

  const reportStranger = useCallback((reason?: string) => {
    if (!socket || !chatState.currentMatch) return
    socket.emit(SOCKET_EVENTS.REPORT_STRANGER, { strangerId: chatState.currentMatch.uid, reason })
  }, [socket, chatState.currentMatch])

  const sendConnectionRequest = useCallback(() => {
    if (!socket || !chatState.currentMatch) return
    socket.emit(SOCKET_EVENTS.SEND_CONNECTION_REQUEST, { strangerId: chatState.currentMatch.uid })
    setChatState(prev => ({ ...prev, connectionStatus: 'pending_connection' }))
  }, [socket, chatState.currentMatch])

  const acceptConnection = useCallback((connectionId: string) => {
    if (!socket) return
    socket.emit(SOCKET_EVENTS.ACCEPT_CONNECTION, { connectionId })
  }, [socket])

  const declineConnection = useCallback((connectionId: string) => {
    if (!socket) return
    socket.emit(SOCKET_EVENTS.DECLINE_CONNECTION, { connectionId })
    setChatState(prev => ({ ...prev, connectionStatus: 'chatting', connectionId: null }))
  }, [socket])

  const resetChat = useCallback(() => {
    setChatState(defaultChatState)
  }, [])

  return (
    <ChatContext.Provider value={{
      chatState, socket, sendMessage, startMatching, skipStranger,
      reportStranger, sendConnectionRequest, acceptConnection, declineConnection, resetChat,
    }}>
      {children}
    </ChatContext.Provider>
  )
}

export function useChatContext() {
  const ctx = useContext(ChatContext)
  if (!ctx) throw new Error('useChatContext must be used inside ChatProvider')
  return ctx
}
