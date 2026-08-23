import { resume } from '@/data/resume'

export interface ChatMessage {
  id: string
  sender: 'user' | 'bot'
  text: string
  timestamp: string
  actions?: { label: string; action: () => void | string }[]
}

export type RecruiterPersona = 'hr' | 'tech_lead' | 'founder' | 'general'

export const QUICK_SUGGESTIONS_EN = [
  'What is Python and how does Raghul use it?',
  'Explain Data Structures & Algorithms (DSA)',
  'How does Artificial Intelligence (AI) work?',
  'What is Raghul\'s experience at TVK Technologies?',
  'List all 16+ projects with GitHub links',
]

export const QUICK_SUGGESTIONS_TA = [
  'Python என்றால் என்ன? ராகுல் அதை எப்படி பயன்படுத்துகிறார்?',
  'Data Structures & Algorithms என்றால் என்ன?',
  'Artificial Intelligence (AI) எவ்வாறு இயங்குகிறது?',
  'TVK Technologies அனுபவம் பற்றிச் சொல்',
  '16+ புராஜெக்ட்கள் பட்டியல் மற்றும் GitHub லிங்க்',
]

// Comprehensive General Tech & Career Concept Explanations KB (Offline Fallback)
const CONCEPT_KB: Array<{
  keys: string[]
  en: string
  ta: string
  relateEn: string
  relateTa: string
  actionLabel: string
  actionTarget: string
}> = [
  {
    keys: ['python', 'パイソン'],
    en: '🐍 **Python** is a high-level, interpreted programming language known for clean readability and massive adoption in AI, Machine Learning, Data Science, Backend APIs, and Automation.',
    ta: '🐍 **Python** என்பது AI, Machine Learning, Data Science, மற்றும் வெப் டெவலப்மென்ட்டில் பரவலாகப் பயன்படுத்தப்படும் ஒரு முன்னணி புரோகிராமிங் மொழியாகும்.',
    relateEn: 'Raghul extensively uses Python for ML models (Multi-Disease Prediction System), security automation scripts (Wolf Sec 2X Finder), and 500+ DSA algorithmic solutions.',
    relateTa: 'ராகுல் தனது Multi-Disease Prediction System, Wolf Sec 2X Finder, மற்றும் 500+ DSA கணக்குகளில் Python-ஐ அதிகமாகப் பயன்படுத்துகிறார்.',
    actionLabel: '🐍 View Python Projects',
    actionTarget: 'SCROLL_PROJECTS'
  },
  {
    keys: ['dsa', 'data structure', 'algorithm', 'array', 'binary tree', 'graph', 'dynamic programming', 'தரவு அமைப்பு'],
    en: '⚡ **Data Structures & Algorithms (DSA)** represent foundational computer science concepts for storing data efficiently (HashSets, Trees, Graphs) and solving problems with optimal O(N) time & space complexity.',
    ta: '⚡ **Data Structures & Algorithms (DSA)** என்பது மென்பொருள் உருவாக்கத்தின் அடிப்படை. இது தரவுகளை திறம்பட சேமிக்கவும், வேகமான Time & Space Complexity-ல் தீர்வுகளை உருவாக்கவும் உதவுகிறது.',
    relateEn: 'Raghul has solved hundreds of algorithms and architected a 500-Problem Competitive DSA Code Arena right inside this portfolio!',
    relateTa: 'ராகுல் 500+ DSA கணக்குகளை தீர்த்து, இந்த Portfolio-வில் 500-Problem DSA Code Arena-வை உருவாக்கியுள்ளார்!',
    actionLabel: '⚡ Open 500 DSA Arena',
    actionTarget: 'SCROLL_PROJECTS'
  },
  {
    keys: ['ai', 'machine learning', 'artificial intelligence', 'ml', 'deep learning', 'neural', 'rag', 'llm', 'செயற்கை நுண்ணறிவு'],
    en: '🤖 **Artificial Intelligence (AI) & Machine Learning (ML)** enable software systems to analyze data patterns, make predictive decisions, process natural language (NLP), and run RAG engines.',
    ta: '🤖 **Artificial Intelligence (AI)** என்பது தரவுகளில் (Data) இருந்து கற்றுக்கொண்டு தானாகவே அறிவாரந்த முடிவுகளை எடுக்கக்கூடிய அமைப்பாகும்.',
    relateEn: 'Raghul has engineered 5+ production AI products including Aetheris AI ChatBot, Client-Side RAG Portfolio Search, and Medical Prediction ML Models.',
    relateTa: 'ராகுல் Aetheris AI ChatBot, RAG Engine, மற்றும் மருத்துவ கணிப்பு AI மாடல்கள் என 5-க்கும் மேற்பட்ட AI அப்ளிகேஷன்களை உருவாக்கியுள்ளார்.',
    actionLabel: '🤖 Explore AI Applications',
    actionTarget: 'SCROLL_PROJECTS'
  },
  {
    keys: ['react', 'vite', 'next', 'frontend', 'ui', 'tailwind', 'component', 'இணையதளம்'],
    en: '⚛️ **React & Modern Frontend Stack** enable component-driven UI architecture with reactive state management, Virtual DOM optimization, and high performance.',
    ta: '⚛️ **React** என்பது வேகமான, நவீன இணையதளங்களை உருவாக்கப் பயன்படும் முன்னணி JavaScript லைப்ரரியாகும்.',
    relateEn: 'Raghul engineered this interactive AI Portfolio and multiple web applications using React, Vite, TypeScript, and Tailwind CSS.',
    relateTa: 'ராகுல் இந்த முழு Portfolio AI தளத்தையும் React, Vite, மற்றும் Tailwind CSS கொண்டு உருவாக்கியுள்ளார்.',
    actionLabel: '⚛️ View React & Frontend Stack',
    actionTarget: 'SCROLL_SKILLS'
  },
  {
    keys: ['js', 'javascript', 'ts', 'typescript'],
    en: '🟨 **JavaScript & TypeScript** provide type-safe, asynchronous execution across modern browsers and Node.js backend environments.',
    ta: '🟨 **JavaScript & TypeScript** என்பது நவீன வெப் அப்ளிகேஷன்களை உருவாக்குவதற்கான முதன்மை மொழியாகும்.',
    relateEn: 'Raghul writes clean, production-grade TypeScript with strict type checking across all full-stack applications.',
    relateTa: 'ராகுல் தனது அனைத்து Full-Stack திட்டங்களிலும் TypeScript-ஐ பயன்படுத்தி சுத்தமான கோட்களை எழுதுகிறார்.',
    actionLabel: '🟨 View JS/TS Skills',
    actionTarget: 'SCROLL_SKILLS'
  },
  {
    keys: ['sql', 'database', 'postgres', 'mysql', 'mongodb'],
    en: '🛢️ **Databases & SQL** handle persistent data modeling, indexed query optimizations, relational schemas, and document store transactions.',
    ta: '🛢️ **SQL & Databases** என்பது தரவுத்தளங்களில் தரவுகளை திறம்பட சேமித்து, விவரித்து, பெற பயன்படும் தொழில்நுட்பமாகும்.',
    relateEn: 'Raghul designs optimized relational schemas and handles database connectivity across full-stack applications.',
    relateTa: 'ராகுல் PostgreSQL மற்றும் MySQL மூலம் தரவுத்தளங்களை திறம்பட நிர்வகிக்கிறார்.',
    actionLabel: '🛢️ View Database Stack',
    actionTarget: 'SCROLL_SKILLS'
  },
  {
    keys: ['security', 'cybersecurity', 'wolf', 'vulnerability', 'hacking'],
    en: '🛡️ **Cybersecurity & Vulnerability Assessment** focus on identifying security flaws, automating penetration scans, and securing web applications against threats.',
    ta: '🛡️ **Cybersecurity** என்பது இணையதளங்கள் மற்றும் கணினி அமைப்புகளின் பாதுகாப்பை உறுதி செய்யும் துறையாகும்.',
    relateEn: 'Raghul created "Wolf Sec 2X Finder", a specialized security testing automation tool for web application vulnerability discovery.',
    relateTa: 'ராகுல் "Wolf Sec 2X Finder" என்ற பிரத்யேக பாதுகாப்பு சோதனை அப்ளிகேஷனை உருவாக்கியுள்ளார்.',
    actionLabel: '🛡️ View Wolf Sec Tool',
    actionTarget: 'SCROLL_PROJECTS'
  },
  {
    keys: ['interview', 'aptitude', 'placement', 'quiz', 'resume', 'ieee'],
    en: '📝 **Technical Interview & Placement Prep** involves mastering coding problem solving, core computer science concepts, and ATS-optimized resume building.',
    ta: '📝 **Technical Interview & Placement Prep** என்பது வேலைவாய்ப்பு நேர்காணல்கள் மற்றும் ஆப்டிடியூட் தேர்வுகளுக்கு தயார் செய்யும் வழிமுறையாகும்.',
    relateEn: 'Raghul embedded IEEE Resume Builder, Placement Quiz (500+ Questions), and ATS Analyzer directly inside this portfolio!',
    relateTa: 'ராகுல் இந்த போர்ட்ஃபோலியோவில் IEEE Resume Builder மற்றும் 500+ Placement Quiz-களை சேர்த்துள்ளார்!',
    actionLabel: '📝 Try Placement Tools',
    actionTarget: 'SCROLL_PROJECTS'
  }
]

