'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Users, Search, LayoutDashboard, MessageSquare, Settings, 
  ArrowRight, Link2, LogOut, Plus, Phone, ExternalLink 
} from 'lucide-react'
import { Header } from '@/components/Navigation/Header'
import { Footer } from '@/components/Navigation/Footer'
import { useAuthContext } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
// Custom lightweight time formatter to avoid external dependencies
function formatRelativeTime(date: Date | string): string {
  try {
    const d = typeof date === 'string' ? new Date(date) : date
    if (isNaN(d.getTime())) return String(date)
    
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000)
    
    if (diffInSeconds < 60) return 'Just now'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
  } catch (err) {
    return String(date)
  }
}

interface Friend {
  friendshipId: string
  uid: string
  strangRCode: string
  petName?: string
  phoneNumber?: string
  lastMessage?: string
  lastSeen?: string
  avatarInitials: string
  avatarGradient: string
}

const MOCK_FRIENDS: Friend[] = [
  {
    friendshipId: '1',
    uid: 'abc123',
    strangRCode: 'SR-8812-A',
    petName: 'Spicy Lemon',
    phoneNumber: '+1 (555) 012-9934',
    lastMessage: 'That jazz bar downtown has the best vibe...',
    lastSeen: '2m ago',
    avatarInitials: 'SL',
    avatarGradient: 'from-pink-400 to-purple-600',
  },
  {
    friendshipId: '2',
    uid: 'def456',
    strangRCode: 'SR-0045-K',
    petName: 'Midnight Coffee',
    phoneNumber: '+44 7700 900123',
    lastMessage: 'Did you finish that book we talked about?',
    lastSeen: '1h ago',
    avatarInitials: 'MC',
    avatarGradient: 'from-orange-400 to-red-600',
  },
  {
    friendshipId: '3',
    uid: 'ghi789',
    strangRCode: 'SR-5521-M',
    petName: 'Velvet Rain',
    phoneNumber: '+81 90 1234 5678',
    lastMessage: 'The city lights look amazing tonight.',
    lastSeen: 'Yesterday',
    avatarInitials: 'VR',
    avatarGradient: 'from-blue-400 to-pink-500',
  },
]

export default function FriendsPage() {
  const { user, isAuthenticated, isLoading } = useAuthContext()
  const router = useRouter()
  const [friends, setFriends] = useState<Friend[]>(MOCK_FRIENDS)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.push('/auth/login')
  }, [isAuthenticated, isLoading, router])

  const handleRemoveFriend = (id: string) => {
    if (confirm('Are you sure you want to disconnect?')) {
      setFriends(prev => prev.filter(f => f.friendshipId !== id))
    }
  }

  const filteredFriends = friends.filter(friend => 
    friend.petName?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    friend.strangRCode.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (isLoading) return null

  return (
    <div className="min-h-screen bg-[#0e0e0e] text-white font-sans selection:bg-[#C54B8C]/20">
      <Header />

      <main className="pt-28 pb-32 max-w-screen-2xl mx-auto px-10">
        {/* Main List */}
        <section className="space-y-12">
          {/* Header & Search */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tighter">Your Circle</h1>
              <p className="text-[#555] mt-3 text-lg font-serif italic">Anonymous connections, tangible bonds.</p>
            </div>
            <div className="relative w-full md:w-96 group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-[#333] group-focus-within:text-[#f6b7f6] transition-colors" size={18} />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Find a friend..."
                className="w-full bg-transparent border-b-2 border-[#1a1a1a] py-4 pl-14 pr-4 focus:outline-none focus:border-[#f6b7f6] transition-all text-sm decoration-transparent"
              />
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredFriends.map((friend) => (
              <div key={friend.friendshipId} className="group relative bg-[#121212] rounded-3xl p-8 hover:bg-[#161616] transition-all duration-500 border border-white/5">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-5">
                    <div className={`w-16 h-16 rounded-full bg-gradient-to-tr ${friend.avatarGradient} flex items-center justify-center font-bold text-black text-2xl shadow-xl transform group-hover:scale-105 transition-transform`}>
                      {friend.avatarInitials}
                    </div>
                    <div>
                      <h3 className="font-bold text-xl text-white group-hover:text-[#f6b7f6] transition-colors">{friend.petName}</h3>
                      <p className="text-[10px] font-mono text-[#444] uppercase tracking-widest">{friend.strangRCode}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#333]">
                    {friend.lastSeen 
                      ? formatRelativeTime(friend.lastSeen)
                      : 'Never'}
                  </span>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3 text-sm text-[#555]">
                    <Phone size={16} />
                    <span className="font-medium">{friend.phoneNumber}</span>
                  </div>
                  <div className="p-4 bg-[#0a0a0a] rounded-2xl border-l-[3px] border-[#f6b7f6]/20 italic">
                    <p className="text-sm text-[#777] line-clamp-2 leading-relaxed">"{friend.lastMessage}"</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-white/5">
                  <button 
                    onClick={() => router.push(`/dashboard?friend=${friend.friendshipId}`)}
                    className="text-[10px] font-bold uppercase tracking-widest text-[#f6b7f6] flex items-center gap-2 hover:translate-x-2 transition-transform"
                  >
                    Open Chat <ArrowRight size={14} />
                  </button>
                  <button 
                    onClick={() => handleRemoveFriend(friend.friendshipId)}
                    className="text-[10px] font-bold uppercase tracking-widest text-red-900/40 hover:text-red-500 transition-colors flex items-center gap-2"
                  >
                    <LogOut size={14} /> Disconnect
                  </button>
                </div>
              </div>
            ))}

            {/* Empty State / Add Action */}
            <Link 
              href="/dashboard"
              className="group relative bg-transparent rounded-3xl p-8 border-2 border-dashed border-[#1a1a1a] flex flex-col items-center justify-center text-center gap-6 hover:border-[#f6b7f6]/30 transition-all cursor-pointer"
            >
              <div className="w-16 h-16 rounded-full bg-[#141414] flex items-center justify-center text-[#f6b7f6] group-hover:scale-110 group-hover:bg-[#1a1a1a] transition-all duration-500">
                <Plus size={32} />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-lg text-white group-hover:text-[#f6b7f6] transition-colors">Meet Someone New</h3>
                <p className="text-[10px] text-[#444] uppercase tracking-widest">Start a fresh conversation in the void.</p>
              </div>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
