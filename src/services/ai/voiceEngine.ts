// Web Speech Recognition & SpeechSynthesis Helper Engine

export interface VoiceEngineState {
  isListening: boolean
  isSpeaking: boolean
  transcript: string
  error: string | null
}

// 1. Text-to-Speech (AI Speaking)
export function speakText(
  text: string,
  lang: 'en' | 'ta' = 'en',
  onStart?: () => void,
  onEnd?: () => void
) {
  if (!('speechSynthesis' in window)) {
    console.warn('Speech synthesis not supported in this browser.')
    return
  }

  // Stop any active speech
  window.speechSynthesis.cancel()

  // Clean markdown tags like **, ##, etc.
  const cleanText = text.replace(/[*#_`]/g, '').trim()

  const utterance = new SpeechSynthesisUtterance(cleanText)
  utterance.lang = lang === 'ta' ? 'ta-IN' : 'en-US'
  utterance.rate = 1.0
  utterance.pitch = 1.0

  if (onStart) utterance.onstart = onStart
  if (onEnd) utterance.onend = onEnd
  utterance.onerror = () => {
    if (onEnd) onEnd()
  }

  window.speechSynthesis.speak(utterance)
}

export function stopSpeaking() {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel()
  }
}

// 2. Speech-to-Text (Microphone Input)
export function createSpeechRecognizer(
  lang: 'en' | 'ta',
  onResult: (text: string) => void,
  onError: (err: string) => void,
  onEnd: () => void
) {
  const SpeechRecognition =
    (window as unknown as { SpeechRecognition?: unknown; webkitSpeechRecognition?: unknown })
      .SpeechRecognition ||
    (window as unknown as { SpeechRecognition?: unknown; webkitSpeechRecognition?: unknown })
      .webkitSpeechRecognition

  if (!SpeechRecognition) {
    onError('Speech recognition is not supported in this browser. Please use Chrome or Edge.')
    return null
  }

  const recognition = new (SpeechRecognition as any)()
  recognition.continuous = false
  recognition.interimResults = false
  recognition.lang = lang === 'ta' ? 'ta-IN' : 'en-US'

  recognition.onresult = (event: any) => {
    const transcript = event.results[0][0].transcript
    onResult(transcript)
  }

  recognition.onerror = (event: any) => {
    onError(event.error || 'Voice input error')
  }


  recognition.onend = () => {
    onEnd()
  }

  return recognition
}
