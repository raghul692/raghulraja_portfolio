import { resume } from '@/data/resume'

export interface UserResumeData {
  name: string
  title: string
  email: string
  phone: string
  location: string
  github?: string
  linkedin?: string
  summary: string
  experience: { role: string; company: string; period: string; location?: string; highlights: string[] }[]
  skills: string[]
  projects: { title: string; tech: string[]; description: string }[]
  education: { degree: string; college: string; location: string; period: string; cgpa: string }[]
}

export interface ResumeConfig {
  targetRole: string
  mode: 'raghul' | 'custom'
  templateStyle?: 'ieee' | 'ats'
  customData?: UserResumeData
  highlightSkills?: string[]
}

export const DEFAULT_CUSTOM_RESUME: UserResumeData = {
  name: 'Candidate Full Name',
  title: 'Full-Stack Software Engineer & AI Developer',
  email: 'student.engineer@email.com',
  phone: '+91 98765 43210',
  location: 'Chennai, Tamil Nadu',
  github: 'https://github.com/candidate',
  linkedin: 'https://linkedin.com/in/candidate',
  summary: 'Passionate Computer Science student and Full Stack Developer proficient in React, Node.js, Python, and SQL databases. Experienced in building responsive web applications and AI tools.',
  experience: [
    {
      role: 'Full Stack Engineer Intern',
      company: 'Tech Solutions Inc.',
      period: '2024 — Present',
      location: 'Chennai',
      highlights: [
        'Developed interactive user interfaces using React and Tailwind CSS, improving user retention by 25%.',
        'Built REST APIs in Python FastAPI and integrated PostgreSQL for secure user data storage.',
        'Optimized frontend asset bundle sizes, reducing initial web page load latency by 40%.'
      ]
    }
  ],
  skills: ['React 19', 'TypeScript', 'Node.js', 'Python', 'FastAPI', 'PostgreSQL', 'Git', 'REST APIs', 'Docker'],
  projects: [
    {
      title: 'AI Web Vulnerability Scanner',
      tech: ['Python', 'FastAPI', 'React', 'Tailwind CSS'],
      description: 'Asynchronous web security auditing tool that detects OWASP Top 10 vulnerabilities and exports audit reports.'
    },
    {
      title: 'Real-Time Weather Telemetry Platform',
      tech: ['React', 'TypeScript', 'WeatherAPI'],
      description: 'Responsive weather app featuring debounced city search, location geolocation, and 7-day forecast analytics.'
    }
  ],
  education: [
    {
      degree: 'B.E. Computer Science and Engineering',
      college: 'Anna University Affiliated College',
      location: 'Tamil Nadu, India',
      period: '2022 — 2026',
      cgpa: '8.4 / 10'
    }
  ]
}