/**
 * Async Real-time Gemini API Chatbot Engine
 * Leverages VITE_GEMINI_API_KEY from .env / .env.local
 */
export async function generatePortfolioAnswerAsync(
  query: string,
  lang: 'en' | 'ta' = 'en',
  persona: RecruiterPersona = 'general'
): Promise<{ text: string; actions?: { label: string; actionText: string }[] }> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || ''

  if (apiKey && apiKey.trim().length > 5) {
    try {
      const systemInstruction = `You are the intelligent AI Assistant embedded into Raghul Raja M's Personal Portfolio Website.

RAGHUL RAJA M PROFILE & CONTEXT:
- Role: Full-Stack & AI Engineer
- Education: B.E. Computer Science Engineering, SKP Engineering College, Tiruvannamalai (2023 - 2027), CGPA: 8.2 / 10.0
- Work Experience: Full Stack Developer Intern at TVK Technologies (Developing responsive web applications, ML models, and backend integrations)
- Flagship Projects (16+ repositories):
  1. Wolf Sec 2X Finder (Web Security Vulnerability Scanner)
  2. Aether Weather Platform (Real-time Telemetry & Weather Forecast Platform)
  3. Aetheris AI ChatBot (Multimodal AI Workspace)
  4. Multi-Disease Prediction System (Machine Learning Healthcare Diagnostic Platform)
  5. 500-Problem DSA Code Arena (Competitive Programming Environment like LeetCode/HackerRank)
  6. IEEE ATS Resume Builder & Placement Coach
- Tech Stack: React, Vite, TypeScript, Tailwind CSS, Python, Node.js, FastAPI, PostgreSQL, MySQL, PyTorch, Scikit-Learn.
- Contact: Email: ${resume.email}, Phone: ${resume.phone}, GitHub: ${resume.socials.github}, LinkedIn: ${resume.socials.linkedin}

YOUR CORE BEHAVIOR RULES:
1. PORTFOLIO QUERIES: If the user asks about Raghul Raja's projects, experience, skills, college, education, contact info, or resume, provide an accurate, enthusiastic response using Raghul's context.
2. GENERAL QUERIES & ANYTHING ELSE: If the user asks ANY general knowledge, coding, science, math, technology, career, philosophy, or creative question (just like ChatGPT or Google Gemini), answer the user's question completely, accurately, and thoughtfully. At the end of your answer, briefly add a 1-sentence relevant context connecting it to Raghul Raja's capabilities if applicable.
3. LANGUAGE: Respond in ${lang === 'ta' ? 'Tamil (தமிழ்)' : 'English'}.
4. RECRUITER PERSONA CONTEXT: Tone is tailored for ${persona} mode.`

      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`
      
      let response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: `${systemInstruction}\n\nUser Prompt: ${query}` }]
            }
          ]
        })
      })

      // Fallback model check if 2.5-flash is temporarily unavailable
      if (!response.ok) {
        const fallbackEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`
        response = await fetch(fallbackEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [{ text: `${systemInstruction}\n\nUser Prompt: ${query}` }]
              }
            ]
          })
        })
      }

      if (response.ok) {
        const data = await response.json()
        const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text
        if (candidateText && candidateText.trim().length > 0) {
          return {
            text: candidateText,
            actions: [
              { label: lang === 'ta' ? '🚀 புராஜெக்ட்களை பார்' : '🚀 Explore Projects', actionText: 'SCROLL_PROJECTS' },
              { label: lang === 'ta' ? '📊 ஸ்கில்களை பார்' : '📊 View Skill Grid', actionText: 'SCROLL_SKILLS' }
            ]
          }
        }
      }
    } catch (err) {
      console.warn('Google Gemini API request failed, falling back to local engine:', err)
    }
  }

  // Fallback to local synchronous engine if API key is unconfigured or network fails
  return generatePortfolioAnswer(query, lang, persona)
}

