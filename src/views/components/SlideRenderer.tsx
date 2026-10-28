import React from 'react'
import type { Slide } from '../../models/Slide'
import { HeaderFooter } from './HeaderFooter'
import { LayoutTextOnly } from './LayoutTextOnly'
import { LayoutImageOnly } from './LayoutImageOnly'
import { LayoutTextAndImage } from './LayoutTextAndImage'

export interface SlideRendererProps {
  slide: Slide
  isEditable?: boolean
  onUpdate?: (partial: Partial<Slide>) => void
  projectTitle?: string
  author?: string
  currentSlideIndex: number
  totalSlides: number
  aspectRatio?: '16:9' | '4:3' | 'free'
}

/**
 * SlideRenderer (Capa View)
 * 
 * Componente polimórfico central que evalúa el layout de la diapositiva
 * y orquesta su renderizado dentro del marco HeaderFooter.
 */
export const SlideRenderer: React.FC<SlideRendererProps> = ({
  slide,
  isEditable = false,
  onUpdate,
  projectTitle,
  author,
  currentSlideIndex,
  totalSlides,
}) => {
  const renderLayout = () => {
    switch (slide.layout) {
      case 'image-only':
        return <LayoutImageOnly slide={slide} isEditable={isEditable} onUpdate={onUpdate} />
      case 'text-and-image':
        return <LayoutTextAndImage slide={slide} isEditable={isEditable} onUpdate={onUpdate} />
      case 'text-only':
      default:
        return <LayoutTextOnly slide={slide} isEditable={isEditable} onUpdate={onUpdate} />
    }
  }

  return (
    <div className="w-full h-full bg-white rounded-2xl shadow-xl border border-slate-200/80 flex flex-col overflow-hidden transition-all duration-300">
      <HeaderFooter
        title={projectTitle}
        author={author}
        currentSlideIndex={currentSlideIndex}
        totalSlides={totalSlides}
      >
        {renderLayout()}
      </HeaderFooter>
    </div>
  )
}
