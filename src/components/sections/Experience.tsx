import { useState } from 'react'
import { motion } from 'framer-motion'
import { resume } from '@/data/resume'
import { Briefcase, MapPin, UserCheck, Github, ExternalLink, FileText, Award } from 'lucide-react'
import { PdfViewerModal } from '@/components/ui/PdfViewerModal'

const sectionVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.2 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, x: -30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
  },
}

const dotVariants = {
  hidden: { scale: 0 },
  visible: {
    scale: 1,
    transition: { type: 'spring', stiffness: 300, damping: 20 },
  },
}

const lineVariants = {
  hidden: { scaleY: 0 },
  visible: {
    scaleY: 1,
    transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] },
  },
}

export default function Experience() {
  const [activePdf, setActivePdf] = useState<{ url: string; title: string } | null>(null)

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
          className="mb-16 md:mb-20 text-center md:text-left"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider mb-3 border border-primary/20">
            <Briefcase className="w-4 h-4" /> Career Track Record
          </div>
          <h2 className="font-heading text-4xl md:text-5xl font-bold tracking-tight">
            Work <span className="bg-clip-text text-transparent bg-aurora-gradient animate-aurora">Experience</span>
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl text-base">
            Proven track record in AI/ML software engineering, data science pipelines, and full-stack development internships.
          </p>
        </motion.div>

        <div className="relative pl-6 md:pl-10">
          {/* Continuous Vertical Timeline Line */}
          <motion.div
            variants={lineVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="absolute left-2 md:left-4 top-3 bottom-3 w-0.5 bg-gradient-to-b from-primary via-secondary to-accent origin-top"
          />

          <motion.div
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="space-y-12 md:space-y-16"
          >
            {resume.experience.map((job, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                className="relative flex flex-col md:flex-row items-start gap-6 group"
              >
                {/* Timeline Dot Marker */}
                <motion.div
                  variants={dotVariants}
                  className="absolute -left-[23px] md:-left-[31px] top-4 w-4 h-4 rounded-full bg-primary border-4 border-surface-dark shadow-glow z-10 group-hover:scale-125 transition-transform"
                />

                <div className="w-full">
                  <div className="glass rounded-2xl p-6 md:p-8 hover:border-glass-borderHover transition-all duration-300 hover:shadow-glass-hover space-y-5">
                    {/* Header Details */}
                    <div className="flex flex-wrap items-start justify-between gap-4 border-b border-glass-border pb-5">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold border border-primary/20">
                            <Briefcase className="w-3.5 h-3.5" />
                            {job.period}
                          </span>
                          {job.location && (
                            <span className="text-xs text-muted-foreground font-normal flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-muted-foreground" /> {job.location}
                            </span>
                          )}
                        </div>
                        <h3 className="font-heading text-2xl font-bold text-foreground">
                          {job.role}
                        </h3>
                        <p className="text-base font-semibold text-secondary mt-0.5">
                          {job.company}
                        </p>
                      </div>

                      {job.supervisor && (
                        <div className="flex items-center gap-2 text-xs text-muted-foreground glass px-3 py-2 rounded-xl border-white/10">
                          <UserCheck className="w-4 h-4 text-accent flex-shrink-0" />
                          <span>Supervised by: <strong className="text-foreground">{job.supervisor}</strong></span>
                        </div>
                      )}
                    </div>

                    {/* Bullet Highlights */}
                    <ul className="space-y-2.5">
                      {job.highlights.map((highlight, hIdx) => (
                        <li
                          key={hIdx}
                          className="flex items-start gap-3 text-sm text-muted-foreground leading-relaxed"
                        >
                          <span className="mt-2 w-1.5 h-1.5 rounded-full bg-secondary flex-shrink-0" />
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Skills Pills */}
                    {job.skills && (
                      <div className="pt-2">
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2.5">Key Skills & Technologies</p>
                        <div className="flex flex-wrap gap-2">
                          {job.skills.map((skill) => (
                            <span
                              key={skill}
                              className="px-3 py-1 rounded-lg text-xs font-medium bg-primary/10 border border-primary/20 text-primary"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Interactive Action Links */}
                    <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-glass-border">
                      {job.github && (
                        <a
                          href={job.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl glass glass-hover text-xs font-medium text-muted-foreground hover:text-foreground transition-all"
                        >
                          <Github className="w-4 h-4 text-primary" />
                          GitHub Repository
                        </a>
                      )}
                      {job.live && (
                        <a
                          href={job.live}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-primary/15 border border-primary/30 text-xs font-medium text-primary hover:bg-primary/25 transition-all"
                        >
                          <ExternalLink className="w-4 h-4" />
                          Live Application Demo
                        </a>
                      )}
                      {job.certificate && (
                        <button
                          onClick={() => setActivePdf({ url: job.certificate!, title: `${job.company} - ${job.role} Completion Letter` })}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl glass glass-hover text-xs font-medium text-emerald-400 border-emerald-500/20 hover:border-emerald-500/40 transition-all cursor-pointer"
                        >
                          <Award className="w-4 h-4 text-emerald-400" />
                          Completion Letter
                        </button>
                      )}
                      {job.projectReport && (
                        <button
                          onClick={() => setActivePdf({ url: job.projectReport!, title: `${job.company} - Multi-Disease System Project Report` })}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl glass glass-hover text-xs font-medium text-accent border-accent/20 hover:border-accent/40 transition-all cursor-pointer"
                        >
                          <FileText className="w-4 h-4 text-accent" />
                          Project Report PDF
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
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
