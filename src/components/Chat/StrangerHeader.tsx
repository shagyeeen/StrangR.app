'use client'

import { useState, useRef, useEffect } from 'react'
import { Flag, MoreVertical, Wifi, WifiOff, Trash2, ShieldAlert, User2 } from 'lucide-react'
import { useChatContext } from '@/context/ChatContext'

interface StrangerHeaderProps {
  onConnect: () => void
  onReport: () => void
  onSkip: () => void
}

export function StrangerHeader({ onConnect, onReport, onSkip }: StrangerHeaderProps) {
  const { chatState } = useChatContext()
  const { currentMatch, connectionStatus } = chatState
  const [showMenu, setShowMenu] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  if (!currentMatch) return null

  const isConnected = connectionStatus === 'friends'
  const isPending = connectionStatus === 'pending_connection'

  return (
    <div className="px-6 py-4 bg-black flex justify-between items-center border-b border-white/5 h-20 flex-shrink-0 relative z-50">
      <div className="flex items-center gap-4">
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-pink-500/20 to-purple-600/20 border border-white/10 flex items-center justify-center overflow-hidden">
            <User2 size={20} className="text-[#f6b7f6]" />
          </div>
          {currentMatch?.isOnline && (
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-black" />
          )}
        </div>
        <div className="flex flex-col">
          <span className="text-xl font-bold tracking-tight text-white leading-tight uppercase font-serif italic">
            {currentMatch.strangRCode}
          </span>
          <span className="text-[10px] uppercase font-bold text-[#555] tracking-[0.2em] flex items-center gap-1 mt-0.5">
            {currentMatch?.isOnline ? (
              <span className="text-green-500/80">Active Now</span>
            ) : (
              <span>{currentMatch?.lastSeen ? `Last seen ${formatLastSeen(currentMatch.lastSeen)}` : 'Handshaking...'}</span>
            )}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {isConnected && (
          <div className="px-4 py-1.5 rounded-full bg-[#f6b7f6]/10 border border-[#f6b7f6]/20 flex items-center gap-2 mr-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#f6b7f6] animate-pulse shadow-[0_0_5px_#f6b7f6]" />
            <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#f6b7f6]">BONDED</span>
          </div>
        )}

        {!isConnected && (
          <button 
            onClick={onConnect}
            disabled={isPending}
            className={`px-6 py-2 rounded-full text-[10px] uppercase font-bold tracking-[0.3em] transition-all active:scale-95 ${
              isPending 
              ? 'bg-[#222] text-[#444] cursor-not-allowed shadow-none' 
              : 'bg-gradient-to-br from-[#f6b7f6] to-[#c88dc8] text-[#3c0d42] shadow-xl shadow-[#f6b7f6]/10'
            }`}
          >
            {isPending ? 'Pending...' : 'Send Bond'}
          </button>
        )}

        <div className="flex gap-1 relative" ref={menuRef}>
          <button 
            className="p-2 hover:bg-white/5 rounded-full text-[#444] hover:text-[#f6b7f6] transition-all" 
            onClick={() => setShowMenu(!showMenu)}
          >
            <MoreVertical size={18} />
          </button>

          {showMenu && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex flex-col py-1">
                <button 
                  onClick={() => { onSkip(); setShowMenu(false); }}
                  className="flex items-center gap-3 px-4 py-3 text-[10px] uppercase font-bold tracking-widest text-[#888] hover:text-white hover:bg-white/5 transition-all text-left"
                >
                  <Trash2 size={14} className="text-white/20" />
                  {isConnected ? 'Disconnect Friend' : 'Skip Stranger'}
                </button>
                <button 
                  onClick={() => { onReport(); setShowMenu(false); }}
                  className="flex items-center gap-3 px-4 py-3 text-[10px] uppercase font-bold tracking-widest text-[#f370b3] hover:bg-[#f370b3]/10 transition-all text-left"
                >
                  <ShieldAlert size={14} />
                  Report Abuse
                </button>
                <div className="h-px bg-white/5 mx-2 my-1" />
                <button 
                  className="flex items-center gap-3 px-4 py-3 text-[10px] uppercase font-bold tracking-widest text-[#444] cursor-not-allowed text-left"
                  disabled
                >
                  <User2 size={14} />
                  Profile Details
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
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
