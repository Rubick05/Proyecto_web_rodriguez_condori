import React from 'react'
import type { Slide } from '../../models/Slide'
import { Image as ImageIcon } from 'lucide-react'

export interface LayoutProps {
  slide: Slide
  isEditable?: boolean
  onUpdate?: (partial: Partial<Slide>) => void
}

const DEFAULT_SPLIT_IMAGE = 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1000&auto=format&fit=crop&q=80'

/**
 * Layout 3: Texto e Imagen combinados (Capa View)
 * Diseño a dos columnas equilibrado para explicaciones técnicas con gráficos o capturas.
 */
export const LayoutTextAndImage: React.FC<LayoutProps> = ({
  slide,
  isEditable = false,
  onUpdate,
}) => {
  const currentImage = slide.imageUrl || DEFAULT_SPLIT_IMAGE

  if (isEditable) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full items-center max-w-5xl mx-auto w-full">
        {/* Columna Izquierda: Textos */}
        <div className="flex flex-col space-y-4">
          <textarea
            value={slide.title}
            onChange={(e) => onUpdate?.({ title: e.target.value })}
            placeholder="Título de la diapositiva..."
            rows={2}
            className="text-2xl sm:text-3xl font-extrabold text-slate-800 leading-tight bg-transparent border-b border-transparent hover:border-slate-300 focus:border-indigo-600 focus:outline-none transition-colors w-full pb-1 resize-none"
          />
          <textarea
            value={slide.content}
            onChange={(e) => onUpdate?.({ content: e.target.value })}
            placeholder="Puntos clave, explicación o viñetas..."
            rows={5}
            className="text-sm sm:text-base text-slate-600 leading-relaxed bg-transparent border border-dashed border-slate-200 hover:border-slate-300 focus:border-indigo-500 rounded-lg p-3 resize-none focus:outline-none transition-colors"
          />
        </div>

        {/* Columna Derecha: Imagen y controles */}
        <div className="flex flex-col space-y-2">
          <div className="relative h-56 sm:h-64 rounded-xl overflow-hidden bg-slate-900 shadow-md">
            <img
              src={currentImage}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs">
            <ImageIcon className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <input
              type="text"
              value={slide.imageUrl || ''}
              onChange={(e) => onUpdate?.({ imageUrl: e.target.value })}
              placeholder="URL de la imagen..."
              className="flex-1 bg-transparent text-slate-700 focus:outline-none"
            />
          </div>
          <input
            type="text"
            value={slide.imageCaption || ''}
            onChange={(e) => onUpdate?.({ imageCaption: e.target.value })}
            placeholder="Pie de foto..."
            className="text-[11px] text-slate-400 italic bg-transparent border-b border-dashed border-slate-200 px-1 focus:outline-none"
          />
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 h-full items-center max-w-5xl mx-auto w-full">
      <div className="flex flex-col space-y-4">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug break-words">
          {slide.title}
        </h2>
        <div className="text-base sm:text-lg text-slate-600 leading-relaxed whitespace-pre-line font-normal">
          {slide.content}
        </div>
      </div>
      <div className="flex flex-col space-y-2">
        <div className="h-64 sm:h-80 rounded-2xl overflow-hidden shadow-xl border border-slate-100">
          <img
            src={currentImage}
            alt={slide.title}
            className="w-full h-full object-cover"
          />
        </div>
        {slide.imageCaption && (
          <p className="text-xs text-slate-400 italic text-center">
            {slide.imageCaption}
          </p>
        )}
      </div>
    </div>
  )
}
