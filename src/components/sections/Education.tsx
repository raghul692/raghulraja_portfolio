'use client'

import { motion } from 'framer-motion'
import { GraduationCap, Award, BookOpen, Sparkles, CheckCircle2 } from 'lucide-react'
import { resume } from '@/data/resume'

const courses = [
  'Machine Learning & Data Mining',
  'Data Structures & Algorithms',
  'Database Management Systems (SQL)',
  'Web Development & React Architectures',
  'Object-Oriented Programming (Python/Java)',
  'Software Engineering & Agile',
  'Computer Networks & Security',
]

const milestones = [
  { year: '2026', title: 'AI with Data Science Intern at TVK Technologies' },
  { year: '2025', title: 'Certified Oracle Cloud Infrastructure AI Foundations Associate' },
  { year: '2025', title: 'Generative AI Internship at EBPL' },
  { year: '2023 - Present', title: 'B.E. Computer Science Engineering (Current CGPA: 8.2)' },
]

export default function Education() {
  return (
    <section id="education" className="relative py-24 bg-surface-dark/95 border-t border-glass-border">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center md:text-left"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 text-secondary text-xs font-semibold uppercase tracking-wider mb-3 border border-secondary/20">
            <GraduationCap className="w-4 h-4" /> Academic Excellence
          </div>
          <h2 className="font-heading text-4xl md:text-5xl font-bold tracking-tight">
            Education & <span className="bg-clip-text text-transparent bg-aurora-gradient animate-aurora">Milestones</span>
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl">
            Strong computer science foundation combined with practical industry internships and continuous certification.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Degree Card */}
          {resume.education.map((edu, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="lg:col-span-2 glass rounded-2xl p-8 hover:border-glass-borderHover transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-glass-border pb-6 mb-6">
                  <div>
                    <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium border border-primary/20">
                      {edu.period}
                    </span>
                    <h3 className="font-heading text-2xl font-bold text-foreground mt-3">
                      {edu.degree}
                    </h3>
                    <p className="text-secondary font-medium mt-1">{edu.college}</p>
                    <p className="text-xs text-muted-foreground">{edu.location}</p>
                  </div>

                  <div className="text-right glass px-5 py-3 rounded-xl border-secondary/30 bg-secondary/5">
                    <span className="text-xs text-muted-foreground block">Cumulative CGPA</span>
                    <span className="font-heading text-3xl font-extrabold text-secondary">
                      {edu.cgpa} <span className="text-sm text-muted-foreground font-normal">/ 10</span>
                    </span>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-primary" /> Key Academic Coursework
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {courses.map((course, cIdx) => (
                      <div key={cIdx} className="flex items-center gap-2 text-sm text-foreground/90 bg-white/5 px-3 py-2 rounded-lg border border-white/5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                        <span>{course}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-glass-border flex items-center justify-between text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5 text-accent">
                  <Sparkles className="w-4 h-4" /> SKP Engineering College CSE Alumnus Candidate
                </span>
                <span className="font-mono">Tiruvannamalai</span>
              </div>
            </motion.div>
          ))}

          {/* Academic Milestones Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="glass rounded-2xl p-8 hover:border-glass-borderHover transition-all flex flex-col justify-between"
          >
            <div>
              <h3 className="font-heading text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                <Award className="w-5 h-5 text-accent" /> Key Milestones
              </h3>

              <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-glass-border">
                {milestones.map((ms, mIdx) => (
                  <div key={mIdx} className="relative">
                    <div className="absolute -left-[23px] top-1.5 w-3 h-3 rounded-full bg-accent border-2 border-surface-dark shadow-glow" />
                    <span className="text-xs font-mono font-semibold text-accent block">{ms.year}</span>
                    <p className="text-sm font-medium text-foreground mt-0.5">{ms.title}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-glass-border text-center">
              <span className="text-xs text-muted-foreground">Continuous Learner & Tech Enthusiast</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
