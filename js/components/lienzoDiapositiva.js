/**
 * ComponenteLienzoDiapositiva
 * Responsabilidad Única: Renderizado del lienzo con título centrado arriba
 * y contenido centrado al medio, gestión de foco/selección entre título y contenido,
 * y aplicación de estilos individuales con variables descriptivas en español.
 */
export class ComponenteLienzoDiapositiva {
  constructor(gestorEstado) {
    this.gestorEstado = gestorEstado;
    this.usuarioEstaEditandoTexto = false;

    this.elementosDOM = {
      visorLienzo: document.getElementById('slide-viewport'),
      contenedorContenido: document.getElementById('slide-content-wrapper')
    };

    // Referencias legadas para compatibilidad
    this.state = this.gestorEstado;
    this.elements = {
      viewport: this.elementosDOM.visorLienzo,
      contentWrapper: this.elementosDOM.contenedorContenido
    };

    this.gestorEstado.subscribe?.((tipoEvento, datosAdicionales) => {
      if (['initial_load', 'slide_changed'].includes(tipoEvento)) {
        const origen = datosAdicionales?.source || datosAdicionales?.origen;
        const claseAnimacion = (origen === 'next' || origen === 'add_slide' || origen === 'agregar_diapositiva')
          ? 'slide-animate-slide'
          : 'slide-animate-fade';
        this.renderizarDiapositiva(claseAnimacion);
      } else if (tipoEvento === 'slide_property_updated') {
        this.aplicarEstilosDirectos(datosAdicionales);
      } else if (tipoEvento === 'target_selected') {
        const objetivo = datosAdicionales?.target || datosAdicionales?.objetivo;
        this.actualizarResaltadoElementoSeleccionado(objetivo);
      } else if (tipoEvento === 'element_font_size_updated') {
        this.aplicarTamanoFuenteElemento(datosAdicionales);
      } else if (tipoEvento === 'element_font_family_updated') {
        this.aplicarTipoFuenteElemento(datosAdicionales);
      }
    });
  }

  renderizarDiapositiva(claseAnimacion = 'slide-animate-fade') {
    const diapositivaActiva = this.gestorEstado.obtenerDiapositivaActual?.() || this.gestorEstado.getCurrentSlide?.();
    if (!diapositivaActiva || !this.elementosDOM.visorLienzo || !this.elementosDOM.contenedorContenido) return;

    // Color del texto general
    const colorTexto = diapositivaActiva.colorTexto || diapositivaActiva.textColor || '#0f172a';
    this.elementosDOM.visorLienzo.style.color = colorTexto;

    // Relación de aspecto (16:9 vs 4:3)
    const relacionAspecto = diapositivaActiva.relacionAspecto || diapositivaActiva.aspectRatio || '16/9';
    const claseAspecto = relacionAspecto === '4/3' ? 'aspect-4-3' : 'aspect-16-9';
    this.elementosDOM.visorLienzo.classList.remove('aspect-16-9', 'aspect-4-3');
    this.elementosDOM.visorLienzo.classList.add(claseAspecto);

    // Textos y tipografías
    const textoTitulo = diapositivaActiva.titulo ?? diapositivaActiva.title ?? 'Título de Diapositiva';
    const textoCuerpo = diapositivaActiva.cuerpo ?? diapositivaActiva.body ?? '<p>Haz clic para editar.</p>';
    const tamanoTitulo = diapositivaActiva.tamanoFuenteTitulo || diapositivaActiva.titleFontSize || '36px';
    const tamanoCuerpo = diapositivaActiva.tamanoFuenteCuerpo || diapositivaActiva.bodyFontSize || '20px';
    const fuenteTitulo = diapositivaActiva.fuenteTitulo || diapositivaActiva.titleFontFamily || "'Outfit', sans-serif";
    const fuenteCuerpo = diapositivaActiva.fuenteCuerpo || diapositivaActiva.bodyFontFamily || "'Inter', sans-serif";

    const objetivoSeleccionado = this.gestorEstado.obtenerObjetivoSeleccionado?.() || this.gestorEstado.getSelectedTarget?.() || 'title';
    const esTituloSeleccionado = objetivoSeleccionado === 'title' || objetivoSeleccionado === 'titulo';

    // Inyección de estructura semántica
    this.elementosDOM.contenedorContenido.innerHTML = `
      <div class="slide-content">
        <div class="slide-title-wrapper">
          <h1 class="slide-title editable ${esTituloSeleccionado ? 'is-selected' : ''}"
              data-campo="titulo"
              data-field="title"
              contenteditable="true"
              spellcheck="false"
              style="font-size: ${tamanoTitulo}; font-family: ${fuenteTitulo};">
            ${textoTitulo}
          </h1>
        </div>
        <div class="slide-body-wrapper">
          <div class="slide-body editable ${!esTituloSeleccionado ? 'is-selected' : ''}"
               data-campo="cuerpo"
               data-field="body"
               contenteditable="true"
               spellcheck="false"
               style="font-size: ${tamanoCuerpo}; font-family: ${fuenteCuerpo};">
            ${textoCuerpo}
          </div>
        </div>
      </div>
    `;

    // Efecto de transición suave
    this.elementosDOM.visorLienzo.classList.remove('slide-animate-fade', 'slide-animate-slide');
    void this.elementosDOM.visorLienzo.offsetWidth;
    this.elementosDOM.visorLienzo.classList.add(claseAnimacion);

    this.enlazarElementosEditables();
  }

