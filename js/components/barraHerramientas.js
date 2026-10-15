/**
 * ComponenteBarraHerramientas
 * Responsabilidad Única: Manejo de los controles de formato en la cinta superior:
 * color de texto, tipo de fuente, tamaño de fuente por elemento y acciones de gestión
 * con variables descriptivas en español.
 */
export class ComponenteBarraHerramientas {
  constructor(gestorEstado, componenteNotificacion) {
    this.gestorEstado = gestorEstado;
    this.componenteNotificacion = componenteNotificacion;

    this.tamanosDeFuentePredefinidos = [
      '14px', '16px', '18px', '20px', '24px', '28px', '34px', '36px', '40px', '48px', '56px', '64px'
    ];

    // Elementos del DOM con nombres descriptivos en español
    this.elementosDOM = {
      selectorColorTexto: document.getElementById('slide-text-color'),
      circuloMuestraColor: document.getElementById('text-swatch-preview'),
      selectorFamiliaFuente: document.getElementById('font-family-select'),
      selectorTamanoFuente: document.getElementById('font-size-select'),
      botonReducirTamano: document.getElementById('font-decrease-btn'),
      botonAumentarTamano: document.getElementById('font-increase-btn'),
      insigniaElementoObjetivo: document.getElementById('target-indicator-badge'),
      selectorRelacionAspecto: document.getElementById('aspect-ratio-select'),
      botonAgregarDiapositiva: document.getElementById('add-slide-btn'),
      botonEliminarDiapositiva: document.getElementById('delete-slide-btn'),
      botonAgregarLateral: document.getElementById('sidebar-add-btn')
    };

    // Referencias legadas para compatibilidad
    this.state = this.gestorEstado;
    this.toast = this.componenteNotificacion;
    this.elements = {
      textColorInput: this.elementosDOM.selectorColorTexto,
      textSwatchPreview: this.elementosDOM.circuloMuestraColor,
      fontFamilySelect: this.elementosDOM.selectorFamiliaFuente,
      fontSizeSelect: this.elementosDOM.selectorTamanoFuente,
      fontDecreaseBtn: this.elementosDOM.botonReducirTamano,
      fontIncreaseBtn: this.elementosDOM.botonAumentarTamano,
      targetBadge: this.elementosDOM.insigniaElementoObjetivo,
      aspectRatioSelect: this.elementosDOM.selectorRelacionAspecto,
      addSlideBtn: this.elementosDOM.botonAgregarDiapositiva,
      deleteSlideBtn: this.elementosDOM.botonEliminarDiapositiva,
      sidebarAddBtn: this.elementosDOM.botonAgregarLateral
    };

    this.enlazarEventos();

    this.gestorEstado.subscribe?.((tipoEvento) => {
      if (['initial_load', 'slide_changed', 'target_selected'].includes(tipoEvento)) {
        this.sincronizarConDiapositivaActual();
      }
    });
  }

  sincronizarConDiapositivaActual() {
    const diapositivaActiva = this.gestorEstado.obtenerDiapositivaActual?.() || this.gestorEstado.getCurrentSlide?.();
    if (!diapositivaActiva) return;

    // 1. Color de texto
    const colorTexto = diapositivaActiva.colorTexto || diapositivaActiva.textColor || '#0f172a';
    if (colorTexto.startsWith('#') && this.elementosDOM.selectorColorTexto) {
      this.elementosDOM.selectorColorTexto.value = colorTexto;
    }
    if (this.elementosDOM.circuloMuestraColor) {
      this.elementosDOM.circuloMuestraColor.style.background = colorTexto;
    }

    // 2. Tipo de fuente del elemento seleccionado
    const familiaFuente = this.gestorEstado.obtenerTipoFuenteObjetivo?.() || this.gestorEstado.getTargetFontFamily?.();
    if (this.elementosDOM.selectorFamiliaFuente && familiaFuente) {
      this.elementosDOM.selectorFamiliaFuente.value = familiaFuente;
    }

    // 3. Indicador de Elemento Seleccionado (Título vs Contenido)
    const objetivoActual = this.gestorEstado.obtenerObjetivoSeleccionado?.() || this.gestorEstado.getSelectedTarget?.() || 'title';
    if (this.elementosDOM.insigniaElementoObjetivo) {
      const esTitulo = objetivoActual === 'title' || objetivoActual === 'titulo';
      this.elementosDOM.insigniaElementoObjetivo.textContent = esTitulo ? 'Título' : 'Contenido';
    }

    // 4. Tamaño de fuente del elemento seleccionado
    const tamanoFuente = this.gestorEstado.obtenerTamanoFuenteObjetivo?.() || this.gestorEstado.getTargetFontSize?.();
    if (this.elementosDOM.selectorTamanoFuente && tamanoFuente) {
      const existeEnLista = Array.from(this.elementosDOM.selectorTamanoFuente.options).some(opcion => opcion.value === tamanoFuente);
      if (existeEnLista) {
        this.elementosDOM.selectorTamanoFuente.value = tamanoFuente;
      }
    }

    // 5. Relación de aspecto (16:9 vs 4:3)
    const relacionAspecto = diapositivaActiva.relacionAspecto || diapositivaActiva.aspectRatio || '16/9';
    if (this.elementosDOM.selectorRelacionAspecto) {
      this.elementosDOM.selectorRelacionAspecto.value = relacionAspecto;
    }
  }

