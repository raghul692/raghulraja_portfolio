'use client'

import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Html, PerspectiveCamera, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import { Project } from '@/data/resume'
import { Play, Sparkles, ChevronRight } from 'lucide-react'
import soundEngine from '@/utils/soundEngine'

interface CylinderCarouselProps {
  projects: Project[]
  onSelectProject: (project: Project) => void
  onOpenDemo: (project: Project) => void
}

function Project3DCard({
  project,
  angle,
  radius,
  onSelect,
  onOpenDemo,
}: {
  project: Project
  angle: number
  radius: number
  onSelect: () => void
  onOpenDemo: () => void
}) {
  const meshRef = useRef<THREE.Group>(null)
  const x = Math.sin(angle) * radius
  const z = Math.cos(angle) * radius
  const rotationY = angle

  useFrame((state) => {
    if (meshRef.current) {
      // Gentle floating animation
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 1.5 + angle) * 0.15
    }
  })

  return (
    <group ref={meshRef} position={[x, 0, z]} rotation={[0, rotationY, 0]}>
      {/* 3D Glass Backdrop Mesh */}
      <mesh>
        <planeGeometry args={[3.2, 4.2]} />
        <meshPhysicalMaterial
          color="#0f172a"
          roughness={0.2}
          metalness={0.8}
          transmission={0.6}
          thickness={0.5}
          transparent
          opacity={0.85}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Interactive HTML Card */}
      <Html
        transform
        occlude
        position={[0, 0, 0.05]}
        className="w-72 h-[380px] p-5 rounded-2xl glass-spatial border border-white/20 select-none flex flex-col justify-between shadow-2xl backdrop-blur-xl"
      >
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 uppercase tracking-wider">
              {project.category}
            </span>
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          </div>

          {/* Title & Desc */}
          <div>
            <h3 className="font-heading font-bold text-base text-foreground line-clamp-1">
              {project.title}
            </h3>
            <p className="text-xs text-muted-foreground mt-1 line-clamp-3 leading-relaxed">
              {project.description}
            </p>
          </div>

          {/* Tech Badges */}
          <div className="flex flex-wrap gap-1">
            {project.tech.slice(0, 3).map((t) => (
              <span
                key={t}
                className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/10 text-cyan-200 border border-white/10"
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-3 border-t border-white/10 flex items-center justify-between">
          <button
            onClick={(e) => {
              e.stopPropagation()
              soundEngine.playClickSound()
              onSelect()
            }}
            className="px-3 py-1.5 rounded-xl glass text-xs font-mono text-cyan-300 hover:text-white border border-cyan-500/30 hover:border-cyan-500/60 transition-colors flex items-center gap-1 cursor-pointer"
          >
            Details <ChevronRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation()
              soundEngine.playClickSound()
              onOpenDemo()
            }}
            className="px-3 py-1.5 rounded-xl bg-primary text-white text-xs font-mono font-semibold hover:bg-primary/90 transition-colors flex items-center gap-1 shadow-glow cursor-pointer"
          >
            <Play className="w-3 h-3 fill-white" /> Demo ⚡
          </button>
        </div>
      </Html>
    </group>
  )
}

function CarouselScene({
  projects,
  onSelectProject,
  onOpenDemo,
}: CylinderCarouselProps) {
  const groupRef = useRef<THREE.Group>(null)
  const radius = 6.8
  const total = projects.length

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.12 // Continuous subtle auto-rotation
    }
  })

  return (
    <>
      <ambientLight intensity={1.2} />
      <pointLight position={[10, 10, 10]} intensity={2} color="#38bdf8" />
      <pointLight position={[-10, -10, -10]} intensity={1.5} color="#818cf8" />

      <group ref={groupRef}>
        {projects.map((project, idx) => {
          const angle = (idx / total) * Math.PI * 2
          return (
            <Project3DCard
              key={project.id}
              project={project}
              angle={angle}
              radius={radius}
              onSelect={() => onSelectProject(project)}
              onOpenDemo={() => onOpenDemo(project)}
            />
          )
        })}
      </group>

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        rotateSpeed={0.6}
        autoRotate={false}
      />
    </>
  )
}

export function ProjectCylinderCarousel3D({
  projects,
  onSelectProject,
  onOpenDemo,
}: CylinderCarouselProps) {
  return (
    <div className="w-full h-[520px] rounded-3xl glass border border-glass-border overflow-hidden relative shadow-2xl">
      <div className="absolute top-4 left-6 z-10 flex items-center gap-2 px-3 py-1.5 rounded-full glass border border-cyan-500/30 text-xs font-mono text-cyan-300">
        <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" /> 3D Interactive Cyber Cylinder Ring (Drag to Rotate)
      </div>

      <Canvas gl={{ antialias: true, alpha: true }}>
        <PerspectiveCamera makeDefault position={[0, 0, 11]} fov={50} />
        <CarouselScene
          projects={projects}
          onSelectProject={onSelectProject}
          onOpenDemo={onOpenDemo}
        />
      </Canvas>
    </div>
  )
}
