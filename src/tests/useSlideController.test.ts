import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useSlideController } from '../controllers/useSlideController'
import { createDefaultProject } from '../models/Project'

describe('useSlideController (TDD)', () => {
  it('debe inicializarse con la primera diapositiva seleccionada', () => {
    const project = createDefaultProject('Test Slides')
    const { result } = renderHook(() => useSlideController(project.slides))

    expect(result.current.currentIndex).toBe(0)
    expect(result.current.activeSlide).toBeDefined()
    expect(result.current.slides).toHaveLength(1)
  })

  it('debe permitir añadir una nueva diapositiva y seleccionarla', () => {
    const project = createDefaultProject('Test Slides')
    const { result } = renderHook(() => useSlideController(project.slides))

    act(() => {
      result.current.addSlide('image-only')
    })

    expect(result.current.slides).toHaveLength(2)
    expect(result.current.currentIndex).toBe(1)
    expect(result.current.activeSlide?.layout).toBe('image-only')
  })

  it('debe navegar hacia adelante y hacia atrás', () => {
    const project = createDefaultProject('Test Slides')
    const { result } = renderHook(() => useSlideController(project.slides))

    act(() => {
      result.current.addSlide('text-only')
    })
    expect(result.current.currentIndex).toBe(1)

    act(() => {
      result.current.prevSlide()
    })
    expect(result.current.currentIndex).toBe(0)

    act(() => {
      result.current.nextSlide()
    })
    expect(result.current.currentIndex).toBe(1)
  })

  it('debe actualizar el contenido o título de la diapositiva activa', () => {
    const project = createDefaultProject('Test Slides')
    const { result } = renderHook(() => useSlideController(project.slides))

    act(() => {
      result.current.updateActiveSlide({
        title: 'Título Renovado',
        content: 'Nuevo contenido informativo',
      })
    })

    expect(result.current.activeSlide?.title).toBe('Título Renovado')
    expect(result.current.activeSlide?.content).toBe('Nuevo contenido informativo')
  })

  it('debe reordenar diapositivas correctamente', () => {
    const project = createDefaultProject('Test Slides')
    const { result } = renderHook(() => useSlideController(project.slides))

    act(() => {
      result.current.addSlide('image-only')
    })
    act(() => {
      result.current.updateActiveSlide({ title: 'Segunda Diapositiva' })
    })

    act(() => {
      // Reordenar índice 1 hacia índice 0
      result.current.reorderSlides(1, 0)
    })

    expect(result.current.slides[0].title).toBe('Segunda Diapositiva')
  })

  it('debe eliminar una diapositiva asegurando que quede al menos una', () => {
    const project = createDefaultProject('Test Slides')
    const { result } = renderHook(() => useSlideController(project.slides))

    act(() => {
      result.current.addSlide('text-only')
    })
    expect(result.current.slides).toHaveLength(2)

    act(() => {
      result.current.deleteSlide(1)
    })
    expect(result.current.slides).toHaveLength(1)
    expect(result.current.currentIndex).toBe(0)
  })
})