  enlazarEventos() {
    // 1. Color de Texto
    this.elementosDOM.selectorColorTexto?.addEventListener('input', (evento) => {
      const nuevoColor = evento.target.value;
      if (this.elementosDOM.circuloMuestraColor) {
        this.elementosDOM.circuloMuestraColor.style.background = nuevoColor;
      }
      this.gestorEstado.actualizarPropiedadDiapositivaActiva?.('colorTexto', nuevoColor, true)
        || this.gestorEstado.updateActiveSlideProperty?.('textColor', nuevoColor, true);
    });

    // 2. Tipo de Fuente para el Elemento Seleccionado
    this.elementosDOM.selectorFamiliaFuente?.addEventListener('change', (evento) => {
      const nuevaFuente = evento.target.value;
      this.gestorEstado.actualizarTipoFuenteElemento?.(nuevaFuente, true)
        || this.gestorEstado.updateSelectedElementFontFamily?.(nuevaFuente, true);

      const objetivo = this.gestorEstado.obtenerObjetivoSeleccionado?.() || this.gestorEstado.getSelectedTarget?.();
      const nombreObjetivo = (objetivo === 'title' || objetivo === 'titulo') ? 'título' : 'contenido';
      this.componenteNotificacion?.mostrar?.(`Fuente de ${nombreObjetivo} actualizada`)
        || this.componenteNotificacion?.show?.(`Fuente de ${nombreObjetivo} actualizada`);
    });

    // 3. Tamaño de Fuente para el Elemento Seleccionado (Selector)
    this.elementosDOM.selectorTamanoFuente?.addEventListener('change', (evento) => {
      const nuevoTamano = evento.target.value;
      this.gestorEstado.actualizarTamanoFuenteElemento?.(nuevoTamano, true)
        || this.gestorEstado.updateSelectedElementFontSize?.(nuevoTamano, true);

      const objetivo = this.gestorEstado.obtenerObjetivoSeleccionado?.() || this.gestorEstado.getSelectedTarget?.();
      const nombreObjetivo = (objetivo === 'title' || objetivo === 'titulo') ? 'título' : 'contenido';
      this.componenteNotificacion?.mostrar?.(`Tamaño de ${nombreObjetivo}: ${nuevoTamano}`)
        || this.componenteNotificacion?.show?.(`Tamaño de ${nombreObjetivo}: ${nuevoTamano}`);
    });

    // 4. Reducir y Aumentar Tamaño de Fuente con Botones
    this.elementosDOM.botonReducirTamano?.addEventListener('click', () => {
      this.modificarTamanoFuenteEnPaso(-1);
    });

    this.elementosDOM.botonAumentarTamano?.addEventListener('click', () => {
      this.modificarTamanoFuenteEnPaso(1);
    });

    // 5. Relación de aspecto
    this.elementosDOM.selectorRelacionAspecto?.addEventListener('change', (evento) => {
      const nuevaRelacion = evento.target.value;
      this.gestorEstado.actualizarPropiedadDiapositivaActiva?.('relacionAspecto', nuevaRelacion, true)
        || this.gestorEstado.updateActiveSlideProperty?.('aspectRatio', nuevaRelacion, true);

      this.componenteNotificacion?.mostrar?.(`Formato: ${nuevaRelacion}`)
        || this.componenteNotificacion?.show?.(`Formato: ${nuevaRelacion}`);
    });

    // 6. Añadir Diapositiva
    const accionAgregar = () => {
      this.gestorEstado.agregarDiapositiva?.() || this.gestorEstado.addSlide?.();
      this.componenteNotificacion?.mostrar?.('Nueva diapositiva añadida')
        || this.componenteNotificacion?.show?.('Nueva diapositiva añadida');
    };

    this.elementosDOM.botonAgregarDiapositiva?.addEventListener('click', accionAgregar);
    this.elementosDOM.botonAgregarLateral?.addEventListener('click', accionAgregar);

    // 7. Borrar Diapositiva
    this.elementosDOM.botonEliminarDiapositiva?.addEventListener('click', () => {
      const totalDiapositivas = this.gestorEstado.obtenerTotalDiapositivas?.() || this.gestorEstado.getSlideCount?.();
      if (totalDiapositivas <= 1) {
        this.componenteNotificacion?.mostrar?.('Debe existir al menos una diapositiva')
          || this.componenteNotificacion?.show?.('Debe existir al menos una diapositiva');
        return;
      }

      const confirmacion = window.confirm('¿Seguro que deseas eliminar esta diapositiva?');
      if (confirmacion) {
        this.gestorEstado.eliminarDiapositiva?.() || this.gestorEstado.deleteSlide?.();
        this.componenteNotificacion?.mostrar?.('Diapositiva eliminada')
          || this.componenteNotificacion?.show?.('Diapositiva eliminada');
      }
    });

    // 8. Alternar foco al hacer clic en la insignia
    this.elementosDOM.insigniaElementoObjetivo?.addEventListener('click', () => {
      const objetivoActual = this.gestorEstado.obtenerObjetivoSeleccionado?.() || this.gestorEstado.getSelectedTarget?.();
      const alternado = (objetivoActual === 'title' || objetivoActual === 'titulo') ? 'body' : 'title';
      this.gestorEstado.establecerObjetivoSeleccionado?.(alternado)
        || this.gestorEstado.setSelectedTarget?.(alternado);
    });
  }

