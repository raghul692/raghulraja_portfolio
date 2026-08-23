import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { LenisContextProvider } from '@/contexts/LenisContext'
import ThemeContextWrapper from '@/components/layout/ThemeProviderWrapper'
import { RoleProvider } from '@/context/RoleContext'
import App from '@/App'
import '@/styles/globals.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeContextWrapper>
        <LenisContextProvider>
          <RoleProvider>
            <App />
          </RoleProvider>
        </LenisContextProvider>
      </ThemeContextWrapper>
    </BrowserRouter>
  </React.StrictMode>,
)
