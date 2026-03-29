'use client'

import Link from 'next/link'
import { clsx } from 'clsx'
import { Link2 } from 'lucide-react'
import { SHYNE } from '@/config/constants'

const FOOTER_LINKS = [
  { label: 'Terms', href: '/terms' },
  { label: 'Privacy', href: '/privacy' },
  { label: 'Twitter', href: 'https://twitter.com' },
  { label: 'Instagram', href: 'https://instagram.com' },
]

interface FooterProps {
  isDashboard?: boolean
}

export function Footer({ isDashboard = false }: FooterProps) {
  return (
    <footer className={clsx(
      "w-full z-50 bg-[#0e0e0e]/80 backdrop-blur-xl border-t border-white/5 h-20 flex items-center",
      isDashboard ? "fixed bottom-0" : "relative mt-auto py-12"
    )}>
      <div className="max-w-[1850px] w-full mx-auto px-6 md:px-10 flex flex-col md:flex-row items-center justify-between gap-6">
        
        <div className="flex flex-col items-center md:items-start leading-tight">
          <div className="flex items-center gap-2">
            <img src="/images/logo.png" alt="" className="w-4 h-4 object-contain" />
            <span className="font-bold text-white tracking-widest text-[10px] uppercase">STRANG<span className="text-[#f6b7f6]">R</span></span>
          </div>
          <div className="flex items-center gap-1.5 mt-1 opacity-60">
            <div className="w-5 h-5 rounded-md overflow-hidden flex items-center justify-center p-0.5">
              <img src="/images/shyne.png" alt="" className="w-full h-full object-contain grayscale" />
            </div>
            <span className="text-[9px] text-[#444] font-bold uppercase tracking-widest whitespace-nowrap">BUILT BY SHYNE</span>
          </div>
        </div>

        <nav className="flex items-center gap-6 md:gap-8">
          {FOOTER_LINKS.map(link => (
            <Link
              key={link.label}
              href={link.href}
              className="text-[9px] text-[#444] hover:text-[#f6b7f6] uppercase tracking-[0.2em] transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-2xl border border-white/5">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
          <span className="text-[9px] text-[#666] uppercase tracking-widest font-bold">System Status: Optimal</span>
        </div>
      </div>
    </footer>
  )
}
