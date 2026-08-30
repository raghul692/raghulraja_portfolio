import { useState } from 'react'
import { FileText, CheckCircle2, AlertCircle, Sparkles, Upload, RotateCcw, ShieldAlert, Cpu, Zap, Copy, Check, UserCheck, Trash2, Target } from 'lucide-react'
import { analyzeATSResume, ATSReport } from '@/services/ai/atsAnalyzerEngine'
import { parseResumeFile } from '@/services/ai/pdfParserEngine'
import { portfolioAiApi } from '@/services/api/portfolioAiApi'

const ROLE_PRESETS = [
  { title: 'Full-Stack Developer', label: 'Full-Stack Developer', jd: 'Seeking Full Stack Engineer proficient in React, TypeScript, Node.js, Python, REST APIs, MySQL, Docker, and Git.' },
  { title: 'AI & ML Engineer', label: 'AI & ML Engineer', jd: 'Seeking AI / ML Developer proficient in Python, Machine Learning, Deep Learning, PyTorch, FastAPI, Pandas, and Model Deployment.' },
  { title: 'Frontend Developer', label: 'Frontend Developer', jd: 'Required Frontend Developer skilled in React, TypeScript, Tailwind CSS, Framer Motion, State Management, and Web Performance.' },
  { title: 'DevOps & Cloud Engineer', label: 'DevOps Engineer', jd: 'Looking for DevOps Engineer experienced in Docker, Kubernetes, AWS, CI/CD pipelines, Terraform, Linux, and Cloud Infrastructure.' },
  { title: 'Data Analyst', label: 'Data Analyst', jd: 'Seeking Data Analyst with expertise in SQL, Python, PowerBI, Data Visualization, Excel, ETL Pipelines, and Statistics.' }
]

