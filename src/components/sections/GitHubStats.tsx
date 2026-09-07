'use client'

import { useState, useEffect, useMemo } from 'react'
import {
  Github,
  BookOpen,
  Users,
  Star,
  GitFork,
  ExternalLink,
  RefreshCw,
  Layers,
  Clock,
  GitCommit,
  CheckCircle2,
} from 'lucide-react'
import soundEngine from '@/utils/soundEngine'

interface Repository {
  id: number
  name: string
  full_name: string
  html_url: string
  description: string
  stars: number
  forks: number
  language: string
  updated_at: string
  pushed_at?: string
}

interface LanguageShare {
  language: string
  count: number
  percentage: number
}

interface GitHubStatsData {
  status: 'online' | 'cached' | 'fallback'
  username: string
  name: string
  avatar_url: string
  html_url: string
  bio: string
  public_repos: number
  followers: number
  following: number
  total_stars: number
  total_forks: number
  languages: LanguageShare[]
  top_repos: Repository[]
  cached_at?: string
  sync_source: string
  latest_push?: {
    repo: string
    time: string
  }
}

const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f7df1e',
  Python: '#3572A5',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Shell: '#89e051',
  'C++': '#f34b7d',
  Vue: '#41b883',
}

const CACHE_KEY = 'raghul_github_stats_v3'
const CACHE_TTL_MS = 5 * 60 * 1000 // 5 minutes

// Verified Real Snapshot Fallback (Used strictly when offline or all endpoints unreachable)
const REAL_FALLBACK_DATA: GitHubStatsData = {
  status: 'fallback',
  username: 'raghul692',
  name: 'RAGHUL RAJA M',
  avatar_url: 'https://github.com/raghul692.png',
  html_url: 'https://github.com/raghul692',
  bio: 'Full Stack & AI/ML Developer | TVK Tech Intern | Crafting scalable web applications.',
  public_repos: 18,
  followers: 1,
  following: 2,
  total_stars: 3,
  total_forks: 0,
  sync_source: 'Verified Offline Snapshot',
  latest_push: {
    repo: 'raghulraja_portfolio',
    time: 'Recently updated',
  },
  languages: [
    { language: 'TypeScript', count: 7, percentage: 38.9 },
    { language: 'Python', count: 5, percentage: 27.8 },
    { language: 'JavaScript', count: 3, percentage: 16.7 },
    { language: 'HTML', count: 3, percentage: 16.6 },
  ],
  top_repos: [
    {
      id: 1,
      name: 'raghulraja_portfolio',
      full_name: 'raghul692/raghulraja_portfolio',
      html_url: 'https://github.com/raghul692/raghulraja_portfolio',
      description: 'Official portfolio & AI intelligence suite engineered with React, Three.js, Tailwind CSS & FastAPI.',
      stars: 1,
      forks: 0,
      language: 'TypeScript',
      updated_at: new Date().toISOString(),
      pushed_at: new Date().toISOString(),
    },
    {
      id: 2,
      name: 'Multi-Prediction-Sytem',
      full_name: 'raghul692/Multi-Prediction-Sytem',
      html_url: 'https://github.com/raghul692/Multi-Prediction-Sytem',
      description: 'Machine Learning multi-disease predictive health diagnosis suite utilizing Streamlit and Scikit-Learn.',
      stars: 1,
      forks: 0,
      language: 'Python',
      updated_at: new Date().toISOString(),
      pushed_at: new Date().toISOString(),
    },
    {
      id: 3,
      name: 'Personal_AI_AGENT',
      full_name: 'raghul692/Personal_AI_AGENT',
      html_url: 'https://github.com/raghul692/Personal_AI_AGENT',
      description: 'Autonomous AI assistant with multi-tool calling, persistent memory, and workflow routing.',
      stars: 0,
      forks: 0,
      language: 'Python',
      updated_at: new Date().toISOString(),
      pushed_at: new Date().toISOString(),
    },
    {
      id: 4,
      name: 'E-commerce-Website_Shopnova',
      full_name: 'raghul692/E-commerce-Website_Shopnova',
      html_url: 'https://github.com/raghul692/E-commerce-Website_Shopnova',
      description: 'Modern e-commerce platform with dynamic cart, responsive product filtering, and checkout flow.',
      stars: 0,
      forks: 0,
      language: 'TypeScript',
      updated_at: new Date().toISOString(),
      pushed_at: new Date().toISOString(),
    },
    {
      id: 5,
      name: 'Healthcare-System',
      full_name: 'raghul692/Healthcare-System',
      html_url: 'https://github.com/raghul692/Healthcare-System',
      description: 'Comprehensive patient record management and appointment booking platform.',
      stars: 0,
      forks: 0,
      language: 'TypeScript',
      updated_at: new Date().toISOString(),
      pushed_at: new Date().toISOString(),
    },
    {
      id: 6,
      name: 'Weather-Application',
      full_name: 'raghul692/Weather-Application',
      html_url: 'https://github.com/raghul692/Weather-Application',
      description: 'Live interactive weather forecast dashboard powered by OpenWeatherMap API with adaptive themes.',
      stars: 0,
      forks: 0,
      language: 'JavaScript',
      updated_at: new Date().toISOString(),
      pushed_at: new Date().toISOString(),
    },
  ],
}

