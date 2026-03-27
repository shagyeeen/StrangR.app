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
  const { chatState, sendConnectionRequest, declineConnection, resetChat, skipStranger, reportStranger } = useChatContext()
  const { currentMatch, connectionStatus, connectionId } = chatState
  const [showFriendModal, setShowFriendModal] = useState(false)
  const [reportMode, setReportMode] = useState(false)

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
    <div className="flex flex-col h-full">
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
      <MessageInput />

      {/* Modals */}
      {connectionStatus === 'pending_connection' && currentMatch && (
        <ConnectionPendingModal
          strangerCode={currentMatch.strangRCode}
          onCancel={() => connectionId && declineConnection(connectionId)}
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
