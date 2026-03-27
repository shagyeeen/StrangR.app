'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Link2, User, LogIn, LogOut, Users, Settings, Crown, ArrowLeft } from 'lucide-react'
import { useAuthContext } from '@/context/AuthContext'
import clsx from 'clsx'

export function Header() {
  const pathname = usePathname()
  const isDashboard = pathname === '/dashboard' || pathname === '/'
  const { user, isAuthenticated, logout } = useAuthContext()

  const ICON_NAV = [
    { href: '/friends', icon: Users, label: 'Friends' },
    { href: '/profile', icon: User, label: 'Profile' },
    { href: '/settings', icon: Settings, label: 'Settings' },
  ]

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-[#1a1a1a]" 
            style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(20px)' }}>
      <div className="max-w-screen-2xl mx-auto px-10 h-20 flex items-center justify-between">
        
        <div className="flex items-center gap-6">
          {!isDashboard && (
            <Link 
              href="/dashboard" 
              className="flex items-center gap-2 text-[#555] hover:text-[#f6b7f6] transition-colors group"
            >
              <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center group-hover:bg-[#f6b7f6]/10 group-hover:border-[#f6b7f6]/20 transition-all">
                <ArrowLeft size={18} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest hidden md:block">Dashboard</span>
            </Link>
          )}

          <Link href="/dashboard" className="flex items-center gap-2 group">
            <div className="w-8 h-8 flex items-center justify-center">
              <img 
                src="/images/logo.png" 
                alt="StrangR Logo" 
                className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            <span className="font-bold text-lg text-white tracking-tight uppercase">
              STRANG<span className="text-[#f6b7f6]">R</span>
            </span>
          </Link>
        </div>

        {/* Auth & Icon Nav */}
        <div className="flex items-center gap-8">
          {isAuthenticated && user ? (
            <div className="flex items-center gap-6">
              {/* Icon Links */}
              <div className="flex items-center gap-2">
                {ICON_NAV.map((item) => {
                  const Icon = item.icon
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={clsx(
                        "w-10 h-10 rounded-2xl flex items-center justify-center transition-all group relative",
                        isActive 
                          ? "bg-[#f6b7f6]/10 text-[#f6b7f6] ring-1 ring-[#f6b7f6]/30" 
                          : "text-[#555] hover:text-white hover:bg-white/5"
                      )}
                      title={item.label}
                    >
                      <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                      {isActive && (
                        <div className="absolute -bottom-1 w-1 h-1 rounded-full bg-[#f6b7f6] shadow-[0_0_8px_#f6b7f6]" />
                      )}
                    </Link>
                  )
                })}
              </div>

              <div className="w-px h-6 bg-white/5 mx-2" />

              <div className="flex items-center gap-4">
                <Link href="/premium" className="text-[10px] font-bold text-[#f6b7f6] tracking-widest uppercase bg-[#1a1a1a] px-3 py-1.5 rounded-full border border-[#f6b7f6]/20 flex items-center gap-2 hover:scale-105 transition-transform">
                  <Crown size={12} fill="currentColor" />
                  {user.premiumStatus ? 'PREMIUM' : 'UPGRADE'}
                </Link>
                <button
                  onClick={() => logout()}
                  className="w-10 h-10 rounded-full bg-red-500/5 border border-red-500/10 flex items-center justify-center text-red-500/40 hover:text-red-500 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-6">
              <Link href="/auth/login" className="text-[11px] font-bold uppercase tracking-widest text-[#555] hover:text-white transition-colors">
                Login
              </Link>
              <Link href="/auth/login" className="bg-[#f6b7f6] text-[#3c0d42] px-6 py-2 rounded-full font-bold text-[11px] uppercase tracking-[0.2em] transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(246,183,246,0.2)]">
                Access Gateway
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
