import { createContext, useContext } from 'react'

export type EnvironmentalTheme = 'sun' | 'dark' | 'moon' | 'rain' | 'snow'
export type Theme = EnvironmentalTheme

export interface ThemeMetadata {
  id: EnvironmentalTheme
  name: string
  label: string
  iconName: string
  description: string
  badgeColor: string
}

export const THEME_SEQUENCE: EnvironmentalTheme[] = ['sun', 'dark', 'moon', 'rain', 'snow']

export const THEME_METADATA: Record<EnvironmentalTheme, ThemeMetadata> = {
  sun: {
    id: 'sun',
    name: 'Sun',
    label: 'Sun Mode',
    iconName: 'Sun',
    description: 'Crisp minimal bright atmosphere with soft warm ambient light',
    badgeColor: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
  },
  dark: {
    id: 'dark',
    name: 'Dark',
    label: 'Dark Mode',
    iconName: 'Moon',
    description: 'Signature obsidian dark theme with futuristic glassmorphism',
    badgeColor: 'text-indigo-400 bg-indigo-400/10 border-indigo-400/20',
  },
  moon: {
    id: 'moon',
    name: 'Moon',
    label: 'Moon Mode',
    iconName: 'MoonStar',
    description: 'Deep futuristic midnight sky with slowly falling micro-stars',
    badgeColor: 'text-purple-400 bg-purple-400/10 border-purple-400/20',
  },
  rain: {
    id: 'rain',
    name: 'Rain',
    label: 'Rain Mode',
    iconName: 'CloudRain',
    description: 'Realistic atmospheric rainfall with multi-depth streaks & mist',
    badgeColor: 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20',
  },
  snow: {
    id: 'snow',
    name: 'Snow',
    label: 'Snow Mode',
    iconName: 'Snowflake',
    description: 'Soft winter frost environment with gentle drifting snowflakes',
    badgeColor: 'text-sky-300 bg-sky-300/10 border-sky-300/20',
  },
}

interface ThemeContextType {
  theme: EnvironmentalTheme
  toggleTheme: () => void
  setTheme: (theme: EnvironmentalTheme) => void
  activeMetadata: ThemeMetadata
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
