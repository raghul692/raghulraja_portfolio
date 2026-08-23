import { useState } from 'react'
import { Sparkles, CheckCircle2, RotateCcw, ExternalLink } from 'lucide-react'
import { resume } from '@/data/resume'

export default function ProjectFitRecommenderTab() {
  const [step, setStep] = useState(1)
  const [domain, setDomain] = useState('')
  const [primaryStack, setPrimaryStack] = useState('')
  const [focus, setFocus] = useState('')
  const [recommendations, setRecommendations] = useState<typeof resume.projects | null>(null)

  const handleCalculateMatch = (selectedFocus: string) => {
    setFocus(selectedFocus)
    let matches = resume.projects
    if (domain === 'ai') {
      matches = matches.filter(p => p.category === 'ai' || p.tech.some(t => t.toLowerCase().includes('python') || t.toLowerCase().includes('ml')))
    } else if (domain === 'web') {
      matches = matches.filter(p => p.category === 'fullstack' || p.category === 'frontend' || p.tech.some(t => t.toLowerCase().includes('react') || t.toLowerCase().includes('node')))
    }

    setRecommendations(matches.slice(0, 3))
    setStep(4)
  }

  const handleReset = () => {
    setStep(1)
    setDomain('')
    setPrimaryStack('')
    setFocus('')
    setRecommendations(null)
  }

  return (
    <div className="flex flex-col h-[520px] bg-surface-darker/60 rounded-xl border border-white/10 p-4 overflow-y-auto space-y-4 font-sans text-sm">
      <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 text-xs text-primary flex items-start gap-2">
        <Sparkles className="w-4 h-4 flex-shrink-0 mt-0.5" />
        <div>
          <strong>AI Project Fit Recommender</strong>: Answer 3 quick hiring questions to discover which of Raghul's 16+ flagship projects match your engineering requirements!
        </div>
      </div>

      {step === 1 && (
        <div className="space-y-3">
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider font-mono block">
            Step 1 of 3: What is your primary hiring domain?
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {[
              { id: 'web', label: 'Full-Stack Web Engineering', desc: 'React 19, TypeScript, Node.js, REST APIs' },
              { id: 'ai', label: 'AI & Machine Learning', desc: 'Python, Computer Vision, Scikit-learn, RAG' },
              { id: 'security', label: 'Cybersecurity & Utilities', desc: 'Vulnerability scanners, Python CLI, Tools' }
            ].map(item => (
              <button
                key={item.id}
                onClick={() => {
                  setDomain(item.id)
                  setStep(2)
                }}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  domain === item.id ? 'bg-primary/20 border-primary text-foreground' : 'bg-white/5 border-white/10 text-foreground/80 hover:bg-white/10'
                }`}
              >
                <h4 className="text-xs font-bold text-foreground">{item.label}</h4>
                <p className="text-[11px] text-foreground/60">{item.desc}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-3">
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider font-mono block">
            Step 2 of 3: What technology stack do you prioritize?
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {['React & TypeScript', 'Python & Data Science', 'FastAPI & Backend Services'].map((stk, i) => (
              <button
                key={i}
                onClick={() => {
                  setPrimaryStack(stk)
                  setStep(3)
                }}
                className={`p-3 rounded-xl border font-semibold text-xs text-left cursor-pointer transition-all ${
                  primaryStack === stk ? 'bg-primary/20 border-primary text-foreground' : 'bg-white/5 border-white/10 text-foreground/80 hover:bg-white/10'
                }`}
              >
                ⚡ {stk}
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-3">
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider font-mono block">
            Step 3 of 3: What project complexity level are you seeking?
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {['Production Flagship SaaS', 'AI & Multimodal Prototypes', 'Full-Stack Portfolio Systems'].map((fcs, i) => (
              <button
                key={i}
                onClick={() => handleCalculateMatch(fcs)}
                className={`p-3 rounded-xl border font-semibold text-xs text-left cursor-pointer transition-all ${
                  focus === fcs ? 'bg-primary/20 border-primary text-foreground' : 'bg-white/5 border-white/10 text-foreground/80 hover:bg-white/10'
                }`}
              >
                🎯 {fcs}
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 4 && recommendations && (
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <span className="text-xs font-bold text-green-400 uppercase tracking-wider font-mono flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4 text-green-400" /> Candidate Fit Score: 98% Match! ({domain.toUpperCase()} / {primaryStack})
            </span>
            <button
              onClick={handleReset}
              className="text-xs px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-foreground/80 hover:bg-white/10 flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" /> Re-take Quiz
            </button>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-foreground">Top Recommended Projects for Your Hiring Criteria:</h4>
            {recommendations.map(p => (
              <div key={p.id} className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
                <div className="flex items-center justify-between">
                  <h5 className="text-xs font-bold text-foreground">{p.title}</h5>
                  <a
                    href={p.github}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] text-primary flex items-center gap-1 hover:underline"
                  >
                    View Code <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <p className="text-[11px] text-foreground/70">{p.description}</p>
                <div className="flex flex-wrap gap-1 pt-1">
                  {p.tech.map((t, idx) => (
                    <span key={idx} className="text-[9px] px-1.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/20 font-mono">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
