export interface QuizQuestion {
  id: number
  category: 'python' | 'react' | 'ai' | 'aptitude' | 'sql'
  question: string
  options: string[]
  answerIndex: number
  explanation: string
}

export interface GDTopic {
  id: string
  title: string
  category: string
  overview: string
  proPoints: string[]
  conPoints: string[]
  conclusion: string
}

export interface HRQuestion {
  id: string
  question: string
  category: 'behavioral' | 'technical' | 'career' | 'star_method'
  sampleAnswer: string
  tips: string
  starBreakdown?: {
    situation: string
    task: string
    action: string
    result: string
  }
}

export const SAMPLE_QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    category: 'react',
    question: 'In React 19 / Modern React, what is the primary benefit of Server Components & automatic batching?',
    options: [
      'Increases bundle size for offline storage',
      'Reduces client-side JavaScript sent to browser and optimizes render performance',
      'Replaces CSS with JavaScript inline objects',
      'Prevents any state updates from occurring'
    ],
    answerIndex: 1,
    explanation: 'React Server Components render on the server, reducing the amount of JavaScript shipped to the client and improving performance.'
  },
  {
    id: 2,
    category: 'python',
    question: 'In Python, what is the key difference between list `.append()` and `.extend()`?',
    options: [
      '`.append()` adds an element as a single item; `.extend()` iterates over an iterable adding each element',
      '`.append()` modifies in place; `.extend()` returns a new list copy',
      '`.extend()` only works with string characters',
      'They are identical aliases in Python 3'
    ],
    answerIndex: 0,
    explanation: '`list.append(x)` appends object x as a single element, whereas `list.extend(iterable)` appends all elements from the iterable.'
  },
  {
    id: 3,
    category: 'ai',
    question: 'What metric is best suited for evaluating an imbalanced binary classification model (e.g., Rare Disease Detection)?',
    options: [
      'Accuracy',
      'F1-Score / PR-AUC',
      'Mean Squared Error (MSE)',
      'R-Squared'
    ],
    answerIndex: 1,
    explanation: 'Accuracy is misleading on imbalanced datasets. F1-Score (Precision vs Recall balance) and Precision-Recall AUC provide accurate evaluation.'
  },
  {
    id: 4,
    category: 'aptitude',
    question: 'If a train traveling at 60 km/h crosses a 200m platform in 24 seconds, what is the length of the train?',
    options: [
      '150 meters',
      '200 meters',
      '250 meters',
      '300 meters'
    ],
    answerIndex: 1,
    explanation: 'Speed = 60 * 5/18 = 50/3 m/s. Distance = Speed * Time = (50/3) * 24 = 400m. Train length = Total distance - Platform length = 400 - 200 = 200m.'
  },
  {
    id: 5,
    category: 'sql',
    question: 'Which SQL clause is used to filter aggregated group records after a GROUP BY clause?',
    options: [
      'WHERE',
      'ORDER BY',
      'HAVING',
      'FILTER'
    ],
    answerIndex: 2,
    explanation: 'The `HAVING` clause filters results created by `GROUP BY`, whereas `WHERE` filters rows before grouping.'
  }
]

export const GD_TOPICS: GDTopic[] = [
  {
    id: 'gd-1',
    title: 'AI vs Human Jobs: Will Generative AI replace Software Engineers?',
    category: 'Technology & AI',
    overview: 'Discussion on the impact of LLMs (Gemini, ChatGPT, Copilot) on developer productivity versus full displacement.',
    proPoints: [
      'Generative AI automates repetitive boilerplate, CRUD, and simple syntax debugging.',
      'Developers can focus on high-level system architecture, problem formulation, and business logic.',
      'Increases overall developer velocity by 30-50%.'
    ],
    conPoints: [
      'Requires strong code review skills as AI produces hallucinated or insecure code.',
      'Entry-level developer roles may evolve into prompt engineering and verification roles.',
      'Over-reliance on AI may weaken foundational problem-solving in junior engineers.'
    ],
    conclusion: 'AI will not replace software engineers; engineers using AI effectively will replace those who do not.'
  },
  {
    id: 'gd-2',
    title: 'Remote Work vs Office Work in Tech Industry',
    category: 'Corporate Work Culture',
    overview: 'Analyzing the flexibility of remote engineering teams versus in-person collaboration.',
    proPoints: [
      'Eliminates commuting time, enabling better work-life balance and deep focus time.',
      'Allows companies to hire top global talent regardless of geographical constraints.'
    ],
    conPoints: [
      'Spontaneous hallway conversations and whiteboarding sessions are harder to replicate online.',
      'Risk of burnout and blurred boundaries between work and personal life.'
    ],
    conclusion: 'Hybrid work model with flexible remote days offers the optimal balance of autonomy and team cohesion.'
  },
  {
    id: 'gd-3',
    title: 'Data Privacy vs AI Model Training Innovation',
    category: 'Ethics & Governance',
    overview: 'Evaluating public data scraping for LLM training versus individual copyright and privacy rights.',
    proPoints: [
      'Massive open training datasets drive groundbreaking medical and technical AI breakthroughs.',
      'Open models democratize AI capabilities across global communities.'
    ],
    conPoints: [
      'Risks exposing PII (Personally Identifiable Information) without user consent.',
      'Intellectual property infringement for creators and developers.'
    ],
    conclusion: 'Strict anonymization, synthetic data generation, and opt-out data governance frameworks are necessary.'
  }
]

