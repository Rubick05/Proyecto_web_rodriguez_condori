import React from 'react'
import type { Slide } from '../../models/Slide'
import { InteractiveCanvasImage } from './InteractiveCanvasImage'
import { getTypographyClasses } from '../../utils/typographyStyles'

export interface LayoutProps {
  slide: Slide
  isEditable?: boolean
  onUpdate?: (partial: Partial<Slide>) => void
}

/**
 * Layout 3: Texto e Imagen combinados (Capa View)
 * Diseño a dos columnas equilibrado para explicaciones técnicas con gráficos o capturas,
 * con soporte de tipografía personalizada y movimiento de imagen en canvas.
 */
export const LayoutTextAndImage: React.FC<LayoutProps> = ({
  slide,
  isEditable = false,
  onUpdate,
}) => {
  const styles = getTypographyClasses(slide.typography)

  if (isEditable) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full items-center max-w-5xl mx-auto w-full">
        {/* Columna Izquierda: Textos con formato dinámico */}
        <div className="flex flex-col space-y-4">
          <textarea
            value={slide.title}
            onChange={(e) => onUpdate?.({ title: e.target.value })}
            placeholder="Título de la diapositiva..."
            rows={2}
            className={`${styles.titleCombined} text-slate-800 leading-tight bg-transparent border-b border-transparent hover:border-slate-300 focus:border-indigo-600 focus:outline-none transition-colors w-full pb-1 resize-none`}
          />
          <textarea
            value={slide.content}
            onChange={(e) => onUpdate?.({ content: e.target.value })}
            placeholder="Puntos clave, explicación o viñetas..."
            rows={5}
            className={`${styles.contentCombined} text-slate-600 leading-relaxed bg-transparent border border-dashed border-slate-200 hover:border-slate-300 focus:border-indigo-500 rounded-lg p-3 resize-none focus:outline-none transition-colors`}
          />
        </div>

        {/* Columna Derecha: Canvas de Imagen */}
        <div className="relative h-64 sm:h-72 w-full rounded-2xl bg-slate-50/70 border-2 border-dashed border-slate-200/80 overflow-hidden shadow-inner flex items-center justify-center">
          <InteractiveCanvasImage
            imageConfig={slide.imageConfig}
            fallbackUrl={slide.imageUrl}
            altText={slide.title}
            isEditable={true}
            onUpdateImage={(updated) => onUpdate?.(updated)}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full items-center max-w-5xl mx-auto w-full">
      <div className="flex flex-col space-y-4">
        <h2 className={`${styles.titleCombined} text-slate-900 tracking-tight leading-snug break-words`}>
          {slide.title}
        </h2>
        <div className={`${styles.contentCombined} text-slate-600 leading-relaxed whitespace-pre-line font-normal`}>
          {slide.content}
        </div>
      </div>
      <div className="relative h-64 sm:h-80 w-full overflow-hidden rounded-2xl flex items-center justify-center">
        <InteractiveCanvasImage
          imageConfig={slide.imageConfig}
          fallbackUrl={slide.imageUrl}
          altText={slide.title}
          isEditable={false}
          onUpdateImage={() => {}}
        />
      </div>
    </div>
  )
}
