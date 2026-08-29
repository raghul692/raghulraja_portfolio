'use client'

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Award, Calendar, ExternalLink, FileText, Image as ImageIcon, RotateCw, ShieldCheck, Sparkles, Eye } from 'lucide-react'
import { Certificate } from '@/data/resume'
import soundEngine from '@/utils/soundEngine'
import { getCertificateUrl } from '@/components/sections/Certificates'

export function CertificateHoloCard3D({
  cert,
  onSelectCert,
  onOpenPdf,
}: {
  cert: Certificate
  onSelectCert: (cert: Certificate) => void
  onOpenPdf: (url: string, title: string) => void
}) {
  const [isFlipped, setIsFlipped] = useState(false)
  const [rotateX, setRotateX] = useState(0)
  const [rotateY, setRotateY] = useState(0)
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50, opacity: 0 })
  const cardRef = useRef<HTMLDivElement>(null)

  const isPdf = cert.file.toLowerCase().endsWith('.pdf')
  const fileUrl = getCertificateUrl(cert.file)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || isFlipped) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2

    const rX = ((y - centerY) / centerY) * -10
    const rY = ((x - centerX) / centerX) * 10

    setRotateX(rX)
    setRotateY(rY)

    const glareX = (x / rect.width) * 100
    const glareY = (y / rect.height) * 100
    setGlarePos({ x: glareX, y: glareY, opacity: 0.45 })
  }

  const handleMouseLeave = () => {
    setRotateX(0)
    setRotateY(0)
    setGlarePos(prev => ({ ...prev, opacity: 0 }))
  }

  const handleFlip = (e: React.MouseEvent) => {
    e.stopPropagation()
    soundEngine.playClickSound()
    setIsFlipped(!isFlipped)
  }

  const handleCardClick = () => {
    soundEngine.playClickSound()
    onSelectCert(cert)
  }

  return (
    <div
      className="perspective-1000 w-full min-h-[400px] cursor-pointer group"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={() => soundEngine.playHoverSound()}
      ref={cardRef}
    >
      <motion.div
        animate={{
          rotateX: isFlipped ? 0 : rotateX,
          rotateY: isFlipped ? 180 : rotateY,
        }}
        transition={{
          rotateX: { type: 'spring', stiffness: 300, damping: 20 },
          rotateY: isFlipped
            ? { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
            : { type: 'spring', stiffness: 300, damping: 20 },
        }}
        style={{ transformStyle: 'preserve-3d' }}
        className="relative w-full h-full rounded-3xl glass-spatial border border-white/15 p-6 shadow-2xl transition-shadow group-hover:shadow-[0_0_30px_rgba(99,102,241,0.3)] flex flex-col justify-between"
      >
        {/* Holographic Shiny Rainbow Glare Foil Layer */}
        <div
          className="absolute inset-0 rounded-3xl pointer-events-none transition-opacity duration-300 z-20 mix-blend-color-dodge overflow-hidden"
          style={{
            opacity: glarePos.opacity,
            background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(255,255,255,0.8) 0%, rgba(236,72,153,0.4) 25%, rgba(56,189,248,0.4) 50%, rgba(99,102,241,0.2) 75%, transparent 100%)`,
          }}
        />

        {/* ================= FRONT SIDE ================= */}
        <div
          className="w-full h-full flex flex-col justify-between space-y-4"
          style={{ backfaceVisibility: 'hidden' }}
          onClick={handleCardClick}
        >
          {/* Card Top Issuer Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-2xl bg-primary/20 text-cyan-400 border border-primary/30 shadow-[0_0_10px_rgba(99,102,241,0.3)]">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold block">
                  {cert.issuer}
                </span>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-secondary" /> {cert.date}
                </span>
              </div>
            </div>

            <span className="px-2.5 py-1 rounded-full text-[10px] font-mono bg-white/10 border border-white/20 text-slate-200 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" /> {isPdf ? 'PDF' : 'IMAGE'}
            </span>
          </div>

          {/* Certificate Title */}
          <div>
            <h3 className="font-heading text-lg font-bold text-foreground group-hover:text-cyan-300 transition-colors leading-snug">
              {cert.title}
            </h3>
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
              {cert.description}
            </p>
          </div>

          {/* Skills Tags */}
          <div className="flex flex-wrap gap-1.5">
            {cert.skills.slice(0, 3).map(skill => (
              <span
                key={skill}
                className="px-2 py-0.5 rounded-lg bg-secondary/10 text-cyan-300 text-[10px] font-mono border border-secondary/20"
              >
                {skill}
              </span>
            ))}
            {cert.skills.length > 3 && (
              <span className="px-2 py-0.5 rounded-lg bg-white/5 text-muted-foreground text-[10px] font-mono">
                {`+${cert.skills.length - 3} more`}
              </span>
            )}
          </div>

          {/* Card Action Footer */}
          <div className="pt-3 border-t border-white/10 flex items-center justify-between">
            <button
              onClick={handleFlip}
              className="inline-flex items-center gap-1.5 text-xs font-mono text-cyan-400 hover:text-cyan-300 transition-colors font-semibold group/btn"
            >
              <RotateCw className="w-3.5 h-3.5 group-hover/btn:rotate-180 transition-transform duration-500" />
              Flip Card 🔄
            </button>

            <span className="inline-flex items-center gap-1 text-xs font-mono text-primary font-semibold group-hover:translate-x-0.5 transition-transform">
              <Eye className="w-3.5 h-3.5" /> Quick View
            </span>
          </div>
        </div>

        {/* ================= BACK SIDE (FLIPPED 180°) ================= */}
        <div
          className="absolute inset-0 rounded-3xl p-6 glass-spatial border border-cyan-500/30 flex flex-col justify-between space-y-3 z-30"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          {/* Back Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-mono font-bold text-foreground">Verified Credential</span>
            </div>
            <button
              onClick={handleFlip}
              className="p-1.5 rounded-lg glass text-xs text-cyan-400 hover:text-white"
              title="Flip Card to Front"
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Credential Details */}
          <div className="space-y-2 text-xs">
            {cert.credentialId && (
              <div>
                <span className="text-[10px] font-mono text-muted-foreground uppercase block">Credential ID</span>
                <span className="font-mono text-cyan-300 font-semibold truncate block">{cert.credentialId}</span>
              </div>
            )}

            <div>
              <span className="text-[10px] font-mono text-muted-foreground uppercase block">Skills Verified</span>
              <div className="flex flex-wrap gap-1 mt-1 max-h-16 overflow-y-auto">
                {cert.skills.map(skill => (
                  <span key={skill} className="px-2 py-0.5 rounded bg-primary/20 text-white text-[10px]">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Back Action Buttons */}
          <div className="pt-2 border-t border-white/10 space-y-2">
            {isPdf ? (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  soundEngine.playClickSound()
                  onOpenPdf(fileUrl, cert.title)
                }}
                className="w-full py-2 rounded-xl bg-cyan-500/20 text-cyan-300 text-xs font-mono font-semibold border border-cyan-500/40 hover:bg-cyan-500/30 flex items-center justify-center gap-1.5 transition-colors"
              >
                <FileText className="w-3.5 h-3.5" />
                Interactive PDF Viewer
              </button>
            ) : (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  soundEngine.playClickSound()
                  onSelectCert(cert)
                }}
                className="w-full py-2 rounded-xl bg-cyan-500/20 text-cyan-300 text-xs font-mono font-semibold border border-cyan-500/40 hover:bg-cyan-500/30 flex items-center justify-center gap-1.5 transition-colors"
              >
                <ImageIcon className="w-3.5 h-3.5" />
                Full Image Preview
              </button>
            )}

            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="w-full py-2 rounded-xl bg-primary text-white text-xs font-mono font-semibold hover:bg-primary/90 flex items-center justify-center gap-1.5 transition-colors shadow-glow"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Open Certificate Direct ↗
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
