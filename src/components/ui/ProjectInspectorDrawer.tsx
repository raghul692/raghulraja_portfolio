'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, ExternalLink, Github, CheckCircle, Code2, Layers, Cpu, Sparkles } from 'lucide-react'

export interface ProjectDetail {
  id: string
  title: string
  subtitle: string
  role: string
  description: string
  longDescription?: string
  architecture?: string[]
  highlights: string[]
  technologies: string[]
  liveUrl?: string
  githubUrl?: string
  image?: string
  icon?: string
}

interface ProjectInspectorDrawerProps {
  project: ProjectDetail | null
  onClose: () => void
}

export function ProjectInspectorDrawer({ project, onClose }: ProjectInspectorDrawerProps) {
  if (!project) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[90] flex justify-end">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-md"
          onClick={onClose}
        />

        {/* Drawer Panel */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="relative w-full max-w-2xl h-full bg-surface-dark border-l border-glass-border shadow-2xl glass backdrop-blur-2xl overflow-y-auto z-10 flex flex-col"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 z-20 p-6 border-b border-glass-border bg-surface-dark/95 backdrop-blur-xl flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs px-2.5 py-0.5 rounded-full font-mono bg-primary/20 text-primary border border-primary/30">
                  {project.role}
                </span>
                <span className="text-xs text-muted-foreground font-mono">ID: {project.id}</span>
              </div>
              <h3 className="text-2xl font-bold font-heading text-white">{project.title}</h3>
              <p className="text-xs text-muted-foreground">{project.subtitle}</p>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-white transition-colors border border-white/10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Body Content */}
          <div className="p-6 space-y-8 flex-1">
            {/* Overview Description */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                <Layers className="w-4 h-4 text-primary" /> System Overview & Purpose
              </h4>
              <p className="text-sm text-slate-300 leading-relaxed bg-white/5 p-4 rounded-xl border border-white/10">
                {project.longDescription || project.description}
              </p>
            </div>

            {/* Architecture Highlights */}
            {project.architecture && project.architecture.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-cyan-400" /> High-Level System Architecture
                </h4>
                <div className="grid grid-cols-1 gap-2.5">
                  {project.architecture.map((arch, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 p-3 rounded-xl bg-surface-dark border border-white/10 text-xs text-slate-200"
                    >
                      <div className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-400 font-mono font-bold flex items-center justify-center text-[10px] shrink-0">
                        {idx + 1}
                      </div>
                      <span>{arch}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Feature Highlights Checklist */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" /> Key Features & Capabilities
              </h4>
              <div className="grid grid-cols-1 gap-2">
                {project.highlights.map((feat, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2.5 text-xs text-slate-300 bg-white/5 p-3 rounded-lg border border-white/5"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Technology Stack Tags */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                <Code2 className="w-4 h-4 text-indigo-400" /> Engineering Stack
              </h4>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map(tech => (
                  <span
                    key={tech}
                    className="text-xs px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-200 font-mono"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Drawer Footer Actions */}
          <div className="sticky bottom-0 p-6 border-t border-glass-border bg-surface-dark/95 backdrop-blur-xl flex items-center justify-between gap-4">
            {project.githubUrl ? (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl glass hover:bg-white/10 text-xs font-semibold text-white border border-white/10 transition-all"
              >
                <Github className="w-4 h-4" /> View GitHub Repository
              </a>
            ) : (
              <div />
            )}

            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-primary to-cyan-400 text-black text-xs font-bold shadow-glow hover:scale-[1.02] transition-all"
              >
                <ExternalLink className="w-4 h-4" /> Launch Live Application
              </a>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
