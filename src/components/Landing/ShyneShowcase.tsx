'use client'

import Link from 'next/link'
import { ArrowRight, Link2 } from 'lucide-react'
import { SHYNE } from '@/config/constants'

export function ShyneShowcase() {
  return (
    <section className="py-24 px-6 border-t border-[#111]">
      <div className="max-w-xl mx-auto text-center">
        <div className="section-eyebrow mb-6">{SHYNE.tagline}</div>
        
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="w-12 h-12 flex items-center justify-center">
            <img src="/images/logo.png" alt="StrangR Logo" className="w-full h-full object-contain" />
          </div>
          <div className="text-4xl font-black text-white tracking-tight uppercase">STRANG<span className="text-[#f6b7f6]">R</span></div>
        </div>

        <p className="text-[#555] leading-relaxed mb-8">
          {SHYNE.description}
        </p>

        <Link href={SHYNE.portfolio} target="_blank" 
              className="inline-flex items-center gap-2 text-[#f6b7f6] hover:text-[#d6a3d6] transition-colors font-medium group">
          Explore the Portfolio
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </section>
  )
}
