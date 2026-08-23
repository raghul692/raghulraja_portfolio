import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bot, FileText, Award, X, Settings, Languages, Download, Terminal, Trophy } from 'lucide-react'
import AskPortfolioAITab from './AskPortfolioAITab'
import ATSCheckerTab from './ATSCheckerTab'
import IEEEResumeBuilderTab from './IEEEResumeBuilderTab'
import CodePlaygroundTab from './CodePlaygroundTab'
import PlacementQuizTab from './PlacementQuizTab'
import { generateRecruiterDossierPDF } from '@/services/ai/dossierGeneratorEngine'

interface PortfolioAIHubProps {
  isOpen: boolean
  onClose: () => void
}

export default function PortfolioAIHub({ isOpen, onClose }: PortfolioAIHubProps) {
  const [activeTab, setActiveTab] = useState<'ask' | 'ats' | 'ieee' | 'code' | 'quiz'>('ask')
  const [lang, setLang] = useState<'en' | 'ta'>('en')
  const [showSettings, setShowSettings] = useState(false)
  const [apiKey, setApiKey] = useState(
    localStorage.getItem('RAGHUL_AI_GEMINI_KEY') || (import.meta.env.VITE_GEMINI_API_KEY as string) || ''
  )

  const handleSaveApiKey = (key: string) => {
    setApiKey(key)
    localStorage.setItem('RAGHUL_AI_GEMINI_KEY', key)
    setShowSettings(false)
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-5xl bg-surface-dark border border-white/15 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* MODAL HEADER */}
          <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-surface-darker">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-cyan-400 p-0.5 shadow-lg flex items-center justify-center">
                <div className="w-full h-full bg-surface-dark rounded-[10px] flex items-center justify-center text-primary">
                  <Bot className="w-5 h-5 animate-pulse" />
                </div>
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-foreground flex items-center gap-2 font-mono">
                  Portfolio AI Intelligence Suite
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/30 font-semibold uppercase tracking-wider">
                    v5.0 NEXT-GEN
                  </span>
                </h2>
                <p className="text-xs text-foreground/60">
                  RAG Q&A • ATS Heatmap • Code Sandbox • IEEE Resume • Placement Exam
                </p>
              </div>
            </div>

            {/* CONTROLS (DOSSIER PDF, LANGUAGE & SETTINGS) */}
            <div className="flex items-center gap-2">
              {/* RECRUITER DOSSIER PDF DOWNLOAD */}
              <button
                onClick={generateRecruiterDossierPDF}
                className="px-3 py-1.5 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 hover:bg-cyan-400 hover:text-black transition-all text-xs font-semibold flex items-center gap-1.5 cursor-pointer font-mono shadow-sm"
                title="Download 1-Page Recruiter Candidate Dossier PDF"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Dossier PDF</span>
              </button>

              {/* LANGUAGE TOGGLE */}
              <button
                onClick={() => setLang(prev => prev === 'en' ? 'ta' : 'en')}
                className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-foreground/80 hover:bg-white/10 transition-all text-xs font-semibold flex items-center gap-1.5 cursor-pointer font-mono"
                title="Switch Language (Tamil / English)"
              >
                <Languages className="w-4 h-4 text-primary" />
                <span>{lang === 'en' ? 'EN | தமிழ்' : 'தமிழ் | EN'}</span>
              </button>

              {/* SETTINGS BUTTON */}
              <button
                onClick={() => setShowSettings(prev => !prev)}
                className="p-2 rounded-xl bg-white/5 border border-white/10 text-foreground/80 hover:bg-white/10 hover:text-primary transition-all cursor-pointer"
                title="AI Settings & API Key"
              >
                <Settings className="w-4 h-4" />
              </button>

              {/* CLOSE BUTTON */}
              <button
                onClick={onClose}
                className="p-2 rounded-xl text-foreground/60 hover:text-foreground hover:bg-white/10 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* API SETTINGS DRAWER / MODAL */}
          {showSettings && (
            <div className="p-4 bg-surface-darker border-b border-white/10 space-y-3 font-sans text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-primary flex items-center gap-1.5">
                  <Settings className="w-4 h-4" /> Live Gemini LLM API Gateway (Optional Settings)
                </span>
                <button
                  onClick={() => setShowSettings(false)}
                  className="text-foreground/60 hover:text-foreground cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-foreground/70">
                The Portfolio AI Suite operates client-side RAG engine by default. Enter your own **Google Gemini 2.5 API Key** for direct streaming LLM answers!
              </p>
              <div className="flex gap-2">
                <input
                  type="password"
                  value={apiKey}
                  onChange={e => setApiKey(e.target.value)}
                  placeholder="Paste AI API Key (AIzaSy...)"
                  className="flex-1 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-foreground text-xs focus:outline-none focus:border-primary/60 font-mono"
                />
                <button
                  onClick={() => handleSaveApiKey(apiKey)}
                  className="px-4 py-2 rounded-xl bg-primary text-black font-bold hover:bg-primary-light transition-all cursor-pointer"
                >
                  Save Settings
                </button>
              </div>
            </div>
          )}

          {/* TAB NAVIGATION HEADER */}
          <div className="flex bg-surface-dark/90 border-b border-white/10 px-4 pt-2 overflow-x-auto">
            <button
              onClick={() => setActiveTab('ask')}
              className={`flex items-center gap-2 px-3.5 py-2.5 text-xs font-semibold border-b-2 transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'ask'
                  ? 'border-primary text-primary bg-primary/10 rounded-t-xl'
                  : 'border-transparent text-foreground/70 hover:text-foreground hover:bg-white/5 rounded-t-xl'
              }`}
            >
              <Bot className="w-3.5 h-3.5" /> {lang === 'ta' ? 'AI கேள்வி பதில்' : 'Ask Portfolio AI'}
            </button>

            <button
              onClick={() => setActiveTab('ats')}
              className={`flex items-center gap-2 px-3.5 py-2.5 text-xs font-semibold border-b-2 transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'ats'
                  ? 'border-primary text-primary bg-primary/10 rounded-t-xl'
                  : 'border-transparent text-foreground/70 hover:text-foreground hover:bg-white/5 rounded-t-xl'
              }`}
            >
              <FileText className="w-3.5 h-3.5" /> {lang === 'ta' ? 'ATS ரெஸூம் செக்கர்' : 'ATS Checker'}
            </button>

            <button
              onClick={() => setActiveTab('code')}
              className={`flex items-center gap-2 px-3.5 py-2.5 text-xs font-semibold border-b-2 transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'code'
                  ? 'border-primary text-primary bg-primary/10 rounded-t-xl'
                  : 'border-transparent text-foreground/70 hover:text-foreground hover:bg-white/5 rounded-t-xl'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" /> Code Arena
            </button>

            <button
              onClick={() => setActiveTab('quiz')}
              className={`flex items-center gap-2 px-3.5 py-2.5 text-xs font-semibold border-b-2 transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'quiz'
                  ? 'border-primary text-primary bg-primary/10 rounded-t-xl'
                  : 'border-transparent text-foreground/70 hover:text-foreground hover:bg-white/5 rounded-t-xl'
              }`}
            >
              <Trophy className="w-3.5 h-3.5 text-amber-400" /> Placement Quiz
            </button>

            <button
              onClick={() => setActiveTab('ieee')}
              className={`flex items-center gap-2 px-3.5 py-2.5 text-xs font-semibold border-b-2 transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'ieee'
                  ? 'border-primary text-primary bg-primary/10 rounded-t-xl'
                  : 'border-transparent text-foreground/70 hover:text-foreground hover:bg-white/5 rounded-t-xl'
              }`}
            >
              <Award className="w-3.5 h-3.5" /> IEEE Resume
            </button>
          </div>

          {/* TAB CONTENT AREA */}
          <div className="p-4 flex-1 overflow-hidden bg-surface-darker/40">
            {activeTab === 'ask' && <AskPortfolioAITab lang={lang} />}
            {activeTab === 'ats' && <ATSCheckerTab />}
            {activeTab === 'code' && <CodePlaygroundTab />}
            {activeTab === 'quiz' && <PlacementQuizTab />}
            {activeTab === 'ieee' && <IEEEResumeBuilderTab />}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}


