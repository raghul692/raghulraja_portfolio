'use client'

import { useState, useEffect, lazy, Suspense } from 'react'
import { AnimatePresence } from 'framer-motion'
import { Bot, Sparkles } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Hero from '@/components/sections/Hero'
import About from '@/components/sections/About'
import Projects from '@/components/sections/Projects'
import Experience from '@/components/sections/Experience'
import Certificates from '@/components/sections/Certificates'
import Contact from '@/components/sections/Contact'
import { ScrollProgress } from '@/components/animations/ScrollProgress'
import { CustomCursor } from '@/components/animations/CustomCursor'
import Education from '@/components/sections/Education'
import { ToastContainer } from '@/components/ui/ToastNotification'
import EnvironmentalBackdrop from '@/components/animations/EnvironmentalBackdrop'

const CommandPalette = lazy(() =>
  import('@/components/animations/CommandPalette').then(mod => ({ default: mod.CommandPalette }))
)
const PortfolioAIHub = lazy(() => import('@/components/ai/PortfolioAIHub'))


export default function App() {
  const [commandOpen, setCommandOpen] = useState(false)
  const [aiHubOpen, setAiHubOpen] = useState(false)

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setCommandOpen(open => !open)
      }
    }
    window.addEventListener('keydown', down)
    return () => window.removeEventListener('keydown', down)
  }, [])

  return (
    <div className="relative min-h-screen bg-surface-dark text-foreground overflow-x-hidden">
      <EnvironmentalBackdrop />
      <CustomCursor />
      <ScrollProgress />
      <ToastContainer />
      <Navbar />
      <main className="relative z-10">
        <Hero />
        <About />
        <Projects />
        <Experience />
        <Education />
        <Certificates />
        <Contact />
      </main>
      <Footer />

      {/* FLOATING PORTFOLIO AI LAUNCHER BUTTON */}
      <button
        onClick={() => setAiHubOpen(true)}
        aria-label="Open AI Portfolio Suite"
        className="fixed bottom-6 right-6 z-40 px-4 py-3 rounded-full bg-gradient-to-r from-primary to-cyan-400 text-black font-bold shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer border border-white/20 group"
      >
        <div className="relative">
          <Bot className="w-5 h-5 group-hover:rotate-12 transition-transform" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-black animate-ping" />
        </div>
        <span className="text-xs uppercase tracking-wider font-mono">Portfolio AI Suite</span>
        <Sparkles className="w-4 h-4 text-black/80" />
      </button>

      {/* PORTFOLIO AI MODAL HUB */}
      {aiHubOpen && (
        <Suspense fallback={null}>
          <PortfolioAIHub isOpen={aiHubOpen} onClose={() => setAiHubOpen(false)} />
        </Suspense>
      )}

      <AnimatePresence>
        {commandOpen && (
          <Suspense fallback={null}>
            <CommandPalette
              onClose={() => setCommandOpen(false)}
              onOpenAiHub={() => setAiHubOpen(true)}
            />
          </Suspense>
        )}
      </AnimatePresence>
    </div>
  )
}

