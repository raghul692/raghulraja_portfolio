'use client'

import { useEffect, useRef, memo } from 'react'
import { useTheme, EnvironmentalTheme } from '@/contexts/ThemeContext'

interface Particle {
  x: number
  y: number
  radius: number
  alpha: number
  speedY: number
  speedX: number
  length?: number
  layer?: number
  wobble?: number
  wobbleSpeed?: number
}

function EnvironmentalBackdropComponent() {
  const { theme } = useTheme()
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const animFrameIdRef = useRef<number | null>(null)
  const particlesRef = useRef<Particle[]>([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)
    const isMobile = width < 768

    // Check system preference for reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // Handle viewport resize with High-DPI support
    const handleResize = () => {
      if (!canvas) return
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
      initParticles(theme)
    }

    window.addEventListener('resize', handleResize, { passive: true })

    // Cancel any active animation frame
    if (animFrameIdRef.current) {
      cancelAnimationFrame(animFrameIdRef.current)
      animFrameIdRef.current = null
    }

    // Initialize particles depending on active environmental mode
    const initParticles = (currentMode: EnvironmentalTheme) => {
      particlesRef.current = []

      if (currentMode === 'moon') {
        // MOON MODE: Futuristic falling micro-stars
        const count = isMobile ? 28 : 55
        for (let i = 0; i < count; i++) {
          particlesRef.current.push({
            x: Math.random() * width,
            y: Math.random() * height,
            radius: Math.random() * 1.2 + 0.6,
            alpha: Math.random() * 0.6 + 0.25,
            speedY: prefersReducedMotion ? 0 : Math.random() * 0.25 + 0.12,
            speedX: 0,
            wobble: Math.random() * Math.PI * 2,
            wobbleSpeed: Math.random() * 0.015 + 0.005,
          })
        }
      } else if (currentMode === 'rain') {
        // RAIN MODE: Multi-depth realistic rainfall streaks
        const count = isMobile ? 45 : 95
        for (let i = 0; i < count; i++) {
          const isForeground = Math.random() > 0.45
          particlesRef.current.push({
            x: Math.random() * (width + 200) - 100,
            y: Math.random() * height,
            radius: isForeground ? 1.1 : 0.7,
            alpha: isForeground ? Math.random() * 0.25 + 0.35 : Math.random() * 0.15 + 0.12,
            speedY: prefersReducedMotion ? 0 : isForeground ? Math.random() * 10 + 24 : Math.random() * 8 + 15,
            speedX: prefersReducedMotion ? 0 : isForeground ? -2.5 : -1.5, // Subtle realistic slant
            length: isForeground ? Math.random() * 18 + 26 : Math.random() * 10 + 14,
            layer: isForeground ? 2 : 1,
          })
        }
      } else if (currentMode === 'snow') {
        // SNOW MODE: Soft drifting winter frost flakes
        const count = isMobile ? 24 : 50
        for (let i = 0; i < count; i++) {
          particlesRef.current.push({
            x: Math.random() * width,
            y: Math.random() * height,
            radius: Math.random() * 1.8 + 1.2,
            alpha: Math.random() * 0.5 + 0.35,
            speedY: prefersReducedMotion ? 0 : Math.random() * 0.8 + 0.5,
            speedX: 0,
            wobble: Math.random() * Math.PI * 2,
            wobbleSpeed: Math.random() * 0.02 + 0.01,
          })
        }
      }
    }

    initParticles(theme)

    // SUN and DARK modes require NO active canvas animation loop (0% CPU/GPU overhead)
    if (theme === 'sun' || theme === 'dark') {
      ctx.clearRect(0, 0, width, height)
      return () => {
        window.removeEventListener('resize', handleResize)
      }
    }

    // Single unified requestAnimationFrame loop for active particle systems
    let time = 0
    const render = () => {
      ctx.clearRect(0, 0, width, height)
      time += 0.016

      const particles = particlesRef.current

      if (theme === 'moon') {
        // Render Falling Stars
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i]
          if (!prefersReducedMotion) {
            p.y += p.speedY
            p.wobble = (p.wobble || 0) + (p.wobbleSpeed || 0.01)
            p.x += Math.sin(p.wobble) * 0.08

            // Respawn at top if moved below viewport
            if (p.y > height) {
              p.y = -5
              p.x = Math.random() * width
            }
          }

          const currentAlpha = Math.min(1, Math.max(0.1, p.alpha + Math.sin(time * 2 + i) * 0.15))
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(224, 231, 255, ${currentAlpha})`
          ctx.shadowBlur = 4
          ctx.shadowColor = 'rgba(165, 180, 252, 0.4)'
          ctx.fill()
          ctx.shadowBlur = 0
        }
      } else if (theme === 'rain') {
        // Render Multi-Depth Rain Streaks
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i]
          if (!prefersReducedMotion) {
            p.y += p.speedY
            p.x += p.speedX

            if (p.y > height + 50 || p.x < -100) {
              p.y = -50
              p.x = Math.random() * (width + 200)
            }
          }

          const len = p.length || 25
          ctx.beginPath()
          ctx.moveTo(p.x, p.y)
          ctx.lineTo(p.x + p.speedX * 1.5, p.y + len)
          ctx.strokeStyle =
            p.layer === 2
              ? `rgba(186, 230, 253, ${p.alpha})` // Foreground cyan-white
              : `rgba(125, 211, 252, ${p.alpha})` // Background soft blue
          ctx.lineWidth = p.radius
          ctx.stroke()
        }
      } else if (theme === 'snow') {
        // Render Soft Drifting Snowflakes
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i]
          if (!prefersReducedMotion) {
            p.y += p.speedY
            p.wobble = (p.wobble || 0) + (p.wobbleSpeed || 0.015)
            p.x += Math.sin(p.wobble) * 0.55

            if (p.y > height + 10) {
              p.y = -10
              p.x = Math.random() * width
            }
          }

          ctx.beginPath()
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(248, 250, 252, ${p.alpha})`
          ctx.shadowBlur = 6
          ctx.shadowColor = 'rgba(226, 232, 240, 0.6)'
          ctx.fill()
          ctx.shadowBlur = 0
        }
      }

      if (!prefersReducedMotion) {
        animFrameIdRef.current = requestAnimationFrame(render)
      }
    }

    render()

    return () => {
      window.removeEventListener('resize', handleResize)
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current)
        animFrameIdRef.current = null
      }
    }
  }, [theme])

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden transition-opacity duration-700 select-none"
    >
      {/* Dynamic Environmental Atmospheric Gradient Layers */}
      <div className="absolute inset-0 transition-all duration-700 environmental-gradient-overlay" />

      {/* Atmospheric Mist for Rain Mode */}
      {theme === 'rain' && (
        <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-sky-950/20 via-sky-900/5 to-transparent pointer-events-none transition-opacity duration-700" />
      )}

      {/* Ambient Soft Glow for Sun Mode */}
      {theme === 'sun' && (
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-gradient-to-b from-amber-200/20 via-orange-100/10 to-transparent rounded-full blur-3xl pointer-events-none transition-opacity duration-700" />
      )}

      {/* Canvas for Particle Rendering (Moon, Rain, Snow) */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />
    </div>
  )
}

export const EnvironmentalBackdrop = memo(EnvironmentalBackdropComponent)
export default EnvironmentalBackdrop
