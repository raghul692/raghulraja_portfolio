export interface MCQQuestion {
  id: number
  category: 'Aptitude' | 'Logical' | 'Verbal' | 'DSA' | 'Python & ML' | 'Web & React'
  difficulty: 'Easy' | 'Medium' | 'Hard'
  question: string
  options: [string, string, string, string] // A, B, C, D
  correctOptionIndex: number // 0 for A, 1 for B, 2 for C, 3 for D
  explanation: string
}

// ---------------------------------------------------------------------------
// HAND-CRAFTED CORE HIGH-VALUE PLACEMENT QUESTIONS
// ---------------------------------------------------------------------------
const BASE_QUESTIONS: MCQQuestion[] = [
  // Aptitude
  {
    id: 1,
    category: 'Aptitude',
    difficulty: 'Easy',
    question: 'A train 150m long is running at a speed of 54 km/h. How much time will it take to cross a 120m long bridge?',
    options: ['12 seconds', '18 seconds', '20 seconds', '15 seconds'],
    correctOptionIndex: 1,
    explanation: 'Speed = 54 * (5/18) = 15 m/s. Total distance = 150 + 120 = 270m. Time = Distance / Speed = 270 / 15 = 18 seconds.'
  },
  {
    id: 2,
    category: 'Aptitude',
    difficulty: 'Medium',
    question: 'If A can complete a task in 10 days and B in 15 days, how long will they take working together?',
    options: ['5 days', '6 days', '7.5 days', '8 days'],
    correctOptionIndex: 1,
    explanation: 'A rate = 1/10 per day, B rate = 1/15 per day. Combined rate = 1/10 + 1/15 = 5/30 = 1/6. Time = 6 days.'
  },
  {
    id: 3,
    category: 'Aptitude',
    difficulty: 'Medium',
    question: 'An item is sold for $240 at a profit of 20%. What was the original cost price?',
    options: ['$180', '$190', '$200', '$210'],
    correctOptionIndex: 2,
    explanation: 'Selling Price = Cost Price * 1.20 => 240 = CP * 1.2 => CP = 240 / 1.2 = $200.'
  },
  {
    id: 4,
    category: 'Aptitude',
    difficulty: 'Hard',
    question: 'What is the compound interest on $5,000 for 2 years at 10% per annum compounded annually?',
    options: ['$1,000', '$1,050', '$1,100', '$1,025'],
    correctOptionIndex: 1,
    explanation: 'Amount = P(1 + r/100)^t = 5000 * (1.1)^2 = 5000 * 1.21 = $6,050. Interest = 6050 - 5000 = $1,050.'
  },

  // Logical Reasoning
  {
    id: 5,
    category: 'Logical',
    difficulty: 'Easy',
    question: 'Find the next number in the series: 2, 6, 12, 20, 30, ?',
    options: ['38', '40', '42', '44'],
    correctOptionIndex: 2,
    explanation: 'Pattern: +4, +6, +8, +10, +12. Next term = 30 + 12 = 42. (Or n*(n+1): 1*2, 2*3, 3*4, 4*5, 5*6, 6*7=42).'
  },
  {
    id: 6,
    category: 'Logical',
    difficulty: 'Medium',
    question: 'If "PYTHON" is coded as "QZUIPO", how is "JAVA" coded in the same scheme?',
    options: ['KBWB', 'KBCB', 'IZUZ', 'LAWB'],
    correctOptionIndex: 0,
    explanation: 'Shift each letter forward by +1: J->K, A->B, V->W, A->B = KBWB.'
  },

  // Verbal Ability
  {
    id: 7,
    category: 'Verbal',
    difficulty: 'Easy',
    question: 'Choose the word most OPPOSITE in meaning to "EXPEDITE":',
    options: ['Accelerate', 'Delay', 'Facilitate', 'Dispatch'],
    correctOptionIndex: 1,
    explanation: 'Expedite means to make an action or process happen sooner or be accomplished more quickly. The opposite is Delay.'
  },
  {
    id: 8,
    category: 'Verbal',
    difficulty: 'Medium',
    question: 'Select the grammatically correct sentence:',
    options: [
      'Neither the manager nor the employees was aware of the policy.',
      'Neither the manager nor the employees were aware of the policy.',
      'Neither the manager nor the employees is aware of the policy.',
      'Neither manager nor employees has been aware of policy.'
    ],
    correctOptionIndex: 1,
    explanation: 'When using "neither... nor...", the verb agrees with the subject closest to it ("employees" is plural -> "were").'
  },

  // DSA & Technical
  {
    id: 9,
    category: 'DSA',
    difficulty: 'Medium',
    question: 'What is the worst-case time complexity of Quick Sort?',
    options: ['O(N log N)', 'O(N)', 'O(N²)', 'O(log N)'],
    correctOptionIndex: 2,
    explanation: 'Worst-case occurs when the pivot is consistently the minimum or maximum element (e.g. sorted array), yielding O(N²).'
  },
  {
    id: 10,
    category: 'DSA',
    difficulty: 'Hard',
    question: 'Which data structure is ideal for implementing LRU (Least Recently Used) Cache with O(1) Operations?',
    options: [
      'Single Array + Hash Map',
      'Doubly Linked List + Hash Map',
      'Binary Search Tree + Stack',
      'Queue + Heap'
    ],
    correctOptionIndex: 1,
    explanation: 'A Hash Map provides O(1) key lookups, and a Doubly Linked List allows O(1) removal and insertion of nodes at head/tail.'
  },

  // Python & Machine Learning
  {
    id: 11,
    category: 'Python & ML',
    difficulty: 'Medium',
    question: 'In Python, what is the output of `bool([])` and `bool([0])`?',
    options: ['(False, False)', '(True, True)', '(False, True)', '(True, False)'],
    correctOptionIndex: 2,
    explanation: 'An empty list `[]` evaluates to `False`, while a non-empty list `[0]` evaluates to `True`.'
  },

  // Web & React
  {
    id: 12,
    category: 'Web & React',
    difficulty: 'Medium',
    question: 'What is the purpose of the `useCallback` hook in React?',
    options: [
      'To memoize the result of an expensive calculation',
      'To memoize a callback function instance between re-renders',
      'To trigger side-effects asynchronously',
      'To subscribe to WebSocket connections'
    ],
    correctOptionIndex: 1,
    explanation: '`useCallback` returns a memoized version of the callback function that only changes if one of the dependencies has changed.'
  }
]

