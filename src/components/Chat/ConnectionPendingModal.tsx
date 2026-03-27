'use client'

import { X, Loader2 } from 'lucide-react'

interface ConnectionPendingModalProps {
  strangerCode: string
  onCancel: () => void
}

export function ConnectionPendingModal({ strangerCode, onCancel }: ConnectionPendingModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
         style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)' }}>
      <div className="card max-w-sm w-full p-8 text-center relative"
           style={{ background: '#0d0d0d' }}>
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-[#444] hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Pulse circle */}
        <div className="relative mx-auto w-20 h-20 mb-6">
          <div className="absolute inset-0 rounded-full animate-ping opacity-20 bg-[#f6b7f6]" />
          <div className="relative w-full h-full rounded-full flex items-center justify-center bg-[#191919] border border-white/5">
            <Loader2 className="w-8 h-8 text-[#f6b7f6] animate-spin" />
          </div>
        </div>

        <h2 className="text-white font-bold text-xl mb-2 tracking-tight">Handshake Protocol</h2>
        <p className="text-[#646464] text-[11px] uppercase font-bold tracking-[0.2em] mb-6">
          Waiting for <span className="text-[#f6b7f6]">{strangerCode}</span> to bond...
        </p>

        <div className="flex items-center gap-2 p-3 rounded-xl text-xs text-[#555]"
             style={{ background: '#111', border: '1px solid #1a1a1a' }}>
          ⚡ If they skip, this request will expire automatically.
        </div>

        <button onClick={onCancel} className="btn-ghost w-full mt-4 text-sm">
          Cancel Request
        </button>
      </div>
    </div>
  )
}
