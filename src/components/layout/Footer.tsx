'use client'

import { motion } from 'framer-motion'
import { Github, Linkedin, Instagram, Mail, MapPin, Phone, Globe } from 'lucide-react'
import { resume } from '@/data/resume'

const socials = [
  { icon: Github, href: resume.socials.github, label: 'GitHub' },
  { icon: Linkedin, href: resume.socials.linkedin, label: 'LinkedIn' },
  { icon: Instagram, href: resume.socials.instagram, label: 'Instagram' },
  { icon: Mail, href: `mailto:${resume.email}`, label: 'Email' },
]

const quickLinks = [
  { href: '#about', label: 'About' },
  { href: '#projects', label: 'Projects' },
  { href: '#experience', label: 'Experience' },
  { href: '#certificates', label: 'Certificates' },
  { href: '#contact', label: 'Contact' },
]

export default function Footer() {
  return (
    <footer className="relative border-t border-glass-border bg-surface-dark overflow-hidden">
      <div className="absolute inset-0 bg-mesh-gradient opacity-30" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-3 mb-6"
            >
              <img src="/assets/icon.png" alt="Logo" className="w-12 h-12 rounded-full object-cover" />
              <div>
                <h3 className="font-heading text-xl font-bold">{resume.name}</h3>
                <p className="text-sm text-muted-foreground">{resume.title}</p>
              </div>
            </motion.div>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-muted-foreground leading-relaxed mb-6 max-w-md"
            >
              Building scalable full-stack applications and AI-powered solutions. 
              Passionate about clean architecture, performance, and exceptional user experiences.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-wrap gap-3"
            >
              {socials.map(social => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-xl glass border-glass-border text-muted-foreground hover:text-foreground hover:border-glass-borderHover transition-all hover:shadow-glass group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface-dark"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </motion.div>
          </div>

          <div>
            <h4 className="font-heading text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map(link => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2 group rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    <span className="w-1 h-1 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-heading text-lg font-semibold mb-4">Contact Info</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                <span>{resume.location}</span>
              </li>
              <li>
                <a href={`mailto:${resume.email}`} className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors">
                  <Mail className="w-4 h-4 text-primary flex-shrink-0" />
                  <span>{resume.email}</span>
                </a>
              </li>
              <li>
                <a href={`tel:${resume.phone}`} className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors">
                  <Phone className="w-4 h-4 text-primary flex-shrink-0" />
                  <span>{resume.phone}</span>
                </a>
              </li>
              <li className="flex items-start gap-3 text-sm text-muted-foreground">
                <Globe className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                <span>Available for Remote Work</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="py-8 border-t border-glass-border">
          <p className="text-xs text-muted-foreground text-center">
            {new Date().getFullYear()} {resume.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
