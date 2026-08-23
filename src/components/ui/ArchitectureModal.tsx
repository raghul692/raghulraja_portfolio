'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, Cpu, Server, Database, Layout, ArrowRight, ShieldCheck, Sparkles, Network } from 'lucide-react'

interface ArchitectureModalProps {
  isOpen: boolean
  onClose: () => void
  projectTitle: string
}

const architectureData: Record<string, {
  tagline: string
  steps: { title: string; desc: string; icon: any; color: string }[]
  techHighlights: string[]
}> = {
  'Multi-Disease Prediction System': {
    tagline: 'End-to-End ML Diagnostic Pipeline (Scikit-Learn + Streamlit)',
    steps: [
      {
        title: '1. User Clinical Inputs',
        desc: 'Patient metrics (glucose, blood pressure, EEG/ECG values) captured via responsive form.',
        icon: Layout,
        color: 'text-blue-400 border-blue-500/30 bg-blue-500/10',
      },
      {
        title: '2. Preprocessing & Scaler',
        desc: 'Feature engineering, handling missing values, and Standard/MinMax scaling.',
        icon: Cpu,
        color: 'text-purple-400 border-purple-500/30 bg-purple-500/10',
      },
      {
        title: '3. ML Prediction Engine',
        desc: 'Trained Support Vector Machine (SVM) & Random Forest classifiers evaluate multi-disease risk.',
        icon: Network,
        color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
      },
      {
        title: '4. Model Persistence & Output',
        desc: 'Serialized .pkl models render risk percentage and clinical advice on Streamlit dashboard.',
        icon: Database,
        color: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
      },
    ],
    techHighlights: [
      'Scikit-Learn Machine Learning Models',
      '5 Medical Modules (Diabetes, Heart, Parkinson\'s, Liver, Kidney)',
      'Joblib Model Serialization',
      'Streamlit Custom Responsive GUI',
      'Supervised Classification Algorithms',
    ],
  },
  'JARVIS AI Assistant': {
    tagline: 'Multi-Modal Voice Processing & Conversational Engine (Speech ➔ LLM ➔ Neural TTS)',
    steps: [
      {
        title: '1. Voice Input & Wake Word',
        desc: 'Captures microphone stream & detects "JARVIS" wake word via SpeechRecognition.',
        icon: Layout,
        color: 'text-blue-400 border-blue-500/30 bg-blue-500/10',
      },
      {
        title: '2. Speech-To-Text Engine',
        desc: 'Transcribes audio using OpenAI Whisper, Google Speech API, or Sphinx speech models.',
        icon: Cpu,
        color: 'text-purple-400 border-purple-500/30 bg-purple-500/10',
      },
      {
        title: '3. AI Reasoning & APIs',
        desc: 'GPT-4 handles dialogue while Wolfram Alpha & OpenWeather resolve factual queries.',
        icon: Network,
        color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
      },
      {
        title: '4. Neural TTS Synthesis',
        desc: 'Synthesizes natural voice audio via Microsoft Edge Neural TTS & executes system controls.',
        icon: Database,
        color: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
      },
    ],
    techHighlights: [
      'Multi-Engine Speech Recognition (Whisper / Google)',
      'Microsoft Edge Neural Voice Synthesis (TTS)',
      'OpenAI GPT-4 Conversational Intelligence',
      'Wolfram Alpha & OpenWeather APIs Integration',
      'OS Telemetry & System Monitoring (psutil)',
    ],
  },
  'XSS Finder — Security Scanner': {
    tagline: 'Automated Vulnerability Crawling, Payload Injection & Context Detector Engine',
    steps: [
      {
        title: '1. Reconnaissance Crawler',
        desc: 'Recursively visits target domain links, harvesting URL parameters & HTML forms.',
        icon: Layout,
        color: 'text-blue-400 border-blue-500/30 bg-blue-500/10',
      },
      {
        title: '2. Payload Injector',
        desc: 'Fires multithreaded GET/POST requests with basic, polyglot, & WAF-bypass payloads.',
        icon: Cpu,
        color: 'text-purple-400 border-purple-500/30 bg-purple-500/10',
      },
      {
        title: '3. Reflection & Context Detector',
        desc: 'Verifies unescaped reflection context (script/attribute/DOM) & confidence level.',
        icon: Network,
        color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
      },
      {
        title: '4. Vulnerability Reporter',
        desc: 'Filters false positives and exports formatted JSON & TXT vulnerability audits.',
        icon: Database,
        color: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
      },
    ],
    techHighlights: [
      'Recursive Target Crawler & Form Extractor',
      'Multi-Category Polyglot & WAF-Bypass Library',
      'Context-Aware Reflection & Encoding Verifier',
      'False Positive Reduction Analyzer',
      'Multithreaded Execution & JSON/TXT Exporters',
    ],
  },
  'Expense Tracker System — AI Platform': {
    tagline: 'AI-Powered Financial Analytics Engine, Relational State & Multi-Model Gemini Integration',
    steps: [
      {
        title: '1. Relational Ledger Engine',
        desc: 'Manages income/expense ledgers, subscriptions, and savings vaults with cascading category integrity.',
        icon: Layout,
        color: 'text-blue-400 border-blue-500/30 bg-blue-500/10',
      },
      {
        title: '2. Simulated Receipt OCR',
        desc: 'Extracts merchant, total amount, date, and taxonomy category from image/PDF receipts.',
        icon: Cpu,
        color: 'text-purple-400 border-purple-500/30 bg-purple-500/10',
      },
      {
        title: '3. Google Gemini AI Advisor',
        desc: 'Injects live account context into LLM prompt with fallback to built-in local smart analytical engine.',
        icon: Network,
        color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
      },
      {
        title: '4. Recharts & Statement Exporter',
        desc: 'Renders dynamic cash flow area charts, category heatmaps, and exports CSV/PDF financial audits.',
        icon: Database,
        color: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
      },
    ],
    techHighlights: [
      'React 19 & TypeScript 5.6 Domain Architecture',
      'Google Gemini API Multi-Model Fallback Engine',
      'Cascading Relational Category & Ledger Integrity',
      'Recharts Interactive Cash-Flow & Category Heatmaps',
      'Simulated Receipt OCR & CSV/PDF Statement Exports',
    ],
  },
  'Healthcare Management System (HMS)': {
    tagline: 'Multi-Role RBAC Security Architecture, Live Queue Controller & Automated Mock Fallback Layer',
    steps: [
      {
        title: '1. Role-Based Access Control (RBAC)',
        desc: 'Protects feature routes dynamically for Patient, Doctor, Admin, Pharmacy, & Lab roles via RoleGuard middleware.',
        icon: Layout,
        color: 'text-blue-400 border-blue-500/30 bg-blue-500/10',
      },
      {
        title: '2. Clinical Queue & EHR Manager',
        desc: 'Manages live token queues, appointment scheduling, electronic health records timeline, & digital prescriptions.',
        icon: Cpu,
        color: 'text-purple-400 border-purple-500/30 bg-purple-500/10',
      },
      {
        title: '3. Pharmacy & Billing Workflow Engine',
        desc: 'Tracks medicine stock inventory, lab test requests, & generates itemized invoices with payment status alerts.',
        icon: Network,
        color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
      },
      {
        title: '4. Standalone Offline Mock Fallback Layer',
        desc: 'Interceptors intercept failed API calls to seamlessly fall back to local mock services with Zustand persistence.',
        icon: Database,
        color: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
      },
    ],
    techHighlights: [
      'React 19 & TypeScript Enterprise Architecture',
      'Zustand Global State Management with LocalStorage Persistence',
      'Role-Based Access Control (RBAC) & Custom Route Guards',
      'Automated Standalone Mock API Fallback & Demo Credentials',
      'TanStack React Query & Custom Axios JWT Interceptors',
    ],
  },
  'Aether — Atmospheric Intelligence Platform': {
    tagline: 'Open-Meteo REST Telemetry, HTML5 Doppler Radar Canvas & AI Co-Pilot Engine',
    steps: [
      {
        title: '1. Open-Meteo REST Telemetry Ingestion',
        desc: 'Fetches real-time surface station data (AQI, Wind Vectors, UV Index, Solar Arc) with synthetic fallback.',
        icon: Layout,
        color: 'text-blue-400 border-blue-500/30 bg-blue-500/10',
      },
      {
        title: '2. HTML5 Canvas Doppler Radar Visualizer',
        desc: 'Animates reflectivity dBZ radar sweeps, particle stream vectors, & thermal heatmaps on Canvas 2D.',
        icon: Cpu,
        color: 'text-purple-400 border-purple-500/30 bg-purple-500/10',
      },
      {
        title: '3. Multi-City Telemetry Comparison Matrix',
        desc: 'Synchronizes live weather metrics across global locations in a side-by-side comparative grid.',
        icon: Network,
        color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
      },
      {
        title: '4. AI Atmospheric Co-Pilot & Web Audio FX',
        desc: 'Parses active telemetry to provide conversational travel/outfit advice with procedural audio feedback.',
        icon: Database,
        color: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
      },
    ],
    techHighlights: [
      'React 19 & Tailwind CSS v4 Atmospheric Sophistication Design System',
      'Open-Meteo REST API Real-Time Surface Telemetry Ingestion',
      'HTML5 Canvas 2D Animated Doppler Radar Sweep Visualizer',
      'Multi-City Side-by-Side Synchronized Telemetry Matrix',
      'AI Atmospheric Co-Pilot Assistant & Web Audio API Engine',
    ],
  },
  'Aetheris — Multimodal AI ChatBot': {
    tagline: 'Google Gemini LLM Engine, Word-by-Word Stream Synthesis & Artifact Workspace',
    steps: [
      {
        title: '1. User Prompt & Persona Context Builder',
        desc: 'Constructs multi-turn conversational payloads with active system persona instructions & history window.',
        icon: Layout,
        color: 'text-blue-400 border-blue-500/30 bg-blue-500/10',
      },
      {
        title: '2. Gemini LLM & Real-Time Token Streaming',
        desc: 'Connects to Google Gemini REST API with simulated word-by-word streaming animation & local engine fallback.',
        icon: Cpu,
        color: 'text-purple-400 border-purple-500/30 bg-purple-500/10',
      },
      {
        title: '3. Markdown Parser & Code Syntax Exporter',
        desc: 'Renders GFM markdown with syntax-highlighted code blocks, copy actions, & HTML/CSS sandbox previews.',
        icon: Network,
        color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
      },
      {
        title: '4. Persistent Workspace & Web Audio FX Engine',
        desc: 'Saves conversation logs locally while driving Web Audio API audio feedback micro-interactions.',
        icon: Database,
        color: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
      },
    ],
    techHighlights: [
      'React 19 & TypeScript Glassmorphic Workspace Architecture',
      'Google Gemini API Integration with Local Smart Engine Fallback',
      'Real-Time Word-by-Word Response Streaming Animation',
      'GFM Markdown Renderer with Syntax Highlighting & Code Copying',
      'Web Audio API Sound Engine & Contextual Persona Manager',
    ],
  },
  'QRMaster Pro — Enterprise QR Platform': {
    tagline: 'Dynamic Short-Code Redirection, Scan Analytics & Printable A4 PDF Exporter Engine',
    steps: [
      {
        title: '1. Dynamic Short-Code Router',
        desc: 'Processes incoming short URLs (/r/{code}), checks password hashes, & verifies expiration datetimes.',
        icon: Layout,
        color: 'text-blue-400 border-blue-500/30 bg-blue-500/10',
      },
      {
        title: '2. Real-Time Scan Analytics Engine',
        desc: 'Parses User-Agents, logs IP addresses, tracks device types, & computes scan velocity metrics.',
        icon: Cpu,
        color: 'text-purple-400 border-purple-500/30 bg-purple-500/10',
      },
      {
        title: '3. Developer REST API & Auth Keys',
        desc: 'Authenticates requests via X-API-Key (qrm_live_...) with SHA-256 secret hashing & key revocation.',
        icon: Network,
        color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
      },
      {
        title: '4. Printable A4 PDF Sticker Exporter',
        desc: 'Leverages ReportLab to synthesize 3x7 high-DPI vector QR sticker grid PDFs for industrial labeling.',
        icon: Database,
        color: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
      },
    ],
    techHighlights: [
      'FastAPI Clean Architecture & SQLAlchemy 2.0 ORM',
      'Dynamic Short-URL Redirection with Password Hashing',
      'ReportLab A4 Grid PDF Sticker Exporter (21 QRs/Sheet)',
      'Developer REST API Keys (qrm_live_...) & SHA-256 Auth',
      'Computer Vision Scanner Engine (pyzbar + OpenCV)',
    ],
  },
  'AuthPro — Authentication System': {
    tagline: 'Client-Side Auth Lifecycle, Glassmorphism UI & Security State Persistence Engine',
    steps: [
      {
        title: '1. Registration & Validation Engine',
        desc: 'Validates inputs real-time, measures password strength entropy, & generates user credential records.',
        icon: Layout,
        color: 'text-blue-400 border-blue-500/30 bg-blue-500/10',
      },
      {
        title: '2. Login & Attempt Tracker',
        desc: 'Tracks login attempts, triggers account lock upon thresholds, & verifies 2FA OTP codes.',
        icon: Cpu,
        color: 'text-purple-400 border-purple-500/30 bg-purple-500/10',
      },
      {
        title: '3. Session & Theme Persistence',
        desc: 'Stores encrypted session tokens in LocalStorage with automatic dark/light mode state restoration.',
        icon: Network,
        color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
      },
      {
        title: '4. Executive Dashboard & Settings',
        desc: 'Renders login analytics timeline, Ctrl+K command palette, profile photo avatar, & security settings.',
        icon: Database,
        color: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
      },
    ],
    techHighlights: [
      'Client-Side Auth Lifecycle & Glassmorphism Design System',
      'Real-Time Form Validation & Password Strength Entropy',
      'Account Lock Simulation & OTP Password Reset Flow',
      'Interactive Admin Analytics Dashboard & Security Metrics',
      'Ctrl+K Command Palette & Theme Persistence Layer',
    ],
  },
  'TaskFlow Pro — Task & Productivity Suite': {
    tagline: 'Multi-Layout Productivity Engine, Glassmorphism Theme System & Offline PWA Sync',
    steps: [
      {
        title: '1. Multi-View Rendering Engine',
        desc: 'Renders tasks seamlessly across List, Kanban drag-and-drop board, Monthly Calendar, & Grid layouts.',
        icon: Layout,
        color: 'text-blue-400 border-blue-500/30 bg-blue-500/10',
      },
      {
        title: '2. RESTful API & LocalStorage Fallback',
        desc: 'Interacts with mock JSON Server endpoints with automatic offline LocalStorage synchronization.',
        icon: Cpu,
        color: 'text-purple-400 border-purple-500/30 bg-purple-500/10',
      },
      {
        title: '3. Glassmorphism CSS Theme System',
        desc: 'Provides 7 custom visual themes (Ocean, Midnight, Forest, Sunset, etc.) via dynamic CSS variables.',
        icon: Network,
        color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
      },
      {
        title: '4. Analytics & Data Exporter',
        desc: 'Computes productivity velocity scores, weekly completion trends, & exports CSV/JSON reports.',
        icon: Database,
        color: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
      },
    ],
    techHighlights: [
      'Multi-View Architecture (List, Kanban Board, Calendar, Grid)',
      '7+ Professional Glassmorphism Themes via CSS Variables',
      'JSON Server REST API + Offline LocalStorage Fallback',
      'Progressive Web App (PWA) Service Worker Caching',
      'Ctrl+K Command Palette & CSV/JSON Data Exporters',
    ],
  },
  'Wolf2X Finder — Cybersecurity Scanner API': {
    tagline: 'Team Security Scanner Engine, REST API Audit Router & Multi-Format Exporters',
    steps: [
      {
        title: '1. REST API & Scan Request Router',
        desc: 'Processes scan commands via CLI/API, parses target URLs, & configures test payload routines.',
        icon: Layout,
        color: 'text-blue-400 border-blue-500/30 bg-blue-500/10',
      },
      {
        title: '2. Multi-Threaded Target Crawler',
        desc: 'Discovers links, HTML forms, parameters, & headers using high-concurrency threading.',
        icon: Cpu,
        color: 'text-purple-400 border-purple-500/30 bg-purple-500/10',
      },
      {
        title: '3. Vulnerability & Payload Audit Engine',
        desc: 'Injects context-aware payloads (XSS, SQLi, CSRF, Header analysis) with reflection validation.',
        icon: Network,
        color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
      },
      {
        title: '4. Multi-Format Report Synthesizer',
        desc: 'Compiles scan findings into executive audit reports in PDF, HTML, CSV, and JSON formats.',
        icon: Database,
        color: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
      },
    ],
    techHighlights: [
      'Python Security Engine & REST API Integration Architecture',
      'Multi-Threaded Target Crawling & Form Parameter Extraction',
      'Context-Aware Vulnerability Auditing (XSS, SQLi, CSRF, Headers)',
      'Multi-Format Audit Exporters (PDF, HTML, CSV, JSON)',
      'Ethical Penetration Testing & CI/CD Pipeline Compatible',
    ],
  },
  'Password Generator Pro': {
    tagline: 'Client-Side Cryptographic Password Synthesis & Entropy Scoring',
    steps: [
      {
        title: '1. User Constraints',
        desc: 'Configures desired password length, character sets (alpha, numeric, symbols), and exclusions.',
        icon: Layout,
        color: 'text-blue-400 border-blue-500/30 bg-blue-500/10',
      },
      {
        title: '2. Cryptographic Generator',
        desc: 'Uses crypto.getRandomValues API to generate unbiased, highly entropy-secure character arrays.',
        icon: Cpu,
        color: 'text-purple-400 border-purple-500/30 bg-purple-500/10',
      },
      {
        title: '3. Strength Evaluation',
        desc: 'Evaluates bit-entropy, pattern repetition, and dictionary heuristics to compute strength score.',
        icon: Network,
        color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
      },
      {
        title: '4. Clipboard API',
        desc: 'Renders glassmorphism visual feedback and writes output to navigator.clipboard API.',
        icon: Database,
        color: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
      },
    ],
    techHighlights: [
      'React & TypeScript Type-Safe Architecture',
      'Web Crypto API Cryptographic Entropy',
      'Real-Time Bit-Entropy & Pattern Strength Scorer',
      'Navigator Clipboard API Integration',
      'Framer Motion Micro-Animations',
    ],
  },
  'Blogify': {
    tagline: 'Modular Frontend Application (CRUD Operations + LocalStorage Persistence)',
    steps: [
      {
        title: '1. Post Creator & Form',
        desc: 'Interactive rich text creation form with category selection and validation.',
        icon: Layout,
        color: 'text-blue-400 border-blue-500/30 bg-blue-500/10',
      },
      {
        title: '2. State Manager',
        desc: 'Real-time post list state updates, search query filtering, and category sorting.',
        icon: Cpu,
        color: 'text-purple-400 border-purple-500/30 bg-purple-500/10',
      },
      {
        title: '3. LocalStorage Layer',
        desc: 'Serializes blog post objects into JSON for browser client persistence.',
        icon: Database,
        color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
      },
      {
        title: '4. Masonry UI Grid',
        desc: 'Renders dynamic, responsive blog post cards with read time & action options.',
        icon: Network,
        color: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
      },
    ],
    techHighlights: [
      'Vanilla Web Tech (HTML5, CSS3, JavaScript ES6+)',
      'Client-Side CRUD State Architecture',
      'Browser LocalStorage Persistence',
      'Responsive Mobile-First Masonry Layout',
    ],
  },
  'Default': {
    tagline: 'Modern Full-Stack Architecture (Client <-> API <-> Database)',
    steps: [
      {
        title: '1. Frontend Client Layer',
        desc: 'React.js with TypeScript and Framer Motion for responsive, interactive user experiences.',
        icon: Layout,
        color: 'text-blue-400 border-blue-500/30 bg-blue-500/10',
      },
      {
        title: '2. API Gateway & Middleware',
        desc: 'FastAPI / Express.js RESTful API endpoints handling authentication and rate limiting.',
        icon: Server,
        color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
      },
      {
        title: '3. Processing & Analytics',
        desc: 'Data normalization, caching, and business logic execution.',
        icon: Cpu,
        color: 'text-purple-400 border-purple-500/30 bg-purple-500/10',
      },
      {
        title: '4. Database & Storage',
        desc: 'SQL database schemas and cloud asset storage for persistent state.',
        icon: Database,
        color: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
      },
    ],
    techHighlights: [
      'React & Next.js Architecture',
      'Node.js & FastAPI Microservices',
      'Relational SQL Database Schemas',
      'JWT Authentication & Security',
    ],
  },
}

