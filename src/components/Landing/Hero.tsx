'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, ChevronDown } from 'lucide-react'

const MOCK_MESSAGES = [
  { from: 'them', text: 'Hey there! Have you ever noticed how the sky looks different just before a storm? It\'s like this deep indigo...', time: '10:42 PM' },
  { from: 'me', text: 'I totally get that. It\'s like the world is holding its breath. I\'m Alex by the way, but let\'s keep it mystery-style for now?', time: '10:44 PM' },
]

export function Hero() {
  const [onlineCount, setOnlineCount] = useState(12102)
  const [msgVisible, setMsgVisible] = useState(0)

  useEffect(() => {
    // Animate online count
    const interval = setInterval(() => {
      setOnlineCount(prev => prev + Math.floor(Math.random() * 5 - 2))
    }, 3000)
    // Animate messages appearing
    const msgTimer = setTimeout(() => {
      setMsgVisible(1)
      setTimeout(() => setMsgVisible(2), 1500)
      setTimeout(() => setMsgVisible(3), 3000)
    }, 800)
    return () => {
      clearInterval(interval)
      clearTimeout(msgTimer)
    }
  }, [])

  return (
    <section className="relative h-[calc(100vh-80px)] min-h-[700px] flex items-center justify-center overflow-hidden">
      {/* Background atmosphere */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[800px] h-[800px] rounded-full opacity-10 blur-[120px]"
             style={{ background: 'radial-gradient(circle, #f6b7f6, transparent)' }} />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] rounded-full opacity-10 blur-[100px]"
             style={{ background: 'radial-gradient(circle, #c88dc8, transparent)' }} />
      </div>

      <div className="max-w-[1850px] mx-auto px-6 md:px-12 py-8 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center w-full relative z-10">
        {/* Left */}
        <div data-aos="fade-right">

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-[0.9] text-white mb-4 tracking-tighter">
            Chat with<br />
            <span className="text-white">Strangers.</span><br />
            <span className="text-[#f6b7f6] italic font-serif">Friendships.</span>
          </h1>

          <p className="text-[#444] text-base md:text-lg leading-relaxed max-w-md mb-8 font-medium">
            Completely anonymous. Purely conversation-driven. Rediscover human connection in a digital sanctuary built for depth.
          </p>

          <div className="flex items-center gap-6">
            <Link href="/auth/login" className="px-10 py-5 rounded-full bg-gradient-to-br from-[#f6b7f6] to-[#c88dc8] text-[#3c0d42] font-bold uppercase tracking-[0.2em] text-xs transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-[#f6b7f6]/20">
              Chat with a strangr
            </Link>
          </div>
        </div>

        {/* Right — Mock Chat */}
        <div className="relative hidden lg:block" data-aos="fade-left">
          <div className="rounded-3xl p-1 bg-gradient-to-br from-white/10 to-transparent shadow-2xl">
            <div className="rounded-[calc(1.5rem-4px)] overflow-hidden bg-[#0A0A0A] shadow-inner">
              {/* Chat header */}
              <div className="px-6 py-5 bg-[#191919] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#10B981] shadow-[0_0_8px_#10B981]" />
                  <span className="text-xs font-bold text-white uppercase tracking-widest">Stranger #4821</span>
                </div>
                <div className="text-[10px] text-[#444] font-bold uppercase tracking-[0.2em]">Active Now</div>
              </div>
              
              {/* Messages */}
              <div className="p-8 space-y-8 min-h-[400px] relative">
                <div className="absolute inset-0 bg-[#0A0A0A]/40 pointer-events-none" />
                <div className="relative z-10 flex flex-col gap-6">
                  {msgVisible >= 1 && (
                    <div className="fade-up">
                      <div className="text-[9px] font-bold text-[#f6b7f6] uppercase tracking-[0.3em] ml-1 mb-1.5 opacity-60">STRANGER</div>
                      <div className="bubble-stranger-editorial !max-w-[90%]">{MOCK_MESSAGES[0].text}</div>
                    </div>
                  )}
                  {msgVisible >= 2 && (
                    <div className="fade-up flex flex-col items-end">
                      <div className="text-[9px] font-bold text-[#444] uppercase tracking-[0.3em] mr-1 mb-1.5 opacity-80">YOU</div>
                      <div className="bubble-self-premium !max-w-[90%]">{MOCK_MESSAGES[1].text}</div>
                    </div>
                  )}
                  {msgVisible >= 3 && (
                    <div className="fade-up flex items-center gap-3">
                      <div className="bg-[#191919] border border-white/5 rounded-2xl rounded-tl-none px-5 py-3.5 flex items-center gap-3">
                        <span className="typing-dots-premium">
                          <span />
                          <span />
                          <span />
                        </span>
                        <span className="text-[#444] text-[10px] font-bold uppercase tracking-[0.1em] italic">Handshaking...</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Floating accent */}
          <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full opacity-10 animate-pulse-slow blur-[60px]"
               style={{ background: 'radial-gradient(circle, #f6b7f6, transparent)' }} />
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 animate-bounce opacity-20">
        <ChevronDown className="w-6 h-6 text-white" />
      </div>
    </section>
  )
}
