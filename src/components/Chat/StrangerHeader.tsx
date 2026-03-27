'use client'

import { Flag, MoreVertical, Wifi, WifiOff } from 'lucide-react'
import { useChatContext } from '@/context/ChatContext'

interface StrangerHeaderProps {
  onConnect: () => void
  onReport: () => void
  onSkip: () => void
}

export function StrangerHeader({ onConnect, onReport, onSkip }: StrangerHeaderProps) {
  const { chatState } = useChatContext()
  const { currentMatch, connectionStatus } = chatState

  if (!currentMatch) return null

  const isConnected = connectionStatus === 'friends'
  const isPending = connectionStatus === 'pending_connection'

  return (
    <div className="px-6 py-4 bg-[#191919] flex justify-between items-center border-b border-white/5 h-20 flex-shrink-0">
      <div className="flex flex-col">
        <span className="text-xl font-bold tracking-tight text-white leading-tight">Conversation</span>
        <span className="text-[10px] uppercase font-bold text-[#555] tracking-[0.2em] flex items-center gap-1 mt-0.5">
          Encrypted & Anonymous <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
        </span>
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

        <div className="flex gap-1">
          <button className="p-2 hover:bg-white/5 rounded-full text-[#444] hover:text-[#f370b3] transition-all" onClick={onReport}>
            <Flag size={18} />
          </button>
          <button className="p-2 hover:bg-white/5 rounded-full text-[#444] hover:text-white transition-all">
            <MoreVertical size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}