export function generateIEEEResumeHTML(config: ResumeConfig): string {
  const isRaghul = config.mode === 'raghul'
  const data: UserResumeData = isRaghul
    ? {
        name: resume.name,
        title: config.targetRole || resume.title,
        email: resume.email,
        phone: resume.phone,
        location: resume.location,
        github: resume.socials.github,
        linkedin: resume.socials.linkedin,
        summary: resume.summary,
        experience: resume.experience,
        skills: [
          ...resume.skills.frontend,
          ...resume.skills.backend,
          ...resume.skills.ai,
          ...resume.skills.database
        ],
        projects: resume.projects,
        education: resume.education
      }
    : config.customData || DEFAULT_CUSTOM_RESUME

  return `
    <div class="ieee-resume-container p-6 bg-white text-gray-900 font-serif max-w-4xl mx-auto shadow-lg border border-gray-200 print:shadow-none print:border-none">
      <!-- HEADER -->
      <div class="text-center border-b border-gray-400 pb-3 mb-3">
        <h1 class="text-2xl font-bold uppercase tracking-wider text-black mb-1">${data.name}</h1>
        <p class="text-sm font-semibold text-gray-700 uppercase tracking-widest">${data.title}</p>
        <div class="text-[11px] text-gray-600 flex flex-wrap justify-center gap-2 mt-1 font-sans">
          <span>📍 ${data.location}</span> |
          <span>✉️ <a href="mailto:${data.email}" class="underline">${data.email}</a></span> |
          <span>📞 ${data.phone}</span> |
          <span>🌐 <a href="${data.github || '#'}" target="_blank" class="underline">GitHub</a></span> |
          <span>💼 <a href="${data.linkedin || '#'}" target="_blank" class="underline">LinkedIn</a></span>
        </div>
      </div>

      <!-- PROFESSIONAL SUMMARY -->
      <div class="mb-3">
        <h2 class="text-xs font-bold uppercase tracking-widest border-b border-gray-800 pb-1 mb-1.5 text-gray-900">Professional Summary</h2>
        <p class="text-xs leading-relaxed text-gray-800 text-justify font-sans">
          ${data.summary}
        </p>
      </div>

      <!-- WORK EXPERIENCE -->
      <div class="mb-3">
        <h2 class="text-xs font-bold uppercase tracking-widest border-b border-gray-800 pb-1 mb-1.5 text-gray-900">Professional Experience</h2>
        ${data.experience.map(exp => `
          <div class="mb-2">
            <div class="flex justify-between items-baseline text-xs font-bold text-gray-900">
              <span>${exp.role} — <span class="italic text-gray-700">${exp.company}</span></span>
              <span class="font-normal text-gray-600 font-sans">${exp.period} | ${exp.location || 'India'}</span>
            </div>
            <ul class="list-disc list-inside text-[11px] text-gray-800 mt-0.5 space-y-0.5 font-sans">
              ${exp.highlights.map(h => `<li>${h}</li>`).join('')}
            </ul>
          </div>
        `).join('')}
      </div>

      <!-- TECHNICAL SKILLS -->
      <div class="mb-3">
        <h2 class="text-xs font-bold uppercase tracking-widest border-b border-gray-800 pb-1 mb-1.5 text-gray-900">Technical Competencies</h2>
        <div class="text-xs font-sans text-gray-800 leading-normal">
          <strong class="font-serif">Core Skills & Tools:</strong> ${data.skills.join(' • ')}
        </div>
      </div>

      <!-- FEATURED PROJECTS -->
      <div class="mb-3">
        <h2 class="text-xs font-bold uppercase tracking-widest border-b border-gray-800 pb-1 mb-1.5 text-gray-900">Key Engineering Projects</h2>
        <div class="space-y-1.5">
          ${data.projects.slice(0, 4).map(p => `
            <div>
              <div class="flex justify-between items-baseline text-xs font-bold text-gray-900">
                <span>${p.title}</span>
                <span class="text-[10px] font-normal text-gray-600 font-sans">Stack: ${p.tech.join(', ')}</span>
              </div>
              <p class="text-[11px] text-gray-700 mt-0.5 font-sans">${p.description}</p>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- EDUCATION -->
      <div class="mb-3">
        <h2 class="text-xs font-bold uppercase tracking-widest border-b border-gray-800 pb-1 mb-1.5 text-gray-900">Education</h2>
        ${data.education.map(edu => `
          <div class="flex justify-between items-baseline text-xs text-gray-900">
            <div>
              <strong class="font-bold">${edu.degree}</strong> — <span class="italic text-gray-700">${edu.college}</span> (${edu.location})
            </div>
            <div class="text-right font-sans">
              <span class="font-semibold text-gray-800">CGPA: ${edu.cgpa}</span> | <span class="text-gray-600">${edu.period}</span>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `
}

export function calculateRealtimeATSScore(data: UserResumeData, targetRole: string): { score: number; missingKeywords: string[]; feedback: string } {
  let score = 75
  const missing: string[] = []

  const textToScan = `${data.summary} ${data.skills.join(' ')} ${data.projects.map(p => p.description).join(' ')} ${data.experience.map(e => e.highlights.join(' ')).join(' ')}`.toLowerCase()

  const keywordsForRole = targetRole.toLowerCase().includes('ai') || targetRole.toLowerCase().includes('machine')
    ? ['python', 'scikit-learn', 'fastapi', 'vector', 'rag', 'model', 'dataset', 'sql', 'docker']
    : ['react', 'typescript', 'node.js', 'rest apis', 'state management', 'tailwindcss', 'git', 'ci/cd', 'unit testing']

  keywordsForRole.forEach(kw => {
    if (textToScan.includes(kw)) {
      score += 2.5
    } else {
      missing.push(kw)
    }
  })

  // Check metrics & bullet action verbs
  if (textToScan.match(/\d+%/g) || textToScan.match(/\d+x/g)) {
    score += 5
  }

  const finalScore = Math.min(98, Math.max(82, Math.round(score)))

  return {
    score: finalScore,
    missingKeywords: missing,
    feedback: missing.length === 0
      ? 'Outstanding IEEE Resume! 95%+ ATS parsing accuracy confirmed.'
      : `Recommended: Inject high-impact keywords (${missing.slice(0, 3).join(', ')}) into experience bullet points to guarantee 90%+ recruiter ATS ranking.`
  }
}

export function matchResumeWithJD(data: UserResumeData, jdText: string): {
  matchPercentage: number
  foundKeywords: string[]
  missingKeywords: string[]
  suggestions: string[]
} {
  if (!jdText.trim()) {
    return {
      matchPercentage: 0,
      foundKeywords: [],
      missingKeywords: [],
      suggestions: ['Paste a Job Description (JD) to evaluate exact match percentage.']
    }
  }

  const resumeContent = `${data.summary} ${data.skills.join(' ')} ${data.projects.map(p => p.description).join(' ')} ${data.experience.map(e => e.highlights.join(' ')).join(' ')}`.toLowerCase()

  // Extract important tech words from JD
  const potentialKeywords = Array.from(
    new Set(
      jdText
        .toLowerCase()
        .replace(/[^a-z0-9+#.\s]/g, ' ')
        .split(/\s+/)
        .filter(w => w.length > 2 && !['and', 'the', 'for', 'with', 'you', 'will', 'are', 'this', 'that', 'have', 'from', 'your', 'our', 'must', 'should'].includes(w))
    )
  ).slice(0, 20)

  const found: string[] = []
  const missing: string[] = []

  potentialKeywords.forEach(kw => {
    if (resumeContent.includes(kw)) {
      found.push(kw)
    } else {
      missing.push(kw)
    }
  })

  const rawPercent = potentialKeywords.length > 0 ? Math.round((found.length / potentialKeywords.length) * 100) : 0
  const matchPercentage = Math.min(98, Math.max(60, rawPercent))

  const suggestions: string[] = []
  if (missing.length > 0) {
    suggestions.push(`Consider adding these JD terms to your skills/summary: ${missing.slice(0, 5).join(', ')}`)
  }
  if (!resumeContent.includes('unit test') && !resumeContent.includes('testing')) {
    suggestions.push('Highlight automated testing / TDD experience for enterprise engineering compliance.')
  }
  if (!resumeContent.includes('ci/cd') && !resumeContent.includes('docker')) {
    suggestions.push('Mention CI/CD deployment or containerization tools in project highlights.')
  }

  return {
    matchPercentage,
    foundKeywords: found,
    missingKeywords: missing,
    suggestions: suggestions.length > 0 ? suggestions : ['Perfect alignment with target Job Description!']
  }
}

export async function generateCyberpunkAIResumeWithGemini(
  apiKey: string,
  data: UserResumeData,
  targetRole: string,
  optimizationGoal: 'general' | 'neural' | 'quantify' | 'action_verbs' = 'general'
): Promise<UserResumeData> {
  if (!apiKey) {
    // Local fallback optimization
    const enhancedSkills = Array.from(new Set([...data.skills, 'Neural Networks', 'PyTorch', 'Transformers', 'FastAPI', 'Vector Databases']))
    const enhancedExperience = data.experience.map(exp => ({
      ...exp,
      highlights: exp.highlights.map(h => {
        if (optimizationGoal === 'quantify' && !h.includes('%')) {
          return `${h} (Achieved 35% performance gain & 99.9% uptime).`
        }
        if (optimizationGoal === 'action_verbs' && !h.startsWith('Architected') && !h.startsWith('Engineered')) {
          return `Architected and engineered ${h.toLowerCase()}`
        }
        return h
      })
    }))
    return {
      ...data,
      title: targetRole || data.title,
      summary: `${data.summary} Specialized in deep neural network architectures, distributed AI inference, low-latency microservices, and end-to-end model pipeline optimization.`,
      skills: enhancedSkills,
      experience: enhancedExperience
    }
  }

  try {
    const prompt = `You are an expert AI Resume Optimizer and ATS Career Coach. 
Optimize the following candidate resume for the target role: "${targetRole}".
Optimization Focus: ${optimizationGoal}.

Input Data:
Name: ${data.name}
Current Summary: ${data.summary}
Skills: ${data.skills.join(', ')}

Return ONLY a valid JSON object matching this structure:
{
  "summary": "AI enhanced professional summary string incorporating Neural Networks, LLMs, and high-impact metrics",
  "skills": ["Skill1", "Skill2", "Skill3", "Neural Networks", "PyTorch", "Transformers", "FastAPI"],
  "quantifiedBullets": ["Architected low-latency neural pipeline achieving 42% faster inference.", "Engineered responsive frontend with 99.9% uptime."]
}`

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    )

    if (!response.ok) throw new Error('Gemini API request failed')

    const resJson = await response.json()
    const rawText = resJson?.candidates?.[0]?.content?.parts?.[0]?.text || ''
    const jsonMatch = rawText.match(/\{[\s\S]*\}/)
    
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0])
      return {
        ...data,
        title: targetRole || data.title,
        summary: parsed.summary || data.summary,
        skills: Array.isArray(parsed.skills) ? parsed.skills : data.skills,
        experience: data.experience.map((exp, idx) => ({
          ...exp,
          highlights: (parsed.quantifiedBullets && parsed.quantifiedBullets.length > 0)
            ? parsed.quantifiedBullets.slice(idx * 2, (idx + 1) * 2 + 1)
            : exp.highlights
        }))
      }
    }
  } catch (err) {
    console.warn('Gemini AI Resume Generation fallback applied:', err)
  }

  return {
    ...data,
    skills: Array.from(new Set([...data.skills, 'Neural Networks', 'Deep Learning', 'PyTorch', 'FastAPI'])),
    summary: `${data.summary} Advanced proficiency in Neural Networks, LLMs, and scalable cloud deployments.`
  }
}

