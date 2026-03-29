'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { LayoutDashboard, Users, MessageSquare, Settings, Flame, Zap, Shield, Sparkles } from 'lucide-react'
import { Header } from '@/components/Navigation/Header'
import { Footer } from '@/components/Navigation/Footer'
import { ChatWindow } from '@/components/Chat/ChatWindow'
import { useChatContext } from '@/context/ChatContext'
import { useAuthContext } from '@/context/AuthContext'
import { useSearchParams } from 'next/navigation'

function DashboardContent() {
  const { chatState, startMatching, skipStranger, loadFriendChat, resetChat } = useChatContext()
  const { user, logout } = useAuthContext()
  const searchParams = useSearchParams()
  const friendshipId = searchParams.get('friend')

  useEffect(() => {
    if (friendshipId && chatState.friendshipId !== friendshipId) {
      loadFriendChat(friendshipId)
    }
  }, [friendshipId, loadFriendChat, chatState.friendshipId, chatState.connectionStatus, resetChat])

  const handleStartChat = () => {
    startMatching()
  }
 
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#0e0e0e] text-white font-sans selection:bg-[#f6b7f6]/20">
      <Header />
      <main className="flex-1 w-full flex flex-col overflow-hidden pt-20">
        <section className="w-full h-full">
          <div className="bg-[#0a0a0a] overflow-hidden border-b border-white/5 shadow-2xl h-full flex flex-col relative">
            <ChatWindow onStartMatch={handleStartChat} />
          </div>
        </section>
      </main>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="h-screen bg-[#0e0e0e] flex items-center justify-center text-[#f6b7f6]">Loading...</div>}>
      <DashboardContent />
    </Suspense>
  )
}
