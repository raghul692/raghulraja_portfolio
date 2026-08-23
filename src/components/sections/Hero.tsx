'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  MapPin,
  Mail,
  Phone,
  Download,
  ArrowRight,
  Github,
  Linkedin,
  Instagram,
  Sparkles,
  Globe,
  Monitor,
  Rocket,
  FileText,
} from 'lucide-react'
import { resume, certificates } from '@/data/resume'
import ResumeModal from '@/components/ui/ResumeModal'

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.3 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] },
  },
}

export default function Hero() {
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 })
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false)

  const summaryText =
    'I build scalable full-stack web applications, AI-powered software, and modern digital experiences using React, Node.js, Python, and Cloud technologies.\n\nFocused on clean architecture, performance, security, and exceptional user experience.'

  useEffect(() => {
    const updateMouse = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      })
    }
    window.addEventListener('mousemove', updateMouse)
    return () => window.removeEventListener('mousemove', updateMouse)
  }, [])

  const handleDownloadResume = () => {
    const link = document.createElement('a')
    link.href = '/resume/my_resume.pdf'
    link.download = 'Raghul_Raja_Resume.pdf'
    link.click()
  }

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-surface-dark">
      <div className="absolute inset-0 bg-mesh-gradient opacity-40" />

      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(99,102,241,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.5) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-accent/5 rounded-full blur-[80px] animate-pulse" style={{ animationDelay: '2s' }} />

      <motion.div
        className="absolute inset-0 pointer-events-none opacity-[0.06]"
        animate={{
          background: `radial-gradient(600px circle at ${mousePos.x}% ${mousePos.y}%, rgba(99,102,241,0.3), transparent 60%)`,
        }}
        transition={{ duration: 0.3 }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-24 md:py-32 w-full">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16"
        >
          <div className="flex-1 text-center lg:text-left order-2 lg:order-1">
            <motion.div variants={itemVariants} className="mb-6 flex justify-center lg:justify-start">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border-glass-border text-xs font-medium text-muted-foreground">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                </span>
                Available for Internship
              </span>
            </motion.div>

            <motion.h1 variants={itemVariants} className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-3">
              Hi, I'm{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-primary bg-[length:200%_auto] animate-aurora">
                {resume.name}
              </span>
            </motion.h1>

            <motion.div variants={itemVariants} className="mb-4">
              <p className="font-heading text-xl sm:text-2xl md:text-3xl font-semibold text-foreground">
                Full Stack Developer
              </p>
            </motion.div>

            <motion.p variants={itemVariants} className="text-base sm:text-lg text-muted-foreground mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed whitespace-pre-line">
              {summaryText}
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mb-8">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl glass border-glass-border text-sm text-foreground hover:border-glass-borderHover transition-all">
                <MapPin className="w-4 h-4 text-secondary" />
                Villupuram, Tamil Nadu
              </span>
              <a href={`mailto:${resume.email}`} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl glass border-glass-border text-sm text-foreground hover:border-glass-borderHover transition-all">
                <Mail className="w-4 h-4 text-primary" />
                Email
              </a>
              <a href={`tel:${resume.phone.replace(/\s/g, '')}`} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl glass border-glass-border text-sm text-foreground hover:border-glass-borderHover transition-all">
                <Phone className="w-4 h-4 text-accent" />
                Phone
              </a>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl glass border-glass-border text-sm text-foreground hover:border-glass-borderHover transition-all">
                <Globe className="w-4 h-4 text-secondary" />
                Remote Friendly
              </span>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl glass border-glass-border text-sm text-foreground hover:border-glass-borderHover transition-all">
                <Monitor className="w-4 h-4 text-accent" />
                IST Timezone
              </span>
            </motion.div>

            <motion.div variants={itemVariants} className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mb-8">
              <a
                href="#projects"
                className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-medium text-sm hover:bg-primary/90 transition-all hover:shadow-glow hover:scale-[1.02] active:scale-[0.98]"
              >
                <Rocket className="w-4 h-4" />
                View Projects
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </a>
              <button
                onClick={() => setIsResumeModalOpen(true)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl glass border-primary/30 text-sm font-medium text-foreground hover:border-primary/60 hover:bg-primary/10 transition-all hover:shadow-glass-hover hover:scale-[1.02] active:scale-[0.98]"
              >
                <FileText className="w-4 h-4 text-primary" />
                View Resume
              </button>
              <button
                onClick={handleDownloadResume}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl glass border-glass-border text-sm font-medium text-foreground hover:border-glass-borderHover transition-all hover:shadow-glass-hover hover:scale-[1.02] active:scale-[0.98]"
              >
                <Download className="w-4 h-4" />
                Download PDF
              </button>
              <a
                href="#contact"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl glass border-glass-border text-sm font-medium text-foreground hover:border-glass-borderHover transition-all hover:shadow-glass-hover hover:scale-[1.02] active:scale-[0.98]"
              >
                <Sparkles className="w-4 h-4 text-accent" />
                Hire Me
              </a>
            </motion.div>

            <motion.div variants={itemVariants} className="flex items-center justify-center lg:justify-start gap-2 mb-8">
              {[
                { icon: Github, href: resume.socials.github, label: 'GitHub' },
                { icon: Linkedin, href: resume.socials.linkedin, label: 'LinkedIn' },
                { icon: Instagram, href: resume.socials.instagram, label: 'Instagram' },
                { icon: Mail, href: `mailto:${resume.email}`, label: 'Email' },
              ].map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.15, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2.5 rounded-xl glass border-glass-border text-muted-foreground hover:text-foreground hover:border-glass-borderHover transition-all hover:shadow-glass group relative"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                  <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-md bg-surface-dark border border-glass-border text-[10px] text-muted-foreground whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    {social.label}
                  </span>
                </motion.a>
              ))}
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
              {[
                { label: 'Projects', value: resume.projects.length, suffix: '+' },
                { label: 'Certificates', value: certificates.length, suffix: '+' },
                { label: 'CGPA Score', value: '8.2', suffix: '' },
                { label: 'Experience', value: `${resume.experience.length}`, suffix: ' Intern' },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="glass rounded-2xl p-4 text-center glass-hover border border-glass-border"
                >
                  <div className="font-heading text-2xl md:text-3xl font-bold">
                    {stat.value}
                    <span className="text-primary">{stat.suffix}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
                </motion.div>
              ))}
            </div>

            <motion.div variants={itemVariants} className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
              {['Full Stack', 'AI/ML', 'UI/UX', 'Problem Solver'].map((text, i) => (
                <motion.span
                  key={text}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 + i * 0.08 }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full glass border-glass-border text-xs text-muted-foreground"
                >
                  {text}
                </motion.span>
              ))}
            </motion.div>
          </div>

          <motion.div
            variants={itemVariants}
            className="flex-shrink-0 order-1 lg:order-2 flex items-center justify-center"
          >
            <div className="relative w-56 h-56 sm:w-72 sm:h-72 md:w-80 md:h-80 lg:w-96 lg:h-96">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20" />

              <div className="absolute inset-0 rounded-full glass border-2 border-glass-border overflow-hidden">
                <img
                  src="/images/profile_img.jpeg"
                  alt={resume.name}
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
            </div>
          </motion.div>

        </motion.div>
      </div>

      <ResumeModal
        isOpen={isResumeModalOpen}
        onClose={() => setIsResumeModalOpen(false)}
      />
    </section>
  )
}