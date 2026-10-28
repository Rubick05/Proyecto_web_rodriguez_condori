import type { Project } from '../models/Project'
import type { IProjectRepository } from '../models/ports/IProjectRepository'

/**
 * Adaptador de Infraestructura: Repositorio Stub para Microservicio HTTP/REST.
 * 
 * Cumple con IProjectRepository para ilustrar el principio de Inversión de Dependencias (DIP).
 * Permite cambiar el mecanismo de almacenamiento a un backend remoto sin modificar la capa UI ni los controladores.
 */
export class HttpMicroserviceRepository implements IProjectRepository {
  private baseUrl: string

  constructor(baseUrl: string = '/api/projects') {
    this.baseUrl = baseUrl
  }

  async getAll(): Promise<Project[]> {
    console.info(`[HttpMicroserviceRepository] Fetching all projects from ${this.baseUrl}`)
    // Stub simulado para futura integración con API REST o Microservicio
    return []
  }

  async getById(id: string): Promise<Project | null> {
    console.info(`[HttpMicroserviceRepository] Fetching project ${id} from ${this.baseUrl}/${id}`)
    return null
  }

  async save(project: Project): Promise<void> {
    console.info(`[HttpMicroserviceRepository] Saving project ${project.id} to ${this.baseUrl}`)
  }

  async delete(id: string): Promise<void> {
    console.info(`[HttpMicroserviceRepository] Deleting project ${id} at ${this.baseUrl}/${id}`)
  }
}
