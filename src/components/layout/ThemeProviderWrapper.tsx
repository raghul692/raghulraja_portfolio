import { useState, useEffect, useCallback } from 'react'
import {
  ThemeContext,
  EnvironmentalTheme,
  THEME_SEQUENCE,
  THEME_METADATA,
} from '../../contexts/ThemeContext'

export { ThemeContext }

const STORAGE_KEY = 'portfolio_env_theme_v1'

export default function ThemeProviderWrapper({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<EnvironmentalTheme>('dark')
  const [mounted, setMounted] = useState(false)

  // Apply theme classes and attributes to <html>
  const applyThemeToDocument = useCallback((mode: EnvironmentalTheme) => {
    const root = document.documentElement
    // Remove all previous environmental classes
    root.classList.remove('theme-sun', 'theme-dark', 'theme-moon', 'theme-rain', 'theme-snow', 'dark')

    // Add current mode class
    root.classList.add(`theme-${mode}`)

    // Modes with dark UI palette
    if (mode === 'dark' || mode === 'moon' || mode === 'rain') {
      root.classList.add('dark')
    }

    // Set dataset attribute for high-precision CSS targets
    root.setAttribute('data-theme', mode)
  }, [])

  useEffect(() => {
    setMounted(true)
    // Read saved environmental theme, falling back to legacy key or 'dark' default
    let initialTheme: EnvironmentalTheme = 'dark'
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as EnvironmentalTheme | null
      if (saved && THEME_SEQUENCE.includes(saved)) {
        initialTheme = saved
      } else {
        const legacy = localStorage.getItem('theme')
        if (legacy === 'light') initialTheme = 'sun'
        else initialTheme = 'dark'
      }
    } catch {
      initialTheme = 'dark'
    }

    setThemeState(initialTheme)
    applyThemeToDocument(initialTheme)
  }, [applyThemeToDocument])

  const setTheme = useCallback(
    (nextMode: EnvironmentalTheme) => {
      setThemeState(nextMode)
      applyThemeToDocument(nextMode)
      try {
        localStorage.setItem(STORAGE_KEY, nextMode)
        localStorage.setItem('theme', nextMode === 'sun' ? 'light' : 'dark')
      } catch {
        // Storage quota
      }
    },
    [applyThemeToDocument]
  )

  // Cycles strictly: SUN -> DARK -> MOON -> RAIN -> SNOW -> SUN
  const toggleTheme = useCallback(() => {
    const currentIndex = THEME_SEQUENCE.indexOf(theme)
    const nextIndex = (currentIndex + 1) % THEME_SEQUENCE.length
    const nextTheme = THEME_SEQUENCE[nextIndex]
    setTheme(nextTheme)
  }, [theme, setTheme])

  if (!mounted) return null

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme,
        setTheme,
        activeMetadata: THEME_METADATA[theme],
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}
