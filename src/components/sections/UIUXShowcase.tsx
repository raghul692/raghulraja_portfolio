'use client'

import { useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import {
  Palette,
  Figma,
  ChevronUp,
  ExternalLink,
  Sparkles,
  Users,
  Lightbulb,
  Target,
  ArrowRight,
} from 'lucide-react'
import { resume } from '@/data/resume'
import { cn } from '@/utils/cn'

const uiuxProjects = resume.projects.filter(p => p.category === 'uiux')

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
  },
}

const caseStudyVariants = {
  collapsed: { height: 0, opacity: 0 },
  expanded: {
    height: 'auto',
    opacity: 1,
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
  },
}

export default function UIUXShowcase() {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="uiux" className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-mesh-gradient opacity-50" />

      <div className="relative max-w-7xl mx-auto px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-xs font-medium text-primary mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            Design Portfolio
          </span>
          <h2 className="font-heading font-bold text-4xl md:text-5xl lg:text-6xl tracking-tight mb-4">
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              UI/UX Design
            </span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto text-balance">
            Crafting intuitive digital experiences through user-centered design, prototyping, and thoughtful interaction design.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : {}}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          {uiuxProjects.map(project => {
            const isExpanded = expandedId === project.id
            const caseStudy = {
              problem: 'Users struggled with discovering and ordering homemade food through existing platforms, which lacked personalization and trust indicators for home cooks.',
              process: 'Conducted user interviews with 15 potential users, created user personas, mapped user journeys, designed wireframes, built interactive prototypes, and iterated based on usability testing feedback.',
              decisions: 'Chose a warm color palette to evoke homemade comfort, implemented a rating system for trust, designed a simplified checkout flow with fewer steps, and used card-based layouts for better scanability.',
              outcome: 'The final design achieved 92% task completion rate in usability testing, reduced checkout steps from 5 to 3, and received positive feedback on the warm, approachable interface.',
            }

            return (
              <motion.div
                key={project.id}
                variants={cardVariants}
                className="group glass rounded-3xl overflow-hidden shadow-glass hover:shadow-glass-hover transition-all duration-500"
              >
                <div className="relative h-64 overflow-hidden bg-gradient-to-br from-primary/20 via-secondary/10 to-accent/20">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative">
                      <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-glow-lg">
                        <Palette className="w-12 h-12 text-white" />
                      </div>
                      <div className="absolute -top-2 -right-2 w-8 h-8 rounded-xl bg-accent/20 flex items-center justify-center">
                        <Sparkles className="w-4 h-4 text-accent" />
                      </div>
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-surface to-transparent" />
                  <div className="absolute top-4 right-4 flex gap-2">
                    {project.tech.slice(0, 2).map(tech => (
                      <span
                        key={tech}
                        className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-white/70 backdrop-blur-sm"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <h3 className="font-heading font-semibold text-xl tracking-tight mb-1">
                        {project.title}
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {project.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tech.map(tech => (
                      <span
                        key={tech}
                        className="px-2.5 py-1 rounded-lg bg-primary/5 border border-primary/10 text-xs text-primary/80"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="space-y-2 mb-5">
                    {project.highlights.slice(0, 3).map((highlight, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-secondary shrink-0" />
                        <span className="text-sm text-muted-foreground">{highlight}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : project.id)}
                      className={cn(
                        'flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300',
                        isExpanded
                          ? 'bg-primary/10 text-primary border border-primary/20'
                          : 'bg-gradient-to-r from-primary to-secondary text-white hover:shadow-glow'
                      )}
                    >
                      {isExpanded ? (
                        <>
                          Hide Case Study
                          <ChevronUp className="w-4 h-4" />
                        </>
                      ) : (
                        <>
                          View Case Study
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>

                    {project.live && (
                      <a
                        href={project.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium glass glass-hover text-muted-foreground hover:text-foreground"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Live Demo
                      </a>
                    )}
                  </div>

                  <motion.div
                    variants={caseStudyVariants}
                    animate={isExpanded ? 'expanded' : 'collapsed'}
                    className="overflow-hidden"
                  >
                    <div className="pt-6 mt-6 border-t border-glass-border">
                      <div className="flex items-center gap-2 mb-4">
                        <Figma className="w-4 h-4 text-secondary" />
                        <span className="font-heading font-semibold text-sm uppercase tracking-wider text-secondary">
                          Case Study
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                          <div className="flex items-center gap-2 mb-2">
                            <Target className="w-4 h-4 text-primary" />
                            <span className="text-xs font-medium uppercase tracking-wider text-primary">
                              Problem
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {caseStudy.problem}
                          </p>
                        </div>

                        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                          <div className="flex items-center gap-2 mb-2">
                            <Users className="w-4 h-4 text-secondary" />
                            <span className="text-xs font-medium uppercase tracking-wider text-secondary">
                              Process
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {caseStudy.process}
                          </p>
                        </div>

                        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                          <div className="flex items-center gap-2 mb-2">
                            <Lightbulb className="w-4 h-4 text-accent" />
                            <span className="text-xs font-medium uppercase tracking-wider text-accent">
                              Key Decisions
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {caseStudy.decisions}
                          </p>
                        </div>

                        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                          <div className="flex items-center gap-2 mb-2">
                            <Sparkles className="w-4 h-4 text-green-400" />
                            <span className="text-xs font-medium uppercase tracking-wider text-green-400">
                              Outcome
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {caseStudy.outcome}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
