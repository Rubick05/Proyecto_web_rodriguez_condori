import React from 'react'

export interface HeaderFooterProps {
  title?: string
  author?: string
  currentSlideIndex: number
  totalSlides: number
  showDate?: boolean
  children: React.ReactNode
}

/**
 * Componente HeaderFooter (Capa View)
 * 
 * Enmarca el contenido de la diapositiva con un encabezado minimalista y
 * un pie de página profesional que incluye numeración y metadatos del proyecto.
 */
export const HeaderFooter: React.FC<HeaderFooterProps> = ({
  title,
  author,
  currentSlideIndex,
  totalSlides,
  showDate = true,
  children,
}) => {
  const formattedDate = new Date().toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })

  return (
    <div className="relative w-full h-full flex flex-col justify-between overflow-hidden p-8 sm:p-12 select-text">
      {/* Encabezado */}
      <header className="flex items-center justify-between border-b border-slate-200/80 pb-3 mb-6 transition-all">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-indigo-600 animate-pulse" />
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 truncate max-w-xs sm:max-w-md">
            {title || 'Presentación'}
          </span>
        </div>
        {author && (
          <span className="text-xs font-medium text-slate-400">
            {author}
          </span>
        )}
      </header>

      {/* Contenido Central del Layout */}
      <main className="flex-1 flex flex-col justify-center min-h-0 overflow-auto">
        {children}
      </main>

      {/* Pie de Página */}
      <footer className="flex items-center justify-between border-t border-slate-200/80 pt-3 mt-6 text-xs text-slate-400">
        <div>
          {showDate && <span>{formattedDate}</span>}
        </div>
        <div className="flex items-center gap-1.5 font-mono text-xs font-semibold px-2.5 py-1 rounded bg-slate-100 text-slate-600">
          <span>{currentSlideIndex + 1}</span>
          <span>/</span>
          <span>{totalSlides}</span>
        </div>
      </footer>
    </div>
  )
}
