import type { Project } from '../models/Project'
import type { Slide } from '../models/Slide'
import type { IExporter, ExportResult } from '../models/ports/IExporter'

/**
 * Función utilitaria para sanitizar texto y prevenir inyecciones XSS en el HTML exportado.
 */
function escapeHtml(text: string | undefined | null): string {
  if (!text) return ''
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

/**
 * Adaptador de Infraestructura: Exportador a HTML Standalone Offline
 * 
 * Implementa el puerto IExporter (Clean Architecture).
 * Genera un archivo HTML único, autosuficiente e interactivo que incluye:
 * - Visor interactivo con controles y atajos de teclado sin requerir internet.
 * - Estilos CSS embebidos modernos con soporte de relación de aspecto 16:9.
 * - Reglas @media print para generar un archivo PDF profesional perfecto con un solo clic.
 */
export class HtmlPresentationExporter implements IExporter {
  readonly formatName = 'HTML Standalone / Offline'
  readonly extension = 'html'

  async export(project: Project): Promise<ExportResult> {
    const safeTitle = escapeHtml(project.title || 'Presentación')
    const safeAuthor = escapeHtml(project.author || '')
    const totalSlides = project.slides.length
    const formattedDate = new Date().toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })

    const slidesMarkup = project.slides
      .map((slide, index) => this.renderSlideMarkup(slide, index, totalSlides, safeTitle, safeAuthor, formattedDate))
      .join('\n')

    const htmlContent = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${safeTitle}</title>
  <style>
    /* Reset y estilos base */
    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      background-color: #020617;
      color: #0f172a;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      overflow-x: hidden;
    }

    /* Contenedor principal del carrusel */
    .presentation-container {
      width: 100vw;
      height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 1.5rem;
      position: relative;
    }

    /* Diapositiva 16:9 */
    .slide-wrapper {
      width: 100%;
      max-width: 1100px;
      aspect-ratio: 16 / 9;
      max-height: 85vh;
      background: #ffffff;
      border-radius: 1rem;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.45);
      display: none;
      flex-direction: column;
      justify-content: space-between;
      padding: 2.5rem 3.5rem;
      position: relative;
      overflow: hidden;
    }

    .slide-wrapper.active {
      display: flex;
      animation: fadeIn 0.3s ease-in-out;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: scale(0.985); }
      to { opacity: 1; transform: scale(1); }
    }

    /* Header y Footer */
    .slide-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 0.75rem;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #64748b;
    }
    .slide-header .brand {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .slide-header .brand-dot {
      width: 8px;
      height: 8px;
      background: #4f46e5;
      border-radius: 9999px;
    }

    .slide-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      min-height: 0;
      padding: 1rem 0;
    }

    .slide-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-top: 1px solid #e2e8f0;
      padding-top: 0.75rem;
      font-size: 0.75rem;
      color: #94a3b8;
    }
    .slide-counter {
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-weight: 700;
      background: #f1f5f9;
      color: #334155;
      padding: 0.25rem 0.6rem;
      border-radius: 0.375rem;
    }

    /* Layouts específicos */
    .layout-text-only {
      max-width: 800px;
      margin: 0 auto;
      width: 100%;
      text-align: left;
    }
    .layout-text-only h2 {
      font-size: 2.25rem;
      font-weight: 800;
      color: #0f172a;
      line-height: 1.25;
      margin-bottom: 1.25rem;
    }
    .layout-text-only p {
      font-size: 1.15rem;
      color: #475569;
      line-height: 1.7;
      white-space: pre-line;
      font-weight: 300;
    }

    .layout-image-only {
      display: flex;
      flex-direction: column;
      align-items: center;
      height: 100%;
      justify-content: center;
      gap: 0.75rem;
    }
    .layout-image-only h2 {
      font-size: 1.75rem;
      font-weight: 800;
      color: #0f172a;
    }
    .layout-image-only .img-box {
      flex: 1;
      max-height: 380px;
      width: 100%;
      border-radius: 0.75rem;
      overflow: hidden;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    }
    .layout-image-only img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .layout-image-only .caption {
      font-size: 0.8rem;
      color: #64748b;
      font-style: italic;
    }

    .layout-text-and-image {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2.5rem;
      align-items: center;
      height: 100%;
    }
    .layout-text-and-image h2 {
      font-size: 1.85rem;
      font-weight: 800;
      color: #0f172a;
      line-height: 1.25;
      margin-bottom: 0.75rem;
    }
    .layout-text-and-image p {
      font-size: 1rem;
      color: #475569;
      line-height: 1.6;
      white-space: pre-line;
    }
    .layout-text-and-image .img-box {
      height: 300px;
      border-radius: 0.75rem;
      overflow: hidden;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    }
    .layout-text-and-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    /* Barra de Navegación Flotante */
    .controls-hud {
      position: absolute;
      bottom: 1.5rem;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      background: rgba(15, 23, 42, 0.85);
      backdrop-filter: blur(8px);
      border: 1px solid rgba(51, 65, 85, 0.6);
      padding: 0.5rem 1rem;
      border-radius: 9999px;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);
      z-index: 50;
    }
    .controls-hud button {
      background: transparent;
      border: none;
      color: #e2e8f0;
      font-size: 0.8rem;
      font-weight: 600;
      padding: 0.35rem 0.75rem;
      border-radius: 9999px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.35rem;
      transition: background 0.2s, color 0.2s;
    }
    .controls-hud button:hover {
      background: #334155;
      color: #ffffff;
    }
    .controls-hud .btn-print {
      background: #4f46e5;
      color: #ffffff;
    }
    .controls-hud .btn-print:hover {
      background: #4338ca;
    }

    /* Barra de progreso inferior */
    .progress-bar-container {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: #1e293b;
    }
    .progress-bar-fill {
      height: 100%;
      background: #6366f1;
      width: 0%;
      transition: width 0.3s ease;
    }

    /* Reglas @media print para exportación a PDF */
    @page {
      size: landscape;
      margin: 0;
    }
    @media print {
      body {
        background: #ffffff !important;
        margin: 0 !important;
        padding: 0 !important;
        display: block !important;
      }
      .no-print, .controls-hud, .progress-bar-container {
        display: none !important;
      }
      .presentation-container {
        display: block !important;
        padding: 0 !important;
        width: 100% !important;
        height: auto !important;
      }
      .slide-wrapper {
        display: flex !important;
        page-break-after: always;
        break-after: page;
        width: 100vw !important;
        height: 100vh !important;
        max-width: none !important;
        max-height: none !important;
        border-radius: 0 !important;
        box-shadow: none !important;
        border: none !important;
        padding: 3rem 4.5rem !important;
      }
    }
  </style>
