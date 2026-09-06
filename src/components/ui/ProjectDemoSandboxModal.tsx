'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Play, Terminal, CheckCircle2, Cpu, Zap } from 'lucide-react'
import soundEngine from '@/utils/soundEngine'
import { cn } from '@/utils/cn'

interface ProjectDemoSandboxModalProps {
  isOpen: boolean
  onClose: () => void
  projectTitle: string
  projectId: string
}

const demoConfigs: Record<string, {
  placeholder: string
  presets: string[]
  runSimulation: (input: string) => {
    status: string
    latency: string
    confidence: string
    logs: string[]
    output: string
  }
}> = {
  'multi-disease-prediction': {
    placeholder: 'Enter patient diagnostic values (e.g. Glucose: 148, BP: 72, BMI: 33.6, Age: 50)...',
    presets: [
      'High Risk Heart Profile (Age: 62, Cholesterol: 280, Max HR: 110)',
      'Normal Diabetes Screening (Glucose: 95, Insulin: 45, BMI: 22.4)',
      'Parkinsons Diagnostic Tremor Index (MDVP: 0.005, Jitter: 0.01)',
    ],
    runSimulation: (input) => ({
      status: '200 OK — Diagnostic Benchmark Complete',
      latency: '42ms',
      confidence: '98.7% Accuracy',
      logs: [
        'INITIALIZING Scikit-Learn Ensemble Pipeline...',
        'DESERIALIZING Trained Models: [RandomForest, SVM, ExtraTrees]',
        `INPUT PARSED: "${input.slice(0, 40)}..."`,
        'RUNNING 5-Domain Predictive Analysis...',
        'CALCULATING Risk Radar & Biomarker Probability...',
        'COMPLETED: Patient Risk Profile Generated Successfully.',
      ],
      output: JSON.stringify(
        {
          diagnosticResult: 'DIABETES: LOW RISK (12.4%) | HEART: MODERATE RISK (48.1%)',
          recommendedAction: 'Routine follow-up in 6 months. Maintain current diet & aerobic regimen.',
          modelEnsemble: 'RandomForestClassifier (Accuracy: 0.992, F1-Score: 0.985)',
          reportStatus: 'PDF_GENERATED (/exports/patient_report_8921.pdf)',
        },
        null,
        2
      ),
    }),
  },
  'aetheris-ai-chatbot': {
    placeholder: 'Ask Aetheris AI a technical coding or design question...',
    presets: [
      'Explain React 19 Server Actions vs Client Components in 2 sentences',
      'Generate a TypeScript interface for a SaaS User Profile with JWT',
      'Optimize a Python multithreaded web scraper algorithm',
    ],
    runSimulation: (input) => ({
      status: '200 OK — Gemini 1.5 Stream Complete',
      latency: '118ms',
      confidence: '99.9% Streaming Stability',
      logs: [
        'ESTABLISHING WebSocket SSE Connection to Gemini AI Core...',
        'ATTACHING Context Buffer: System Persona [Full-Stack Architect]',
        `USER PROMPT: "${input}"`,
        'GENERATING Token Stream (Word-by-Word Engine)...',
        'APPLYING Prism.js Syntax Highlighting & Code Blocks...',
        'COMPLETED: Response Streamed to Artifact Drawer.',
      ],
      output: `🤖 Aetheris AI Response:\n\nIn React 19, Server Actions allow you to run asynchronous server-side code directly from form submissions without manually writing API fetch routes. Client Components handle UI interactions, local state, and browser DOM events seamlessly.`,
    }),
  },
  'qrmaster-pro': {
    placeholder: 'Enter target destination URL or vCard data for QR generation...',
    presets: [
      'https://raghulraja.dev/portfolio-demo',
      'WIFI:S:MyHomeFiber;T:WPA;P:SecretKey123;;',
      'BEGIN:VCARD\nN:Raja;Raghul\nTEL:+918946092718\nEND:VCARD',
    ],
    runSimulation: (_input) => ({
      status: '200 OK — Shortcode Routing Generated',
      latency: '18ms',
      confidence: '100% Scan Validity',
      logs: [
        'GENERATING Dynamic Shortcode Route (/r/qrm_78a1b)...',
        'APPLYING SHA-256 Hash Security Signature...',
        'CREATING High-Res Vector Matrix via ReportLab Engine...',
        'ATTACHING Real-Time IP/User-Agent Scan Analytics Logger...',
        'COMPLETED: Print-Ready 300 DPI A4 Sticker Sheet Export Ready.',
      ],
      output: JSON.stringify(
        {
          shortUrl: 'https://qrm.link/r/qrm_78a1b',
          qrType: 'DYNAMIC_ROUTED',
          securityHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
          pdfGridStatus: '21 Stickers Rendered on A4 Page Grid',
        },
        null,
        2
      ),
    }),
  },
  'xss-finder': {
    placeholder: 'Enter target URL for automated vulnerability audit (e.g. https://example.com/search)...',
    presets: [
      'https://testphp.vulnweb.com/search.php?test=query',
      'http://demo.inexistent-lab.local/login',
      'https://example.com/profile?name=user',
    ],
    runSimulation: (input) => ({
      status: '200 OK — Multithread Audit Complete',
      latency: '64ms',
      confidence: 'Zero False Positives',
      logs: [
        'INITIALIZING Concurrent Web Crawler (8 Threads)...',
        `TARGET INJECTED: "${input}"`,
        'HARVESTING GET/POST Parameters & Hidden HTML Form Inputs...',
        'EXECUTING WAF-Bypass Polyglot Payloads [<script>alert(1)</script>, svg/onload]...',
        'ANALYZING Reflection Context & DOM Sink Data Flows...',
        'AUDIT COMPLETE: Vulnerability Audit Log Synthesized.',
      ],
      output: JSON.stringify(
        {
          vulnerabilitiesFound: 1,
          severity: 'HIGH (Reflected XSS)',
          parameter: 'query',
          payload: '"><svg/onload=confirm(document.domain)>',

          mitigation: 'Implement HTML Entity Encoding & Content-Security-Policy (CSP) headers.',
        },
        null,
        2
      ),
    }),
  },
}

