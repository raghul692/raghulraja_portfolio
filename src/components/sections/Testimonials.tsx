'use client'

import { motion } from 'framer-motion'
import { Quote, Star, CheckCircle, Building2, UserCheck } from 'lucide-react'

interface Testimonial {
  name: string
  role: string
  organization: string
  quote: string
  skillsEvaluated: string[]
  verified: boolean
}

const testimonials: Testimonial[] = [
  {
    name: 'Priyatharshan A',
    role: 'Program Manager & Mentor',
    organization: 'TVK Technologies',
    quote: 'Raghul demonstrated exceptional AI engineering capabilities during his internship. He independently architected the Multi-Disease Prediction System using Streamlit and Scikit-Learn across 5 medical modules with rigorous model evaluation. His work ethics and code organization are outstanding.',
    skillsEvaluated: ['Python', 'Machine Learning', 'Streamlit', 'Data Preprocessing'],
    verified: true,
  },
  {
    name: 'Academic Mentorship Panel',
    role: 'Department of Computer Science',
    organization: 'SKP Engineering College',
    quote: 'Raghul Raja M consistently maintains strong academic performance (8.2 CGPA) while actively working on real-world full-stack web applications and AI projects. He exhibits strong problem-solving skills and teamwork.',
    skillsEvaluated: ['Full-Stack Development', 'React', 'Database Design', 'Algorithms'],
    verified: true,
  },
  {
    name: 'EBPL AI Training Team',
    role: 'Generative AI Division',
    organization: 'EBPL',
    quote: 'Showcased great enthusiasm and prompt understanding of Generative AI workflows, LLM applications, and practical implementation patterns during the course completion program.',
    skillsEvaluated: ['Generative AI', 'Prompt Engineering', 'Python'],
    verified: true,
  },
]

export default function Testimonials() {
  return (
    <section id="testimonials" className="relative py-24 bg-surface-dark overflow-hidden border-t border-glass-border">
      <div className="absolute inset-0 bg-mesh-gradient opacity-30 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center md:text-left"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-semibold uppercase tracking-wider mb-3 border border-accent/20">
            <UserCheck className="w-4 h-4" /> Endorsements & Feedback
          </div>
          <h2 className="font-heading text-4xl md:text-5xl font-bold tracking-tight">
            Mentorship & <span className="bg-clip-text text-transparent bg-aurora-gradient animate-aurora">Recommendations</span>
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl">
            Feedback and performance evaluations from industry supervisors, internship managers, and academic mentors.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              className="glass rounded-2xl p-8 hover:border-glass-borderHover transition-all flex flex-col justify-between hover:shadow-glass-hover"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="p-3 rounded-xl bg-primary/10 text-primary border border-primary/20">
                    <Quote className="w-6 h-6" />
                  </div>
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                </div>

                <p className="text-sm text-muted-foreground leading-relaxed italic mb-6">
                  "{t.quote}"
                </p>
              </div>

              <div>
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {t.skillsEvaluated.map((skill, sIdx) => (
                    <span
                      key={sIdx}
                      className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/5 border border-white/10 text-muted-foreground"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                <div className="pt-4 border-t border-glass-border flex items-center justify-between">
                  <div>
                    <h4 className="font-heading text-base font-bold text-foreground flex items-center gap-1.5">
                      {t.name}
                      {t.verified && (
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                      )}
                    </h4>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                    <p className="text-xs text-secondary font-medium flex items-center gap-1 mt-0.5">
                      <Building2 className="w-3 h-3 text-secondary" /> {t.organization}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
