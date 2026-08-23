'use client'

import { motion } from 'framer-motion'
import { resume, techStack, certificates } from '@/data/resume'
import { cn } from '@/utils/cn'
import { useState } from 'react'
import { GraduationCap, Code2, Brain, Database, Palette, Wrench, BookOpen, Globe, Zap, Heart } from 'lucide-react'
import {
  SiHtml5,
  SiCss,
  SiJavascript,
  SiReact,
  SiTypescript,
  SiTailwindcss,
  SiNodedotjs,
  SiExpress,
  SiPython,
  SiMysql,
  SiMongodb,
  SiFigma,
  SiGit,
  SiGithub,
  SiVscodium,
} from 'react-icons/si'
import GitHubStats from './GitHubStats'
import TechPlayground from './TechPlayground'
import SkillMatrix from './SkillMatrix'

const categoryConfig: Record<string, { label: string; icon: any; color: string }> = {
  frontend: { label: 'Frontend', icon: Code2, color: 'text-blue-400 bg-blue-400/10' },
  backend: { label: 'Backend', icon: Wrench, color: 'text-green-400 bg-green-400/10' },
  ai: { label: 'AI / ML', icon: Brain, color: 'text-purple-400 bg-purple-400/10' },
  database: { label: 'Database', icon: Database, color: 'text-orange-400 bg-orange-400/10' },
  design: { label: 'Design', icon: Palette, color: 'text-pink-400 bg-pink-400/10' },
  tools: { label: 'Tools', icon: Wrench, color: 'text-gray-400 bg-gray-400/10' },
}

const techIconMap: Record<string, { icon: any; color: string; bg: string }> = {
  HTML5: { icon: SiHtml5, color: 'text-[#E34F26]', bg: 'bg-[#E34F26]/10 border-[#E34F26]/20' },
  CSS3: { icon: SiCss, color: 'text-[#1572B6]', bg: 'bg-[#1572B6]/10 border-[#1572B6]/20' },
  JavaScript: { icon: SiJavascript, color: 'text-[#F7DF1E]', bg: 'bg-[#F7DF1E]/10 border-[#F7DF1E]/20' },
  JSON: { icon: Code2, color: 'text-[#38BDF8]', bg: 'bg-[#38BDF8]/10 border-[#38BDF8]/20' },
  React: { icon: SiReact, color: 'text-[#61DAFB]', bg: 'bg-[#61DAFB]/10 border-[#61DAFB]/20' },
  TypeScript: { icon: SiTypescript, color: 'text-[#3178C6]', bg: 'bg-[#3178C6]/10 border-[#3178C6]/20' },
  'Tailwind CSS': { icon: SiTailwindcss, color: 'text-[#06B6D4]', bg: 'bg-[#06B6D4]/10 border-[#06B6D4]/20' },
  'Node.js': { icon: SiNodedotjs, color: 'text-[#5FA04E]', bg: 'bg-[#5FA04E]/10 border-[#5FA04E]/20' },
  Express: { icon: SiExpress, color: 'text-foreground', bg: 'bg-white/10 border-white/20' },
  'REST APIs': { icon: Globe, color: 'text-[#38BDF8]', bg: 'bg-[#38BDF8]/10 border-[#38BDF8]/20' },
  Python: { icon: SiPython, color: 'text-[#3776AB]', bg: 'bg-[#3776AB]/10 border-[#3776AB]/20' },
  MySQL: { icon: SiMysql, color: 'text-[#4479A1]', bg: 'bg-[#4479A1]/10 border-[#4479A1]/20' },
  MongoDB: { icon: SiMongodb, color: 'text-[#47A248]', bg: 'bg-[#47A248]/10 border-[#47A248]/20' },
  Figma: { icon: SiFigma, color: 'text-[#F24E1E]', bg: 'bg-[#F24E1E]/10 border-[#F24E1E]/20' },
  Git: { icon: SiGit, color: 'text-[#F05032]', bg: 'bg-[#F05032]/10 border-[#F05032]/20' },
  GitHub: { icon: SiGithub, color: 'text-foreground', bg: 'bg-white/10 border-white/20' },
  'VS Code': { icon: SiVscodium, color: 'text-[#007ACC]', bg: 'bg-[#007ACC]/10 border-[#007ACC]/20' },
}

