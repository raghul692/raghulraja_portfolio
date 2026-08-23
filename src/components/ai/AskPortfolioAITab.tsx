import { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, Sparkles, ArrowUpRight, Mic, MicOff, Volume2, VolumeX } from 'lucide-react'
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
    <div className="flex flex-col h-[520px] bg-surface-darker/60 rounded-xl border border-white/10 overflow-hidden">
      {/* PERSONA SELECTOR & VOICE WAVEBAR HEADER */}
      <div className="p-2.5 bg-surface-dark/90 border-b border-white/10 flex items-center justify-between gap-2 overflow-x-auto">
        <div className="flex items-center gap-1.5 overflow-x-auto">
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
              className={`text-[11px] px-2 py-0.5 rounded-lg border transition-all cursor-pointer whitespace-nowrap ${
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
        <VoiceWaveVisualizer isActive={isListening || isSpeaking} />
      </div>

      {/* QUICK SUGGESTION CHIPS */}
      <div className="p-2.5 bg-surface-dark/80 border-b border-white/10 flex items-center justify-between gap-2 overflow-x-auto">
        <div className="flex items-center gap-2 overflow-x-auto">
          <span className="text-xs text-primary/80 font-mono flex items-center gap-1 font-semibold whitespace-nowrap">
            <Sparkles className="w-3 h-3" /> Quick Prompts:
          </span>
          {quickSuggestions.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(chip)}
              className="text-[11px] px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-foreground/80 hover:bg-primary/20 hover:text-primary hover:border-primary/40 transition-all cursor-pointer whitespace-nowrap"
            >
              {chip}
            </button>
          ))}
        </div>

        <button
          onClick={toggleVoicePlayback}
          className={`p-1.5 rounded-lg border text-xs flex items-center gap-1 cursor-pointer transition-all ${
            isSpeaking ? 'bg-primary/20 border-primary text-primary animate-pulse' : 'bg-white/5 border-white/10 text-foreground/60'
          }`}
          title={isSpeaking ? 'Stop AI Voice' : 'Read AI Response Aloud'}
        >
          {isSpeaking ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>
      </div>

      {/* CHAT MESSAGES AREA */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 font-sans text-sm">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'bot' && (
              <div className="w-7 h-7 rounded-lg bg-primary/20 border border-primary/40 flex items-center justify-center text-primary flex-shrink-0">
                <Bot className="w-4 h-4" />
              </div>
            )}
            <div
              className={`max-w-[80%] rounded-xl p-3 shadow-lg ${
                msg.sender === 'user'
                  ? 'bg-primary text-black font-medium rounded-tr-none'
                  : 'bg-surface-dark/90 border border-white/10 text-foreground/90 rounded-tl-none'
              }`}
            >
              <div className="whitespace-pre-wrap leading-relaxed text-xs sm:text-sm">
                {msg.text}
              </div>

              {msg.actions && msg.actions.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2 pt-2 border-t border-white/10">
                  {msg.actions.map((act, idx) => (
                    <button
                      key={idx}
                      onClick={act.action}
                      className="text-xs px-3 py-1.5 rounded-lg bg-primary/20 text-primary border border-primary/40 hover:bg-primary hover:text-black transition-all flex items-center gap-1 font-semibold cursor-pointer"
                    >
                      {act.label} <ArrowUpRight className="w-3 h-3" />
                    </button>
                  ))}
                </div>
              )}

              <span className={`text-[10px] block mt-1 ${msg.sender === 'user' ? 'text-black/60 text-right' : 'text-foreground/40'}`}>
                {msg.timestamp}
              </span>
            </div>
            {msg.sender === 'user' && (
              <div className="w-7 h-7 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center text-foreground flex-shrink-0">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-3 justify-start">
            <div className="w-7 h-7 rounded-lg bg-primary/20 border border-primary/40 flex items-center justify-center text-primary">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-surface-dark/90 border border-white/10 p-3 rounded-xl rounded-tl-none text-xs text-foreground/60 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
              Raghul AI is processing response...
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* INPUT FORM WITH MIC BUTTON */}
      <form
        onSubmit={e => {
          e.preventDefault()
          handleSend()
        }}
        className="p-3 bg-surface-dark border-t border-white/10 flex gap-2 items-center"
      >
        <button
          type="button"
          onClick={toggleMic}
          className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-center ${
            isListening
              ? 'bg-red-500/20 border-red-500 text-red-400 animate-pulse'
              : 'bg-white/5 border-white/10 text-foreground/70 hover:bg-white/10 hover:text-primary'
          }`}
          title={isListening ? 'Listening... Speak now' : 'Voice Input (Click to Speak)'}
        >
          {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
        </button>

        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder={isListening ? 'Listening to voice...' : (lang === 'ta' ? 'ராகுல் AI இடம் கேளுங்கள்...' : 'Ask Raghul AI about projects, skills, education...')}
          className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-primary/60 text-xs sm:text-sm"
        />
        <button
          type="submit"
          disabled={!input.trim()}
          className="px-4 py-2.5 rounded-xl bg-primary text-black font-semibold hover:bg-primary-light disabled:opacity-40 transition-all flex items-center justify-center cursor-pointer"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  )
}
