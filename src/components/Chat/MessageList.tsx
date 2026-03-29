'use client'

import { useEffect, useRef, useState } from 'react'
import { Message } from '@/types'
import { useChatContext } from '@/context/ChatContext'
import { useAuthContext } from '@/context/AuthContext'
import { Search, XCircle, Check, CheckCheck, Clock, Zap } from 'lucide-react'

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
  onSwipeUpdate?: (x: number) => void // update swipe state in parent
  isPrivate?: boolean
}


export function MessageList({ onSwipeLeft, onSwipeRight, onStartMatch, onSwipeUpdate, isPrivate }: MessageListProps) {
  const { chatState } = useChatContext()
  const { user } = useAuthContext()
  const { messages, isTyping, currentMatch, connectionStatus } = chatState
  const bottomRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  
  // Swipe gesture tracking
  const touchStartX = useRef<number>(0)
  const touchStartY = useRef<number>(0)
  const isMouseDown = useRef<boolean>(false)
  const { stopMatching } = useChatContext()

  useEffect(() => {
    const scrollBottom = () => {
      if (listRef.current) {
        listRef.current.scrollTop = listRef.current.scrollHeight
      }
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    // Scroll immediately
    scrollBottom()
    
    // Also scroll after a tiny delay to account for rendering
    const timer = setTimeout(scrollBottom, 100)
    return () => clearTimeout(timer)
  }, [messages, isTyping])

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
    touchStartY.current = e.touches[0].clientY
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    const dx = e.touches[0].clientX - touchStartX.current
    const dy = e.touches[0].clientY - touchStartY.current
    
    // Only track swipe if horizontal motion is dominant
    if (Math.abs(dx) > Math.abs(dy)) {
      onSwipeUpdate?.(dx)
    }
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchStartX.current
    const dy = e.changedTouches[0].clientY - touchStartY.current
    
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 100) {
      if (dx < 0) onSwipeLeft?.()
      else onSwipeRight?.()
    }
    onSwipeUpdate?.(0)
  }

  // Mouse drag support for desktop "swipe"
  const handleMouseDown = (e: React.MouseEvent) => {
    touchStartX.current = e.clientX
    touchStartY.current = e.clientY
    isMouseDown.current = true
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isMouseDown.current) return
    const dx = e.clientX - touchStartX.current
    const dy = e.clientY - touchStartY.current
    
    if (Math.abs(dx) > Math.abs(dy)) {
      onSwipeUpdate?.(dx)
    }
  }

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!isMouseDown.current) return
    isMouseDown.current = false
    const dx = e.clientX - touchStartX.current
    const dy = e.clientY - touchStartY.current
    
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 100) {
      if (dx < 0) onSwipeLeft?.()
      else onSwipeRight?.()
    }
    onSwipeUpdate?.(0)
  }

  // Matching / waiting state (Skip if this is a private chat)
  if (!isPrivate && (connectionStatus === 'idle' || connectionStatus === 'matching')) {
    const isMatching = connectionStatus === 'matching'
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-10 text-center px-12 relative z-10 overflow-hidden bg-transparent">
        
        {/* Atmospheric Glow Center */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
          <div className="w-[800px] h-[800px] bg-[#f6b7f6]/5 rounded-full blur-[120px] animate-pulse-slow" />
        </div>

        {/* Enhanced Orbital Scanner */}
        <div className="relative group perspective-1000">
          {/* Inner Core */}
          <div className="w-32 h-32 rounded-full flex items-center justify-center relative bg-[#0a0a0a] backdrop-blur-3xl shadow-[0_0_50px_rgba(246,183,246,0.1)] border border-white/5 overflow-hidden">
             {/* Spinning Rings */}
             <div className="absolute inset-0 rounded-full border border-dashed border-[#f6b7f6]/20 animate-spin-slow" />
             <div className="absolute inset-2 rounded-full border-t border-r border-[#f6b7f6]/40 animate-spin" />
             <div className="absolute inset-4 rounded-full border-b border-l border-[#f6b7f6]/20 animate-reverse-spin" />
             
             {/* Glowing Pulse */}
             <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#f6b7f6]/10 to-transparent animate-pulse-slow" />
             
             <div className="absolute inset-0 flex items-center justify-center">
                <Search size={28} className={`text-[#f6b7f6] ${isMatching ? 'animate-pulse' : 'opacity-40'}`} />
             </div>
          </div>
          
          {/* Outer Ring Orbits */}
          <div className={`absolute -inset-8 rounded-full border border-white/5 opacity-50 ${isMatching ? 'animate-ping opacity-10' : ''}`} />
        </div>
        
        <div className="space-y-6 relative z-10 max-w-lg">
          <div className="flex flex-col items-center gap-3">
            <span className="text-[10px] font-black uppercase tracking-[0.8em] text-[#f6b7f6] italic font-serif">DISCOVER STRANGR</span>
            <h3 className="text-white font-black text-5xl tracking-tighter leading-none uppercase italic">
              {isMatching ? 'FINDING STRANGR' : 'START SEARCHING'}
            </h3>
          </div>
          
          <div className="relative inline-block">
            <p className="text-[#666] text-[13px] leading-relaxed font-medium px-4 max-w-sm mx-auto">
              {isMatching 
                ? 'Navigating the unknown for your perfect match. Connection established through soul, not profile.' 
                : 'Connect with a true StrangR through pure communication—beyond names, faces, and identities.'}
            </p>
            {/* Minimalist Accents */}
            <div className="absolute -left-4 top-0 w-px h-full bg-[#f6b7f6]/10" />
            <div className="absolute -right-4 top-0 w-px h-full bg-[#f6b7f6]/10" />
          </div>
        </div>
 
        {connectionStatus === 'idle' && (
          <button 
            onClick={onStartMatch} 
            className="group relative px-12 py-5 rounded-full bg-black border border-[#f6b7f6]/20 text-[#f6b7f6] font-black uppercase tracking-[0.4em] text-[11px] transition-all hover:bg-[#f6b7f6] hover:text-[#3c0d42] hover:scale-105 active:scale-95 shadow-2xl hover:shadow-[#f6b7f6]/20 flex items-center gap-6 mt-4"
          >
            START SEARCHING
            <div className="w-6 h-6 rounded-full bg-[#f6b7f6]/10 flex items-center justify-center group-hover:bg-[#3c0d42]/10 transition-all">
              <Zap size={14} className="group-hover:fill-[#3c0d42]" />
            </div>
          </button>
        )}
 
        {isMatching && (
          <button 
            onClick={stopMatching} 
            className="group relative px-12 py-5 rounded-full bg-[#030303] border border-white/5 text-[#444] font-bold uppercase tracking-[0.4em] text-[10px] transition-all hover:text-red-500 hover:bg-red-500/5 active:scale-95 flex items-center gap-6 mt-4"
          >
            STOP SEARCHING
            <div className="flex items-center justify-center group-hover:rotate-90 transition-transform">
              <XCircle size={16} />
            </div>
          </button>
        )}
      </div>
    )
  }

  if (!currentMatch) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-6 text-center px-12 bg-transparent relative">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03]">
          <Search size={400} className="text-[#f6b7f6] blur-sm animate-pulse-slow" />
        </div>
        
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#f6b7f6]/10 to-transparent border border-white/5 flex items-center justify-center shadow-2xl backdrop-blur-3xl animate-float mb-4">
             <Search size={28} className="text-[#f6b7f6]" />
          </div>
          
          <span className="text-[10px] font-black uppercase tracking-[0.8em] text-[#f6b7f6]/60 italic font-serif">DISCOVER STRANGR</span>
          <h3 className="text-white font-black text-4xl tracking-tighter leading-none uppercase italic max-w-sm">
            Ready to connect?
          </h3>
          <p className="text-[#444] text-[13px] leading-relaxed font-medium px-4 max-w-xs mx-auto mt-2">
            Connect with a true StrangR through pure communication—beyond names, faces, and identities.
          </p>
        </div>
        
        <button 
          onClick={onStartMatch} 
          className="group relative px-12 py-5 rounded-full bg-black border border-[#f6b7f6]/20 text-[#f6b7f6] font-black uppercase tracking-[0.4em] text-[11px] transition-all hover:bg-[#f6b7f6] hover:text-[#3c0d42] hover:scale-105 active:scale-95 shadow-2xl hover:shadow-[#f6b7f6]/20 flex items-center gap-6 mt-8"
        >
          START SEARCHING
          <div className="w-6 h-6 rounded-full bg-[#f6b7f6]/10 flex items-center justify-center group-hover:bg-[#3c0d42]/10 transition-all">
            <Zap size={14} className="group-hover:fill-[#3c0d42]" />
          </div>
        </button>
      </div>
    )
  }

  return (
    <div 
      ref={listRef}
      className="flex-1 overflow-y-auto px-6 lg:px-12 pt-4 pb-32 space-y-4 relative scroll-smooth bg-transparent select-none"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={() => {
        isMouseDown.current = false
        onSwipeUpdate?.(0)
      }}
    >
      <div className="relative z-10 flex flex-col gap-6">
        {messages.length > 0 && (
          <div className="flex items-center gap-4 my-4">
            <div className="flex-1 h-px bg-white/5" />
            <span className="text-[9px] text-[#444] uppercase font-bold tracking-[0.3em]">
              {connectionStatus === 'friends' ? 'BONDED FRIENDSHIP — PERMANENT' : `SESSION ACTIVE — ${formatTime(messages[0]?.timestamp || new Date())}`}
            </span>
            <div className="flex-1 h-px bg-white/5" />
          </div>
        )}

        {messages.length === 0 && (
          <div className="text-center py-12 flex flex-col items-center gap-4">
            <div className="bg-[#f6b7f6]/10 border border-[#f6b7f6]/20 px-6 py-2 rounded-full mb-4">
              <p className="text-[#f6b7f6] text-[10px] uppercase font-black tracking-[0.4em] animate-pulse">
                {connectionStatus === 'friends' ? 'BONDED FRIEND' : 'STRANGR FOUND'}
              </p>
            </div>
            <div className="w-px h-8 bg-gradient-to-b from-[#f6b7f6]/40 to-transparent" />
            <p className="text-[#444] text-[10px] uppercase font-bold tracking-[0.2em]">
              {connectionStatus === 'friends' ? 'Safe and Secure' : 'Established initial handshake'}
            </p>
            <p className="text-[#f6b7f6]/60 text-[10px] uppercase font-bold tracking-[0.3em]">
              Say anything to {currentMatch.strangRCode}
            </p>
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
              <div className="flex items-center gap-1 mt-0.5">
                <div className="text-[9px] text-[#333] font-bold tracking-widest font-mono">
                  {formatTime(msg.timestamp)}
                </div>
                {isMe && (
                  <div className="ml-2 flex items-center">
                    {msg.status === 'sending' && <Clock size={11} className="text-white/30" />}
                    {msg.status === 'sent' && <Check size={12} className="text-white/70" />}
                    {msg.status === 'delivered' && <CheckCheck size={15} className="text-white shadow-[0_0_8px_rgba(255,255,255,0.2)]" />}
                    {msg.status === 'read' && <CheckCheck size={15} className="text-[#f6b7f6] drop-shadow-[0_0_8px_rgba(246,183,246,0.5)]" />}
                    {!msg.status && <Check size={12} className="text-white/70" />}
                  </div>
                )}
              </div>
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