export default function About() {
  const stats = [
    { label: 'Projects', value: `${resume.projects.length}`, suffix: '+', icon: Code2 },
    { label: 'Certifications', value: `${certificates.length}`, suffix: '+', icon: BookOpen },
    { label: 'Internships', value: `${resume.experience.length}`, suffix: '', icon: Globe },
    { label: 'Passion', value: '100', suffix: '%', icon: Heart },
  ]
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const categories = Object.keys(categoryConfig)

  const filteredTech = activeCategory
    ? techStack.filter(t => t.category === activeCategory)
    : techStack

  return (
    <section id="about" className="relative py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-heading text-4xl md:text-5xl font-bold mb-4">
            About{' '}
            <span className="bg-aurora-gradient bg-clip-text text-transparent">
              Me
            </span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            {resume.summary}
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass rounded-2xl p-6 text-center glass-hover"
            >
              <stat.icon className="w-6 h-6 text-primary mx-auto mb-2" />
              <div className="font-heading text-3xl font-bold">
                {stat.value}
                <span className="text-primary">{stat.suffix}</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h3 className="font-heading text-2xl font-semibold flex items-center gap-3">
              <GraduationCap className="w-6 h-6 text-primary" />
              Education
            </h3>
            <div className="glass rounded-2xl p-6 space-y-4">
              {resume.education.map(edu => (
                <div key={edu.degree} className="space-y-1">
                  <h4 className="font-medium">{edu.degree}</h4>
                  <p className="text-sm text-muted-foreground">
                    {edu.college} | {edu.location}
                  </p>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-muted-foreground">{edu.period}</span>
                    <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                      CGPA: {edu.cgpa}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <h3 className="font-heading text-2xl font-semibold flex items-center gap-3 pt-4">
              <Zap className="w-6 h-6 text-accent" />
              Achievements
            </h3>
            <div className="flex flex-col gap-3">
              <div className="glass rounded-xl p-4 space-y-2">
                <p className="text-sm text-foreground leading-relaxed">
                  Oracle Cloud Infrastructure 2025 Certified AI Foundations Associate - Oracle Cloud AI certification achieved
                </p>
                <p className="text-sm text-foreground leading-relaxed">
                  UI/UX Design Certificate - Completed UI/UX Design certification at GUVI
                </p>
                <p className="text-sm text-foreground leading-relaxed">
                  Generative AI Internship - Completed Generative AI training at EBPL
                </p>
                <p className="text-sm text-foreground leading-relaxed">
                  Multiple Projects - Successfully built {resume.projects.length}+ full-stack and AI projects
                </p>
              </div>
            </div>

            <h3 className="font-heading text-2xl font-semibold flex items-center gap-3 pt-4">
              <Zap className="w-6 h-6 text-accent" />
              Soft Skills
            </h3>
            <div className="flex flex-wrap gap-2">
              {resume.softSkills.map(skill => (
                <span
                  key={skill}
                  className="px-3 py-1.5 rounded-full text-sm bg-glass border border-glass-border glass-hover"
                >
                  {skill}
                </span>
              ))}
            </div>

            <h3 className="font-heading text-2xl font-semibold flex items-center gap-3 pt-4">
              <Globe className="w-6 h-6 text-secondary" />
              Languages
            </h3>
            <div className="flex flex-wrap gap-2">
              {resume.languages.map(lang => (
                <span
                  key={lang}
                  className="px-3 py-1.5 rounded-full text-sm bg-secondary/10 text-secondary border border-secondary/20"
                >
                  {lang}
                </span>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h3 className="font-heading text-2xl font-semibold">Tech Stack</h3>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveCategory(null)}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                  activeCategory === null
                    ? 'bg-primary text-primary-foreground'
                    : 'glass glass-hover'
                )}
              >
                All
              </button>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={cn(
                    'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                    activeCategory === cat
                      ? 'bg-primary text-primary-foreground'
                      : 'glass glass-hover'
                  )}
                >
                  {categoryConfig[cat].label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {filteredTech.map((tech, i) => {
                const config = categoryConfig[tech.category]
                const brand = techIconMap[tech.name] || { icon: config.icon, color: 'text-primary', bg: config.color }
                const Icon = brand.icon
                return (
                  <motion.div
                    key={tech.name}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.03 }}
                    className="glass rounded-2xl p-4 flex flex-col items-center gap-2.5 hover:border-glass-borderHover transition-all duration-300 hover:shadow-glass-hover group cursor-default"
                  >
                    <div className={cn('p-3 rounded-xl border transition-transform duration-300 group-hover:scale-110', brand.bg)}>
                      <Icon className={cn('w-6 h-6', brand.color)} />
                    </div>
                    <span className="text-sm font-semibold text-center text-foreground group-hover:text-primary transition-colors">
                      {tech.name}
                    </span>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-mono">
                      {config.label}
                    </span>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        </div>

        {/* Skill Matrix Component */}
        <SkillMatrix />

        {/* Dynamic Additions: Live GitHub Stats & Tech Code Architecture Playground */}
        <div className="mt-16 grid lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <GitHubStats />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <TechPlayground />
          </motion.div>
        </div>
      </div>
    </section>
  )
}

