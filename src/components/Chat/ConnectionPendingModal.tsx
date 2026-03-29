'use client'

import { X, Loader2 } from 'lucide-react'

interface ConnectionPendingModalProps {
  strangerCode: string
  onCancel: () => void
  onClose: () => void
}

export function ConnectionPendingModal({ strangerCode, onCancel, onClose }: ConnectionPendingModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <div className="bg-[#0a0a0a] border border-white/5 max-w-sm w-full p-8 rounded-[32px] text-center relative shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-[#333] hover:text-white transition-colors p-2"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Loading Ring */}
        <div className="relative mx-auto w-24 h-24 mb-8">
          <div className="absolute inset-0 rounded-full border-2 border-[#f6b7f6]/10" />
          <div className="absolute inset-0 rounded-full border-t-2 border-[#f6b7f6] animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 bg-[#f6b7f6]/5 rounded-full blur-xl animate-pulse" />
          </div>
        </div>

        <h2 className="text-white font-medium text-2xl mb-2 tracking-tight">Connection Request Proposed</h2>
        <p className="text-[#666] text-sm mb-10">
          Hoping for a connection...
        </p>

        <button 
          onClick={onCancel} 
          className="text-[#f6b7f6] text-sm font-medium hover:opacity-80 transition-opacity uppercase tracking-widest"
        >
          Cancel proposal
        </button>
      </div>
    </div>
  )
}
