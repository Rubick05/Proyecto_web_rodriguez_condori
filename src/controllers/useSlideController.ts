import { useState, useCallback } from 'react'
import { type Slide, type SlideLayoutType, createDefaultSlide } from '../models/Slide'

export interface UseSlideControllerReturn {
  slides: Slide[]
  currentIndex: number
  activeSlide: Slide | undefined
  goToSlide: (index: number) => void
  nextSlide: () => void
  prevSlide: () => void
  addSlide: (layout?: SlideLayoutType) => void
  deleteSlide: (index: number) => void
  updateActiveSlide: (partial: Partial<Slide>) => void
  updateSlideAt: (index: number, partial: Partial<Slide>) => void
  reorderSlides: (fromIndex: number, toIndex: number) => void
  setSlides: React.Dispatch<React.SetStateAction<Slide[]>>
}

/**
 * Hook Controlador: Gestión de diapositivas (Capa Controller)
 * 
 * Centraliza la lógica de navegación, agregado, mutación y ordenamiento
 * manteniendo el estado inmutable y reactivo.
 */
export function useSlideController(initialSlides: Slide[]): UseSlideControllerReturn {
  const [slides, setSlides] = useState<Slide[]>(initialSlides)
  const [currentIndex, setCurrentIndex] = useState<number>(0)

  const activeSlide = slides[currentIndex] || slides[0]

  const goToSlide = useCallback((index: number) => {
    if (index >= 0 && index < slides.length) {
      setCurrentIndex(index)
    }
  }, [slides.length])

  const nextSlide = useCallback(() => {
    setCurrentIndex(prev => (prev < slides.length - 1 ? prev + 1 : prev))
  }, [slides.length])

  const prevSlide = useCallback(() => {
    setCurrentIndex(prev => (prev > 0 ? prev - 1 : prev))
  }, [])

  const addSlide = useCallback((layout: SlideLayoutType = 'text-only', initialData?: Partial<Slide>) => {
    setSlides(prev => {
      const newSlide = {
        ...createDefaultSlide(prev.length, layout),
        ...initialData,
      }
      return [...prev, newSlide]
    })
    setSlides(prev => {
      setCurrentIndex(prev.length - 1)
      return prev
    })
  }, [])

  const deleteSlide = useCallback((index: number) => {
    setSlides(prev => {
      if (prev.length <= 1) return prev // Mantener al menos una diapositiva siempre
      const updated = prev.filter((_, i) => i !== index).map((s, i) => ({ ...s, order: i }))
      return updated
    })
    setCurrentIndex(prev => {
      if (prev >= index && prev > 0) {
        return prev - 1
      }
      return prev
    })
  }, [])

  const updateActiveSlide = useCallback((partial: Partial<Slide>) => {
    setSlides(prev => {
      return prev.map((s, i) => {
        if (i === currentIndex) {
          return {
            ...s,
            ...partial,
            updatedAt: new Date().toISOString(),
          }
        }
        return s
      })
    })
  }, [currentIndex])

  const updateSlideAt = useCallback((index: number, partial: Partial<Slide>) => {
    setSlides(prev => {
      return prev.map((s, i) => {
        if (i === index) {
          return {
            ...s,
            ...partial,
            updatedAt: new Date().toISOString(),
          }
        }
        return s
      })
    })
  }, [])

  const reorderSlides = useCallback((fromIndex: number, toIndex: number) => {
    setSlides(prev => {
      if (fromIndex < 0 || fromIndex >= prev.length || toIndex < 0 || toIndex >= prev.length) {
        return prev
      }
      const cloned = [...prev]
      const [moved] = cloned.splice(fromIndex, 1)
      cloned.splice(toIndex, 0, moved)
      return cloned.map((s, i) => ({ ...s, order: i }))
    })
    setCurrentIndex(toIndex)
  }, [])

  return {
    slides,
    currentIndex,
    activeSlide,
    goToSlide,
    nextSlide,
    prevSlide,
    addSlide,
    deleteSlide,
    updateActiveSlide,
    updateSlideAt,
    reorderSlides,
    setSlides,
  }
}
