'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AuthCallbackPage() {
  const router = useRouter()
  
  useEffect(() => {
    // The AuthContext listener will handle the session automatically
    // Just redirect to dashboard
    const timer = setTimeout(() => {
      router.push('/dashboard')
    }, 1500)
    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-4">
      <div className="w-8 h-8 border-2 border-[#C54B8C] border-t-transparent rounded-full animate-spin" />
      <p className="text-[#555] text-sm uppercase tracking-widest">Entering the void...</p>
    </div>
  )
}
