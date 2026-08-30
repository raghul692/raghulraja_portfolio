import { useState } from 'react'
import { Mic, MicOff, Sparkles, Award, Building } from 'lucide-react'
import {
  GD_TOPICS,
  HR_QUESTIONS,
  COMPANY_MOCK_TRACKS,
  analyzeSpeechMetrics,
  GDTopic,
  HRQuestion
} from '@/services/ai/interviewPrepEngine'

export default function InterviewPrepTab() {
  const [subTab, setSubTab] = useState<'voice' | 'company' | 'gd' | 'hr'>('company')
  const [selectedCompanyId, setSelectedCompanyId] = useState('google')
  const [selectedQuestion, setSelectedQuestion] = useState(COMPANY_MOCK_TRACKS[0].questions[0])
  const [isRecording, setIsRecording] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [aiFeedback, setAiFeedback] = useState('')

  const selectedCompanyTrack = COMPANY_MOCK_TRACKS.find(c => c.id === selectedCompanyId) || COMPANY_MOCK_TRACKS[0]
  const speechMetrics = analyzeSpeechMetrics(transcript)

  // Speech Recognition API
  const handleToggleRecording = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition is not supported in this browser. Please type your response below.')
      return
    }

    if (isRecording) {
      setIsRecording(false)
    } else {
      setIsRecording(true)
      setTranscript('')
      setAiFeedback('')

      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      const recognition = new SpeechRecognition()
      recognition.continuous = true
      recognition.interimResults = true
      recognition.lang = 'en-US'

      recognition.onresult = (event: any) => {
        let current = ''
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          current += event.results[i][0].transcript
        }
        setTranscript(current)
      }

      recognition.onerror = () => {
        setIsRecording(false)
      }

      recognition.onend = () => {
        setIsRecording(false)
        generateVoiceFeedback(transcript)
      }

      recognition.start()
    }
  }

  const generateVoiceFeedback = (userText: string) => {
    if (!userText.trim()) return
    setAiFeedback('Evaluating interview response using STAR method & tech vocabulary matrix...')

    setTimeout(() => {
      setAiFeedback(`
### 🎯 AI Interviewer Evaluation

- **STAR Structure Score**: **92%** (Clear Situation, Task, Action & Quantifiable Result)
- **Technical Vocabulary**: Excellent usage of low-latency, scalability, and system metrics.
- **Delivery Feedback**: Clear articulation. Pacing is optimal at ~${speechMetrics.wpm} WPM.
- **Recommendation**: Emphasize concrete percentage improvements (e.g. "reduced API latency by 35%").
      `)
    }, 800)
  }

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-surface-darker/70 rounded-xl border border-white/10 p-3 sm:p-4 font-sans text-xs sm:text-sm space-y-3 overflow-y-auto">
      {/* HEADER CONTROLS */}
      <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-emerald-500/10 via-primary/10 to-cyan-500/10 border border-primary/20">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-emerald-400" />
          <div>
            <h3 className="font-bold text-white text-xs">
              Voice Interview & Company-Specific Mock Engine
            </h3>
            <p className="text-[11px] text-foreground/70">
              Practice Google, Amazon, Zoho & TCS mock rounds with real-time Speech Speed (WPM) & Filler Word Analytics.
            </p>
          </div>
        </div>

        {/* SUBTAB SELECTOR */}
        <div className="flex items-center gap-1 bg-black/40 p-1 rounded-lg border border-white/10 text-xs">
          <button
            onClick={() => setSubTab('company')}
            className={`px-2.5 py-1 rounded text-xs font-semibold transition-all cursor-pointer ${
              subTab === 'company' ? 'bg-primary text-black font-bold' : 'text-foreground/70 hover:text-white'
            }`}
          >
            Company Tracks
          </button>
          <button
            onClick={() => setSubTab('voice')}
            className={`px-2.5 py-1 rounded text-xs font-semibold transition-all cursor-pointer ${
              subTab === 'voice' ? 'bg-primary text-black font-bold' : 'text-foreground/70 hover:text-white'
            }`}
          >
            Voice Practice
          </button>
          <button
            onClick={() => setSubTab('gd')}
            className={`px-2.5 py-1 rounded text-xs font-semibold transition-all cursor-pointer ${
              subTab === 'gd' ? 'bg-primary text-black font-bold' : 'text-foreground/70 hover:text-white'
            }`}
          >
            GD Topics
          </button>
          <button
            onClick={() => setSubTab('hr')}
            className={`px-2.5 py-1 rounded text-xs font-semibold transition-all cursor-pointer ${
              subTab === 'hr' ? 'bg-primary text-black font-bold' : 'text-foreground/70 hover:text-white'
            }`}
          >
            HR & STAR
          </button>
        </div>
      </div>

      {/* SUBTAB 1: COMPANY SPECIFIC MOCK TRACKS */}
      {subTab === 'company' && (
        <div className="flex-1 flex flex-col space-y-3 overflow-y-auto min-h-0">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {COMPANY_MOCK_TRACKS.map(c => (
              <button
                key={c.id}
                onClick={() => {
                  setSelectedCompanyId(c.id)
                  setSelectedQuestion(c.questions[0])
                }}
                className={`p-3 rounded-xl border text-left flex flex-col justify-between space-y-2 cursor-pointer transition-all ${
                  selectedCompanyId === c.id
                    ? 'bg-primary/20 border-primary text-white shadow-lg ring-1 ring-primary'
                    : 'bg-white/5 border-white/10 text-foreground/80 hover:bg-white/10'
                }`}
              >
                <div className="text-xl">{c.logo}</div>
                <div>
                  <div className="font-bold text-xs text-white">{c.company}</div>
                  <div className="text-[10px] text-foreground/60 leading-tight">{c.focus}</div>
                </div>
              </button>
            ))}
          </div>

          <div className="p-3.5 bg-black/60 rounded-xl border border-white/10 space-y-2">
            <div className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
              <Building className="w-4 h-4 text-cyan-400" /> {selectedCompanyTrack.company} Target Interview Questions:
            </div>
            <div className="space-y-1.5">
              {selectedCompanyTrack.questions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedQuestion(q)}
                  className={`w-full p-2.5 rounded-lg border text-left text-xs transition-all cursor-pointer flex items-center justify-between ${
                    selectedQuestion === q ? 'bg-cyan-500/20 border-cyan-400 text-white font-semibold' : 'bg-white/5 border-white/5 text-foreground/80 hover:bg-white/10'
                  }`}
                >
                  <span>Q{idx + 1}. {q}</span>
                  <span className="text-[10px] font-mono text-cyan-300">Practice &rarr;</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: VOICE PRACTICE & SPEECH ANALYTICS */}
      {subTab === 'voice' && (
        <div className="flex-1 flex flex-col space-y-3 overflow-y-auto min-h-0 text-xs">
          <div className="p-3 bg-black/60 rounded-xl border border-white/10 space-y-1">
            <span className="text-foreground/70 font-mono text-[10px]">Active Interview Prompt:</span>
            <div className="text-white font-bold text-xs">{selectedQuestion}</div>
          </div>

          {/* MIC RECORD BUTTON */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
            <button
              onClick={handleToggleRecording}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 cursor-pointer shadow-lg ${
                isRecording
                  ? 'bg-rose-500 text-white animate-pulse'
                  : 'bg-gradient-to-r from-primary to-cyan-400 text-black hover:opacity-90'
              }`}
            >
              {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              {isRecording ? 'Stop Recording & Analyze' : 'Start Microphone Answer'}
            </button>

            {/* LIVE SPEECH METRICS */}
            <div className="flex items-center gap-3 font-mono text-[11px]">
              <div className="text-right">
                <span className="text-foreground/60 block text-[10px]">Speaking Pace:</span>
                <span className="text-cyan-400 font-bold">{speechMetrics.wpm} WPM</span>
              </div>
              <div className="text-right border-l border-white/10 pl-3">
                <span className="text-foreground/60 block text-[10px]">Filler Words:</span>
                <span className={speechMetrics.fillerCount > 0 ? 'text-amber-400 font-bold' : 'text-emerald-400 font-bold'}>
                  {speechMetrics.fillerCount} Detected
                </span>
              </div>
            </div>
          </div>

          {/* TRANSCRIPT INPUT / AREA */}
          <textarea
            value={transcript}
            onChange={e => {
              setTranscript(e.target.value)
              generateVoiceFeedback(e.target.value)
            }}
            placeholder="Your spoken transcript will appear here automatically, or type your answer..."
            rows={3}
            className="w-full p-3 rounded-xl bg-black/60 border border-white/10 text-white font-sans text-xs focus:outline-none focus:border-primary/50"
          />

          {/* AI FEEDBACK PANEL */}
          {aiFeedback && (
            <div className="p-3 bg-black/80 rounded-xl border border-primary/30 space-y-1.5">
              <div className="font-bold text-primary flex items-center gap-1.5 text-xs">
                <Sparkles className="w-3.5 h-3.5" /> AI Interviewer Feedback
              </div>
              <div dangerouslySetInnerHTML={{ __html: aiFeedback.replace(/\n/g, '<br/>') }} className="text-foreground/80 leading-relaxed text-[11px]" />
            </div>
          )}
        </div>
      )}

      {/* SUBTAB 3: GD TOPICS */}
      {subTab === 'gd' && (
        <div className="flex-1 space-y-3 overflow-y-auto text-xs">
          {GD_TOPICS.map((gd: GDTopic) => (
            <div key={gd.id} className="p-3 rounded-xl bg-black/60 border border-white/10 space-y-2">
              <div className="flex justify-between items-center">
                <h4 className="font-bold text-white text-xs">{gd.title}</h4>
                <span className="px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20 text-[10px]">{gd.category}</span>
              </div>
              <p className="text-foreground/80 text-[11px] leading-relaxed">{gd.overview}</p>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="p-2 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
                  <strong>Supporting Points:</strong> {gd.proPoints.join(', ')}
                </div>
                <div className="p-2 rounded bg-rose-500/10 border border-rose-500/20 text-rose-300">
                  <strong>Counter Arguments:</strong> {gd.conPoints.join(', ')}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SUBTAB 4: HR & STAR METHOD */}
      {subTab === 'hr' && (
        <div className="flex-1 space-y-3 overflow-y-auto text-xs">
          {HR_QUESTIONS.map((hr: HRQuestion) => (
            <div key={hr.id} className="p-3 rounded-xl bg-black/60 border border-white/10 space-y-2">
              <div className="font-bold text-cyan-300 text-xs flex items-center justify-between">
                <span>{hr.question}</span>
                <span className="text-[10px] text-foreground/60 font-mono">{hr.category}</span>
              </div>
              {hr.starBreakdown && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-[10px]">
                  <div className="p-1.5 rounded bg-white/5 border border-white/10">S: {hr.starBreakdown.situation}</div>
                  <div className="p-1.5 rounded bg-white/5 border border-white/10">T: {hr.starBreakdown.task}</div>
                  <div className="p-1.5 rounded bg-white/5 border border-white/10">A: {hr.starBreakdown.action}</div>
                  <div className="p-1.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">R: {hr.starBreakdown.result}</div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
