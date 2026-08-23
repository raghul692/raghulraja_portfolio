# Portfolio - Advanced

A premium, award-winning personal portfolio website inspired by Apple, OpenAI, Stripe, Linear, and Vercel. Built with modern 2026 UI trends featuring glassmorphism, aurora gradients, 3D backgrounds, and smooth animations.

## Features

### Frontend

- **React 18** + **TypeScript** + **Vite**
- **Tailwind CSS** with custom design tokens
- **Framer Motion** for scroll animations and transitions
- **React Three Fiber** + **Drei** for 3D particle background
- **Lenis** for smooth scrolling
- **Lucide React** for consistent iconography
- **Dark/Light theme** toggle with persistence
- **Command Palette** (Ctrl/Cmd + K)
- **Custom cursor** with hover effects
- **Scroll progress** indicator
- **Glassmorphism** cards and navigation
- **Aurora gradients** and mesh backgrounds
- **Noise texture** overlay
- **Responsive design** (mobile, tablet, desktop, 4K)

### Sections

- **Hero** - Animated name/role with gradient text, social icons, CTA buttons, profile image with float animation
- **About** - Professional bio, stats (Projects, Certifications, Internships, Passion), education, soft skills, languages, interactive tech stack with category filters
- **Projects** - 6 projects with filter tabs (All, Full Stack, AI/ML, Frontend, UI/UX), case study modals with architecture details
- **Experience** - Vertical timeline with internship highlights
- **Certificates** - 12 certificates with category filters, search, preview modal with actual file opening
- **Contact** - Professional form with validation, honeypot spam protection, MySQL storage, and email notifications via Resend

### Backend

- **FastAPI** with async support
- **MySQL** database with auto-initialization
- **Resend API** for professional HTML email notifications
- **CORS** configured for frontend integration
- **Input validation** and spam protection

### SEO & Performance

- Meta tags, Open Graph, Twitter Cards
- Schema.org structured data (Person)
- robots.txt and sitemap.xml
- Code splitting (vendor, three, motion, utils chunks)
- Image optimization ready
- Target: 90+ Lighthouse score

### Accessibility

- WCAG 2.2 AA compliant
- Keyboard navigation support
- Focus indicators
- Semantic HTML
- Reduced motion support
- Screen reader labels

## Tech Stack

### Frontend

| Technology | Purpose |
| --- | --- |
| React 18 | UI framework |
| TypeScript | Type safety |
| Vite | Build tool |
| Tailwind CSS | Styling |
| Framer Motion | Animations |
| React Three Fiber | 3D graphics |
| Lucide React | Icons |
| Lenis | Smooth scroll |

### Backend

| Technology | Purpose |
| --- | --- |
| FastAPI | API framework |
| MySQL | Database |
| Resend | Email service |
| Uvicorn | ASGI server |
| Pydantic | Data validation |

## Project Structure

```
portfolio/
├── src/
│   ├── components/
│   │   ├── animations/
│   │   │   ├── CommandPalette.tsx
│   │   │   ├── CustomCursor.tsx
│   │   │   └── ScrollProgress.tsx
│   │   ├── certificates/
│   │   ├── layout/
│   │   │   ├── Footer.tsx
│   │   │   ├── LenisProvider.tsx
│   │   │   ├── Navbar.tsx
│   │   │   └── ThemeProviderWrapper.tsx
│   │   ├── sections/
│   │   │   ├── About.tsx
│   │   │   ├── Certificates.tsx
│   │   │   ├── Contact.tsx
│   │   │   ├── Experience.tsx
│   │   │   ├── Hero.tsx
│   │   │   └── Projects.tsx
│   │   ├── three/
│   │   │   └── ParticleBackground.tsx
│   │   └── ui/
│   ├── contexts/
│   │   ├── LenisContext.tsx
│   │   └── ThemeContext.tsx
│   ├── data/
│   │   └── resume.ts
│   ├── hooks/
│   ├── lib/
│   ├── pages/
│   ├── styles/
│   │   └── globals.css
│   ├── utils/
│   │   └── cn.ts
│   ├── assets/
│   ├── App.tsx
│   └── main.tsx
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   ├── .env.example
│   └── .env
├── public/
│   ├── certificates/
│   ├── images/
│   ├── resume/
│   ├── assets/
│   ├── favicon.png
│   ├── og-image.svg
│   ├── robots.txt
│   └── sitemap.xml
├── index.html
├── package.json
├── tailwind.config.ts
├── vite.config.ts
├── tsconfig.json
└── README.md
```

