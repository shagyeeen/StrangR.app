'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { LayoutDashboard, Users, MessageSquare, Settings, Flame, Zap, Shield, Sparkles } from 'lucide-react'
import { Header } from '@/components/Navigation/Header'
import { Footer } from '@/components/Navigation/Footer'
import { ChatWindow } from '@/components/Chat/ChatWindow'
import { useChatContext } from '@/context/ChatContext'
import { useAuthContext } from '@/context/AuthContext'

export default function DashboardPage() {
  const { chatState, startMatching, skipStranger } = useChatContext()
  const { user, logout } = useAuthContext()
  // const [activeTab, setActiveTab] = useState<'chat' | 'settings'>('chat') // activeTab is no longer used

  const { connectionStatus, currentMatch } = chatState

  // useEffect(() => {
  //   if (connectionStatus === 'idle') {
  //     startMatching()
  //   }
  // }, [connectionStatus, startMatching])

  const handleStartChat = () => {
    startMatching()
  }
 
  return (
    <div className="min-h-screen bg-[#0e0e0e] text-white font-sans selection:bg-[#f6b7f6]/20">
      <Header />

      <main className="pt-28 pb-32 max-w-screen-2xl mx-auto px-10">
        <section className="space-y-12">
          <div className="bg-[#0a0a0a] rounded-3xl overflow-hidden border border-white/5 shadow-2xl h-[calc(100vh-280px)] min-h-[600px] flex flex-col">
            <ChatWindow onStartMatch={handleStartChat} />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
