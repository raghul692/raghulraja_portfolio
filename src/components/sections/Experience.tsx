'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { resume } from '@/data/resume'
import { Briefcase, MapPin, UserCheck, Github, ExternalLink, FileText, Award, ChevronDown, Sparkles, CheckCircle2 } from 'lucide-react'
import { PdfViewerModal } from '@/components/ui/PdfViewerModal'

export default function Experience() {
  const [activePdf, setActivePdf] = useState<{ url: string; title: string } | null>(null)
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0) // first expanded by default

  return (
    <section
      id="experience"
      className="relative py-24 md:py-32 bg-surface-dark overflow-hidden"
    >
      <div className="absolute inset-0 bg-mesh-gradient opacity-40 pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7 }}
          className="mb-16 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-6"
        >
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider mb-3 border border-primary/20">
              <Briefcase className="w-4 h-4" /> Career Track Record
            </div>
            <h2 className="font-heading text-4xl md:text-5xl font-bold tracking-tight">
              Work <span className="bg-clip-text text-transparent bg-aurora-gradient animate-aurora">Experience</span>
            </h2>
            <p className="mt-2 text-muted-foreground max-w-xl text-sm">
              Proven track record in AI/ML software engineering, data science pipelines, and full-stack development.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 bg-cyan-950/30 px-3.5 py-2 rounded-xl border border-cyan-500/20 self-start md:self-auto">
            <Sparkles className="w-3.5 h-3.5" /> 100% Internship & Industry Verified
          </div>
        </motion.div>

        {/* Timeline Items with Expandable Accordions */}
        <div className="relative pl-6 md:pl-10">
          <div className="absolute left-2 md:left-4 top-3 bottom-3 w-0.5 bg-gradient-to-b from-primary via-secondary to-accent opacity-60" />

          <div className="space-y-8">
            {resume.experience.map((job, idx) => {
              const isExpanded = expandedIndex === idx

              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="relative group"
                >
                  {/* Timeline Dot Marker */}
                  <div
                    className={`absolute -left-[23px] md:-left-[31px] top-6 w-4 h-4 rounded-full border-4 border-surface-dark transition-all ${
                      isExpanded
                        ? 'bg-primary shadow-glow scale-125'
                        : 'bg-slate-600 group-hover:bg-primary/80'
                    }`}
                  />

                  <div className="glass rounded-2xl border border-glass-border hover:border-glass-borderHover transition-all overflow-hidden">
                    {/* Header Row (Clickable Accordion Trigger) */}
                    <button
                      onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                      className="w-full p-6 text-left flex items-start justify-between gap-4 bg-white/[0.02] hover:bg-white/[0.05] transition-colors cursor-pointer"
                    >
                      <div className="space-y-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-semibold font-mono border border-primary/20">
                            {job.period}
                          </span>
                          {job.location && (
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <MapPin className="w-3 h-3" /> {job.location}
                            </span>
                          )}
                        </div>

                        <h3 className="font-heading text-xl font-bold text-white group-hover:text-primary transition-colors">
                          {job.role}
                        </h3>
                        <p className="text-sm font-semibold text-secondary">{job.company}</p>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        {job.supervisor && (
                          <span className="hidden md:inline-flex items-center gap-1.5 text-xs text-muted-foreground glass px-3 py-1.5 rounded-xl border-white/10">
                            <UserCheck className="w-3.5 h-3.5 text-accent" /> {job.supervisor}
                          </span>
                        )}
                        <div className={`p-2 rounded-xl bg-white/5 text-muted-foreground transition-transform ${isExpanded ? 'rotate-180 text-white' : ''}`}>
                          <ChevronDown className="w-4 h-4" />
                        </div>
                      </div>
                    </button>

                    {/* Expandable Accordion Body */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="border-t border-glass-border p-6 space-y-5 bg-surface-dark/50"
                        >
                          {/* Highlights List */}
                          <ul className="space-y-2.5">
                            {job.highlights.map((highlight, hIdx) => (
                              <li
                                key={hIdx}
                                className="flex items-start gap-3 text-xs md:text-sm text-slate-300 leading-relaxed"
                              >
                                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                                <span>{highlight}</span>
                              </li>
                            ))}
                          </ul>

                          {/* Tech Stack Pills */}
                          {job.skills && (
                            <div className="pt-2">
                              <p className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground mb-2">
                                Technologies & Tools Applied
                              </p>
                              <div className="flex flex-wrap gap-1.5">
                                {job.skills.map(skill => (
                                  <span
                                    key={skill}
                                    className="px-2.5 py-1 rounded-lg text-xs font-medium font-mono bg-white/5 border border-white/10 text-slate-200"
                                  >
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Action Links */}
                          <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-white/10">
                            {job.github && (
                              <a
                                href={job.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl glass hover:bg-white/10 text-xs font-medium text-slate-200 border border-white/10 transition-all"
                              >
                                <Github className="w-4 h-4 text-primary" /> Repository
                              </a>
                            )}
                            {job.live && (
                              <a
                                href={job.live}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-primary/15 border border-primary/30 text-xs font-semibold text-primary hover:bg-primary/25 transition-all"
                              >
                                <ExternalLink className="w-4 h-4" /> Live Demo
                              </a>
                            )}
                            {job.certificate && (
                              <button
                                onClick={() => setActivePdf({ url: job.certificate!, title: `${job.company} - Internship Completion Letter` })}
                                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl glass hover:bg-emerald-500/10 text-xs font-medium text-emerald-400 border border-emerald-500/30 transition-all cursor-pointer"
                              >
                                <Award className="w-4 h-4 text-emerald-400" /> Completion Letter
                              </button>
                            )}
                            {job.projectReport && (
                              <button
                                onClick={() => setActivePdf({ url: job.projectReport!, title: `${job.company} - Project Report` })}
                                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl glass hover:bg-accent/10 text-xs font-medium text-accent border border-accent/30 transition-all cursor-pointer"
                              >
                                <FileText className="w-4 h-4 text-accent" /> Project Report PDF
                              </button>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>

      <PdfViewerModal
        isOpen={!!activePdf}
        onClose={() => setActivePdf(null)}
        pdfUrl={activePdf?.url || ''}
        title={activePdf?.title || ''}
      />
    </section>
  )
}
