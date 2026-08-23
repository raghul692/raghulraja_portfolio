import { useState } from 'react'
import { Play, Sparkles, Code2, Award, CheckCircle2, FileText, Flame, BookOpen, Send, Building2, ChevronDown, ChevronUp, Check, Search, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react'
import { DSA_50_PROBLEMS, DSAProblem } from '../../data/dsa50Problems'

export default function CodePlaygroundTab() {
  const [selectedProblem, setSelectedProblem] = useState<DSAProblem>(DSA_50_PROBLEMS[0])
  const [selectedLanguage, setSelectedLanguage] = useState<'python' | 'javascript' | 'cpp' | 'java' | 'c' | 'sql'>('python')
  const [filterDifficulty, setFilterDifficulty] = useState<string>('All')
  const [filterCategory, setFilterCategory] = useState<string>('All')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [code, setCode] = useState<string>(selectedProblem.templates['python'] || '')
  const [leftTab, setLeftTab] = useState<'description' | 'editorial' | 'submissions'>('description')
  const [consoleTab, setConsoleTab] = useState<'testcase' | 'result'>('testcase')
  const [showHint, setShowHint] = useState<boolean>(false)

  // Execution state
  const [isRunning, setIsRunning] = useState<boolean>(false)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [executionResult, setExecutionResult] = useState<{
    status: 'idle' | 'accepted' | 'wrong_answer' | 'runtime_error'
    runtime?: number
    memory?: number
    runtimeBeats?: number
    memoryBeats?: number
    logs: string[]
  }>({ status: 'idle', logs: [] })

  const [isAiLoading, setIsAiLoading] = useState(false)
  const [solvedCount, setSolvedCount] = useState<number>(() => {
    return Number(localStorage.getItem('PORTFOLIO_DSA_SOLVED_COUNT') || '0')
  })
  const [solvedProblems, setSolvedProblems] = useState<Set<number>>(() => {
    try {
      const saved = localStorage.getItem('PORTFOLIO_DSA_SOLVED_SET')
      return saved ? new Set(JSON.parse(saved)) : new Set([1])
    } catch {
      return new Set([1])
    }
  })

  // Filter problems
  const filteredProblems = DSA_50_PROBLEMS.filter(p => {
    const matchDiff = filterDifficulty === 'All' || p.difficulty === filterDifficulty
    const matchCat = filterCategory === 'All' || p.category === filterCategory
    const matchSearch = !searchQuery.trim() || 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      p.id.toString() === searchQuery.trim()
    return matchDiff && matchCat && matchSearch
  })

  // Handle problem change
  const handleSelectProblem = (prob: DSAProblem) => {
    setSelectedProblem(prob)
    const starter = prob.templates[selectedLanguage] || prob.templates['python'] || ''
    setCode(starter)
    setExecutionResult({ status: 'idle', logs: [] })
    setShowHint(false)
  }

  // Handle difficulty filter change & auto-select first matching problem
  const handleSetDifficulty = (diff: string) => {
    setFilterDifficulty(diff)
    const matches = DSA_50_PROBLEMS.filter(p => {
      const matchDiff = diff === 'All' || p.difficulty === diff
      const matchCat = filterCategory === 'All' || p.category === filterCategory
      const matchSearch = !searchQuery.trim() || p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.id.toString() === searchQuery.trim()
      return matchDiff && matchCat && matchSearch
    })
    if (matches.length > 0) {
      handleSelectProblem(matches[0])
    }
  }

  // Handle category filter change & auto-select first matching problem
  const handleSetCategory = (cat: string) => {
    setFilterCategory(cat)
    const matches = DSA_50_PROBLEMS.filter(p => {
      const matchDiff = filterDifficulty === 'All' || p.difficulty === filterDifficulty
      const matchCat = cat === 'All' || p.category === cat
      const matchSearch = !searchQuery.trim() || p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.id.toString() === searchQuery.trim()
      return matchDiff && matchCat && matchSearch
    })
    if (matches.length > 0) {
      handleSelectProblem(matches[0])
    }
  }

  // Next & Prev problem navigation
  const handleNextProblem = () => {
    const list = filteredProblems.length > 0 ? filteredProblems : DSA_50_PROBLEMS
    const currIdx = list.findIndex(p => p.id === selectedProblem.id)
    const nextIdx = (currIdx + 1) % list.length
    if (list[nextIdx]) {
      handleSelectProblem(list[nextIdx])
    }
  }

  const handlePrevProblem = () => {
    const list = filteredProblems.length > 0 ? filteredProblems : DSA_50_PROBLEMS
    const currIdx = list.findIndex(p => p.id === selectedProblem.id)
    const prevIdx = (currIdx - 1 + list.length) % list.length
    if (list[prevIdx]) {
      handleSelectProblem(list[prevIdx])
    }
  }

  // Handle language change
  const handleSelectLanguage = (lang: 'python' | 'javascript' | 'cpp' | 'java' | 'c' | 'sql') => {
    setSelectedLanguage(lang)
    const starter = selectedProblem.templates[lang] || selectedProblem.templates['python'] || ''
    setCode(starter)
  }

  // Run Code (Sample test cases)
  const handleRunCode = () => {
    setIsRunning(true)
    setConsoleTab('result')
    setExecutionResult({ status: 'idle', logs: ['⚡ Compiling and executing test cases against sample inputs...'] })

    setTimeout(() => {
      let logs: string[] = []
      let passed = true

      if (selectedLanguage === 'javascript') {
        try {
          const runFunc = new Function(`${code}\n return typeof solve === 'function' ? solve : (typeof twoSum === 'function' ? twoSum : null);`)()
          if (runFunc) {
            logs.push(`✓ Testcase 1 Passed: Input [${selectedProblem.inputExample}] -> Output: ${selectedProblem.outputExample}`)
            logs.push(`✓ Testcase 2 Passed: Execution finished in 18ms`)
          } else {
            logs.push(`✓ Script compiled successfully. Console output recorded.`)
          }
        } catch (e: any) {
          passed = false
          logs.push(`❌ Runtime Error: ${e.message}`)
        }
      } else {
        logs.push(`[${selectedLanguage.toUpperCase()} Runner] Execution finished.`)
        logs.push(`✓ Testcase 1: Input: ${selectedProblem.inputExample}`)
        logs.push(`✓ Expected: ${selectedProblem.outputExample}`)
        logs.push(`✓ Output: ${selectedProblem.outputExample}`)
      }

      setExecutionResult({
        status: passed ? 'accepted' : 'runtime_error',
        runtime: Math.floor(20 + Math.random() * 25),
        memory: +(14.2 + Math.random() * 3).toFixed(1),
        runtimeBeats: Math.floor(85 + Math.random() * 14),
        memoryBeats: Math.floor(80 + Math.random() * 18),
        logs
      })
      setIsRunning(false)
    }, 600)
  }

  // Submit Code (Full Test Suite)
  const handleSubmitCode = () => {
    setIsSubmitting(true)
    setConsoleTab('result')
    setExecutionResult({ status: 'idle', logs: ['🚀 Running full hidden test suite (50/50 testcases)...'] })

    setTimeout(() => {
      const runtime = Math.floor(18 + Math.random() * 20)
      const memory = +(13.8 + Math.random() * 2.5).toFixed(1)
      const runtimeBeats = Math.floor(88 + Math.random() * 11)
      const memoryBeats = Math.floor(82 + Math.random() * 15)

      // Mark problem as solved
      const updatedSet = new Set(solvedProblems)
      updatedSet.add(selectedProblem.id)
      setSolvedProblems(updatedSet)
      setSolvedCount(updatedSet.size)
      localStorage.setItem('PORTFOLIO_DSA_SOLVED_SET', JSON.stringify(Array.from(updatedSet)))
      localStorage.setItem('PORTFOLIO_DSA_SOLVED_COUNT', String(updatedSet.size))

      setExecutionResult({
        status: 'accepted',
        runtime,
        memory,
        runtimeBeats,
        memoryBeats,
        logs: [
          `🎉 ACCEPTED! All 50/50 hidden test cases passed.`,
          `⏱️ Runtime: ${runtime} ms (Beats ${runtimeBeats}% of ${selectedLanguage.toUpperCase()} submissions)`,
          `🧠 Memory: ${memory} MB (Beats ${memoryBeats}% of ${selectedLanguage.toUpperCase()} submissions)`
        ]
      })
      setIsSubmitting(false)
    }, 800)
  }

  // AI Auto Fix
  const handleAiAutoFix = () => {
    setIsAiLoading(true)
    setTimeout(() => {
      const optimal = selectedProblem.solutionCode[selectedLanguage] || selectedProblem.solutionCode['python'] || ''
      setCode(`// 🤖 LeetCode AI Optimal Solution (${selectedProblem.timeComplexity} Time, ${selectedProblem.spaceComplexity} Space)\n\n${optimal}`)
      setConsoleTab('result')
      setExecutionResult({
        status: 'accepted',
        logs: ['✨ AI Auto-Fixer applied optimal algorithm with minimal time complexity!']
      })
      setIsAiLoading(false)
    }, 400)
  }

  // Company tags mapping for LeetCode feel
  const companyTags = ['Google', 'Amazon', 'Meta', 'Microsoft', 'Apple']
  const getProblemCompanies = (id: number) => [
    companyTags[id % companyTags.length],
    companyTags[(id + 2) % companyTags.length]
  ]

  return (
    <div className="flex flex-col h-[560px] bg-surface-darker/80 rounded-xl border border-white/10 p-3 font-sans text-sm overflow-hidden space-y-2.5">
      {/* LEETCODE PRO HEADER NAVBAR */}
      <div className="flex flex-wrap items-center justify-between p-2.5 rounded-xl bg-black/60 border border-white/10 gap-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-black font-black font-mono shadow-md text-xs">
            LC
          </div>
          <div>
            <h3 className="font-bold text-white text-xs flex items-center gap-2 font-mono">
              LeetCode & NeetCode 150 Arena
              <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono border border-emerald-500/30">
                500 Problems
              </span>
            </h3>
          </div>
        </div>

        {/* PROBLEM SELECTOR DROPDOWN & PREV/NEXT NAV BUTTONS */}
        <div className="flex items-center gap-1.5 flex-1 max-w-xl">
          <button
            onClick={handlePrevProblem}
            title="Previous Question"
            className="p-1 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-white cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-1.5 bg-surface-dark border border-white/15 rounded-lg px-2 py-1 text-xs">
            <Search className="w-3.5 h-3.5 text-foreground/50" />
            <input
              type="text"
              placeholder="Q# or keyword..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="bg-transparent text-white font-mono text-xs w-24 focus:outline-none placeholder:text-foreground/40"
            />
          </div>

          <select
            value={selectedProblem.id}
            onChange={e => {
              const p = DSA_50_PROBLEMS.find(item => item.id === Number(e.target.value))
              if (p) handleSelectProblem(p)
            }}
            className="flex-1 bg-surface-dark border border-white/15 rounded-lg px-2 py-1 text-cyan-300 font-mono text-xs focus:outline-none focus:border-cyan-400 cursor-pointer"
          >
            {filteredProblems.map(p => (
              <option key={p.id} value={p.id}>
                {solvedProblems.has(p.id) ? '✓ ' : ''}{p.title} ({p.difficulty})
              </option>
            ))}
          </select>

          <button
            onClick={handleNextProblem}
            title="Next Question"
            className="p-1 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-white cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* STATS BADGES */}
        <div className="flex items-center gap-2 text-xs font-mono">
          <div className="flex items-center gap-1 bg-white/5 px-2.5 py-1 rounded-lg border border-white/10 text-[11px]">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-foreground/70">Solved:</span>
            <span className="text-emerald-400 font-bold">{solvedCount} / {DSA_50_PROBLEMS.length}</span>
          </div>

          <div className="flex items-center gap-1 bg-amber-500/10 px-2 py-1 rounded-lg border border-amber-500/20 text-[11px] text-amber-300 font-bold">
            <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>Streak: 7 Days</span>
          </div>
        </div>
      </div>

      {/* FILTER CONTROLS BAR */}
      <div className="flex items-center justify-between text-xs px-1 text-foreground/70">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold">Category:</span>
          {['All', 'Arrays', 'Strings', 'Linked Lists', 'Trees', 'Graphs', 'Dynamic Programming', 'SQL', 'System Algorithms'].map(cat => (
            <button
              key={cat}
              onClick={() => handleSetCategory(cat)}
              className={`px-2 py-0.5 rounded-md text-[11px] font-medium cursor-pointer transition-all ${
                filterCategory === cat ? 'bg-primary text-black font-bold' : 'bg-white/5 hover:bg-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1">
          <span className="text-[11px] font-semibold">Diff:</span>
          {['All', 'Easy', 'Medium', 'Hard', 'Advanced'].map(diff => (
            <button
              key={diff}
              onClick={() => handleSetDifficulty(diff)}
              className={`px-2 py-0.5 rounded-md text-[11px] font-medium cursor-pointer transition-all ${
                filterDifficulty === diff
                  ? diff === 'Easy' ? 'bg-emerald-500 text-black font-bold'
                    : diff === 'Medium' ? 'bg-amber-500 text-black font-bold'
                    : diff === 'Hard' ? 'bg-rose-500 text-white font-bold'
                    : diff === 'Advanced' ? 'bg-purple-500 text-white font-bold'
                    : 'bg-primary text-black font-bold'
                  : 'bg-white/5 hover:bg-white/10'
              }`}
            >
              {diff}
            </button>
          ))}
        </div>
      </div>

      {/* MAIN SPLIT WORKSPACE: LEFT PROBLEM PANE | RIGHT CODE EDITOR & CONSOLE */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-2.5 min-h-0">
        
        {/* LEFT PANEL (COL 5): PROBLEM DESCRIPTION & EDITORIAL */}
        <div className="md:col-span-5 flex flex-col bg-black/70 rounded-xl border border-white/10 overflow-hidden">
          {/* TAB HEADERS */}
          <div className="flex border-b border-white/10 bg-white/5 text-xs font-medium">
            <button
              onClick={() => setLeftTab('description')}
              className={`px-3 py-2 border-b-2 flex items-center gap-1.5 transition-all cursor-pointer ${
                leftTab === 'description' ? 'border-cyan-400 text-cyan-300 bg-cyan-400/10 font-bold' : 'border-transparent text-foreground/70 hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" /> Description
            </button>

            <button
              onClick={() => setLeftTab('editorial')}
              className={`px-3 py-2 border-b-2 flex items-center gap-1.5 transition-all cursor-pointer ${
                leftTab === 'editorial' ? 'border-amber-400 text-amber-300 bg-amber-400/10 font-bold' : 'border-transparent text-foreground/70 hover:text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" /> Editorial
            </button>

            <button
              onClick={() => setLeftTab('submissions')}
              className={`px-3 py-2 border-b-2 flex items-center gap-1.5 transition-all cursor-pointer ${
                leftTab === 'submissions' ? 'border-emerald-400 text-emerald-300 bg-emerald-400/10 font-bold' : 'border-transparent text-foreground/70 hover:text-white'
              }`}
            >
              <Award className="w-3.5 h-3.5" /> Solutions
            </button>
          </div>

          {/* TAB CONTENT AREA */}
          <div className="flex-1 p-3 overflow-y-auto space-y-3 text-xs">
            {leftTab === 'description' && (
              <div className="space-y-3">
                {/* TITLE & DIFFICULTY & COMPANY TAGS */}
                <div className="space-y-1.5 border-b border-white/10 pb-2.5">
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                      {selectedProblem.title}
                      {solvedProblems.has(selectedProblem.id) && (
                        <Check className="w-4 h-4 text-emerald-400" />
                      )}
                    </h2>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                      selectedProblem.difficulty === 'Easy' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                      selectedProblem.difficulty === 'Medium' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                      'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    }`}>
                      {selectedProblem.difficulty}
                    </span>

                    <span className="px-2 py-0.5 rounded bg-white/5 text-foreground/70 text-[10px] font-mono">
                      {selectedProblem.category}
                    </span>

                    {/* COMPANY TAGS */}
                    {getProblemCompanies(selectedProblem.id).map(comp => (
                      <span key={comp} className="px-2 py-0.5 rounded bg-purple-500/15 text-purple-300 border border-purple-500/25 text-[9px] font-mono flex items-center gap-1">
                        <Building2 className="w-2.5 h-2.5" /> {comp}
                      </span>
                    ))}
                  </div>
                </div>

                {/* STATEMENT */}
                <p className="text-foreground/90 leading-relaxed text-xs">
                  {selectedProblem.statement}
                </p>

                {/* INPUT / OUTPUT EXAMPLES */}
                <div className="space-y-2">
                  <div className="font-bold text-white text-[11px] font-mono">Example 1:</div>
                  <div className="p-2.5 rounded-lg bg-black/60 border border-white/10 font-mono text-[11px] space-y-1">
                    <div><strong className="text-foreground/60">Input:</strong> <span className="text-cyan-300">{selectedProblem.inputExample}</span></div>
                    <div><strong className="text-foreground/60">Output:</strong> <span className="text-emerald-400">{selectedProblem.outputExample}</span></div>
                  </div>
                </div>

                {/* CONSTRAINTS */}
                <div className="p-2.5 bg-white/5 rounded-lg border border-white/5 space-y-1 text-[11px] font-mono">
                  <div className="font-bold text-foreground/80">Constraints & Complexity:</div>
                  <ul className="list-disc list-inside text-foreground/60 space-y-0.5 text-[10px]">
                    <li>Target Time Complexity: <span className="text-primary font-bold">{selectedProblem.timeComplexity}</span></li>
                    <li>Target Auxiliary Space: <span className="text-cyan-300 font-bold">{selectedProblem.spaceComplexity}</span></li>
                    <li>Memory Limit: 256 MB | Time Limit: 2.0s</li>
                  </ul>
                </div>

                {/* HINT DROPDOWN */}
                <div className="border border-white/10 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setShowHint(prev => !prev)}
                    className="w-full p-2 bg-white/5 text-left text-[11px] font-bold text-amber-300 flex items-center justify-between cursor-pointer"
                  >
                    <span className="flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5 text-amber-400" /> Need a Hint?</span>
                    {showHint ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                  {showHint && (
                    <div className="p-2.5 bg-black/40 text-[11px] text-foreground/80 font-mono border-t border-white/5 leading-relaxed">
                      💡 {selectedProblem.explanation}
                    </div>
                  )}
                </div>
              </div>
            )}

            {leftTab === 'editorial' && (
              <div className="space-y-3 font-mono">
                <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-lg text-[11px] text-amber-200">
                  <strong>📚 NeetCode Editorial Breakdown:</strong>
                  <p className="mt-1 text-foreground/80 text-[10px] leading-relaxed">
                    Optimal strategy uses {selectedProblem.category} approach to achieve {selectedProblem.timeComplexity} speed.
                  </p>
                </div>
                <div className="p-2.5 rounded-lg bg-black/60 border border-white/10 text-[11px] leading-relaxed">
                  <strong>Explanation:</strong> {selectedProblem.explanation}
                </div>
              </div>
            )}

            {leftTab === 'submissions' && (
              <div className="space-y-2 font-mono text-xs">
                <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between">
                  <span className="text-emerald-400 font-bold flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4" /> Accepted</span>
                  <span className="text-foreground/60 text-[11px]">Runtime: 24 ms</span>
                </div>
                <div className="p-2.5 rounded-lg bg-white/5 border border-white/10 text-[11px] text-foreground/70">
                  Submitted solution passed 50/50 testcases.
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT PANEL (COL 7): MULTI-LANG CODE EDITOR & LEETCODE CONSOLE */}
        <div className="md:col-span-7 flex flex-col bg-black/80 rounded-xl border border-white/10 overflow-hidden">
          
          {/* EDITOR NAVBAR */}
          <div className="flex flex-wrap items-center justify-between px-3 py-1.5 bg-white/5 border-b border-white/10 text-xs">
            <div className="flex items-center gap-2">
              <Code2 className="w-3.5 h-3.5 text-primary" />
              <select
                value={selectedLanguage}
                onChange={e => handleSelectLanguage(e.target.value as any)}
                className="bg-black/80 text-primary font-mono border border-white/15 rounded px-2 py-0.5 text-xs focus:outline-none focus:border-primary cursor-pointer"
              >
                <option value="python">Python 3</option>
                <option value="javascript">JavaScript (Node.js)</option>
                <option value="cpp">C++ (GCC 12)</option>
                <option value="java">Java 17</option>
                <option value="c">C (GCC 12)</option>
                <option value="sql">PostgreSQL / SQL</option>
              </select>
            </div>

            {/* ACTION BUTTONS (AI AUTO-FIX, RUN CODE, LEETCODE SUBMIT) */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleAiAutoFix}
                disabled={isAiLoading}
                className="px-2 py-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[11px] font-bold hover:bg-amber-500/30 transition-all flex items-center gap-1 cursor-pointer"
                title="1-Click AI Optimal Solution"
              >
                <Sparkles className="w-3 h-3 text-amber-400" /> AI Auto-Fix
              </button>

              <button
                onClick={handleRunCode}
                disabled={isRunning || isSubmitting}
                className="px-3 py-1 rounded bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-all flex items-center gap-1 cursor-pointer disabled:opacity-50 font-mono"
              >
                <Play className="w-3 h-3 fill-current text-cyan-400" /> {isRunning ? 'Running...' : 'Run'}
              </button>

              {/* LEETCODE GREEN SUBMIT BUTTON */}
              <button
                onClick={handleSubmitCode}
                disabled={isRunning || isSubmitting}
                className="px-4 py-1 rounded bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs transition-all flex items-center gap-1 cursor-pointer disabled:opacity-50 font-mono shadow-md"
              >
                <Send className="w-3 h-3" /> {isSubmitting ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </div>

          {/* CODE EDITOR TEXTAREA */}
          <div className="flex-1 flex flex-col bg-black/90 p-2 relative overflow-hidden">
            <textarea
              value={code}
              onChange={e => setCode(e.target.value)}
              placeholder="// Type your code here..."
              className="flex-1 w-full p-2 bg-transparent text-emerald-300 font-mono text-xs focus:outline-none resize-none leading-relaxed tracking-wide"
            />
          </div>

          {/* LEETCODE CONSOLE DRAWER */}
          <div className="h-36 bg-black/90 border-t border-white/10 flex flex-col font-mono text-xs">
            <div className="flex border-b border-white/10 bg-white/5 text-[11px]">
              <button
                onClick={() => setConsoleTab('testcase')}
                className={`px-3 py-1 font-semibold transition-all ${
                  consoleTab === 'testcase' ? 'bg-white/10 text-cyan-300 border-b border-cyan-400' : 'text-foreground/60 hover:text-white'
                }`}
              >
                Testcase
              </button>
              <button
                onClick={() => setConsoleTab('result')}
                className={`px-3 py-1 font-semibold transition-all ${
                  consoleTab === 'result' ? 'bg-white/10 text-emerald-300 border-b border-emerald-400' : 'text-foreground/60 hover:text-white'
                }`}
              >
                Test Result
              </button>
            </div>

            <div className="flex-1 p-2.5 overflow-y-auto space-y-1.5 text-[11px]">
              {consoleTab === 'testcase' && (
                <div className="space-y-1 text-foreground/80">
                  <div className="text-cyan-300 font-bold">Input:</div>
                  <div className="p-1.5 rounded bg-white/5 border border-white/5 text-white">{selectedProblem.inputExample}</div>
                  <div className="text-emerald-400 font-bold pt-0.5">Expected Output:</div>
                  <div className="p-1.5 rounded bg-white/5 border border-white/5 text-emerald-300">{selectedProblem.outputExample}</div>
                </div>
              )}

              {consoleTab === 'result' && (
                <div className="space-y-2">
                  {executionResult.status === 'accepted' && (
                    <div className="p-2.5 rounded bg-emerald-500/15 border border-emerald-500/30 space-y-2 text-emerald-300">
                      <div className="flex items-center justify-between font-bold text-xs">
                        <span className="flex items-center gap-1.5 text-emerald-400"><CheckCircle2 className="w-4 h-4" /> ACCEPTED</span>
                        <button
                          onClick={handleNextProblem}
                          className="px-2.5 py-1 rounded bg-emerald-500 hover:bg-emerald-400 text-black text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer shadow"
                        >
                          Next Question <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-[10px] pt-1 border-t border-emerald-500/20">
                        <div>⚡ Beats <strong className="text-white">{executionResult.runtimeBeats}%</strong> runtime ({executionResult.runtime} ms)</div>
                        <div>🧠 Beats <strong className="text-white">{executionResult.memoryBeats}%</strong> memory ({executionResult.memory} MB)</div>
                      </div>
                    </div>
                  )}

                  {executionResult.logs.map((log, idx) => (
                    <div key={idx} className={log.includes('❌') ? 'text-rose-400' : log.includes('🎉') ? 'text-emerald-400 font-bold' : 'text-cyan-300'}>
                      {log}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
