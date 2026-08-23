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
  Network,
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
  Play,
} from 'lucide-react'
import { ArchitectureModal } from '@/components/ui/ArchitectureModal'
import { ProjectPreviewModal } from '@/components/ui/ProjectPreviewModal'

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

function getArchitectureBullets(project: Project): string[] {
  const bullets: Record<string, string[]> = {
    fullstack: [
      'Client-server architecture with RESTful API design',
      'JWT-based authentication with role-based access control',
      'Relational database schema with proper indexing',
      'Environment-based configuration and deployment pipeline',
    ],
    ai: [
      'Data preprocessing and feature engineering pipeline',
      'Supervised ML model training with cross-validation',
      'Model serialization and inference optimization',
      'Interactive prediction interface with real-time results',
    ],
    frontend: [
      'Component-based architecture with reusable UI elements',
      'State management for complex user interactions',
      'Responsive design with mobile-first approach',
      'Performance optimization and accessibility standards',
    ],
    uiux: [
      'User-centered design process with research phase',
      'Design system with consistent tokens and components',
      'Interactive prototyping for user validation',
      'Accessibility-focused design with inclusive patterns',
    ],
  }
  return bullets[project.category] || bullets.frontend
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
  const [archModalTitle, setArchModalTitle] = useState<string | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [previewProject, setPreviewProject] = useState<{ title: string; liveUrl: string } | null>(null)

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
          className="text-center mb-16"
        >
          <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Projects
            </span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            A selection of projects that showcase my skills across full-stack development,
            AI/ML, frontend engineering, and UI/UX design.
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
              placeholder={`Search ${resume.projects.length} projects by title, React, Python, Gemini, FastAPI, XSS...`}
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
          {searchQuery && (
            <div className="flex items-center justify-between mt-2 px-2 text-xs text-muted-foreground">
              <span>Filter tag: <strong className="text-primary">{searchQuery}</strong></span>
              <button onClick={() => setSearchQuery('')} className="hover:text-foreground underline">Clear Search</button>
            </div>
          )}
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {tabs.map(tab => (
            <motion.button
              key={tab.key}
              onClick={() => setActiveFilter(tab.key)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={cn(
                'px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 border',
                activeFilter === tab.key
                  ? 'bg-primary/15 border-primary/30 text-primary shadow-glow'
                  : 'glass glass-hover border-glass-border text-muted-foreground hover:text-foreground'
              )}
            >
              {tab.label}
            </motion.button>
          ))}
        </div>

        {filteredProjects.length === 0 ? (
          <div className="text-center py-16 glass rounded-3xl border border-glass-border max-w-lg mx-auto">
            <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="font-heading font-semibold text-lg text-foreground mb-1">No Projects Found</h3>
            <p className="text-xs text-muted-foreground mb-4">No matches found for "{searchQuery}". Try searching another skill or keyword.</p>
            <button
              onClick={() => { setSearchQuery(''); setActiveFilter('all'); }}
              className="px-4 py-2 rounded-xl bg-primary/10 border border-primary/20 text-xs font-semibold text-primary hover:bg-primary/20 transition-all"
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
                    onClick={() => setSelectedProject(project)}
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

                      <div className="space-y-2 mb-5">
                        {project.highlights.slice(0, 2).map((highlight, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <ChevronRight className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                            <span className="text-xs text-muted-foreground leading-relaxed line-clamp-1">
                              {highlight}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 pt-4 border-t border-glass-border">
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
                      {project.live && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            setPreviewProject({ title: project.title, liveUrl: project.live! })
                          }}
                          className="p-2 rounded-lg glass glass-hover text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 cursor-pointer"
                          aria-label="Live Demo Preview"
                          title="Interactive Device Preview Modal"
                        >
                          <Play className="w-4 h-4 text-primary animate-pulse" />
                        </button>
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
                      <span className="text-xs text-muted-foreground ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                        View Details
                      </span>
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {selectedProject && (
          <motion.div
            key="modal"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              variants={backdropVariants}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            />
            <motion.div
              variants={modalVariants}
              className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto glass rounded-3xl border border-glass-border shadow-glass-lg"
              onClick={e => e.stopPropagation()}
            >
              <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b border-glass-border bg-surface-dark/80 backdrop-blur-xl">
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
                    <span
                      className={cn(
                        'inline-block px-2.5 py-0.5 rounded-md text-xs font-medium border mt-1',
                        getCategoryColor(selectedProject.category)
                      )}
                    >
                      {getCategoryLabel(selectedProject.category)}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="p-2 rounded-lg glass glass-hover text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                <p className="text-foreground/90 leading-relaxed">
                  {selectedProject.longDescription}
                </p>

                <div>
                  <h4 className="font-heading font-semibold text-sm text-foreground mb-3 uppercase tracking-wider">
                    Tech Stack
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.tech.map(tech => (
                      <span
                        key={tech}
                        className="px-3 py-1.5 rounded-lg text-sm font-medium bg-primary/10 border border-primary/20 text-primary"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-heading font-semibold text-sm text-foreground mb-3 uppercase tracking-wider">
                    Key Highlights
                  </h4>
                  <ul className="space-y-2">
                    {selectedProject.highlights.map((highlight, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                        <span className="text-muted-foreground text-sm leading-relaxed">
                          {highlight}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-heading font-semibold text-sm text-foreground uppercase tracking-wider">
                      Architecture & Engineering Highlights
                    </h4>
                    <button
                      onClick={() => setArchModalTitle(selectedProject.title)}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-accent/10 border border-accent/20 text-accent text-xs font-medium hover:bg-accent/20 transition-all cursor-pointer"
                    >
                      <Network className="w-3.5 h-3.5 text-accent" />
                      View System Diagram Flowchart
                    </button>
                  </div>
                  <ul className="space-y-2">
                    {getArchitectureBullets(selectedProject).map((bullet, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-secondary flex-shrink-0" />
                        <span className="text-muted-foreground text-sm leading-relaxed">
                          {bullet}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-glass-border">
                  {selectedProject.live && (
                    <div className="w-full space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-heading font-semibold text-sm text-foreground uppercase tracking-wider flex items-center gap-2">
                          <span>Live Interactive Sandbox</span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] bg-primary/10 text-primary border border-primary/20">
                            Embedded Preview
                          </span>
                        </h4>
                        <a
                          href={selectedProject.live}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-primary hover:underline flex items-center gap-1 font-semibold bg-primary/10 px-3 py-1 rounded-lg border border-primary/20 hover:bg-primary/20 transition-all"
                        >
                          Open in New Tab <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>

                      {/* Security Notice for Streamlit / Vercel Security Headers */}
                      <div className="px-3.5 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between text-xs text-amber-200/90 gap-2">
                        <span className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                          <span>If cloud security headers (X-Frame-Options) restrict preview in your browser:</span>
                        </span>
                        <a
                          href={selectedProject.live}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-semibold whitespace-nowrap transition-colors flex items-center gap-1 text-[11px]"
                        >
                          Launch Live App <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>

                      <div className="rounded-2xl overflow-hidden border border-white/10 bg-black/60 h-80 relative shadow-2xl group">
                        <iframe
                          src={selectedProject.live}
                          title={selectedProject.title}
                          className="w-full h-full border-0"
                          loading="lazy"
                          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals allow-downloads"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-glass-border">
                  {selectedProject.github && (
                    <a
                      href={selectedProject.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl glass glass-hover text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Github className="w-4 h-4" />
                      GitHub Repository
                    </a>
                  )}
                  {selectedProject.live && (
                    <a
                      href={selectedProject.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary/15 border border-primary/30 text-sm font-medium text-primary hover:bg-primary/20 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Launch Live Website
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ArchitectureModal
        isOpen={!!archModalTitle}
        onClose={() => setArchModalTitle(null)}
        projectTitle={archModalTitle || ''}
      />

      <ProjectPreviewModal
        isOpen={!!previewProject}
        onClose={() => setPreviewProject(null)}
        liveUrl={previewProject?.liveUrl || ''}
        title={previewProject?.title || ''}
      />
    </section>
  )
}
