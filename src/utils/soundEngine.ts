'use client'

class SoundEngine {
  private ctx: AudioContext | null = null
  private isMuted: boolean = true

  constructor() {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('portfolio_sound_enabled')
      this.isMuted = saved !== 'true'
    }
  }

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
      if (AudioCtx) {
        this.ctx = new AudioCtx()
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume()
    }
  }

  public isSoundMuted(): boolean {
    return this.isMuted
  }

  public toggleSound(): boolean {
    this.isMuted = !this.isMuted
    if (typeof window !== 'undefined') {
      localStorage.setItem('portfolio_sound_enabled', String(!this.isMuted))
    }
    if (!this.isMuted) {
      this.playClickSound()
    }
    return this.isMuted
  }

  public playHoverSound() {
    if (this.isMuted) return
    try {
      this.initCtx()
      if (!this.ctx) return

      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()

      osc.type = 'sine'
      osc.frequency.setValueAtTime(800, this.ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(1400, this.ctx.currentTime + 0.03)

      gain.gain.setValueAtTime(0.015, this.ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.03)

      osc.connect(gain)
      gain.connect(this.ctx.destination)

      osc.start()
      osc.stop(this.ctx.currentTime + 0.03)
    } catch {
      // Ignore web audio context restrictions prior to user gesture
    }
  }

  public playClickSound() {
    if (this.isMuted) return
    try {
      this.initCtx()
      if (!this.ctx) return

      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()

      osc.type = 'triangle'
      osc.frequency.setValueAtTime(500, this.ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(180, this.ctx.currentTime + 0.05)

      gain.gain.setValueAtTime(0.04, this.ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05)

      osc.connect(gain)
      gain.connect(this.ctx.destination)

      osc.start()
      osc.stop(this.ctx.currentTime + 0.05)
    } catch {
      // Ignore
    }
  }

  public playPaletteSound() {
    if (this.isMuted) return
    try {
      this.initCtx()
      if (!this.ctx) return

      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()

      osc.type = 'sine'
      osc.frequency.setValueAtTime(900, this.ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(2200, this.ctx.currentTime + 0.08)

      gain.gain.setValueAtTime(0.03, this.ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08)

      osc.connect(gain)
      gain.connect(this.ctx.destination)

      osc.start()
      osc.stop(this.ctx.currentTime + 0.08)
    } catch {
      // Ignore
    }
  }

  public playNotificationSound() {
    if (this.isMuted) return
    try {
      this.initCtx()
      if (!this.ctx) return

      const now = this.ctx.currentTime

      // Note 1
      const osc1 = this.ctx.createOscillator()
      const gain1 = this.ctx.createGain()
      osc1.frequency.setValueAtTime(523.25, now) // C5
      gain1.gain.setValueAtTime(0.03, now)
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.1)
      osc1.connect(gain1)
      gain1.connect(this.ctx.destination)
      osc1.start(now)
      osc1.stop(now + 0.1)

      // Note 2
      const osc2 = this.ctx.createOscillator()
      const gain2 = this.ctx.createGain()
      osc2.frequency.setValueAtTime(659.25, now + 0.06) // E5
      gain2.gain.setValueAtTime(0.035, now + 0.06)
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.16)
      osc2.connect(gain2)
      gain2.connect(this.ctx.destination)
      osc2.start(now + 0.06)
      osc2.stop(now + 0.16)
    } catch {
      // Ignore
    }
  }
}

export const soundEngine = new SoundEngine()
export default soundEngine