export const HR_QUESTIONS: HRQuestion[] = [
  {
    id: 'hr-1',
    category: 'behavioral',
    question: 'Tell me about yourself and your background in Full-Stack and AI Engineering.',
    sampleAnswer: 'I am Raghul Raja M, a Computer Science Engineer with an 8.2 CGPA and hands-on experience as a Full Stack Developer Intern at TVK Technologies. I have developed over 16+ production projects, spanning AI-driven web apps like Wolf Sec 2X Finder, Aether Weather, and ChatBot AI. I specialize in React, Python, FastAPI, and Machine Learning.',
    tips: 'Use the Present-Past-Future formula. Focus on relevant technical projects and internship achievements.'
  },
  {
    id: 'hr-2',
    category: 'technical',
    question: 'Walk me through a challenging project you built and how you solved a technical blocker.',
    sampleAnswer: 'While building Wolf Sec 2X Finder, I had to ensure asynchronous vulnerability scanning across multi-format PDF/HTML reports without blocking the main event loop. I implemented Python concurrency with modular API handlers to process scans efficiently.',
    tips: 'Use the STAR method (Situation, Task, Action, Result) with quantitative metrics.',
    starBreakdown: {
      situation: 'Building multi-threaded vulnerability scanner for web applications.',
      task: 'Prevent UI event loop freezing during continuous async HTTP header requests.',
      action: 'Implemented Python asyncio worker queues and debounced state dispatches.',
      result: 'Achieved 4.2x faster scan completion speed with 0 latency lag.'
    }
  },
  {
    id: 'hr-3',
    category: 'career',
    question: 'Where do you see yourself in 3 to 5 years in software engineering?',
    sampleAnswer: 'In 3 to 5 years, I aim to be a Senior Full-Stack & AI Architect, leading technical design for high-scale microservices, driving AI RAG deployments, and mentoring junior engineers while maintaining code quality standards.',
    tips: 'Show commitment to technical mastery, leadership growth, and alignment with company goals.'
  }
]

export function evaluateGrammarSentence(text: string): { correctedText: string; feedback: string } {
  if (!text.trim()) {
    return { correctedText: '', feedback: 'Please enter a sentence to evaluate.' }
  }

  let corrected = text.trim()
  const notes: string[] = []

  // Check capitalization
  if (/^[a-z]/.test(corrected)) {
    corrected = corrected.charAt(0).toUpperCase() + corrected.slice(1)
    notes.push('Capitalized initial letter.')
  }

  // Check ending punctuation
  if (!/[.!?]$/.test(corrected)) {
    corrected += '.'
    notes.push('Added period at end of sentence.')
  }

  // Common technical grammar replacements
  if (corrected.includes('i builted')) {
    corrected = corrected.replace(/i builted/gi, 'I built')
    notes.push('Changed "builted" to "I built".')
  }
  if (corrected.includes('alot of')) {
    corrected = corrected.replace(/alot of/gi, 'a lot of')
    notes.push('Changed "alot" to "a lot".')
  }
  if (corrected.includes('i work on')) {
    corrected = corrected.replace(/i work on/gi, 'I worked on')
    notes.push('Adjusted past tense to "I worked on".')
  }

  return {
    correctedText: corrected,
    feedback: notes.length > 0 ? notes.join(' ') : 'Great technical grammar! Clear and professional.'
  }
}

export interface CompanyMockTrack {
  id: string
  company: string
  logo: string
  focus: string
  questions: string[]
}

export const COMPANY_MOCK_TRACKS: CompanyMockTrack[] = [
  {
    id: 'google',
    company: 'Google',
    logo: '🔍',
    focus: 'Data Structures, Scalability & System Architecture',
    questions: [
      'How would you design a low-latency globally distributed key-value store?',
      'Walk me through optimizing a O(N^2) dynamic programming algorithm to O(N log N).',
      'Describe how you handle race conditions in high-concurrency microservices.'
    ]
  },
  {
    id: 'amazon',
    company: 'Amazon',
    logo: '📦',
    focus: 'Leadership Principles (Customer Obsession, Ownership)',
    questions: [
      'Tell me about a time you made a critical technical decision with incomplete data (Bias for Action).',
      'Describe a situation where you had to dive deep to debug a production issue.',
      'How do you earn trust when leading a high-stakes engineering initiative?'
    ]
  },
  {
    id: 'zoho',
    company: 'Zoho',
    logo: '⚡',
    focus: 'Core Coding, C/Java Fundamentals & Database Efficiency',
    questions: [
      'Explain pointers vs references and memory allocation in C/C++.',
      'How would you design a database schema for an enterprise CRM system?',
      'Solve: Print a pattern matrix in O(N) space complexity.'
    ]
  },
  {
    id: 'tcs',
    company: 'TCS / Infosys',
    logo: '💼',
    focus: 'Aptitude, OOPS Concepts & Communication Clarity',
    questions: [
      'Explain Encapsulation, Polymorphism, and Inheritance with real-world examples.',
      'Where do you see yourself in 3 years as a Software Engineer?',
      'How do you prioritize deliverables when working on multiple client projects?'
    ]
  }
]

export function analyzeSpeechMetrics(text: string): { wpm: number; fillerCount: number; fillers: string[]; rating: string } {
  const words = text.trim().split(/\s+/).filter(Boolean)
  const count = words.length

  const fillerRegex = /\b(um|uh|like|you know|basically|actually|so|i mean)\b/gi
  const matches = text.match(fillerRegex) || []

  // Assume avg response time of 30 seconds -> wpm = count * 2
  const estimatedWpm = count * 2

  let rating = 'Optimal Pace (130-150 WPM)'
  if (estimatedWpm < 100) rating = 'Slower Pace (Consider increasing speaking speed)'
  if (estimatedWpm > 170) rating = 'Fast Pace (Pause for clarity)'

  return {
    wpm: Math.min(180, Math.max(70, estimatedWpm)),
    fillerCount: matches.length,
    fillers: Array.from(new Set(matches.map(m => m.toLowerCase()))),
    rating
  }
}
