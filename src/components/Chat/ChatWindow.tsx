'use client'

import { useState } from 'react'
import { StrangerHeader } from './StrangerHeader'
import { MessageList } from './MessageList'
import { MessageInput } from './MessageInput'
import { ConnectionPendingModal } from './ConnectionPendingModal'
import { FriendshipAcceptedModal } from './FriendshipAcceptedModal'
import { ModerationModal } from './ModerationModal'
import { useChatContext } from '@/context/ChatContext'

interface ChatWindowProps {
  onStartMatch: () => void
}

export function ChatWindow({ onStartMatch }: ChatWindowProps) {
  const { chatState, sendConnectionRequest, declineConnection, hideConnectionProposal, resetChat, skipStranger, reportStranger, dismissNotifications, startMatching } = useChatContext()
  const { currentMatch, connectionStatus, connectionId } = chatState
  const [showFriendModal, setShowFriendModal] = useState(false)
  const [swipeX, setSwipeX] = useState<number>(0)

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

      {/* Content Area (List + Input) */}
      <div className="flex-1 flex flex-col relative overflow-hidden">
        {/* Messages */}
        <MessageList
          onSwipeLeft={handleSkip}
          onSwipeRight={handleReport}
          onStartMatch={onStartMatch}
          onSwipeUpdate={setSwipeX}
        />

        {/* Input */}
        {currentMatch && <MessageInput />}


        {/* Swipe Overlay (Inside Content Area to avoid covering Header) */}
        {swipeX !== 0 && (
          <div 
            className="absolute inset-0 z-[100] pointer-events-none flex items-center justify-center transition-opacity duration-150"
            style={{ 
              backgroundColor: swipeX < 0 ? 'rgba(34, 197, 94, 0.4)' : 'rgba(239, 68, 68, 0.4)',
              opacity: Math.min(Math.abs(swipeX) / 100, 1)
            }}
          >
            <div 
              className={`px-8 py-3 rounded-2xl flex items-center justify-center border-2 backdrop-blur-xl shadow-[0_0_50px_rgba(0,0,0,0.5)] transition-transform duration-75`}
              style={{ 
                backgroundColor: swipeX < 0 ? 'rgba(21, 128, 61, 0.8)' : 'rgba(185, 28, 28, 0.8)',
                borderColor: 'rgba(255, 255, 255, 0.2)',
                transform: `scale(${Math.min(0.8 + Math.abs(swipeX) / 150, 1.4)})`,
              }}
            >
              <span className="text-white text-3xl font-black uppercase tracking-[0.2em] drop-shadow-md">
                {swipeX < 0 ? 'SKIP' : 'REPORT'}
              </span>
            </div>
          </div>
        )}
      </div>

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

      {/* skip-partner notification */}
      {chatState.partnerSkipNotification && (
        <ModerationModal
          type="skip"
          onClose={() => {
            dismissNotifications()
            startMatching() // Start searching for new match automatically after dismiss
          }}
        />
      )}

      {/* report-partner notification */}
      {chatState.partnerReportNotification && (
        <ModerationModal
          type="report"
          reportCount={chatState.partnerReportNotification.count}
          maxReports={chatState.partnerReportNotification.max}
          onClose={() => {
            dismissNotifications()
          }}
        />
      )}
    </div>
  )
}
