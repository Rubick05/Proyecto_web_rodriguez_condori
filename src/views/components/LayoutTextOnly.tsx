import React from 'react'
import type { Slide } from '../../models/Slide'
import { getTypographyClasses } from '../../utils/typographyStyles'

export interface LayoutProps {
  slide: Slide
  isEditable?: boolean
  onUpdate?: (partial: Partial<Slide>) => void
}

/**
 * Layout 1: Solo Texto (Capa View)
 * Enfoque en tipografía limpia, jerarquía de títulos y contenido narrativo con formato personalizable.
 */
export const LayoutTextOnly: React.FC<LayoutProps> = ({
  slide,
  isEditable = false,
  onUpdate,
}) => {
  const styles = getTypographyClasses(slide.typography)

  if (isEditable) {
    return (
      <div className="flex flex-col h-full justify-center space-y-4 max-w-3xl mx-auto w-full overflow-hidden">
        <textarea
          value={slide.title}
          onChange={(e) => onUpdate?.({ title: e.target.value })}
          placeholder="Escribe el título de la diapositiva..."
          rows={2}
          className={`${styles.titleCombined} text-slate-800 tracking-tight bg-transparent border-b-2 border-transparent hover:border-slate-300 focus:border-indigo-600 focus:outline-none transition-colors w-full pb-1 resize-none`}
        />
        <textarea
          value={slide.content}
          onChange={(e) => onUpdate?.({ content: e.target.value })}
          placeholder="Ingresa aquí las ideas clave, puntos o texto explicativo..."
          rows={6}
          className={`${styles.contentCombined} text-slate-600 leading-relaxed bg-transparent border border-dashed border-slate-200 hover:border-slate-300 focus:border-indigo-500 rounded-lg p-3 resize-none focus:outline-none transition-colors`}
        />
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full justify-center max-w-3xl mx-auto w-full space-y-5 animate-fadeIn">
      <h2 className={`${styles.titleCombined} text-slate-900 tracking-tight leading-tight break-words`}>
        {slide.title}
      </h2>
      <div className={`${styles.contentCombined} text-slate-600 leading-relaxed whitespace-pre-line`}>
        {slide.content}
      </div>
    </div>
  )
}
