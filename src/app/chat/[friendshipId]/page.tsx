'use client'

import { useEffect, Suspense, useState } from 'react'
import { Header } from '@/components/Navigation/Header'
import { Footer } from '@/components/Navigation/Footer'
import { MessageList } from '@/components/Chat/MessageList'
import { MessageInput } from '@/components/Chat/MessageInput'
import { useChatContext } from '@/context/ChatContext'
import { useAuthContext } from '@/context/AuthContext'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, User, Phone, Shield, Sparkles, HeartOff } from 'lucide-react'

function ChatContent() {
  const { friendshipId } = useParams()
  const { chatState, loadFriendChat, resetChat } = useChatContext()
  const { user, isAuthenticated, isLoading } = useAuthContext()
  const router = useRouter()
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    let active = true
    async function initChat() {
      if (active && friendshipId && typeof friendshipId === 'string') {
        console.log('--- PAGE: Initializing Chat ---', friendshipId)
        await loadFriendChat(friendshipId)
        if (active) setIsReady(true)
      }
    }
    initChat()
    return () => {
      active = false
      // Only reset if we are navigating AWAY from chats entirely, 
      // not just re-rendering this component
      console.log('--- PAGE: Unmounting Chat ---')
      resetChat()
    }
  }, [friendshipId, loadFriendChat, resetChat])

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login')
    }
  }, [isAuthenticated, isLoading, router])

  if (!isReady && chatState.connectionStatus !== 'disconnected') {
    return (
      <div className="flex flex-col h-screen overflow-hidden bg-[#0e0e0e] text-white font-sans items-center justify-center">
        <LoadingAnimation />
      </div>
    )
  }

  const friend = chatState.currentMatch
  const isDisconnected = chatState.connectionStatus === 'disconnected'

  // If not ready and not disconnected, show loading
  if (!isReady && !isDisconnected) {
    return (
      <div className="flex flex-col h-screen overflow-hidden bg-[#0e0e0e] text-white font-sans items-center justify-center">
        <LoadingAnimation />
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#0e0e0e] text-white font-sans selection:bg-[#f6b7f6]/20">
      <main className="flex-1 w-full flex flex-col overflow-hidden">
        <div 
          className="bg-[#0a0a0a] overflow-hidden shadow-2xl h-full flex flex-col relative"
          style={{ 
            backgroundImage: 'url("/images/chat_wallpaper.png")',
            backgroundSize: '400px',
            backgroundRepeat: 'repeat'
          }}
        >
          {/* Background Dimmer */}
          <div className="absolute inset-0 bg-black/60 pointer-events-none z-0" />
          
          {/* Private Chat Header */}
          <div className="px-6 py-4 border-b border-white/5 bg-black flex items-center justify-between relative z-10">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => router.push('/friends')}
                className="p-2 rounded-full hover:bg-white/5 text-white/40 hover:text-white transition-all transform hover:-translate-x-1"
              >
                <ArrowLeft size={20} />
              </button>
              
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-pink-500/20 to-purple-600/20 border border-white/10 flex items-center justify-center overflow-hidden">
                    <User size={20} className="text-[#f6b7f6]" />
                  </div>
                  {friend?.isOnline && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-[#0a0a0a]" />
                  )}
                </div>
                
                <div>
                  <h3 className="text-sm font-bold tracking-tight text-white flex items-center gap-2 uppercase tracking-wide">
                    {friend?.strangRCode || 'Bonded Friend'}
                    <Sparkles size={12} className="text-[#f6b7f6]" />
                  </h3>
                  <p className="text-[10px] text-[#f6b7f6]/60 uppercase tracking-widest font-bold">
                    {friend?.isOnline ? (
                      <span className="text-green-400 font-black animate-pulse">Active Now</span>
                    ) : (
                      <span>{friend?.lastSeen ? `Last seen ${formatLastSeen(friend.lastSeen)}` : 'Encrypted bond'}</span>
                    )}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <div className="flex items-center gap-1 group cursor-pointer p-2 rounded-full hover:bg-white/5 transition-all">
                <Shield size={16} className="text-white/30 group-hover:text-[#f6b7f6]" />
                <span className="text-[9px] uppercase tracking-tighter text-white/20 group-hover:text-white/40 font-bold hidden sm:inline">P2P Secure</span>
              </div>
            </div>
          </div>

          {/* Message List Area */}
          <div className="flex-1 min-h-0 relative flex flex-col">
             <MessageList 
                onSwipeLeft={() => {}} 
                onSwipeRight={() => {}} 
                onStartMatch={() => router.push('/dashboard')}
                isPrivate
             />
          </div>

          {/* Message Input Area */}
          <MessageInput />

          {/* Disconnected Overlay */}
          {chatState.connectionStatus === 'disconnected' && (
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
              <div className="text-center p-12 rounded-3xl border border-red-500/20 bg-[#080808] shadow-2xl max-w-sm mx-auto">
                <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-6 text-red-500">
                  <HeartOff size={40} />
                </div>
                <h2 className="text-2xl font-black text-white uppercase tracking-tighter mb-4 italic">Bond Disconnected</h2>
                <p className="text-white/40 text-xs font-bold uppercase tracking-[0.2em] mb-8 leading-loose">This strangr has severed the connection or is no longer in your circle.</p>
                <button 
                  onClick={() => router.push('/friends')}
                  className="w-full px-8 py-4 rounded-full bg-white text-black font-black uppercase tracking-widest text-[10px] hover:bg-[#f6b7f6] transition-all hover:scale-105 active:scale-95"
                >
                  Return to Circle
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

function formatLastSeen(date: Date | string) {
  if (!date) return ''
  const d = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diffInMins = Math.floor((now.getTime() - d.getTime()) / 60000)
  
  if (diffInMins < 1) return 'just now'
  if (diffInMins < 60) return `${diffInMins}m ago`
  if (diffInMins < 1440) return `${Math.floor(diffInMins / 60)}h ago`
  return d.toLocaleDateString()
}

function LoadingAnimation() {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-2 border-[#f6b7f6]/20 border-t-[#f6b7f6] rounded-full animate-spin" />
      <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#f6b7f6]/60 animate-pulse">Initializing Private Line...</p>
    </div>
  )
}

export default function PrivateChatPage() {
  return (
    <Suspense fallback={<div className="h-screen bg-[#0e0e0e] flex items-center justify-center text-[#f6b7f6]"><LoadingAnimation /></div>}>
      <ChatContent />
    </Suspense>
  )
}
