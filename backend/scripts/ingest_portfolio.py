import os
import sys
import json
import logging

# Add parent directory to path so app modules can be imported
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.db import insert_document, insert_chunk
from app.services.embeddings import generate_embedding

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("ingest_portfolio")

PORTFOLIO_KNOWLEDGE = [
    {
        "doc_key": "summary_raghul_raja",
        "title": "Professional Summary & Bio - Raghul Raja M",
        "category": "summary",
        "content": (
            "Raghul Raja M is a Full Stack Developer, AI/ML Engineer, and UI/UX Designer based in Villupuram, Tamil Nadu, India. "
            "He specializes in React.js, TypeScript, Node.js, Express.js, Python, Fast API, Streamlit, Scikit-Learn, and Generative AI. "
            "He has built high-impact web applications, AI medical systems, cybersecurity scanners, atmospheric platforms, and automated workflow suites. "
            "Summary: Full Stack Developer specializing in React, TypeScript, Node.js, and AI/ML. Experienced in building scalable web applications, "
            "designing intuitive user experiences, and developing intelligent systems with Python. Passionate about solving complex problems and shipping "
            "high-quality software that bridges engineering, design, and artificial intelligence."
        ),
        "metadata": {
            "name": "Raghul Raja M",
            "title": "Full Stack Developer & AI Engineer",
            "location": "Villupuram, Tamil Nadu, India",
            "email": "raghulraja2006@gmail.com",
            "phone": "+91 8946092718",
            "socials": {
                "github": "https://github.com/raghul692",
                "linkedin": "https://www.linkedin.com/in/raghulraja2006/",
                "instagram": "https://www.instagram.com/dora_emon4123/",
                "portfolio": "https://raghulraja.dev"
            }
        }
    },
    {
        "doc_key": "skills_technical",
        "title": "Technical Skills & Technology Stack - Raghul Raja M",
        "category": "skills",
        "content": (
            "Raghul Raja M's Comprehensive Tech Stack & Skillset:\n"
            "- Frontend Engineering: React.js, HTML5, CSS3, JavaScript (ES6+), TypeScript, Tailwind CSS, Responsive Web Design, Vite, State Management (Zustand, TanStack Query).\n"
            "- Backend & Cloud: Node.js, Express.js, REST API Development, JWT Authentication, FastAPI (Python), Python, Microservices, CORS, Middleware Architecture.\n"
            "- Database Systems: MySQL, MongoDB, Supabase PostgreSQL, pgvector, SQLite, Relational Schema Design, Indexing.\n"
            "- AI & Machine Learning: Python, Generative AI, LLM Integration (Google Gemini, OpenAI GPT-4), RAG Architecture, Scikit-Learn, Pandas, NumPy, Plotly, Model Serialization (Pickle/Joblib), Speech Recognition (Whisper), Edge Neural TTS.\n"
            "- UI/UX & Design: Figma, Wireframing, High-Fidelity Prototyping, Glassmorphism, Micro-Animations, Component Design Systems, Mobile-First UX.\n"
            "- Developer Tools & DevOps: Git, GitHub, VS Code, Postman, Webhooks, ReportLab PDF Generation, Docker/Virtualization, PWA Service Workers.\n"
            "- Soft Skills: Problem Solving, Technical Communication, Cross-Functional Team Collaboration, Continuous Learning, Time Management, Agile Workflow."
        ),
        "metadata": {
            "languages": ["English", "Tamil"],
            "soft_skills": ["Problem Solving", "Communication", "Team Collaboration", "Continuous Learning", "Time Management", "Quick Learning"]
        }
    },
    {
        "doc_key": "edu_skp_cse",
        "title": "Education - B.E. Computer Science & Engineering",
        "category": "education",
        "content": (
            "Degree: Bachelor of Engineering (B.E.) in Computer Science and Engineering\n"
            "Institution: SKP Engineering College, Tiruvannamalai, Tamil Nadu\n"
            "Period: 2023 - 2027\n"
            "Academic Performance (CGPA): 8.2 / 10.0\n"
            "Coursework & Focus Areas: Data Structures and Algorithms, Database Management Systems, Computer Networks, Operating Systems, Software Engineering, Web Technologies, Machine Learning, Artificial Intelligence."
        ),
        "metadata": {
            "degree": "B.E. Computer Science and Engineering",
            "college": "SKP Engineering College, Tiruvannamalai",
            "period": "2023 - 2027",
            "cgpa": "8.2"
        }
    },
    {
        "doc_key": "exp_tvk_technologies",
        "title": "Experience - AI with Data Science Intern at TVK Technologies",
        "category": "experience",
        "content": (
            "Role: AI with Data Science Intern\n"
            "Company: TVK Technologies (Tamil Nadu, India)\n"
            "Period: July 2026 – August 2026\n"
            "Supervisor: Priyatharshan A (Program Manager)\n"
            "Highlights & Key Accomplishments:\n"
            "1. Architected & developed an end-to-end Multi-Disease Prediction System using Python, Streamlit, and Scikit-Learn across 5 diagnostic domains (Heart Disease, Diabetes, Parkinson's, Liver, Kidney).\n"
            "2. Evaluated and benchmarked 6 machine learning algorithms (Random Forest, SVM, Gradient Boosting, Decision Tree, Logistic Regression, Extra Trees) with cross-validation & hyperparameter tuning for per-disease model selection.\n"
            "3. Engineered an interactive real-time analytics engine with radar charts, risk probability scores, prediction history timelines, and multi-format PDF/CSV report generation.\n"
            "4. Serialized trained ML models (Pickle/Joblib) and deployed production educational web application on Streamlit Cloud with persistent configuration state.\n"
            "Tech Stack Used: Python, Streamlit, Scikit-Learn, Pandas, NumPy, Machine Learning, Data Preprocessing, Model Serialization, Plotly.\n"
            "Live App: https://organsenseai.streamlit.app/\n"
            "GitHub Repository: https://github.com/raghul692/Multi-Prediction-Sytem"
        ),
        "metadata": {
            "company": "TVK Technologies",
            "role": "AI with Data Science Intern",
            "period": "July 2026 – August 2026",
            "certificate": "/update/Internship Completion Letter.pdf"
        }
    },
    {
        "doc_key": "exp_ebpl_genai",
        "title": "Experience - Generative AI Intern at EBPL",
        "category": "experience",
        "content": (
            "Role: Generative AI Intern\n"
            "Company: EBPL (Remote)\n"
            "Period: 2025\n"
            "Highlights & Key Accomplishments:\n"
            "1. Completed intensive internship program on Generative AI focusing on practical model architectures and prompt engineering.\n"
            "2. Gained hands-on experience building AI applications using Python and modern LLM API integrations.\n"
            "3. Implemented practical AI deployment strategies and collaborated with mentors on real-world projects.\n"
            "Tech Stack Used: Generative AI, Python, LLMs, Prompt Engineering, AI Development."
        ),
        "metadata": {
            "company": "EBPL",
            "role": "Generative AI Intern",
            "period": "2025",
            "certificate": "EBPL--INTERNSHIP ON GEN AI-25-26_Course completion certificate (1).pdf"
        }
    },
    {
        "doc_key": "proj_careerconnectpro",
        "title": "Project - CareerConnectPro (Full Stack Job Portal)",
        "category": "project",
        "content": (
            "Project Title: CareerConnectPro\n"
            "Category: Full Stack Web Application\n"
            "Description: Full-stack job portal with secure authentication, job management, and application tracking.\n"
            "Detailed Architecture: A comprehensive job portal platform built with React, Node.js, Express.js, MySQL, JWT, and Tailwind CSS. "
            "Features include secure JWT-based authentication, role-based access control (RBAC), job posting and management, application tracking system, "
            "and a responsive dashboard for both recruiters and job seekers. The platform handles real-time notifications and provides an intuitive user experience.\n"
            "Key Highlights:\n"
            "- Implemented secure JWT authentication with role-based access control.\n"
            "- Built responsive dashboard with real-time application tracking.\n"
            "- Designed normalized MySQL schema for jobs, applications, and users.\n"
            "- Created RESTful APIs with proper validation and error handling.\n"
            "Tech Stack: React, Node.js, Express.js, MySQL, JWT, Tailwind CSS.\n"
            "Live URL: https://careerconnectpro.vercel.app\n"
            "GitHub Repository: https://github.com/raghulraja/careerconnectpro"
        ),
        "metadata": {
            "tech": ["React", "Node.js", "Express.js", "MySQL", "JWT", "Tailwind CSS"],
            "live": "https://careerconnectpro.vercel.app",
            "github": "https://github.com/raghulraja/careerconnectpro"
        }
    },
    {
        "doc_key": "proj_healthcare_system",
        "title": "Project - Healthcare Management System (HMS SaaS)",
        "category": "project",
        "content": (
            "Project Title: Healthcare Management System (HMS)\n"
            "Category: Enterprise Full-Stack Healthcare SaaS\n"
            "Description: Enterprise-grade multi-role healthcare SaaS platform with RBAC (Patient, Doctor, Admin, Pharmacy/Lab), EHR, live queue management, & billing.\n"
            "Detailed Architecture: Built with React 19, TypeScript, Vite 8, Tailwind CSS, Zustand, and TanStack Query. Features multi-role authentication "
            "(RBAC for Patient, Doctor, Admin, Pharmacy & Lab), live token-based queue management, electronic health records (EHR), digital prescriptions, "
            "billing & invoicing system, emergency triage response, and automated offline mock service API layer.\n"
            "Key Highlights:\n"
            "- Multi-role RBAC security architecture (Patient, Doctor, Admin, Pharmacy & Lab modules).\n"
            "- Live token-based clinic queue management, EHR patient timeline, & digital prescriptions.\n"
            "- Billing & invoicing engine with instant payment status tracking & financial statement exports.\n"
            "- Automated offline mock service fallback layer for instant standalone testing & zero backend dependency.\n"
            "Tech Stack: React 19, TypeScript, Vite, Tailwind CSS, Zustand, TanStack Query, Axios, Framer Motion.\n"
            "Live URL: https://healthcare-system-one-gold.vercel.app/\n"
            "GitHub Repository: https://github.com/raghul692/Healthcare-System.git"
        ),
        "metadata": {
            "tech": ["React 19", "TypeScript", "Vite", "Tailwind CSS", "Zustand", "TanStack Query", "Axios", "Framer Motion"],
            "live": "https://healthcare-system-one-gold.vercel.app/",
            "github": "https://github.com/raghul692/Healthcare-System.git"
        }
    },
    {
        "doc_key": "proj_aether_weather",
        "title": "Project - Aether Atmospheric Intelligence Platform",
        "category": "project",
        "content": (
            "Project Title: Aether — Atmospheric Intelligence Platform\n"
            "Category: Weather & Telemetry Web Application\n"
            "Description: Production-grade atmospheric telemetry app with interactive SVG forecast curves, HTML5 radar canvas, multi-city comparison, & AI co-pilot.\n"
            "Detailed Architecture: Built with React 19, Vite, Tailwind CSS v4, and Open-Meteo REST API. Designed under glassmorphic aesthetic, "
            "it features real-time 8-card telemetry grid (AQI, Wind Vectors, UV Index, Solar Arc), interactive SVG 24-hour forecast curves, 10-day extended analysis, "
            "animated HTML5 canvas Doppler radar sweep visualizer, side-by-side multi-city comparison matrix, Web Audio API sound feedback, and an interactive AI Atmospheric Co-Pilot.\n"
            "Key Highlights:\n"
            "- Real-time 8-card atmospheric telemetry grid (AQI, Wind Vector, Solar Arc, UV Index, Barometric Pressure).\n"
            "- Interactive SVG 24-hour forecast curves & HTML5 Canvas Doppler radar sweep visualizer.\n"
            "- Side-by-side multi-city comparison matrix & severe weather alert bulletin system.\n"
            "- AI Atmospheric Co-Pilot drawer with real-time station telemetry analysis & Web Audio API FX.\n"
            "Tech Stack: React 19, Vite, Tailwind CSS, Open-Meteo API, HTML5 Canvas, Web Audio API, Lucide React.\n"
            "Live URL: https://weather-application-inky-nine.vercel.app/\n"
            "GitHub Repository: https://github.com/raghul692/Weather-Application.git"
        ),
        "metadata": {
            "tech": ["React 19", "Vite", "Tailwind CSS", "Open-Meteo API", "HTML5 Canvas", "Web Audio API", "Lucide React"],
            "live": "https://weather-application-inky-nine.vercel.app/",
            "github": "https://github.com/raghul692/Weather-Application.git"
        }
    },
    {
        "doc_key": "proj_aetheris_ai_chatbot",
        "title": "Project - Aetheris Multimodal AI ChatBot",
        "category": "project",
        "content": (
            "Project Title: Aetheris — Multimodal AI ChatBot\n"
            "Category: AI Conversational Workspace\n"
            "Description: Production-grade AI conversational workspace with real-time word-by-word streaming, context memory, syntax highlighting, & artifact drawers.\n"
            "Detailed Architecture: Built with React 19, TypeScript, Vite, Tailwind CSS v4, and Google Gemini API. Designed with a sleek glassmorphic dark-mode workspace, "
            "it features real-time word-by-word response streaming, multi-turn conversation context memory, code syntax highlighting with one-click copy, "
            "markdown artifact drawers, custom prompt persona management, and Web Audio API UI sound feedback.\n"
            "Key Highlights:\n"
            "- Integrated Google Gemini API LLM engine with real-time word-by-word response streaming & smart fallback.\n"
            "- Multi-turn conversation context manager with session history persistence & prompt persona customization.\n"
            "- Rich markdown renderer with syntax highlighted code blocks, copy snippets, & side artifact workspace panels.\n"
            "- High-craft glassmorphic dark mode workspace UI with smooth Framer Motion micro-interactions & Web Audio FX.\n"
            "Tech Stack: React 19, TypeScript, Vite, Tailwind CSS, Google Gemini API, Framer Motion, Lucide React.\n"
            "Live URL: https://chat-bot-ai-olive.vercel.app/\n"
            "GitHub Repository: https://github.com/raghul692/ChatBot-AI.git"
        ),
        "metadata": {
            "tech": ["React 19", "TypeScript", "Vite", "Tailwind CSS", "Google Gemini API", "Framer Motion", "Lucide React"],
            "live": "https://chat-bot-ai-olive.vercel.app/",
            "github": "https://github.com/raghul692/ChatBot-AI.git"
        }
    },
    {
        "doc_key": "proj_qrmaster_pro",
        "title": "Project - QRMaster Pro Enterprise QR Platform",
        "category": "project",
        "content": (
            "Project Title: QRMaster Pro — Enterprise QR Platform\n"
            "Category: Enterprise SaaS Platform\n"
            "Description: Enterprise QR code platform with dynamic short-code routing, password protection, real-time analytics, & ReportLab A4 PDF sticker export.\n"
            "Detailed Architecture: Built with React 18, Tailwind CSS, FastAPI (Python), and MySQL 8.0. Features dynamic QR codes with editable short-code routing (/r/{code}), "
            "SHA-256 password protection, expiration datetimes, device/browser/IP scan analytics, ReportLab A4 grid PDF sticker sheet exporter (21 QR stickers per sheet), "
            "developer REST API keys (qrm_live_...), 30+ QR content types, computer vision scanner (pyzbar + OpenCV), and PWA offline support.\n"
            "Key Highlights:\n"
            "- Dynamic QR codes with editable short-code routing, SHA-256 password protection, & expiration datetimes.\n"
            "- Real-time scan analytics logging device types, user-agents, IP addresses, & total scan velocity.\n"
            "- Enterprise A4 grid PDF sticker sheet generator via ReportLab (21 print-ready vector QR stickers/sheet).\n"
            "- Developer REST API key provisioning (qrm_live_...) with header auth & key revocation dashboard.\n"
            "Tech Stack: React 18, FastAPI, Python, MySQL, Tailwind CSS, SQLAlchemy, PWA, ReportLab.\n"
            "Live URL: https://qr-generator-beta-fawn.vercel.app/\n"
            "GitHub Repository: https://github.com/raghul692/QR-Generator-"
        ),
        "metadata": {
            "tech": ["React 18", "FastAPI", "Python", "MySQL", "Tailwind CSS", "SQLAlchemy", "PWA", "ReportLab"],
            "live": "https://qr-generator-beta-fawn.vercel.app/",
            "github": "https://github.com/raghul692/QR-Generator-"
        }
    },
    {
        "doc_key": "proj_expense_tracker",
        "title": "Project - Expense Tracker System AI Platform",
        "category": "project",
        "content": (
            "Project Title: Expense Tracker System — AI Financial Platform\n"
            "Category: FinTech & AI Application\n"
            "Description: AI-powered financial intelligence platform with Gemini LLM advisor, dual ledger tracking, budget caps, & receipt OCR scanner.\n"
            "Detailed Architecture: Built with React 19, TypeScript, Vite, Tailwind CSS v4, Recharts, and Google Gemini AI. Offers complete control over income streams, "
            "operational expenses, subscription overhead, savings vaults, category taxonomy, and strict budget caps with live AI financial diagnostics and word-by-word conversational advice.\n"
            "Key Highlights:\n"
            "- Integrated AI Financial Advisor with Google Gemini API & local smart fallback engine.\n"
            "- Executive dashboard with Recharts cash-flow area charts & category distribution heatmaps.\n"
            "- Relational ledger manager with sub-ledgers, category cascading updates, & receipt OCR scanner.\n"
            "- Subscriptions manager, savings vaults studio, and exportable financial statements (CSV/PDF).\n"
            "Tech Stack: React 19, TypeScript, Vite, Tailwind CSS, Google Gemini API, Recharts, Lucide React.\n"
            "Live URL: https://expense-tracker-system-theta.vercel.app/\n"
            "GitHub Repository: https://github.com/raghul692/Expense-Tracker-System"
        ),
        "metadata": {
            "tech": ["React 19", "TypeScript", "Vite", "Tailwind CSS", "Google Gemini API", "Recharts", "Lucide React"],
            "live": "https://expense-tracker-system-theta.vercel.app/",
            "github": "https://github.com/raghul692/Expense-Tracker-System"
        }
    },
    {
        "doc_key": "proj_multi_disease_prediction",
        "title": "Project - Multi-Disease Prediction System (ML)",
        "category": "project",
        "content": (
            "Project Title: Multi-Disease Prediction System\n"
            "Category: Machine Learning & HealthTech\n"
            "Description: ML healthcare system predicting Diabetes, Heart Disease, Parkinson's, Liver, & Kidney disease risks with automated report exports.\n"
            "Detailed Architecture: Developed during internship at TVK Technologies. Leverages 6 benchmarked machine learning algorithms "
            "(Random Forest, SVM, Gradient Boosting, Decision Tree, Logistic Regression, Extra Trees) with cross-validation and hyperparameter optimization across 5 diagnostic domains. "
            "Built with an interactive Streamlit UI, real-time risk radar analytics, prediction history, and multi-format PDF/CSV report exports.\n"
            "Key Highlights:\n"
            "- Benchmarked 6 ML algorithms for optimal per-disease predictive accuracy across 5 diagnostic modules.\n"
            "- Built interactive Streamlit web dashboard with real-time risk score analytics & radar chart visualizations.\n"
            "- Implemented automated multi-format report exports in CSV, Excel, and PDF formats.\n"
            "- Serialized trained models (Pickle/Joblib) and deployed production application on Streamlit Cloud.\n"
            "Tech Stack: Python, Streamlit, Scikit-Learn, Pandas, NumPy, Plotly, FPDF2, Machine Learning.\n"
            "Live URL: https://organsenseai.streamlit.app/\n"
            "GitHub Repository: https://github.com/raghul692/Multi-Prediction-Sytem"
        ),
        "metadata": {
            "tech": ["Python", "Streamlit", "Scikit-Learn", "Pandas", "NumPy", "Plotly", "FPDF2", "Machine Learning"],
            "live": "https://organsenseai.streamlit.app/",
            "github": "https://github.com/raghul692/Multi-Prediction-Sytem"
        }
    },
    {
        "doc_key": "proj_jarvis_ai",
        "title": "Project - JARVIS AI Voice Assistant",
        "category": "project",
        "content": (
            "Project Title: JARVIS AI Assistant\n"
            "Category: AI & Voice Automation\n"
            "Description: Voice-powered AI assistant with multi-engine speech recognition, NLP, system control, & neural TTS synthesis.\n"
            "Detailed Architecture: Inspired by Marvel's Iron Man JARVIS. Integrates speech recognition (Whisper/Google/Sphinx), Edge Neural Text-to-Speech, "
            "OpenAI GPT-4 conversational intelligence, Wolfram Alpha computational queries, OpenWeatherMap, and real-time OS telemetry monitoring.\n"
            "Key Highlights:\n"
            "- Multi-engine speech recognition (Google, Whisper, Sphinx) & Microsoft Edge neural TTS synthesis.\n"
            "- OpenAI GPT-4 & Wolfram Alpha integration for complex calculations and natural language reasoning.\n"
            "- Real-time system telemetry monitoring (CPU, RAM, disk, battery status) via psutil.\n"
            "- Web scraping & API integration for real-time weather, news, YouTube playback, and search.\n"
            "Tech Stack: Python, OpenAI API, Whisper, PyTorch, Edge TTS, PyYAML, psutil, WolframAlpha.\n"
            "GitHub Repository: https://github.com/raghul692/jarvis-AI-"
        ),
        "metadata": {
            "tech": ["Python", "OpenAI API", "Whisper", "PyTorch", "Edge TTS", "PyYAML", "psutil", "WolframAlpha"],
            "github": "https://github.com/raghul692/jarvis-AI-"
        }
    },
    {
        "doc_key": "proj_xss_finder",
        "title": "Project - XSS Finder Security Scanner CLI",
        "category": "project",
        "content": (
            "Project Title: XSS Finder — Security Scanner\n"
            "Category: Cybersecurity & Security Tooling\n"
            "Description: CLI tool for detecting Reflected, Stored, and DOM-based Cross-Site Scripting (XSS) vulnerabilities.\n"
            "Detailed Architecture: Automated CLI security scanner designed for ethical penetration testing and vulnerability research. "
            "Features a recursive web crawling engine to harvest URLs/forms, a multi-category payload injection engine (WAF-bypass, polyglots, DOM sinks), "
            "reflection context detector, false-positive analyzer, and JSON/TXT report generator.\n"
            "Key Highlights:\n"
            "- Automated web crawling engine for link, HTML form, & GET/POST parameter discovery.\n"
            "- Multi-category payload injection suite (Basic, Advanced, WAF Bypass, & DOM sinks).\n"
            "- Context-aware reflection detector & false positive reduction analyzer module.\n"
            "- Concurrent multithreaded scanning with automated JSON & TXT report generation.\n"
            "Tech Stack: Python, BeautifulSoup4, Requests, Cybersecurity, CLI, Multithreading, JSON Reports.\n"
            "GitHub Repository: https://github.com/raghul692/xss_finder"
        ),
        "metadata": {
            "tech": ["Python", "BeautifulSoup4", "Requests", "Cybersecurity", "CLI", "Multithreading", "JSON Reports"],
            "github": "https://github.com/raghul692/xss_finder"
        }
    },
    {
        "doc_key": "proj_wolf2x_finder",
        "title": "Project - Wolf2X Finder Cybersecurity Scanner API",
        "category": "project",
        "content": (
            "Project Title: Wolf2X Finder — Cybersecurity Scanner API\n"
            "Category: Security API & Automated Auditing\n"
            "Description: Python security testing engine & REST API scanner for web vulnerability detection, payload injection, & multi-format reports.\n"
            "Detailed Architecture: Developed in collaboration with Cyber Wolf Team. Contributed core API integration, scan routing, and payload delivery modules. "
            "Features automated web target crawling, multi-category vulnerability auditing (XSS, SQLi, CSRF, header misconfigurations), context reflection analysis, and multi-format report exports (PDF, HTML, CSV, JSON).\n"
            "Key Highlights:\n"
            "- Contributed core REST API engine & scan request router for automated vulnerability auditing.\n"
            "- Multi-threaded target crawler & context-aware payload injection engine for web vulnerability assessment.\n"
            "- Automated multi-format security audit report generator exporting in PDF, HTML, CSV, and JSON formats.\n"
            "- Built for ethical penetration testing and automated integration with CI/CD security pipelines.\n"
            "Tech Stack: Python, REST API, Cybersecurity, BeautifulSoup4, Requests, ReportLab, Multithreading.\n"
            "Live URL: https://www.cyberwolf.pro\n"
            "GitHub Repository: https://github.com/Tamilselvan-S-Cyber-Security/Wolf2X-Finder.git"
        ),
        "metadata": {
            "tech": ["Python", "REST API", "Cybersecurity", "BeautifulSoup4", "Requests", "ReportLab", "Multithreading"],
            "live": "https://www.cyberwolf.pro",
            "github": "https://github.com/Tamilselvan-S-Cyber-Security/Wolf2X-Finder.git"
        }
    },
    {
        "doc_key": "cert_oracle_ai",
        "title": "Certificate - Oracle Cloud Infrastructure 2025 Certified AI Foundations Associate",
        "category": "certificate",
        "content": (
            "Certificate: Oracle Cloud Infrastructure 2025 Certified AI Foundations Associate\n"
            "Issuer: Oracle\n"
            "Date Issued: 2025-10-14 (Expiry: 2027-10-14)\n"
            "Credential ID: 101650781OCI25AICFA\n"
            "Skills & Domains: Oracle Cloud Infrastructure, AI Foundations, Machine Learning Fundamentals, Cloud Computing Architecture, Neural Networks, Oracle AI Services.\n"
            "Description: Certified in Oracle Cloud Infrastructure AI Foundations, demonstrating verified knowledge of AI concepts, machine learning workflows, and cloud AI infrastructure."
        ),
        "metadata": {
            "issuer": "Oracle",
            "credential_id": "101650781OCI25AICFA",
            "category": "cloud"
        }
    },
    {
        "doc_key": "cert_cyberwolf_pen_testing",
        "title": "Certificate - App Penetration Testing by CyberWolf",
        "category": "certificate",
        "content": (
            "Certificate: App Penetration Testing\n"
            "Issuer: CyberWolf\n"
            "Date Issued: 2025-08-10\n"
            "Skills & Domains: Penetration Testing, Ethical Hacking, Cybersecurity, Mobile Application Security, Vulnerability Assessment, OWASP Top 10.\n"
            "Description: Hands-on training and certification in ethical hacking, web/mobile penetration testing techniques, payload construction, and vulnerability reporting."
        ),
        "metadata": {
            "issuer": "CyberWolf",
            "category": "security"
        }
    }
]

