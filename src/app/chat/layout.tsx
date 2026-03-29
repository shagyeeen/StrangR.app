'use client'

import { ChatProvider } from '@/context/ChatContext'
import { useAuthContext } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function ChatLayout({ children }: { children: React.ReactNode }) {
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
          <div className="w-10 h-10 border-2 border-[#f6b7f6] border-t-transparent rounded-full animate-spin" />
          <span className="text-[#555] text-xs uppercase tracking-widest">Entering Secure Line...</span>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) return null

  return children
}
