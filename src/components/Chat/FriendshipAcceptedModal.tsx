'use client'

import { useState } from 'react'
import { Check, X, Heart, Sparkles } from 'lucide-react'

interface FriendshipAcceptedModalProps {
  strangerCode: string
  onClose: () => void
}

export function FriendshipAcceptedModal({ strangerCode, onClose }: FriendshipAcceptedModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
         style={{ background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(16px)' }}>
      <div className="card max-w-sm w-full p-8 text-center relative overflow-hidden"
           style={{ background: '#0d0d0d' }}>
        
        {/* Glow ring */}
        <div className="absolute inset-0 rounded-2xl pointer-events-none"
             style={{ boxShadow: '0 0 60px rgba(246,183,246,0.1)' }} />

        {/* Hearts burst */}
        <div className="relative mx-auto w-24 h-24 mb-6">
          <div className="absolute inset-0 rounded-full animate-ping opacity-10 bg-[#f6b7f6]" />
          <div className="relative w-full h-full rounded-full flex items-center justify-center bg-gradient-to-br from-[#f6b7f6] to-[#c88dc8] shadow-xl shadow-[#f6b7f6]/20">
            <Heart className="w-10 h-10 text-[#3c0d42] fill-[#3c0d42]" />
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-[#f6b7f6]" />
          <h2 className="text-white font-bold text-2xl tracking-tight">Bond Complete</h2>
          <Sparkles className="w-4 h-4 text-[#f6b7f6]" />
        </div>
        
        <p className="text-[#888] text-sm leading-relaxed mb-2">
          <span className="text-[#f6b7f6] font-semibold">{strangerCode}</span> has accepted the bond.
        </p>
        <p className="text-[#555] text-xs mb-8">
          You can now find them in your Friends list and decide if you'd like to share your real identity.
        </p>

        <button
          onClick={onClose}
          className="w-full py-4 rounded-full bg-[#111] border border-white/5 text-white font-bold uppercase tracking-[0.2em] text-[10px] hover:bg-white/10 transition-colors"
        >
          Continue Dialogue
        </button>
      </div>
    </div>
  )
}
