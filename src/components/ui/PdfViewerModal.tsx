'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, ExternalLink, Download, FileText, ZoomIn, ZoomOut } from 'lucide-react'
import { useState } from 'react'

interface PdfViewerModalProps {
  isOpen: boolean
  onClose: () => void
  pdfUrl: string
  title: string
}

export function PdfViewerModal({ isOpen, onClose, pdfUrl, title }: PdfViewerModalProps) {
  const [zoom, setZoom] = useState(100)

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-black/80 backdrop-blur-md"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-5xl h-[85vh] bg-surface-dark border border-glass-border rounded-2xl shadow-2xl overflow-hidden flex flex-col"
          onClick={e => e.stopPropagation()}
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-glass-border bg-black/40">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-heading text-lg font-bold text-foreground line-clamp-1">
                  {title}
                </h3>
                <p className="text-xs text-muted-foreground">PDF Document Viewer</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setZoom(prev => Math.max(prev - 20, 60))}
                className="p-2 rounded-lg glass glass-hover text-muted-foreground hover:text-foreground text-xs flex items-center gap-1"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="text-xs font-mono text-muted-foreground w-12 text-center">
                {zoom}%
              </span>
              <button
                onClick={() => setZoom(prev => Math.min(prev + 20, 160))}
                className="p-2 rounded-lg glass glass-hover text-muted-foreground hover:text-foreground text-xs flex items-center gap-1"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>

              <a
                href={pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg glass glass-hover text-muted-foreground hover:text-primary text-xs flex items-center gap-1"
                title="Open in new tab"
              >
                <ExternalLink className="w-4 h-4" />
              </a>

              <a
                href={pdfUrl}
                download
                className="p-2 rounded-lg bg-primary/15 border border-primary/30 text-primary hover:bg-primary/25 text-xs flex items-center gap-1 font-medium"
                title="Download PDF"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Download</span>
              </a>

              <button
                onClick={onClose}
                className="p-2 rounded-lg glass glass-hover text-muted-foreground hover:text-foreground"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* PDF Viewer Body */}
          <div className="flex-1 w-full bg-neutral-900/90 relative overflow-auto p-4 flex items-center justify-center">
            <div
              className="w-full h-full transition-all duration-200"
              style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }}
            >
              <iframe
                src={`${pdfUrl}#toolbar=0&navpanes=0`}
                className="w-full h-full rounded-lg border border-white/10 shadow-lg"
                title={title}
              />
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
