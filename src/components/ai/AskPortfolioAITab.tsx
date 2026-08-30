import { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, Sparkles, ArrowUpRight, Mic, MicOff, Volume2, VolumeX, Loader2 } from 'lucide-react'
import {
  generatePortfolioAnswerAsync,
  QUICK_SUGGESTIONS_EN,
  QUICK_SUGGESTIONS_TA,
  ChatMessage,
  RecruiterPersona
} from '@/services/ai/aiKnowledgeEngine'
import { speakText, stopSpeaking, createSpeechRecognizer } from '@/services/ai/voiceEngine'
import { portfolioAiApi } from '@/services/api/portfolioAiApi'
import VoiceWaveVisualizer from './VoiceWaveVisualizer'

interface AskPortfolioAITabProps {
  lang?: 'en' | 'ta'
}

function cleanMarkdownSymbols(text: string): string {
  return text
    .replace(/\*\*/g, '')
    .replace(/###\s?/g, '')
    .replace(/##\s?/g, '')
    .replace(/#\s?/g, '')
    .replace(/`/g, '')
}

export default function AskPortfolioAITab({ lang = 'en' }: AskPortfolioAITabProps) {
  const [persona, setPersona] = useState<RecruiterPersona>('general')
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'bot',
      text: lang === 'ta'
        ? '👋 வணக்கம்! நான் ராகுலின் AI உதவியாளன். ராகுல் ராஜாவின் 16+ புராஜெக்ட்கள், SKP கல்லூரி விவரங்கள், TVK டெக்னாலஜிஸ் அனுபவம் அல்லது எந்தவொரு பொதுவான தொழில்நுட்பக் கேள்விகளையும் என்னிடம் கேட்கலாம்!'
        : '👋 Hello! I am Raghul\'s AI Portfolio & General Assistant. Ask me anything about Raghul Raja\'s 16+ projects, SKP Engineering College details, TVK Technologies internship, or any general technical/coding question!',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)

  const quickSuggestions = lang === 'ta' ? QUICK_SUGGESTIONS_TA : QUICK_SUGGESTIONS_EN

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || input
    if (!textToSend.trim()) return

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: cleanMarkdownSymbols(textToSend),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    setMessages(prev => [...prev, userMsg])
    if (!queryText) setInput('')
    setIsTyping(true)

    try {
      const response = await portfolioAiApi.queryRAG({ query: textToSend, persona })
      const cleanedText = cleanMarkdownSymbols(response.answer)
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: cleanedText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actions: [
          { label: lang === 'ta' ? '🚀 புராஜெக்ட்களை பார்' : '🚀 Explore Projects', action: () => handleAction('SCROLL_PROJECTS') },
          { label: lang === 'ta' ? '📊 ஸ்கில்களை பார்' : '📊 View Skill Grid', action: () => handleAction('SCROLL_SKILLS') }
        ]
      }
      setMessages(prev => [...prev, botMsg])
      setIsTyping(false)
      speakText(cleanedText, lang, () => setIsSpeaking(true), () => setIsSpeaking(false))
    } catch {
      const fallbackRes = await generatePortfolioAnswerAsync(textToSend, lang, persona)
      const cleanedText = cleanMarkdownSymbols(fallbackRes.text)
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: cleanedText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actions: [
          { label: lang === 'ta' ? '🚀 புராஜெக்ட்களை பார்' : '🚀 Explore Projects', action: () => handleAction('SCROLL_PROJECTS') }
        ]
      }
      setMessages(prev => [...prev, botMsg])
      setIsTyping(false)
    }
  }

  const handleAction = (actionText: string) => {
    if (actionText === 'SCROLL_PROJECTS') {
      document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })
    } else if (actionText === 'SCROLL_EXPERIENCE') {
      document.getElementById('experience')?.scrollIntoView({ behavior: 'smooth' })
    } else if (actionText === 'SCROLL_SKILLS') {
      document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })
    } else if (actionText === 'SCROLL_CONTACT') {
      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const toggleMic = () => {
    if (isListening) {
      setIsListening(false)
      return
    }

    const recognizer = createSpeechRecognizer(
      lang,
      (transcript) => {
        setInput(transcript)
        handleSend(transcript)
      },
      (err) => {
        console.warn('Voice input error:', err)
        setIsListening(false)
      },
      () => setIsListening(false)
    )

    if (recognizer) {
      setIsListening(true)
      recognizer.start()
    }
  }

  const toggleVoicePlayback = () => {
    if (isSpeaking) {
      stopSpeaking()
      setIsSpeaking(false)
    } else {
      const lastBotMsg = [...messages].reverse().find(m => m.sender === 'bot')
      if (lastBotMsg) {
        speakText(lastBotMsg.text, lang, () => setIsSpeaking(true), () => setIsSpeaking(false))
      }
    }
  }

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-surface-darker/60 rounded-xl border border-white/10 overflow-hidden font-sans text-xs sm:text-sm">
      {/* PERSONA SELECTOR & VOICE WAVEBAR HEADER */}
      <div className="p-2.5 bg-surface-dark/90 border-b border-white/10 flex items-center justify-between gap-2 overflow-x-auto no-scrollbar shrink-0">
        <div className="flex items-center gap-1.5 overflow-x-auto shrink-0">
          <span className="text-[11px] text-foreground/60 font-semibold font-mono whitespace-nowrap">
            🎭 Recruiter Mode:
          </span>
          {[
            { id: 'general', label: '🌐 General' },
            { id: 'hr', label: '👔 HR Recruiter' },
            { id: 'tech_lead', label: '💻 Tech Lead' },
            { id: 'founder', label: '🚀 Founder' }
          ].map(p => (
            <button
              key={p.id}
              onClick={() => setPersona(p.id as RecruiterPersona)}
              className={`text-[11px] px-2 py-1 rounded-lg border transition-all cursor-pointer whitespace-nowrap min-h-[32px] flex items-center ${
                persona === p.id
                  ? 'bg-primary/20 border-primary text-primary font-bold'
                  : 'bg-white/5 border-white/10 text-foreground/70 hover:bg-white/10'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* VOICE WAVE CANVAS VISUALIZER */}
        <div className="flex items-center gap-2 shrink-0">
          <VoiceWaveVisualizer isActive={isListening || isSpeaking} />
          <button
            onClick={toggleVoicePlayback}
            className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
              isSpeaking ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/40' : 'bg-white/5 text-foreground/60 border-white/10 hover:text-foreground'
            }`}
            title="Audio Replay"
          >
            {isSpeaking ? <Volume2 className="w-3.5 h-3.5 animate-pulse" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* QUICK SUGGESTION CHIPS */}
      <div className="p-2 bg-surface-dark/80 border-b border-white/10 flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0">
        <span className="text-[11px] text-primary/80 font-mono flex items-center gap-1 font-semibold whitespace-nowrap shrink-0">
          <Sparkles className="w-3 h-3 text-primary" /> Prompts:
        </span>
        {quickSuggestions.map((chip, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(chip)}
            className="text-[11px] px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-foreground/80 hover:border-primary/40 hover:text-primary hover:bg-primary/10 transition-all font-mono whitespace-nowrap cursor-pointer shrink-0 min-h-[32px] flex items-center"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* CHAT MESSAGES LOG */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex items-start gap-2.5 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
          >
            <div
              className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs shrink-0 ${
                msg.sender === 'user'
                  ? 'bg-primary text-black font-bold'
                  : 'bg-gradient-to-br from-cyan-500/20 to-primary/20 text-primary border border-primary/30'
              }`}
            >
              {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div
              className={`max-w-[85%] sm:max-w-[78%] p-3 rounded-2xl text-xs sm:text-sm space-y-2 leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-primary/20 text-white border border-primary/30 rounded-tr-none font-sans'
                  : 'bg-surface-dark border border-white/10 text-foreground/90 rounded-tl-none font-sans'
              }`}
            >
              <div>{msg.text}</div>

              {msg.actions && msg.actions.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {msg.actions.map((act, i) => (
                    <button
                      key={i}
                      onClick={act.action}
                      className="text-[10px] px-2 py-1 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 transition-all font-bold flex items-center gap-1 cursor-pointer"
                    >
                      {act.label} <ArrowUpRight className="w-3 h-3" />
                    </button>
                  ))}
                </div>
              )}

              <div className="text-[9px] font-mono text-foreground/50 text-right">{msg.timestamp}</div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-2 text-foreground/60 text-xs italic p-2">
            <Loader2 className="w-4 h-4 animate-spin text-primary" />
            <span>{lang === 'ta' ? 'சிந்தித்துக் கொண்டிருக்கிறது...' : 'Retrieving from Knowledge Engine...'}</span>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* INPUT FORM BAR */}
      <form
        onSubmit={e => {
          e.preventDefault()
          handleSend()
        }}
        className="p-2.5 sm:p-3 bg-surface-dark border-t border-white/10 flex items-center gap-2 shrink-0"
      >
        <button
          type="button"
          onClick={toggleMic}
          className={`p-2.5 rounded-xl border transition-all cursor-pointer min-w-[42px] min-h-[42px] flex items-center justify-center shrink-0 ${
            isListening
              ? 'bg-rose-500/20 text-rose-400 border-rose-400/40 animate-pulse'
              : 'bg-white/5 text-foreground/60 border-white/10 hover:text-foreground hover:bg-white/10'
          }`}
          title="Voice Speech Input"
        >
          {isListening ? <MicOff className="w-4 h-4 text-rose-400" /> : <Mic className="w-4 h-4" />}
        </button>

        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder={lang === 'ta' ? 'ராகுலின் போர்ட்ஃபோலியோ பற்றி கேட்க...' : 'Ask Portfolio AI about projects, skills, internship...'}
          className="flex-1 px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-foreground text-xs sm:text-sm focus:outline-none focus:border-primary/60 font-sans"
        />

        <button
          type="submit"
          disabled={!input.trim()}
          className="p-2.5 rounded-xl bg-primary text-black hover:bg-primary-light transition-all disabled:opacity-40 disabled:cursor-not-allowed font-bold cursor-pointer shrink-0 min-w-[42px] min-h-[42px] flex items-center justify-center"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  )
}