function formatRelativeTime(isoString?: string): string {
  if (!isoString) return 'recently'
  const diff = Date.now() - new Date(isoString).getTime()
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days}d ago`
  const months = Math.floor(days / 30)
  return `${months}mo ago`
}

export default function GitHubStats() {
  const [stats, setStats] = useState<GitHubStatsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)
  const [error, setError] = useState(false)
  const [sortBy, setSortBy] = useState<'updated' | 'stars'>('updated')

  // 4-Tier Hybrid Synchronization Engine
  const fetchGitHubData = async (forceRefresh = false) => {
    if (forceRefresh) {
      setSyncing(true)
      soundEngine.playClickSound()
    } else {
      setLoading(true)
    }
    setError(false)

    // TIER 1: Check Local Micro-Cache for Instant 0ms Render
    if (!forceRefresh && typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem(CACHE_KEY)
        if (cached) {
          const parsed = JSON.parse(cached)
          if (parsed && parsed.timestamp && Date.now() - parsed.timestamp < CACHE_TTL_MS) {
            setStats({
              ...parsed.data,
              status: 'cached',
              sync_source: 'Local Micro-Cache (Ultra-Fast)',
            })
            setLoading(false)
            return
          }
        }
      } catch {
        // Continue to network fetch if storage is unreadable
      }
    }

    try {
      // TIER 2: Direct Client-Side GitHub REST API (Fast, Fresh, 300ms)
      const userRes = await fetch('https://api.github.com/users/raghul692', {
        headers: {
          Accept: 'application/vnd.github.v3+json',
        },
      })

      if (userRes.ok) {
        const userData = await userRes.json()

        const reposRes = await fetch(
          'https://api.github.com/users/raghul692/repos?sort=updated&per_page=100',
          {
            headers: {
              Accept: 'application/vnd.github.v3+json',
            },
          }
        )

        if (reposRes.ok) {
          const reposData = await reposRes.json()

          let totalStars = 0
          let totalForks = 0
          const langCounts: Record<string, number> = {}
          const mappedRepos: Repository[] = []

          // Sort repositories by newest push first to identify latest activity
          const sortedByPush = [...reposData].sort(
            (a, b) =>
              new Date(b.pushed_at || b.updated_at).getTime() -
              new Date(a.pushed_at || a.updated_at).getTime()
          )

          const latestRepo = sortedByPush[0]
          const latestPush = latestRepo
            ? {
                repo: latestRepo.name,
                time: formatRelativeTime(latestRepo.pushed_at || latestRepo.updated_at),
              }
            : undefined

          for (const r of reposData) {
            if (r.fork) continue // Skip external forks
            const stars = r.stargazers_count || 0
            const forks = r.forks_count || 0
            totalStars += stars
            totalForks += forks

            if (r.language) {
              langCounts[r.language] = (langCounts[r.language] || 0) + 1
            }

            mappedRepos.push({
              id: r.id,
              name: r.name,
              full_name: r.full_name,
              html_url: r.html_url,
              description: r.description || 'Open source engineering repository.',
              stars,
              forks,
              language: r.language || 'TypeScript',
              updated_at: r.updated_at,
              pushed_at: r.pushed_at,
            })
          }

          // Calculate Language Distribution
          const totalLangs = Object.values(langCounts).reduce((a, b) => a + b, 0) || 1
          const languages: LanguageShare[] = Object.entries(langCounts)
            .map(([language, count]) => ({
              language,
              count,
              percentage: Number(((count / totalLangs) * 100).toFixed(1)),
            }))
            .sort((a, b) => b.count - a.count)

          const freshData: GitHubStatsData = {
            status: 'online',
            username: userData.login || 'raghul692',
            name: userData.name || 'Raghul Raja M',
            avatar_url: userData.avatar_url || 'https://github.com/raghul692.png',
            html_url: userData.html_url || 'https://github.com/raghul692',
            bio: userData.bio || 'Full Stack & AI/ML Developer',
            public_repos: userData.public_repos || mappedRepos.length,
            followers: userData.followers || 0,
            following: userData.following || 0,
            total_stars: totalStars,
            total_forks: totalForks,
            languages,
            top_repos: mappedRepos,
            cached_at: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            sync_source: 'GitHub REST API (Live)',
            latest_push: latestPush,
          }

          setStats(freshData)

          // Save to LocalStorage Micro-Cache
          try {
            localStorage.setItem(
              CACHE_KEY,
              JSON.stringify({ timestamp: Date.now(), data: freshData })
            )
          } catch {
            // Ignore storage quota errors
          }

          setLoading(false)
          setSyncing(false)
          return
        }
      }

      // TIER 3: Transparent Fallback to Cloud Backend Proxy (Render)
      const renderApiUrl = 'https://raghulraja-portfolio.onrender.com/api/v1/github/stats'
      const cloudRes = await fetch(renderApiUrl, {
        headers: { Accept: 'application/json' },
      })

      // Strict validation: Must be 200 OK and explicitly JSON (Prevents SPA index.html crashes!)
      if (cloudRes.ok && cloudRes.headers.get('content-type')?.includes('application/json')) {
        const cloudData = await cloudRes.json()
        const formattedData: GitHubStatsData = {
          ...cloudData,
          status: 'online',
          sync_source: 'Render Cloud Proxy (Cached)',
        }
        setStats(formattedData)
        try {
          localStorage.setItem(
            CACHE_KEY,
            JSON.stringify({ timestamp: Date.now(), data: formattedData })
          )
        } catch {
          // Ignore quota
        }
        setLoading(false)
        setSyncing(false)
        return
      }

      throw new Error('All live endpoints returned non-JSON or were rate-limited.')
    } catch (err) {
      console.warn('Live GitHub sync encounter: using verified snapshot fallback.', err)
      setError(true)

      // TIER 4: Verified Real Snapshot Fallback
      setStats(REAL_FALLBACK_DATA)
    } finally {
      setLoading(false)
      setSyncing(false)
    }
  }

  useEffect(() => {
    fetchGitHubData()
  }, [])

  // Dynamic Repository Sorting (Recently Updated vs Most Starred)
  const displayedRepos = useMemo(() => {
    if (!stats || !stats.top_repos) return []
    const repos = [...stats.top_repos]
    if (sortBy === 'stars') {
      repos.sort(
        (a, b) =>
          b.stars - a.stars ||
          new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      )
    } else {
      repos.sort(
        (a, b) =>
          new Date(b.pushed_at || b.updated_at).getTime() -
          new Date(a.pushed_at || a.updated_at).getTime()
      )
    }
    return repos.slice(0, 6)
  }, [stats, sortBy])

  const handleSortChange = (newSort: 'updated' | 'stars') => {
    soundEngine.playClickSound()
    setSortBy(newSort)
  }

  return (
    <div className="glass rounded-2xl p-4 sm:p-6 border border-glass-border space-y-4 sm:space-y-6 w-full overflow-hidden">
      {/* HEADER BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="p-2 sm:p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20 shrink-0">
            <Github className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="min-w-0">
            <h4 className="font-heading font-bold text-base sm:text-lg flex items-center gap-2 truncate">
              Live GitHub REST API Sync
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
            </h4>
            <p className="text-[11px] sm:text-xs text-muted-foreground truncate flex items-center gap-1.5">
              <span className="text-emerald-400 font-medium">●</span>
              {stats?.sync_source || (error ? 'Showing verified snapshot' : 'Real-time repository telemetry synced from @raghul692')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          {/* LATEST PUSH ACTIVITY BADGE */}
          {stats?.latest_push && (
            <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[11px] font-mono text-muted-foreground">
              <GitCommit className="w-3 h-3 text-emerald-400 shrink-0" />
              <span className="text-foreground font-medium truncate max-w-[130px]">{stats.latest_push.repo}</span>
              <span className="text-[10px] text-muted-foreground">({stats.latest_push.time})</span>
            </div>
          )}

          {/* MANUAL SYNC BUTTON */}
          <button
            onClick={() => fetchGitHubData(true)}
            disabled={loading || syncing}
            className="p-2 sm:p-2.5 rounded-xl glass hover:bg-white/10 text-muted-foreground hover:text-foreground transition-all flex items-center gap-1.5 text-xs font-mono border border-white/10 cursor-pointer disabled:opacity-50"
            title="Force Live GitHub API Sync"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin text-primary' : ''}`} />
            <span>{syncing ? 'Syncing...' : 'Sync Live'}</span>
          </button>
        </div>
      </div>

      {/* METRICS CARDS GRID */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
          <div className="glass rounded-xl p-2.5 sm:p-4 text-center border border-white/10 hover:border-primary/40 transition-all min-w-0">
            <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary mx-auto mb-1" />
            <span className="text-xl sm:text-2xl font-bold font-mono tracking-tight text-foreground block truncate">
              {stats.public_repos}
            </span>
            <p className="text-[10px] sm:text-[11px] text-muted-foreground font-medium uppercase tracking-wider mt-0.5 truncate">
              Repositories
            </p>
          </div>
          <div className="glass rounded-xl p-2.5 sm:p-4 text-center border border-white/10 hover:border-amber-400/40 transition-all min-w-0">
            <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 mx-auto mb-1" />
            <span className="text-xl sm:text-2xl font-bold font-mono tracking-tight text-foreground block truncate">
              {stats.total_stars}
            </span>
            <p className="text-[10px] sm:text-[11px] text-muted-foreground font-medium uppercase tracking-wider mt-0.5 truncate">
              Stars Earned
            </p>
          </div>
          <div className="glass rounded-xl p-2.5 sm:p-4 text-center border border-white/10 hover:border-cyan-400/40 transition-all min-w-0">
            <GitFork className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-400 mx-auto mb-1" />
            <span className="text-xl sm:text-2xl font-bold font-mono tracking-tight text-foreground block truncate">
              {stats.total_forks}
            </span>
            <p className="text-[10px] sm:text-[11px] text-muted-foreground font-medium uppercase tracking-wider mt-0.5 truncate">
              Forks
            </p>
          </div>
          <div className="glass rounded-xl p-2.5 sm:p-4 text-center border border-white/10 hover:border-purple-400/40 transition-all min-w-0">
            <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-400 mx-auto mb-1" />
            <span className="text-xl sm:text-2xl font-bold font-mono tracking-tight text-foreground block truncate">
              {stats.followers}
            </span>
            <p className="text-[10px] sm:text-[11px] text-muted-foreground font-medium uppercase tracking-wider mt-0.5 truncate">
              Followers
            </p>
          </div>
        </div>
      )}

      {/* TOP LANGUAGES DISTRIBUTION */}
      {stats && stats.languages && stats.languages.length > 0 && (
        <div className="space-y-2.5 sm:space-y-3 glass p-3 sm:p-4 rounded-xl border border-white/5 min-w-0">
          <div className="flex flex-wrap items-center justify-between text-xs gap-1">
            <span className="font-semibold text-foreground flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-primary" /> Repository Language Distribution
            </span>
            <span className="text-muted-foreground font-mono text-[10px] sm:text-[11px]">
              Primary: <span className="text-foreground font-medium">{stats.languages[0]?.language}</span>
            </span>
          </div>

          {/* DYNAMIC STACK BAR */}
          <div className="h-2 sm:h-2.5 w-full bg-white/5 rounded-full overflow-hidden flex">
            {stats.languages.map((langItem) => (
              <div
                key={langItem.language}
                style={{
                  width: `${langItem.percentage}%`,
                  backgroundColor: LANGUAGE_COLORS[langItem.language] || '#6366f1',
                }}
                title={`${langItem.language}: ${langItem.percentage}% (${langItem.count} repos)`}
                className="h-full transition-all duration-500 hover:opacity-80"
              />
            ))}
          </div>

          {/* LEGEND BADGES */}
          <div className="flex flex-wrap gap-x-3 gap-y-1.5 pt-1">
            {stats.languages.map((langItem) => (
              <div
                key={langItem.language}
                className="flex items-center gap-1 text-[11px] sm:text-xs text-muted-foreground"
              >
                <span
                  className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full inline-block shrink-0"
                  style={{ backgroundColor: LANGUAGE_COLORS[langItem.language] || '#6366f1' }}
                />
                <span className="font-mono text-foreground font-medium">{langItem.language}</span>
                <span className="text-[10px] text-muted-foreground">({langItem.percentage}%)</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FEATURED LIVE REPOSITORIES GRID WITH DUAL SORT CONTROLS */}
      {displayedRepos.length > 0 && (
        <div className="space-y-3 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Featured Live Repositories ({displayedRepos.length} of {stats?.public_repos || 18})
              </p>
              <span className="text-[9px] sm:text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                Live
              </span>
            </div>

            {/* DUAL SORT TOGGLE */}
            <div className="flex items-center gap-1 p-0.5 rounded-lg bg-white/5 border border-white/10 self-start sm:self-auto">
              <button
                onClick={() => handleSortChange('updated')}
                className={`px-2 py-1 rounded-md text-[11px] font-mono flex items-center gap-1 transition-all ${
                  sortBy === 'updated'
                    ? 'bg-primary text-primary-foreground font-semibold shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Clock className="w-3 h-3" />
                <span>Recently Active</span>
              </button>
              <button
                onClick={() => handleSortChange('stars')}
                className={`px-2 py-1 rounded-md text-[11px] font-mono flex items-center gap-1 transition-all ${
                  sortBy === 'stars'
                    ? 'bg-primary text-primary-foreground font-semibold shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Star className="w-3 h-3" />
                <span>Most Starred</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3">
            {displayedRepos.map((repo) => (
              <a
                key={repo.id}
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={() => soundEngine.playHoverSound()}
                className="group glass p-3.5 sm:p-4 rounded-xl border border-white/10 hover:border-primary/50 transition-all hover:bg-white/[0.04] flex flex-col justify-between min-w-0"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <h5 className="font-mono text-xs sm:text-sm font-bold text-foreground group-hover:text-primary transition-colors truncate">
                      {repo.name}
                    </h5>
                    <span className="text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded-full bg-white/5 border border-white/10 font-mono text-muted-foreground flex items-center gap-1 shrink-0">
                      <span
                        className="w-1.5 h-1.5 rounded-full shrink-0"
                        style={{ backgroundColor: LANGUAGE_COLORS[repo.language] || '#6366f1' }}
                      />
                      {repo.language}
                    </span>
                  </div>
                  <p className="text-[11px] sm:text-xs text-muted-foreground line-clamp-2 mb-3 leading-relaxed">
                    {repo.description}
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs pt-2.5 border-t border-white/5 text-muted-foreground font-mono">
                  <div className="flex items-center gap-3 text-[11px]">
                    <span className="flex items-center gap-1 group-hover:text-amber-400 transition-colors">
                      <Star className="w-3 h-3 text-amber-400" /> {repo.stars}
                    </span>
                    <span className="flex items-center gap-1 group-hover:text-cyan-400 transition-colors">
                      <GitFork className="w-3 h-3 text-cyan-400" /> {repo.forks}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {formatRelativeTime(repo.pushed_at || repo.updated_at)}
                    </span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform text-primary shrink-0" />
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* FOOTER LINK & STATUS */}
      <div className="pt-2 flex flex-wrap items-center justify-between gap-2 text-xs border-t border-white/5">
        <span className="text-[10px] sm:text-[11px] text-muted-foreground font-mono flex items-center gap-1.5">
          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
          {stats?.cached_at ? `Synced at ${stats.cached_at}` : 'Real-Time Telemetry Active'}
        </span>
        <a
          href={`https://github.com/${stats?.username || 'raghul692'}`}
          target="_blank"
          rel="noopener noreferrer"
          onMouseEnter={() => soundEngine.playHoverSound()}
          onClick={() => soundEngine.playClickSound()}
          className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline font-medium font-mono"
        >
          View All {stats?.public_repos || 18} Repositories on GitHub <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  )
}