/**
 * Synchronous Local Knowledge Engine (Fast Client-Side Fallback)
 */
export function generatePortfolioAnswer(
  query: string,
  lang: 'en' | 'ta' = 'en',
  persona: RecruiterPersona = 'general'
): { text: string; actions?: { label: string; actionText: string }[] } {
  const q = query.toLowerCase().trim()
  const isTa = lang === 'ta'

  // 0. Greetings & Casual Hello
  if (['hi', 'hello', 'hey', 'greetings', 'vanakkam', 'வணக்கம்', 'ஹலோ'].some(w => q === w || q.startsWith(w + ' '))) {
    if (isTa) {
      return {
        text: `👋 வணக்கம்! நான் ராகுல் ராஜாவின் AI உதவியாளன்.\n\n` +
          `நீங்கள் ராகுலின் 16+ புராஜெக்ட்கள், SKP கல்லூரி விவரங்கள், TVK Technologies அனுபவம் பற்றியும் கேட்கலாம், அல்லது **Python, AI, Data Structures, Web Dev** போன்ற எந்த ஒரு பொதுவான கேள்வியையும் கேட்கலாம்!`,
        actions: [{ label: '🚀 புராஜெக்ட்களை பார்', actionText: 'SCROLL_PROJECTS' }]
      }
    }
    return {
      text: `👋 Hello! I am Raghul Raja's AI Assistant.\n\n` +
        `You can ask me anything about Raghul's 16+ projects, SKP Engineering College degree, TVK Technologies internship, or any general tech question like **Python, AI, React, or Data Structures**!`,
      actions: [{ label: '🚀 Explore Projects', actionText: 'SCROLL_PROJECTS' }]
    }
  }

  // 1. Check matched concepts in CONCEPT_KB
  for (const item of CONCEPT_KB) {
    if (item.keys.some(k => q.includes(k))) {
      return {
        text: isTa 
          ? `${item.ta}\n\n💡 **ராகுலின் தொடர்பு:**\n${item.relateTa}`
          : `${item.en}\n\n💡 **Raghul's Portfolio Context:**\n${item.relateEn}`,
        actions: [{ label: item.actionLabel, actionText: item.actionTarget }]
      }
    }
  }

  // 2. Specific Portfolio Intent Matchers
  if (q.includes('project') || q.includes('wolf') || q.includes('aether') || q.includes('disease') || q.includes('புராஜெக்ட்')) {
    const aiProjects = resume.projects.filter(p => p.category === 'ai' || p.tech.some(t => t.toLowerCase().includes('python') || t.toLowerCase().includes('ml') || t.toLowerCase().includes('ai')))
    
    if (persona === 'tech_lead') {
      return {
        text: `💻 Tech Lead Evaluation Matrix:\n\n` +
          `Raghul has built ${resume.projects.length}+ production repos with modern full-stack architectures:\n\n` +
          aiProjects.map(p => `⚡ ${p.title}: Built using ${p.tech.join(', ')}. Key feature: ${p.description}`).join('\n') +
          `\n\n🛠️ Architecture Highlights: High-throughput API design, client-side RAG engines, custom state management, and responsive React micro-frontends.`,
        actions: [{ label: '🚀 Explore All Projects', actionText: 'SCROLL_PROJECTS' }]
      }
    }

    if (persona === 'hr') {
      return {
        text: `🏢 HR Recruiter Summary:\n\n` +
          `Raghul demonstrates high project delivery velocity with ${resume.projects.length}+ completed projects.\n\n` +
          `🌟 Top Strengths: Full-stack problem solving, timely project completions, self-driven learning, and strong communication skills.\n` +
          `🏆 Flagship Applications: Wolf Sec 2X Finder, Aether Weather Platform, Aetheris AI ChatBot, and Multi-Disease Prediction System.`,
        actions: [{ label: '🚀 View Project Portfolio', actionText: 'SCROLL_PROJECTS' }]
      }
    }

    if (persona === 'founder') {
      return {
        text: `🚀 Startup Founder Overview:\n\n` +
          `Raghul is an autonomous full-stack product builder capable of taking an idea from design to deployment.\n\n` +
          `✨ Fast Delivery: Built 16+ scalable web & AI products independently.\n` +
          `✨ Tech Versatility: React, TypeScript, Python, ML, Node.js, and Databases.`,
        actions: [{ label: '🚀 View Product Work', actionText: 'SCROLL_PROJECTS' }]
      }
    }

    if (isTa) {
      return {
        text: `🚀 ராகுல் ராஜா ${resume.projects.length}+ உயர்தர புராஜெக்ட்களை உருவாக்கியுள்ளார்.\n\nமுக்கிய AI & Full-Stack படைப்புகள்:\n` +
          aiProjects.map(p => `✨ ${p.title}: ${p.description} (Tech: ${p.tech.join(', ')})`).join('\n') +
          `\n\n🏆 முக்கியமான புராஜெக்ட்கள்: Wolf Sec 2X Finder, Aether Weather Platform, Aetheris AI ChatBot, மற்றும் Multi-Disease Prediction System.`,
        actions: [
          { label: '🚀 எல்லா புராஜெக்ட்களையும் பார்', actionText: 'SCROLL_PROJECTS' }
        ]
      }
    }

    return {
      text: `🚀 Raghul Raja has developed ${resume.projects.length}+ high-impact projects.\n\nKey AI & Full-Stack Solutions:\n` +
        aiProjects.map(p => `✨ ${p.title}: ${p.description} (Tech: ${p.tech.join(', ')})`).join('\n') +
        `\n\n🏆 Notable Flagship Projects: Wolf Sec 2X Finder (Security Testing Tool), Aether Weather Platform, Aetheris AI ChatBot, and Multi-Disease Prediction System.`,
      actions: [
        { label: '🚀 Explore All Projects', actionText: 'SCROLL_PROJECTS' }
      ]
    }
  }

  if (q.includes('experience') || q.includes('tvk') || q.includes('intern') || q.includes('work') || q.includes('அனுபவம்')) {
    const exp = resume.experience[0]

    if (persona === 'hr') {
      return {
        text: `💼 HR Employment Verification:\n\n` +
          `🏢 Company: ${exp?.company || 'TVK Technologies'}\n` +
          `💼 Role: ${exp?.role || 'Full Stack Developer Intern'} (${exp?.period || 'Present'})\n` +
          `📍 Status: Available for Immediate Hiring / Notice Period Exists: No\n\n` +
          `🌟 Verified Performance: Team collaboration, daily agile standups, and feature completion.`,
        actions: [{ label: '💼 Experience Details', actionText: 'SCROLL_EXPERIENCE' }]
      }
    }

    if (isTa) {
      return {
        text: `💼 வேலை அனுபவம் விவரம்:\n\n` +
          `🏢 பதவி: ${exp?.role || 'Full Stack Developer Intern'} at ${exp?.company || 'TVK Technologies'} (${exp?.period || 'Present'})\n` +
          `📍 இடம்: ${exp?.location || 'Remote/India'}\n\n` +
          `🌟 முக்கிய பங்களிப்புகள்:\n` +
          (exp?.highlights?.map(h => `🔹 ${h}`).join('\n') || '🔹 Full-stack வெப் அப்ளிகேஷன்ஸ் மற்றும் AI மாடல்களை உருவாக்கினார்.'),
        actions: [
          { label: '💼 அனுபவ விவரங்களை பார்', actionText: 'SCROLL_EXPERIENCE' }
        ]
      }
    }

    return {
      text: `💼 Work Experience Summary:\n\n` +
        `🏢 Role: ${exp?.role || 'Full Stack Developer Intern'} at ${exp?.company || 'TVK Technologies'} (${exp?.period || 'Present'})\n` +
        `📍 Location: ${exp?.location || 'Remote/India'}\n\n` +
        `🌟 Key Highlights:\n` +
        (exp?.highlights?.map(h => `🔹 ${h}`).join('\n') || '🔹 Developed full-stack web applications and machine learning integrations.'),
      actions: [
        { label: '💼 View Experience Details', actionText: 'SCROLL_EXPERIENCE' }
      ]
    }
  }

  if (q.includes('education') || q.includes('college') || q.includes('degree') || q.includes('cgpa') || q.includes('skp') || q.includes('கல்வி')) {
    const edu = resume.education[0]

    if (isTa) {
      return {
        text: `🎓 கல்வி விவரங்கள்:\n\n` +
          `📜 பட்டப்படிப்பு: ${edu?.degree || 'B.E. Computer Science Engineering'}\n` +
          `🏛️ கல்லூரி: ${edu?.college || 'SKP Engineering College'}, ${edu?.location || 'Tiruvannamalai'}\n` +
          `📅 ஆண்டு: ${edu?.period || '2023 - 2027'}\n` +
          `⭐ தற்போதைய CGPA: ${edu?.cgpa || '8.2 / 10.0'}`
      }
    }

    return {
      text: `🎓 Education Details:\n\n` +
        `📜 Degree: ${edu?.degree || 'B.E. Computer Science Engineering'}\n` +
        `🏛️ Institution: ${edu?.college || 'SKP Engineering College'}, ${edu?.location || 'Tiruvannamalai'}\n` +
        `📅 Duration: ${edu?.period || '2023 - 2027'}\n` +
        `⭐ Current CGPA: ${edu?.cgpa || '8.2 / 10.0'}`
    }
  }

  if (q.includes('contact') || q.includes('email') || q.includes('hire') || q.includes('phone') || q.includes('social') || q.includes('github') || q.includes('linkedin') || q.includes('தொடர்பு')) {
    if (isTa) {
      return {
        text: `📬 தொடர்பு விவரங்கள்:\n\n` +
          `✉️ மின்னஞ்சல்: ${resume.email}\n` +
          `📞 தொலைபேசி: ${resume.phone}\n` +
          `📍 இடம்: ${resume.location}\n` +
          `💻 GitHub: ${resume.socials.github}\n` +
          `👔 LinkedIn: ${resume.socials.linkedin}\n\n` +
          `🌟 ராகுல் ராஜா Full-Stack மற்றும் AI Engineering வேலை வாய்ப்புகளுக்கு தயாராக உள்ளார்!`,
        actions: [
          { label: '📩 மெசேஜ் அனுப்பு', actionText: 'SCROLL_CONTACT' }
        ]
      }
    }

    return {
      text: `📬 Contact & Professional Links:\n\n` +
        `✉️ Email: ${resume.email}\n` +
        `📞 Phone: ${resume.phone}\n` +
        `📍 Location: ${resume.location}\n` +
        `💻 GitHub: ${resume.socials.github}\n` +
        `👔 LinkedIn: ${resume.socials.linkedin}\n\n` +
        `🌟 Raghul is actively open for Full-Stack, AI Engineering, and Software Internships!`,
      actions: [
        { label: '📩 Send Direct Message', actionText: 'SCROLL_CONTACT' }
      ]
    }
  }

  // 3. Dynamic Fallback
  if (isTa) {
    return {
      text: `💡 **AI தொழில்நுட்ப விளக்கம் ("${query}")**:\n\n` +
        `இது கணினி மற்றும் மென்பொருள் பொறியியலில் முக்கியத்துவம் வாய்ந்த ஒரு கருத்தாகும். ராகுல் ராஜா தனது Full-Stack & AI படைப்புகளில் இத்தகைய நவீன தொழில்நுட்ப உத்திகளைப் பயன்படுத்தி தீர்வுகளை வழங்குகிறார்.\n\n` +
        `🌟 **ராகுலின் போர்ட்ஃபோலியோ சிறப்பம்சங்கள்:**\n` +
        `- 16+ Full-Stack & AI Web Applications\n` +
        `- TVK Technologies Internship & 8.2 CGPA\n` +
        `- 500-Problem DSA Code Arena & IEEE Resume Engine`,
      actions: [
        { label: '🚀 புராஜெக்ட்களை பார்', actionText: 'SCROLL_PROJECTS' },
        { label: '📊 ஸ்கில்களை பார்', actionText: 'SCROLL_SKILLS' }
      ]
    }
  }

  return {
    text: `💡 **AI Technical Explanation ("${query}")**:\n\n` +
      `This inquiry touches upon modern software engineering and computational fundamentals. Raghul Raja applies these concepts when designing scalable web applications and artificial intelligence pipelines.\n\n` +
      `🌟 **Raghul's Portfolio Context:**\n` +
      `- 16+ Full-Stack & AI Production Applications\n` +
      `- TVK Technologies Internship & 8.2 CS CGPA\n` +
      `- 500-Problem DSA Code Arena & IEEE Resume Engine`,
    actions: [
      { label: '🚀 Explore Projects', actionText: 'SCROLL_PROJECTS' },
      { label: '📊 View Skill Grid', actionText: 'SCROLL_SKILLS' }
    ]
  }
}
