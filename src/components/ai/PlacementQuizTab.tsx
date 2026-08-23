import { useState, useEffect } from 'react'
import { CheckCircle2, XCircle, RotateCcw, Timer, Award, Sparkles, Trophy, FileCheck, ArrowRight, ArrowLeft, Layers, Sliders } from 'lucide-react'
import { PLACEMENT_QUIZ_DATA, MCQQuestion } from '../../data/placementQuizData'

export default function PlacementQuizTab() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [selectedDifficulty, setSelectedDifficulty] = useState<'All' | 'Easy' | 'Medium' | 'Hard'>('All')
  const [batchSize, setBatchSize] = useState<number>(5) // 5 or 10 questions per set
  const [currentSetIndex, setCurrentSetIndex] = useState<number>(0)
  const [currentIdx, setCurrentIdx] = useState<number>(0) // index within the active set
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({})
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false)
  const [timeLeft, setTimeLeft] = useState<number>(300) // 5 mins per set
  const [timerActive, setTimerActive] = useState<boolean>(true)
  const [candidateName, setCandidateName] = useState<string>('Raghul Raja M')
  const [jumpInput, setJumpInput] = useState<string>('')

  // 1. Filter overall question pool by Category and Difficulty
  const filteredQuestions = PLACEMENT_QUIZ_DATA.filter(q => {
    const matchCategory = selectedCategory === 'All' || q.category === selectedCategory
    const matchDifficulty = selectedDifficulty === 'All' || q.difficulty === selectedDifficulty
    return matchCategory && matchDifficulty
  })

  // 2. Slice questions into active set (batch of 5 or 10)
  const totalSets = Math.max(1, Math.ceil(filteredQuestions.length / batchSize))
  const currentSetQuestions = filteredQuestions.slice(
    currentSetIndex * batchSize,
    (currentSetIndex + 1) * batchSize
  )
  const currentQuestion: MCQQuestion = currentSetQuestions[currentIdx] || currentSetQuestions[0]

  // Reset timer on set change or reset
  useEffect(() => {
    setTimeLeft(batchSize === 5 ? 300 : 600) // 5 min for 5 Qs, 10 min for 10 Qs
    setTimerActive(true)
    setIsSubmitted(false)
    setCurrentIdx(0)
  }, [currentSetIndex, batchSize, selectedCategory, selectedDifficulty])

  useEffect(() => {
    let interval: any = null
    if (timerActive && timeLeft > 0 && !isSubmitted) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1)
      }, 1000)
    } else if (timeLeft === 0 && !isSubmitted) {
      setIsSubmitted(true)
      setTimerActive(false)
    }
    return () => clearInterval(interval)
  }, [timerActive, timeLeft, isSubmitted])

  const handleSelectOption = (optIdx: number) => {
    if (isSubmitted || !currentQuestion) return
    setUserAnswers(prev => ({ ...prev, [currentQuestion.id]: optIdx }))
  }

  const handleResetQuiz = () => {
    setCurrentSetIndex(0)
    setCurrentIdx(0)
    setUserAnswers({})
    setIsSubmitted(false)
    setTimeLeft(batchSize === 5 ? 300 : 600)
    setTimerActive(true)
    setJumpInput('')
  }

  const handleNextSet = () => {
    if (currentSetIndex < totalSets - 1) {
      setCurrentSetIndex(prev => prev + 1)
      setCurrentIdx(0)
      setIsSubmitted(false)
      setTimerActive(true)
      setTimeLeft(batchSize === 5 ? 300 : 600)
    } else {
      handleResetQuiz()
    }
  }

  const handleJumpToSet = (e: React.FormEvent) => {
    e.preventDefault()
    const targetSet = parseInt(jumpInput)
    if (!isNaN(targetSet) && targetSet >= 1 && targetSet <= totalSets) {
      setCurrentSetIndex(targetSet - 1)
      setCurrentIdx(0)
      setIsSubmitted(false)
    }
  }

  // Calculate score for active set
  let correctCount = 0
  currentSetQuestions.forEach(q => {
    if (userAnswers[q.id] === q.correctOptionIndex) {
      correctCount++
    }
  })
  const percentage = Math.round((correctCount / Math.max(1, currentSetQuestions.length)) * 100) || 0

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60)
    const s = secs % 60
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  const handlePrintCertificate = () => {
    const printWindow = window.open('', '_blank')
    if (!printWindow) return

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Placement Certificate - ${candidateName}</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            @media print {
              body { background: white !important; padding: 0 !important; }
            }
          </style>
        </head>
        <body class="bg-slate-900 min-h-screen flex items-center justify-center p-8 text-white font-serif">
          <div class="w-full max-w-3xl bg-slate-950 border-4 border-amber-500/60 p-10 rounded-3xl text-center space-y-6 shadow-2xl relative">
            <div class="text-xs uppercase tracking-widest text-amber-400 font-sans font-bold">Official Technical Placement Assessment</div>
            <h1 class="text-3xl font-extrabold text-white uppercase tracking-wider">Certificate of Completion</h1>
            <p class="text-slate-300 text-sm italic">This is to certify that</p>
            <div class="text-3xl font-bold text-cyan-400 font-sans tracking-wide underline decoration-amber-500">${candidateName}</div>
            <p class="text-slate-300 text-sm max-w-xl mx-auto font-sans leading-relaxed">
              has successfully completed Placement Exam Set #${currentSetIndex + 1} (${selectedDifficulty} Mode) with an overall score of:
            </p>
            <div class="text-4xl font-black text-amber-400 font-mono">${percentage}% SCORE</div>
            <div class="flex justify-between items-center pt-8 border-t border-slate-800 text-xs font-sans text-slate-400">
              <div>Issued by: <strong>Portfolio AI Platform</strong></div>
              <div>Date: <strong>${new Date().toLocaleDateString()}</strong></div>
              <div>Verification ID: <strong class="font-mono text-cyan-400">AI-EXAM-${Math.floor(100000 + Math.random() * 900000)}</strong></div>
            </div>
          </div>
          <script>
            setTimeout(() => {
              window.print();
              window.close();
            }, 600);
          </script>
        </body>
      </html>
    `)
    printWindow.document.close()
  }

  const categoryCounts = {
    All: PLACEMENT_QUIZ_DATA.length,
    Aptitude: PLACEMENT_QUIZ_DATA.filter(q => q.category === 'Aptitude').length,
    Logical: PLACEMENT_QUIZ_DATA.filter(q => q.category === 'Logical').length,
    Verbal: PLACEMENT_QUIZ_DATA.filter(q => q.category === 'Verbal').length,
    DSA: PLACEMENT_QUIZ_DATA.filter(q => q.category === 'DSA').length,
    'Python & ML': PLACEMENT_QUIZ_DATA.filter(q => q.category === 'Python & ML').length,
    'Web & React': PLACEMENT_QUIZ_DATA.filter(q => q.category === 'Web & React').length
  }

  return (
    <div className="flex flex-col h-[560px] bg-surface-darker/70 rounded-xl border border-white/10 p-4 font-sans text-sm overflow-hidden space-y-3">
      {/* HEADER BAR */}
      <div className="flex flex-wrap items-center justify-between p-3 rounded-xl bg-gradient-to-r from-cyan-500/10 via-primary/10 to-indigo-500/10 border border-cyan-400/20 gap-2">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-400" />
          <div>
            <h3 className="font-bold text-white text-xs flex items-center gap-2">
              Adaptive Tech Placement Exam & Aptitude Suite
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 font-mono font-bold border border-amber-400/30">
                500 Questions Bank
              </span>
            </h3>
            <p className="text-[11px] text-foreground/70">
              Practice in Sets of 5 or 10 Questions with Easy, Medium & Hard Levels.
            </p>
          </div>
        </div>

        {/* TIMER & SET JUMP BAR */}
        <div className="flex items-center gap-2">
          <form onSubmit={handleJumpToSet} className="flex items-center gap-1">
            <span className="text-[10px] text-foreground/70 font-mono">Set #:</span>
            <input
              type="number"
              min={1}
              max={totalSets}
              value={jumpInput}
              onChange={e => setJumpInput(e.target.value)}
              placeholder={`${currentSetIndex + 1}`}
              className="w-12 px-1.5 py-0.5 rounded-lg bg-black/60 border border-white/10 text-cyan-300 text-xs font-mono text-center focus:outline-none focus:border-cyan-400"
            />
            <button
              type="submit"
              className="px-2 py-0.5 rounded-lg bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-[10px] font-mono hover:bg-cyan-500/40 cursor-pointer"
            >
              Go
            </button>
          </form>

          <div className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border text-xs font-mono font-bold ${
            timeLeft < 60 ? 'bg-rose-500/20 border-rose-500/40 text-rose-300 animate-pulse' : 'bg-black/40 border-white/10 text-cyan-300'
          }`}>
            <Timer className="w-3.5 h-3.5" />
            <span>{formatTime(timeLeft)}</span>
          </div>
        </div>
      </div>

      {/* FILTER & LEVEL CONTROLS */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-2 bg-black/40 rounded-xl border border-white/5 text-xs">
        {/* DIFFICULTY SELECTOR */}
        <div className="flex items-center gap-1">
          <Sliders className="w-3.5 h-3.5 text-cyan-400 mr-1" />
          <span className="text-[11px] text-foreground/70 font-semibold">Level:</span>
          {(['All', 'Easy', 'Medium', 'Hard'] as const).map(diff => (
            <button
              key={diff}
              onClick={() => {
                setSelectedDifficulty(diff)
                setCurrentSetIndex(0)
              }}
              className={`px-2 py-0.5 rounded-md text-[11px] font-medium cursor-pointer transition-all ${
                selectedDifficulty === diff
                  ? diff === 'Easy' ? 'bg-emerald-500 text-black font-bold'
                    : diff === 'Medium' ? 'bg-amber-500 text-black font-bold'
                    : diff === 'Hard' ? 'bg-rose-500 text-white font-bold'
                    : 'bg-primary text-black font-bold'
                  : 'bg-white/5 text-foreground/70 hover:bg-white/10'
              }`}
            >
              {diff}
            </button>
          ))}
        </div>

        {/* QUESTIONS PER SET SELECTOR (5 or 10) */}
        <div className="flex items-center gap-1">
          <Layers className="w-3.5 h-3.5 text-amber-400 mr-1" />
          <span className="text-[11px] text-foreground/70 font-semibold">Set Size:</span>
          {[5, 10].map(size => (
            <button
              key={size}
              onClick={() => {
                setBatchSize(size)
                setCurrentSetIndex(0)
              }}
              className={`px-2 py-0.5 rounded-md text-[11px] font-mono cursor-pointer transition-all ${
                batchSize === size
                  ? 'bg-cyan-400 text-black font-bold'
                  : 'bg-white/5 text-foreground/70 hover:bg-white/10'
              }`}
            >
              {size} Qs
            </button>
          ))}
        </div>

        {/* RESET */}
        <button
          onClick={handleResetQuiz}
          className="px-2.5 py-0.5 rounded-lg bg-white/5 border border-white/10 text-foreground/70 hover:text-white flex items-center gap-1 text-[10px] cursor-pointer"
        >
          <RotateCcw className="w-3 h-3" /> Reset
        </button>
      </div>

      {/* CATEGORY SELECTOR BAR */}
      <div className="flex gap-1 overflow-x-auto pb-1 text-xs">
        {Object.entries(categoryCounts).map(([cat, count]) => (
          <button
            key={cat}
            onClick={() => {
              setSelectedCategory(cat)
              setCurrentSetIndex(0)
            }}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap cursor-pointer transition-all flex items-center gap-1 ${
              selectedCategory === cat
                ? 'bg-primary/20 border-primary text-primary font-bold'
                : 'bg-white/5 border border-white/10 text-foreground/70 hover:bg-white/10'
            }`}
          >
            <span>{cat}</span>
            <span className={`text-[9px] px-1 rounded-full ${selectedCategory === cat ? 'bg-primary text-black font-bold' : 'bg-white/10 text-foreground/60'}`}>
              {count}
            </span>
          </button>
        ))}
      </div>

      {/* PROGRESS TRACKER FOR SET */}
      <div className="flex items-center justify-between text-[11px] text-foreground/70 font-mono px-1">
        <span>
          Set <strong className="text-cyan-300">{currentSetIndex + 1}</strong> of <strong className="text-white">{totalSets}</strong> ({filteredQuestions.length} Total Questions Available)
        </span>
        <span>
          Question <strong className="text-primary">{currentIdx + 1}</strong> of <strong className="text-white">{currentSetQuestions.length}</strong> in this Set
        </span>
      </div>

      <div className="w-full bg-black/40 h-1.5 rounded-full overflow-hidden border border-white/5">
        <div
          className="bg-gradient-to-r from-cyan-400 to-primary h-full transition-all duration-300"
          style={{ width: `${((currentIdx + 1) / Math.max(1, currentSetQuestions.length)) * 100}%` }}
        />
      </div>

      {/* QUESTION CARD VIEW */}
      {currentQuestion && !isSubmitted && (
        <div className="flex-1 flex flex-col justify-between p-4 bg-black/60 rounded-xl border border-white/10 space-y-3 overflow-y-auto">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-mono text-cyan-400 font-bold">
                Question {currentIdx + 1} / {currentSetQuestions.length} (Q#{currentQuestion.id})
              </span>
              <div className="flex gap-2">
                <span className="px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20 text-[10px] font-mono font-bold">
                  {currentQuestion.category}
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                  currentQuestion.difficulty === 'Easy' ? 'bg-emerald-500/20 text-emerald-300' : currentQuestion.difficulty === 'Medium' ? 'bg-amber-500/20 text-amber-300' : 'bg-rose-500/20 text-rose-300'
                }`}>
                  {currentQuestion.difficulty}
                </span>
              </div>
            </div>

            <h4 className="text-sm font-bold text-white leading-relaxed pt-1">
              {currentQuestion.question}
            </h4>
          </div>

          {/* OPTIONS (A, B, C, D) */}
          <div className="grid grid-cols-1 gap-2">
            {currentQuestion.options.map((opt, optIdx) => {
              const isSelected = userAnswers[currentQuestion.id] === optIdx
              return (
                <button
                  key={optIdx}
                  onClick={() => handleSelectOption(optIdx)}
                  className={`p-3 rounded-xl border text-left text-xs font-sans transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-primary/20 border-primary text-white font-semibold shadow-md'
                      : 'bg-white/5 border-white/10 text-foreground/80 hover:bg-white/10'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className={`w-6 h-6 rounded-lg flex items-center justify-center font-mono font-bold text-[11px] ${
                      isSelected ? 'bg-primary text-black' : 'bg-white/10 text-foreground/70'
                    }`}>
                      {['A', 'B', 'C', 'D'][optIdx]}
                    </span>
                    {opt}
                  </span>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-primary" />}
                </button>
              )
            })}
          </div>

          {/* NAVIGATION BUTTONS FOR SET */}
          <div className="flex justify-between items-center pt-2 border-t border-white/10">
            <button
              onClick={() => setCurrentIdx(prev => Math.max(0, prev - 1))}
              disabled={currentIdx === 0}
              className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-foreground/70 hover:bg-white/10 text-xs disabled:opacity-30 cursor-pointer flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Previous
            </button>

            {currentIdx < currentSetQuestions.length - 1 ? (
              <button
                onClick={() => setCurrentIdx(prev => Math.min(currentSetQuestions.length - 1, prev + 1))}
                className="px-4 py-1.5 rounded-lg bg-primary text-black font-bold text-xs hover:bg-primary-light transition-all cursor-pointer flex items-center gap-1"
              >
                Next Q &rarr;
              </button>
            ) : (
              <button
                onClick={() => {
                  setIsSubmitted(true)
                  setTimerActive(false)
                }}
                className="px-5 py-1.5 rounded-lg bg-emerald-400 text-black font-bold text-xs hover:bg-emerald-300 transition-all cursor-pointer shadow-lg flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" /> Submit Set ({currentSetQuestions.length} Qs)
              </button>
            )}
          </div>
        </div>
      )}

      {/* SET SUBMITTED RESULTS & NEXT SET ACTION */}
      {isSubmitted && (
        <div className="flex-1 p-4 bg-black/80 rounded-xl border border-white/10 overflow-y-auto space-y-4 text-xs">
          <div className="p-4 rounded-xl bg-gradient-to-r from-primary/20 via-cyan-500/20 to-purple-500/20 border border-primary/30 text-center space-y-3">
            <Award className="w-8 h-8 text-amber-400 mx-auto animate-bounce" />
            <h4 className="text-base font-bold text-white">
              Set #{currentSetIndex + 1} Completed! ({batchSize} Questions)
            </h4>
            <div className="flex justify-center items-center gap-4">
              <div className="text-2xl font-black text-primary font-mono">{percentage}% SCORE</div>
              <div className="text-sm font-bold text-cyan-300 bg-cyan-500/20 px-3 py-1 rounded-full border border-cyan-400/40 font-mono">
                🎯 Correct: {correctCount} / {currentSetQuestions.length}
              </div>
            </div>

            <div className="flex justify-center items-center gap-3 pt-2">
              <button
                onClick={handleNextSet}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-400 text-black font-bold text-xs hover:scale-105 transition-all flex items-center gap-2 cursor-pointer shadow-lg"
              >
                <span>{currentSetIndex < totalSets - 1 ? `Start Next Set (${currentSetIndex + 2}/${totalSets})` : 'Start Over From Set #1'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <input
                type="text"
                value={candidateName}
                onChange={e => setCandidateName(e.target.value)}
                placeholder="Candidate Name"
                className="px-3 py-1.5 rounded-lg bg-white/10 border border-white/20 text-white font-semibold text-xs text-center w-36"
              />
              <button
                onClick={handlePrintCertificate}
                className="px-3 py-1.5 rounded-lg bg-amber-400 text-black font-bold text-xs hover:bg-amber-300 transition-all flex items-center gap-1 cursor-pointer shadow-md"
              >
                <FileCheck className="w-3.5 h-3.5" /> Certificate
              </button>
            </div>
          </div>

          {/* DETAILED ANSWER EXPLANATIONS FOR THIS SET */}
          <div className="space-y-3">
            <h5 className="font-bold text-white flex items-center gap-1.5 border-b border-white/10 pb-1">
              <Sparkles className="w-4 h-4 text-cyan-400" /> Answers & Detailed Explanations:
            </h5>
            {currentSetQuestions.map((q, idx) => {
              const uAns = userAnswers[q.id]
              const isCorrect = uAns === q.correctOptionIndex
              return (
                <div key={q.id} className={`p-3 rounded-xl border space-y-1.5 ${
                  isCorrect ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-rose-500/10 border-rose-500/30'
                }`}>
                  <div className="flex items-center justify-between font-bold">
                    <span className="text-white">Q{idx + 1}. {q.question}</span>
                    {isCorrect ? (
                      <span className="text-emerald-400 flex items-center gap-1"><CheckCircle2 className="w-4 h-4" /> Correct</span>
                    ) : (
                      <span className="text-rose-400 flex items-center gap-1"><XCircle className="w-4 h-4" /> Incorrect</span>
                    )}
                  </div>
                  <div className="text-foreground/70 font-mono text-[11px]">
                    Your Choice: <strong className={isCorrect ? 'text-emerald-300' : 'text-rose-300'}>
                      {uAns !== undefined ? q.options[uAns] : 'Not Answered'}
                    </strong> | Correct Answer: <strong className="text-emerald-400">{q.options[q.correctOptionIndex]}</strong>
                  </div>
                  <p className="text-foreground/80 bg-black/40 p-2 rounded-lg border border-white/5 text-[11px] leading-relaxed">
                    💡 <strong>Explanation:</strong> {q.explanation}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
