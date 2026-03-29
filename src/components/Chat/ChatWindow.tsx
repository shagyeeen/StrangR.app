'use client'

import { useState } from 'react'
import { StrangerHeader } from './StrangerHeader'
import { MessageList } from './MessageList'
import { MessageInput } from './MessageInput'
import { ConnectionPendingModal } from './ConnectionPendingModal'
import { FriendshipAcceptedModal } from './FriendshipAcceptedModal'
import { useChatContext } from '@/context/ChatContext'

interface ChatWindowProps {
  onStartMatch: () => void
}

export function ChatWindow({ onStartMatch }: ChatWindowProps) {
  const { chatState, sendConnectionRequest, declineConnection, hideConnectionProposal, resetChat, skipStranger, reportStranger } = useChatContext()
  const { currentMatch, connectionStatus, connectionId } = chatState
  const [showFriendModal, setShowFriendModal] = useState(false)

  const handleConnect = () => {
    sendConnectionRequest()
  }

  const handleReport = () => {
    if (!currentMatch) return
    if (window.confirm(`Report ${currentMatch.strangRCode} for inappropriate behavior?`)) {
      reportStranger('inappropriate behavior')
      skipStranger()
    }
  }

  const handleSkip = () => {
    skipStranger()
  }

  // Show friendship accepted state
  const isFriends = connectionStatus === 'friends'

  return (
    <div 
      className="flex flex-col h-full relative overflow-hidden"
      style={{ 
        backgroundImage: currentMatch ? 'url("/images/chat_wallpaper.png")' : 'none',
        backgroundSize: '400px',
        backgroundRepeat: 'repeat',
        backgroundColor: '#0a0a0a'
      }}
    >
      {/* Background Dimmer */}
      <div className="absolute inset-0 bg-black/60 pointer-events-none z-0" />

      {/* Animated Background Atmosphere (Only when not in chat) */}
      {!currentMatch && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden">
          <div className="w-[500px] h-[500px] bg-[#f6b7f6]/10 rounded-full blur-[120px] animate-pulse" />
        </div>
      )}
      {/* Header */}
      {currentMatch && (
        <StrangerHeader
          onConnect={handleConnect}
          onReport={handleReport}
          onSkip={handleSkip}
        />
      )}

      {/* Messages */}
      <MessageList
        onSwipeLeft={handleSkip}
        onSwipeRight={handleReport}
        onStartMatch={onStartMatch}
      />

      {/* Swipe hint for mobile */}
      {currentMatch && (
        <div className="px-6 py-2 border-t border-[#0f0f0f] flex items-center justify-between">
          <span className="text-[10px] text-[#2a2a2a] uppercase tracking-widest">← Swipe to skip</span>
          <span className="text-[10px] text-[#2a2a2a] uppercase tracking-widest">Swipe to report →</span>
        </div>
      )}

      {/* Input */}
      {currentMatch && <MessageInput />}

      {/* Modals */}
      {(connectionStatus === 'pending_connection' || connectionStatus === 'proposing_connection') && currentMatch && (
        <ConnectionPendingModal
          strangerCode={currentMatch.strangRCode}
          onClose={hideConnectionProposal}
          onCancel={() => {
            if (connectionId) {
              declineConnection(connectionId)
            } else {
              resetChat() // Fallback for local cancel
            }
          }}
        />
      )}

      {isFriends && !showFriendModal && currentMatch && (
        <FriendshipAcceptedModal
          strangerCode={currentMatch.strangRCode}
          onClose={() => setShowFriendModal(true)}
        />
      )}
    </div>
  )
}
