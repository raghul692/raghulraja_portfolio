export interface ATSReport {
  overallScore: number // 0 - 100
  keywordScore: number
  formattingScore: number
  impactScore: number
  seniorityScore: number
  atsEngineEmulated: string
  matchedKeywords: string[]
  missingKeywords: string[]
  partialKeywords: string[]
  parsabilityWarnings: string[]
  strengths: string[]
  improvements: string[]
  bulletPointFixes: { original: string; suggested: string }[]
  targetRoleSummarySuggestion?: string
}

// Extensive dictionary of industry standard technical & domain keywords across tech tracks
const INDUSTRY_ROLE_KEYWORDS: Record<string, string[]> = {
  'fullstack': ['React', 'TypeScript', 'Node.js', 'Express', 'Python', 'FastAPI', 'REST API', 'MySQL', 'MongoDB', 'Docker', 'Git', 'Tailwind CSS', 'System Design'],
  'frontend': ['React', 'Vue', 'Angular', 'TypeScript', 'JavaScript', 'HTML5', 'CSS3', 'Tailwind CSS', 'Framer Motion', 'Redux', 'Zustand', 'Vite', 'UI/UX', 'Accessibility'],
  'backend': ['Python', 'Java', 'Node.js', 'FastAPI', 'Express', 'Spring Boot', 'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Docker', 'Kubernetes', 'Microservices', 'REST API', 'GraphQL'],
  'ai_ml': ['Python', 'Machine Learning', 'Deep Learning', 'PyTorch', 'TensorFlow', 'Scikit-Learn', 'FastAPI', 'Pandas', 'NumPy', 'OpenCV', 'NLP', 'Computer Vision', 'Model Deployment'],
  'devops': ['Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP', 'CI/CD', 'GitHub Actions', 'Terraform', 'Linux', 'Bash', 'Prometheus', 'Grafana', 'Nginx'],
  'data_analyst': ['SQL', 'Python', 'PowerBI', 'Tableau', 'Pandas', 'Excel', 'Data Visualization', 'Statistics', 'ETL Pipelines', 'BigQuery'],
  'mobile': ['React Native', 'Flutter', 'Swift', 'Kotlin', 'iOS', 'Android', 'REST API', 'State Management', 'App Store Deployment'],
  'qa_automation': ['Selenium', 'Cypress', 'Playwright', 'Jest', 'Python', 'Java', 'Test Automation', 'API Testing', 'Postman', 'CI/CD']
}

const GLOBAL_TECH_KEYWORDS = [
  'React', 'React.js', 'TypeScript', 'JavaScript', 'Python', 'Machine Learning', 'AI', 'FastAPI',
  'Node.js', 'Express', 'HTML5', 'CSS3', 'Tailwind CSS', 'Git', 'GitHub', 'REST API',
  'MySQL', 'MongoDB', 'Docker', 'AWS', 'Vite', 'State Management', 'Redux', 'Zustand',
  'Unit Testing', 'CI/CD', 'UI/UX', 'Figma', 'System Design', 'Algorithms', 'Data Structures',
  'Deep Learning', 'PyTorch', 'TensorFlow', 'PostgreSQL', 'Microservices', 'Agile', 'Kubernetes',
  'Java', 'Spring Boot', 'C++', 'SQL', 'NoSQL', 'Linux', 'Cloud', 'GraphQL', 'Jest', 'Cypress'
]

