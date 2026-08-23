import { useState } from 'react'
import { motion } from 'framer-motion'
import { Cpu, Database, Network, Server, Play, Activity, Terminal, ShieldCheck, Zap } from 'lucide-react'

export default function ArchitectureExplainerTab() {
  const [selectedScenario, setSelectedScenario] = useState<'rag' | 'ats' | 'fastapi'>('rag')
  const [customPayload, setCustomPayload] = useState<string>('{\n  "query": "Synthesize RAG Pipeline Architecture",\n  "embedding": "text-embedding-004"\n}')
  const [isSimulating, setIsSimulating] = useState(false)
  const [currentActiveNode, setCurrentActiveNode] = useState<number | null>(null)

  // Traffic & Chaos Controls
  const [trafficLoadRps, setTrafficLoadRps] = useState<number>(5000)
  const [isChaosInjected, setIsChaosInjected] = useState<boolean>(false)
  const [workerThreads, setWorkerThreads] = useState<number>(8)

  const scenarios = {
    rag: {
      title: 'Multimodal RAG Vector Retrieval Architecture',
      description: 'End-to-end telemetry flow showing client prompt ingestion, vector embedding transformation, Qdrant/Chroma DB nearest-neighbor cosine search, and Gemini 1.5 Pro synthesis.',
      nodes: [
        { id: 1, name: 'React Client UI', type: 'Frontend', status: '200 OK', latency: '4ms', icon: Network, params: { framework: 'Vite React 18', cache: 'React Query v5' } },
        { id: 2, name: 'Vite Node Server', type: 'Gateway', status: 'Routed', latency: '8ms', icon: Server, params: { proxy: 'Reverse NGINX', rateLimit: '100 req/s' } },
        { id: 3, name: 'Python FastAPI RAG', type: 'Backend', status: 'Embedded', latency: '18ms', icon: Cpu, params: { workers: workerThreads, model: 'Gemini Flash 1.5' } },
        { id: 4, name: 'Vector VectorDB', type: 'Database', status: 'Matched (0.94)', latency: '12ms', icon: Database, params: { db: 'Qdrant Vector Engine', metric: 'Cosine Distance' } }
      ]
    },
    ats: {
      title: 'IEEE 802 ATS Parser & Keyword Engine',
      description: 'High-speed local parsing pipeline extracting action verbs, calculating STAR metric density, and evaluating keyword frequency against tech stacks.',
      nodes: [
        { id: 1, name: 'PDF / Text Input', type: 'Ingestion', status: 'Parsed', latency: '2ms', icon: Terminal, params: { parser: 'PDF.js Extract', maxMB: '10MB' } },
        { id: 2, name: 'Text Normalizer', type: 'Parser', status: 'Cleaned', latency: '5ms', icon: Cpu, params: { regex: 'AIP-160 Tokenizer', stopWords: 'Filtered' } },
        { id: 3, name: 'Keyword Matrix', type: 'Analyzer', status: 'Scored 94%', latency: '9ms', icon: ShieldCheck, params: { matrix: 'TF-IDF Frequency', topK: '50 Skills' } },
        { id: 4, name: 'IEEE 802 HTML Engine', type: 'Output', status: 'Generated', latency: '6ms', icon: Server, params: { format: 'A4 Printable HTML', style: 'IEEE Standard' } }
      ]
    },
    fastapi: {
      title: 'FastAPI + MySQL Enterprise Telemetry',
      description: 'Asynchronous SQLAlchemy database engine with connection pooling, JWT Bearer authentication middleware, and SMTP email notification worker.',
      nodes: [
        { id: 1, name: 'Client HTTP Request', type: 'Client', status: 'TLS 1.3', latency: '3ms', icon: Network, params: { protocol: 'HTTPS/2', tls: 'ECDHE-RSA' } },
        { id: 2, name: 'JWT Auth Guard', type: 'Middleware', status: 'Verified', latency: '4ms', icon: ShieldCheck, params: { algo: 'HS256', expiry: '8 Hours' } },
        { id: 3, name: 'Async SQLAlchemy', type: 'ORM', status: 'Queried', latency: '14ms', icon: Cpu, params: { poolSize: 20, maxOverflow: 10 } },
        { id: 4, name: 'MySQL Relational DB', type: 'Storage', status: 'Committed', latency: '11ms', icon: Database, params: { engine: 'InnoDB', charset: 'utf8mb4' } }
      ]
    }
  }

  const current = scenarios[selectedScenario]

  const calculatedLatency = isChaosInjected 
    ? Math.floor(180 + trafficLoadRps / 100) 
    : Math.floor(15 + (trafficLoadRps / 1000) * 3)

  const handleSimulateDataFlow = () => {
    setIsSimulating(true)
    setCurrentActiveNode(1)

    let step = 1
    const interval = setInterval(() => {
      step++
      if (step <= current.nodes.length) {
        setCurrentActiveNode(step)
      } else {
        clearInterval(interval)
        setIsSimulating(false)
      }
    }, 600)
  }

  return (
    <div className="flex flex-col h-[540px] bg-surface-darker/70 rounded-xl border border-white/10 p-4 font-sans text-sm space-y-3 overflow-hidden">
      {/* SCENARIO SELECTOR HEADER */}
      <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-cyan-500/10 via-primary/10 to-indigo-500/10 border border-primary/20">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-primary animate-pulse" />
          <div>
            <h3 className="font-bold text-white text-xs">
              Interactive System Architecture & Real-Time Data Flow Visualizer
            </h3>
            <p className="text-[11px] text-foreground/70">
              Simulate end-to-end packet transmission, inspect JSON payloads & view live microsecond latency.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setSelectedScenario('rag')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
              selectedScenario === 'rag' ? 'bg-primary text-black font-bold' : 'bg-white/5 text-foreground/70 hover:bg-white/10'
            }`}
          >
            Multimodal RAG
          </button>
          <button
            onClick={() => setSelectedScenario('ats')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
              selectedScenario === 'ats' ? 'bg-primary text-black font-bold' : 'bg-white/5 text-foreground/70 hover:bg-white/10'
            }`}
          >
            ATS Parser
          </button>
          <button
            onClick={() => setSelectedScenario('fastapi')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
              selectedScenario === 'fastapi' ? 'bg-primary text-black font-bold' : 'bg-white/5 text-foreground/70 hover:bg-white/10'
            }`}
          >
            FastAPI + DB
          </button>
        </div>
      </div>

      {/* DESCRIPTION & SIMULATE BUTTON */}
      <div className="p-3 bg-black/40 rounded-xl border border-white/5 flex items-center justify-between text-xs gap-3">
        <div className="space-y-0.5 flex-1">
          <div className="font-bold text-cyan-300 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-cyan-400" /> {current.title}
          </div>
          <p className="text-[11px] text-foreground/80 leading-relaxed">{current.description}</p>
        </div>

        {/* CONTROLS: TRAFFIC SLIDER & CHAOS INJECTOR */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsChaosInjected(prev => !prev)}
            className={`px-2.5 py-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
              isChaosInjected
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/50 animate-pulse'
                : 'bg-white/5 text-foreground/70 border-white/10 hover:bg-white/10'
            }`}
            title="Toggle Chaos Network Fault"
          >
            ⚡ {isChaosInjected ? 'Chaos Injected!' : 'Inject Chaos Fault'}
          </button>

          <button
            onClick={handleSimulateDataFlow}
            disabled={isSimulating}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-primary to-cyan-400 text-black font-bold text-xs hover:opacity-90 transition-all flex items-center gap-1.5 cursor-pointer shadow-lg disabled:opacity-50 whitespace-nowrap"
          >
            <Play className="w-4 h-4 fill-current" /> {isSimulating ? 'Simulating...' : 'Run Flow'}
          </button>
        </div>
      </div>

      {/* TRAFFIC SIMULATOR CONTROL BAR */}
      <div className="px-3 py-2 bg-black/60 rounded-xl border border-white/10 flex items-center justify-between text-xs">
        <div className="flex items-center gap-3 flex-1">
          <span className="font-mono text-cyan-400 font-bold whitespace-nowrap">
            Traffic Volume: {trafficLoadRps.toLocaleString()} req/sec
          </span>
          <input
            type="range"
            min="1000"
            max="50000"
            step="1000"
            value={trafficLoadRps}
            onChange={e => setTrafficLoadRps(Number(e.target.value))}
            className="flex-1 accent-cyan-400 cursor-pointer"
          />
        </div>
        <div className="font-mono text-[11px] text-foreground/70 ml-3">
          Est. Latency: <span className={isChaosInjected ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>{calculatedLatency} ms</span>
        </div>
      </div>

      {/* NODE PIPELINE GRAPH VISUALIZER */}
      <div className="p-4 bg-black/70 rounded-xl border border-white/10 relative overflow-hidden">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 relative z-10">
          {current.nodes.map((node, idx) => {
            const Icon = node.icon
            const isActive = currentActiveNode === node.id
            const isFaultyNode = isChaosInjected && node.id === 3
            return (
              <motion.div
                key={node.id}
                animate={{ scale: isActive ? 1.05 : 1 }}
                className={`p-3 rounded-xl border flex flex-col justify-between space-y-2 transition-all cursor-pointer ${
                  isFaultyNode
                    ? 'bg-rose-500/20 border-rose-500 text-rose-300 ring-2 ring-rose-500/50'
                    : isActive
                    ? 'bg-primary/20 border-primary text-white shadow-xl shadow-primary/20 ring-2 ring-primary/40'
                    : 'bg-white/5 border-white/10 text-foreground/80 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-foreground/60 uppercase">Step 0{idx + 1}</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/10 text-cyan-300">{node.type}</span>
                </div>

                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-lg ${isFaultyNode ? 'bg-rose-500 text-white' : isActive ? 'bg-primary text-black' : 'bg-white/10 text-primary'}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-white text-xs">{node.name}</div>
                    <div className={`text-[10px] font-mono ${isFaultyNode ? 'text-rose-400 font-bold' : 'text-emerald-400'}`}>
                      {isFaultyNode ? '503 Failover' : node.status}
                    </div>
                  </div>
                </div>

                <div className="text-[10px] text-foreground/60 font-mono border-t border-white/10 pt-1 flex justify-between">
                  <span>Latency:</span>
                  <span className={isFaultyNode ? 'text-rose-400 font-bold' : 'text-white font-bold'}>
                    {isFaultyNode ? '240ms' : node.latency}
                  </span>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* CUSTOM PAYLOAD & SYSTEM TELEMETRY SPLIT */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3 min-h-0 text-xs">
        {/* LEFT: CUSTOM PAYLOAD BUILDER */}
        <div className="p-3 bg-black/80 rounded-xl border border-white/10 flex flex-col space-y-2">
          <div className="flex justify-between items-center text-foreground/70 font-mono text-[11px]">
            <span>JSON Ingestion Payload:</span>
            <span className="text-primary">Content-Type: application/json</span>
          </div>
          <textarea
            value={customPayload}
            onChange={e => setCustomPayload(e.target.value)}
            rows={4}
            className="flex-1 w-full p-2.5 bg-black/60 border border-white/10 rounded-lg font-mono text-emerald-400 text-xs focus:outline-none focus:border-primary/50 resize-none"
          />
        </div>

        {/* RIGHT: LIVE TELEMETRY DASHBOARD */}
        <div className="p-3 bg-black/80 rounded-xl border border-white/10 flex flex-col space-y-2 font-mono">
          <div className="font-bold text-cyan-300 flex items-center justify-between text-[11px]">
            <span>System Telemetry & Health</span>
            <span className={isChaosInjected ? 'text-rose-400 font-bold' : 'text-emerald-400 animate-pulse'}>
              {isChaosInjected ? '⚠️ Circuit Breaker Active' : '● Live Engine Connected'}
            </span>
          </div>

          <div className="space-y-1.5 text-[11px] pt-1">
            <div className="flex justify-between p-2 rounded bg-white/5">
              <span className="text-foreground/70">Total Pipeline Latency:</span>
              <span className={isChaosInjected ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>
                {calculatedLatency} ms
              </span>
            </div>
            <div className="flex justify-between p-2 rounded bg-white/5">
              <span className="text-foreground/70">Throughput Capacity:</span>
              <span className="text-cyan-300 font-bold">{(trafficLoadRps * 0.98).toFixed(0)} req/sec</span>
            </div>
            <div className="flex justify-between p-2 rounded bg-white/5">
              <span className="text-foreground/70">Active Workers:</span>
              <div className="flex items-center gap-2">
                <span className="text-white font-bold">{workerThreads} Threads</span>
                <button
                  onClick={() => setWorkerThreads(prev => (prev >= 32 ? 4 : prev + 4))}
                  className="px-1.5 py-0.5 rounded bg-primary/20 text-primary text-[10px] hover:bg-primary/30"
                >
                  +Tune
                </button>
              </div>
            </div>
            <div className="flex justify-between p-2 rounded bg-white/5">
              <span className="text-foreground/70">Chaos Failover Strategy:</span>
              <span className="text-emerald-400 font-bold">Exponential Backoff</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

