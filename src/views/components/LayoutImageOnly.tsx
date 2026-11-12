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
 * Layout 2: Solo Imagen (Capa View)
 * Permite mover y redimensionar la imagen interactivamente dentro del canvas 16:9,
 * además de subir imágenes locales desde la computadora o pegar URLs externas.
 */
export const LayoutImageOnly: React.FC<LayoutProps> = ({
  slide,
  isEditable = false,
  onUpdate,
}) => {
  const styles = getTypographyClasses(slide.typography)

  if (isEditable) {
    return (
      <div className="flex flex-col h-full justify-between max-w-5xl mx-auto w-full space-y-2 relative">
        <textarea
          value={slide.title}
          onChange={(e) => onUpdate?.({ title: e.target.value })}
          placeholder="Título del gráfico o imagen..."
          rows={1}
          className={`${styles.titleCombined} text-slate-800 leading-snug bg-transparent border-b border-transparent hover:border-slate-300 focus:border-indigo-600 focus:outline-none transition-colors w-full pb-1 resize-none shrink-0`}
        />

        {/* Canvas de Imagen Interactivo con límites estrictos */}
        <div className="relative flex-1 w-full min-h-[300px] max-h-[55vh] bg-slate-50/70 rounded-2xl border-2 border-dashed border-slate-200/80 overflow-hidden shadow-inner flex items-center justify-center">
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
    <div className="flex flex-col h-full justify-between max-w-5xl mx-auto w-full space-y-2 relative">
      {slide.title && (
        <h2 className={`${styles.titleCombined} text-slate-900 tracking-tight leading-snug shrink-0 break-words`}>
          {slide.title}
        </h2>
      )}
      <div className="relative flex-1 w-full min-h-[300px] max-h-[55vh] overflow-hidden rounded-2xl flex items-center justify-center">
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
