import type { ExportResult } from '../models/ports/IExporter'

/**
 * Dispara la descarga de un ExportResult en el navegador cliente.
 */
export function downloadResult(result: ExportResult): void {
  const blob = typeof result.content === 'string'
    ? new Blob([result.content], { type: result.mimeType })
    : result.content

  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = result.filename
  document.body.appendChild(anchor)
  anchor.click()
  document.body.removeChild(anchor)

  // Liberar el ObjectURL en memoria
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

