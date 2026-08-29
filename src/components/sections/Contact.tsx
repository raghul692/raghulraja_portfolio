'use client'

import { useState, useRef, useEffect, type FormEvent } from 'react'
import { motion, useInView } from 'framer-motion'
import {
  Mail,
  Phone,
  MapPin,
  Github,
  Linkedin,
  Send,
  Loader2,
  CheckCircle2,
  XCircle,
  User,
  AtSign,
  MessageSquare,
  FileText,
} from 'lucide-react'
import { resume } from '@/data/resume'
import { cn } from '@/utils/cn'

type FormState = {
  name: string
  email: string
  subject: string
  message: string
  website: string
}

type FormErrors = Partial<Record<keyof FormState, string>>

const contactInfo = [
  {
    icon: Mail,
    label: 'Email',
    value: resume.email,
    href: `mailto:${resume.email}`,
    color: 'text-primary',
  },
  {
    icon: Phone,
    label: 'Phone',
    value: resume.phone,
    href: `tel:${resume.phone.replace(/\s/g, '')}`,
    color: 'text-secondary',
  },
  {
    icon: MapPin,
    label: 'Location',
    value: resume.location,
    href: '#',
    color: 'text-accent',
  },
]

const socialLinks = [
  { icon: Github, href: resume.socials.github, label: 'GitHub' },
  { icon: Linkedin, href: resume.socials.linkedin, label: 'LinkedIn' },
]

