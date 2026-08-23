'use client'

import { Canvas } from '@react-three/fiber'
import { Float, MeshDistortMaterial, OrbitControls } from '@react-three/drei'
import { useRef } from 'react'
import { motion } from 'framer-motion'
import { useGPUPerformance, GPUPerformanceTier } from '@/hooks/useGPUPerformance'

interface TorusKnotProps {
  position: [number, number, number]
  color: string
  segments: [number, number]
  distortSpeed: number
  distortAmount: number
}

function TorusKnot({ position, color, segments, distortSpeed, distortAmount }: TorusKnotProps) {
  const meshRef = useRef<any>(null)

  return (
    <Float speed={distortSpeed > 0 ? 2 : 0} rotationIntensity={distortAmount > 0 ? 1 : 0} floatIntensity={distortAmount > 0 ? 2 : 0}>
      <mesh ref={meshRef} position={position}>
        <torusKnotGeometry args={[1, 0.3, segments[0], segments[1]]} />
        <MeshDistortMaterial
          color={color}
          speed={distortSpeed}
          distort={distortAmount}
          radius={1}
          transparent
          opacity={0.6}
        />
      </mesh>
    </Float>
  )
}

function FloatingGeometries({ tier }: { tier: GPUPerformanceTier }) {
  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <pointLight position={[-10, -10, -5]} color="#6366f1" intensity={1} />
      <pointLight position={[10, 10, 10]} color="#06b6d4" intensity={1} />

      <TorusKnot
        position={[-3, 1, -2]}
        color="#6366f1"
        segments={tier.geometrySegments}
        distortSpeed={tier.distortSpeed}
        distortAmount={tier.distortAmount}
      />
      <TorusKnot
        position={[3, -1, -3]}
        color="#06b6d4"
        segments={tier.geometrySegments}
        distortSpeed={tier.distortSpeed}
        distortAmount={tier.distortAmount}
      />
      {!tier.isLowEnd && (
        <TorusKnot
          position={[0, 2, -4]}
          color="#8b5cf6"
          segments={tier.geometrySegments}
          distortSpeed={tier.distortSpeed}
          distortAmount={tier.distortAmount}
        />
      )}

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate={tier.autoRotateSpeed > 0}
        autoRotateSpeed={tier.autoRotateSpeed}
      />
    </>
  )
}

export function ParticleBackground() {
  const tier = useGPUPerformance()

  return (
    <div className="fixed inset-0 -z-10 opacity-40">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 50 }}
        dpr={tier.dpr}
        gl={{
          alpha: true,
          antialias: !tier.isLowEnd,
          powerPreference: tier.isLowEnd ? 'low-power' : 'high-performance',
        }}
      >
        <FloatingGeometries tier={tier} />
      </Canvas>

      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-surface-dark/50 to-surface-dark pointer-events-none" />

      <motion.div
        className="absolute inset-0 opacity-30"
        animate={{
          background: tier.prefersReducedMotion
            ? 'radial-gradient(circle at 50% 50%, rgba(99,102,241,0.15) 0%, transparent 60%)'
            : [
                'radial-gradient(circle at 20% 30%, rgba(99,102,241,0.15) 0%, transparent 50%)',
                'radial-gradient(circle at 80% 70%, rgba(6,182,212,0.15) 0%, transparent 50%)',
                'radial-gradient(circle at 20% 30%, rgba(99,102,241,0.15) 0%, transparent 50%)',
              ],
        }}
        transition={{ duration: tier.prefersReducedMotion ? 0 : 8, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  )
}
