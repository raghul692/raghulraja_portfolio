'use client'

import { useRef, useState, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Html, Float } from '@react-three/drei'
import * as THREE from 'three'
import { useGPUPerformance } from '@/hooks/useGPUPerformance'

export interface SkillNodeData {
  id: string
  name: string
  category: 'ai' | 'frontend' | 'backend' | 'uiux'
  level: number
  experience: string
  color: string
  projects?: string[]
}

interface TechGalaxy3DProps {
  skills: SkillNodeData[]
  selectedSkill: SkillNodeData | null
  onSelectSkill: (skill: SkillNodeData) => void
}

// Calculate 3D position on a sphere using Golden Ratio (Fibonacci Lattice)
function getSpherePositions(count: number, radius: number): [number, number, number][] {
  const positions: [number, number, number][] = []
  const phi = (1 + Math.sqrt(5)) / 2 // Golden ratio

  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2 // From 1 to -1
    const radiusAtY = Math.sqrt(1 - y * y)
    const theta = (2 * Math.PI * i) / phi

    const x = Math.cos(theta) * radiusAtY * radius
    const z = Math.sin(theta) * radiusAtY * radius
    positions.push([x, y * radius, z])
  }
  return positions
}

function GalaxyCore() {
  const coreRef = useRef<THREE.Mesh>(null)

  useFrame(({ clock }) => {
    if (coreRef.current) {
      coreRef.current.rotation.y = clock.getElapsedTime() * 0.3
      coreRef.current.rotation.z = clock.getElapsedTime() * 0.1
    }
  })

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={1}>
      <mesh ref={coreRef} position={[0, 0, 0]}>
        <icosahedronGeometry args={[0.9, 2]} />
        <meshStandardMaterial
          color="#6366f1"
          emissive="#818cf8"
          emissiveIntensity={0.8}
          wireframe
          transparent
          opacity={0.7}
        />
      </mesh>
    </Float>
  )
}

function ConstellationLines({
  skillsWithPos,
  selectedSkillId,
}: {
  skillsWithPos: { data: SkillNodeData; pos: [number, number, number] }[]
  selectedSkillId: string | null
}) {
  const lineGeometry = useMemo(() => {
    const points: THREE.Vector3[] = []
    const colors: number[] = []

    for (let i = 0; i < skillsWithPos.length; i++) {
      for (let j = i + 1; j < skillsWithPos.length; j++) {
        const s1 = skillsWithPos[i]
        const s2 = skillsWithPos[j]

        // Connect if in same category or if one is selected
        const isConnected =
          s1.data.category === s2.data.category ||
          s1.data.id === selectedSkillId ||
          s2.data.id === selectedSkillId

        if (isConnected) {
          const p1 = new THREE.Vector3(...s1.pos)
          const p2 = new THREE.Vector3(...s2.pos)
          const dist = p1.distanceTo(p2)

          if (dist < 7.5 || s1.data.id === selectedSkillId || s2.data.id === selectedSkillId) {
            points.push(p1, p2)
            const isHighlight = s1.data.id === selectedSkillId || s2.data.id === selectedSkillId
            const color = isHighlight ? new THREE.Color('#38bdf8') : new THREE.Color(s1.data.color)

            colors.push(color.r, color.g, color.b)
            colors.push(color.r, color.g, color.b)
          }
        }
      }
    }

    const geometry = new THREE.BufferGeometry().setFromPoints(points)
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))
    return geometry
  }, [skillsWithPos, selectedSkillId])

  return (
    <lineSegments geometry={lineGeometry}>
      <lineBasicMaterial vertexColors transparent opacity={0.25} linewidth={1} />
    </lineSegments>
  )
}

