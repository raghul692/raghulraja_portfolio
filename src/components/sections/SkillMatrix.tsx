'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Code, Brain, Database, Palette, Layers, Sparkles, Box, ExternalLink, X } from 'lucide-react'
import TechGalaxy3D, { SkillNodeData } from '@/components/three/TechGalaxy3D'

interface SkillCategory {
  id: string
  name: string
  icon: any
  skills: { name: string; level: number; experience: string }[]
}

const skillCategories: SkillCategory[] = [
  {
    id: 'ai',
    name: 'AI & Data Science',
    icon: Brain,
    skills: [
      { name: 'Python', level: 92, experience: 'Advanced' },
      { name: 'Machine Learning (Scikit-Learn)', level: 88, experience: 'Proficient' },
      { name: 'Streamlit Framework', level: 90, experience: 'Advanced' },
      { name: 'Pandas & Data Processing', level: 85, experience: 'Proficient' },
      { name: 'Model Serialization & Deploy', level: 86, experience: 'Proficient' },
    ],
  },
  {
    id: 'frontend',
    name: 'Frontend Development',
    icon: Code,
    skills: [
      { name: 'React.js & Hooks', level: 90, experience: 'Advanced' },
      { name: 'TypeScript', level: 85, experience: 'Proficient' },
      { name: 'Tailwind CSS', level: 92, experience: 'Advanced' },
      { name: 'HTML5 / CSS3 / Modern JS', level: 95, experience: 'Expert' },
      { name: 'Framer Motion & Three.js', level: 80, experience: 'Competent' },
    ],
  },
  {
    id: 'backend',
    name: 'Backend & Databases',
    icon: Database,
    skills: [
      { name: 'Node.js & Express', level: 85, experience: 'Proficient' },
      { name: 'FastAPI (Python)', level: 88, experience: 'Advanced' },
      { name: 'MySQL & SQLite Schemas', level: 85, experience: 'Proficient' },
      { name: 'RESTful API Architecture', level: 90, experience: 'Advanced' },
      { name: 'JWT & Auth Systems', level: 82, experience: 'Proficient' },
    ],
  },
  {
    id: 'uiux',
    name: 'UI/UX & Tools',
    icon: Palette,
    skills: [
      { name: 'Figma & Design Systems', level: 88, experience: 'Advanced' },
      { name: 'Wireframing & Prototyping', level: 90, experience: 'Advanced' },
      { name: 'Git & Version Control', level: 90, experience: 'Advanced' },
      { name: 'VS Code & Linux CLI', level: 92, experience: 'Advanced' },
    ],
  },
]

// Flattened list of skills formatted for the 3D Tech Galaxy
const allGalaxySkills: SkillNodeData[] = [
  { id: 'python', name: 'Python', category: 'ai', level: 92, experience: 'Advanced', color: '#6366f1', projects: ['ResuMate-AI', 'Portfolio AI Backend', 'Data Pipelines'] },
  { id: 'ml', name: 'Machine Learning', category: 'ai', level: 88, experience: 'Proficient', color: '#818cf8', projects: ['ResuMate ATS Heatmap', 'Placement Predictor'] },
  { id: 'streamlit', name: 'Streamlit', category: 'ai', level: 90, experience: 'Advanced', color: '#a5b4fc', projects: ['ResuMate Web App', 'AI Dashboard'] },
  { id: 'react', name: 'React.js', category: 'frontend', level: 90, experience: 'Advanced', color: '#06b6d4', projects: ['Portfolio Website', 'AuthPro System', 'ATS Dashboard'] },
  { id: 'typescript', name: 'TypeScript', category: 'frontend', level: 85, experience: 'Proficient', color: '#38bdf8', projects: ['Portfolio UI', 'Enterprise ATS UI'] },
  { id: 'tailwind', name: 'Tailwind CSS', category: 'frontend', level: 92, experience: 'Advanced', color: '#22d3ee', projects: ['Design System', 'Glassmorphic UI'] },
  { id: 'threejs', name: 'Three.js / 3D', category: 'frontend', level: 80, experience: 'Competent', color: '#67e8f9', projects: ['3D Galaxy Skill Radar', 'Particle Canvas'] },
  { id: 'fastapi', name: 'FastAPI', category: 'backend', level: 88, experience: 'Advanced', color: '#10b981', projects: ['Portfolio AI Routers', 'GitHub Live Sync API'] },
  { id: 'node', name: 'Node.js', category: 'backend', level: 85, experience: 'Proficient', color: '#34d399', projects: ['Express Microservices', 'Auth API'] },
  { id: 'mysql', name: 'MySQL & SQLite', category: 'backend', level: 85, experience: 'Proficient', color: '#6ee7b7', projects: ['Portfolio DB Schema', 'Contact Submissions'] },
  { id: 'figma', name: 'Figma Design', category: 'uiux', level: 88, experience: 'Advanced', color: '#f43f5e', projects: ['ResuMate SaaS Wireframes', 'Portfolio Design System'] },
  { id: 'git', name: 'Git & GitHub', category: 'uiux', level: 90, experience: 'Advanced', color: '#fb7185', projects: ['Portfolio CI/CD', 'GitHub Auto-Sync'] },
]

