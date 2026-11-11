import { jsPDF } from 'jspdf'
import type { Project } from '../models/Project'
import type { IExporter, ExportResult } from '../models/ports/IExporter'

/**
 * Adaptador de Infraestructura: Exportador a Archivo PDF Directo
 * 
 * Implementa el puerto IExporter (Clean Architecture).
 * Genera un archivo binario PDF nativo descargable (.pdf) con formato apaisado 16:9,
 * estructurando títulos, bloques tipográficos, contenedores de imágenes y paginación.
 */
export class PdfPresentationExporter implements IExporter {
  readonly formatName = 'Documento PDF'
  readonly extension = 'pdf'

  async export(project: Project): Promise<ExportResult> {
    // Relación de aspecto 16:9 apaisada: 297mm x 167.06mm
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: [297, 167.06],
    })

    const total = project.slides.length
    const formattedDate = new Date().toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })

    project.slides.forEach((slide, index) => {
      if (index > 0) {
        doc.addPage([297, 167.06], 'landscape')
      }

      // 1. Encabezado
      doc.setFillColor(79, 70, 229) // Indigo
      doc.circle(20, 15, 1.5, 'F')
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(9)
      doc.setTextColor(100, 116, 139)
      doc.text((project.title || 'Presentación').toUpperCase(), 25, 16)

      if (project.author) {
        doc.setFont('helvetica', 'normal')
        doc.text(project.author, 277, 16, { align: 'right' })
      }

      doc.setDrawColor(226, 232, 240)
      doc.setLineWidth(0.3)
      doc.line(20, 20, 277, 20)

      // 2. Pie de Página
      doc.line(20, 150, 277, 150)
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(8)
      doc.setTextColor(148, 163, 184)
      doc.text(formattedDate, 20, 156)

      doc.setFont('courier', 'bold')
      doc.text(`${index + 1} / ${total}`, 277, 156, { align: 'right' })

      // 3. Contenido según el layout
      const slideTitle = slide.title || `Diapositiva ${index + 1}`

      switch (slide.layout) {
        case 'image-only': {
          doc.setFont('helvetica', 'bold')
          doc.setFontSize(18)
          doc.setTextColor(15, 23, 42)
          doc.text(slideTitle, 148.5, 34, { align: 'center' })

          // Marco gráfico para la imagen
          doc.setFillColor(241, 245, 249)
          doc.roundedRect(35, 40, 227, 95, 3, 3, 'F')
          doc.setDrawColor(203, 213, 225)
          doc.roundedRect(35, 40, 227, 95, 3, 3, 'D')

          doc.setFont('helvetica', 'italic')
          doc.setFontSize(10)
          doc.setTextColor(148, 163, 184)
          doc.text(slide.imageUrl ? `[Imagen: ${slide.imageUrl.slice(0, 50)}...]` : '[Imagen Principal]', 148.5, 88, { align: 'center' })

          if (slide.imageCaption) {
            doc.text(slide.imageCaption, 148.5, 142, { align: 'center' })
          }
          break
        }

        case 'text-and-image': {
          // Columna Izquierda: Texto
          doc.setFont('helvetica', 'bold')
          doc.setFontSize(18)
          doc.setTextColor(15, 23, 42)
          const titleLines = doc.splitTextToSize(slideTitle, 120)
          doc.text(titleLines, 20, 40)

          doc.setFont('helvetica', 'normal')
          doc.setFontSize(11)
          doc.setTextColor(71, 85, 105)
          const contentLines = doc.splitTextToSize(slide.content || '', 120)
          doc.text(contentLines, 20, 58)

          // Columna Derecha: Ilustración
          doc.setFillColor(241, 245, 249)
          doc.roundedRect(150, 36, 125, 95, 3, 3, 'F')
          doc.setDrawColor(203, 213, 225)
          doc.roundedRect(150, 36, 125, 95, 3, 3, 'D')

          doc.setFont('helvetica', 'italic')
          doc.setFontSize(9)
          doc.setTextColor(148, 163, 184)
          doc.text(slide.imageUrl ? `[Imagen: ${slide.imageUrl.slice(0, 40)}...]` : '[Soporte Visual]', 212.5, 84, { align: 'center' })

          if (slide.imageCaption) {
            doc.text(slide.imageCaption, 212.5, 137, { align: 'center' })
          }
          break
        }

        case 'text-only':
        default: {
          doc.setFont('helvetica', 'bold')
          doc.setFontSize(22)
          doc.setTextColor(15, 23, 42)
          const titleLines = doc.splitTextToSize(slideTitle, 240)
          doc.text(titleLines, 20, 45)

          doc.setFont('helvetica', 'normal')
          doc.setFontSize(12)
          doc.setTextColor(71, 85, 105)
          const contentLines = doc.splitTextToSize(slide.content || '', 240)
          doc.text(contentLines, 20, 68)
          break
        }
      }
    })

    const pdfBlob = doc.output('blob')
    const sanitizedFilename = (project.title || 'presentacion')
      .trim()
      .replace(/[^a-zA-Z0-9_\-]/g, '_')
      .replace(/_+/g, '_')

    return {
      filename: `${sanitizedFilename}_${new Date().toISOString().slice(0, 10)}.pdf`,
      mimeType: 'application/pdf',
      content: pdfBlob,
    }
  }
}