function SkillNodeMesh({
  data,
  position,
  isSelected,
  onSelect,
}: {
  data: SkillNodeData
  position: [number, number, number]
  isSelected: boolean
  onSelect: (skill: SkillNodeData) => void
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)

  useFrame(({ clock }) => {
    if (meshRef.current) {
      // Gentle pulse effect
      const scale = isSelected ? 1.4 : hovered ? 1.25 : 1 + Math.sin(clock.getElapsedTime() * 2 + position[0]) * 0.05
      meshRef.current.scale.set(scale, scale, scale)
    }
  })

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onClick={(e) => {
          e.stopPropagation()
          onSelect(data)
        }}
        onPointerOver={(e) => {
          e.stopPropagation()
          setHovered(true)
          document.body.style.cursor = 'pointer'
        }}
        onPointerOut={() => {
          setHovered(false)
          document.body.style.cursor = 'auto'
        }}
      >
        <sphereGeometry args={[0.35, 16, 16]} />
        <meshStandardMaterial
          color={data.color}
          emissive={data.color}
          emissiveIntensity={isSelected ? 1.2 : hovered ? 0.8 : 0.4}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>

      {/* HTML Label overlay */}
      <Html
        position={[0, 0.55, 0]}
        center
        distanceFactor={10}
        style={{
          transition: 'all 0.2s ease',
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      >
        <div
          className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] font-medium whitespace-nowrap shadow-lg backdrop-blur-md border transition-all ${
            isSelected
              ? 'bg-primary text-white border-primary/50 ring-2 ring-primary/40 shadow-glow scale-110'
              : hovered
              ? 'bg-surface-dark/90 text-white border-white/30 scale-105'
              : 'bg-surface-dark/70 text-slate-300 border-white/10'
          }`}
        >
          <span
            className="w-2 h-2 rounded-full inline-block"
            style={{ backgroundColor: data.color }}
          />
          <span>{data.name}</span>
          <span className="text-[9px] opacity-75 font-mono">({data.level}%)</span>
        </div>
      </Html>
    </group>
  )
}

function StarfieldParticles() {
  const count = 200
  const points = useMemo(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count * 3; i++) {
      pos[i] = (Math.random() - 0.5) * 20
    }
    return pos
  }, [])

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[points, 3]}
        />
      </bufferGeometry>
      <pointsMaterial size={0.03} color="#a5b4fc" transparent opacity={0.6} />
    </points>
  )
}

export default function TechGalaxy3D({ skills, selectedSkill, onSelectSkill }: TechGalaxy3DProps) {
  const tier = useGPUPerformance()

  const skillsWithPos = useMemo(() => {
    const positions = getSpherePositions(skills.length, 4.2)
    return skills.map((skill, idx) => ({
      data: skill,
      pos: positions[idx],
    }))
  }, [skills])

  return (
    <div className="relative w-full h-[520px] rounded-2xl overflow-hidden glass border border-glass-border">
      <Canvas
        camera={{ position: [0, 0, 9.5], fov: 45 }}
        dpr={tier.dpr}
        gl={{ antialias: !tier.isLowEnd, powerPreference: tier.isLowEnd ? 'low-power' : 'high-performance' }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} color="#6366f1" intensity={0.8} />

        <StarfieldParticles />
        <GalaxyCore />

        <ConstellationLines
          skillsWithPos={skillsWithPos}
          selectedSkillId={selectedSkill?.id || null}
        />

        {skillsWithPos.map(({ data, pos }) => (
          <SkillNodeMesh
            key={data.id}
            data={data}
            position={pos}
            isSelected={selectedSkill?.id === data.id}
            onSelect={onSelectSkill}
          />
        ))}

        <OrbitControls
          enableZoom={true}
          maxDistance={15}
          minDistance={5}
          enablePan={false}
          autoRotate={!selectedSkill}
          autoRotateSpeed={0.8}
        />
      </Canvas>

      {/* Floating UI Helper Overlay */}
      <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between pointer-events-none text-xs text-muted-foreground bg-surface-dark/60 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/10">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span>Click any tech node to inspect proficiency & projects</span>
        </div>
        <span className="font-mono text-[10px] hidden sm:inline text-primary">
          Drag to rotate • Scroll to zoom
        </span>
      </div>
    </div>
  )
}
