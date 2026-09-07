'use client'

import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { useTheme } from '@/contexts/ThemeContext'
import { cn } from '@/utils/cn'
import { navLinks } from '@/data/resume'
import type { NavLink } from '@/data/resume'
import { Menu, X, Moon, Sun, MoonStar, CloudRain, Snowflake, Volume2, VolumeX } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import soundEngine from '@/utils/soundEngine'

export default function Navbar() {
  const { theme, toggleTheme, activeMetadata } = useTheme()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isMuted, setIsMuted] = useState(soundEngine.isSoundMuted())
  const [showModeHud, setShowModeHud] = useState(false)
  const hudTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const { scrollY } = useScroll()
  const background = useTransform(scrollY, [0, 100], ['transparent', 'rgba(10,10,15,0.8)'])
  const blur = useTransform(scrollY, [0, 100], [0, 20])

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    soundEngine.playClickSound()
    setMobileOpen(false)
    const el = document.querySelector(href)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSoundToggle = () => {
    const muted = soundEngine.toggleSound()
    setIsMuted(muted)
  }

  const handleThemeCycle = () => {
    soundEngine.playClickSound()
    toggleTheme()
    setShowModeHud(true)
    if (hudTimeoutRef.current) clearTimeout(hudTimeoutRef.current)
    hudTimeoutRef.current = setTimeout(() => setShowModeHud(false), 1600)
  }

  const renderThemeIcon = () => {
    switch (theme) {
      case 'sun':
        return <Sun className="w-4 h-4 text-amber-500" />
      case 'dark':
        return <Moon className="w-4 h-4 text-indigo-400" />
      case 'moon':
        return <MoonStar className="w-4 h-4 text-purple-400" />
      case 'rain':
        return <CloudRain className="w-4 h-4 text-cyan-400" />
      case 'snow':
        return <Snowflake className="w-4 h-4 text-sky-400" />
      default:
        return <Moon className="w-4 h-4 text-primary" />
    }
  }

  return (
    <motion.nav
      style={{ background, backdropFilter: `blur(${blur}px)` }}
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled ? 'border-b border-glass-border' : 'border-b border-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <a
          href="#"
          onMouseEnter={() => soundEngine.playHoverSound()}
          onClick={() => soundEngine.playClickSound()}
          className="font-heading font-bold text-xl tracking-tight flex items-center gap-2 group"
        >
          <img
            src="/assets/icon.png"
            alt="Logo"
            className="w-9 h-9 rounded-full object-cover group-hover:scale-105 transition-transform"
          />
          <span className="bg-gradient-to-r from-primary via-cyan-400 to-secondary bg-clip-text text-transparent font-bold">
            Raghul Raja
          </span>
        </a>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link: NavLink) => (
            <a
              key={link.href}
              href={link.href}
              onMouseEnter={() => soundEngine.playHoverSound()}
              onClick={(e) => handleClick(e, link.href)}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors relative group"
            >
              {link.name}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {/* Spatial Sci-Fi Audio Feedback Toggle */}
          <button
            onClick={handleSoundToggle}
            onMouseEnter={() => soundEngine.playHoverSound()}
            className={cn(
              'p-2 rounded-xl transition-all duration-300 relative group flex items-center gap-1.5 text-xs font-mono focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background',
              isMuted
                ? 'glass text-muted-foreground hover:text-foreground'
                : 'glass-spatial text-cyan-400 border-cyan-500/30 shadow-[0_0_10px_rgba(34,211,238,0.2)]'
            )}
            aria-label={isMuted ? 'Unmute Spatial Sound Effects' : 'Mute Spatial Sound Effects'}
            title={isMuted ? 'Unmute Sci-Fi Spatial UI Audio' : 'Mute Spatial UI Audio'}
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4 animate-pulse text-cyan-400" />
            )}
            <span className="hidden sm:inline-block">{isMuted ? 'Muted' : 'Sound ON'}</span>
          </button>

          {/* 5-MODE ENVIRONMENTAL THEME CONTROLLER */}
          <div className="relative">
            <button
              onClick={handleThemeCycle}
              onMouseEnter={() => soundEngine.playHoverSound()}
              className="p-2 rounded-xl glass glass-hover text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background relative overflow-hidden flex items-center justify-center min-w-[36px] min-h-[36px]"
              aria-label={`Environmental Theme: Current mode is ${activeMetadata.label}. Click to cycle environment.`}
              title={`Theme: ${activeMetadata.label} (Click to switch)`}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={theme}
                  initial={{ opacity: 0, scale: 0.6, rotate: -25 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 0.6, rotate: 25 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="flex items-center justify-center"
                >
                  {renderThemeIcon()}
                </motion.div>
              </AnimatePresence>
            </button>

            {/* Sleek Floating Glass HUD Tooltip */}
            <AnimatePresence>
              {showModeHud && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.92 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.92 }}
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute top-full mt-2.5 right-0 pointer-events-none z-50 whitespace-nowrap px-3 py-1.5 rounded-xl glass-spatial border border-white/20 text-xs font-mono shadow-2xl flex items-center gap-2 backdrop-blur-2xl"
                >
                  <span className="w-2 h-2 rounded-full bg-primary animate-ping shrink-0" />
                  <span className="text-foreground font-semibold">{activeMetadata.label}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button
            onClick={() => {
              soundEngine.playClickSound()
              setMobileOpen(!mobileOpen)
            }}
            className="md:hidden p-2 rounded-xl glass glass-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden border-t border-glass-border bg-surface-dark/95 backdrop-blur-xl"
        >
          <div className="px-6 py-4 flex flex-col gap-4">
            {navLinks.map((link: NavLink) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleClick(e, link.href)}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
              >
                {link.name}
              </a>
            ))}
          </div>
        </motion.div>
      )}
    </motion.nav>
  )
}
