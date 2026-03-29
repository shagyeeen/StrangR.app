'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Zap } from 'lucide-react'
import { SHYNE } from '@/config/constants'

export function ShyneShowcase() {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 py-24 overflow-hidden bg-black">
      {/* Dynamic Background Accents */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#f6b7f6]/8 rounded-full blur-[160px] pointer-events-none" />
      
      <div className="max-w-4xl w-full relative z-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="glass rounded-[40px] p-8 md:p-12 text-center border border-white/10 shadow-2xl relative overflow-hidden group"
        >
          {/* Subtle moving light effect */}
          <div className="absolute inset-0 bg-gradient-to-tr from-[#f6b7f6]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

          {/* Tagline */}
          <motion.div 
            initial={{ opacity: 0, letterSpacing: "0.2em" }}
            whileInView={{ opacity: 0.6, letterSpacing: "0.4em" }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 1 }}
            className="section-eyebrow mb-4 flex items-center justify-center gap-3 text-[#f6b7f6] font-bold"
          >
            <div className="w-1 h-1 rounded-full bg-[#f6b7f6] animate-pulse" />
            {SHYNE.tagline}
            <div className="w-1 h-1 rounded-full bg-[#f6b7f6] animate-pulse" />
          </motion.div>
          
          {/* Logo & Brand Name */}
          <div className="flex flex-col items-center mb-4">
            <motion.div 
              whileHover={{ scale: 1.05, rotate: 2 }}
              className="relative mb-2"
            >
              <div className="absolute inset-0 bg-[#f6b7f6]/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="w-16 h-16 relative z-10 flex items-center justify-center bg-black/40 rounded-xl border border-white/10 p-2.5 backdrop-blur-md shadow-2xl overflow-hidden">
                <img 
                  src="/images/shyne.png" 
                  alt="Shyne Logo" 
                  className="w-full h-full object-contain invert opacity-80" 
                />
              </div>
            </motion.div>
            
            <motion.h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase mb-2">
              SHYN<span className="text-[#f6b7f6]">E</span>
            </motion.h2>

            <motion.p className="text-[#888] text-sm md:text-base leading-relaxed max-w-xl mx-auto mb-6 font-medium">
              {SHYNE.description}
            </motion.p>
          </div>

          <Link 
            href={SHYNE.portfolio} 
            target="_blank" 
            className="group/btn relative inline-flex items-center gap-3 px-6 py-3.5 bg-white text-black rounded-full font-bold uppercase tracking-widest text-[9px] transition-all hover:bg-[#f6b7f6] hover:scale-105 active:scale-95 shadow-[0_10px_20px_rgba(255,255,255,0.1)] hover:shadow-[#f6b7f6]/30 overflow-hidden"
          >
            <span className="relative z-10">Explore the Portfolio</span>
            <div className="bg-black/10 rounded-full p-1.5 relative z-10 group-hover/btn:bg-black group-hover/btn:text-white transition-all">
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000" />
          </Link>
          
          <div className="absolute top-0 right-0 p-6 opacity-5">
            <Zap className="w-10 h-10 text-[#f6b7f6]" />
          </div>
        </motion.div>
      </div>
    </section>
  )
}