// ---------------------------------------------------------------------------
// DYNAMIC PROCEDURAL GENERATION TO BUILD A 500-QUESTION BANK
// ---------------------------------------------------------------------------
export const PLACEMENT_QUIZ_DATA: MCQQuestion[] = [...BASE_QUESTIONS]

const CATEGORIES: MCQQuestion['category'][] = [
  'Aptitude',
  'Logical',
  'Verbal',
  'DSA',
  'Python & ML',
  'Web & React'
]

// Aptitude Templates
const APTITUDE_TEMPLATES = [
  (idx: number) => {
    const s1 = 40 + (idx % 30)
    const s2 = 10 + (idx % 15)
    const d = (s1 + s2) * 2
    return {
      q: `Two cars start from points A and B separated by ${d} km toward each other at speeds of ${s1} km/h and ${s2} km/h. How long before they meet?`,
      opts: [`2 hours`, `1.5 hours`, `3 hours`, `2.5 hours`] as [string, string, string, string],
      ans: 0,
      exp: `Relative speed when moving in opposite directions = ${s1} + ${s2} = ${s1 + s2} km/h. Time = ${d} / ${s1 + s2} = 2 hours.`
    }
  },
  (idx: number) => {
    const p = 1000 + (idx % 10) * 500
    const r = 5 + (idx % 5)
    const si = (p * r * 3) / 100
    return {
      q: `What is the Simple Interest on $${p} at ${r}% per annum for 3 years?`,
      opts: [`$${si}`, `$${si + 50}`, `$${si - 30}`, `$${si + 100}`] as [string, string, string, string],
      ans: 0,
      exp: `Simple Interest = (P * R * T) / 100 = (${p} * ${r} * 3) / 100 = $${si}.`
    }
  },
  (idx: number) => {
    const cp = 50 + (idx % 20) * 10
    const profitPct = 10 + (idx % 4) * 5
    const sp = cp * (1 + profitPct / 100)
    return {
      q: `A seller buys a product for $${cp} and sells it at a ${profitPct}% profit. What is the selling price?`,
      opts: [`$${sp}`, `$${sp + 10}`, `$${sp - 5}`, `$${sp + 15}`] as [string, string, string, string],
      ans: 0,
      exp: `SP = CP * (1 + Profit%/100) = ${cp} * (1 + ${profitPct}/100) = $${sp}.`
    }
  }
]

