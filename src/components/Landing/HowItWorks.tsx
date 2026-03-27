'use client'

import { Users, MessageCircle, Link2, Heart } from 'lucide-react'

const STEPS = [
  { num: '01', icon: Users, label: 'Match', desc: 'Instant pairing with a stranger from anywhere in the world.' },
  { num: '02', icon: MessageCircle, label: 'Chat', desc: 'Exchange messages in our clean, distraction-free environment.' },
  { num: '03', icon: Link2, label: 'Connect', desc: 'Find common ground through pure, unfiltered dialogue.' },
  { num: '04', icon: Heart, label: 'Friends', desc: 'Take the leap and reveal your identity to start a lasting bond.', active: true },
]

export function HowItWorks() {
  return (
    <section className="py-32 px-6 border-t border-[#111]" id="how-it-works">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">The Journey of Connection</h2>
          <div className="glow-divider w-24 mx-auto" />
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
          {/* Connector line */}
          <div className="hidden md:block absolute top-8 left-[12%] right-[12%] h-px bg-[#1f1f1f]" />
          
          {STEPS.map((step, i) => (
            <div key={i} className="flex flex-col items-center text-center relative" data-aos="fade-up" data-aos-delay={i * 100}>
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center text-sm font-bold mb-6 relative z-10 transition-all duration-300"
                style={{
                  background: step.active
                    ? 'linear-gradient(135deg, #f6b7f6, #c88dc8)'
                    : '#111',
                  border: `1px solid ${step.active ? 'transparent' : '#2a2a2a'}`,
                  color: step.active ? '#3c0d42' : '#555',
                  boxShadow: step.active ? '0 0 30px rgba(246,183,246,0.2)' : 'none',
                }}
              >
                {step.active ? <step.icon className="w-6 h-6" /> : step.num}
              </div>
              <div className="text-white font-semibold text-lg mb-2">{step.label}</div>
              <p className="text-[#555] text-sm leading-relaxed max-w-[180px]">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
