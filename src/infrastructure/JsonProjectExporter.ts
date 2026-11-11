import type { Project } from '../models/Project'
import type { IExporter, ExportResult } from '../models/ports/IExporter'

/**
 * Adaptador de Infraestructura: Exportador a Formato JSON
 * 
 * Implementa el puerto IExporter (Clean Architecture).
 * Exporta el esquema estructurado completo del proyecto para respaldo,
 * migración o importación en otros entornos.
 */
export class JsonProjectExporter implements IExporter {
  readonly formatName = 'JSON Backup'
  readonly extension = 'json'

  async export(project: Project): Promise<ExportResult> {
    const jsonContent = JSON.stringify(project, null, 2)
    const sanitizedFilename = (project.title || 'proyecto')
      .trim()
      .replace(/[^a-zA-Z0-9_\-]/g, '_')
      .replace(/_+/g, '_')

    return {
      filename: `${sanitizedFilename}_backup_${new Date().toISOString().slice(0, 10)}.json`,
      mimeType: 'application/json',
      content: jsonContent,
    }
  }
}

