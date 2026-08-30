'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/utils/cn'
import { resume } from '@/data/resume'
import type { Project } from '@/data/resume'
import {
  Briefcase,
  HeartPulse,
  Lock,
  FileText,
  UtensilsCrossed,
  Music,
  Code2,
  ExternalLink,
  Github,
  X,
  ChevronRight,
  Bot,
  Mic,
  ShieldCheck,
  Terminal,
  Wallet,
  DollarSign,
  UserCheck,
  Key,
  QrCode,
  Scan,
  CheckSquare,
  Kanban,
  ListTodo,
  Activity,
  Stethoscope,
  CloudSun,
  Wind,
  Sparkles,
  MessageSquare,
  Bug,
  ShieldAlert,
  Search,
  Share2,
  Check,
  Zap,
} from 'lucide-react'
import { ProjectArchitectureFlow } from '@/components/ui/ProjectArchitectureFlow'
import { ProjectDemoSandboxModal } from '@/components/ui/ProjectDemoSandboxModal'
import soundEngine from '@/utils/soundEngine'

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Briefcase,
  HeartPulse,
  Lock,
  FileText,
  UtensilsCrossed,
  Music,
  Bot,
  Mic,
  ShieldCheck,
  Terminal,
  Wallet,
  DollarSign,
  UserCheck,
  Key,
  QrCode,
  Scan,
  CheckSquare,
  Kanban,
  ListTodo,
  Activity,
  Stethoscope,
  CloudSun,
  Wind,
  Sparkles,
  MessageSquare,
  Bug,
  ShieldAlert,
}

function getCategoryLabel(cat: Project['category']): string {
  const labels: Record<Project['category'], string> = {
    fullstack: 'Full Stack',
    ai: 'AI/ML',
    frontend: 'Frontend',
    uiux: 'UI/UX',
  }
  return labels[cat]
}

function getCategoryColor(cat: Project['category']): string {
  const colors: Record<Project['category'], string> = {
    fullstack: 'bg-secondary/10 text-secondary border-secondary/20',
    ai: 'bg-accent/10 text-accent border-accent/20',
    frontend: 'bg-primary/10 text-primary border-primary/20',
    uiux: 'bg-pink-400/10 text-pink-400 border-pink-400/20',
  }
  return colors[cat]
}

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
    },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20, scale: 0.95 },
}

const modalVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: 'spring', damping: 25, stiffness: 300 },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 20,
    transition: { duration: 0.2 },
  },
}

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
}

