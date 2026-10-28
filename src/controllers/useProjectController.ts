import { useState, useEffect, useCallback, useMemo } from 'react'
import { type Project, createDefaultProject } from '../models/Project'
import type { IProjectRepository } from '../models/ports/IProjectRepository'
import { IndexedDbProjectRepository } from '../infrastructure/IndexedDbProjectRepository'

export interface UseProjectControllerOptions {
  repository?: IProjectRepository
  projectId?: string
  autoSaveDelay?: number // ms para debounce de autoguardado (0 para desactivar)
}

export interface UseProjectControllerReturn {
  project: Project
  isLoading: boolean
  isSaving: boolean
  error: string | null
  saveProject: (customProject?: Project) => Promise<void>
  updateProjectMeta: (meta: Partial<Pick<Project, 'title' | 'author' | 'description'>>) => void
  setProject: React.Dispatch<React.SetStateAction<Project>>
  createNewProject: (title?: string, author?: string) => Promise<Project>
  loadProject: (id: string) => Promise<void>
}

/**
 * Hook Controlador: Gestión del Proyecto y Persistencia (Capa Controller)
 * 
 * Implementa Inversión de Dependencias al recibir cualquier adaptador que
 * satisfaga IProjectRepository (por defecto IndexedDbProjectRepository).
 */
export function useProjectController(options?: UseProjectControllerOptions): UseProjectControllerReturn {
  const repository = useMemo(() => options?.repository || new IndexedDbProjectRepository(), [options?.repository])
  const [project, setProject] = useState<Project>(() => createDefaultProject())
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isSaving, setIsSaving] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  // Carga inicial desde el repositorio
  const loadInitial = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const allProjects = await repository.getAll()
      if (allProjects.length > 0) {
        // Cargar el proyecto especificado o el más reciente
        const target = options?.projectId 
          ? allProjects.find(p => p.id === options.projectId) || allProjects[0]
          : allProjects[0]
        setProject(target)
      } else {
        // Si no hay ninguno guardado en IndexedDB, persistimos el inicial
        const initial = createDefaultProject()
        await repository.save(initial)
        setProject(initial)
      }
    } catch (err) {
      console.error('[useProjectController] Error al cargar proyecto:', err)
      setError(err instanceof Error ? err.message : 'Error desconocido de persistencia')
    } finally {
      setIsLoading(false)
    }
  }, [repository, options?.projectId])

  useEffect(() => {
    loadInitial()
  }, [loadInitial])

  const saveProject = useCallback(async (customProject?: Project) => {
    const toSave = customProject || project
    setIsSaving(true)
    setError(null)
    try {
      await repository.save(toSave)
    } catch (err) {
      console.error('[useProjectController] Error al guardar proyecto:', err)
      setError(err instanceof Error ? err.message : 'Error al guardar')
    } finally {
      setIsSaving(false)
    }
  }, [repository, project])

  const updateProjectMeta = useCallback((meta: Partial<Pick<Project, 'title' | 'author' | 'description'>>) => {
    setProject(prev => {
      const updated: Project = {
        ...prev,
        ...meta,
        updatedAt: new Date().toISOString(),
      }
      return updated
    })
  }, [])

  const createNewProject = useCallback(async (title?: string, author?: string): Promise<Project> => {
    const newProj = createDefaultProject(title, author)
    setIsSaving(true)
    try {
      await repository.save(newProj)
      setProject(newProj)
      return newProj
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear proyecto')
      throw err
    } finally {
      setIsSaving(false)
    }
  }, [repository])

  const loadProject = useCallback(async (id: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const found = await repository.getById(id)
      if (found) {
        setProject(found)
      } else {
        throw new Error(`Proyecto ${id} no encontrado`)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar')
    } finally {
      setIsLoading(false)
    }
  }, [repository])

  return {
    project,
    isLoading,
    isSaving,
    error,
    saveProject,
    updateProjectMeta,
    setProject,
    createNewProject,
    loadProject,
  }
}
