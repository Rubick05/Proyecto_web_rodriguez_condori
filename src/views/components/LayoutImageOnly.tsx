import React from 'react'
import type { Slide } from '../../models/Slide'
import { Image as ImageIcon } from 'lucide-react'

export interface LayoutProps {
  slide: Slide
  isEditable?: boolean
  onUpdate?: (partial: Partial<Slide>) => void
}

const SAMPLE_IMAGES = [
  'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&auto=format&fit=crop&q=80',
]

/**
 * Layout 2: Solo Imagen (Capa View)
 * Enfoque en impacto visual, diagramas de arquitectura, gráficos o fotografía.
 */
export const LayoutImageOnly: React.FC<LayoutProps> = ({
  slide,
  isEditable = false,
  onUpdate,
}) => {
  const currentImage = slide.imageUrl || SAMPLE_IMAGES[0]

  if (isEditable) {
    return (
      <div className="flex flex-col h-full justify-between max-w-4xl mx-auto w-full space-y-4">
        <input
          type="text"
          value={slide.title}
          onChange={(e) => onUpdate?.({ title: e.target.value })}
          placeholder="Título del gráfico o imagen..."
          className="text-2xl sm:text-3xl font-bold text-slate-800 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-indigo-600 focus:outline-none transition-colors w-full"
        />

        {/* Contenedor de Imagen y Selector */}
        <div className="relative flex-1 min-h-[220px] max-h-[360px] bg-slate-900 rounded-xl overflow-hidden shadow-inner group">
          <img
            src={currentImage}
            alt={slide.title}
            className="w-full h-full object-cover opacity-90 transition-opacity"
          />

          {/* Barra de control de URL */}
          <div className="absolute inset-x-0 bottom-0 bg-slate-950/80 backdrop-blur-md p-3 flex flex-wrap items-center gap-2 border-t border-slate-700">
            <ImageIcon className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="text"
              value={slide.imageUrl || ''}
              onChange={(e) => onUpdate?.({ imageUrl: e.target.value })}
              placeholder="URL de la imagen (o selecciona una muestra)..."
              className="flex-1 text-xs bg-slate-800 text-slate-200 border border-slate-700 rounded px-2.5 py-1.5 focus:outline-none focus:border-indigo-500"
            />
            <div className="flex items-center gap-1.5">
              {SAMPLE_IMAGES.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => onUpdate?.({ imageUrl: img })}
                  className="text-[10px] px-2 py-1 bg-slate-800 hover:bg-indigo-600 text-slate-200 rounded transition-colors"
                >
                  Muestra {idx + 1}
                </button>
              ))}
            </div>
          </div>
        </div>

        <input
          type="text"
          value={slide.imageCaption || ''}
          onChange={(e) => onUpdate?.({ imageCaption: e.target.value })}
          placeholder="Pie de foto descriptivo..."
          className="text-xs text-center text-slate-500 italic bg-transparent border-b border-dashed border-slate-200 hover:border-slate-300 focus:border-indigo-500 focus:outline-none py-1"
        />
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full justify-center max-w-4xl mx-auto w-full items-center space-y-4">
      {slide.title && (
        <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 text-center tracking-tight">
          {slide.title}
        </h2>
      )}
      <div className="relative w-full flex-1 max-h-[420px] rounded-2xl overflow-hidden shadow-2xl border border-slate-100">
        <img
          src={currentImage}
          alt={slide.title}
          className="w-full h-full object-cover"
        />
      </div>
      {slide.imageCaption && (
        <p className="text-xs sm:text-sm text-slate-500 italic text-center">
          {slide.imageCaption}
        </p>
      )}
    </div>
  )
}
