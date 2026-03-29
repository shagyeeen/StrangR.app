'use client'

import { useEffect } from 'react'
import { Header } from '@/components/Navigation/Header'
import { Footer } from '@/components/Navigation/Footer'
import { Hero } from '@/components/Landing/Hero'
import { Features } from '@/components/Landing/Features'
import { HowItWorks } from '@/components/Landing/HowItWorks'
import { Testimonials } from '@/components/Landing/Testimonials'
import { ShyneShowcase } from '@/components/Landing/ShyneShowcase'

export default function HomePage() {
  useEffect(() => {
    // Initialize AOS
    const initAOS = async () => {
      const AOS = (await import('aos')).default
      // @ts-ignore
      await import('aos/dist/aos.css')
      AOS.init({
        duration: 700,
        easing: 'ease-out-cubic',
        once: true,
        offset: 60,
      })
    }
    initAOS()
  }, [])

  return (
    <main className="bg-black min-h-screen">
      <Header />
      <Hero />
      <Features />
      <HowItWorks />
      <ShyneShowcase />
      <Footer />
    </main>
  )
}
