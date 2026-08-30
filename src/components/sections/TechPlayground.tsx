'use client'

import { useState } from 'react'
import { Terminal, Copy, Check, Code2, Cpu, Database, ShieldCheck } from 'lucide-react'

interface CodeSample {
  id: string
  title: string
  language: string
  category: string
  icon: any
  filename: string
  code: string
  explanation: string
}

const codeSamples: CodeSample[] = [
  {
    id: 'fastapi',
    title: 'FastAPI Microservice Engine',
    language: 'python',
    category: 'Backend / Security',
    icon: Cpu,
    filename: 'backend/main.py',
    code: `@app.post("/api/contact")
async def handle_contact(submission: ContactSubmission):
    # Honeypot spam defense check
    if submission.honeypot:
        return JSONResponse(status_code=200, content={"status": "rejected"})
        
    # Input validation & DB insertion
    db = get_db_connection()
    cursor = db.cursor()
    cursor.execute(
        "INSERT INTO contact_submissions (name, email, message) VALUES (%s, %s, %s)",
        (submission.name, submission.email, submission.message)
    )
    db.commit()
    
    # Asynchronous HTML Mailer dispatch
    send_email_notification(submission)
    return {"message": "Success", "id": cursor.lastrowid}`,
    explanation: 'Asynchronous Python FastAPI endpoint featuring honeypot spam protection, MySQL insertion, and SMTP HTML email alerts.',
  },
  {
    id: 'ml-pipeline',
    title: 'Multi-Disease ML Classifier',
    language: 'python',
    category: 'AI / Data Science',
    icon: ShieldCheck,
    filename: 'ml/disease_predictor.py',
    code: `from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler

def train_disease_model(X_train, y_train):
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X_train)
    
    model = RandomForestClassifier(n_estimators=100, max_depth=10, random_state=42)
    model.fit(X_scaled, y_train)
    
    return model, scaler`,
    explanation: 'Scikit-learn multi-disease prediction engine with feature scaling and tuned Random Forest classification.',
  },
  {
    id: 'react-ts',
    title: 'Custom Glassmorphism Hook',
    language: 'typescript',
    category: 'Frontend / Modern React',
    icon: Code2,
    filename: 'src/hooks/useScrollProgress.ts',
    code: `import { useState, useEffect } from 'react'

export function useScrollProgress() {
  const [completion, setCompletion] = useState(0)

  useEffect(() => {
    const updateScroll = () => {
      const currentProgress = window.scrollY
      const scrollHeight = document.body.scrollHeight - window.innerHeight
      if (scrollHeight > 0) {
        setCompletion(Number((currentProgress / scrollHeight).toFixed(2)) * 100)
      }
    }
    window.addEventListener('scroll', updateScroll)
    return () => window.removeEventListener('scroll', updateScroll)
  }, [])

  return completion
}`,
    explanation: 'Clean TypeScript custom React hook tracking scroll percentage for smooth UI progress bar animations.',
  },
  {
    id: 'mysql-schema',
    title: 'Relational Database Schema',
    language: 'sql',
    category: 'Database Architecture',
    icon: Database,
    filename: 'database/schema.sql',
    code: `CREATE TABLE IF NOT EXISTS contact_submissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(255),
    message TEXT NOT NULL,
    status ENUM('new', 'read', 'replied') DEFAULT 'new',
    ip_address VARCHAR(45),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`,
    explanation: 'Normalized MySQL schema with index constraints, status enumeration, and audit timestamps.',
  },
]

export default function TechPlayground() {
  const [selectedSample, setSelectedSample] = useState<CodeSample>(codeSamples[0])
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedSample.code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="glass rounded-2xl p-4 sm:p-6 border border-glass-border space-y-4 w-full overflow-hidden">
      {/* HEADER & ACTIONS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="p-2 sm:p-2.5 rounded-xl bg-secondary/10 text-secondary shrink-0">
            <Terminal className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="min-w-0">
            <h4 className="font-heading font-bold text-base sm:text-lg truncate">Code Architecture Playground</h4>
            <p className="text-[11px] sm:text-xs text-muted-foreground truncate">Select a module to inspect Raghul's coding patterns</p>
          </div>
        </div>

        <button
          onClick={handleCopy}
          className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg glass text-xs font-medium hover:bg-white/10 transition-all text-muted-foreground hover:text-foreground shrink-0 cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-green-400" /> Copied
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" /> Copy Snippet
            </>
          )}
        </button>
      </div>

      {/* TABS */}
      <div className="flex flex-wrap gap-1.5 sm:gap-2 pt-1">
        {codeSamples.map((sample) => {
          const Icon = sample.icon
          const isSelected = selectedSample.id === sample.id
          return (
            <button
              key={sample.id}
              onClick={() => setSelectedSample(sample)}
              className={`inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-medium transition-all cursor-pointer ${
                isSelected
                  ? 'bg-primary text-white shadow-glow'
                  : 'glass text-muted-foreground hover:text-foreground hover:bg-white/5'
              }`}
            >
              <Icon className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate max-w-[180px] sm:max-w-none">{sample.title}</span>
            </button>
          )
        })}
      </div>

      {/* IDE TERMINAL VIEW */}
      <div className="rounded-xl overflow-hidden bg-[#06060a] border border-white/10 shadow-2xl min-w-0">
        <div className="px-3 sm:px-4 py-2 sm:py-2.5 bg-white/[0.03] border-b border-white/5 flex items-center justify-between gap-2 min-w-0">
          <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 overflow-hidden">
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-red-500/80 shrink-0" />
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-yellow-500/80 shrink-0" />
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-green-500/80 shrink-0" />
            <span className="ml-1 sm:ml-2 text-[11px] sm:text-xs font-mono text-muted-foreground truncate">{selectedSample.filename}</span>
          </div>
          <span className="text-[9px] sm:text-[10px] uppercase font-mono tracking-widest text-primary px-2 py-0.5 rounded bg-primary/10 shrink-0">
            {selectedSample.language}
          </span>
        </div>

        <div className="p-3 sm:p-4 font-mono text-[11px] sm:text-xs text-slate-300 leading-relaxed overflow-x-auto scrollbar-thin">
          <pre className="inline-block min-w-full">{selectedSample.code}</pre>
        </div>
      </div>

      {/* ARCHITECTURE NOTE */}
      <p className="text-[11px] sm:text-xs text-muted-foreground leading-relaxed bg-white/[0.02] p-2.5 sm:p-3 rounded-xl border border-white/5">
        💡 <strong className="text-foreground font-medium">Architecture Note:</strong> {selectedSample.explanation}
      </p>
    </div>
  )
}
