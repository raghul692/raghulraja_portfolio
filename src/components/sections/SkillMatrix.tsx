'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Code, Brain, Database, Palette, Layers } from 'lucide-react'

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

export default function SkillMatrix() {
  const [activeTab, setActiveTab] = useState<string>('ai')

  const currentCategory = skillCategories.find(c => c.id === activeTab) || skillCategories[0]

  return (
    <div className="mt-16">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h3 className="font-heading text-2xl font-bold text-foreground flex items-center gap-2">
            <Layers className="w-5 h-5 text-primary" /> Technical Competency Matrix
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            Quantitative assessment across core engineering domains.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex flex-wrap gap-2 glass p-1.5 rounded-xl border-glass-border">
          {skillCategories.map(cat => {
            const Icon = cat.icon
            const isActive = activeTab === cat.id
            return (
              <button
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
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
  )
}