// Logical Templates
const LOGICAL_TEMPLATES = [
  (idx: number) => {
    const start = 2 + (idx % 10)
    const step = 3 + (idx % 5)
    const seq = [start, start + step, start + 2 * step, start + 3 * step]
    const nextVal = start + 4 * step
    return {
      q: `Find the missing term in the arithmetic progression: ${seq.join(', ')}, ?`,
      opts: [`${nextVal}`, `${nextVal + 2}`, `${nextVal - 3}`, `${nextVal + 5}`] as [string, string, string, string],
      ans: 0,
      exp: `Common difference d = ${step}. Next term = ${seq[3]} + ${step} = ${nextVal}.`
    }
  },
  (_idx: number) => {
    return {
      q: `Pointing to a photograph, a person says "He is the son of the only daughter of my mother". How is the person related to the man in photo?`,
      opts: [`Mother`, `Uncle / Aunt`, `Sister`, `Grandmother`] as [string, string, string, string],
      ans: 0,
      exp: `Only daughter of my mother = Myself (if female) or My sister. Thus the person in the photo is her son, making the speaker his Mother.`
    }
  }
]

// Verbal Templates
const VERBAL_TEMPLATES = [
  (idx: number) => {
    const words = [
      { w: 'METICULOUS', syn: 'Careful / Precise', opp: 'Careless' },
      { w: 'CANDID', syn: 'Frank / Honest', opp: 'Evasive' },
      { w: 'PRAGMATIC', syn: 'Practical', opp: 'Idealistic' },
      { w: 'PERSEVERANCE', syn: 'Persistence', opp: 'Apathy' },
      { w: 'LUCID', syn: 'Clear / Intelligible', opp: 'Obscure' }
    ]
    const item = words[idx % words.length]
    return {
      q: `What is the antonym of "${item.w}"?`,
      opts: [item.opp, item.syn, 'Ambiguous', 'Resilient'] as [string, string, string, string],
      ans: 0,
      exp: `The word "${item.w}" means ${item.syn}. The direct antonym is ${item.opp}.`
    }
  }
]

// DSA Templates
const DSA_TEMPLATES = [
  (idx: number) => {
    const dsaTopics = [
      { topic: 'Binary Search', complexity: 'O(log N)', bestFor: 'Sorted Arrays' },
      { topic: 'Heap Sort', complexity: 'O(N log N)', bestFor: 'In-place sorting with O(1) auxiliary space' },
      { topic: 'Dijkstra Algorithm', complexity: 'O((V + E) log V)', bestFor: 'Single source shortest path on non-negative weighted graphs' },
      { topic: 'Floyd-Warshall Algorithm', complexity: 'O(V³)', bestFor: 'All-pairs shortest path problem' },
      { topic: 'BFS (Breadth First Search)', complexity: 'O(V + E)', bestFor: 'Shortest path in unweighted graphs' }
    ]
    const item = dsaTopics[idx % dsaTopics.length]
    return {
      q: `What is the time complexity and primary use case for ${item.topic}?`,
      opts: [
        `${item.complexity} — ${item.bestFor}`,
        `O(N²) — Linear search in unsorted lists`,
        `O(2^N) — Exponential brute force evaluation`,
        `O(1) — Direct index lookup`
      ] as [string, string, string, string],
      ans: 0,
      exp: `${item.topic} operates in ${item.complexity} time complexity and is best suited for ${item.bestFor}.`
    }
  }
]

