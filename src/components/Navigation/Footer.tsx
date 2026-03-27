'use client'

import Link from 'next/link'
import { Link2 } from 'lucide-react'
import { SHYNE } from '@/config/constants'

const FOOTER_LINKS = [
  { label: 'Terms', href: '/terms' },
  { label: 'Privacy', href: '/privacy' },
  { label: 'Twitter', href: 'https://twitter.com' },
  { label: 'Instagram', href: 'https://instagram.com' },
]

export function Footer() {
  return (
    <footer className="border-t border-[#1a1a1a] py-8 px-6">
      <div className="max-w-screen-2xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        <div className="flex flex-col items-start gap-1">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 flex items-center justify-center">
              <img 
                src="/images/logo.png" 
                alt="StrangR Logo" 
                className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300" 
              />
            </div>
            <span className="font-bold text-white tracking-wider text-sm uppercase">STRANG<span className="text-[#f6b7f6]">R</span></span>
          </Link>
          <span className="text-[10px] text-[#555555] uppercase tracking-widest">Built by Shyne</span>
        </div>

        {/* Links */}
        <nav className="flex items-center gap-6">
          {FOOTER_LINKS.map(link => (
            <Link
              key={link.label}
              href={link.href}
              className="text-[11px] text-[#555555] hover:text-[#888888] uppercase tracking-widest transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right */}
        <div className="flex items-center gap-2">
          <div className="online-dot" />
          <span className="text-xs text-[#555555]">System Status: Optimal</span>
        </div>
      </div>
      
      {/* Shyne credit */}
      <div className="max-w-screen-2xl mx-auto mt-6 pt-6 border-t border-[#111111] flex items-center justify-between">
        <span className="text-[10px] text-[#333333]">© 2024 StrangR. The Ethereal Dialogue.</span>
        <Link href={SHYNE.portfolio} target="_blank" className="text-[10px] text-[#333333] hover:text-[#f6b7f6] transition-colors uppercase tracking-widest">
          Built by Shyne © 2024
        </Link>
      </div>
    </footer>
  )
}
