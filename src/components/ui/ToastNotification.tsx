'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, AlertCircle, Info, XCircle, X } from 'lucide-react'

export interface ToastMessage {
  id: string
  title: string
  description?: string
  type: 'success' | 'info' | 'warning' | 'error'
  duration?: number
}

// Global helper function to trigger toasts from anywhere in the codebase
export function notify(title: string, description?: string, type: ToastMessage['type'] = 'success') {
  if (typeof window !== 'undefined') {
    const event = new CustomEvent('app-toast', {
      detail: {
        id: Math.random().toString(36).substring(2, 9),
        title,
        description,
        type,
        duration: 3500,
      },
    })
    window.dispatchEvent(event)
  }
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  useEffect(() => {
    const handleToast = (e: Event) => {
      const customEvent = e as CustomEvent<ToastMessage>
      const newToast = customEvent.detail
      setToasts(prev => [...prev.slice(-3), newToast]) // keep max 4 visible toasts

      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== newToast.id))
      }, newToast.duration || 3500)
    }

    window.addEventListener('app-toast', handleToast)
    return () => window.removeEventListener('app-toast', handleToast)
  }, [])

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }

  return (
    <div className="fixed bottom-6 left-6 z-[100] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      <AnimatePresence mode="popLayout">
        {toasts.map(toast => {
          const Icon =
            toast.type === 'success'
              ? CheckCircle2
              : toast.type === 'error'
              ? XCircle
              : toast.type === 'warning'
              ? AlertCircle
              : Info

          const colorClass =
            toast.type === 'success'
              ? 'border-emerald-500/40 text-emerald-400 bg-emerald-950/40 shadow-emerald-500/10'
              : toast.type === 'error'
              ? 'border-rose-500/40 text-rose-400 bg-rose-950/40 shadow-rose-500/10'
              : toast.type === 'warning'
              ? 'border-amber-500/40 text-amber-400 bg-amber-950/40 shadow-amber-500/10'
              : 'border-cyan-500/40 text-cyan-400 bg-cyan-950/40 shadow-cyan-500/10'

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: -50, scale: 0.8 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className={`pointer-events-auto p-4 rounded-xl glass border shadow-xl backdrop-blur-xl flex items-start gap-3 relative overflow-hidden ${colorClass}`}
            >
              <Icon className="w-5 h-5 shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <h5 className="text-xs font-bold font-heading text-white">{toast.title}</h5>
                {toast.description && (
                  <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">{toast.description}</p>
                )}
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-slate-400 hover:text-white transition-colors p-0.5 rounded"
              >
                <X className="w-3.5 h-3.5" />
              </button>

              {/* Progress Bar Animation */}
              <motion.div
                initial={{ width: '100%' }}
                animate={{ width: '0%' }}
                transition={{ duration: (toast.duration || 3500) / 1000, ease: 'linear' }}
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-current opacity-50"
              />
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