## Design System

### Colors

- **Primary**: `#6366f1` (Indigo)
- **Secondary**: `#06b6d4` (Cyan)
- **Accent**: `#f59e0b` (Amber)
- **Background**: `#06060a` (Dark)
- **Surface**: `#0a0a0f`
- **Glass**: `rgba(255,255,255,0.04)` with backdrop blur
- **Border**: `rgba(255,255,255,0.08)`

### Typography

- **Headings**: Space Grotesk
- **Body**: Inter
- **Code**: JetBrains Mono
- **Responsive scale**: text-5xl to text-7xl for hero headings

### Effects

- **Glassmorphism**: `bg-glass backdrop-blur-xl border-glass-border`
- **Aurora Gradient**: `bg-aurora-gradient animate-aurora`
- **Mesh Gradient**: `bg-mesh-gradient`
- **Glow**: `shadow-glow`, `shadow-glass-hover`
- **Noise**: Fixed overlay with SVG turbulence filter

## Installation

### Prerequisites

- Node.js 18+
- npm 9+
- Python 3.10+
- MySQL 8.0+ (or SQLite alternative)

### Frontend Setup

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Configure environment variables
cp .env.example .env
# Edit .env with your MySQL credentials and Resend API key

# Run FastAPI server
uvicorn main:app --reload
```

### Environment Variables

Create `backend/.env`:

```env
# Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=portfolio

# Email (Resend)
RESEND_API_KEY=re_xxxxxxxxxxxxx
FROM_EMAIL=portfolio@raghulraja.dev
TO_EMAIL=raghulraja2006@gmail.com
```

## Database Schema

### contact_submissions

```sql
CREATE TABLE contact_submissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(255),
    message TEXT NOT NULL,
    status ENUM('new', 'read', 'replied') DEFAULT 'new',
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## API Endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/api/health` | Health check |
| POST | `/api/contact` | Submit contact form |

### Contact Form Payload

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Project Collaboration",
  "message": "Hi, I would like to discuss a project...",
  "honeypot": ""
}
```

## Deployment

### Frontend (Vercel/Render)

```bash
npm run build
# Deploy dist/ folder
```

### Backend (Render/Railway)

```bash
# Set environment variables in dashboard
# Deploy with uvicorn main:app --host 0.0.0.0 --port $PORT
```

### Database

- Use PlanetScale, Railway MySQL, or AWS RDS
- Update `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` in backend `.env`

## Customization

### Update Personal Information

Edit `src/data/resume.ts`:

- `resume.name` - Your name
- `resume.title` - Your role
- `resume.email` - Your email
- `resume.phone` - Your phone number
- `resume.location` - Your location
- `resume.summary` - Your bio
- `resume.socials` - Social links
- `resume.projects` - Project details
- `resume.education` - Education history
- `resume.experience` - Work experience
- `certificates` - Certificate data

### Update Social Links

In `src/data/resume.ts`, update the `socials` object:

```typescript
socials: {
  github: 'https://github.com/yourusername',
  linkedin: 'https://linkedin.com/in/yourusername',
  instagram: 'https://instagram.com/yourusername',
  portfolio: 'https://yourdomain.com',
}
```

### Update Tech Stack

In `src/data/resume.ts`, modify the `techStack` array:

```typescript
export const techStack = [
  { name: 'React', category: 'frontend', icon: 'React' },
  { name: 'Node.js', category: 'backend', icon: 'NodeJS' },
  // Add more...
]
```

### Update Colors

In `tailwind.config.ts`, modify the theme colors:

```typescript
colors: {
  primary: { DEFAULT: '#6366f1', ... },
  secondary: { DEFAULT: '#06b6d4', ... },
  accent: { DEFAULT: '#f59e0b', ... },
}
```

### Update Certificates

1. Add certificate files to `public/certificates/`
2. Update `certificates` array in `src/data/resume.ts` with:
   - `file` - exact filename in public/certificates/
   - `title`, `issuer`, `date`, `category`, `skills`, `description`

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Performance Optimization

- Code splitting for vendor, three, motion, and utils
- Image optimization (use WebP/AVIF formats)
- Font preloading from Google Fonts
- CSS purge with Tailwind
- Lazy loading for non-critical components
- Target: 90+ Lighthouse score

## License

MIT

## Contact

Raghul Raja M - raghulraja2006@gmail.com

Project Link: https://github.com/raghul692/portfolio