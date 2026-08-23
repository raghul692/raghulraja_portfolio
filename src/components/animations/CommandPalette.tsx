'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search } from 'lucide-react'
import { resume, navLinks, certificates } from '@/data/resume'
import { scrollToSection } from '@/utils/cn'

interface CommandItem {
  type: 'section' | 'project' | 'certificate'
  label: string
  href: string
  icon?: string
}

const allItems: CommandItem[] = [
  ...navLinks.map(l => ({ type: 'section' as const, label: l.label, href: l.href })),
  ...resume.projects.map(p => ({ type: 'project' as const, label: p.title, href: `#projects`, icon: p.icon })),
  ...certificates.map(c => ({ type: 'certificate' as const, label: c.title, href: `#certificates` })),
]

export function CommandPalette({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const filtered = allItems.filter(item =>
    item.label.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[70] flex items-start justify-center pt-[20vh] bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          className="w-full max-w-2xl mx-4 bg-surface-dark border border-glass-border rounded-2xl shadow-2xl overflow-hidden"
          onClick={e => e.stopPropagation()}
        >
          <div className="flex items-center gap-3 px-4 py-4 border-b border-glass-border">
            <Search className="w-5 h-5 text-muted-foreground" />
            <input
              ref={inputRef}
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search sections, projects, certificates..."
              className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted-foreground"
            />
            <kbd className="px-2 py-1 text-xs bg-glass rounded border border-glass-border text-muted-foreground">
              ESC
            </kbd>
          </div>

          <div className="max-h-80 overflow-y-auto p-2">
            {filtered.length === 0 ? (
              <p className="px-3 py-6 text-sm text-muted-foreground text-center">
                No results found for "{query}"
              </p>
            ) : (
              filtered.map((item, i) => (
                <button
                  key={i}
                  onClick={() => {
                    if (item.type === 'section') {
                      scrollToSection(item.href)
                    } else {
                      document.querySelector(item.href)?.scrollIntoView({ behavior: 'smooth' })
                    }
                    onClose()
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-glass-hover transition-colors text-left"
                >
                  <div className="p-1.5 rounded-md bg-primary/10 text-primary">
                    {item.icon ? (
                      <span className="text-xs font-mono">{item.icon[0]}</span>
                    ) : (
                      <Search className="w-3 h-3" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{item.label}</p>
                    <p className="text-xs text-muted-foreground capitalize">{item.type}</p>
                  </div>
                </button>
              ))
            )}
          </div>

          <div className="px-4 py-3 border-t border-glass-border flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-glass rounded text-[10px]">↑↓</kbd> Navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-glass rounded text-[10px]">↵</kbd> Select
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-glass rounded text-[10px]">ESC</kbd> Close
            </span>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