export function ProjectDemoSandboxModal({
  isOpen,
  onClose,
  projectTitle,
  projectId,
}: ProjectDemoSandboxModalProps) {
  const config = demoConfigs[projectId] || demoConfigs['aetheris-ai-chatbot']
  const [inputVal, setInputVal] = useState(config.presets[0] || '')
  const [isRunning, setIsRunning] = useState(false)
  const [activeLogs, setActiveLogs] = useState<string[]>([])
  const [resultData, setResultData] = useState<{
    status: string
    latency: string
    confidence: string
    output: string
  } | null>(null)

  const handleRun = () => {
    soundEngine.playClickSound()
    setIsRunning(true)
    setActiveLogs(['> INITIALIZING SIMULATOR...'])
    setResultData(null)

    const fullResult = config.runSimulation(inputVal || config.presets[0])

    fullResult.logs.forEach((log, index) => {
      setTimeout(() => {
        setActiveLogs(prev => [...prev, `> ${log}`])
      }, (index + 1) * 220)
    })

    setTimeout(() => {
      setIsRunning(false)
      setResultData({
        status: fullResult.status,
        latency: fullResult.latency,
        confidence: fullResult.confidence,
        output: fullResult.output,
      })
    }, (fullResult.logs.length + 1) * 220)
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          onClick={e => e.stopPropagation()}
          className="glass border-glass-border rounded-3xl p-6 md:p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl space-y-6"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-glass-border pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                <Terminal className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h3 className="font-heading text-lg font-bold text-foreground">
                  Interactive Live AI Sandbox: {projectTitle}
                </h3>
                <p className="text-xs text-muted-foreground font-mono">
                  Test simulated engine inputs, execution logs & live benchmarks.
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg glass hover:border-glass-borderHover transition-colors cursor-pointer"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>

          {/* Presets */}
          <div className="space-y-2">
            <span className="text-xs font-mono font-semibold text-cyan-400 uppercase tracking-wider block">
              Sample Input Presets:
            </span>
            <div className="flex flex-wrap gap-2">
              {config.presets.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    soundEngine.playClickSound()
                    setInputVal(preset)
                  }}
                  className={cn(
                    'px-3 py-1.5 rounded-xl text-xs font-mono transition-all border text-left cursor-pointer',
                    inputVal === preset
                      ? 'bg-primary/20 text-cyan-300 border-cyan-400/50 shadow-glow'
                      : 'glass border-glass-border text-muted-foreground hover:text-white'
                  )}
                >
                  Preset 0{idx + 1}
                </button>
              ))}
            </div>
          </div>

          {/* Input Field */}
          <div className="space-y-2">
            <div className="relative">
              <textarea
                value={inputVal}
                onChange={e => setInputVal(e.target.value)}
                placeholder={config.placeholder}
                rows={3}
                className="w-full p-4 rounded-2xl glass border border-glass-border focus:border-cyan-400 focus:outline-none text-xs font-mono text-foreground placeholder:text-muted-foreground/60 transition-colors"
              />
            </div>

            <button
              onClick={handleRun}
              disabled={isRunning}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-primary via-secondary to-accent text-white text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-glow cursor-pointer disabled:opacity-50"
            >
              {isRunning ? (
                <>
                  <Zap className="w-4 h-4 animate-spin text-amber-300" /> Executing Simulation...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" /> Run Live AI Simulation ⚡
                </>
              )}
            </button>
          </div>

          {/* Live Execution Console Terminal */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-cyan-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Terminal className="w-4 h-4" /> Live Terminal Log Output
              </span>
              {resultData && (
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> {resultData.status}
                </span>
              )}
            </div>

            <div className="w-full h-44 rounded-2xl bg-black/90 border border-glass-border p-4 overflow-y-auto font-mono text-[11px] text-cyan-300 space-y-1 shadow-inner">
              {activeLogs.length === 0 && (
                <span className="text-muted-foreground/60">
                  Ready. Select a preset and click "Run Live AI Simulation" to view execution traces.
                </span>
              )}
              {activeLogs.map((log, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="text-cyan-500 font-bold">{log}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Output Results Box */}
          {resultData && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-2xl glass border border-emerald-500/30 bg-emerald-500/10 space-y-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-emerald-500/20 pb-2">
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-mono font-bold text-emerald-300 uppercase">
                    Simulation Output
                  </span>
                </div>
                <div className="flex items-center gap-3 text-[10px] font-mono">
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Latency: {resultData.latency}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Accuracy: {resultData.confidence}
                  </span>
                </div>
              </div>

              <pre className="text-[11px] font-mono text-slate-200 whitespace-pre-wrap overflow-x-auto max-h-48 p-2 rounded-xl bg-black/40 border border-white/10">
                {resultData.output}
              </pre>
            </motion.div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
