import { useState, useEffect } from 'react'

export interface GPUPerformanceTier {
  isLowEnd: boolean
  isMobile: boolean
  prefersReducedMotion: boolean
  dpr: [number, number]
  geometrySegments: [number, number]
  distortSpeed: number
  distortAmount: number
  autoRotateSpeed: number
}

export function useGPUPerformance(): GPUPerformanceTier {
  const [tier, setTier] = useState<GPUPerformanceTier>({
    isLowEnd: false,
    isMobile: false,
    prefersReducedMotion: false,
    dpr: [1, 2],
    geometrySegments: [128, 32],
    distortSpeed: 2,
    distortAmount: 0.3,
    autoRotateSpeed: 0.5,
  })

  useEffect(() => {
    if (typeof window === 'undefined') return

    // Detect mobile viewport / user agent
    const mobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    const isMobile = mobileUA || window.innerWidth < 768

    // Check CPU cores and device memory (if supported by browser)
    const cores = navigator.hardwareConcurrency || 4
    const memory = (navigator as any).deviceMemory || 8

    // Check prefers-reduced-motion
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const prefersReducedMotion = reducedMotionQuery.matches

    // Determine low-end state
    const isLowEnd = isMobile || cores < 4 || memory < 4 || prefersReducedMotion

    if (isLowEnd) {
      setTier({
        isLowEnd: true,
        isMobile,
        prefersReducedMotion,
        dpr: [1, 1.25], // Cap DPR for low GPU load
        geometrySegments: [32, 16], // 75% fewer vertices
        distortSpeed: prefersReducedMotion ? 0 : 0.8,
        distortAmount: prefersReducedMotion ? 0 : 0.15,
        autoRotateSpeed: prefersReducedMotion ? 0 : 0.2,
      })
    } else {
      setTier({
        isLowEnd: false,
        isMobile: false,
        prefersReducedMotion: false,
        dpr: [1, 2],
        geometrySegments: [128, 32],
        distortSpeed: 2,
        distortAmount: 0.3,
        autoRotateSpeed: 0.5,
      })
    }
  }, [])

  return tier
}
