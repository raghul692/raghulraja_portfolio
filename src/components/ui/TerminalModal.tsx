'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Terminal, X, CornerDownLeft } from 'lucide-react'
import { resume, certificates } from '@/data/resume'

interface TerminalModalProps {
  isOpen: boolean
  onClose: () => void
}

interface CommandLog {
  id: string
  command: string
  output: React.ReactNode
  time: string
}

export function TerminalModal({ isOpen, onClose }: TerminalModalProps) {
  const [input, setInput] = useState('')
  const [history, setHistory] = useState<CommandLog[]>([
    {
      id: 'welcome',
      command: 'welcome',
      output: (
        <div className="space-y-1 text-green-400">
          <p className="font-bold">🚀 Welcome to Raghul Raja's Interactive Developer Terminal (v2.0)!</p>
          <p className="text-muted-foreground text-xs">
            Type <span className="text-yellow-400 font-bold">'help'</span> to view all available commands.
          </p>
        </div>
      ),
      time: new Date().toLocaleTimeString(),
    },
  ])
  const [historyIndex, setHistoryIndex] = useState<number>(-1)
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [history])

  const handleCommand = (cmdStr: string) => {
    const trimmed = cmdStr.trim().toLowerCase()
    const parts = trimmed.split(' ')
    const mainCmd = parts[0]

    let response: React.ReactNode = null

    if (!trimmed) return

    setCommandHistory(prev => [...prev, cmdStr])
    setHistoryIndex(-1)

    switch (mainCmd) {
      case 'help':
        response = (
          <div className="space-y-1 text-xs">
            <p className="text-yellow-400 font-semibold mb-1">Available System Commands:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-muted-foreground font-mono">
              <div><span className="text-primary font-bold">about</span> - Overview of Raghul Raja</div>
              <div><span className="text-primary font-bold font-bold">projects</span> - List all {resume.projects.length} portfolio projects</div>
              <div><span className="text-primary font-bold">skills</span> - Display key technical stack</div>
              <div><span className="text-primary font-bold">certifications</span> - Show industry certificates</div>
              <div><span className="text-primary font-bold">experience</span> - View internship experience</div>
              <div><span className="text-primary font-bold">contact</span> - Get email, phone & socials</div>
              <div><span className="text-primary font-bold">resume</span> - Download PDF resume</div>
              <div><span className="text-primary font-bold">clear</span> - Clear terminal buffer</div>
              <div><span className="text-primary font-bold">date</span> - Print local server timestamp</div>
              <div><span className="text-primary font-bold">sudo</span> - Request root administrative rights</div>
            </div>
          </div>
        )
        break

      case 'about':
        response = (
          <div className="space-y-2 text-xs text-slate-300">
            <p className="text-primary font-bold">{resume.name} | Full Stack Developer</p>
            <p>{resume.summary}</p>
            <p className="text-muted-foreground font-mono">
              📍 Location: {resume.location} | 🎓 College: {resume.education[0]?.college} (CGPA: {resume.education[0]?.cgpa})
            </p>
          </div>
        )
        break

      case 'projects':
        response = (
          <div className="space-y-2 text-xs">
            <p className="text-accent font-bold">Featured Catalog ({resume.projects.length} Total Projects):</p>
            <div className="space-y-1 font-mono">
              {resume.projects.map((p, idx) => (
                <div key={p.id} className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/5 pb-1">
                  <span className="text-foreground font-medium">#{idx + 1} {p.title}</span>
                  <span className="text-muted-foreground text-[11px]">{p.tech.slice(0, 3).join(', ')}</span>
                </div>
              ))}
            </div>
          </div>
        )
        break

      case 'skills':
        response = (
          <div className="space-y-2 text-xs">
            <p className="text-secondary font-bold">Technical Skills Matrix:</p>
            <div className="space-y-1 text-slate-300 font-mono">
              <p><span className="text-primary font-semibold">Languages:</span> Python, JavaScript, TypeScript, HTML5, CSS3, SQL</p>
              <p><span className="text-primary font-semibold">Frameworks & Libraries:</span> React 19, Node.js, Express, Tailwind CSS, Streamlit, Scikit-Learn</p>
              <p><span className="text-primary font-semibold">Databases & Tools:</span> MySQL, MongoDB, Git, GitHub, VS Code, Figma</p>
            </div>
          </div>
        )
        break

      case 'certifications':
        response = (
          <div className="space-y-1 text-xs font-mono text-emerald-400">
            <p className="font-bold text-yellow-400 mb-1">Industry Certifications ({certificates.length}):</p>
            {certificates.map(c => (
              <div key={c.id}>• {c.title} — <span className="text-muted-foreground">{c.issuer} ({c.date})</span></div>
            ))}
          </div>
        )
        break

      case 'experience':
        response = (
          <div className="space-y-2 text-xs text-slate-300">
            {resume.experience.map(e => (
              <div key={e.role} className="border-l-2 border-primary pl-3 py-1">
                <p className="text-primary font-bold">{e.role} @ {e.company}</p>
                <p className="text-muted-foreground font-mono text-[11px]">{e.period} | {e.location}</p>
                <p className="mt-1">{e.highlights.join(' ')}</p>
              </div>
            ))}
          </div>
        )
        break

      case 'contact':
        response = (
          <div className="space-y-1 text-xs font-mono text-cyan-300">
            <p>📧 Email: <a href={`mailto:${resume.email}`} className="underline">{resume.email}</a></p>
            <p>📞 Phone: {resume.phone}</p>
            <p>🌐 GitHub: <a href={resume.socials.github} target="_blank" rel="noreferrer" className="underline">{resume.socials.github}</a></p>
            <p>💼 LinkedIn: <a href={resume.socials.linkedin} target="_blank" rel="noreferrer" className="underline">{resume.socials.linkedin}</a></p>
          </div>
        )
        break

      case 'resume':
        response = (
          <div className="text-xs text-green-400">
            <p>✅ Downloading Raghul_Raja_Resume.pdf...</p>
          </div>
        )
        {
          const link = document.createElement('a')
          link.href = '/resume/my_resume.pdf'
          link.download = 'Raghul_Raja_Resume.pdf'
          link.click()
        }
        break

      case 'clear':
        setHistory([])
        setInput('')
        return

      case 'date':
        response = <div className="text-xs font-mono text-purple-400">{new Date().toString()}</div>
        break

      case 'sudo':
        response = (
          <div className="text-xs font-mono text-red-400 font-bold animate-pulse">
            ⛔ Permission Denied: Raghul Raja has granted you guest access. For root access, contact raghulraja2006@gmail.com!
          </div>
        )
        break

      default:
        response = (
          <div className="text-xs text-red-400 font-mono">
            Command not recognized: '<span className="font-bold">{trimmed}</span>'. Type '<span className="text-yellow-400">help</span>' for a list of available commands.
          </div>
        )
    }

    setHistory(prev => [
      ...prev,
      {
        id: Math.random().toString(),
        command: cmdStr,
        output: response,
        time: new Date().toLocaleTimeString(),
      },
    ])
    setInput('')
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCommand(input)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (commandHistory.length > 0) {
        const nextIdx = historyIndex < commandHistory.length - 1 ? historyIndex + 1 : historyIndex
        setHistoryIndex(nextIdx)
        setInput(commandHistory[commandHistory.length - 1 - nextIdx] || '')
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (historyIndex > 0) {
        const nextIdx = historyIndex - 1
        setHistoryIndex(nextIdx)
        setInput(commandHistory[commandHistory.length - 1 - nextIdx] || '')
      } else if (historyIndex === 0) {
        setHistoryIndex(-1)
        setInput('')
      }
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative z-10 w-full max-w-4xl h-[75vh] bg-[#0b0f19] border border-glass-border rounded-2xl shadow-2xl flex flex-col overflow-hidden font-mono"
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between px-4 py-3 bg-[#131927] border-b border-white/10 select-none">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500/80 cursor-pointer" onClick={onClose} />
              <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <span className="w-3 h-3 rounded-full bg-green-500/80" />
              <span className="ml-2 text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-primary" /> raghul@portfolio-cli:~
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-muted-foreground hidden sm:inline">Press Esc to close</span>
              <button
                onClick={onClose}
                className="p-1 rounded-lg hover:bg-white/10 text-muted-foreground hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Terminal Output Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 text-sm scrollbar-thin">
            {history.map(item => (
              <div key={item.id} className="space-y-1">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span className="text-green-400 font-bold">raghul@portfolio</span>
                  <span className="text-slate-500">:</span>
                  <span className="text-cyan-400">~$</span>
                  <span className="text-foreground font-semibold">{item.command}</span>
                </div>
                <div className="pl-4">{item.output}</div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Terminal Command Input Prompt */}
          <div className="p-3 bg-[#131927] border-t border-white/10 flex items-center gap-2">
            <span className="text-green-400 font-bold text-xs">raghul@portfolio</span>
            <span className="text-cyan-400 font-bold text-xs">~$</span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type 'help', 'projects', 'skills' or 'contact'..."
              className="flex-1 bg-transparent border-0 outline-none text-xs text-foreground font-mono placeholder:text-slate-600 focus:ring-0"
              autoFocus
            />
            <button
              onClick={() => handleCommand(input)}
              className="p-1.5 rounded-lg bg-primary/20 hover:bg-primary/30 text-primary text-xs flex items-center gap-1 transition-colors"
            >
              <CornerDownLeft className="w-3.5 h-3.5" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
