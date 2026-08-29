'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Sparkles, FolderGit2, Layers, Bot, Download, CornerDownLeft } from 'lucide-react'
import { resume, navLinks } from '@/data/resume'
import type { NavLink } from '@/data/resume'
import { scrollToSection } from '@/utils/cn'
import soundEngine from '@/utils/soundEngine'

interface CommandItem {
  id: string
  type: 'section' | 'project' | 'ai' | 'action'
  label: string
  subtitle?: string
  href?: string
  action?: () => void
  icon: any
  badge?: string
}

export function CommandPalette({
  onClose,
  onOpenAiHub,
}: {
  onClose: () => void
  onOpenAiHub?: () => void
}) {
  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<'all' | 'sections' | 'projects' | 'ai' | 'actions'>('all')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
    soundEngine.playPaletteSound()
  }, [])

  const commandItems: CommandItem[] = [
    // Sections
    ...navLinks.map((l: NavLink) => ({
      id: `sec-${l.name}`,
      type: 'section' as const,
      label: l.name,
      subtitle: `Navigate to ${l.name} section`,
      href: l.href,
      icon: Layers,
    })),
    // AI Suite Actions
    {
      id: 'ai-hub',
      type: 'ai' as const,
      label: 'Portfolio AI Agent Suite',
      subtitle: 'Launch interactive AI Assistant, ATS Scanner & Career Coach',
      action: () => {
        onClose()
        onOpenAiHub?.()
      },
      icon: Bot,
      badge: 'AI Powered',
    },
    // Resume Download Action
    {
      id: 'download-resume',
      type: 'action' as const,
      label: 'Download Raghul Resume (PDF)',
      subtitle: 'Instant download of ATS-friendly engineering resume',
      action: () => {
        const link = document.createElement('a')
        link.href = '/RAGHUL_P_RESUME.pdf'
        link.download = 'RAGHUL_P_RESUME.pdf'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        onClose()
      },
      icon: Download,
      badge: 'Quick Action',
    },
    // Projects
    ...resume.projects.map(p => ({
      id: `proj-${p.title}`,
      type: 'project' as const,
      label: p.title,
      subtitle: p.description.slice(0, 65) + '...',
      href: '#projects',
      icon: FolderGit2,
      badge: p.category,
    })),
  ]

  const filtered = commandItems.filter(item => {
    const matchesQuery =
      item.label.toLowerCase().includes(query.toLowerCase()) ||
      (item.subtitle && item.subtitle.toLowerCase().includes(query.toLowerCase()))
    const matchesCat =
      activeCategory === 'all' ||
      (activeCategory === 'sections' && item.type === 'section') ||
      (activeCategory === 'projects' && item.type === 'project') ||
      (activeCategory === 'ai' && item.type === 'ai') ||
      (activeCategory === 'actions' && item.type === 'action')

    return matchesQuery && matchesCat
  })

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      soundEngine.playHoverSound()
      setSelectedIndex(prev => (prev < filtered.length - 1 ? prev + 1 : 0))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      soundEngine.playHoverSound()
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : filtered.length - 1))
    } else if (e.key === 'Enter' && filtered[selectedIndex]) {
      e.preventDefault()
      executeItem(filtered[selectedIndex])
    } else if (e.key === 'Escape') {
      onClose()
    }
  }

  const executeItem = (item: CommandItem) => {
    soundEngine.playClickSound()
    if (item.action) {
      item.action()
    } else if (item.href) {
      if (item.href.startsWith('#')) {
        document.querySelector(item.href)?.scrollIntoView({ behavior: 'smooth' })
      } else {
        scrollToSection(item.href)
      }
      onClose()
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[80] flex items-start justify-center pt-[15vh] bg-black/70 backdrop-blur-md px-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          className="w-full max-w-2xl bg-surface-dark/95 border border-white/20 rounded-2xl shadow-2xl overflow-hidden glass-spatial backdrop-blur-2xl"
          onClick={e => e.stopPropagation()}
        >
          {/* Header Input */}
          <div className="flex items-center gap-3 px-4 py-4 border-b border-glass-border">
            <Search className="w-5 h-5 text-primary" />
            <input
              ref={inputRef}
              value={query}
              onChange={e => {
                setQuery(e.target.value)
                setSelectedIndex(0)
              }}
              onKeyDown={handleKeyDown}
              placeholder="Type a command or search (e.g., 'ResuMate', 'AI', 'Resume')..."
              className="flex-1 bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground font-sans"
            />
            <kbd className="px-2 py-1 text-[10px] font-mono bg-white/10 rounded border border-white/10 text-muted-foreground">
              ESC
            </kbd>
          </div>

          {/* Category Filter Chips */}
          <div className="flex items-center gap-1.5 px-4 py-2 border-b border-glass-border/50 bg-black/20 text-xs overflow-x-auto">
            {(['all', 'sections', 'projects', 'ai', 'actions'] as const).map(cat => (
              <button
                key={cat}
                onClick={() => {
                  soundEngine.playClickSound()
                  setActiveCategory(cat)
                  setSelectedIndex(0)
                }}
                onMouseEnter={() => soundEngine.playHoverSound()}
                className={`px-2.5 py-1 rounded-lg capitalize font-medium transition-all whitespace-nowrap ${
                  activeCategory === cat
                    ? 'bg-primary text-black font-semibold'
                    : 'text-muted-foreground hover:text-white hover:bg-white/5'
                }`}
              >
                {cat === 'ai' ? '🤖 AI Modes' : cat}
              </button>
            ))}
          </div>

          {/* Results List */}
          <div className="max-h-80 overflow-y-auto p-2 space-y-1">
            {filtered.length === 0 ? (
              <div className="px-4 py-8 text-center space-y-2">
                <p className="text-sm text-muted-foreground">
                  No commands found matching "{query}"
                </p>
                <p className="text-xs text-primary font-mono">Try searching for 'AI', 'Python', or 'Contact'</p>
              </div>
            ) : (
              filtered.map((item, index) => {
                const Icon = item.icon
                const isSelected = index === selectedIndex
                return (
                  <button
                    key={item.id}
                    onClick={() => executeItem(item)}
                    onMouseEnter={() => {
                      if (selectedIndex !== index) {
                        soundEngine.playHoverSound()
                        setSelectedIndex(index)
                      }
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all text-left ${
                      isSelected
                        ? 'bg-primary/15 text-white border border-primary/30 shadow-glow'
                        : 'text-slate-300 hover:bg-white/5 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`p-2 rounded-lg ${
                          isSelected ? 'bg-primary text-black' : 'bg-white/5 text-primary'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold truncate">{item.label}</span>
                          {item.badge && (
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-primary/20 text-primary border border-primary/30">
                              {item.badge}
                            </span>
                          )}
                        </div>
                        {item.subtitle && (
                          <p className="text-xs text-muted-foreground truncate">{item.subtitle}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 opacity-75 text-xs font-mono">
                      {isSelected && <CornerDownLeft className="w-3.5 h-3.5 text-primary" />}
                    </div>
                  </button>
                )
              })
            )}
          </div>

          {/* Footer Shortcuts */}
          <div className="px-4 py-3 border-t border-glass-border bg-black/30 flex items-center justify-between text-xs text-muted-foreground font-mono">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-[10px]">↑↓</kbd> Navigate
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-[10px]">↵</kbd> Select
              </span>
            </div>
            <span className="flex items-center gap-1 text-primary">
              <Sparkles className="w-3.5 h-3.5" /> Raghul Portfolio Command OS
            </span>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
