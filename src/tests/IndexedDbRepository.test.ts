import { describe, it, expect, beforeEach } from 'vitest'
import { IndexedDbProjectRepository } from '../infrastructure/IndexedDbProjectRepository'
import { createDefaultProject } from '../models/Project'
import { createDefaultSlide } from '../models/Slide'

describe('IndexedDbProjectRepository (TDD)', () => {
  let repository: IndexedDbProjectRepository

  beforeEach(() => {
    // Generamos un nombre único de BD por prueba para garantizar aislamiento
    const dbName = `test-db-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`
    repository = new IndexedDbProjectRepository(dbName)
  })

  it('debe guardar un proyecto y recuperarlo por ID', async () => {
    const project = createDefaultProject('Presentación de Prueba', 'Tester')
    await repository.save(project)

    const retrieved = await repository.getById(project.id)
    expect(retrieved).not.toBeNull()
    expect(retrieved?.id).toBe(project.id)
    expect(retrieved?.title).toBe('Presentación de Prueba')
    expect(retrieved?.slides).toHaveLength(1)
  })

  it('debe devolver null si el proyecto no existe', async () => {
    const nonExistent = await repository.getById('id-inexistente')
    expect(nonExistent).toBeNull()
  })

  it('debe listar todos los proyectos guardados', async () => {
    const p1 = createDefaultProject('Proyecto 1', 'Autor 1')
    const p2 = createDefaultProject('Proyecto 2', 'Autor 2')

    await repository.save(p1)
    await repository.save(p2)

    const all = await repository.getAll()
    expect(all).toHaveLength(2)
    const titles = all.map(p => p.title)
    expect(titles).toContain('Proyecto 1')
    expect(titles).toContain('Proyecto 2')
  })

  it('debe actualizar un proyecto existente', async () => {
    const project = createDefaultProject('Original', 'Autor')
    await repository.save(project)

    const newSlide = createDefaultSlide(1, 'image-only')
    project.title = 'Título Modificado'
    project.slides.push(newSlide)

    await repository.save(project)

    const updated = await repository.getById(project.id)
    expect(updated?.title).toBe('Título Modificado')
    expect(updated?.slides).toHaveLength(2)
  })

  it('debe eliminar un proyecto por su ID', async () => {
    const project = createDefaultProject('Para Borrar', 'Autor')
    await repository.save(project)

    await repository.delete(project.id)

    const retrieved = await repository.getById(project.id)
    expect(retrieved).toBeNull()
  })
})
