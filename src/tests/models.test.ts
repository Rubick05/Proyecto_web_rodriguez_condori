import { describe, it, expect } from 'vitest'
import { createDefaultSlide } from '../models/Slide'
import { createDefaultProject } from '../models/Project'

describe('Domain Models & Factories', () => {
  it('should create a valid default slide with specified order and layout', () => {
    const slide = createDefaultSlide(0, 'text-only')
    expect(slide.id).toBeDefined()
    expect(slide.title).toBe('Diapositiva 1')
    expect(slide.layout).toBe('text-only')
    expect(slide.order).toBe(0)
    expect(slide.createdAt).toBeDefined()
  })

  it('should create a valid default project with an initial slide', () => {
    const project = createDefaultProject('Mi Charla', 'Carlos Dev')
    expect(project.id).toBeDefined()
    expect(project.title).toBe('Mi Charla')
    expect(project.author).toBe('Carlos Dev')
    expect(project.slides).toHaveLength(1)
    expect(project.slides[0].title).toBe('Título de la Presentación')
  })
})
