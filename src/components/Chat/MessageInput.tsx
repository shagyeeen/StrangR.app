'use client'

import { useState, useRef, KeyboardEvent } from 'react'
import { Send, Smile, Paperclip } from 'lucide-react'
import { useChatContext } from '@/context/ChatContext'

export function MessageInput() {
  const [text, setText] = useState('')
  const [isSending, setIsSending] = useState(false)
  const { sendMessage, chatState, socket } = useChatContext()
  const { currentMatch, connectionStatus } = chatState
  const typingTimeout = useRef<NodeJS.Timeout | null>(null)

  const isDisabled = !currentMatch || connectionStatus === 'idle' || connectionStatus === 'matching' || connectionStatus === 'disconnected'

  const handleTyping = (val: string) => {
    setText(val)
    if (!socket || !currentMatch) return
    socket.emit('typing', { recipientId: currentMatch.uid, friendshipId: chatState.friendshipId })
    if (typingTimeout.current) clearTimeout(typingTimeout.current)
    typingTimeout.current = setTimeout(() => {
      socket.emit('stop_typing', { recipientId: currentMatch.uid, friendshipId: chatState.friendshipId })
    }, 1500)
  }

  const handleSend = async () => {
    const trimmed = text.trim()
    console.log('--- INPUT: handleSend triggered ---', trimmed)
    if (!trimmed || isDisabled || isSending) {
      console.warn('INPUT: Aborting handleSend - early exit', { trimmed, isDisabled, isSending })
      return
    }
    setIsSending(true)
    setText('')
    try {
      sendMessage(trimmed)
    } finally {
      setIsSending(false)
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="px-6 pt-4 pb-10 bg-transparent relative z-20">
      <div className="input-container-premium">
        
        <input
          type="text"
          value={text}
          onChange={e => handleTyping(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={
            isDisabled 
              ? connectionStatus === 'disconnected' ? 'Bond disconnected' : 'Penetrating void...' 
              : connectionStatus === 'friends' 
                ? `Message ${currentMatch?.strangRCode || 'friend'}...` 
                : 'Whisper to stranger...'
          }
          disabled={isDisabled}
          className="flex-1 bg-transparent outline-none text-white placeholder-[#333] text-sm font-medium disabled:cursor-not-allowed selection:bg-[#f6b7f6]/30 px-2"
        />

        <button
          onClick={handleSend}
          disabled={!text.trim() || isDisabled || isSending}
          className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 disabled:opacity-20 disabled:grayscale hover:scale-105 active:scale-95 shadow-xl group"
          style={{ background: 'linear-gradient(135deg, #f6b7f6, #c88dc8)' }}
        >
          <Send size={18} className="text-[#3c0d42] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </button>
      </div>
    </div>
  )
}