  aplicarEstilosDirectos(datosPropiedad) {
    const clave = datosPropiedad.key || datosPropiedad.clave;
    const valor = datosPropiedad.value || datosPropiedad.valor;

    if ((clave === 'colorTexto' || clave === 'textColor') && this.elementosDOM.visorLienzo) {
      this.elementosDOM.visorLienzo.style.color = valor;
    } else if ((clave === 'relacionAspecto' || clave === 'aspectRatio') && this.elementosDOM.visorLienzo) {
      const claseAspecto = valor === '4/3' ? 'aspect-4-3' : 'aspect-16-9';
      this.elementosDOM.visorLienzo.classList.remove('aspect-16-9', 'aspect-4-3');
      this.elementosDOM.visorLienzo.classList.add(claseAspecto);
    }
  }

  aplicarTamanoFuenteElemento(datosFuente) {
    const objetivo = datosFuente.target || datosFuente.objetivo;
    const tamano = datosFuente.size || datosFuente.tamano;

    if (objetivo === 'title' || objetivo === 'titulo') {
      const elementoTitulo = this.elementosDOM.contenedorContenido?.querySelector('.slide-title');
      if (elementoTitulo) elementoTitulo.style.fontSize = tamano;
    } else if (objetivo === 'body' || objetivo === 'cuerpo') {
      const elementoCuerpo = this.elementosDOM.contenedorContenido?.querySelector('.slide-body');
      if (elementoCuerpo) elementoCuerpo.style.fontSize = tamano;
    }
  }

  aplicarTipoFuenteElemento(datosFuente) {
    const objetivo = datosFuente.target || datosFuente.objetivo;
    const familiaFuente = datosFuente.fontFamily || datosFuente.familiaFuente;

    if (objetivo === 'title' || objetivo === 'titulo') {
      const elementoTitulo = this.elementosDOM.contenedorContenido?.querySelector('.slide-title');
      if (elementoTitulo) elementoTitulo.style.fontFamily = familiaFuente;
    } else if (objetivo === 'body' || objetivo === 'cuerpo') {
      const elementoCuerpo = this.elementosDOM.contenedorContenido?.querySelector('.slide-body');
      if (elementoCuerpo) elementoCuerpo.style.fontFamily = familiaFuente;
    }
  }

  actualizarResaltadoElementoSeleccionado(objetivo) {
    const elementoTitulo = this.elementosDOM.contenedorContenido?.querySelector('.slide-title');
    const elementoCuerpo = this.elementosDOM.contenedorContenido?.querySelector('.slide-body');

    const esTitulo = objetivo === 'title' || objetivo === 'titulo';
    if (esTitulo) {
      elementoTitulo?.classList.add('is-selected');
      elementoCuerpo?.classList.remove('is-selected');
    } else {
      elementoCuerpo?.classList.add('is-selected');
      elementoTitulo?.classList.remove('is-selected');
    }
  }

  enlazarElementosEditables() {
    const elementoTitulo = this.elementosDOM.contenedorContenido?.querySelector('.slide-title');
    const elementoCuerpo = this.elementosDOM.contenedorContenido?.querySelector('.slide-body');

    elementoTitulo?.addEventListener('click', () => {
      this.gestorEstado.establecerObjetivoSeleccionado?.('title')
        || this.gestorEstado.setSelectedTarget?.('title');
    });
    elementoTitulo?.addEventListener('focus', () => {
      this.usuarioEstaEditandoTexto = true;
      this.gestorEstado.establecerObjetivoSeleccionado?.('title')
        || this.gestorEstado.setSelectedTarget?.('title');
    });
    elementoTitulo?.addEventListener('blur', () => {
      this.usuarioEstaEditandoTexto = false;
      const contenidoTitulo = elementoTitulo.innerHTML.trim();
      this.gestorEstado.actualizarPropiedadDiapositivaActiva?.('titulo', contenidoTitulo, true)
        || this.gestorEstado.updateActiveSlideProperty?.('title', contenidoTitulo, true);
    });
    elementoTitulo?.addEventListener('input', () => {
      const contenidoTitulo = elementoTitulo.innerHTML.trim();
      this.gestorEstado.actualizarPropiedadDiapositivaActiva?.('titulo', contenidoTitulo, false)
        || this.gestorEstado.updateActiveSlideProperty?.('title', contenidoTitulo, false);
    });

    elementoCuerpo?.addEventListener('click', () => {
      this.gestorEstado.establecerObjetivoSeleccionado?.('body')
        || this.gestorEstado.setSelectedTarget?.('body');
    });
    elementoCuerpo?.addEventListener('focus', () => {
      this.usuarioEstaEditandoTexto = true;
      this.gestorEstado.establecerObjetivoSeleccionado?.('body')
        || this.gestorEstado.setSelectedTarget?.('body');
    });
    elementoCuerpo?.addEventListener('blur', () => {
      this.usuarioEstaEditandoTexto = false;
      const contenidoCuerpo = elementoCuerpo.innerHTML.trim();
      this.gestorEstado.actualizarPropiedadDiapositivaActiva?.('cuerpo', contenidoCuerpo, true)
        || this.gestorEstado.updateActiveSlideProperty?.('body', contenidoCuerpo, true);
    });
    elementoCuerpo?.addEventListener('input', () => {
      const contenidoCuerpo = elementoCuerpo.innerHTML.trim();
      this.gestorEstado.actualizarPropiedadDiapositivaActiva?.('cuerpo', contenidoCuerpo, false)
        || this.gestorEstado.updateActiveSlideProperty?.('body', contenidoCuerpo, false);
    });
  }

  estaEditandoTexto() {
    return this.usuarioEstaEditandoTexto;
  }

  // Métodos de compatibilidad
  renderSlide(animacion) { return this.renderizarDiapositiva(animacion); }
  isUserEditingText() { return this.estaEditandoTexto(); }
}

export const SlideStageComponent = ComponenteLienzoDiapositiva;
