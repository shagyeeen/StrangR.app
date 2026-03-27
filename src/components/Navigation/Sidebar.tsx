'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Users, MessageSquare, Settings, User, Crown } from 'lucide-react'
import { useAuthContext } from '@/context/AuthContext'
import clsx from 'clsx'

export function Sidebar() {
  const pathname = usePathname()
  const { user } = useAuthContext()

  const NAV_ITEMS = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/friends', label: 'Friends', icon: Users },
    { href: '/profile', label: 'Profile', icon: User },
    { href: '/premium', label: 'Premium', icon: Crown },
    { href: '/settings', label: 'Settings', icon: Settings },
  ]

  return (
    <aside className="hidden lg:block lg:col-span-3 space-y-10">
      <div className="space-y-2">
        <p className="font-bold text-[10px] uppercase tracking-[0.2em] text-[#333] mb-4 px-4">NAVIGATION</p>
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon
          
          return (
            <Link 
              key={item.label}
              href={item.href} 
              className={clsx(
                "flex items-center gap-3 px-6 py-4 rounded-2xl transition-all group",
                isActive 
                  ? "bg-[#141414] text-[#f6b7f6] shadow-lg shadow-[#f6b7f6]/5" 
                  : "hover:bg-[#141414] text-[#444] hover:text-white"
              )}
            >
              <Icon size={20} />
              <span className="font-bold text-sm tracking-tight">{item.label}</span>
            </Link>
          )
        })}
      </div>

      <div className="p-8 rounded-3xl bg-gradient-to-br from-[#121212] to-transparent border border-white/5 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-10 transform group-hover:scale-110 transition-transform w-[120px] h-[120px] flex items-center justify-center">
          <img src="/images/logo.png" alt="Logo Accent" className="w-full h-full object-contain pointer-events-none" />
        </div>
        <p className="text-[10px] font-bold text-[#f6b7f6] mb-3 uppercase tracking-widest">Your Presence</p>
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-[#f6b7f6] shadow-[0_0_10px_#f6b7f6]"></div>
          <span className="text-base font-bold tracking-tight text-white">{user?.displayName || 'Unknown Stranger'}</span>
        </div>
        <p className="text-[10px] text-[#444] mt-3 font-mono uppercase tracking-widest">CODE: {user?.strangRCode || 'SR-0000-X'}</p>
      </div>
    </aside>
  )
}
