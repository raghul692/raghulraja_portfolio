import { createContext, useContext, ReactNode } from 'react'

interface LenisContextType {
  lenis: any | null
}

export const LenisContext = createContext<LenisContextType>({ lenis: null })

export function LenisContextProvider({ children }: { children: ReactNode }) {
  return (
    <LenisContext.Provider value={{ lenis: null }}>
      {children}
    </LenisContext.Provider>
  )
}

export function useLenis() {
  return useContext(LenisContext)
}