export default function SkillMatrix() {
  const [viewMode, setViewMode] = useState<'3d' | '2d'>('3d')
  const [activeTab, setActiveTab] = useState<string>('ai')
  const [selectedGalaxySkill, setSelectedGalaxySkill] = useState<SkillNodeData | null>(allGalaxySkills[0])

  const currentCategory = skillCategories.find(c => c.id === activeTab) || skillCategories[0]

  return (
    <div className="mt-16">
      {/* Section Header with View Toggle Switch */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h3 className="font-heading text-2xl font-bold text-foreground flex items-center gap-2">
            <Layers className="w-5 h-5 text-primary" /> Technical Competency Matrix
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            Quantitative assessment & 3D Interactive Tech Stack Radar across core engineering domains.
          </p>
        </div>

        {/* 3D vs 2D Toggle Switch */}
        <div className="flex items-center gap-2 glass p-1.5 rounded-xl border-glass-border self-start md:self-auto">
          <button
            onClick={() => setViewMode('3d')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${viewMode === '3d'
                ? 'bg-gradient-to-r from-indigo-500 to-cyan-500 text-white shadow-glow'
                : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
              }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>🌌 3D Galaxy</span>
          </button>

          <button
            onClick={() => setViewMode('2d')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${viewMode === '2d'
                ? 'bg-primary text-primary-foreground shadow-glow'
                : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
              }`}
          >
            <Box className="w-3.5 h-3.5" />
            <span>📊 2D Matrix</span>
          </button>
        </div>
      </div>

      {/* VIEW MODE 1: 3D TECH GALAXY */}
      {viewMode === '3d' && (
        <div className="space-y-6">
          <TechGalaxy3D
            skills={allGalaxySkills}
            selectedSkill={selectedGalaxySkill}
            onSelectSkill={(skill) => setSelectedGalaxySkill(skill)}
          />

          {/* Interactive Selected Tech Inspector Panel */}
          <AnimatePresence mode="wait">
            {selectedGalaxySkill && (
              <motion.div
                key={selectedGalaxySkill.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="glass rounded-2xl p-6 border-glass-border relative overflow-hidden bg-surface-dark/90 backdrop-blur-xl"
              >
                <button
                  onClick={() => setSelectedGalaxySkill(null)}
                  className="absolute top-4 right-4 p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full shadow-glow"
                        style={{ backgroundColor: selectedGalaxySkill.color }}
                      />
                      <h4 className="text-xl font-bold text-foreground font-heading">
                        {selectedGalaxySkill.name}
                      </h4>
                      <span className="text-xs px-2.5 py-0.5 rounded-full font-mono bg-white/10 border border-white/10 text-cyan-300">
                        {selectedGalaxySkill.experience}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Category:{' '}
                      <span className="capitalize text-slate-200 font-medium">
                        {selectedGalaxySkill.category}
                      </span>
                    </p>
                  </div>

                  {/* Skill Progress Indicator */}
                  <div className="w-full md:w-64 space-y-1.5">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-muted-foreground">Proficiency</span>
                      <span className="text-primary font-bold">{selectedGalaxySkill.level}%</span>
                    </div>
                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/10">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${selectedGalaxySkill.level}%` }}
                        transition={{ duration: 0.6 }}
                        className="h-full rounded-full bg-aurora-gradient shadow-glow"
                      />
                    </div>
                  </div>
                </div>

                {/* Related Projects Badge List */}
                {selectedGalaxySkill.projects && selectedGalaxySkill.projects.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <p className="text-xs text-muted-foreground mb-2 font-medium flex items-center gap-1.5">
                      <ExternalLink className="w-3.5 h-3.5 text-primary" /> Associated Projects & Implementations:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {selectedGalaxySkill.projects.map(proj => (
                        <span
                          key={proj}
                          className="text-xs px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-slate-200 hover:border-primary/50 transition-colors font-mono flex items-center gap-1.5"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                          {proj}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* VIEW MODE 2: 2D COMPETENCY MATRIX */}
      {viewMode === '2d' && (
        <div className="space-y-6">
          {/* Tab Buttons */}
          <div className="flex flex-wrap gap-2 glass p-1.5 rounded-xl border-glass-border">
            {skillCategories.map(cat => {
              const Icon = cat.icon
              const isActive = activeTab === cat.id
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveTab(cat.id)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${isActive
                      ? 'bg-primary text-primary-foreground shadow-glow'
                      : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                    }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{cat.name}</span>
                </button>
              )
            })}
          </div>

          {/* Skill Progress Bars */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 glass rounded-2xl p-6 md:p-8 border-glass-border">
            {currentCategory.skills.map((skill, sIdx) => (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: sIdx * 0.08 }}
                className="space-y-2"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-foreground">{skill.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 border border-white/10 text-muted-foreground font-mono">
                      {skill.experience}
                    </span>
                    <span className="font-mono text-primary font-bold">{skill.level}%</span>
                  </div>
                </div>

                <div className="h-2.5 w-full bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/5">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${skill.level}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="h-full rounded-full bg-aurora-gradient shadow-glow"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
