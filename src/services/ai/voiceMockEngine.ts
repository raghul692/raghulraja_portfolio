export interface VoiceInterviewAnalysis {
  transcript: string
  wordCount: number
  fillerWordsFound: string[]
  technicalKeywordsFound: string[]
  confidenceScore: number
  paceRating: 'Too Slow' | 'Optimal Pace' | 'Fast Paced'
  feedback: string
}

const COMMON_FILLER_WORDS = ['um', 'uh', 'like', 'actually', 'basically', 'you know', 'sort of', 'kind of']
const TECHNICAL_KEYWORDS = [
  'react', 'typescript', 'python', 'fastapi', 'machine learning', 'ai', 'architecture',
  'database', 'api', 'state management', 'model', 'dataset', 'optimization', 'git', 'full stack'
]

export function analyzeSpokenResponse(transcript: string): VoiceInterviewAnalysis {
  const cleanLower = transcript.toLowerCase()
  const words = cleanLower.split(/\s+/).filter(Boolean)
  const wordCount = words.length

  // Find filler words
  const fillers = COMMON_FILLER_WORDS.filter(f => cleanLower.includes(f))

  // Find technical keywords
  const techFound = TECHNICAL_KEYWORDS.filter(t => cleanLower.includes(t))

  // Pace Rating
  let paceRating: 'Too Slow' | 'Optimal Pace' | 'Fast Paced' = 'Optimal Pace'
  if (wordCount < 10) paceRating = 'Too Slow'
  if (wordCount > 60) paceRating = 'Fast Paced'

  // Calculate Confidence Score
  let score = 70
  score += Math.min(techFound.length * 8, 25)
  score -= Math.min(fillers.length * 5, 20)
  if (wordCount >= 20 && wordCount <= 50) score += 10
  score = Math.max(40, Math.min(100, score))

  let feedback = 'Good articulate response with clear technical direction.'
  if (fillers.length > 0) {
    feedback = `Try reducing filler words (${fillers.join(', ')}). Speak with firm, steady confidence!`
  } else if (techFound.length >= 2) {
    feedback = `Excellent technical articulation! Highlighted key tools: ${techFound.join(', ')}.`
  }

  return {
    transcript,
    wordCount,
    fillerWordsFound: fillers,
    technicalKeywordsFound: techFound,
    confidenceScore: score,
    paceRating,
    feedback
  }
}
