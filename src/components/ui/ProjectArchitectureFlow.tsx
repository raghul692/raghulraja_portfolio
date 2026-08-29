'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Network } from 'lucide-react'

export interface ArchitectureNode {
  title: string
  subtitle: string
  tech: string
  icon?: string
}

interface ProjectArchitectureFlowProps {
  projectTitle?: string
  nodes?: ArchitectureNode[]
}

const defaultNodes: Record<string, ArchitectureNode[]> = {
  ai: [
    { title: 'Client UI', subtitle: 'React 19 + Glassmorphism', tech: 'Framer Motion' },
    { title: 'API Router', subtitle: 'FastAPI / Node.js Engine', tech: 'REST & Stream' },
    { title: 'AI Co-Pilot', subtitle: 'Google Gemini 1.5 LLM', tech: 'Prompt & NLP' },
    { title: 'Data Store', subtitle: 'PostgreSQL / Session State', tech: 'Zustand & Cache' },
  ],
  fullstack: [
    { title: 'Frontend App', subtitle: 'React 19 + TypeScript', tech: 'Vite 8 & Tailwind' },
    { title: 'Backend API', subtitle: 'Express.js / Node.js', tech: 'JWT & Controller' },
    { title: 'ORM / Query', subtitle: 'Prisma / SQLAlchemy', tech: 'Relational Model' },
    { title: 'Database', subtitle: 'MySQL 8.0 & LocalStorage', tech: 'Indexed Ledger' },
  ],
  frontend: [
    { title: 'User Input', subtitle: 'DOM & Keyboard Events', tech: 'Web Audio FX' },
    { title: 'State Core', subtitle: 'Zustand / Reactive State', tech: 'TypeScript Types' },
    { title: 'Renderer', subtitle: 'HTML5 Canvas / Framer', tech: 'SVG & Shaders' },
  ],
}

export function ProjectArchitectureFlow({ projectTitle: _projectTitle, nodes }: ProjectArchitectureFlowProps) {
  const flowNodes = nodes && nodes.length > 0 ? nodes : defaultNodes.fullstack

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
          <Network className="w-4 h-4 text-primary animate-pulse" /> Animated System Architecture Flow
        </span>
        <span className="text-[10px] font-mono text-muted-foreground bg-white/5 px-2 py-0.5 rounded-full border border-white/10">
          Live Data Pulse Active
        </span>
      </div>

      <div className="relative p-6 rounded-2xl glass border border-glass-border bg-black/40 overflow-hidden">
        {/* Animated Background Flow Lines (SVG) */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <svg className="w-full h-full stroke-cyan-500/20" fill="none">
            <line x1="0" y1="50%" x2="100%" y2="50%" strokeWidth="2" strokeDasharray="6 6" />
          </svg>
        </div>

        {/* Nodes Grid */}
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-center">
          {flowNodes.map((node, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.12 }}
              className="relative group p-4 rounded-xl glass border border-white/10 hover:border-cyan-400/50 hover:bg-cyan-500/10 transition-all duration-300 flex flex-col justify-between space-y-2 shadow-lg"
            >
              {/* Pulse Indicator */}
              <div className="flex items-center justify-between">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <span className="text-[10px] font-mono text-cyan-300 font-bold bg-cyan-500/20 px-2 py-0.5 rounded-md border border-cyan-500/30">
                  Node 0{index + 1}
                </span>
              </div>

              <div>
                <h4 className="text-sm font-bold text-foreground group-hover:text-cyan-300 transition-colors">
                  {node.title}
                </h4>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {node.subtitle}
                </p>
              </div>

              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-cyan-400 font-medium">
                <span>{node.tech}</span>
                {index < flowNodes.length - 1 && (
                  <ArrowRight className="w-3.5 h-3.5 text-cyan-400 hidden lg:block opacity-60 group-hover:translate-x-1 transition-transform" />
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