export default function Projects() {
  const [activeFilter, setActiveFilter] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [demoSandboxState, setDemoSandboxState] = useState<{ title: string; id: string } | null>(null)

  const filteredProjects = useMemo(() => {
    return resume.projects.filter(p => {
      const matchesCategory = activeFilter === 'all' || p.category === activeFilter
      if (!matchesCategory) return false

      if (!searchQuery.trim()) return true
      const q = searchQuery.toLowerCase()

      const matchesTitle = p.title.toLowerCase().includes(q)
      const matchesDesc = p.description.toLowerCase().includes(q)
      const matchesTech = p.tech.some(t => t.toLowerCase().includes(q))
      const matchesHighlights = p.highlights.some(h => h.toLowerCase().includes(q))

      return matchesTitle || matchesDesc || matchesTech || matchesHighlights
    })
  }, [activeFilter, searchQuery])

  const handleCopyLink = (e: React.MouseEvent, projectId: string) => {
    e.stopPropagation()
    const shareUrl = `${window.location.origin}${window.location.pathname}#projects?id=${projectId}`
    navigator.clipboard.writeText(shareUrl)
    setCopiedId(projectId)
    setTimeout(() => setCopiedId(null), 2500)
  }

  const tabs: { key: string; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'fullstack', label: 'Full Stack' },
    { key: 'ai', label: 'AI/ML' },
    { key: 'frontend', label: 'Frontend' },
    { key: 'uiux', label: 'UI/UX' },
  ]

  return (
    <section id="projects" className="relative py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-mono mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" /> Silicon Valley SaaS Engineering
          </div>
          <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Projects & Architecture
            </span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            A showcase of full-stack platforms, machine learning systems, & security engines with interactive architecture flowcharts & live AI demo sandboxes.
          </p>
        </motion.div>

        {/* Interactive Search Bar */}
        <div className="max-w-xl mx-auto mb-8 relative">
          <div className="relative flex items-center">
            <Search className="w-5 h-5 absolute left-4 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={`Search ${resume.projects.length} projects by title, React, Python, Gemini, FastAPI...`}
              className="w-full pl-12 pr-28 py-3.5 rounded-2xl glass border border-glass-border focus:border-primary focus:outline-none text-sm text-foreground placeholder:text-muted-foreground/60 transition-all shadow-lg"
            />
            {searchQuery ? (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 p-1 rounded-lg glass text-xs text-muted-foreground hover:text-foreground transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            ) : (
              <span className="absolute right-4 px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-[11px] font-semibold text-primary">
                {filteredProjects.length} {filteredProjects.length === 1 ? 'Project' : 'Projects'}
              </span>
            )}
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {tabs.map(tab => (
            <motion.button
              key={tab.key}
              onClick={() => {
                soundEngine.playClickSound()
                setActiveFilter(tab.key)
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={cn(
                'px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 border cursor-pointer',
                activeFilter === tab.key
                  ? 'bg-primary/15 border-primary/30 text-primary shadow-glow'
                  : 'glass glass-hover border-glass-border text-muted-foreground hover:text-foreground'
              )}
            >
              {tab.label}
            </motion.button>
          ))}
        </div>

        {/* PROJECTS GRID VIEW */}
        {filteredProjects.length === 0 ? (
            <div className="text-center py-16 glass rounded-3xl border border-glass-border max-w-lg mx-auto">
              <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="font-heading font-semibold text-lg text-foreground mb-1">No Projects Found</h3>
              <p className="text-xs text-muted-foreground mb-4">No matches found for "{searchQuery}". Try searching another skill or keyword.</p>
              <button
                onClick={() => { setSearchQuery(''); setActiveFilter('all'); }}
                className="px-4 py-2 rounded-xl bg-primary/10 border border-primary/20 text-xs font-semibold text-primary hover:bg-primary/20 transition-all cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <motion.div
              key={`${activeFilter}-${searchQuery}`}
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              <AnimatePresence mode="popLayout">
                {filteredProjects.map(project => {
                  const IconComponent = project.icon ? iconMap[project.icon] : Code2
                  return (
                    <motion.div
                      key={project.id}
                      variants={cardVariants}
                      layout
                      initial="hidden"
                      animate="show"
                      exit="exit"
                      transition={{ duration: 0.4, ease: 'easeOut' }}
                      onClick={() => {
                        soundEngine.playClickSound()
                        setSelectedProject(project)
                      }}
                      onMouseEnter={() => soundEngine.playHoverSound()}
                      className="group relative glass rounded-2xl p-6 cursor-pointer border border-glass-border hover:border-glass-borderHover hover:bg-glass-hover transition-all duration-300 hover:-translate-y-1 hover:shadow-glass-hover hover:shadow-glow flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-start justify-between mb-4">
                          <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 group-hover:bg-primary/15 transition-colors">
                            <IconComponent className="w-6 h-6 text-primary" />
                          </div>
                          <span
                            className={cn(
                              'px-3 py-1 rounded-lg text-xs font-medium border',
                              getCategoryColor(project.category)
                            )}
                          >
                            {getCategoryLabel(project.category)}
                          </span>
                        </div>

                        <h3 className="font-heading font-semibold text-lg mb-2 text-foreground group-hover:text-primary transition-colors">
                          {project.title}
                        </h3>
                        <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-2">
                          {project.description}
                        </p>

                        {/* Real-World KPI Metrics Badges */}
                        {project.metrics && project.metrics.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {project.metrics.map((m, idx) => (
                              <div
                                key={idx}
                                className="px-2.5 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-[11px] font-mono text-cyan-300 flex items-center gap-1 font-semibold"
                              >
                                <Zap className="w-3 h-3 text-amber-400" />
                                {m.label}: <span className="text-white">{m.value}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        <div className="flex flex-wrap gap-2 mb-4">
                          {project.tech.slice(0, 4).map(tech => (
                            <span
                              key={tech}
                              onClick={(e) => { e.stopPropagation(); setSearchQuery(tech); }}
                              className="px-2.5 py-1 rounded-lg text-xs font-medium bg-white/5 border border-white/10 text-muted-foreground hover:border-primary/40 hover:text-primary hover:bg-primary/10 transition-all cursor-pointer"
                              title={`Filter by ${tech}`}
                            >
                              {tech}
                            </span>
                          ))}
                          {project.tech.length > 4 && (
                            <span className="px-2.5 py-1 rounded-lg text-xs font-medium bg-white/5 border border-white/10 text-muted-foreground">
                              +{project.tech.length - 4}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-3 pt-4 border-t border-glass-border">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            soundEngine.playClickSound()
                            setDemoSandboxState({ title: project.title, id: project.id })
                          }}
                          className="px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 text-xs font-mono font-semibold border border-cyan-500/30 flex items-center gap-1 transition-colors cursor-pointer"
                          title="Try Live AI Simulation Sandbox"
                        >
                          <Zap className="w-3.5 h-3.5 text-amber-400" /> Demo ⚡
                        </button>

                        {project.github && (
                          <a
                            href={project.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={e => e.stopPropagation()}
                            className="p-2 rounded-lg glass glass-hover text-muted-foreground hover:text-foreground transition-colors"
                            aria-label="GitHub"
                          >
                            <Github className="w-4 h-4" />
                          </a>
                        )}

                        <button
                          onClick={(e) => handleCopyLink(e, project.id)}
                          className="p-2 rounded-lg glass glass-hover text-muted-foreground hover:text-primary transition-colors relative"
                          aria-label="Share Project Link"
                          title="Copy direct project link"
                        >
                          {copiedId === project.id ? (
                            <Check className="w-4 h-4 text-green-400" />
                          ) : (
                            <Share2 className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </motion.div>
          )}
      </div>

      {/* PROJECT DETAILS & ARCHITECTURE MODAL */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            key="modal"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              variants={modalVariants}
              className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto glass rounded-3xl border border-glass-border shadow-2xl p-6 md:p-8 space-y-6"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-glass-border pb-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-primary/10 border border-primary/20">
                    {(() => {
                      const IconComponent = selectedProject.icon
                        ? iconMap[selectedProject.icon]
                        : Code2
                      return <IconComponent className="w-6 h-6 text-primary" />
                    })()}
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-xl text-foreground">
                      {selectedProject.title}
                    </h3>
                    <span className="text-xs font-mono text-cyan-400 font-semibold">
                      {getCategoryLabel(selectedProject.category)} System Architecture
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="p-2 rounded-lg glass hover:border-glass-borderHover transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

              {/* KPI Metrics */}
              {selectedProject.metrics && (
                <div className="grid grid-cols-2 gap-3">
                  {selectedProject.metrics.map((m, idx) => (
                    <div key={idx} className="glass p-3 rounded-xl border border-white/10 flex items-center justify-between font-mono text-xs">
                      <span className="text-muted-foreground">{m.label}:</span>
                      <span className="text-cyan-300 font-bold">{m.value}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Long Description */}
              <p className="text-sm text-foreground/80 leading-relaxed">
                {selectedProject.longDescription}
              </p>

              {/* ANIMATED SYSTEM ARCHITECTURE FLOWCHART */}
              <ProjectArchitectureFlow projectTitle={selectedProject.title} />

              {/* Highlights */}
              <div className="space-y-2">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
                  Key Technical Deliverables:
                </h4>
                <div className="space-y-2">
                  {selectedProject.highlights.map((h, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                      <ChevronRight className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions Footer */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-glass-border">
                <button
                  onClick={() => {
                    const proj = selectedProject
                    setSelectedProject(null)
                    setDemoSandboxState({ title: proj.title, id: proj.id })
                  }}
                  className="px-5 py-2.5 rounded-xl bg-cyan-500/20 text-cyan-300 text-xs font-mono font-bold border border-cyan-500/40 hover:bg-cyan-500/30 transition-colors flex items-center gap-2 cursor-pointer shadow-glow"
                >
                  <Zap className="w-4 h-4 text-amber-400 animate-pulse" /> Try Live AI Demo Sandbox ⚡
                </button>

                <div className="flex items-center gap-3">
                  {selectedProject.github && (
                    <a
                      href={selectedProject.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2.5 rounded-xl glass text-xs font-mono text-foreground hover:text-primary transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Github className="w-4 h-4" /> GitHub Repository
                    </a>
                  )}
                  {selectedProject.live && (
                    <a
                      href={selectedProject.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2.5 rounded-xl bg-primary text-white text-xs font-mono font-bold hover:bg-primary/90 transition-colors flex items-center gap-1.5 shadow-glow cursor-pointer"
                    >
                      <ExternalLink className="w-4 h-4" /> Live Application ↗
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* DEMO SANDBOX MODAL */}
      <ProjectDemoSandboxModal
        isOpen={!!demoSandboxState}
        onClose={() => setDemoSandboxState(null)}
        projectTitle={demoSandboxState?.title || ''}
        projectId={demoSandboxState?.id || ''}
      />
    </section>
  )
}
