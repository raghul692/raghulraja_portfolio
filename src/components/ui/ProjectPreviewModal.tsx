'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  ExternalLink,
  RefreshCw,
  Monitor,
  Tablet,
  Smartphone,
  Lock,
  Code,
} from 'lucide-react'

interface ProjectPreviewModalProps {
  isOpen: boolean
  onClose: () => void
  project?: {
    title: string
    live?: string
    github?: string
    tech?: string[]
  } | null
  liveUrl?: string
  title?: string
}

export function ProjectPreviewModal({
  isOpen,
  onClose,
  project,
  liveUrl,
  title,
}: ProjectPreviewModalProps) {
  const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop')
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const activeLiveUrl = liveUrl || project?.live || ''
  const activeTitle = title || project?.title || 'Project Preview'
  const activeGithub = project?.github

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true)
    }
  }, [isOpen, activeLiveUrl])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  if (!isOpen || !activeLiveUrl) return null

  const getWidthClass = () => {
    switch (device) {
      case 'mobile':
        return 'max-w-[400px] h-[720px]'
      case 'tablet':
        return 'max-w-[768px] h-[800px]'
      default:
        return 'w-full h-full'
    }
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8 bg-black/80 backdrop-blur-md">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0"
        />

        {/* Modal Window Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className={`relative z-10 bg-surface-dark/95 border border-glass-border rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 ${
            isFullscreen ? 'w-full h-full rounded-none' : 'w-full max-w-6xl h-[85vh]'
          }`}
        >
          {/* Top Browser Bar Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-surface/80 border-b border-glass-border select-none shrink-0 gap-2 flex-wrap">
            {/* Left: Window Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="w-3.5 h-3.5 rounded-full bg-red-500/80 hover:bg-red-500 transition-colors"
                title="Close"
              />
              <button
                onClick={() => setDevice('desktop')}
                className="w-3.5 h-3.5 rounded-full bg-yellow-500/80 hover:bg-yellow-500 transition-colors"
                title="Reset View"
              />
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="w-3.5 h-3.5 rounded-full bg-green-500/80 hover:bg-green-500 transition-colors"
                title="Toggle Fullscreen"
              />

              <span className="ml-2 font-heading text-xs font-semibold text-foreground truncate max-w-[150px] sm:max-w-[250px]">
                {activeTitle}
              </span>
            </div>

            {/* Middle: Mock URL Bar */}
            <div className="flex-1 max-w-md mx-2 hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 border border-white/10 text-xs font-mono text-muted-foreground truncate">
              <Lock className="w-3 h-3 text-green-400 shrink-0" />
              <span className="truncate text-foreground/80">{activeLiveUrl}</span>
            </div>

            {/* Right: Controls & Device Selectors */}
            <div className="flex items-center gap-1.5 ml-auto">
              <div className="flex items-center p-1 rounded-xl bg-black/40 border border-white/10 gap-0.5">
                <button
                  onClick={() => setDevice('desktop')}
                  className={`p-1.5 rounded-lg text-xs transition-colors ${
                    device === 'desktop' ? 'bg-primary text-white' : 'text-muted-foreground hover:text-foreground'
                  }`}
                  title="Desktop View"
                >
                  <Monitor className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setDevice('tablet')}
                  className={`p-1.5 rounded-lg text-xs transition-colors ${
                    device === 'tablet' ? 'bg-primary text-white' : 'text-muted-foreground hover:text-foreground'
                  }`}
                  title="Tablet View"
                >
                  <Tablet className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setDevice('mobile')}
                  className={`p-1.5 rounded-lg text-xs transition-colors ${
                    device === 'mobile' ? 'bg-primary text-white' : 'text-muted-foreground hover:text-foreground'
                  }`}
                  title="Mobile View"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                </button>
              </div>

              <button
                onClick={() => {
                  setIsLoading(true)
                }}
                className="p-2 rounded-xl glass hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors"
                title="Reload Frame"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              </button>

              <a
                href={activeLiveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-primary/10 border border-primary/20 text-xs text-primary font-medium hover:bg-primary/20 transition-colors"
              >
                Open <ExternalLink className="w-3 h-3" />
              </a>

              <button
                onClick={onClose}
                className="p-2 rounded-xl glass hover:bg-red-500/20 hover:text-red-400 text-muted-foreground transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Frame Canvas */}
          <div className="flex-1 bg-black/60 relative overflow-auto flex items-center justify-center p-2 sm:p-4">
            {isLoading && (
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-surface-dark/90 backdrop-blur-sm gap-3">
                <div className="w-10 h-10 border-3 border-primary/30 border-t-primary rounded-full animate-spin" />
                <p className="text-xs font-mono text-muted-foreground animate-pulse">
                  Connecting to live demo environment...
                </p>
              </div>
            )}

            <div
              className={`transition-all duration-300 shadow-2xl rounded-xl overflow-hidden border border-white/10 bg-white ${getWidthClass()}`}
            >
              <iframe
                src={activeLiveUrl}
                title={`Live Preview - ${activeTitle}`}
                className="w-full h-full border-0"
                onLoad={() => setIsLoading(false)}
                onError={() => setIsLoading(false)}
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
              />
            </div>
          </div>

          {/* Footer Bar */}
          <div className="px-4 py-2 bg-surface/80 border-t border-glass-border flex items-center justify-between text-xs text-muted-foreground shrink-0">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-400" />
              <span>Live Environment Connected</span>
            </div>
            {activeGithub && (
              <a
                href={activeGithub}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground underline flex items-center gap-1"
              >
                <Code className="w-3 h-3" /> Source Code
              </a>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

export default ProjectPreviewModal
