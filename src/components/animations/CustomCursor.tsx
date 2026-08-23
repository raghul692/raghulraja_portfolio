'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

export function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isPointer, setIsPointer] = useState(false)

  useEffect(() => {
    const move = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY })
    }

    const checkPointer = () => {
      const hovered = document.querySelectorAll('a, button, [role="button"]')
      const found = Array.from(hovered).some(el => el.matches(':hover'))
      setIsPointer(found)
    }

    window.addEventListener('mousemove', move)
    window.addEventListener('mouseover', checkPointer)

    return () => {
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mouseover', checkPointer)
    }
  }, [])

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 bg-primary rounded-full pointer-events-none z-[9999] mix-blend-difference hidden md:block"
        animate={{ x: position.x - 4, y: position.y - 4 }}
        transition={{ type: 'spring', stiffness: 500, damping: 28 }}
      />
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 border border-primary/30 rounded-full pointer-events-none z-[9998] hidden md:block"
        animate={{ x: position.x - 16, y: position.y - 16, scale: isPointer ? 1.5 : 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      />
    </>
  )
}
