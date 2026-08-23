'use client'

import { useState, useEffect } from 'react'
import { Github, BookOpen, Users, Code, Activity, ExternalLink, RefreshCw } from 'lucide-react'

interface GitHubProfile {
  name: string
  login: string
  avatar_url: string
  html_url: string
  public_repos: number
  followers: number
  following: number
  bio: string
  created_at: string
}

export default function GitHubStats() {
  const [profile, setProfile] = useState<GitHubProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const fetchGitHubData = async () => {
    setLoading(true)
    setError(false)
    try {
      const res = await fetch('https://api.github.com/users/raghul692')
      if (!res.ok) throw new Error('Failed to fetch')
      const data = await res.json()
      setProfile(data)
    } catch (err) {
      console.error(err)
      setError(true)
      // Fallback mock profile if GitHub API rate limit is exceeded
      setProfile({
        name: 'Raghul Raja M',
        login: 'raghul692',
        avatar_url: 'https://github.com/raghul692.png',
        html_url: 'https://github.com/raghul692',
        public_repos: 15,
        followers: 12,
        following: 18,
        bio: 'Full Stack & AI/ML Developer | Crafting scalable web applications and intelligent systems.',
        created_at: '2023-01-01',
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchGitHubData()
  }, [])

  return (
    <div className="glass rounded-2xl p-6 border border-glass-border space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
            <Github className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-heading font-bold text-lg flex items-center gap-2">
              Live GitHub Activity
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
              </span>
            </h4>
            <p className="text-xs text-muted-foreground">
              {error ? 'Showing offline metrics snapshot' : 'Real-time statistics from @raghul692'}
            </p>
          </div>
        </div>
        <button
          onClick={fetchGitHubData}
          className="p-2 rounded-lg glass hover:bg-white/10 text-muted-foreground hover:text-foreground transition-all"
          title="Refresh Data"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {profile && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="glass rounded-xl p-3.5 text-center border border-white/5">
            <BookOpen className="w-4 h-4 text-primary mx-auto mb-1" />
            <span className="text-xl font-bold font-heading">{profile.public_repos}</span>
            <p className="text-[11px] text-muted-foreground">Repositories</p>
          </div>
          <div className="glass rounded-xl p-3.5 text-center border border-white/5">
            <Users className="w-4 h-4 text-secondary mx-auto mb-1" />
            <span className="text-xl font-bold font-heading">{profile.followers}</span>
            <p className="text-[11px] text-muted-foreground">Followers</p>
          </div>
          <div className="glass rounded-xl p-3.5 text-center border border-white/5">
            <Activity className="w-4 h-4 text-accent mx-auto mb-1" />
            <span className="text-xl font-bold font-heading">100%</span>
            <p className="text-[11px] text-muted-foreground">Commit Quality</p>
          </div>
          <div className="glass rounded-xl p-3.5 text-center border border-white/5">
            <Code className="w-4 h-4 text-green-400 mx-auto mb-1" />
            <span className="text-xl font-bold font-heading">TS / Py</span>
            <p className="text-[11px] text-muted-foreground">Top Stack</p>
          </div>
        </div>
      )}

      {/* GitHub Cards Integration */}
      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">GitHub Contribution Card</p>
        <div className="rounded-xl overflow-hidden glass p-2 border border-glass-border">
          <img
            src="https://github-readme-stats.vercel.app/api?username=raghul692&show_icons=true&theme=dark&bg_color=0a0a0f&hide_border=true&title_color=6366f1&icon_color=06b6d4&text_color=cbd5e1"
            alt="Raghul Raja GitHub Stats"
            className="w-full h-auto rounded-lg"
            loading="lazy"
            onError={(e) => {
              // Hide image gracefully if stats service is unreachable
              ;(e.target as HTMLElement).style.display = 'none'
            }}
          />
        </div>
      </div>

      <div className="pt-2 flex justify-end">
        <a
          href="https://github.com/raghul692"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-xs text-primary hover:underline font-medium"
        >
          View Full GitHub Profile <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  )
}
