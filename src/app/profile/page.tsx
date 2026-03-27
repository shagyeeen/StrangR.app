'use client'

import { Crown, MessageSquare, Star, Zap, Shield, User, Camera, Heart, Link2 } from 'lucide-react'
import { useAuthContext } from '@/context/AuthContext'
import { Header } from '@/components/Navigation/Header'
import { Footer } from '@/components/Navigation/Footer'

export default function ProfilePage() {
  const { user } = useAuthContext()
  const isPremium = user?.premiumStatus

  return (
    <div className="min-h-screen bg-black flex flex-col font-sans selection:bg-[#f6b7f6]/30">
      <Header />
      
      <main className="flex-1 pt-28 pb-32 px-10">
        <div className="max-w-screen-2xl mx-auto">
          <div className="space-y-12">
            {/* Profile Header */}
            <div className="relative p-8 rounded-3xl overflow-hidden border border-white/5 bg-[#080808]">
              <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#f6b7f6]/5 blur-[120px] -mr-32 -mt-32" />
              
              <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
                <div className="relative group">
                  <div className="w-40 h-40 rounded-[48px] overflow-hidden border-2 border-white/5 bg-[#111] flex items-center justify-center p-6">
                     <img src="/images/logo.png" alt="Profile" className="w-full h-full object-contain opacity-20" />
                     <User className="absolute inset-0 w-16 h-16 text-white m-auto opacity-40 group-hover:opacity-100 transition-opacity" strokeWidth={1.5} />
                  </div>
                  <button className="absolute bottom-2 right-2 w-10 h-10 rounded-2xl bg-[#f6b7f6] text-[#3c0d42] flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-all">
                    <Camera size={18} />
                  </button>
                </div>

                <div className="text-center md:text-left space-y-4">
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                    <h1 className="text-4xl font-black text-white tracking-tighter leading-none">
                      {user?.displayName || 'Unknown Stranger'}
                    </h1>
                    {isPremium ? (
                      <div className="px-4 py-1.5 rounded-full bg-[#f6b7f6]/10 border border-[#f6b7f6]/20 text-[#f6b7f6] text-[10px] font-black tracking-widest uppercase flex items-center gap-2">
                        <Crown size={12} fill="currentColor" />
                        PREMIUM
                      </div>
                    ) : (
                      <div className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[#555] text-[10px] font-black tracking-widest uppercase">
                        STANDARD
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-6">
                    <div className="text-[#f6b7f6] font-mono text-lg font-bold">
                       {user?.strangRCode || 'SR-0000-X'}
                    </div>
                    <div className="h-4 w-px bg-white/10 mt-1 hidden sm:block" />
                    <div className="text-[#555] font-bold text-sm tracking-widest uppercase mt-1">
                      Joined: {user?.accountCreatedDate ? new Date(user.accountCreatedDate).toLocaleDateString() : 'Mar 2026'}
                    </div>
                  </div>

                  <p className="text-[#666] font-medium max-w-xl text-lg leading-relaxed">
                    Always connected, never truly known. Wandering the frequencies of StrangR in search of meaningful silence.
                  </p>
                </div>
              </div>
            </div>

            {/* Stats & Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-8 rounded-[40px] bg-[#0c0c0c] border border-white/5 flex flex-col items-center justify-center text-center space-y-4 group hover:bg-[#111] transition-colors">
                <div className="w-14 h-14 rounded-3xl bg-[#f6b7f6]/10 border border-[#f6b7f6]/20 flex items-center justify-center text-[#f6b7f6] group-hover:scale-110 transition-transform">
                  <MessageSquare size={24} />
                </div>
                <div>
                  <p className="text-3xl font-black text-white tracking-tighter leading-none mb-1">124</p>
                  <p className="text-[10px] font-black text-[#444] uppercase tracking-widest">Conversations</p>
                </div>
              </div>

              <div className="p-8 rounded-[40px] bg-[#0c0c0c] border border-white/5 flex flex-col items-center justify-center text-center space-y-4 group hover:bg-[#111] transition-colors">
                <div className="w-14 h-14 rounded-3xl bg-[#f6b7f6]/10 border border-[#f6b7f6]/20 flex items-center justify-center text-[#f6b7f6] group-hover:scale-110 transition-transform">
                  <Heart size={24} />
                </div>
                <div>
                  <p className="text-3xl font-black text-white tracking-tighter leading-none mb-1">12</p>
                  <p className="text-[10px] font-black text-[#444] uppercase tracking-widest">Mutual Bonds</p>
                </div>
              </div>

              <div className="p-8 rounded-[40px] bg-[#0c0c0c] border border-white/5 flex flex-col items-center justify-center text-center space-y-4 group hover:bg-[#111] transition-colors">
                <div className="w-14 h-14 rounded-3xl bg-[#f6b7f6]/10 border border-[#f6b7f6]/20 flex items-center justify-center text-[#f6b7f6] group-hover:scale-110 transition-transform">
                  <Star size={24} />
                </div>
                <div>
                  <p className="text-3xl font-black text-white tracking-tighter leading-none mb-1">4.8</p>
                  <p className="text-[10px] font-black text-[#444] uppercase tracking-widest">Charm Score</p>
                </div>
              </div>
            </div>

            {/* Profile Content */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              {/* Detailed Settings/Bio */}
              <div className="lg:col-span-8 space-y-8">
                <div className="p-10 rounded-[40px] bg-[#080808] border border-white/5 space-y-8">
                  <h3 className="text-xl font-black text-white tracking-tight flex items-center gap-3">
                    <span className="text-[#f6b7f6]">#</span> Identity Details
                  </h3>
                  
                  <div className="space-y-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-[#444] uppercase tracking-[0.2em] px-1">Display Name</label>
                       <input 
                         type="text" 
                         className="w-full h-16 rounded-3xl bg-black border border-white/5 px-8 text-white font-bold focus:border-[#f6b7f6]/50 focus:ring-1 focus:ring-[#f6b7f6]/50 transition-all outline-none" 
                         defaultValue={user?.displayName}
                       />
                    </div>
                    
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-[#444] uppercase tracking-[0.2em] px-1">About Me</label>
                       <textarea 
                         rows={4}
                         className="w-full rounded-3xl bg-black border border-white/5 p-8 text-white font-medium focus:border-[#f6b7f6]/50 transition-all outline-none resize-none leading-relaxed" 
                         defaultValue="Always connected, never truly known. Wandering the frequencies of StrangR in search of meaningful silence."
                       />
                    </div>

                    <div className="pt-4">
                      <button className="h-16 px-12 rounded-[24px] bg-white text-black font-black text-sm tracking-tight hover:bg-[#f6b7f6] hover:text-[#3c0d42] transition-colors shadow-2xl shadow-black">
                        SAVE CHANGES
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-10 rounded-[40px] bg-[#080808] border border-white/5 space-y-8">
                  <h3 className="text-xl font-black text-white tracking-tight flex items-center gap-3">
                    <span className="text-[#f6b7f6]">#</span> Privacy Sync
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-6 rounded-3xl bg-black border border-white/5 flex items-center justify-between group cursor-pointer hover:border-[#f6b7f6]/30 transition-all">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center text-[#555] group-hover:text-[#f6b7f6] transition-colors">
                          <Shield size={20} />
                        </div>
                        <span className="text-[#888] font-bold text-sm group-hover:text-white transition-colors">Stealth Mode</span>
                      </div>
                      <div className="w-12 h-6 rounded-full bg-white/5 border border-white/10 relative">
                         <div className="absolute top-1 left-1 w-4 h-4 bg-[#333] rounded-full" />
                      </div>
                    </div>

                    <div className="p-6 rounded-3xl bg-black border border-white/5 flex items-center justify-between group cursor-pointer hover:border-[#f6b7f6]/30 transition-all">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center text-[#555] group-hover:text-[#f6b7f6] transition-colors">
                          <Star size={20} />
                        </div>
                        <span className="text-[#888] font-bold text-sm group-hover:text-white transition-colors">Public Code</span>
                      </div>
                      <div className="w-12 h-6 rounded-full bg-[#f6b7f6]/20 border border-[#f6b7f6]/30 relative">
                         <div className="absolute top-1 right-1 w-4 h-4 bg-[#f6b7f6] rounded-full shadow-[0_0_10px_#f6b7f6]" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar Info/Status */}
              <div className="lg:col-span-4 space-y-8">
                <div className="p-8 rounded-[40px] bg-gradient-to-b from-[#111] to-[#080808] border border-white/10 space-y-6">
                  <h4 className="text-[10px] font-black text-[#f6b7f6] uppercase tracking-[0.3em] px-2 leading-none">Status Center</h4>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 rounded-3xl bg-black/40 border border-white/5">
                      <div className="w-10 h-10 rounded-2xl bg-[#00FF5E]/10 flex items-center justify-center text-[#00FF5E]">
                         <div className="w-2 h-2 rounded-full bg-[#00FF5E] shadow-[0_0_8px_#00FF5E]" />
                      </div>
                      <div>
                        <p className="text-white font-bold text-sm">Online & Active</p>
                        <p className="text-[#444] text-[10px] font-black uppercase">Standard Node</p>
                      </div>
                    </div>

                    {!isPremium && (
                      <div className="p-6 rounded-[32px] bg-[#f6b7f6]/5 border border-[#f6b7f6]/10 space-y-4">
                        <Crown className="w-8 h-8 text-[#f6b7f6]" />
                        <p className="text-white font-black leading-tight text-xl tracking-tighter">Upgrade to Ultra</p>
                        <p className="text-[#666] text-xs font-medium leading-relaxed">Unlock the badge, skip the queues, and bridge directly to frequencies with StrangR Premium.</p>
                        <button className="w-full h-14 rounded-2xl bg-[#f6b7f6] text-[#3c0d42] font-black text-xs tracking-widest uppercase hover:scale-[1.02] active:scale-[0.98] transition-all">
                          GO PREMIUM
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-8 rounded-[40px] bg-[#0c0c0c] border border-white/5 space-y-6">
                  <h4 className="text-[10px] font-black text-[#444] uppercase tracking-[0.3em] px-2 leading-none">Security</h4>
                  <div className="space-y-3">
                    <button className="w-full h-14 rounded-2xl bg-white/5 border border-white/5 text-[#888] font-bold text-xs uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all text-left px-6">
                      Reset Password
                    </button>
                    <button className="w-full h-14 rounded-2xl bg-white/5 border border-white/5 text-[#888] font-bold text-xs uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all text-left px-6">
                      2FA Settings
                    </button>
                    <button className="w-full h-14 rounded-2xl bg-red-500/5 border border-red-500/10 text-red-500/40 font-bold text-xs uppercase tracking-widest hover:bg-red-500/10 hover:text-red-500 transition-all text-left px-6">
                      Delete Profile
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
