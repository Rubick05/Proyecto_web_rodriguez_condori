import type { Project } from '../models/Project'
import type { IProjectRepository } from '../models/ports/IProjectRepository'

/**
 * Adaptador de Infraestructura: Repositorio basado en IndexedDB.
 * 
 * Implementa el contrato IProjectRepository para persistir las presentaciones
 * de forma reactiva y asíncrona en el almacenamiento local del navegador.
 */
export class IndexedDbProjectRepository implements IProjectRepository {
  private dbName: string
  private version: number = 1
  private storeName: string = 'projects'
  private dbPromise: Promise<IDBDatabase> | null = null

  constructor(dbName: string = 'slides_app_db') {
    this.dbName = dbName
  }

  private openDatabase(): Promise<IDBDatabase> {
    if (this.dbPromise) {
      return this.dbPromise
    }

    this.dbPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version)

      request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
        const db = (event.target as IDBOpenDBRequest).result
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName, { keyPath: 'id' })
        }
      }

      request.onsuccess = () => {
        resolve(request.result)
      }

      request.onerror = () => {
        reject(request.error)
      }
    })

    return this.dbPromise
  }

  async getAll(): Promise<Project[]> {
    const db = await this.openDatabase()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.storeName], 'readonly')
      const store = transaction.objectStore(this.storeName)
      const request = store.getAll()

      request.onsuccess = () => {
        resolve((request.result as Project[]) || [])
      }

      request.onerror = () => {
        reject(request.error)
      }
    })
  }

  async getById(id: string): Promise<Project | null> {
    const db = await this.openDatabase()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.storeName], 'readonly')
      const store = transaction.objectStore(this.storeName)
      const request = store.get(id)

      request.onsuccess = () => {
        resolve((request.result as Project) || null)
      }

      request.onerror = () => {
        reject(request.error)
      }
    })
  }

  async save(project: Project): Promise<void> {
    const db = await this.openDatabase()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.storeName], 'readwrite')
      const store = transaction.objectStore(this.storeName)
      const request = store.put({
        ...project,
        updatedAt: new Date().toISOString(),
      })

      request.onsuccess = () => {
        resolve()
      }

      request.onerror = () => {
        reject(request.error)
      }
    })
  }

  async delete(id: string): Promise<void> {
    const db = await this.openDatabase()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.storeName], 'readwrite')
      const store = transaction.objectStore(this.storeName)
      const request = store.delete(id)

      request.onsuccess = () => {
        resolve()
      }

      request.onerror = () => {
        reject(request.error)
      }
    })
  }
}
