import type { Project } from '../Project'

export interface ExportResult {
  filename: string
  mimeType: string
  content: Blob | string
}

/**
 * Puerto de Exportación (Inversión de Dependencias)
 * 
 * Permite desacoplar los diferentes formatos de salida (HTML imprimible, PDF, etc.)
 * de la lógica de presentación.
 */
export interface IExporter {
  readonly formatName: string
  readonly extension: string

  /**
   * Transforma el proyecto en un formato exportable listo para descargar o imprimir
   */
  export(project: Project): Promise<ExportResult>
}