export default function Contact() {
  const [formState, setFormState] = useState<FormState>({
    name: '',
    email: '',
    subject: '',
    message: '',
    website: '',
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [submitMessage, setSubmitMessage] = useState('')

  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  useEffect(() => {
    if (submitStatus !== 'idle') {
      const timer = setTimeout(() => {
        setSubmitStatus('idle')
        setSubmitMessage('')
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [submitStatus])

  const validate = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formState.name.trim()) {
      newErrors.name = 'Name is required'
    }

    if (!formState.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formState.email)) {
      newErrors.email = 'Please enter a valid email'
    }

    if (formState.message.trim().length < 20) {
      newErrors.message = 'Message must be at least 20 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const getApiUrl = (): string => {
    if (import.meta.env.VITE_PORTFOLIO_AI_API_URL) {
      return import.meta.env.VITE_PORTFOLIO_AI_API_URL;
    }
    if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
      return 'http://localhost:8000/api';
    }
    return 'https://raghulraja-portfolio.onrender.com/api';
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!validate()) {
      setSubmitStatus('error')
      setSubmitMessage('Please check form fields: Name, Email, and Message (at least 20 characters) are required.')
      return
    }

    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      const apiUrl = getApiUrl();
      const response = await fetch(`${apiUrl}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formState.name,
          email: formState.email,
          subject: formState.subject || 'No subject',
          message: formState.message,
          honeypot: formState.website,
        }),
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        throw new Error(data.detail || data.message || 'Failed to send message')
      }

      setSubmitStatus('success')
      setSubmitMessage(data.message || 'Message sent successfully! I will get back to you soon.')
      setFormState({ name: '', email: '', subject: '', message: '', website: '' })
    } catch (err: unknown) {
      setSubmitStatus('error')
      const errorMessage = err instanceof Error ? err.message : 'Failed to send message. Please try again later.'
      setSubmitMessage(
        errorMessage.includes('Failed to fetch') || errorMessage.includes('NetworkError')
          ? 'Backend server is offline or unreachable. Please check backend connection.'
          : errorMessage
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const inputVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: { delay: i * 0.1, duration: 0.4 },
    }),
  }

  return (
    <section id="contact" className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-mesh-gradient opacity-40" />

      <div className="relative max-w-7xl mx-auto px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-xs font-medium text-secondary mb-4">
            <Send className="w-3.5 h-3.5" />
            Let's Connect
          </span>
          <h2 className="font-heading font-bold text-4xl md:text-5xl lg:text-6xl tracking-tight mb-4">
            <span className="bg-gradient-to-r from-secondary via-primary to-accent bg-clip-text text-transparent">
              Get In Touch
            </span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto text-balance">
            Have a project in mind or want to collaborate? I would love to hear from you.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-3"
          >
            <form onSubmit={handleSubmit} className="glass rounded-3xl p-6 md:p-8 shadow-glass">
              <div className="space-y-5">
                <motion.div custom={0} variants={inputVariants} initial="hidden" animate={isInView ? 'visible' : 'hidden'}>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">
                    Name <span className="text-destructive">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      id="name"
                      type="text"
                      value={formState.name}
                      onChange={e => setFormState(prev => ({ ...prev, name: e.target.value }))}
                      className={cn(
                        'w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border text-sm transition-all duration-300 outline-none',
                        errors.name
                          ? 'border-destructive/50 focus:border-destructive'
                          : 'border-glass-border focus:border-primary'
                      )}
                      placeholder="Your full name"
                    />
                  </div>
                  {errors.name && <p className="mt-1.5 text-xs text-destructive">{errors.name}</p>}
                </motion.div>

                <motion.div custom={1} variants={inputVariants} initial="hidden" animate={isInView ? 'visible' : 'hidden'}>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    Email <span className="text-destructive">*</span>
                  </label>
                  <div className="relative">
                    <AtSign className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      id="email"
                      type="email"
                      value={formState.email}
                      onChange={e => setFormState(prev => ({ ...prev, email: e.target.value }))}
                      className={cn(
                        'w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border text-sm transition-all duration-300 outline-none',
                        errors.email
                          ? 'border-destructive/50 focus:border-destructive'
                          : 'border-glass-border focus:border-primary'
                      )}
                      placeholder="you@example.com"
                    />
                  </div>
                  {errors.email && <p className="mt-1.5 text-xs text-destructive">{errors.email}</p>}
                </motion.div>

                <motion.div custom={2} variants={inputVariants} initial="hidden" animate={isInView ? 'visible' : 'hidden'}>
                  <label htmlFor="subject" className="block text-sm font-medium mb-2">
                    Subject <span className="text-muted-foreground text-xs">(optional)</span>
                  </label>
                  <div className="relative">
                    <FileText className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      id="subject"
                      type="text"
                      value={formState.subject}
                      onChange={e => setFormState(prev => ({ ...prev, subject: e.target.value }))}
                      className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-glass-border focus:border-primary text-sm transition-all duration-300 outline-none"
                      placeholder="What's this about?"
                    />
                  </div>
                </motion.div>

                <motion.div custom={3} variants={inputVariants} initial="hidden" animate={isInView ? 'visible' : 'hidden'}>
                  <label htmlFor="message" className="block text-sm font-medium mb-2">
                    Message <span className="text-destructive">*</span>
                  </label>
                  <div className="relative">
                    <MessageSquare className="absolute left-3.5 top-4 w-4 h-4 text-muted-foreground" />
                    <textarea
                      id="message"
                      rows={5}
                      value={formState.message}
                      onChange={e => setFormState(prev => ({ ...prev, message: e.target.value }))}
                      className={cn(
                        'w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border text-sm transition-all duration-300 outline-none resize-none',
                        errors.message
                          ? 'border-destructive/50 focus:border-destructive'
                          : 'border-glass-border focus:border-primary'
                      )}
                      placeholder="Tell me about your project or idea..."
                    />
                  </div>
                  {errors.message && <p className="mt-1.5 text-xs text-destructive">{errors.message}</p>}
                  <p className="mt-1.5 text-xs text-muted-foreground">
                    {formState.message.length}/20 characters minimum
                  </p>
                </motion.div>
              </div>

              <input
                type="text"
                name="website"
                value={formState.website}
                onChange={e => setFormState(prev => ({ ...prev, website: e.target.value }))}
                className="hidden"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
              />

              <motion.button
                custom={4}
                variants={inputVariants}
                initial="hidden"
                animate={isInView ? 'visible' : 'hidden'}
                type="submit"
                disabled={isSubmitting}
                className={cn(
                  'mt-6 w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold transition-all duration-300',
                  isSubmitting
                    ? 'bg-primary/50 cursor-not-allowed'
                    : 'bg-gradient-to-r from-primary to-secondary text-white hover:shadow-glow'
                )}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Send Message
                  </>
                )}
              </motion.button>

              {submitStatus !== 'idle' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    'mt-4 p-4 rounded-xl flex items-center gap-3',
                    submitStatus === 'success'
                      ? 'bg-green-500/10 border border-green-500/20'
                      : 'bg-destructive/10 border border-destructive/20'
                  )}
                >
                  {submitStatus === 'success' ? (
                    <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
                  ) : (
                    <XCircle className="w-5 h-5 text-destructive shrink-0" />
                  )}
                  <span
                    className={cn(
                      'text-sm',
                      submitStatus === 'success' ? 'text-green-400' : 'text-destructive'
                    )}
                  >
                    {submitMessage}
                  </span>
                </motion.div>
              )}
            </form>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-2 space-y-6"
          >
            <div className="glass rounded-3xl p-6 md:p-8 shadow-glass">
              <h3 className="font-heading font-semibold text-lg mb-6">Contact Information</h3>
              <div className="space-y-5">
                {contactInfo.map(item => (
                  <a
                    key={item.label}
                    href={item.href}
                    className="flex items-center gap-4 group"
                  >
                    <div className="p-3 rounded-xl bg-white/5 border border-white/10 group-hover:border-primary/30 transition-colors">
                      <item.icon className={cn('w-5 h-5', item.color)} />
                    </div>
                    <div>
                      <span className="block text-xs text-muted-foreground mb-0.5">
                        {item.label}
                      </span>
                      <span className="text-sm font-medium group-hover:text-foreground transition-colors">
                        {item.value}
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            <div className="glass rounded-3xl p-6 md:p-8 shadow-glass">
              <h3 className="font-heading font-semibold text-lg mb-6">Connect</h3>
              <div className="flex gap-3">
                {socialLinks.map(social => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-primary/30 hover:bg-primary/5 transition-all duration-300 group"
                  >
                    <social.icon className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                    <span className="text-sm font-medium">{social.label}</span>
                  </a>
                ))}
              </div>
            </div>

            <div className="glass rounded-3xl p-6 md:p-8 shadow-glass">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <MessageSquare className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-heading font-semibold text-lg">Response Time</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                I typically respond within 24 hours. For urgent inquiries, feel free to reach out directly via email or phone.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