  modificarTamanoFuenteEnPaso(direccionPaso) {
    const tamanoActual = this.gestorEstado.obtenerTamanoFuenteObjetivo?.() || this.gestorEstado.getTargetFontSize?.() || '20px';
    let indiceActual = this.tamanosDeFuentePredefinidos.indexOf(tamanoActual);

    if (indiceActual === -1) {
      const valorNumerico = parseInt(tamanoActual, 10) || 20;
      indiceActual = this.tamanosDeFuentePredefinidos.findIndex(t => parseInt(t, 10) >= valorNumerico);
      if (indiceActual === -1) indiceActual = this.tamanosDeFuentePredefinidos.length - 1;
    }

    const nuevoIndice = Math.max(0, Math.min(this.tamanosDeFuentePredefinidos.length - 1, indiceActual + direccionPaso));
    const nuevoTamano = this.tamanosDeFuentePredefinidos[nuevoIndice];

    this.gestorEstado.actualizarTamanoFuenteElemento?.(nuevoTamano, true)
      || this.gestorEstado.updateSelectedElementFontSize?.(nuevoTamano, true);

    if (this.elementosDOM.selectorTamanoFuente) {
      this.elementosDOM.selectorTamanoFuente.value = nuevoTamano;
    }

    const objetivo = this.gestorEstado.obtenerObjetivoSeleccionado?.() || this.gestorEstado.getSelectedTarget?.();
    const nombreObjetivo = (objetivo === 'title' || objetivo === 'titulo') ? 'título' : 'contenido';
    this.componenteNotificacion?.mostrar?.(`Tamaño de ${nombreObjetivo}: ${nuevoTamano}`)
      || this.componenteNotificacion?.show?.(`Tamaño de ${nombreObjetivo}: ${nuevoTamano}`);
  }

  // Métodos de compatibilidad
  syncWithCurrentSlide() { return this.sincronizarConDiapositivaActual(); }
  bindEvents() { return this.enlazarEventos(); }
}

export const ToolbarComponent = ComponenteBarraHerramientas;
