'use client'

import { useEffect, useRef } from 'react'
import { Message } from '@/types'
import { useChatContext } from '@/context/ChatContext'
import { useAuthContext } from '@/context/AuthContext'
import { Sparkles } from 'lucide-react'

// Custom lightweight time formatters to avoid external dependencies
function formatTime(date: Date | string): string {
  try {
    const d = typeof date === 'string' ? new Date(date) : date
    if (isNaN(d.getTime())) return ''
    return d.toLocaleTimeString(undefined, { 
      hour: 'numeric', 
      minute: '2-digit', 
      hour12: true 
    }).toUpperCase()
  } catch (err) {
    return ''
  }
}

function formatRelativeTime(date: Date | string): string {
  try {
    const d = typeof date === 'string' ? new Date(date) : date
    if (isNaN(d.getTime())) return String(date)
    
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000)
    
    if (diffInSeconds < 60) return 'Just now'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
  } catch (err) {
    return String(date)
  }
}

interface MessageListProps {
  onSwipeLeft?: () => void  // skip
  onSwipeRight?: () => void // report
  onStartMatch?: () => void // start matching
}


export function MessageList({ onSwipeLeft, onSwipeRight, onStartMatch }: MessageListProps) {
  const { chatState } = useChatContext()
  const { user } = useAuthContext()
  const { messages, isTyping, currentMatch, connectionStatus } = chatState
  const bottomRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  
  // Swipe gesture tracking
  const touchStartX = useRef<number>(0)
  const touchStartY = useRef<number>(0)

  useEffect(() => {
    const list = listRef.current
    if (!list) return

    // Determine if we are already at or very near the bottom
    // We use a threshold of 150px to be forgiving
    const isAtBottom = list.scrollHeight - list.scrollTop <= list.clientHeight + 150
    const lastMessage = messages[messages.length - 1]
    const isMyMessage = lastMessage?.senderId === user?.uid || lastMessage?.senderId === 'me'

    // Only auto-scroll if we're already at the bottom or if it's our own message
    if (isAtBottom || isMyMessage) {
      list.scrollTo({
        top: list.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, isTyping, user?.uid])

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
    touchStartY.current = e.touches[0].clientY
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchStartX.current
    const dy = e.changedTouches[0].clientY - touchStartY.current
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 80) {
      if (dx < 0) onSwipeLeft?.()   // swipe left → skip
      else onSwipeRight?.()          // swipe right → report
    }
  }

  // Matching / waiting state
  if (connectionStatus === 'idle' || connectionStatus === 'matching') {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-6 text-center px-12 relative z-10 overflow-hidden bg-[#0A0A0A]">
        {/* Animated Background Atmosphere */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[600px] h-[600px] bg-[#f6b7f6]/5 rounded-full blur-[120px] animate-pulse" />
        </div>
 
        <div className="relative">
          <div className="w-32 h-32 rounded-full flex items-center justify-center relative bg-white/5 backdrop-blur-3xl shadow-2xl border border-white/5">
             <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#f6b7f6]/40 border-r-[#f6b7f6]/40 animate-spin" />
             <div className="w-16 h-16 rounded-full bg-[#191919] flex items-center justify-center shadow-inner">
                <Sparkles size={32} className="text-[#f6b7f6] animate-pulse-slow" />
             </div>
          </div>
        </div>
        
        <div className="space-y-4 relative z-10 max-w-sm">
          <div className="flex flex-col items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#f6b7f6] opacity-60">Neural Protocol V2.1</span>
            <h3 className="text-white font-bold text-3xl tracking-tight leading-none uppercase">
              {connectionStatus === 'matching' ? 'SEARCHING FOR STRANGR' : 'GO INCOGNITO'}
            </h3>
          </div>
          <p className="text-[#555] text-xs leading-relaxed font-medium">
            {connectionStatus === 'matching' 
              ? 'Locating 14,821 active nomads within your encrypted range. Standby for secure handshake.' 
              : 'End-to-end encryption ensures every word remains between you and the void. No logs, no traces.'}
          </p>
        </div>
 
        {connectionStatus === 'idle' && (
          <button 
            onClick={onStartMatch} 
            className="group relative px-12 py-4 rounded-full bg-gradient-to-br from-[#f6b7f6] to-[#c88dc8] text-[#3c0d42] font-bold uppercase tracking-[0.2em] text-[10px] transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-[#f6b7f6]/20 flex items-center gap-4 mt-4"
          >
            SEARCH FOR STRANGR
            <div className="w-6 h-6 rounded-full bg-black/10 flex items-center justify-center group-hover:translate-x-1 transition-transform">
              →
            </div>
          </button>
        )}
      </div>
    )
  }

  if (!currentMatch) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center px-8 bg-[#0A0A0A]">
        <div className="text-[#222] text-6xl font-serif">†</div>
        <div className="text-white font-bold text-xl tracking-tight">Ready to connect?</div>
        <p className="text-[#444] text-xs uppercase tracking-widest font-bold">Start matching to penetrate the void.</p>
      </div>
    )
  }

  return (
    <div 
      ref={listRef}
      className="flex-1 overflow-y-auto px-6 lg:px-12 py-10 space-y-8 relative"
      style={{ 
        backgroundImage: 'url("/images/chat-wallpaper.png")',
        backgroundSize: '400px',
        backgroundRepeat: 'repeat',
        backgroundColor: '#0a0a0a'
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="absolute inset-0 bg-[#0A0A0A]/60 pointer-events-none" />
      
      <div className="relative z-10 flex flex-col gap-8">
        {messages.length > 0 && (
          <div className="flex items-center gap-4 my-4">
            <div className="flex-1 h-px bg-white/5" />
            <span className="text-[9px] text-[#444] uppercase font-bold tracking-[0.3em]">
              SESSION ACTIVE — {formatTime(messages[0]?.timestamp || new Date())}
            </span>
            <div className="flex-1 h-px bg-white/5" />
          </div>
        )}

        {messages.length === 0 && (
          <div className="text-center py-12 flex flex-col items-center gap-4">
            <div className="bg-[#f6b7f6]/10 border border-[#f6b7f6]/20 px-6 py-2 rounded-full mb-4">
              <p className="text-[#f6b7f6] text-[10px] uppercase font-black tracking-[0.4em] animate-pulse">STRANGR FOUND</p>
            </div>
            <div className="w-px h-8 bg-gradient-to-b from-[#f6b7f6]/40 to-transparent" />
            <p className="text-[#444] text-[10px] uppercase font-bold tracking-[0.2em]">Established initial handshake</p>
            <p className="text-[#f6b7f6]/60 text-[10px] uppercase font-bold tracking-[0.3em]">Say anything to {currentMatch.strangRCode}</p>
          </div>
        )}

        {messages.map((msg: Message, i: number) => {
          const isMe = msg.senderId === user?.uid || msg.senderId === 'me'
          return (
            <div key={msg.id || i} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} gap-1.5`}>
              {!isMe && (
                <div className="text-[9px] font-bold text-[#f6b7f6] uppercase tracking-[0.3em] ml-1 mb-0.5 opacity-60">
                  {currentMatch.strangRCode}
                </div>
              )}
              {isMe && (
                <div className="text-[9px] font-bold text-[#444] uppercase tracking-[0.3em] mr-1 mb-0.5 opacity-80 font-mono">
                  YOU
                </div>
              )}
              <div className={isMe ? 'bubble-self-premium' : 'bubble-stranger-editorial'}>
                {msg.text}
              </div>
              <div className="text-[9px] text-[#333] font-bold tracking-widest mt-0.5 font-mono">{formatTime(msg.timestamp)}</div>
            </div>
          )
        })}

        {isTyping && (
          <div className="flex flex-col items-start gap-1.5">
            <div className="text-[9px] font-bold text-[#f6b7f6] uppercase tracking-[0.3em] ml-1 opacity-60">
              {currentMatch.strangRCode}
            </div>
            <div className="bg-[#191919] border border-white/5 rounded-2xl rounded-tl-none px-5 py-3.5 flex items-center gap-3">
              <span className="typing-dots-premium">
                <span />
                <span />
                <span />
              </span>
              <span className="text-[#444] text-[10px] font-bold uppercase tracking-[0.1em] italic">Transmitting...</span>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>
    </div>
  )
}
