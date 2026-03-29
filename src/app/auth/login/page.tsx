'use client'

import Link from 'next/link'
import { Link2, Shield } from 'lucide-react'
import { useAuthContext } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function LoginPage() {
  const { signInWithGoogle, isAuthenticated, isLoading } = useAuthContext()
  const router = useRouter()

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      router.push('/dashboard')
    }
  }, [isAuthenticated, isLoading, router])

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle()
      router.push('/dashboard')
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-16">
        
        {/* Logo icon */}
        <div className="w-20 h-20 flex items-center justify-center mb-8">
          <img src="/images/logo.png" alt="StrangR Logo" className="w-16 h-16 object-contain" />
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">
          STRANG<span className="text-[#f6b7f6]">R</span>
        </h1>
        <p className="text-white font-medium mb-1">Welcome back to the void.</p>
        <p className="text-[#555] text-sm italic mb-12">Your anonymity is our sanctuary.</p>

        {/* Google button */}
        <button
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          className="w-full max-w-sm flex items-center justify-center gap-3 py-4 px-6 rounded-full font-semibold text-[#3c0d42] transition-all duration-300 hover:opacity-90 hover:scale-[1.02] active:scale-100 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ background: 'linear-gradient(135deg, #f6b7f6, #c88dc8)' }}
        >
          {/* Google "G" icon */}
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </button>

        {/* Privacy note */}
        <div className="flex items-center gap-2 mt-12 text-[#333]">
          <Shield className="w-3.5 h-3.5" />
          <span className="text-[11px]">Your data is encrypted and anonymous by default</span>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-[#111] px-6 py-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group transition-opacity hover:opacity-80">
          <div className="w-6 h-6 flex items-center justify-center">
            <img src="/images/logo.png" alt="StrangR Logo" className="w-full h-full object-contain" />
          </div>
          <span className="text-[#333] text-sm font-bold uppercase tracking-widest transition-colors group-hover:text-[#f6b7f6]">STRANG<span className="text-[#f6b7f6]">R</span></span>
        </Link>
        <nav className="flex gap-6">
          {['Privacy', 'Terms', 'Safety'].map(l => (
            <Link key={l} href={`/${l.toLowerCase()}`} className="text-[11px] text-[#333] hover:text-[#555] uppercase tracking-widest transition-colors">
              {l}
            </Link>
          ))}
        </nav>
        <span className="text-[11px] text-[#222]">© 2024 StrangR. The Ethereal Dialogue.</span>
      </div>
    </div>
  )
}