</head>
<body>
  <div class="presentation-container">
    ${slidesMarkup}

    <!-- Controles flotantes en pantalla -->
    <div class="controls-hud no-print">
      <button id="btnPrev" title="Anterior (Flecha Izquierda)">&larr; Anterior</button>
      <span id="slideIndicator" style="color: #94a3b8; font-size: 0.75rem; font-family: monospace; padding: 0 0.5rem;">1 / ${totalSlides}</span>
      <button id="btnNext" title="Siguiente (Flecha Derecha o Espacio)">Siguiente &rarr;</button>
      <div style="width: 1px; height: 16px; background: #334155; margin: 0 0.25rem;"></div>
      <button id="btnFullScreen" title="Pantalla Completa (F)">&#x26F6; Pantalla Completa</button>
      <button id="btnPrint" class="btn-print" title="Guardar como PDF / Imprimir">&#x1F5B6; Guardar PDF</button>
    </div>

    <!-- Barra de progreso -->
    <div class="progress-bar-container no-print">
      <div id="progressBar" class="progress-bar-fill"></div>
    </div>
  </div>

  <script>
    (function() {
      const slides = document.querySelectorAll('.slide-wrapper');
      const total = slides.length;
      let currentIndex = 0;

      const indicator = document.getElementById('slideIndicator');
      const progressBar = document.getElementById('progressBar');
      const btnPrev = document.getElementById('btnPrev');
      const btnNext = document.getElementById('btnNext');
      const btnFullScreen = document.getElementById('btnFullScreen');
      const btnPrint = document.getElementById('btnPrint');

      function showSlide(index) {
        if (index < 0 || index >= total) return;
        slides.forEach((s, i) => {
          s.classList.toggle('active', i === index);
        });
        currentIndex = index;
        if (indicator) indicator.textContent = (currentIndex + 1) + ' / ' + total;
        if (progressBar) progressBar.style.width = (((currentIndex + 1) / total) * 100) + '%';
        if (btnPrev) btnPrev.disabled = currentIndex === 0;
        if (btnNext) btnNext.disabled = currentIndex === total - 1;
      }

      function nextSlide() {
        if (currentIndex < total - 1) showSlide(currentIndex + 1);
      }

      function prevSlide() {
        if (currentIndex > 0) showSlide(currentIndex - 1);
      }

      btnNext?.addEventListener('click', nextSlide);
      btnPrev?.addEventListener('click', prevSlide);
      btnPrint?.addEventListener('click', () => window.print());

      btnFullScreen?.addEventListener('click', () => {
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen().catch(() => {});
        } else {
          document.exitFullscreen().catch(() => {});
        }
      });

      window.addEventListener('keydown', (e) => {
        switch (e.key) {
          case 'ArrowRight':
          case 'ArrowDown':
          case ' ':
            e.preventDefault();
            nextSlide();
            break;
          case 'ArrowLeft':
          case 'ArrowUp':
            e.preventDefault();
            prevSlide();
            break;
          case 'f':
          case 'F':
            if (!document.fullscreenElement) {
              document.documentElement.requestFullscreen().catch(() => {});
            } else {
              document.exitFullscreen().catch(() => {});
            }
            break;
        }
      });

      // Inicializar en la primera diapositiva
      showSlide(0);
    })();
  </script>
