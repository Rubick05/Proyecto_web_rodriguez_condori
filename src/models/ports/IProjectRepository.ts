import type { Project } from '../Project'

/**
 * Puerto del Repositorio de Proyectos (Inversión de Dependencias - Clean Architecture)
 * 
 * Define el contrato que cualquier adaptador de persistencia (IndexedDB, API REST, localStorage)
 * debe implementar para gestionar el ciclo de vida de los proyectos.
 */
export interface IProjectRepository {
  /**
   * Obtiene todos los proyectos almacenados
   */
  getAll(): Promise<Project[]>

  /**
   * Obtiene un proyecto por su identificador único
   */
  getById(id: string): Promise<Project | null>

  /**
   * Guarda o actualiza un proyecto en el almacenamiento
   */
  save(project: Project): Promise<void>

  /**
   * Elimina un proyecto por su identificador único
   */
  delete(id: string): Promise<void>
}
