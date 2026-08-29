'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Code2, Star, GitFork } from 'lucide-react'

export interface HoverCardData {
  title: string
  category: string
  proficiency?: number
  experience?: string
  topRepo?: string
  stars?: number
  forks?: number
  description?: string
}

interface SkillHoverCardProps {
  data: HoverCardData
  children: React.ReactNode
}

export function SkillHoverCard({ data, children }: SkillHoverCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}

      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 z-[100] w-64 p-3.5 rounded-2xl glass border border-glass-border shadow-2xl backdrop-blur-2xl bg-surface-dark/95 pointer-events-none"
          >
            <div className="space-y-2">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <div className="flex items-center gap-1.5">
                  <Code2 className="w-3.5 h-3.5 text-primary" />
                  <h5 className="text-xs font-bold font-heading text-white">{data.title}</h5>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-cyan-300 capitalize">
                  {data.category}
                </span>
              </div>

              {/* Description */}
              {data.description && (
                <p className="text-[11px] text-slate-300 leading-snug">{data.description}</p>
              )}

              {/* Metrics */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                {data.proficiency !== undefined && (
                  <div className="bg-white/5 p-2 rounded-lg border border-white/5">
                    <span className="text-[9px] text-muted-foreground block font-mono">Proficiency</span>
                    <span className="text-xs font-bold text-primary font-mono">{data.proficiency}%</span>
                  </div>
                )}

                {data.experience && (
                  <div className="bg-white/5 p-2 rounded-lg border border-white/5">
                    <span className="text-[9px] text-muted-foreground block font-mono">Rating</span>
                    <span className="text-xs font-bold text-emerald-400 font-mono">{data.experience}</span>
                  </div>
                )}

                {data.stars !== undefined && (
                  <div className="bg-white/5 p-2 rounded-lg border border-white/5 flex items-center gap-1.5">
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                    <div>
                      <span className="text-[9px] text-muted-foreground block font-mono">Stars</span>
                      <span className="text-xs font-bold text-amber-300 font-mono">{data.stars}</span>
                    </div>
                  </div>
                )}

                {data.forks !== undefined && (
                  <div className="bg-white/5 p-2 rounded-lg border border-white/5 flex items-center gap-1.5">
                    <GitFork className="w-3 h-3 text-cyan-400" />
                    <div>
                      <span className="text-[9px] text-muted-foreground block font-mono">Forks</span>
                      <span className="text-xs font-bold text-cyan-300 font-mono">{data.forks}</span>
                    </div>
                  </div>
                )}
              </div>

              {data.topRepo && (
                <div className="flex items-center gap-1 text-[10px] text-muted-foreground font-mono pt-1">
                  <Sparkles className="w-3 h-3 text-primary" />
                  <span>Featured: <strong className="text-white">{data.topRepo}</strong></span>
                </div>
              )}
            </div>

            {/* Bottom Arrow Pointer */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-surface-dark" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