export function ArchitectureModal({ isOpen, onClose, projectTitle }: ArchitectureModalProps) {
  if (!isOpen) return null

  const data = architectureData[projectTitle] || architectureData['Default']

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-black/80 backdrop-blur-md"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-4xl bg-surface-dark border border-glass-border rounded-2xl shadow-2xl overflow-hidden flex flex-col p-6 md:p-8"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-glass-border pb-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20">
                <Network className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-heading text-xl font-bold text-foreground">
                  System Architecture Flowchart
                </h3>
                <p className="text-xs text-secondary font-medium">{projectTitle}</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-lg glass glass-hover text-muted-foreground hover:text-foreground"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Subtitle */}
          <p className="text-xs text-muted-foreground mb-6 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-accent" /> {data.tagline}
          </p>

          {/* Flowchart Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative mb-8">
            {data.steps.map((step, idx) => {
              const StepIcon = step.icon
              return (
                <div key={idx} className="relative flex flex-col justify-between">
                  <div className={`p-4 rounded-xl border ${step.color} flex flex-col h-full space-y-3`}>
                    <div className="flex items-center justify-between">
                      <StepIcon className="w-5 h-5" />
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-black/40 text-muted-foreground">
                        Step 0{idx + 1}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-heading text-sm font-bold text-foreground mb-1">
                        {step.title}
                      </h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {step.desc}
                      </p>
                    </div>
                  </div>

                  {idx < data.steps.length - 1 && (
                    <div className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 p-1 rounded-full bg-surface-dark border border-glass-border text-muted-foreground">
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Tech Highlights */}
          <div className="pt-4 border-t border-glass-border">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> Architectural Highlights
            </h4>
            <div className="flex flex-wrap gap-2">
              {data.techHighlights.map((tech, tIdx) => (
                <span
                  key={tIdx}
                  className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-xs text-foreground font-medium"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