export default function ATSCheckerTab() {
  const [resumeText, setResumeText] = useState('')
  const [customJobTitle, setCustomJobTitle] = useState('Full-Stack Developer')
  const [jdText, setJdText] = useState('')
  const [selectedRoleLabel, setSelectedRoleLabel] = useState('')
  const [atsEngine, setAtsEngine] = useState<'workday' | 'greenhouse' | 'ai_ranker'>('workday')
  const [report, setReport] = useState<ATSReport | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  const [copiedSummary, setCopiedSummary] = useState(false)

  const handleFileUpload = async (file: File) => {
    setIsUploading(true)
    try {
      const extractedText = await parseResumeFile(file)
      setResumeText(extractedText)
    } catch (err) {
      console.warn('File upload error:', err)
    } finally {
      setIsUploading(false)
    }
  }

  const handleLoadPortfolioSample = () => {
    setResumeText(
      `Raghul Raja M - Full Stack & AI Engineer\nEmail: raghul@example.com | Phone: +91 9876543210 | GitHub: github.com/raghulraja\n\nExperience: Full Stack Developer Intern at TVK Technologies.\n- Worked on React and Node.js web applications.\n- Built machine learning model for prediction.\n\nSkills: React, TypeScript, Python, Machine Learning, FastAPI, Node.js, HTML5, CSS3, Tailwind CSS, MySQL, MongoDB, Git, GitHub, REST API.\n\nProjects: Wolf Sec 2X Finder, Aether Weather Platform, ChatBot AI, Multi-Disease Prediction System.\n\nEducation: SKP Engineering College - B.E CSE - CGPA: 8.2.`
    )
  }

  const handleClearResume = () => {
    setResumeText('')
    setJdText('')
    setReport(null)
  }

  const handleAnalyze = async () => {
    if (!resumeText.trim()) return
    setIsAnalyzing(true)
    try {
      const result = await portfolioAiApi.analyzeATS({ resumeText, jdText })
      setReport(result)
    } catch {
      const fallbackResult = analyzeATSResume(resumeText, jdText, atsEngine, customJobTitle)
      setReport(fallbackResult)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleSelectRole = (jd: string, title: string) => {
    setSelectedRoleLabel(title)
    setCustomJobTitle(title)
    setJdText(jd)
  }

  const handleCopySuggestedBullet = (text: string, index: number) => {
    navigator.clipboard.writeText(text)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  const handleCopySummary = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedSummary(true)
    setTimeout(() => setCopiedSummary(false), 2000)
  }

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-surface-darker/60 rounded-xl border border-white/10 p-3 sm:p-4 overflow-y-auto space-y-4 font-sans text-xs sm:text-sm">
      {!report ? (
        <div className="space-y-4">
          <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 text-xs text-primary flex items-start justify-between gap-2">
            <div className="flex items-start gap-2">
              <Sparkles className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <div>
                <strong>Universal ATS Resume Checker for Students & Job Seekers</strong>: Paste or upload YOUR resume, specify your Target Job Title, and get real-time keyword accuracy optimization!
              </div>
            </div>
            <button
              onClick={handleLoadPortfolioSample}
              className="px-2.5 py-1 rounded bg-primary/20 hover:bg-primary text-primary hover:text-black font-bold text-[10px] whitespace-nowrap transition-all cursor-pointer font-mono"
            >
              Load Sample Demo Resume
            </button>
          </div>

          {/* TARGET JOB TITLE INPUT & ROLE PRESETS */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-foreground/80 flex items-center gap-1.5 font-mono">
              <Target className="w-3.5 h-3.5 text-cyan-400" /> Enter Your Target Job Title / Role:
            </label>
            <input
              type="text"
              value={customJobTitle}
              onChange={e => setCustomJobTitle(e.target.value)}
              placeholder="e.g. DevOps Engineer, Data Scientist, Full-Stack Developer, Java Developer..."
              className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-foreground text-xs focus:outline-none focus:border-cyan-400/60 font-mono"
            />

            <div className="flex flex-wrap gap-1.5 pt-1">
              <span className="text-[11px] text-foreground/50 self-center">Quick Roles:</span>
              {ROLE_PRESETS.map((rp, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectRole(rp.jd, rp.title)}
                  className={`text-[11px] px-2 py-0.5 rounded-lg border transition-all cursor-pointer ${
                    selectedRoleLabel === rp.title
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold'
                      : 'bg-white/5 border-white/10 text-foreground/70 hover:bg-white/10'
                  }`}
                >
                  🎯 {rp.label}
                </button>
              ))}
            </div>
          </div>

          {/* ENGINE PRESET SELECTOR */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-foreground/80 flex items-center gap-1.5 font-mono">
              <Cpu className="w-3.5 h-3.5 text-primary" /> Target ATS Scanner Engine Emulation:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setAtsEngine('workday')}
                className={`p-2.5 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                  atsEngine === 'workday'
                    ? 'bg-primary/20 border-primary text-primary font-bold shadow-md'
                    : 'bg-white/5 border-white/10 text-foreground/70 hover:bg-white/10'
                }`}
              >
                <div className="font-bold flex items-center gap-1">🏢 Workday / Taleo</div>
                <div className="text-[10px] opacity-70">Strict keywords & section scan</div>
              </button>

              <button
                type="button"
                onClick={() => setAtsEngine('greenhouse')}
                className={`p-2.5 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                  atsEngine === 'greenhouse'
                    ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold shadow-md'
                    : 'bg-white/5 border-white/10 text-foreground/70 hover:bg-white/10'
                }`}
              >
                <div className="font-bold flex items-center gap-1">🚀 Greenhouse / Lever</div>
                <div className="text-[10px] opacity-70">Impact & verb metrics focus</div>
              </button>

              <button
                type="button"
                onClick={() => setAtsEngine('ai_ranker')}
                className={`p-2.5 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                  atsEngine === 'ai_ranker'
                    ? 'bg-purple-500/20 border-purple-400 text-purple-300 font-bold shadow-md'
                    : 'bg-white/5 border-white/10 text-foreground/70 hover:bg-white/10'
                }`}
              >
                <div className="font-bold flex items-center gap-1">🤖 AI Vector Ranker</div>
                <div className="text-[10px] opacity-70">Semantic LLM match & fit</div>
              </button>
            </div>
          </div>

          {/* UPLOAD YOUR OWN RESUME */}
          <div className="p-4 rounded-xl border-2 border-dashed border-white/20 bg-white/5 hover:border-primary/60 transition-all text-center space-y-2">
            <Upload className="w-6 h-6 text-primary mx-auto" />
            <div className="text-xs text-foreground/80 font-semibold">
              Upload YOUR Resume File (.pdf, .txt, .docx)
            </div>
            <input
              type="file"
              accept=".pdf,.txt,.doc,.docx"
              onChange={e => {
                if (e.target.files && e.target.files[0]) {
                  handleFileUpload(e.target.files[0])
                }
              }}
              className="hidden"
              id="resume-file-input"
            />
            <label
              htmlFor="resume-file-input"
              className="inline-block px-3 py-1.5 rounded-lg bg-primary/20 text-primary border border-primary/40 text-xs font-bold hover:bg-primary hover:text-black transition-all cursor-pointer"
            >
              {isUploading ? 'Extracting Text...' : 'Select Resume File'}
            </label>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-foreground/80 flex items-center gap-1.5 font-mono">
                <FileText className="w-3.5 h-3.5 text-primary" /> Paste Resume Content:
              </label>
              {resumeText && (
                <button
                  onClick={handleClearResume}
                  className="text-[11px] text-red-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" /> Clear Text
                </button>
              )}
            </div>
            <textarea
              rows={4}
              value={resumeText}
              onChange={e => setResumeText(e.target.value)}
              placeholder="Paste your resume text here (or click 'Load Sample Demo Resume' above)..."
              className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-foreground placeholder:text-foreground/40 text-xs focus:outline-none focus:border-primary/60 font-mono leading-relaxed"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-foreground/80 flex items-center gap-1.5 font-mono">
              <Upload className="w-3.5 h-3.5 text-cyan-400" /> Target Job Description (Optional - Paste JD for custom keyword extraction):
            </label>
            <textarea
              rows={3}
              value={jdText}
              onChange={e => setJdText(e.target.value)}
              placeholder="Paste specific company Job Description (JD) text here to calculate exact TF-IDF keyword match..."
              className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-foreground placeholder:text-foreground/40 text-xs focus:outline-none focus:border-cyan-400/60 font-mono"
            />
          </div>

          <button
            onClick={handleAnalyze}
            disabled={!resumeText.trim() || isAnalyzing}
            className="w-full py-3 rounded-xl bg-primary text-black font-bold text-xs uppercase tracking-wider hover:bg-primary-light transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" /> {isAnalyzing ? 'Running Custom Real-Time ATS Audit...' : `Audit ATS Compatibility for ${customJobTitle || 'Target Role'}`}
          </button>
        </div>
      ) : (
        /* ATS REPORT VIEW */
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div>
              <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary" /> ATS Resume Audit & Role Match Scorecard
              </h3>
              <p className="text-xs text-foreground/60 font-mono">
                Target Role: <span className="text-cyan-400 font-bold">{customJobTitle}</span> • Engine: <span className="text-primary font-bold">{report.atsEngineEmulated}</span>
              </p>
            </div>
            <button
              onClick={() => setReport(null)}
              className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-xs text-foreground/80 flex items-center gap-1 cursor-pointer font-mono"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Re-audit Resume
            </button>
          </div>

          {/* OVERALL ATS SCORE CARD */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-primary/10 via-cyan-500/10 to-purple-500/10 border border-primary/30 flex items-center justify-between">
            <div>
              <div className="text-xs text-foreground/70 uppercase tracking-wider font-semibold font-mono">
                {customJobTitle} Match Score
              </div>
              <div className="text-3xl font-extrabold text-primary font-mono flex items-baseline gap-2">
                {report.overallScore}%
                <span className="text-xs font-normal text-foreground/70">
                  {report.overallScore >= 80 ? '🟢 Excellent ATS Match - High Call Chance' : report.overallScore >= 60 ? '🟡 Good Match - Minor Keyword Updates Needed' : '🔴 Low ATS Score - Critical Updates Required'}
                </span>
              </div>
            </div>
            <div className="w-16 h-16 rounded-full border-4 border-primary/40 flex items-center justify-center font-mono font-bold text-lg text-primary bg-surface-darker">
              {report.overallScore}
            </div>
          </div>

          {/* SUB-METRICS METERS */}
          <div className="grid grid-cols-3 gap-2 text-center font-mono">
            <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
              <div className="text-[10px] text-foreground/60">KEYWORD MATCH</div>
              <div className="text-lg font-bold text-cyan-400">{report.keywordScore}%</div>
            </div>
            <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
              <div className="text-[10px] text-foreground/60 font-mono">FORMAT & STRUCTURE</div>
              <div className="text-lg font-bold text-green-400">{report.formattingScore}%</div>
            </div>
            <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
              <div className="text-[10px] text-foreground/60 font-mono">ACTION & METRIC IMPACT</div>
              <div className="text-lg font-bold text-purple-400">{report.impactScore}%</div>
            </div>
          </div>

          {/* GENERATED TAILORED SUMMARY FOR TOP OF RESUME */}
          {report.targetRoleSummarySuggestion && (
            <div className="p-3.5 rounded-xl bg-cyan-500/10 border border-cyan-400/30 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-cyan-300 font-mono">
                <span className="flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4 text-cyan-400" /> Generated Tailored Summary for Top of Resume:
                </span>
                <button
                  onClick={() => handleCopySummary(report.targetRoleSummarySuggestion!)}
                  className="px-2.5 py-1 rounded bg-cyan-400/20 hover:bg-cyan-400 text-cyan-200 hover:text-black font-bold text-[10px] flex items-center gap-1 transition-all cursor-pointer font-mono"
                >
                  {copiedSummary ? <Check className="w-3 h-3 text-black" /> : <Copy className="w-3 h-3" />}
                  {copiedSummary ? 'Copied!' : 'Copy Summary'}
                </button>
              </div>
              <p className="text-xs text-foreground/90 leading-relaxed font-sans italic bg-surface-darker/60 p-2.5 rounded-lg border border-white/5">
                "{report.targetRoleSummarySuggestion}"
              </p>
            </div>
          )}

          {/* PARSABILITY WARNINGS BANNER */}
          {report.parsabilityWarnings.length > 0 && (
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs space-y-1">
              <div className="font-bold flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-amber-400" /> ATS Parser Formatting Warnings:
              </div>
              <ul className="list-disc list-inside space-y-0.5 text-[11px] opacity-90">
                {report.parsabilityWarnings.map((warn, i) => (
                  <li key={i}>{warn}</li>
                ))}
              </ul>
            </div>
          )}

          {/* KEYWORD MATRIX HEATMAP & 1-CLICK AUTO-INJECTOR */}
          <div className="space-y-3 p-3.5 bg-black/60 rounded-xl border border-white/10">
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold text-foreground/80 flex items-center gap-1.5 font-mono">
                <Zap className="w-3.5 h-3.5 text-primary animate-pulse" /> {customJobTitle} Keyword Match Heatmap:
              </div>
              {report.missingKeywords.length > 0 && (
                <button
                  onClick={() => {
                    const missingStr = report.missingKeywords.join(', ')
                    setResumeText(prev => `${prev.trim()}\n\nAdditional Target Skills: ${missingStr}`)
                    setReport(prev => prev ? {
                      ...prev,
                      overallScore: Math.min(98, prev.overallScore + 18),
                      keywordScore: 95,
                      matchedKeywords: [...prev.matchedKeywords, ...prev.missingKeywords],
                      missingKeywords: []
                    } : null)
                  }}
                  className="px-3 py-1 rounded-lg bg-gradient-to-r from-emerald-400 to-cyan-400 text-black font-extrabold text-[11px] hover:opacity-90 transition-all cursor-pointer shadow-md font-mono flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3 fill-current" /> 1-Click Inject Missing Skills
                </button>
              )}
            </div>

            {/* HEATMAP GRID */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center font-mono text-xs">
              {report.matchedKeywords.map((kw, idx) => (
                <div
                  key={`matched-${idx}`}
                  className="p-2 rounded-lg bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 flex items-center justify-between"
                >
                  <span className="truncate font-semibold">{kw}</span>
                  <span className="text-[9px] bg-emerald-500/30 px-1 rounded text-white">Match</span>
                </div>
              ))}
              {report.missingKeywords.map((kw, idx) => (
                <div
                  key={`missing-${idx}`}
                  className="p-2 rounded-lg bg-rose-500/15 border border-rose-500/40 text-rose-300 flex items-center justify-between animate-pulse"
                >
                  <span className="truncate font-semibold">{kw}</span>
                  <span className="text-[9px] bg-rose-500/30 px-1 rounded text-white">+Add</span>
                </div>
              ))}
            </div>
          </div>

          {/* AI BULLET POINT FIXES / SUGGESTIONS */}
          {report.bulletPointFixes && report.bulletPointFixes.length > 0 && (
            <div className="space-y-2 border-t border-white/10 pt-3">
              <div className="text-xs font-bold text-cyan-300 flex items-center gap-1.5 font-mono">
                <Sparkles className="w-3.5 h-3.5" /> AI STAR Bullet Optimizer for {customJobTitle}:
              </div>
              <div className="space-y-2">
                {report.bulletPointFixes.map((fix, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs space-y-1.5">
                    <div className="text-foreground/50 text-[11px] line-through">
                      Original: "{fix.original}"
                    </div>
                    <div className="text-green-300 font-medium flex items-start justify-between gap-2">
                      <div>✨ Optimized: "{fix.suggested}"</div>
                      <button
                        onClick={() => handleCopySuggestedBullet(fix.suggested, idx)}
                        className="px-2 py-1 rounded bg-green-500/20 hover:bg-green-500 text-green-200 text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer font-mono"
                      >
                        {copiedIndex === idx ? <Check className="w-3 h-3 text-black" /> : <Copy className="w-3 h-3" />}
                        {copiedIndex === idx ? 'Copied' : 'Copy Bullet'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STRENGTHS & IMPROVEMENTS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 border-t border-white/10 pt-3">
            <div className="space-y-1">
              <span className="text-xs font-bold text-green-400 flex items-center gap-1 font-mono">
                <CheckCircle2 className="w-3.5 h-3.5" /> Strengths
              </span>
              <ul className="text-xs text-foreground/80 space-y-1 list-disc list-inside">
                {report.strengths.map((str, idx) => (
                  <li key={idx}>{str}</li>
                ))}
              </ul>
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold text-amber-400 flex items-center gap-1 font-mono">
                <AlertCircle className="w-3.5 h-3.5" /> Action Items to Improve ATS Score
              </span>
              <ul className="text-xs text-foreground/80 space-y-1 list-disc list-inside">
                {report.improvements.map((imp, idx) => (
                  <li key={idx}>{imp}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
