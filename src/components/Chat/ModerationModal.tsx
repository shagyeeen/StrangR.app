'use client'

import { X, Search, ShieldAlert, AlertTriangle } from 'lucide-react'

interface ModerationModalProps {
  type: 'skip' | 'report'
  reportCount?: number
  maxReports?: number
  onClose: () => void
}

export function ModerationModal({ type, reportCount, maxReports = 5, onClose }: ModerationModalProps) {
  const isSkip = type === 'skip'

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center px-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div 
        className="w-full max-w-sm rounded-[2.5rem] p-8 relative overflow-hidden shadow-2xl border border-white/10"
        style={{ 
          background: 'linear-gradient(160deg, #0d0d0d 0%, #1a1a1a 100%)',
          boxShadow: isSkip ? '0 25px 50px -12px rgba(197, 75, 140, 0.2)' : '0 25px 50px -12px rgba(239, 68, 68, 0.2)'
        }}
      >
        {/* Glow effect */}
        <div 
          className="absolute -top-20 -right-20 w-40 h-40 rounded-full blur-[80px] opacity-20 pointer-events-none" 
          style={{ backgroundColor: isSkip ? '#f6b7f6' : '#ef4444' }}
        />

        <div className="relative z-10 flex flex-col items-center text-center">
          {/* Icon */}
          <div 
            className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 shadow-lg`}
            style={{ 
              background: isSkip 
                ? 'linear-gradient(135deg, #f6b7f6 0%, #c54b8c 100%)' 
                : 'linear-gradient(135deg, #ef4444 0%, #7f1d1d 100%)' 
            }}
          >
            {isSkip ? (
              <Search className="text-white" size={32} />
            ) : (
              <ShieldAlert className="text-white" size={32} />
            )}
          </div>

          {/* Text */}
          <h2 className="text-2xl font-bold text-white mb-3">
            {isSkip ? 'Stranger Skipped' : 'Warning: Reported'}
          </h2>
          
          <p className="text-[#888] mb-8 leading-relaxed">
            {isSkip 
              ? 'Your partner has skipped the chat. We are already searching for a new stranger for you.'
              : `Your partner has reported you for inappropriate behavior. Please maintain respect.`
            }
          </p>

          {/* Report Counter */}
          {!isSkip && reportCount !== undefined && (
            <div className="w-full bg-white/5 rounded-2xl p-4 mb-8 border border-white/5">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs uppercase tracking-widest text-[#555] font-bold">Risk Level</span>
                <span className={`text-xs font-bold ${reportCount >= 4 ? 'text-red-500' : 'text-amber-500'}`}>
                  {reportCount}/{maxReports} Reports
                </span>
              </div>
              <div className="h-2 w-full bg-black/40 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-1000 ${reportCount >= 4 ? 'bg-red-500' : 'bg-amber-500'}`}
                  style={{ width: `${(reportCount / maxReports) * 100}%` }}
                />
              </div>
              {reportCount >= 3 && (
                <div className="flex items-center gap-2 mt-3 text-[10px] text-red-400 font-medium">
                  <AlertTriangle size={12} />
                  <span>Nearing ban threshold. Be careful!</span>
                </div>
              )}
            </div>
          )}

          {/* Action Button */}
          <button
            onClick={onClose}
            className="w-full py-4 rounded-2xl font-bold tracking-widest text-sm transition-all hover:scale-105 active:scale-95 shadow-xl"
            style={{ 
              background: 'linear-gradient(135deg, #333 0%, #111 100%)',
              color: 'white',
              border: '1px solid rgba(255,255,255,0.05)'
            }}
          >
            UNDERSTOOD
          </button>
        </div>

        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-[#444] hover:text-white transition-colors"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  )
}
