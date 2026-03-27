'use client'

import { useEffect, useState } from 'react'
import { AlertOctagon, Clock } from 'lucide-react'
import { useAuthContext } from '@/context/AuthContext'

export function BanModal() {
  const { user } = useAuthContext()
  const [timeLeft, setTimeLeft] = useState('')

  useEffect(() => {
    if (!user?.banExpiryTime) return

    const updateTime = () => {
      const now = new Date().getTime()
      const expiry = user.banExpiryTime!.getTime()
      const diff = expiry - now

      if (diff <= 0) {
        setTimeLeft('Ban Expired. Please refresh.')
        return
      }

      const h = Math.floor(diff / (1000 * 60 * 60))
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const s = Math.floor((diff % (1000 * 60)) / 1000)

      setTimeLeft(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`)
    }

    updateTime()
    const int = setInterval(updateTime, 1000)
    return () => clearInterval(int)
  }, [user?.banExpiryTime])

  if (!user?.banStatus) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black">
      <div className="max-w-md w-full text-center">
        
        <div className="relative mx-auto w-32 h-32 mb-8">
          <div className="absolute inset-0 rounded-full border-4 border-[#1a1a1a]" />
          <svg className="absolute inset-0 w-full h-full -rotate-90">
            <circle
              cx="64"
              cy="64"
              r="60"
              fill="none"
              stroke="#EF4444"
              strokeWidth="4"
              strokeDasharray="377"
              strokeDashoffset="100"
              className="transition-all duration-1000 ease-linear"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <AlertOctagon className="w-10 h-10 text-red-500" />
          </div>
        </div>

        <h1 className="text-4xl font-black text-white tracking-tight mb-2 uppercase">
          Access Denied
        </h1>
        <div className="glow-divider bg-red-500/50 w-24 mx-auto mb-6" />

        <p className="text-[#888] text-base leading-relaxed mb-8">
          Your account has been temporarily suspended due to multiple reports of violating our community guidelines.
          We take the safety of our sanctuary seriously.
        </p>

        <div className="card p-6 border-red-500/20 bg-[#110505]">
          <div className="flex items-center justify-center gap-2 text-red-400 font-medium mb-1 uppercase tracking-widest text-xs">
            <Clock className="w-4 h-4" />
            Time Remaining
          </div>
          <div className="text-3xl font-mono text-white tracking-widest">
            {timeLeft}
          </div>
        </div>

        <div className="mt-8 text-xs text-[#444] uppercase tracking-widest">
          StrangR System ID: {user.uid.slice(0, 8)}
        </div>
      </div>
    </div>
  )
}
