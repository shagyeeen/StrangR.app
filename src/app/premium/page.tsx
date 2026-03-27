'use client'

import { useState } from 'react'
import { Crown, Check, Zap, Search, Heart, Sparkles, Star } from 'lucide-react'
import { PREMIUM_PRICE } from '@/config/constants'
import { useAuthContext } from '@/context/AuthContext'
import { Header } from '@/components/Navigation/Header'
import { Footer } from '@/components/Navigation/Footer'

const PREMIUM_FEATURES = [
  { icon: Search, title: 'Search by StrangR Code', desc: 'Find and reconnect with anyone by their unique StrangR code.' },
  { icon: Heart, title: 'Priority Matching Queue', desc: 'Skip the wait and get matched faster with other premium users.' },
  { icon: Star, title: 'Premium Badge', desc: 'Show off your premium status with an exclusive badge next to your code.' },
  { icon: Sparkles, title: 'Extended Conversations', desc: 'No message limits. Chat as long as you want without interruption.' },
  { icon: Zap, title: 'Premium Denial List', desc: 'Add people you never want to be matched with again.' },
]

declare global {
  interface Window {
    Razorpay: new (options: unknown) => { open: () => void }
  }
}

export default function PremiumPage() {
  const { user, token } = useAuthContext()
  const [loading, setLoading] = useState(false)
  const [searchCode, setSearchCode] = useState('')

  const isPremium = user?.premiumStatus

  const handleSubscribe = async () => {
    setLoading(true)
    try {
      // Load Razorpay script if not loaded
      if (!document.getElementById('razorpay-script')) {
        const script = document.createElement('script')
        script.id = 'razorpay-script'
        script.src = 'https://checkout.razorpay.com/v1/checkout.js'
        document.body.appendChild(script)
        await new Promise(r => script.addEventListener('load', r))
      }

      const res = await fetch('/api/premium/razorpay-order', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      })
      const { orderId, amount } = await res.json()

      const rzp = new window.Razorpay({
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount,
        currency: 'INR',
        name: 'StrangR Premium',
        description: 'StrangR Premium Subscription',
        order_id: orderId,
        handler: (response: unknown) => {
          alert('Payment successful! Welcome to StrangR Premium.')
          window.location.reload()
        },
        prefill: { email: user?.email },
        theme: { color: '#f6b7f6' },
      })
      rzp.open()
    } catch (err) {
      console.error(err)
      alert('Payment failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black flex flex-col font-sans selection:bg-[#f6b7f6]/30">
      <Header />
      
      <main className="flex-1 pt-28 pb-32 px-10">
        <div className="max-w-screen-2xl mx-auto">
          <div className="space-y-12">
            {/* Hero Section */}
            <div className="relative p-8 rounded-3xl overflow-hidden border border-white/5 bg-[#080808]">
              <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#f6b7f6]/5 blur-[120px] -mr-32 -mt-32" />
              
              <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
                <div className="w-24 h-24 rounded-3xl flex items-center justify-center flex-shrink-0 shadow-2xl shadow-[#f6b7f6]/20"
                     style={{ background: 'linear-gradient(135deg, #f6b7f6, #3c0d42)' }}>
                  <Crown className="w-12 h-12 text-white" />
                </div>
                
                <div className="text-center md:text-left">
                  <h1 className="text-3xl font-black text-white mb-4 tracking-tighter leading-none">
                    Unlock <span className="text-[#f6b7f6]">Unlimited</span> Experiences
                  </h1>
                  <p className="text-xl text-[#666] font-medium max-w-xl">
                    Elevate your connections with StrangR Premium. The full experience, crafted for the curious.
                  </p>
                </div>
              </div>
            </div>

            {/* Pricing Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
              {/* Features Card */}
              <div className="p-8 rounded-3xl bg-[#0c0c0c] border border-white/5 space-y-6">
                <h3 className="text-lg font-bold text-white uppercase tracking-widest flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#f6b7f6]" />
                  What's Included
                </h3>
                <div className="space-y-5">
                  {PREMIUM_FEATURES.map((f, i) => (
                    <div key={i} className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center flex-shrink-0">
                        <f.icon className="w-5 h-5 text-[#f6b7f6]" />
                      </div>
                      <div>
                        <p className="text-white font-bold leading-none mb-1">{f.title}</p>
                        <p className="text-[#555] text-sm leading-relaxed">{f.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Purchase Card */}
              <div className="p-10 rounded-[40px] bg-gradient-to-b from-[#111] to-[#080808] border border-white/10 flex flex-col justify-between relative overflow-hidden group">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#f6b7f6] to-transparent opacity-50" />
                
                <div>
                  <p className="text-[10px] font-black text-[#f6b7f6] uppercase tracking-[0.3em] mb-4">MEMBER ACCESS</p>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-5xl font-black text-white tracking-tighter">₹{PREMIUM_PRICE}</span>
                    <span className="text-2xl text-[#444] font-bold">/mo</span>
                  </div>
                  <p className="text-[#555] font-medium">Cancel anytime. Instant activation.</p>
                </div>

                <div className="mt-12 space-y-4">
                  {isPremium ? (
                    <div className="p-6 rounded-3xl bg-[#f6b7f6]/10 border border-[#f6b7f6]/20 text-center">
                      <p className="text-[#f6b7f6] font-bold">Premium Subscription Active</p>
                      <p className="text-[#f6b7f6]/60 text-xs mt-1">Renewal: {user?.premiumExpiryDate?.toLocaleDateString() ?? 'Next Month'}</p>
                    </div>
                  ) : (
                    <button
                      onClick={handleSubscribe}
                      disabled={loading}
                      className="w-full h-20 rounded-[28px] bg-[#f6b7f6] text-[#3c0d42] font-black text-lg tracking-tight hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 shadow-xl shadow-[#f6b7f6]/20 disabled:opacity-50"
                    >
                      {loading ? (
                        <div className="w-6 h-6 border-4 border-[#3c0d42]/20 border-t-[#3c0d42] rounded-full animate-spin" />
                      ) : (
                        <>
                          <Zap className="w-6 h-6 fill-current" />
                          GET ACCESS NOW
                        </>
                      )}
                    </button>
                  )}
                  <p className="text-center text-[10px] text-[#333] font-bold tracking-widest uppercase">Secure checkout by Razorpay</p>
                </div>
              </div>
            </div>

            {/* Special Feature: Finder */}
            {isPremium && (
              <div className="p-12 rounded-[40px] bg-gradient-to-r from-[#0c0c0c] to-[#080808] border border-white/5 relative overflow-hidden">
                <div className="absolute right-0 top-1/2 -translate-y-1/2 -mr-32 opacity-5">
                   <Search className="w-64 h-64 text-white" />
                </div>
                
                <div className="relative z-10 max-w-xl">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="px-3 py-1 rounded-full bg-[#f6b7f6]/10 border border-[#f6b7f6]/20 text-[#f6b7f6] text-[10px] font-black tracking-widest uppercase">
                      Premium Perk
                    </div>
                    <h3 className="text-2xl font-black text-white tracking-tight">Stranger Finder</h3>
                  </div>
                  
                  <p className="text-[#666] font-medium mb-8">
                    Know their code? Reconnect instantly. Enter the unique StrangR code below to initiate a private frequency bridge.
                  </p>

                  <div className="flex gap-4 p-2 rounded-[32px] bg-black border border-white/5">
                    <input
                      type="text"
                      value={searchCode}
                      onChange={e => setSearchCode(e.target.value)}
                      placeholder="e.g. SR-4902-X"
                      className="flex-1 bg-transparent border-none outline-none px-6 text-white font-bold placeholder:text-[#333]"
                    />
                    <button className="h-14 px-8 rounded-3xl bg-white text-black font-black text-sm tracking-tight hover:bg-[#f6b7f6] hover:text-[#3c0d42] transition-colors">
                      SEARCH
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
