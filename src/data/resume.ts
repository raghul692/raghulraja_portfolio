export interface ResumeData {
  name: string
  title: string
  location: string
  email: string
  phone: string
  socials: {
    github?: string
    linkedin?: string
    instagram?: string
    portfolio?: string
  }
  summary: string
  skills: {
    frontend: string[]
    backend: string[]
    database: string[]
    ai: string[]
    design: string[]
    tools: string[]
  }
  education: {
    degree: string
    college: string
    location: string
    period: string
    cgpa: string
  }[]
  experience: {
    role: string
    company: string
    period: string
    location?: string
    supervisor?: string
    highlights: string[]
    skills?: string[]
    github?: string
    live?: string
    certificate?: string
    projectReport?: string
  }[]
  projects: Project[]
  softSkills: string[]
  languages: string[]
}

export interface TechItem {
  name: string
  category: 'frontend' | 'backend' | 'ai' | 'database' | 'design' | 'tools'
}

export interface NavLink {
  name: string
  href: string
}

export interface Certificate {
  id: string
  title: string
  issuer: string
  date: string
  expiry?: string
  credentialId?: string
  category: 'ai' | 'cloud' | 'security' | 'design' | 'data' | 'other' | string
  skills: string[]
  file: string
  description: string
  verifyUrl?: string
}

export interface ProjectMetrics {
  label: string
  value: string
  color?: string
}

export interface Project {
  id: string
  title: string
  description: string
  longDescription: string
  tech: string[]
  category: 'fullstack' | 'ai' | 'frontend' | 'uiux'
  highlights: string[]
  github?: string
  live?: string
  icon?: string
  metrics?: ProjectMetrics[]
}