// Dynamic NLP keyword extraction from user's custom JD
function extractKeywordsFromJD(jdText: string): string[] {
  if (!jdText || jdText.trim().length < 15) {
    return GLOBAL_TECH_KEYWORDS.slice(0, 15)
  }

  const jdLower = jdText.toLowerCase()
  
  // 1. Filter known global tech keywords present in JD
  const foundGlobal = GLOBAL_TECH_KEYWORDS.filter(k => jdLower.includes(k.toLowerCase()))

  // 2. Extract capitalized multi-word terms & phrases from JD
  const customWords: string[] = []
  const matches = jdText.match(/\b[A-Z][a-zA-Z0-9+#.]{2,}\b/g)
  if (matches) {
    matches.forEach(w => {
      if (!['The', 'And', 'For', 'With', 'Your', 'Must', 'Have', 'Will', 'Looking', 'Seeking', 'Required', 'Experience', 'Responsibilities', 'Qualifications'].includes(w)) {
        if (!foundGlobal.includes(w) && !customWords.includes(w)) {
          customWords.push(w)
        }
      }
    })
  }

  const combined = Array.from(new Set([...foundGlobal, ...customWords]))
  return combined.length > 5 ? combined : GLOBAL_TECH_KEYWORDS.slice(0, 15)
}

export function analyzeATSResume(
  resumeText: string,
  jobDescriptionText: string = '',
  engineType: 'workday' | 'greenhouse' | 'ai_ranker' = 'workday',
  targetJobTitle: string = 'Full-Stack Developer'
): ATSReport {
  const text = resumeText.toLowerCase()

  // 1. Dynamic Keyword Extraction & Match
  let targetKeywords = extractKeywordsFromJD(jobDescriptionText)

  // Merge with role specific keywords if job title matches dictionary
  const titleKey = Object.keys(INDUSTRY_ROLE_KEYWORDS).find(k => targetJobTitle.toLowerCase().replace(/[^a-z]/g, '').includes(k))
  if (titleKey && INDUSTRY_ROLE_KEYWORDS[titleKey]) {
    targetKeywords = Array.from(new Set([...targetKeywords, ...INDUSTRY_ROLE_KEYWORDS[titleKey]]))
  }

  const matched: string[] = []
  const missing: string[] = []
  const partial: string[] = []

  targetKeywords.forEach(kw => {
    const kwLower = kw.toLowerCase()
    if (text.includes(kwLower)) {
      matched.push(kw)
    } else if (text.split(/\s+/).some(word => word.length > 3 && kwLower.includes(word))) {
      partial.push(kw)
    } else {
      missing.push(kw)
    }
  })

  let keywordScore = Math.min(100, Math.round((matched.length / Math.max(1, targetKeywords.length)) * 100))
  if (engineType === 'greenhouse') keywordScore = Math.min(100, keywordScore + 10)

  // 2. Formatting & Parsability Warnings Engine
  const parsabilityWarnings: string[] = []
  const requiredSections = ['experience', 'education', 'skills', 'projects', 'contact']
  const matchedSections = requiredSections.filter(sec => text.includes(sec))
  
  if (!text.includes('email') && !/@/.test(text)) {
    parsabilityWarnings.push('Missing explicit Email Address contact field.')
  }
  if (!text.includes('phone') && !/\d{10}|\+91/.test(text)) {
    parsabilityWarnings.push('Missing explicit Phone Number field.')
  }
  if (!text.includes('linkedin') && !text.includes('github')) {
    parsabilityWarnings.push('No LinkedIn or GitHub portfolio URLs detected.')
  }
  if (matchedSections.length < 4) {
    parsabilityWarnings.push('Standard ATS headers (Experience, Projects, Education, Skills) are incomplete.')
  }

  const formattingScore = Math.max(20, Math.round(((matchedSections.length / requiredSections.length) * 80) + (parsabilityWarnings.length === 0 ? 20 : 0)))

  // 3. Impact & Metric Bullet Analysis
  const actionVerbs = ['developed', 'built', 'created', 'optimized', 'implemented', 'designed', 'increased', 'reduced', 'integrated', 'architected', 'spearheaded', 'automated', 'engineered']
  const matchedVerbs = actionVerbs.filter(verb => text.includes(verb))
  const hasNumbers = /\d+%|\d+\+|\$\d+|\d+x/.test(text)
  
  const impactScore = Math.min(100, (matchedVerbs.length * 9) + (hasNumbers ? 25 : 5))

  // 4. Seniority & Match Fit
  const seniorityScore = text.includes('lead') || text.includes('architect') ? 95 : text.includes('intern') || text.includes('developer') ? 85 : 75

  // 5. Overall Weighted Calculation based on Engine
  let overallScore = 0
  let engineName = 'Workday / Taleo Standard Parser'

  if (engineType === 'workday') {
    engineName = 'Workday / Taleo Enterprise Parser (Strict Keyword & Section Scan)'
    overallScore = Math.round((keywordScore * 0.55) + (formattingScore * 0.30) + (impactScore * 0.15))
  } else if (engineType === 'greenhouse') {
    engineName = 'Greenhouse / Lever Modern Matcher (Impact & Verb Weighting)'
    overallScore = Math.round((keywordScore * 0.40) + (impactScore * 0.40) + (formattingScore * 0.20))
  } else {
    engineName = 'AI Candidate Vector Ranker (Semantic Context Match)'
    overallScore = Math.round((keywordScore * 0.45) + (impactScore * 0.35) + (seniorityScore * 0.20))
  }

  // 6. Strengths & Improvements
  const strengths: string[] = []
  const improvements: string[] = []

  if (keywordScore >= 75) strengths.push(`High keyword match for ${targetJobTitle} (${matched.length} core keywords matched).`)
  else improvements.push(`Add essential keywords for ${targetJobTitle} role to pass initial ATS filters.`)

  if (formattingScore >= 80) strengths.push('Clean ATS structural parsing with standard section headers.')
  else improvements.push('Use explicit ATS section titles: "Work Experience", "Technical Skills", "Projects", "Education".')

  if (matchedVerbs.length >= 4) strengths.push(`Strong action verbs used (${matchedVerbs.slice(0, 4).join(', ')}).`)
  else improvements.push('Replace generic verbs with strong action words (e.g. "Architected", "Engineered", "Optimized").')

  if (hasNumbers) strengths.push('Bullet points contain quantifiable metrics and numerical impact.')
  else improvements.push('Add metrics to bullet points (e.g., "Reduced loading time by 35%", "Built 16+ projects").')

  if (missing.length > 0) {
    improvements.push(`Include high-priority missing keywords: ${missing.slice(0, 5).join(', ')}.`)
  }

  // 7. Bullet Point Optimizations
  const bulletPointFixes = [
    {
      original: 'Worked on software development projects and web apps.',
      suggested: `Engineered high-performance applications tailored for ${targetJobTitle} role using ${matched.slice(0, 2).join(', ') || 'React & Node.js'}, delivering 30% metric growth.`
    },
    {
      original: 'Responsible for building models and database logic.',
      suggested: `Architected scalable backend & data pipelines, optimizing query performance by 40%.`
    }
  ]

  // 8. Custom AI Summary Suggestion for Top of Resume
  const topKeywordsStr = matched.length > 0 ? matched.slice(0, 4).join(', ') : 'modern tech stacks'
  const targetRoleSummarySuggestion = `Results-driven ${targetJobTitle} with expertise in ${topKeywordsStr}. Proven track record of engineering scalable applications, optimizing workflow performance, and delivering high-impact solutions.`

  return {
    overallScore: Math.min(100, overallScore),
    keywordScore,
    formattingScore,
    impactScore,
    seniorityScore,
    atsEngineEmulated: engineName,
    matchedKeywords: matched,
    missingKeywords: missing.slice(0, 12),
    partialKeywords: partial.slice(0, 5),
    parsabilityWarnings,
    strengths,
    improvements,
    bulletPointFixes,
    targetRoleSummarySuggestion
  }
}