def run_ingestion():
    logger.info("Starting Portfolio AI Knowledge Base Ingestion...")
    total_docs = len(PORTFOLIO_KNOWLEDGE)
    total_chunks = 0

    for i, item in enumerate(PORTFOLIO_KNOWLEDGE, 1):
        doc_key = item["doc_key"]
        title = item["title"]
        category = item["category"]
        content = item["content"]
        metadata = item.get("metadata", {})

        logger.info(f"[{i}/{total_docs}] Ingesting document: '{title}' ({category})")
        doc_id = insert_document(
            doc_key=doc_key,
            title=title,
            category=category,
            content=content,
            metadata=metadata,
            source_type="portfolio"
        )

        # Generate embedding for the full content text
        embedding = generate_embedding(content)

        chunk_id = insert_chunk(
            doc_id=doc_id,
            chunk_index=0,
            chunk_text=content,
            embedding=embedding,
            metadata={"doc_key": doc_key, "title": title, "category": category}
        )
        total_chunks += 1
        logger.info(f"   -> Inserted chunk (Vector Dim: {len(embedding)}) for '{doc_key}'")

    logger.info(f"Ingestion complete! Total Documents: {total_docs}, Total Chunks: {total_chunks}")

if __name__ == "__main__":
    run_ingestion()
