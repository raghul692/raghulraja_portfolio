'use client'

import React, { createContext, useContext, useState } from 'react'

export type RoleType = 'all' | 'ai' | 'fullstack' | 'uiux'

interface RoleContextType {
  activeRole: RoleType
  setActiveRole: (role: RoleType) => void
}

const RoleContext = createContext<RoleContextType | undefined>(undefined)

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [activeRole, setActiveRole] = useState<RoleType>('all')

  return (
    <RoleContext.Provider value={{ activeRole, setActiveRole }}>
      {children}
    </RoleContext.Provider>
  )
}

export function useRole() {
  const context = useContext(RoleContext)
  if (!context) {
    throw new Error('useRole must be used within a RoleProvider')
  }
  return context
}