// Python & ML Templates
const PYTHON_ML_TEMPLATES = [
  (idx: number) => {
    const pythonTopics = [
      { concept: 'GIL (Global Interpreter Lock)', detail: 'Prevents multiple native threads from executing Python bytecodes in parallel in CPython.' },
      { concept: 'List Comprehension', detail: 'Provides a concise syntax to create lists based on existing iterables.' },
      { concept: 'Overfitting in ML', detail: 'Occurs when a model learns training noise, leading to high training accuracy but low test accuracy.' },
      { concept: 'L2 Regularization (Ridge)', detail: 'Adds sum of squared weights penalty to loss function to penalize large weights.' },
      { concept: 'ReLU Activation Function', detail: 'Returns f(x) = max(0, x), preventing vanishing gradients in deep networks.' }
    ]
    const item = pythonTopics[idx % pythonTopics.length]
    return {
      q: `In Python & AI Engineering, what defines "${item.concept}"?`,
      opts: [
        item.detail,
        'A garbage collection sweep mechanism for static variables',
        'A browser DOM rendering optimization technique',
        'An encryption handshake protocol'
      ] as [string, string, string, string],
      ans: 0,
      exp: `"${item.concept}" is defined as: ${item.detail}`
    }
  }
]

// Web & React Templates
const WEB_REACT_TEMPLATES = [
  (idx: number) => {
    const reactTopics = [
      { concept: 'Virtual DOM', desc: 'Lightweight in-memory representation of real DOM that React diffs to optimize rendering updates.' },
      { concept: 'useMemo Hook', desc: 'Memoizes the computed result of a function to prevent recalculation on every render.' },
      { concept: 'CORS (Cross-Origin Resource Sharing)', desc: 'Browser security mechanism that controls HTTP requests originating from different domains.' },
      { concept: 'CSS Flexbox `justify-content: space-between`', desc: 'Distributes items evenly with the first item at start and last item at end.' },
      { concept: 'React 18 Concurrent Rendering', desc: 'Allows React to interrupt, pause, or resume component tree rendering for responsive UX.' }
    ]
    const item = reactTopics[idx % reactTopics.length]
    return {
      q: `In Web Development & React Architecture, what is the core role of "${item.concept}"?`,
      opts: [
        item.desc,
        'A SQL database indexing technique for relational joins',
        'A WebGL GPU shader compiler pipeline',
        'A mobile Bluetooth pairing protocol'
      ] as [string, string, string, string],
      ans: 0,
      exp: `"${item.concept}" functions as: ${item.desc}`
    }
  }
]

// Populate up to Question #500
const startId = BASE_QUESTIONS.length + 1
for (let id = startId; id <= 500; id++) {
  const cat = CATEGORIES[(id - 1) % CATEGORIES.length]
  const difficulty: MCQQuestion['difficulty'] = id % 3 === 0 ? 'Hard' : id % 2 === 0 ? 'Medium' : 'Easy'

  let generatedData: { q: string; opts: [string, string, string, string]; ans: number; exp: string }

  if (cat === 'Aptitude') {
    generatedData = APTITUDE_TEMPLATES[(id - 1) % APTITUDE_TEMPLATES.length](id)
  } else if (cat === 'Logical') {
    generatedData = LOGICAL_TEMPLATES[(id - 1) % LOGICAL_TEMPLATES.length](id)
  } else if (cat === 'Verbal') {
    generatedData = VERBAL_TEMPLATES[(id - 1) % VERBAL_TEMPLATES.length](id)
  } else if (cat === 'DSA') {
    generatedData = DSA_TEMPLATES[(id - 1) % DSA_TEMPLATES.length](id)
  } else if (cat === 'Python & ML') {
    generatedData = PYTHON_ML_TEMPLATES[(id - 1) % PYTHON_ML_TEMPLATES.length](id)
  } else {
    generatedData = WEB_REACT_TEMPLATES[(id - 1) % WEB_REACT_TEMPLATES.length](id)
  }

  PLACEMENT_QUIZ_DATA.push({
    id,
    category: cat,
    difficulty,
    question: `Q${id} (${cat}): ${generatedData.q}`,
    options: generatedData.opts,
    correctOptionIndex: generatedData.ans,
    explanation: generatedData.exp
  })
}
