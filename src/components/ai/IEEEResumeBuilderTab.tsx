import { useState } from 'react'
import { Printer, Sliders, Sparkles, CheckCircle2, Search, Target, Cpu } from 'lucide-react'
import {
  generateIEEEResumeHTML,
  calculateRealtimeATSScore,
  matchResumeWithJD,
  ResumeConfig,
  DEFAULT_CUSTOM_RESUME,
  UserResumeData
} from '@/services/ai/ieeeResumeEngine'
import { resume } from '@/data/resume'

export default function IEEEResumeBuilderTab() {
  const [mode, setMode] = useState<'raghul' | 'custom'>('raghul')
  const [customData, setCustomData] = useState<UserResumeData>(DEFAULT_CUSTOM_RESUME)
  const [targetRole, setTargetRole] = useState('Cybernetics Engineer & AI Specialist')
  const [jdText, setJdText] = useState('')
  const [showJdMatcher, setShowJdMatcher] = useState(false)
  const [isOptimized, setIsOptimized] = useState(false)

  const config: ResumeConfig = {
    targetRole,
    mode,
    customData
  }

  const activeData: UserResumeData = mode === 'raghul'
    ? {
        name: resume.name,
        title: targetRole || resume.title,
        email: resume.email,
        phone: resume.phone,
        location: resume.location,
        github: resume.socials.github,
        linkedin: resume.socials.linkedin,
        summary: resume.summary,
        experience: resume.experience,
        skills: Array.from(new Set([...resume.skills.frontend, ...resume.skills.ai])),
        projects: resume.projects,
        education: resume.education
      }
    : {
        ...customData,
        title: targetRole || customData.title
      }

  const atsAnalysis = calculateRealtimeATSScore(activeData, targetRole)
  const jdAnalysis = matchResumeWithJD(activeData, jdText)

  const handleAutoSTAROptimize = () => {
    if (mode === 'custom') {
      setCustomData(prev => ({
        ...prev,
        summary: `${prev.summary} Specialized in low-latency REST APIs, Docker container deployment, CI/CD pipeline automation, and unit testing.`,
        skills: Array.from(new Set([...prev.skills, 'FastAPI', 'Docker', 'PostgreSQL', 'CI/CD', 'REST APIs', 'Unit Testing']))
      }))
    }
    setIsOptimized(true)
  }

  const resumeHTML = generateIEEEResumeHTML(config)

  const handlePrint = () => {
    const printWindow = window.open('', '_blank')
    if (!printWindow) return

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${activeData.name} - IEEE ATS Resume</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            @media print {
              body { background: white !important; color: black !important; padding: 0 !important; width: 100% !important; max-width: 100% !important; }
              .ieee-resume-container { border: none !important; box-shadow: none !important; padding: 0 !important; width: 100% !important; max-width: 100% !important; }
            }
          </style>
        </head>
        <body class="bg-white p-6">
          ${resumeHTML}
          <script>
            setTimeout(() => {
              window.print();
              window.close();
            }, 500);
          </script>
        </body>
      </html>
    `)
    printWindow.document.close()
  }

  return (
    <div className="flex flex-col h-[560px] bg-surface-darker/80 rounded-xl border border-white/10 p-3 overflow-y-auto space-y-3 font-sans text-xs">
      {/* HEADER BAR */}
      <div className="flex items-center justify-between p-2.5 rounded-xl bg-black/60 border border-white/10">
        <div className="flex items-center gap-2">
          <span className="text-xs font-black uppercase tracking-wider text-primary flex items-center gap-1.5 font-mono">
            <Cpu className="w-4 h-4 text-primary" /> IEEE 802 Standard Resume Studio
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setMode('raghul')}
            className={`px-2.5 py-1 rounded text-[11px] font-semibold cursor-pointer ${
              mode === 'raghul' ? 'bg-primary/20 text-primary border border-primary/40' : 'text-foreground/60 hover:text-white'
            }`}
          >
            Raghul Raja M
          </button>
          <button
            onClick={() => setMode('custom')}
            className={`px-2.5 py-1 rounded text-[11px] font-semibold cursor-pointer ${
              mode === 'custom' ? 'bg-primary/20 text-primary border border-primary/40' : 'text-foreground/60 hover:text-white'
            }`}
          >
            Custom Student
          </button>
        </div>
      </div>

      {/* STANDARD IEEE BUILDER ENGINE */}
      <div className="p-3.5 rounded-xl bg-surface-dark border border-white/10 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5" /> IEEE 802 Standard Format Engine
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowJdMatcher(!showJdMatcher)}
              className={`px-3 py-1.5 rounded-lg border font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer ${
                showJdMatcher ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' : 'bg-white/5 text-foreground/80 border-white/10 hover:bg-white/10'
              }`}
            >
              <Target className="w-3.5 h-3.5 text-cyan-400" />
              {showJdMatcher ? 'Hide JD Matcher' : 'Target JD Matcher'}
            </button>
            <button
              onClick={handleAutoSTAROptimize}
              className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold text-xs hover:bg-emerald-500/30 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              {isOptimized ? 'STAR Keywords Injected' : 'One-Click ATS STAR Fix'}
            </button>
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-lg bg-primary text-black font-bold text-xs hover:bg-primary-light transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <Printer className="w-3.5 h-3.5" /> Print / Save PDF
            </button>
          </div>
        </div>

        {/* ATS ACCURACY METRIC DISPLAY */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-2.5 rounded-lg bg-white/5 border border-white/5 text-xs">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/30 font-extrabold text-emerald-400 text-sm">
              {atsAnalysis.score}%
            </div>
            <div>
              <div className="font-bold text-foreground flex items-center gap-1.5">
                Real-Time ATS Parsing Match Score
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <p className="text-[11px] text-foreground/70">{atsAnalysis.feedback}</p>
            </div>
          </div>
          {jdText && (
            <div className="flex items-center gap-2 border-l border-white/10 pl-3">
              <div className="text-center">
                <span className="text-[10px] text-cyan-300 block font-mono">JD Match</span>
                <span className="text-sm font-black text-cyan-400">{jdAnalysis.matchPercentage}%</span>
              </div>
            </div>
          )}
        </div>

        {/* TARGET JOB DESCRIPTION MATCHER PANEL */}
        {showJdMatcher && (
          <div className="p-3 rounded-xl bg-black/60 border border-cyan-500/30 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-cyan-400 flex items-center gap-1.5">
                <Search className="w-3.5 h-3.5" /> Paste Company Job Description (JD) to Compare Match %
              </span>
              {jdText && (
                <span className="text-[11px] font-mono text-emerald-400">
                  {jdAnalysis.foundKeywords.length} Keywords Found in Resume
                </span>
              )}
            </div>
            <textarea
              value={jdText}
              onChange={e => setJdText(e.target.value)}
              placeholder="Paste job description requirements (e.g. Must have React, TypeScript, Python, FastAPI, Docker, PostgreSQL, REST APIs...)"
              rows={3}
              className="w-full p-2.5 rounded-lg bg-white/5 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-cyan-400"
            />
            {jdText && (
              <div className="p-2 rounded-lg bg-cyan-950/40 border border-cyan-500/20 text-[11px] space-y-1">
                <div className="font-semibold text-cyan-300">💡 Optimization Suggestions:</div>
                {jdAnalysis.suggestions.map((s, idx) => (
                  <div key={idx} className="text-foreground/80 flex items-center gap-1">
                    • {s}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* MODE SPECIFIC EDITORS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div>
            <label className="text-foreground/70 font-semibold block mb-1">Target Job Title / Position:</label>
            <input
              type="text"
              value={targetRole}
              onChange={e => setTargetRole(e.target.value)}
              placeholder="e.g. AI / Machine Learning Engineer"
              className="w-full px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-foreground text-xs focus:outline-none focus:border-primary/60"
            />
          </div>

          {mode === 'custom' ? (
            <div>
              <label className="text-foreground/70 font-semibold block mb-1">Full Name & Education Degree:</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={customData.name}
                  onChange={e => setCustomData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Candidate Name"
                  className="px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-foreground text-xs"
                />
                <input
                  type="text"
                  value={customData.education[0]?.degree || ''}
                  onChange={e =>
                    setCustomData(prev => ({
                      ...prev,
                      education: [
                        {
                          degree: e.target.value,
                          college: prev.education[0]?.college || 'University',
                          location: prev.education[0]?.location || 'India',
                          period: '2022-2026',
                          cgpa: prev.education[0]?.cgpa || '8.5'
                        }
                      ]
                    }))
                  }
                  placeholder="Degree Name"
                  className="px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-foreground text-xs"
                />
              </div>
            </div>
          ) : (
            <div>
              <label className="text-foreground/70 font-semibold block mb-1">Portfolio Sync Mode:</label>
              <div className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-foreground/80 text-xs font-mono">
                Synced with Raghul's 16+ Portfolio Projects & Experience
              </div>
            </div>
          )}
        </div>
      </div>

      {/* LIVE RESUME PREVIEW */}
      <div className="flex-1 bg-gray-50 rounded-xl p-4 overflow-y-auto border border-gray-300 shadow-inner">
        <div dangerouslySetInnerHTML={{ __html: resumeHTML }} className="scale-95 sm:scale-100 origin-top" />
      </div>
    </div>
  )
}
