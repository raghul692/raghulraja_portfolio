'use client'

import { useEffect, useState } from 'react'
import { LenisContext } from '@/contexts/LenisContext'

export default function LenisProvider({ children }: { children: React.ReactNode }) {
  const [lenis, setLenis] = useState<any>(null)

  useEffect(() => {
    let lenisInstance: any = null

    const initLenis = async () => {
      try {
        const LenisModule = await import('lenis')
        const LenisClass = (LenisModule as any).default || (LenisModule as any).Lenis
        lenisInstance = new LenisClass({
          duration: 1.2,
          easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          smoothWheel: true,
        })

        function raf(time: number) {
          lenisInstance.raf(time)
          requestAnimationFrame(raf)
        }
        requestAnimationFrame(raf)

        setLenis(lenisInstance)
      } catch (e) {
        console.warn('Lenis failed to load, falling back to native scroll')
      }
    }

    initLenis()

    return () => {
      if (lenisInstance) lenisInstance.destroy()
    }
  }, [])

  return (
    <LenisContext.Provider value={{ lenis }}>
      {children}
    </LenisContext.Provider>
  )
}
