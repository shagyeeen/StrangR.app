'use client'

import { Lock, Shuffle, Heart, Key } from 'lucide-react'

const FEATURES = [
  {
    icon: Lock,
    title: 'Complete Anonymity',
    description: 'Your identity is your choice. Start every conversation as a blank slate, judged only by your thoughts and words. No profiles, no history, no baggage.',
    size: 'large',
    accent: true,
  },
  {
    icon: Shuffle,
    title: 'Random Matching',
    description: 'Our algorithm pairs you with someone new instantly. No swiping, just talking.',
    size: 'small',
    accent: false,
  },
  {
    icon: Heart,
    title: 'Build Real Friendships',
    description: 'Move beyond small talk. Our prompts help spark deep, meaningful dialogues.',
    size: 'small',
    accent: false,
  },
  {
    icon: Key,
    title: 'Optional Identity Sharing',
    description: 'When the connection feels right, use our secure reveal feature to share your social handles or real name. You\'re always in control.',
    size: 'large',
    accent: false,
  },
]

export function Features() {
  return (
    <section className="min-h-screen flex items-center justify-center py-20 px-6 pt-24" id="features">
      <div className="max-w-7xl mx-auto w-full">
        <div className="mb-12">
          <div className="section-eyebrow mb-4">Redefining Social Space</div>
          <p className="text-[#555] text-base">We stripped away the noise to focus on what matters: the conversation.</p>
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Row 1 */}
          <div className="card p-8 hover:border-[#f6b7f6]/30 transition-all duration-500 group relative overflow-hidden">
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                 style={{ background: 'radial-gradient(ellipse at top left, rgba(246,183,246,0.08), transparent 60%)' }} />
            <Lock className="w-8 h-8 text-[#f6b7f6] mb-6" strokeWidth={1.5} />
            <div className="text-xl font-semibold text-white mb-3">Complete Anonymity</div>
            <p className="text-[#666] leading-relaxed">
              Your identity is your choice. Start every conversation as a blank slate, judged only by your thoughts and words. No profiles, no history, no baggage.
            </p>
          </div>

          <div className="card p-8 hover:border-[#2a2a2a] transition-all duration-500 group relative overflow-hidden">
            <div className="absolute bottom-0 right-0 w-32 h-32 rounded-full opacity-5 group-hover:opacity-15 transition-opacity"
                 style={{ background: 'radial-gradient(circle, #f6b7f6, transparent)' }} />
            <Shuffle className="w-8 h-8 text-[#f6b7f6] mb-6" strokeWidth={1.5} />
            <div className="text-xl font-semibold text-white mb-3">Random Matching</div>
            <p className="text-[#666] leading-relaxed">
              Our algorithm pairs you with someone new instantly. No swiping, just talking.
            </p>
          </div>

          {/* Row 2 */}
          <div className="card p-8 hover:border-[#2a2a2a] transition-all duration-500">
            <Heart className="w-8 h-8 text-[#f6b7f6] mb-6" strokeWidth={1.5} />
            <div className="text-xl font-semibold text-white mb-3">Build Real Friendships</div>
            <p className="text-[#666] leading-relaxed">
              Move beyond small talk. Our connection system sparks deep, meaningful dialogues.
            </p>
          </div>

          <div className="card p-8 hover:border-[#f6b7f6]/30 transition-all duration-500 group relative overflow-hidden">
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                 style={{ background: 'radial-gradient(ellipse at bottom right, rgba(246,183,246,0.06), transparent 60%)' }} />
            <div className="grid grid-cols-2 gap-4 h-full">
              <div>
                <Key className="w-8 h-8 text-[#f6b7f6] mb-6" strokeWidth={1.5} />
                <div className="text-xl font-semibold text-white mb-3">Optional Identity Sharing</div>
                <p className="text-[#666] leading-relaxed text-sm">
                  When the connection feels right, use our secure reveal feature. You&apos;re always in control.
                </p>
              </div>
              {/* Visual */}
              <div className="relative flex items-center justify-center">
                <div className="w-24 h-24 rounded-full border border-[#2a2a2a] flex items-center justify-center relative overflow-hidden"
                     style={{ background: 'linear-gradient(135deg, #1a1a1a, #111)' }}>
                  <div className="absolute inset-0 flex">
                    <div className="w-1/2 h-full" style={{ background: 'linear-gradient(to right, #2a1520, transparent)' }} />
                    <div className="w-1/2 h-full" style={{ background: 'linear-gradient(to left, #1a2530, transparent)' }} />
                  </div>
                  <div className="relative z-10 flex -space-x-3">
                    <div className="w-10 h-10 rounded-full bg-[#2a1520] border border-[#3a2030]" />
                    <div className="w-10 h-10 rounded-full bg-[#1a2530] border border-[#2a3040]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
