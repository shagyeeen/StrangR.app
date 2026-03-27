'use client'

import { Settings, Shield, Bell, Eye, Database, HelpCircle, HardDrive, Cpu, Cloud, Globe, Lock, Trash2, Sliders } from 'lucide-react'
import { useAuthContext } from '@/context/AuthContext'
import { Header } from '@/components/Navigation/Header'
import { Footer } from '@/components/Navigation/Footer'

export default function SettingsPage() {
  const { user } = useAuthContext()

  const SETTINGS_CATEGORIES = [
    { title: 'Identity', icon: Lock, desc: 'Manage your credentials, password, and security layers.' },
    { title: 'Privacy', icon: Eye, desc: 'Control who sees your status and how your data is bridge.' },
    { title: 'Frequency', icon: Sliders, desc: 'Fine-tune your matching algorithm and preferences.' },
    { title: 'Syncing', icon: Cloud, desc: 'Manage your conversation history and cloud persistence.' },
  ]

  return (
    <div className="min-h-screen bg-black flex flex-col font-sans selection:bg-[#f6b7f6]/30">
      <Header />
      
      <main className="flex-1 pt-28 pb-32 px-10">
        <div className="max-w-screen-2xl mx-auto">
          <div className="space-y-12">
            {/* Settings Header */}
            <div className="relative p-8 rounded-3xl overflow-hidden border border-white/5 bg-[#080808]">
              <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#f6b7f6]/5 blur-[120px] -mr-32 -mt-32" />
              
              <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
                <div className="w-24 h-24 rounded-3xl flex items-center justify-center flex-shrink-0 shadow-2xl shadow-[#f6b7f6]/20 bg-[#111] border border-white/5">
                  <Settings className="w-12 h-12 text-[#f6b7f6]" strokeWidth={1} />
                </div>
                
                <div className="text-center md:text-left">
                  <h1 className="text-3xl font-black text-white mb-4 tracking-tighter leading-none uppercase">
                    Command <span className="text-[#f6b7f6]">Center</span>
                  </h1>
                  <p className="text-xl text-[#666] font-medium max-w-xl">
                    Tailor the StrangR architecture to your specific frequency. Manage your privacy, security, and experience.
                  </p>
                </div>
              </div>
            </div>

            {/* Main Settings Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-12">
              {/* Categories Sidebar (Internal) */}
              <div className="xl:col-span-4 space-y-4">
                 {SETTINGS_CATEGORIES.map((cat, i) => (
                   <div key={i} className="p-6 rounded-3xl bg-[#0c0c0c] border border-white/5 group cursor-pointer hover:bg-[#111] hover:border-[#f6b7f6]/20 transition-all">
                      <div className="flex items-center gap-4 mb-3">
                         <div className="p-2.5 rounded-2xl bg-white/5 flex items-center justify-center text-[#555] group-hover:text-[#f6b7f6] transition-colors">
                            <cat.icon size={20} />
                         </div>
                         <h4 className="text-white font-bold tracking-tight">{cat.title}</h4>
                      </div>
                      <p className="text-[#444] text-[10px] font-bold uppercase tracking-widest group-hover:text-[#666] transition-colors">{cat.desc}</p>
                   </div>
                 ))}
              </div>

              {/* Settings Form Content */}
              <div className="xl:col-span-8 space-y-8">
                <div className="p-8 rounded-3xl bg-[#0c0c0c] border border-white/5 space-y-10">
                   <div className="space-y-6">
                      <h3 className="text-xl font-black text-white tracking-tight flex items-center gap-3">
                        <Bell className="w-5 h-5 text-[#f6b7f6]" /> Notifications
                      </h3>
                      
                      <div className="space-y-4">
                         {[
                           { label: 'Push Notifications', desc: 'Receive real-time frequency bridge requests.' },
                           { label: 'Sound Alerts', desc: 'Hear incoming synchronization signals.' },
                           { label: 'Unseen Pulse', desc: 'Keep track of conversations when you are offline.' },
                         ].map((item, i) => (
                           <div key={i} className="p-6 rounded-3xl bg-black border border-white/5 flex items-center justify-between group cursor-pointer hover:border-[#f6b7f6]/20 transition-all">
                              <div className="space-y-1">
                                <span className="text-white font-bold text-sm tracking-tight">{item.label}</span>
                                <p className="text-[#444] text-[10px] font-bold uppercase tracking-widest">{item.desc}</p>
                              </div>
                              <div className={`w-12 h-6 rounded-full relative ${i < 2 ? 'bg-[#f6b7f6]/20 border border-[#f6b7f6]/30' : 'bg-white/5 border border-white/10'}`}>
                                 <div className={`absolute top-1 w-4 h-4 rounded-full transition-all ${i < 2 ? 'right-1 bg-[#f6b7f6] shadow-[0_0_10px_#f6b7f6]' : 'left-1 bg-[#333]'}`} />
                              </div>
                           </div>
                         ))}
                      </div>
                   </div>

                   <hr className="border-white/5" />

                   <div className="space-y-6">
                      <h3 className="text-xl font-black text-white tracking-tight flex items-center gap-3">
                        <Globe className="w-5 h-5 text-[#f6b7f6]" /> Integration
                      </h3>
                      
                      <div className="p-8 rounded-[32px] bg-black border border-white/5 flex items-center justify-between group">
                         <div className="flex items-center gap-6">
                            <div className="w-16 h-16 rounded-[24px] bg-[#f6b7f6]/5 border border-[#f6b7f6]/10 flex items-center justify-center p-3">
                               <img src="/images/logo.png" alt="Stitch Link" className="w-full h-full object-contain opacity-40 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <div>
                               <p className="text-white font-black text-lg tracking-tight">Sync with Stitch</p>
                               <p className="text-[#444] text-[10px] font-bold uppercase tracking-widest">Connect your design system node</p>
                            </div>
                         </div>
                         <button className="px-6 h-12 rounded-2xl bg-white/5 border border-white/5 text-white font-black text-xs uppercase tracking-widest hover:bg-white hover:text-black transition-all">
                            CONNECTED
                         </button>
                      </div>
                   </div>

                   <hr className="border-white/5" />

                   <div className="space-y-6">
                      <h3 className="text-xl font-black text-white tracking-tight flex items-center gap-3 text-red-500/80">
                        <Trash2 className="w-5 h-5" /> Danger Zone
                      </h3>
                      <div className="p-8 rounded-[32px] bg-red-500/[0.02] border border-red-500/10 space-y-4">
                         <p className="text-[#555] text-sm font-medium leading-relaxed">
                            Deleting your StrangR account is permanent and irreversible. All your matched frequencies, historical data, and premium access will be purged immediately from the mesh.
                         </p>
                         <button className="h-14 px-8 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 font-bold text-xs uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all">
                            TERMINATE NODE
                         </button>
                      </div>
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
