'use client'

import { useRef, useState, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, MeshDistortMaterial, Points, PointMaterial } from '@react-three/drei'
import * as THREE from 'three'
import { useGPUPerformance } from '@/hooks/useGPUPerformance'

interface ShockwaveParticle {
  id: number
  position: THREE.Vector3
  velocity: THREE.Vector3
  life: number
  maxLife: number
}

function HologramCoreMesh({ onClick }: { onClick: () => void }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const knotRef = useRef<THREE.Mesh>(null)
  const groupRef = useRef<THREE.Group>(null)

  // Mouse Magnetic Cursor Tracking Lerp
  useFrame((state, delta) => {
    if (groupRef.current) {
      // Lerp rotation towards mouse pointer
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        state.pointer.x * 0.8,
        delta * 3
      )
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        -state.pointer.y * 0.8,
        delta * 3
      )
      // Lerp subtle position offset
      groupRef.current.position.x = THREE.MathUtils.lerp(
        groupRef.current.position.x,
        state.pointer.x * 0.5,
        delta * 2
      )
      groupRef.current.position.y = THREE.MathUtils.lerp(
        groupRef.current.position.y,
        state.pointer.y * 0.5,
        delta * 2
      )
    }

    if (knotRef.current) {
      knotRef.current.rotation.x += delta * 0.4
      knotRef.current.rotation.z += delta * 0.3
    }

    if (meshRef.current) {
      meshRef.current.rotation.y -= delta * 0.6
    }
  })

  return (
    <group ref={groupRef} onClick={onClick}>
      {/* Outer Glowing Wireframe TorusKnot */}
      <mesh ref={knotRef}>
        <torusKnotGeometry args={[1.4, 0.25, 128, 32]} />
        <meshBasicMaterial
          color="#6366f1"
          wireframe
          transparent
          opacity={0.6}
        />
      </mesh>

      {/* Inner Glowing AI Core with Organic Liquid Distortion */}
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[0.85, 4]} />
        <MeshDistortMaterial
          color="#22d3ee"
          emissive="#3b82f6"
          emissiveIntensity={0.8}
          roughness={0.2}
          metalness={0.8}
          distort={0.4}
          speed={3}
          wireframe={false}
        />
      </mesh>

      {/* Orbiting Glass Ring */}
      <mesh rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[2.0, 0.03, 16, 100]} />
        <meshStandardMaterial
          color="#38bdf8"
          emissive="#38bdf8"
          emissiveIntensity={0.5}
          wireframe
        />
      </mesh>
    </group>
  )
}

function OrbitingParticles({ count = 120 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null)

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const radius = 2.2 + Math.random() * 0.8
      const theta = Math.random() * Math.PI * 2
      const phi = (Math.random() - 0.5) * Math.PI
      pos[i * 3] = radius * Math.cos(theta) * Math.cos(phi)
      pos[i * 3 + 1] = radius * Math.sin(phi)
      pos[i * 3 + 2] = radius * Math.sin(theta) * Math.cos(phi)
    }
    return pos
  }, [count])

  useFrame((_, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.15
      pointsRef.current.rotation.x += delta * 0.05
    }
  })

  return (
    <Points ref={pointsRef} positions={positions} stride={3}>
      <PointMaterial
        transparent
        color="#a855f7"
        size={0.06}
        sizeAttenuation
        depthWrite={false}
        opacity={0.8}
      />
    </Points>
  )
}

function ShockwaveParticles({ triggerTime }: { triggerTime: number }) {
  const [particles, setParticles] = useState<ShockwaveParticle[]>([])

  // Generate burst particles on click
  useMemo(() => {
    if (triggerTime === 0) return
    const newParticles: ShockwaveParticle[] = []
    const particleCount = 45
    for (let i = 0; i < particleCount; i++) {
      const dir = new THREE.Vector3(
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2
      ).normalize()
      const speed = 2.5 + Math.random() * 3.5
      newParticles.push({
        id: Math.random(),
        position: new THREE.Vector3(0, 0, 0),
        velocity: dir.multiplyScalar(speed),
        life: 0,
        maxLife: 0.8 + Math.random() * 0.4,
      })
    }
    setParticles(newParticles)
  }, [triggerTime])

  useFrame((_, delta) => {
    if (particles.length === 0) return
    setParticles(prev =>
      prev
        .map(p => {
          p.life += delta
          p.position.addScaledVector(p.velocity, delta)
          return p
        })
        .filter(p => p.life < p.maxLife)
    )
  })

  const positions = useMemo(() => {
    const pos = new Float32Array(particles.length * 3)
    particles.forEach((p, idx) => {
      pos[idx * 3] = p.position.x
      pos[idx * 3 + 1] = p.position.y
      pos[idx * 3 + 2] = p.position.z
    })
    return pos
  }, [particles])

  if (particles.length === 0) return null

  return (
    <Points positions={positions} stride={3}>
      <PointMaterial
        transparent
        color="#ec4899"
        size={0.09}
        sizeAttenuation
        depthWrite={false}
        opacity={0.9}
      />
    </Points>
  )
}

export function HeroHologram3D() {
  const gpuTier = useGPUPerformance()
  const [triggerTime, setTriggerTime] = useState(0)
  const particleCount = gpuTier.isLowEnd ? 50 : 120

  const handleCoreClick = () => {
    setTriggerTime(Date.now())
  }

  return (
    <div className="w-full h-full relative cursor-pointer group">
      <Canvas
        camera={{ position: [0, 0, 5.5], fov: 45 }}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} color="#38bdf8" />
        <pointLight position={[-10, -10, -5]} intensity={1} color="#a855f7" />

        <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
          <HologramCoreMesh onClick={handleCoreClick} />
          <OrbitingParticles count={particleCount} />
          <ShockwaveParticles triggerTime={triggerTime} />
        </Float>
      </Canvas>

      {/* Holographic Hint Badge Overlay */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-cyan-500/30 text-[10px] font-mono text-cyan-300 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5 whitespace-nowrap shadow-lg">
        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
        Click Core for 3D Shockwave
      </div>
    </div>
  )
}

export default HeroHologram3D
