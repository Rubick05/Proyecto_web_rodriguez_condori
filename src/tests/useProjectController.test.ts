import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useProjectController } from '../controllers/useProjectController'
import { IndexedDbProjectRepository } from '../infrastructure/IndexedDbProjectRepository'

describe('useProjectController (Import & Persistence)', () => {
  it('debe importar un proyecto desde JSON válido y persistirlo', async () => {
    const repo = new IndexedDbProjectRepository()
    const { result } = renderHook(() => useProjectController({ repository: repo }))

    const validJson = JSON.stringify({
      id: 'proj-imported-1',
      title: 'Presentación Importada',
      author: 'Carlos',
      slides: [
        {
          id: 's1',
          title: 'Slide 1 Importada',
          layout: 'text-only',
          content: 'Contenido 1',
          order: 0,
        },
        {
          id: 's2',
          title: 'Slide 2 Importada',
          layout: 'image-only',
          imageUrl: 'https://example.com/img.jpg',
          order: 1,
        },
      ],
    })

    await act(async () => {
      await result.current.importProjectFromJson(validJson)
    })

    expect(result.current.project.title).toBe('Presentación Importada')
    expect(result.current.project.slides).toHaveLength(2)
    expect(result.current.project.slides[0].title).toBe('Slide 1 Importada')
    expect(result.current.project.slides[1].layout).toBe('image-only')
  })

  it('debe rechazar un JSON con formato inválido o sin diapositivas', async () => {
    const repo = new IndexedDbProjectRepository()
    const { result } = renderHook(() => useProjectController({ repository: repo }))

    await expect(
      act(async () => {
        await result.current.importProjectFromJson('{"title": "Invalido"}')
      })
    ).rejects.toThrow()
  })
})

