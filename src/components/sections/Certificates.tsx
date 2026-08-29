'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { certificates, Certificate } from '@/data/resume'
import { cn } from '@/utils/cn'
import { useState, useMemo, useEffect } from 'react'
import {
  Brain,
  Cloud,
  Shield,
  Palette,
  BarChart,
  Award,
  X,
  ExternalLink,
  Search,
  Calendar,
  FileText,
  Sparkles,
  Eye,
} from 'lucide-react'

import { PdfViewerModal } from '@/components/ui/PdfViewerModal'
import { CertificateHoloCard3D } from '@/components/ui/CertificateHoloCard3D'
import soundEngine from '@/utils/soundEngine'

const categoryIcons: Record<string, any> = {
  ai: Brain,
  cloud: Cloud,
  security: Shield,
  design: Palette,
  data: BarChart,
  other: Award,
}

const categories = ['All', 'AI', 'Cloud', 'Security', 'Design', 'Data', 'Other']

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
}

const card = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0 },
}

export function getCertificateUrl(file: string): string {
  if (!file) return ''
  if (file.startsWith('http://') || file.startsWith('https://')) return file
  if (file.startsWith('/')) return encodeURI(file)
  return `/certificates/${encodeURI(file)}`
}

export default function Certificates() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [search, setSearch] = useState('')
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null)
  const [previewError, setPreviewError] = useState(false)
  const [activePdfModal, setActivePdfModal] = useState<{ url: string; title: string } | null>(null)

  const filtered = useMemo(() => {
    return certificates.filter((cert: Certificate) => {
      const matchesCategory =
        activeCategory === 'All' || cert.category === activeCategory.toLowerCase()
      const query = search.toLowerCase()
      const matchesSearch =
        cert.title.toLowerCase().includes(query) ||
        cert.issuer.toLowerCase().includes(query) ||
        cert.skills.some((skill: string) => skill.toLowerCase().includes(query))
      return matchesCategory && matchesSearch
    })
  }, [activeCategory, search])

  useEffect(() => {
    setPreviewError(false)
  }, [selectedCert])

  return (
    <section
      id="certificates"
      className="relative py-24 md:py-32 bg-surface-dark overflow-hidden"
    >
      <div className="absolute inset-0 bg-mesh-gradient opacity-40" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7 }}
          className="mb-12 md:mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs font-mono mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" /> 3D Foil Holographic Collector Cards
          </div>
          <h2 className="font-heading text-4xl md:text-5xl font-bold tracking-tight">
            <span className="bg-clip-text text-transparent bg-aurora-gradient animate-aurora">
              Certificates & Credentials
            </span>
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl">
            Interactive 3D Holographic Trading Cards featuring 180° double-sided flip, high-res previews & verified credential links.
          </p>
        </motion.div>

        {/* Filter & Search Bar */}
        <div className="mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            {categories.map(cat => {
              const isActive = activeCategory === cat
              return (
                <button
                  key={cat}
                  onClick={() => {
                    soundEngine.playClickSound()
                    setActiveCategory(cat)
                  }}
                  onMouseEnter={() => soundEngine.playHoverSound()}
                  className={cn(
                    'px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 border cursor-pointer',
                    isActive
                      ? 'bg-primary text-white border-primary shadow-glow'
                      : 'glass border-glass-border text-muted-foreground hover:text-foreground hover:border-glass-borderHover'
                  )}
                >
                  {cat}
                </button>
              )
            })}
          </div>

          <div className="relative w-full md:w-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by title, issuer, or skills..."
              className="w-full md:w-72 pl-10 pr-4 py-2 rounded-xl glass border-glass-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
            />
          </div>
        </div>

        {/* 3D Holographic Trading Cards Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          key={`${activeCategory}-${search}`}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filtered.map((cert: Certificate) => (
            <motion.div key={cert.id} variants={card}>
              <CertificateHoloCard3D
                cert={cert}
                onSelectCert={(c: Certificate) => setSelectedCert(c)}
                onOpenPdf={(url, title) => setActivePdfModal({ url, title })}
              />
            </motion.div>
          ))}
        </motion.div>

        {filtered.length === 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-12 text-center text-muted-foreground"
          >
            No certificates found matching your criteria.
          </motion.p>
        )}
      </div>

      {/* FULL CERTIFICATE DETAILS & DOCUMENT PREVIEW MODAL */}
      <AnimatePresence>
        {selectedCert && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              setSelectedCert(null)
              setPreviewError(false)
            }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3 }}
              onClick={e => e.stopPropagation()}
              className="glass border-glass-border rounded-3xl p-6 md:p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl space-y-6"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20">
                    {(() => {
                      const Icon = categoryIcons[selectedCert.category] || Award
                      return <Icon className="w-6 h-6" />
                    })()}
                  </div>
                  <div>
                    <h3 className="font-heading text-xl font-bold text-foreground">
                      {selectedCert.title}
                    </h3>
                    <p className="text-sm text-muted-foreground font-mono">
                      {selectedCert.issuer}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setSelectedCert(null)
                    setPreviewError(false)
                  }}
                  className="p-2 rounded-lg glass border-glass-border hover:border-glass-borderHover transition-colors cursor-pointer"
                  aria-label="Close"
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

              <div className="space-y-5">
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5 font-mono">
                    <Calendar className="w-4 h-4 text-secondary" />
                    Issued: {selectedCert.date}
                  </span>
                  {selectedCert.expiry && (
                    <span className="inline-flex items-center gap-1.5 font-mono">
                      <Calendar className="w-4 h-4 text-accent" />
                      Expires: {selectedCert.expiry}
                    </span>
                  )}
                </div>

                <p className="text-sm text-foreground/80 leading-relaxed">
                  {selectedCert.description}
                </p>

                <div className="flex flex-wrap gap-2">
                  {selectedCert.skills.map((skill: string) => (
                    <span
                      key={skill}
                      className="px-3 py-1.5 rounded-lg bg-secondary/10 text-secondary text-xs font-mono border border-secondary/20"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                {selectedCert.credentialId && (
                  <div className="glass rounded-xl p-4 border border-glass-border">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1 font-mono">
                      Credential ID
                    </p>
                    <p className="font-mono text-sm text-cyan-300 font-bold">
                      {selectedCert.credentialId}
                    </p>
                  </div>
                )}

                {/* CERTIFICATE DOCUMENT PREVIEW AREA */}
                <div className="pt-4 border-t border-glass-border space-y-4">
                  <p className="text-xs font-mono font-semibold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                    <Eye className="w-4 h-4 text-primary" /> Certificate Document Preview
                  </p>

                  {(() => {
                    const isPdf = selectedCert.file.toLowerCase().endsWith('.pdf')
                    const fileUrl = getCertificateUrl(selectedCert.file)

                    if (isPdf) {
                      return (
                        <div className="w-full h-80 md:h-[400px] rounded-2xl overflow-hidden border border-glass-border bg-neutral-950 relative shadow-inner">
                          <iframe
                            src={`${fileUrl}#toolbar=0&navpanes=0`}
                            className="w-full h-full border-0"
                            title={selectedCert.title}
                          />
                        </div>
                      )
                    }

                    return (
                      <div className="flex items-center justify-center p-4 rounded-2xl glass border border-glass-border bg-black/40 overflow-hidden">
                        {!previewError ? (
                          <img
                            src={fileUrl}
                            onError={() => setPreviewError(true)}
                            alt={selectedCert.title}
                            className="max-h-96 w-auto rounded-xl border border-glass-border object-contain shadow-2xl transition-transform hover:scale-105"
                          />
                        ) : (
                          <div className="flex flex-col items-center gap-2 py-8 text-sm text-muted-foreground">
                            <FileText className="w-8 h-8 text-primary" />
                            <span>Unable to load image preview</span>
                          </div>
                        )}
                      </div>
                    )
                  })()}

                  <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
                    {(() => {
                      const isPdf = selectedCert.file.toLowerCase().endsWith('.pdf')
                      const fileUrl = getCertificateUrl(selectedCert.file)

                      return (
                        <>
                          {isPdf && (
                            <button
                              onClick={() => {
                                soundEngine.playClickSound()
                                setActivePdfModal({ url: fileUrl, title: selectedCert.title })
                              }}
                              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl glass glass-hover text-cyan-300 text-sm font-mono border border-cyan-500/30 hover:border-cyan-500/60 transition-colors cursor-pointer"
                            >
                              <FileText className="w-4 h-4 text-primary" />
                              Interactive PDF Viewer
                            </button>
                          )}
                          <a
                            href={fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-mono font-semibold hover:bg-primary/90 transition-colors shadow-glow whitespace-nowrap cursor-pointer"
                          >
                            <ExternalLink className="w-4 h-4" />
                            Open Certificate ↗
                          </a>
                        </>
                      )
                    })()}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <PdfViewerModal
        isOpen={!!activePdfModal}
        onClose={() => setActivePdfModal(null)}
        pdfUrl={activePdfModal?.url || ''}
        title={activePdfModal?.title || ''}
      />
    </section>
  )
}
