'use client'

import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react'
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
  stopMatching: () => void
  skipStranger: () => void
  reportStranger: (reason?: string) => void
  sendConnectionRequest: () => void
  acceptConnection: (connectionId: string) => void
  declineConnection: (connectionId: string) => void
  resetChat: () => void
  loadFriendChat: (friendshipId: string) => Promise<void>
  disconnectFriendship: (friendshipId: string) => void
  hideConnectionProposal: () => void
}

const defaultChatState: ChatState = {
  currentMatch: null,
  messages: [],
  isTyping: false,
  connectionStatus: 'idle',
  connectionId: null,
  friendshipId: null,
  hasSentRequest: false,
  hasReceivedRequest: false,
}

const ChatContext = createContext<ChatContextType | null>(null)

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const { token, isAuthenticated, user } = useAuthContext()
  const [chatState, setChatState] = useState<ChatState>(defaultChatState)
  const [socket, setSocket] = useState<Socket | null>(null)
  // Use a ref to always have the latest state in socket listeners without re-binding them
  const stateRef = useRef(chatState)
  const roomRef = useRef<string | null>(null) // Track the currently joined socket room

  useEffect(() => {
    stateRef.current = chatState
  }, [chatState])

  useEffect(() => {
    if (isAuthenticated && token) {
      const s = connectSocket(token)
      setSocket(s)

      // Listen for events
      s.on(SOCKET_EVENTS.NEW_MATCH, (stranger: Stranger) => {
        // Defensive: Don't overwrite if we are already in an active friend chat
        if (stateRef.current.connectionStatus === 'friends') {
          console.log('Socket: Ignoring NEW_MATCH while in friend chat')
          return
        }
        
        // Play connected sound
        try {
          const audio = new Audio('/sounds/connected.mp3')
          audio.volume = 0.5
          audio.play().catch(e => console.log('Audio autoplay blocked', e))
        } catch(e) {}

        setChatState({
          ...defaultChatState,
          currentMatch: {
            ...stranger,
            lastSeen: new Date().toISOString()
          },
          connectionStatus: 'chatting',
        })
      })

      s.on(SOCKET_EVENTS.RECEIVE_MESSAGE, (msg: Message & { friendshipId?: string }) => {
        console.log('--- SOCKET: RECEIVE_MESSAGE ---', msg.text, msg.id, msg.friendshipId)

        // Automatically signal delivery if this is NOT from us
        if (msg.senderId !== user?.uid) {
          // Play message sound
          try {
            const audio = new Audio('/sounds/message.mp3')
            audio.volume = 0.5
            audio.play().catch(e => console.log('Audio autoplay blocked', e))
          } catch(e) {}

          s.emit('message_status_update', { 
            messageId: msg.id, 
            clientMsgId: msg.clientMsgId,
            friendshipId: msg.friendshipId, 
            recipientId: msg.senderId, // Always notify the sender back!
            status: 'delivered' 
          })

          // If we ARE in this chat right now, signal as read too
          const currentRoomId = stateRef.current.friendshipId || stateRef.current.currentMatch?.uid
          if (currentRoomId === (msg.friendshipId || msg.senderId)) {
            s.emit('message_status_update', { 
              friendshipId: msg.friendshipId, 
              recipientId: msg.senderId,
              status: 'read' 
            })
          }
        }
        
        setChatState(prev => {
          // 1. SECURITY: Only add if this message belongs to the current active chat room/friendship
          const currentActiveId = prev.friendshipId || prev.connectionId
          
          if (prev.connectionStatus === 'friends' && msg.friendshipId !== prev.friendshipId) {
             console.log('Socket: Message for a different friendship ignored')
             return prev
          }
          
          if (prev.connectionStatus === 'chatting' && msg.senderId !== prev.currentMatch?.uid) {
             console.log('Socket: Message for a different random match ignored')
             return prev
          }

          // 2. DEDUPLICATION & UPDATING
          const isDuplicate = prev.messages.some(m => 
            m.id === msg.id || 
            (msg.clientMsgId && (m.id === msg.clientMsgId || m.clientMsgId === msg.clientMsgId))
          )
          
          if (isDuplicate) {
            console.log('Socket: Updating existing message', msg.id)
            return {
              ...prev,
              messages: prev.messages.map(m => 
                (m.id === msg.id || (msg.clientMsgId && (m.id === msg.clientMsgId || m.clientMsgId === msg.clientMsgId)))
                ? { ...m, ...msg, status: 'sent' }
                : m
              )
            }
          }

          return {
            ...prev,
            messages: [...prev.messages, msg],
            isTyping: false
          }
        })
      })

      s.on('friend_online', (friendId: string) => {
        setChatState(prev => {
          if (prev.currentMatch?.uid === friendId) {
            return {
              ...prev,
              currentMatch: { ...prev.currentMatch, isOnline: true }
            }
          }
          return prev
        })
      })

      s.on('friend_offline', (friendId: string) => {
        setChatState(prev => {
          if (prev.currentMatch?.uid === friendId) {
            return {
              ...prev,
              currentMatch: { 
                ...prev.currentMatch, 
                isOnline: false,
                lastSeen: new Date().toISOString()
              }
            }
          }
          return prev
        })
      })

      s.on('message_status_changed', (data: { messageId?: string, clientMsgId?: string, friendshipId?: string, recipientId?: string, status: string, updaterId: string }) => {
        if (data.updaterId === user?.uid) return // Ignore own updates
        
        console.log('Socket: Status changed', data)
        setChatState(prev => {
          // Check if it belongs to current conversation
          const isFriendshipMatch = data.friendshipId && prev.friendshipId === data.friendshipId
          // If updater is our current match, it belongs to this conversation (even for random chats)
          const isStrangerMatch = !data.friendshipId && prev.currentMatch && data.updaterId === prev.currentMatch.uid
          
          if (!isFriendshipMatch && !isStrangerMatch) return prev
          
          return {
            ...prev,
            messages: prev.messages.map(m => {
              // Mark all our sent messages as read if the partner opened/read the chat
              if (data.status === 'read' && m.senderId === user?.uid) {
                return { ...m, status: 'read' }
              }
              // Mark specific message as delivered
              const isMatch = (data.messageId && m.id === data.messageId) || 
                             (data.clientMsgId && m.clientMsgId === data.clientMsgId) ||
                             (data.messageId && (m.clientMsgId === data.messageId || m.id === data.clientMsgId))
                             
              if (data.status === 'delivered' && isMatch) {
                return { ...m, status: 'delivered' }
              }
              return m
            })
          }
        })
      })

       s.on('message_sent', (msg: Message) => {
        console.log('Socket: Delivery confirmed', msg)
        setChatState(prev => {
           // Replace optimistic message or update its status
           const exists = prev.messages.some(m => m.id === msg.id || (msg.clientMsgId && m.id === msg.clientMsgId))
           if (exists) {
             return {
               ...prev,
               messages: prev.messages.map(m => 
                 (m.id === msg.id || (msg.clientMsgId && m.id === msg.clientMsgId)) 
                 ? { ...m, ...msg, status: 'sent' } 
                 : m
               )
             }
           }
           return { ...prev, messages: [...prev.messages, msg] }
        })
      })

      s.on('friend_online', (friendUid: string) => {
        setChatState(prev => {
          if (prev.currentMatch?.uid === friendUid) {
            return { ...prev, currentMatch: { ...prev.currentMatch, isOnline: true } }
          }
          return prev
        })
      })

      s.on('friend_offline', (friendUid: string) => {
        setChatState(prev => {
          if (prev.currentMatch?.uid === friendUid) {
            return { ...prev, currentMatch: { ...prev.currentMatch, isOnline: false } }
          }
          return prev
        })
      })

      s.on(SOCKET_EVENTS.USER_TYPING, (data: any) => {
        // Only show typing if it's from our current partner
        if (data?.senderId === stateRef.current.currentMatch?.uid) {
          setChatState(prev => ({ ...prev, isTyping: true }))
        }
      })

      s.on(SOCKET_EVENTS.USER_STOPPED_TYPING, (data: any) => {
        if (data?.senderId === stateRef.current.currentMatch?.uid) {
          setChatState(prev => ({ ...prev, isTyping: false }))
        }
      })

      s.on(SOCKET_EVENTS.MATCH_SKIPPED_YOU, () => {
        setChatState(prev => ({
          ...prev,
          currentMatch: null,
          messages: [],
          connectionStatus: 'matching',
          isTyping: false,
        }))
      })

      s.on(SOCKET_EVENTS.CONNECTION_REQUEST_RECEIVED, ({ connectionId }: { connectionId: string }) => {
        setChatState(prev => {
          // If we already sent a request, this is a mutual match! Auto-accept
          if (prev.hasSentRequest) {
            console.log('Mutual connection detected, auto-accepting...')
            s.emit(SOCKET_EVENTS.ACCEPT_CONNECTION, { 
              connectionId, 
              requesterId: prev.currentMatch?.uid 
            })
          }
          // Record the connectionId regardless so we can accept it if we click later
          return { ...prev, connectionId, hasReceivedRequest: true }
        })
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
      
      s.on('bond_disconnected', ({ friendshipId }: { friendshipId: string }) => {
        console.log('Socket: Bond disconnected', friendshipId)
        setChatState(prev => {
          if (prev.friendshipId === friendshipId) {
            return {
              ...prev,
              connectionStatus: 'disconnected',
              hasSentRequest: false,
              hasReceivedRequest: false,
              connectionId: null
            }
          }
          return prev
        })
      })

      return () => {
        s.off(SOCKET_EVENTS.NEW_MATCH)
        s.off(SOCKET_EVENTS.RECEIVE_MESSAGE)
        s.off('message_status_changed')
        s.off('message_sent')
        s.off(SOCKET_EVENTS.USER_TYPING)
        s.off(SOCKET_EVENTS.USER_STOPPED_TYPING)
        s.off(SOCKET_EVENTS.MATCH_SKIPPED_YOU)
        s.off(SOCKET_EVENTS.CONNECTION_REQUEST_RECEIVED)
        s.off(SOCKET_EVENTS.CONNECTION_ACCEPTED)
        s.off(SOCKET_EVENTS.CONNECTION_EXPIRED)
        s.off('bond_disconnected')
        s.off('friend_online')
        s.off('friend_offline')
        disconnectSocket()
      }
    }
  }, [isAuthenticated, token])

  // Reactively join chat rooms when socket AND state are ready
  const lastJoinedSocketRef = useRef<Socket | null>(null)

  useEffect(() => {
    const friendshipId = chatState.friendshipId
    const targetRoom = friendshipId || chatState.connectionId
    
    if (socket && user && targetRoom) {
      // Re-join if the socket instance changed OR the room ID changed
      if (roomRef.current === targetRoom && lastJoinedSocketRef.current === socket) return

      console.log(`Socket: Join triggered for room: ${targetRoom} (Socket ID: ${socket.id})`)
      if (friendshipId && chatState.currentMatch) {
         socket.emit('join_private_chat', { 
           otherUid: chatState.currentMatch.uid, 
           friendshipId: friendshipId 
         })
      } else if (chatState.connectionId) {
         // joining a match room
         socket.emit('join_room', chatState.connectionId)
      }
      
      roomRef.current = targetRoom
      lastJoinedSocketRef.current = socket
    }
  }, [socket, user, chatState.friendshipId, chatState.connectionId, chatState.currentMatch?.uid])

  const sendMessage = useCallback((text: string) => {
    console.log('--- CONTEXT: sendMessage called ---', text)
    if (!socket || !user || !stateRef.current.currentMatch) {
      console.warn('CONTEXT: Aborting sendMessage - missing dependencies', { 
        hasSocket: !!socket, 
        hasUser: !!user, 
        hasMatch: !!stateRef.current.currentMatch 
      })
      return
    }

    const clientMsgId = `cmsg_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`
    const message: Message = {
      id: clientMsgId, // Use as temp ID
      text: text.trim(),
      senderId: user.uid,
      timestamp: new Date().toISOString(),
      status: 'sending',
      clientMsgId
    }

    // Add to UI immediately
    setChatState(prev => ({
      ...prev,
      messages: [...prev.messages, message]
    }))

    const payload = { 
      recipientId: stateRef.current.currentMatch.uid, 
      message: message.text, 
      friendshipId: stateRef.current.friendshipId,
      clientMsgId
    }

    console.log('Socket: Emitting send_message', payload)
    socket.emit(SOCKET_EVENTS.SEND_MESSAGE, payload)
  }, [socket, user])

  const startMatching = useCallback(() => {
    if (!socket) return
    setChatState(prev => ({ ...prev, connectionStatus: 'matching', currentMatch: null, messages: [] }))
    socket.emit(SOCKET_EVENTS.START_MATCHING, {})
  }, [socket])

  const stopMatching = useCallback(() => {
    if (!socket) return
    socket.emit('stop_matching', {})
    setChatState(prev => ({ ...prev, connectionStatus: 'idle' }))
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
    socket.emit(SOCKET_EVENTS.SEND_CONNECTION_REQUEST, { recipientId: chatState.currentMatch.uid })
    
    setChatState(prev => {
      // If we already received one, this is the trigger that completes it!
      if (prev.hasReceivedRequest && prev.connectionId) {
        socket.emit(SOCKET_EVENTS.ACCEPT_CONNECTION, { connectionId: prev.connectionId, requesterId: chatState.currentMatch?.uid })
      }
      return { ...prev, connectionStatus: 'proposing_connection', hasSentRequest: true }
    })
  }, [socket, chatState.currentMatch])

  const acceptConnection = useCallback((connectionId: string) => {
    if (!socket || !chatState.currentMatch) return
    socket.emit(SOCKET_EVENTS.ACCEPT_CONNECTION, { connectionId, requesterId: chatState.currentMatch.uid })
  }, [socket, chatState.currentMatch])

  const declineConnection = useCallback((connectionId: string) => {
    if (!socket || !chatState.currentMatch) return
    socket.emit(SOCKET_EVENTS.DECLINE_CONNECTION, { connectionId, requesterId: chatState.currentMatch.uid })
    setChatState(prev => ({ ...prev, connectionStatus: 'chatting', connectionId: null }))
  }, [socket, chatState.currentMatch])

  const hideConnectionProposal = useCallback(() => {
    setChatState(prev => ({ ...prev, connectionStatus: 'chatting' }))
  }, [])

  const resetChat = useCallback(() => {
    setChatState(defaultChatState)
    roomRef.current = null
  }, [])

  const loadFriendChat = useCallback(async (friendshipId: string) => {
    if (!token) return
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/friends/${friendshipId}/messages`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (res.ok) {
        const data = await res.json()
        
        if (data && data.friend) {
          const friend = data.friend
          const messages = data.messages || []
          
          setChatState({
            currentMatch: {
              uid: friend.uid,
              strangRCode: friend.strangRCode,
              isOnline: friend.isOnline,
              lastSeen: friend.lastSeen
            },
            messages,
            isTyping: false,
            connectionStatus: 'friends',
            connectionId: null,
            friendshipId: friendshipId,
            hasSentRequest: true,
            hasReceivedRequest: true,
          })

          // Mark all as read when opening
          socket?.emit('join_private_chat', { 
            friendshipId: friendshipId, 
            otherUid: friend.uid 
          })

          socket?.emit('message_status_update', { 
            friendshipId: friendshipId, 
            recipientId: friend.uid,
            status: 'read' 
          })
        }
      } else {
        // Handle failure (e.g. 404 Bond Disconnected)
        setChatState(prev => ({
          ...prev,
          connectionStatus: 'disconnected'
        }))
      }
    } catch (err) {
      console.error('Failed to load friend chat:', err)
    }
  }, [token, socket])

  const disconnectFriendship = useCallback((friendshipId: string) => {
    if (!socket) return
    console.log('Socket: Requesting bond disconnect', friendshipId)
    socket.emit('disconnect_friendship', { friendshipId })
    setChatState(prev => ({
      ...prev,
      connectionStatus: 'disconnected'
    }))
  }, [socket])
  
  return (
    <ChatContext.Provider 
      value={{ 
        chatState, socket, sendMessage, startMatching, stopMatching, skipStranger, 
        reportStranger, sendConnectionRequest, acceptConnection, declineConnection, resetChat,
        loadFriendChat, disconnectFriendship, hideConnectionProposal
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}

export function useChatContext() {
  const ctx = useContext(ChatContext)
  if (!ctx) throw new Error('useChatContext must be used inside ChatProvider')
  return ctx
}