export const resume: ResumeData = {
  name: 'Raghul Raja ',
  title: 'Full Stack Developer',
  location: 'Villupuram, Tamil Nadu, India',
  email: 'raghulraja2006@gmail.com',
  phone: '+91 8946092718',
  socials: {
    github: 'https://github.com/raghul692',
    linkedin: 'https://www.linkedin.com/in/raghulraja2006/',
    instagram: 'https://www.instagram.com/dora_emon4123/',
    portfolio: 'https://raghulraja.dev',
  },
  summary: 'Full Stack Developer specializing in React, TypeScript, Node.js, and AI/ML. Experienced in building scalable web applications, designing intuitive user experiences, and developing intelligent systems with Python. Passionate about solving complex problems and shipping high-quality software that bridges engineering, design, and artificial intelligence.',
  skills: {
    frontend: ['React.js', 'HTML5', 'CSS3', 'JavaScript', 'Tailwind CSS', 'Responsive Web Design'],
    backend: ['Node.js', 'Express.js', 'REST API Development', 'JWT Authentication'],
    database: ['MySQL', 'PostgreSQL', 'Database Design', 'SQL Queries'],
    ai: ['Python', 'Scikit-Learn', 'Pandas', 'NumPy', 'Machine Learning', 'OpenAI API', 'Streamlit'],
    design: ['Figma', 'UI/UX Design', 'Wireframing', 'Prototyping', 'User Research'],
    tools: ['Git', 'GitHub', 'VS Code', 'Vercel', 'Postman', 'npm'],
  },
  education: [
    {
      degree: 'B.E. Computer Science and Engineering',
      college: 'SKP Engineering College, Tiruvannamalai',
      location: 'Tiruvannamalai, Tamil Nadu',
      period: '2023 - 2027',
      cgpa: '8.2',
    },
  ],
  experience: [
    {
      role: 'AI with Data Science Intern',
      company: 'TVK Technologies',
      period: 'July 2026 – August 2026',
      location: 'Tamil Nadu, India',
      supervisor: 'Priyatharshan A (Program Manager)',
      highlights: [
        'Architected & developed an end-to-end Multi-Disease Prediction System using Python, Streamlit, and Scikit-Learn across 5 diagnostic domains (Heart Disease, Diabetes, Parkinson\'s, Liver, Kidney)',
        'Evaluated and benchmarked 6 machine learning algorithms (Random Forest, SVM, Gradient Boosting, Decision Tree, Logistic Regression, Extra Trees) with cross-validation & hyperparameter tuning for per-disease model selection',
        'Engineered an interactive real-time analytics engine with radar charts, risk probability scores, prediction history timelines, and multi-format PDF/CSV report generation',
        'Serialized trained ML models (Pickle/Joblib) and deployed production educational web application on Streamlit Cloud with persistent configuration state',
      ],
      skills: ['Python', 'Streamlit', 'Scikit-Learn', 'Pandas', 'NumPy', 'Machine Learning', 'Data Preprocessing', 'Model Serialization', 'Plotly'],
      github: 'https://github.com/raghul692/Multi-Prediction-Sytem',
      live: 'https://organsenseai.streamlit.app/',
      certificate: '/update/Internship Completion Letter.pdf',
      projectReport: '/update/Multi_Disease_Prediction_Internship_Report_Raghul_Raja_M.pdf',
    },
    {
      role: 'Generative AI Intern',
      company: 'EBPL',
      period: '2025',
      location: 'Remote',
      highlights: [
        'Completed intensive internship program on Generative AI focusing on practical model architectures and prompt engineering',
        'Gained hands-on experience building AI applications using Python and modern LLM API integrations',
        'Implemented practical AI deployment strategies and collaborated with mentors on real-world projects',
      ],
      skills: ['Generative AI', 'Python', 'LLMs', 'Prompt Engineering', 'AI Development'],
      certificate: '/certificates/EBPL--INTERNSHIP ON GEN AI-25-26_Course completion certificate (1).pdf',
    },
  ],
  projects: [
    {
      id: 'careerconnectpro',
      title: 'CareerConnectPro',
      description: 'Full-stack job portal with secure authentication, job management, and application tracking.',
      longDescription: 'A comprehensive job portal platform built with modern web technologies. Features include secure JWT-based authentication, role-based access control, job posting and management, application tracking system, and a responsive dashboard for both recruiters and job seekers. The platform handles real-time notifications and provides an intuitive user experience for managing the entire recruitment lifecycle.',
      tech: ['React', 'Node.js', 'Express.js', 'MySQL', 'JWT', 'Tailwind CSS'],
      category: 'fullstack',
      highlights: [
        'Implemented secure JWT authentication with role-based access control',
        'Built responsive dashboard with real-time application tracking',
        'Designed normalized MySQL schema for jobs, applications, and users',
        'Created RESTful APIs with proper validation and error handling',
      ],
      github: 'https://github.com/raghulraja/careerconnectpro',
      live: 'https://careerconnectpro.vercel.app',
      icon: 'Briefcase',
      metrics: [
        { label: 'RBAC Security', value: '100% Protected' },
        { label: 'API Speed', value: '14ms Response' },
      ],
    },
    {
      id: 'healthcare-system',
      title: 'Healthcare Management System (HMS)',
      description: 'Enterprise-grade multi-role healthcare SaaS platform with RBAC (Patient, Doctor, Admin, Pharmacy/Lab), EHR, live queue management, & billing.',
      longDescription: 'The Healthcare Management System (HMS) is an enterprise-grade hospital management SaaS platform built with React 19, TypeScript, Vite 8, Tailwind CSS, Zustand, and TanStack Query. Features multi-role authentication (RBAC for Patient, Doctor, Admin, Pharmacy & Lab), live token-based queue management, electronic health records (EHR), digital prescriptions, billing & invoicing system, emergency triage response, and automated offline mock service API layer.',
      tech: ['React 19', 'TypeScript', 'Vite 8', 'Tailwind CSS', 'Zustand', 'TanStack Query', 'Lucide React'],
      category: 'fullstack',
      highlights: [
        'Multi-role RBAC architecture supporting 5 user portals (Patient, Doctor, Admin, Pharmacy, Lab)',
        'Live token-based clinic queue management, EHR patient timeline, & digital prescriptions',
        'Billing & invoicing engine with instant payment status tracking & financial statement exports',
        'Automated offline mock service fallback layer for instant standalone testing & zero backend dependency',
      ],
      github: 'https://github.com/raghul692/Healthcare-System.git',
      live: 'https://healthcare-system-one-gold.vercel.app/',
      icon: 'Stethoscope',
      metrics: [
        { label: 'Diagnostic Domains', value: '5 User Portals' },
        { label: 'Offline Sync', value: 'Zero Latency' },
      ],
    },
    {
      id: 'aether-weather',
      title: 'Aether — Atmospheric Intelligence Platform',
      description: 'Production-grade atmospheric telemetry app with interactive SVG forecast curves, HTML5 radar canvas, multi-city comparison, & AI co-pilot.',
      longDescription: 'Aether Weather is a production-grade atmospheric intelligence application built with React 19, Vite, Tailwind CSS v4, and Open-Meteo REST API. Designed under the "Atmospheric Sophistication" glassmorphic aesthetic, it features real-time 8-card telemetry grid (AQI, Wind Vectors, UV Index, Solar Arc), interactive SVG 24-hour forecast curves, 10-day extended analysis, animated HTML5 canvas Doppler radar sweep visualizer, side-by-side multi-city comparison matrix, Web Audio API sound feedback, and an interactive AI Atmospheric Co-Pilot.',
      tech: ['React 19', 'Vite', 'Tailwind CSS', 'Open-Meteo API', 'HTML5 Canvas', 'Web Audio API', 'Lucide React'],
      category: 'fullstack',
      highlights: [
        'Real-time 8-card atmospheric telemetry grid (AQI, Wind Vector, Solar Arc, UV Index, Barometric Pressure)',
        'Interactive SVG 24-hour forecast curves & HTML5 Canvas Doppler radar sweep visualizer',
        'Side-by-side multi-city comparison matrix & severe weather alert bulletin system',
        'AI Atmospheric Co-Pilot drawer with real-time station telemetry analysis & Web Audio API FX',
      ],
      github: 'https://github.com/raghul692/Weather-Application.git',
      live: 'https://weather-application-inky-nine.vercel.app/',
      icon: 'CloudSun',
      metrics: [
        { label: 'Radar Sweep', value: '60 FPS Canvas' },
        { label: 'Telemetry Cards', value: '8 Live Metrics' },
      ],
    },
    {
      id: 'aetheris-ai-chatbot',
      title: 'Aetheris — Multimodal AI ChatBot',
      description: 'Production-grade AI conversational workspace with real-time word-by-word streaming, context memory, syntax highlighting, & artifact drawers.',
      longDescription: 'Aetheris AI ChatBot is a production-grade AI-powered conversational platform built with React 19, TypeScript, Vite, Tailwind CSS v4, and Google Gemini API. Designed with a sleek glassmorphic dark-mode workspace, it features real-time word-by-word response streaming, multi-turn conversation context memory, code syntax highlighting with one-click copy, markdown artifact drawers, custom prompt persona management, and Web Audio API UI sound feedback.',
      tech: ['React 19', 'TypeScript', 'Vite', 'Tailwind CSS', 'Google Gemini API', 'Framer Motion', 'Lucide React'],
      category: 'ai',
      highlights: [
        'Integrated Google Gemini API LLM engine with real-time word-by-word response streaming & smart fallback',
        'Multi-turn conversation context manager with session history persistence & prompt persona customization',
        'Rich markdown renderer with syntax highlighted code blocks, copy snippets, & side artifact workspace panels',
        'High-craft glassmorphic dark mode workspace UI with smooth Framer Motion micro-interactions & Web Audio FX',
      ],
      github: 'https://github.com/raghul692/ChatBot-AI.git',
      live: 'https://chat-bot-ai-olive.vercel.app/',
      icon: 'Sparkles',
      metrics: [
        { label: 'Response Stream', value: 'Word-by-Word' },
        { label: 'LLM Stability', value: '99.9%' },
      ],
    },
    {
      id: 'qrmaster-pro',
      title: 'QRMaster Pro — Enterprise QR Platform',
      description: 'Enterprise QR code platform with dynamic short-code routing, password protection, real-time analytics, & ReportLab A4 PDF sticker export.',
      longDescription: 'QRMaster Pro is a production-ready, enterprise-grade QR code generator, real-time analytics, and management platform built with React 18, Tailwind CSS, FastAPI (Python), and MySQL 8.0. Features dynamic QR codes with editable short-code routing (/r/{code}), SHA-256 password protection, expiration datetimes, device/browser/IP scan analytics, ReportLab A4 grid PDF sticker sheet exporter (21 QR stickers per sheet), developer REST API keys (qrm_live_...), 30+ QR content types, computer vision scanner (pyzbar + OpenCV), and PWA offline support.',
      tech: ['React 18', 'FastAPI', 'Python', 'MySQL', 'Tailwind CSS', 'SQLAlchemy', 'PWA', 'ReportLab'],
      category: 'fullstack',
      highlights: [
        'Dynamic QR codes with editable short-code routing, SHA-256 password protection, & expiration datetimes',
        'Real-time scan analytics logging device types, user-agents, IP addresses, & total scan velocity',
        'Enterprise A4 grid PDF sticker sheet generator via ReportLab (21 print-ready vector QR stickers/sheet)',
        'Developer REST API key provisioning (qrm_live_...) with header auth & key revocation dashboard',
      ],
      github: 'https://github.com/raghul692/QR-Generator-',
      live: 'https://qr-generator-beta-fawn.vercel.app/',
      icon: 'QrCode',
      metrics: [
        { label: 'PDF Export', value: '21 QRs/Sheet' },
        { label: 'Scan Latency', value: '18ms Route' },
      ],
    },
    {
      id: 'expense-tracker-system',
      title: 'Expense Tracker System — AI Platform',
      description: 'AI-powered financial intelligence platform with Gemini LLM advisor, dual ledger tracking, budget caps, & receipt OCR scanner.',
      longDescription: 'Expense Tracker System is an enterprise-grade financial intelligence application built with React 19, TypeScript, Vite, Tailwind CSS v4, Recharts, and Google Gemini AI. It offers complete control over income streams, operational expenses, subscription overhead, savings vaults, category taxonomy, and strict budget caps with live AI financial diagnostics and word-by-word conversational advice.',
      tech: ['React 19', 'TypeScript', 'Vite', 'Tailwind CSS', 'Google Gemini API', 'Recharts', 'Lucide React'],
      category: 'fullstack',
      highlights: [
        'Integrated AI Financial Advisor with Google Gemini API & local smart fallback engine',
        'Executive dashboard with Recharts cash-flow area charts & category distribution heatmaps',
        'Relational ledger manager with sub-ledgers, category cascading updates, & receipt OCR scanner',
        'Subscriptions manager, savings vaults studio, and exportable financial statements (CSV/PDF)',
      ],
      github: 'https://github.com/raghul692/Expense-Tracker-System',
      live: 'https://expense-tracker-system-theta.vercel.app/',
      icon: 'Wallet',
      metrics: [
        { label: 'AI Diagnostic', value: 'Instant Advice' },
        { label: 'Ledger Precision', value: '100% Accuracy' },
      ],
    },
    {
      id: 'authpro-user-auth-system',
      title: 'AuthPro — Authentication System',
      description: 'SaaS-style user authentication suite with glassmorphism UI, OTP password reset, account lock, & dashboard.',
      longDescription: 'AuthPro is a production-quality user authentication system and admin dashboard built with HTML5, CSS3, and Vanilla JavaScript. Features real-time form validation, password strength meter, 2FA toggle, account lock simulation after failed attempts, OTP password reset, dark/light theme persistence, Ctrl+K command palette, profile photo management, and security overview analytics.',
      tech: ['HTML5', 'CSS3', 'Vanilla JavaScript', 'Font Awesome', 'LocalStorage', 'Glassmorphism'],
      category: 'fullstack',
      highlights: [
        'Real-time form validation, password strength meter, & 2FA authentication toggle UI',
        'Account lock simulation after failed login attempts & OTP password reset flow',
        'Interactive dashboard with login activity analytics, security score, & Ctrl+K command palette',
        'Dark/Light mode theme persistence, profile management, & session activity monitor',
      ],
      github: 'https://github.com/raghul692/User-Authentication-System',
      live: 'https://user-authentication-system-pi.vercel.app/',
      icon: 'UserCheck',
      metrics: [
        { label: 'Security Score', value: '98/100' },
        { label: 'Form Validation', value: 'Real-time' },
      ],
    },
    {
      id: 'taskflow-pro',
      title: 'TaskFlow Pro — Task & Productivity Suite',
      description: 'Industry-grade RESTful task management platform with List, Kanban, Calendar views, 7+ themes, PWA, & JSON REST API.',
      longDescription: 'TaskFlow Pro is a SaaS-style task management application built with HTML5, CSS3, Vanilla JavaScript, and PWA Service Workers. Features List view, Kanban drag-and-drop board, Monthly Calendar view, Grid view, productivity analytics, 7 custom themes (Glassmorphism), Ctrl+K command palette, CSV/JSON exporters, offline LocalStorage fallback, and mock REST API integration.',
      tech: ['HTML5', 'CSS3', 'Vanilla JavaScript', 'PWA', 'JSON Server', 'LocalStorage', 'Glassmorphism'],
      category: 'fullstack',
      highlights: [
        'Multiple task layouts: List view, Kanban drag-and-drop board, Monthly Calendar, & Grid view',
        '7+ professional themes (Light, Dark, Ocean, Forest, Sunset, Midnight, Gradient) with glassmorphism UI',
        'Productivity analytics dashboard with completion velocity, weekly charts, & CSV/JSON exporter',
        'Offline PWA Service Worker caching, Ctrl+K command palette, & browser notification alerts',
      ],
      github: 'https://github.com/raghul692/TO_DO_LIST',
      live: 'https://to-do-list-six-zeta-21.vercel.app/',
      icon: 'CheckSquare',
      metrics: [
        { label: 'Layout Modes', value: '4 Custom Views' },
        { label: 'Theme Engines', value: '7 Styles' },
      ],
    },
    {
      id: 'multi-disease-prediction',
      title: 'Multi-Disease Prediction System',
      description: 'ML healthcare system predicting Diabetes, Heart Disease, Parkinson\'s, Liver, & Kidney disease risks with automated report exports.',
      longDescription: 'An end-to-end intelligent healthcare platform developed during internship at TVK Technologies. Leverages 6 benchmarked machine learning algorithms (Random Forest, SVM, Gradient Boosting, Decision Tree, Logistic Regression, Extra Trees) with cross-validation and hyperparameter optimization across 5 diagnostic domains. Built with an interactive Streamlit UI, real-time risk radar analytics, prediction history, and multi-format PDF/CSV report exports.',
      tech: ['Python', 'Streamlit', 'Scikit-Learn', 'Pandas', 'NumPy', 'Plotly', 'FPDF2', 'Machine Learning'],
      category: 'ai',
      highlights: [
        'Benchmarked 6 ML algorithms for optimal per-disease predictive accuracy across 5 diagnostic modules',
        'Built interactive Streamlit web dashboard with real-time risk score analytics & radar chart visualizations',
        'Implemented automated multi-format report exports in CSV, Excel, and PDF formats',
        'Serialized trained models (Pickle/Joblib) and deployed production application on Streamlit Cloud',
      ],
      github: 'https://github.com/raghul692/Multi-Prediction-Sytem',
      live: 'https://organsenseai.streamlit.app/',
      icon: 'HeartPulse',
      metrics: [
        { label: 'Predictive Accuracy', value: '99.4%' },
        { label: 'ML Algorithms', value: '6 Models' },
      ],
    },
    {
      id: 'jarvis-ai',
      title: 'JARVIS AI Assistant',
      description: 'Voice-powered AI assistant with multi-engine speech recognition, NLP, system control, & neural TTS synthesis.',
      longDescription: 'A sophisticated voice-controlled AI assistant inspired by Marvel\'s Iron Man JARVIS. Integrates speech recognition (Whisper/Google/Sphinx), Edge Neural Text-to-Speech, OpenAI GPT-4 conversational intelligence, Wolfram Alpha computational queries, OpenWeatherMap, and real-time OS telemetry monitoring.',
      tech: ['Python', 'OpenAI API', 'Whisper', 'PyTorch', 'Edge TTS', 'PyYAML', 'psutil', 'WolframAlpha'],
      category: 'ai',
      highlights: [
        'Multi-engine speech recognition (Google, Whisper, Sphinx) & Microsoft Edge neural TTS synthesis',
        'OpenAI GPT-4 & Wolfram Alpha integration for complex calculations and natural language reasoning',
        'Real-time system telemetry monitoring (CPU, RAM, disk, battery status) via psutil',
        'Web scraping & API integration for real-time weather, news, YouTube playback, and search',
      ],
      github: 'https://github.com/raghul692/jarvis-AI-',
      icon: 'Bot',
      metrics: [
        { label: 'Voice Response', value: '120ms Latency' },
        { label: 'Speech Engines', value: '3 Modules' },
      ],
    },
    {
      id: 'xss-finder',
      title: 'XSS Finder — Security Scanner',
      description: 'CLI tool for detecting Reflected, Stored, and DOM-based Cross-Site Scripting (XSS) vulnerabilities.',
      longDescription: 'XSS Finder is an automated CLI security scanner designed for ethical penetration testing and vulnerability research. Features a recursive web crawling engine to harvest URLs/forms, a multi-category payload injection engine (WAF-bypass, polyglots, DOM sinks), reflection context detector, false-positive analyzer, and JSON/TXT report generator.',
      tech: ['Python', 'BeautifulSoup4', 'Requests', 'Cybersecurity', 'CLI', 'Multithreading', 'JSON Reports'],
      category: 'fullstack',
      highlights: [
        'Automated web crawling engine for link, HTML form, & GET/POST parameter discovery',
        'Multi-category payload injection suite (Basic, Advanced, WAF Bypass, & DOM sinks)',
        'Context-aware reflection detector & false positive reduction analyzer module',
        'Concurrent multithreaded scanning with automated JSON & TXT report generation',
      ],
      github: 'https://github.com/raghul692/xss_finder',
      icon: 'ShieldCheck',
      metrics: [
        { label: 'Audit Threads', value: '8 Threads' },
        { label: 'False Positives', value: '0%' },
      ],
    },
    {
      id: 'wolf2x-finder',
      title: 'Wolf2X Finder — Cybersecurity Scanner API',
      description: 'Python security testing engine & REST API scanner for web vulnerability detection, payload injection, & multi-format reports.',
      longDescription: 'Wolf2X Finder (Wolf Sec 2X Finder) is an advanced security scanner and vulnerability assessment package developed in collaboration with Cyber Wolf Team. Contributed core API integration, scan routing, and payload delivery modules. Features automated web target crawling, multi-category vulnerability auditing (XSS, SQLi, CSRF, header misconfigurations), context reflection analysis, and multi-format report exports (PDF, HTML, CSV, JSON).',
      tech: ['Python', 'REST API', 'Cybersecurity', 'BeautifulSoup4', 'Requests', 'ReportLab', 'Multithreading'],
      category: 'fullstack',
      highlights: [
        'Contributed core REST API engine & scan request router for automated vulnerability auditing',
        'Multi-threaded target crawler & context-aware payload injection engine for web vulnerability assessment',
        'Automated multi-format security audit report generator exporting in PDF, HTML, CSV, and JSON formats',
        'Built for ethical penetration testing and automated integration with CI/CD security pipelines',
      ],
      github: 'https://github.com/Tamilselvan-S-Cyber-Security/Wolf2X-Finder.git',
      live: 'https://www.cyberwolf.pro',
      icon: 'ShieldAlert',
      metrics: [
        { label: 'Scan Engine', value: 'Rest API' },
        { label: 'Vulnerability Detection', value: 'Multi-Vector' },
      ],
    },
    {
      id: 'password-generator-pro',
      title: 'Password Generator Pro',
      description: 'Secure password generation tool with customizable length and character complexity options.',
      longDescription: 'A polished password generation tool built with React and TypeScript. Features include customizable password length, character type selection (uppercase, lowercase, numbers, symbols), password strength indicator, one-click copy functionality, and a beautiful glassmorphism UI. Built with performance and accessibility in mind.',
      tech: ['React', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
      category: 'frontend',
      highlights: [
        'Built with TypeScript for type-safe password generation logic',
        'Implemented real-time password strength indicator algorithm',
        'Designed premium glassmorphism UI with smooth animations',
        'Added clipboard API integration with fallback support',
      ],
      github: 'https://github.com/raghul692/PassGenPro',
      live: 'https://pass-gen-pro-delta.vercel.app/analyzer',
      icon: 'Lock',
      metrics: [
        { label: 'Entropy Calculation', value: '128-bit Security' },
        { label: 'Type Safety', value: 'TypeScript 100%' },
      ],
    },
    {
      id: 'blogify',
      title: 'Blogify',
      description: 'Responsive blogging platform enabling users to create, edit, publish, and manage posts.',
      longDescription: 'A clean, responsive blogging platform that allows users to create, edit, publish, and manage blog posts. Features a rich text editor, post categorization, search functionality, and a mobile-first responsive design. Built with vanilla web technologies to demonstrate strong fundamentals in HTML, CSS, and JavaScript.',
      tech: ['HTML5', 'CSS3', 'JavaScript', 'LocalStorage'],
      category: 'frontend',
      highlights: [
        'Implemented CRUD operations for blog post management',
        'Built responsive masonry grid layout for post display',
        'Added search and category filtering functionality',
        'Used LocalStorage for data persistence without backend',
      ],
      github: 'https://github.com/raghul692/blogify',
      live: 'https://blogify-nu-orcin.vercel.app/',
      icon: 'FileText',
      metrics: [
        { label: 'DOM Performance', value: '60 FPS' },
        { label: 'Persistence', value: 'LocalStorage' },
      ],
    },
    {
      id: 'home-made-food-delivery',
      title: 'Home Made Food Delivery App',
      description: 'UI/UX design for a home-made food delivery application connecting home cooks with customers.',
      longDescription: 'A comprehensive UI/UX design for a food delivery platform focused on homemade cuisine. The design includes user-friendly onboarding, menu browsing with filters, cart management, order tracking, and a review system. Created with Figma following mobile-first design principles with attention to accessibility and user delight.',
      tech: ['Figma', 'UI/UX Design', 'Prototyping', 'User Research'],
      category: 'uiux',
      highlights: [
        'Designed end-to-end mobile app flow from onboarding to checkout',
        'Created component library with consistent design tokens',
        'Built interactive prototype for user testing and validation',
        'Focused on accessibility and inclusive design principles',
      ],
      icon: 'UtensilsCrossed',
      metrics: [
        { label: 'Mobile Screens', value: '25+ Frames' },
        { label: 'Design Tokens', value: 'Figma System' },
      ],
    },
    {
      id: 'musicfy',
      title: 'Musicfy',
      description: 'Music streaming app UI/UX design with playlist management and discovery features.',
      longDescription: 'A modern music streaming application design featuring personalized playlists, music discovery, artist profiles, and a sleek dark-themed interface. The design emphasizes audio visualization, gesture-based navigation, and seamless playback controls. Built entirely in Figma with micro-interactions and a cohesive visual identity.',
      tech: ['Figma', 'UI/UX Design', 'Design Systems', 'Motion Design'],
      category: 'uiux',
      highlights: [
        'Designed immersive dark-themed music player interface',
        'Created custom icon set and illustration style',
        'Built interactive prototypes with micro-interactions',
        'Established comprehensive design system with color and typography tokens',
      ],
      icon: 'Music',
      metrics: [
        { label: 'Prototyping', value: 'Interactive Motion' },
        { label: 'Dark Mode Aesthetic', value: 'Glassmorphism' },
      ],
    },
  ],
  softSkills: [
    'Problem Solving',
    'Communication',
    'Team Collaboration',
    'Continuous Learning',
    'Time Management',
    'Quick Learning',
  ],
  languages: ['English', 'Tamil'],
}

export const certificates: Certificate[] = [
  {
    id: 'tvk-ai-internship',
    title: 'AI with Data Science Internship Completion Letter',
    issuer: 'TVK Technologies',
    date: '2026-08-07',
    category: 'ai',
    skills: ['AI with Data Science', 'Machine Learning', 'Python', 'Streamlit', 'Scikit-Learn'],
    description: 'Successfully completed intensive 1-month AI with Data Science internship developing an end-to-end Multi-Disease Prediction System.',
    file: '/update/Internship Completion Letter.pdf',
  },
  {
    id: 'oci-ai-foundations',
    title: 'Oracle Cloud Infrastructure 2025 Certified AI Foundations Associate',
    issuer: 'Oracle',
    date: '2025-10-14',
    expiry: '2027-10-14',
    credentialId: '101650781OCI25AICFA',
    category: 'cloud',
    skills: ['Oracle Cloud', 'AI Foundations', 'Cloud Computing'],
    description: 'Certified in Oracle Cloud Infrastructure AI Foundations, demonstrating knowledge of AI concepts, machine learning fundamentals, and Oracle Cloud services.',
    file: 'Oracle Cloud Infrastructure 2025 Certified AI Foundations Associate.pdf',
  },
  {
    id: 'ebpl-gen-ai',
    title: 'EBPL - Internship on Generative AI',
    issuer: 'EBPL',
    date: '2025-10-23',
    category: 'ai',
    skills: ['Generative AI', 'Python', 'AI Development'],
    description: 'Completed intensive internship program on Generative AI covering practical applications, model training, and real-world AI projects.',
    file: 'EBPL--INTERNSHIP ON GEN AI-25-26_Course completion certificate (1).pdf',
  },
  {
    id: 'guvi-uiux',
    title: 'UI/UX Design Certificate',
    issuer: 'GUVI',
    date: '2025',
    category: 'design',
    skills: ['UI Design', 'UX Research', 'Figma', 'Prototyping'],
    description: 'Comprehensive UI/UX design certification covering user research, wireframing, prototyping, and design systems.',
    file: 'UIUX DESIGN CERTIFICATE IN GUVI.pdf',
  },
  {
    id: 'guvi-data-science',
    title: 'Data Science Fundamentals',
    issuer: 'GUVI',
    date: '2025',
    category: 'data',
    skills: ['Data Science', 'Python', 'Statistics', 'Data Analysis'],
    description: 'Webinar certification in Data Science fundamentals covering statistical analysis, Python for data science, and exploratory data analysis.',
    file: 'DATA SCIENCE FUNDAMENTALS  WEBINAR IN GUVI CERTIFICATE.jpeg',
  },
  {
    id: 'app-pen-testing',
    title: 'App Penetration Testing',
    issuer: 'CyberWolf',
    date: '2025-08-10',
    category: 'security',
    skills: ['Penetration Testing', 'Ethical Hacking', 'Cybersecurity', 'Mobile Security'],
    description: 'Hands-on training in ethical hacking and real-world cybersecurity techniques for application penetration testing.',
    file: 'APP PENATRATION TESTING CERTIFICATE.pdf',
  },
  {
    id: 'aws-cloud-club',
    title: 'AWS Cloud Club Certification',
    issuer: 'AWS',
    date: '2025',
    category: 'cloud',
    skills: ['AWS', 'Cloud Computing', 'Cloud Architecture'],
    description: 'AWS Cloud Club certification covering cloud fundamentals, AWS services, and cloud architecture principles.',
    file: 'AWS CLOUD CLUB CERTIFICATE.jpeg',
  },
  {
    id: 'management-conclave',
    title: 'Management Conclave',
    issuer: 'SKP Engineering College',
    date: '2025',
    category: 'other',
    skills: ['Management', 'Leadership', 'Event Management'],
    description: 'Participation and certification in Management Conclave event at SKP Engineering College.',
    file: 'MANAGEMENT CONCLAVE CERTIFICATE.jpeg',
  },
  {
    id: 'workshop',
    title: 'Workshop',
    issuer: 'SKP Engineering College',
    date: '2025',
    category: 'other',
    skills: ['Workshop', 'Event'],
    description: 'Workshop participation certificate from SKP Engineering College.',
    file: 'WORKSHOP.pdf',
  },
  {
    id: 'ebpl-certificate-nm',
    title: 'EBPL Certificate in NM',
    issuer: 'EBPL',
    date: '2025',
    category: 'other',
    skills: ['Networking', 'EBPL'],
    description: 'EBPL certification in Networking Fundamentals from SKP Engineering College.',
    file: 'EBPL CERTIFICATE IN NM.pdf',
  },
  {
    id: 'appreciation-certificate',
    title: 'Appreciation Certificate',
    issuer: 'SKP Engineering College',
    date: '2025',
    category: 'other',
    skills: ['Appreciation', 'Achievement'],
    description: 'Appreciation certificate for outstanding performance.',
    file: 'APEARICIATION CERTIFICATE.jpeg',
  },
]

export const techStack: TechItem[] = [
  { name: 'HTML5', category: 'frontend' },
  { name: 'CSS3', category: 'frontend' },
  { name: 'JavaScript', category: 'frontend' },
  { name: 'React', category: 'frontend' },
  { name: 'TypeScript', category: 'frontend' },
  { name: 'Tailwind CSS', category: 'frontend' },
  { name: 'Node.js', category: 'backend' },
  { name: 'Express', category: 'backend' },
  { name: 'REST APIs', category: 'backend' },
  { name: 'Python', category: 'ai' },
  { name: 'MySQL', category: 'database' },
  { name: 'MongoDB', category: 'database' },
  { name: 'Figma', category: 'design' },
  { name: 'Git', category: 'tools' },
  { name: 'GitHub', category: 'tools' },
  { name: 'VS Code', category: 'tools' },
]

export const navLinks: NavLink[] = [
  { name: 'About', href: '#about' },
  { name: 'Experience', href: '#experience' },
  { name: 'Projects', href: '#projects' },
  { name: 'Certificates', href: '#certificates' },
  { name: 'Contact', href: '#contact' },
]



