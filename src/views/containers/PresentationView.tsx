import React, { useEffect } from 'react'
import type { Project } from '../../models/Project'
import type { Slide } from '../../models/Slide'
import { SlideRenderer } from '../components/SlideRenderer'
import {
  ChevronLeft,
  ChevronRight,
  X,
  Maximize2,
  Minimize2,
  Printer,
} from 'lucide-react'

export interface PresentationViewProps {
  project: Project
  slides: Slide[]
  currentIndex: number
  onNextSlide: () => void
  onPrevSlide: () => void
  onExitPresentation: () => void
  onPrintPdf?: () => void
}

/**
 * Contenedor PresentationView (Capa View)
 * 
 * Modo de proyección inmersivo a pantalla completa.
 * Incluye atajos de teclado (Flechas, Espacio, Escape), barra de progreso y controles flotantes.
 */
export const PresentationView: React.FC<PresentationViewProps> = ({
  project,
  slides,
  currentIndex,
  onNextSlide,
  onPrevSlide,
  onExitPresentation,
  onPrintPdf,
}) => {
  const activeSlide = slides[currentIndex] || slides[0]
  const progressPercent = ((currentIndex + 1) / Math.max(slides.length, 1)) * 100

  // Atajos de teclado para el presentador
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowDown':
        case ' ': // Barra espaciadora
          e.preventDefault()
          onNextSlide()
          break
        case 'ArrowLeft':
        case 'ArrowUp':
          e.preventDefault()
          onPrevSlide()
          break
        case 'Escape':
          e.preventDefault()
          onExitPresentation()
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onNextSlide, onPrevSlide, onExitPresentation])

  // Alternar pantalla completa real en el navegador
  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {})
    } else {
      document.exitFullscreen().catch(() => {})
    }
  }

  return (
    <div className="relative w-screen h-screen bg-slate-950 flex flex-col items-center justify-center p-4 sm:p-10 select-none overflow-hidden">
      {/* Diapositiva Activa con relación de aspecto 16:9 */}
      <div className="w-full max-w-5xl aspect-[16/9] max-h-[88vh] shadow-2xl transition-all duration-300">
        {activeSlide && (
          <SlideRenderer
            slide={activeSlide}
            isEditable={false}
            projectTitle={project.title}
            author={project.author}
            currentSlideIndex={currentIndex}
            totalSlides={slides.length}
          />
        )}
      </div>

      {/* Barra de progreso inferior */}
      <div className="absolute bottom-0 inset-x-0 h-1.5 bg-slate-800 no-print">
        <div
          className="h-full bg-indigo-500 transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Controles Flotantes para el Presentador (Visibles al pasar el ratón) */}
      <div className="absolute bottom-6 flex items-center gap-3 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 px-4 py-2 rounded-full shadow-2xl opacity-40 hover:opacity-100 transition-opacity no-print">
        <button
          onClick={onPrevSlide}
          disabled={currentIndex === 0}
          className="p-1.5 rounded-full text-slate-300 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
          title="Anterior (Flecha Izq)"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <span className="font-mono text-xs font-semibold text-slate-300 px-2">
          {currentIndex + 1} / {slides.length}
        </span>

        <button
          onClick={onNextSlide}
          disabled={currentIndex === slides.length - 1}
          className="p-1.5 rounded-full text-slate-300 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
          title="Siguiente (Espacio o Flecha Der)"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        <div className="w-px h-4 bg-slate-700 mx-1" />

        <button
          onClick={toggleFullScreen}
          className="p-1.5 rounded-full text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          title="Pantalla Completa"
        >
          {document.fullscreenElement ? (
            <Minimize2 className="w-4 h-4" />
          ) : (
            <Maximize2 className="w-4 h-4" />
          )}
        </button>

        {onPrintPdf && (
          <button
            onClick={onPrintPdf}
            className="p-1.5 rounded-full text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            title="Guardar como PDF / Imprimir"
          >
            <Printer className="w-4 h-4" />
          </button>
        )}

        <button
          onClick={onExitPresentation}
          className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-600/80 hover:bg-rose-600 text-white transition-colors"
          title="Salir (Escape)"
        >
          <X className="w-3.5 h-3.5" />
          <span>Salir</span>
        </button>
      </div>
    </div>
  )
}
