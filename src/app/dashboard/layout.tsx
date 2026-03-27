'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthContext } from '@/context/AuthContext'
import { ChatProvider } from '@/context/ChatContext'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuthContext()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login')
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-[#C54B8C] border-t-transparent rounded-full animate-spin" />
          <span className="text-[#555] text-xs uppercase tracking-widest">Loading...</span>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) return null

  return (
    <ChatProvider>
      <div className="h-screen bg-black flex flex-col overflow-hidden">
        {children}
      </div>
    </ChatProvider>
  )
}
