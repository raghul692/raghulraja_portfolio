import { useEffect, useRef } from 'react'

interface VoiceWaveVisualizerProps {
  isActive: boolean
  label?: string
}

export default function VoiceWaveVisualizer({ isActive, label = 'AI Voice Engine Active' }: VoiceWaveVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    let step = 0

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const width = canvas.width
      const height = canvas.height
      const centerY = height / 2

      ctx.lineWidth = 2
      ctx.strokeStyle = isActive ? '#00E5FF' : '#334155'

      ctx.beginPath()
      for (let x = 0; x < width; x++) {
        const freq = isActive ? 0.05 : 0.01
        const amp = isActive ? Math.sin((x * 0.02) + (step * 0.1)) * 12 : 2
        const y = centerY + Math.sin(x * freq + step * 0.08) * amp
        if (x === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.stroke()

      step += 1
      animId = requestAnimationFrame(render)
    }

    render()

    return () => {
      cancelAnimationFrame(animId)
    }
  }, [isActive])

  return (
    <div className="flex items-center gap-2 p-1.5 px-3 rounded-xl bg-surface-darker/80 border border-white/10 text-xs font-mono">
      <canvas ref={canvasRef} width={80} height={20} className="rounded" />
      <span className={`text-[10px] uppercase font-bold tracking-wider ${isActive ? 'text-cyan-400 animate-pulse' : 'text-foreground/40'}`}>
        {isActive ? label : 'Voice Ready'}
      </span>
    </div>
  )
}
