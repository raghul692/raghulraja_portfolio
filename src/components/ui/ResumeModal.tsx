'use client'

import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  Download,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Award,
  Code2,
  Sparkles,
  CheckCircle2,
} from 'lucide-react'
import { resume } from '@/data/resume'

interface ResumeModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function ResumeModal({ isOpen, onClose }: ResumeModalProps) {
  if (!isOpen) return null

  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = '/resume/my_resume.pdf'
    link.download = 'Raghul_Raja_Resume.pdf'
    link.click()
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-4xl bg-surface-dark border border-glass-border rounded-2xl shadow-2xl overflow-hidden z-10 my-8 max-h-[90vh] flex flex-col"
        >
          {/* Header Bar */}
          <div className="px-6 py-4 border-b border-glass-border flex items-center justify-between bg-surface-dark/80 backdrop-blur-md sticky top-0 z-20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-lg text-foreground">Interactive Resume Showcase</h3>
                <p className="text-xs text-muted-foreground">Raghul Raja M — Full-Stack & AI Engineer</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleDownload}
                className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white text-xs font-medium hover:bg-primary/90 transition-all hover:shadow-glow"
              >
                <Download className="w-4 h-4" />
                Download PDF
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-xl glass hover:bg-white/10 text-muted-foreground hover:text-foreground transition-all"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Modal Body Content */}
          <div className="p-6 overflow-y-auto space-y-8 custom-scrollbar">
            {/* Top Profile Summary Card */}
            <div className="glass rounded-2xl p-6 border border-glass-border bg-gradient-to-br from-primary/5 via-transparent to-secondary/5">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <div>
                  <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground mb-1">
                    {resume.name}
                  </h2>
                  <p className="text-primary font-semibold text-base">{resume.title}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/20 text-xs font-medium flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    Available for Hiring
                  </span>
                  <span className="px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-medium">
                    CGPA: 8.2
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-3 border-t border-glass-border text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-primary" />
                  <a href={`mailto:${resume.email}`} className="hover:text-foreground transition-colors">
                    {resume.email}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-secondary" />
                  <a href={`tel:${resume.phone.replace(/\s/g, '')}`} className="hover:text-foreground transition-colors">
                    {resume.phone}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-accent" />
                  <span>{resume.location}</span>
                </div>
              </div>
            </div>

            {/* Experience Section */}
            <div>
              <div className="flex items-center gap-2 font-heading font-bold text-lg text-foreground mb-4">
                <Briefcase className="w-5 h-5 text-primary" />
                <span>Work Experience</span>
              </div>
              <div className="space-y-4">
                {resume.experience.map((exp, idx) => (
                  <div key={idx} className="glass rounded-xl p-5 border border-glass-border">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
                      <h4 className="font-heading font-semibold text-foreground text-base">{exp.role}</h4>
                      <span className="text-xs text-primary font-medium px-2.5 py-1 rounded-md bg-primary/10 border border-primary/20 w-fit">
                        {exp.period}
                      </span>
                    </div>
                    <p className="text-xs font-medium text-secondary mb-3">{exp.company} • {exp.location}</p>
                    <ul className="space-y-1.5 text-xs text-muted-foreground">
                      {exp.highlights.map((bullet, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-primary flex-shrink-0 mt-0.5" />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Education Section */}
            <div>
              <div className="flex items-center gap-2 font-heading font-bold text-lg text-foreground mb-4">
                <GraduationCap className="w-5 h-5 text-secondary" />
                <span>Education</span>
              </div>
              <div className="space-y-4">
                {resume.education.map((edu, idx) => (
                  <div key={idx} className="glass rounded-xl p-5 border border-glass-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h4 className="font-heading font-semibold text-foreground text-base">{edu.degree}</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">{edu.college} • {edu.location}</p>
                    </div>
                    <div className="text-left sm:text-right">
                      <span className="text-xs text-accent font-semibold px-3 py-1 rounded-full bg-accent/10 border border-accent/20 inline-block">
                        CGPA: {edu.cgpa}
                      </span>
                      <p className="text-[11px] text-muted-foreground mt-1">{edu.period}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Skills & Technologies */}
            <div>
              <div className="flex items-center gap-2 font-heading font-bold text-lg text-foreground mb-4">
                <Code2 className="w-5 h-5 text-accent" />
                <span>Technical Capabilities</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {Object.entries(resume.skills).map(([category, items], idx) => (
                  <div key={idx} className="glass rounded-xl p-4 border border-glass-border">
                    <h5 className="font-heading font-semibold text-xs text-foreground mb-3 text-primary uppercase tracking-wider">
                      {category}
                    </h5>
                    <div className="flex flex-wrap gap-1.5">
                      {items.map((skill, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[11px] text-muted-foreground"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Soft Skills & Languages */}
            <div>
              <div className="flex items-center gap-2 font-heading font-bold text-lg text-foreground mb-4">
                <Award className="w-5 h-5 text-yellow-400" />
                <span>Soft Skills & Core Competencies</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {resume.softSkills.map((skill, idx) => (
                  <span key={idx} className="px-3 py-1 rounded-lg glass border border-glass-border text-xs text-muted-foreground font-medium">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="px-6 py-4 border-t border-glass-border bg-surface-dark/80 backdrop-blur-md flex items-center justify-between">
            <span className="text-xs text-muted-foreground hidden sm:inline">
              Portfolio built with React 19, TypeScript & Tailwind CSS
            </span>
            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl glass text-xs text-muted-foreground hover:text-foreground transition-all"
              >
                Close Window
              </button>
              <button
                onClick={handleDownload}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-primary text-white text-xs font-medium hover:bg-primary/90 transition-all hover:shadow-glow"
              >
                <Download className="w-4 h-4" />
                Download PDF
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
