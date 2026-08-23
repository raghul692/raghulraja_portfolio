'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useTheme } from '@/contexts/ThemeContext'
import { cn } from '@/utils/cn'
import { navLinks } from '@/data/resume'
import { Menu, X, Moon, Sun } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function Navbar() {
  const { theme, toggleTheme } = useTheme()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
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
    setMobileOpen(false)
    const el = document.querySelector(href)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
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
        <a href="#" className="font-heading font-bold text-xl tracking-tight flex items-center">
          <img src="/assets/icon.png" alt="Logo" className="w-9 h-9 rounded-full object-cover" />
        </a>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map(link => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleClick(e, link.href)}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors relative group"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg glass glass-hover"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg glass glass-hover"
            aria-label="Toggle menu"
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
            {navLinks.map(link => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleClick(e, link.href)}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
              >
                {link.label}
              </a>
            ))}
          </div>
        </motion.div>
      )}
    </motion.nav>
  )
}
