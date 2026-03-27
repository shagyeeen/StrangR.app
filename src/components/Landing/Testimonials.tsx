'use client'

import { Star } from 'lucide-react'

const TESTIMONIALS = [
  {
    quote: "I've never been one for social media, but StrangR feels different. It's like those midnight conversations you have on a train. Fleeting but deeply impactful.",
    name: 'Anonymous Wanderer',
    since: 'User since 2023',
    initials: 'AW',
    color: '#f6b7f6',
  },
  {
    quote: "The identity reveal feature is genius. I met my now-best friend on here. We talked for 4 hours before even knowing what the other person looked like.",
    name: 'Hidden Soul',
    since: 'User since 2024',
    initials: 'HS',
    color: '#d6a3d6',
  },
  {
    quote: "Finally, a place where I'm not being sold anything. Just pure conversation. It's a breath of fresh air in today's internet.",
    name: 'Digital Hermit',
    since: 'User since 2023',
    initials: 'DH',
    color: '#b68fb6',
  },
]

export function Testimonials() {
  return (
    <section className="py-32 px-6 border-t border-[#111]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Heard from the Void</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <div key={i} className="card p-8 flex flex-col gap-6 hover:border-[#2a2a2a] transition-all duration-300" data-aos="fade-up" data-aos-delay={i * 150}>
              {/* Quote mark */}
              <div className="text-5xl text-[#1f1f1f] font-serif leading-none select-none">&ldquo;</div>
              
              <p className="text-[#888] leading-relaxed text-sm -mt-4">{t.quote}</p>
              
              {/* Stars */}
              <div className="flex gap-1">
                {[...Array(5)].map((_, s) => (
                  <Star key={s} className="w-3 h-3 fill-[#f6b7f6] text-[#f6b7f6]" />
                ))}
              </div>
              
              {/* User */}
              <div className="flex items-center gap-3 pt-2 border-t border-[#1a1a1a]">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white"
                  style={{ background: `linear-gradient(135deg, ${t.color}, #1a1a1a)` }}
                >
                  {t.initials}
                </div>
                <div>
                  <div className="text-white text-sm font-medium">{t.name}</div>
                  <div className="text-[#444] text-xs">{t.since}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
