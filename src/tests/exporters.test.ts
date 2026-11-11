import { describe, it, expect } from 'vitest'
import { HtmlPresentationExporter } from '../infrastructure/HtmlPresentationExporter'
import { JsonProjectExporter } from '../infrastructure/JsonProjectExporter'
import { createDefaultProject } from '../models/Project'
import { createDefaultSlide } from '../models/Slide'

describe('Fase 4: Exporters (IExporter implementations)', () => {
  const setupTestProject = () => {
    const project = createDefaultProject('Estrategia Q4', 'Equipo de Producto')
    const slide1 = createDefaultSlide(0, 'text-only')
    slide1.title = 'Visión General'
    slide1.content = 'Objetivos clave del trimestre para el equipo.'
    slide1.notes = 'Recordar enfatizar el ROI esperado.'

    const slide2 = createDefaultSlide(1, 'image-only')
    slide2.title = 'Arquitectura del Sistema'
    slide2.imageUrl = 'https://example.com/arch.png'
    slide2.imageCaption = 'Diagrama de bloques de la infraestructura'

    const slide3 = createDefaultSlide(2, 'text-and-image')
    slide3.title = 'Métricas de Adopción'
    slide3.content = 'Incremento del 45% en usuarios activos mensuales.'
    slide3.imageUrl = 'https://example.com/metrics.png'
    slide3.imageCaption = 'Gráfico de retención'

    project.slides = [slide1, slide2, slide3]
    return project
  }

  describe('HtmlPresentationExporter', () => {
    it('debe implementar IExporter con metadata correcta', () => {
      const exporter = new HtmlPresentationExporter()
      expect(exporter.formatName).toBe('HTML Standalone / Offline')
      expect(exporter.extension).toBe('html')
    })

    it('debe generar un documento HTML offline completo con todas las diapositivas', async () => {
      const exporter = new HtmlPresentationExporter()
      const project = setupTestProject()
      const result = await exporter.export(project)

      expect(result.mimeType).toBe('text/html')
      expect(result.filename).toContain('Estrategia_Q4')
      expect(result.filename.endsWith('.html')).toBe(true)

      const html = typeof result.content === 'string' ? result.content : ''
      expect(html).toContain('<!DOCTYPE html>')
      expect(html).toContain('<title>Estrategia Q4</title>')
      expect(html).toContain('Visión General')
      expect(html).toContain('Arquitectura del Sistema')
      expect(html).toContain('Métricas de Adopción')
      expect(html).toContain('https://example.com/arch.png')
      expect(html).toContain('https://example.com/metrics.png')
    })

    it('debe incluir estilos de impresion @media print para exportacion a PDF', async () => {
      const exporter = new HtmlPresentationExporter()
      const project = setupTestProject()
      const result = await exporter.export(project)

      const html = typeof result.content === 'string' ? result.content : ''
      expect(html).toContain('@media print')
      expect(html).toContain('page-break-after: always')
    })

    it('debe escapar caracteres peligrosos para prevenir XSS', async () => {
      const exporter = new HtmlPresentationExporter()
      const project = createDefaultProject('XSS <script>alert(1)</script> Test')
      project.slides[0].title = 'Malicious <img src=x onerror=alert(1)>'
      project.slides[0].content = 'Texto con <b>HTML</b> & "comillas"'

      const result = await exporter.export(project)
      const html = typeof result.content === 'string' ? result.content : ''

      expect(html).not.toContain('<script>alert(1)</script>')
      expect(html).not.toContain('<img src=x onerror=alert(1)>')
      expect(html).toContain('&lt;script&gt;alert(1)&lt;/script&gt;')
    })
  })

  describe('JsonProjectExporter', () => {
    it('debe exportar la estructura integra del proyecto en JSON parseable', async () => {
      const exporter = new JsonProjectExporter()
      const project = setupTestProject()
      const result = await exporter.export(project)

      expect(result.mimeType).toBe('application/json')
      expect(result.filename.endsWith('.json')).toBe(true)

      const parsed = JSON.parse(result.content as string)
      expect(parsed.id).toBe(project.id)
      expect(parsed.title).toBe('Estrategia Q4')
      expect(parsed.slides).toHaveLength(3)
      expect(parsed.slides[0].notes).toBe('Recordar enfatizar el ROI esperado.')
    })
  })
})