</body>
</html>`

    const sanitizedFilename = (project.title || 'presentacion')
      .trim()
      .replace(/[^a-zA-Z0-9_\-]/g, '_')
      .replace(/_+/g, '_')

    return {
      filename: `${sanitizedFilename}_${new Date().toISOString().slice(0, 10)}.html`,
      mimeType: 'text/html',
      content: htmlContent,
    }
  }

  private renderSlideMarkup(
    slide: Slide,
    index: number,
    total: number,
    projectTitle: string,
    author: string,
    formattedDate: string
  ): string {
    const safeSlideTitle = escapeHtml(slide.title)
    const safeContent = escapeHtml(slide.content)
    const imgUrl = escapeHtml(slide.imageConfig?.url || slide.imageUrl || '')
    const safeCaption = escapeHtml(slide.imageConfig?.caption || slide.imageCaption || '')
    const activeClass = index === 0 ? ' active' : ''

    const typo = slide.typography
    const fontFamilyStyle = typo?.fontFamily === 'serif' ? 'font-family: Georgia, serif;' : typo?.fontFamily === 'mono' ? 'font-family: ui-monospace, Consolas, monospace;' : ''
    const fontWeightStyle = typo?.isBold === false ? 'font-weight: normal;' : 'font-weight: 800;'
    const fontItalicStyle = typo?.isItalic ? 'font-style: italic;' : ''
    const textAlignStyle = typo?.textAlign ? `text-align: ${typo.textAlign};` : ''
    const titleCustomStyle = `${fontFamilyStyle} ${fontWeightStyle} ${fontItalicStyle} ${textAlignStyle}`.trim()
    const contentCustomStyle = `${fontFamilyStyle} ${fontItalicStyle} ${textAlignStyle}`.trim()

    let layoutContent = ''

    switch (slide.layout) {
      case 'image-only':
        layoutContent = `
          <div class="layout-image-only">
            ${safeSlideTitle ? `<h2 style="${titleCustomStyle}">${safeSlideTitle}</h2>` : ''}
            <div class="img-box">
              <img src="${imgUrl}" alt="${safeSlideTitle}" />
            </div>
            ${safeCaption ? `<p class="caption">${safeCaption}</p>` : ''}
          </div>`
        break

      case 'text-and-image':
        layoutContent = `
          <div class="layout-text-and-image">
            <div>
              <h2 style="${titleCustomStyle}">${safeSlideTitle}</h2>
              <p style="${contentCustomStyle}">${safeContent}</p>
            </div>
            <div>
              <div class="img-box">
                <img src="${imgUrl}" alt="${safeSlideTitle}" />
              </div>
              ${safeCaption ? `<p style="font-size: 0.75rem; color: #94a3b8; font-style: italic; text-align: center; margin-top: 0.5rem;">${safeCaption}</p>` : ''}
            </div>
          </div>`
        break

      case 'text-only':
      default:
        layoutContent = `
          <div class="layout-text-only">
            <h2 style="${titleCustomStyle}">${safeSlideTitle}</h2>
            <p style="${contentCustomStyle}">${safeContent}</p>
          </div>`
        break
    }

    return `
    <!-- Slide ${index + 1} -->
    <section class="slide-wrapper slide-page${activeClass}" data-slide-index="${index}">
      <header class="slide-header">
        <div class="brand">
          <span class="brand-dot"></span>
          <span>${projectTitle}</span>
        </div>
        ${author ? `<span>${author}</span>` : ''}
      </header>

      <main class="slide-content">
        ${layoutContent}
      </main>

      <footer class="slide-footer">
        <span>${formattedDate}</span>
        <span class="slide-counter">${index + 1} / ${total}</span>
      </footer>
    </section>`
  }
}

