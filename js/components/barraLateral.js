/**
 * ComponenteBarraLateral
 * Responsabilidad Única: Gestión visual de las miniaturas laterales,
 * selección directa de diapositivas y sincronización de títulos
 * con variables descriptivas en español.
 */
export class ComponenteBarraLateral {
  constructor(gestorEstado) {
    this.gestorEstado = gestorEstado;
    this.contenedorMiniaturas = document.getElementById('thumbnails-list');

    // Referencias legadas para compatibilidad
    this.state = this.gestorEstado;
    this.container = this.contenedorMiniaturas;

    this.gestorEstado.subscribe?.((tipoEvento) => {
      if (['initial_load', 'slides_list_changed'].includes(tipoEvento)) {
        this.renderizarTodasLasMiniaturas();
      } else if (tipoEvento === 'slide_changed') {
        this.actualizarEstadoActivo();
      } else if (tipoEvento === 'slide_property_updated') {
        this.actualizarTituloMiniaturaActiva();
      }
    });
  }

  renderizarTodasLasMiniaturas() {
    if (!this.contenedorMiniaturas) return;
    this.contenedorMiniaturas.innerHTML = '';

    const presentacion = this.gestorEstado.obtenerPresentacionActual?.() || this.gestorEstado.getCurrentPresentation?.();
    const listaDiapositivas = presentacion?.diapositivas || presentacion?.slides;
    if (!listaDiapositivas) return;

    const indiceActivo = this.gestorEstado.obtenerIndiceActivo?.() ?? this.gestorEstado.getActiveIndex?.() ?? 0;

    listaDiapositivas.forEach((diapositiva, indice) => {
      const elementoMiniatura = document.createElement('div');
      elementoMiniatura.className = `thumbnail-item ${indice === indiceActivo ? 'active' : ''}`;
      elementoMiniatura.dataset.index = indice;
      elementoMiniatura.dataset.indice = indice;

      const textoTitulo = diapositiva.titulo || diapositiva.title || `Diapositiva ${indice + 1}`;
      const relacionAspecto = diapositiva.relacionAspecto || diapositiva.aspectRatio || '16/9';
      const claseAspecto = relacionAspecto === '4/3' ? 'aspect-4-3' : 'aspect-16-9';
      const fuenteTitulo = diapositiva.fuenteTitulo || diapositiva.titleFontFamily || 'inherit';
      const colorTexto = diapositiva.colorTexto || diapositiva.textColor || '#0f172a';

      elementoMiniatura.innerHTML = `
        <span class="thumbnail-index">${indice + 1}</span>
        <div class="thumbnail-card ${claseAspecto}" style="color: ${colorTexto}; font-family: ${fuenteTitulo};">
          <strong style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; display: block;">${textoTitulo}</strong>
        </div>
      `;

      elementoMiniatura.addEventListener('click', () => {
        this.gestorEstado.establecerIndiceActivo?.(indice, 'sidebar_click')
          || this.gestorEstado.setActiveIndex?.(indice, 'sidebar_click');
      });

      this.contenedorMiniaturas.appendChild(elementoMiniatura);
    });

    this.desplazarMiniaturaActivaHaciaVista();
  }

  actualizarEstadoActivo() {
    if (!this.contenedorMiniaturas) return;
    const indiceActivo = this.gestorEstado.obtenerIndiceActivo?.() ?? this.gestorEstado.getActiveIndex?.() ?? 0;
    const elementos = this.contenedorMiniaturas.querySelectorAll('.thumbnail-item');

    elementos.forEach((elemento, indice) => {
      if (indice === indiceActivo) {
        elemento.classList.add('active');
      } else {
        elemento.classList.remove('active');
      }
    });

    this.desplazarMiniaturaActivaHaciaVista();
  }

  actualizarTituloMiniaturaActiva() {
    if (!this.contenedorMiniaturas) return;
    const indiceActivo = this.gestorEstado.obtenerIndiceActivo?.() ?? this.gestorEstado.getActiveIndex?.() ?? 0;
    const miniaturaActiva = this.contenedorMiniaturas.querySelector(`.thumbnail-item[data-index="${indiceActivo}"]`);
    if (!miniaturaActiva) return;

    const diapositivaActiva = this.gestorEstado.obtenerDiapositivaActual?.() || this.gestorEstado.getCurrentSlide?.();
    const tarjetaMiniatura = miniaturaActiva.querySelector('.thumbnail-card');

    if (tarjetaMiniatura && diapositivaActiva) {
      const colorTexto = diapositivaActiva.colorTexto || diapositivaActiva.textColor || '#0f172a';
      const fuenteTitulo = diapositivaActiva.fuenteTitulo || diapositivaActiva.titleFontFamily || 'inherit';
      const relacionAspecto = diapositivaActiva.relacionAspecto || diapositivaActiva.aspectRatio || '16/9';
      const claseAspecto = relacionAspecto === '4/3' ? 'aspect-4-3' : 'aspect-16-9';

      tarjetaMiniatura.style.color = colorTexto;
      tarjetaMiniatura.style.fontFamily = fuenteTitulo;
      tarjetaMiniatura.classList.remove('aspect-16-9', 'aspect-4-3');
      tarjetaMiniatura.classList.add(claseAspecto);

      const textoTitulo = diapositivaActiva.titulo || diapositivaActiva.title || `Diapositiva ${indiceActivo + 1}`;
      tarjetaMiniatura.innerHTML = `<strong style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; display: block;">${textoTitulo}</strong>`;
    }
  }

  desplazarMiniaturaActivaHaciaVista() {
    const miniaturaActiva = this.contenedorMiniaturas?.querySelector('.thumbnail-item.active');
    if (miniaturaActiva) {
      miniaturaActiva.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  // Métodos de compatibilidad
  renderAllThumbnails() { return this.renderizarTodasLasMiniaturas(); }
  updateActiveState() { return this.actualizarEstadoActivo(); }
  updateActiveThumbnailTitle() { return this.actualizarTituloMiniaturaActiva(); }
  scrollActiveIntoView() { return this.desplazarMiniaturaActivaHaciaVista(); }
}

export const SidebarComponent = ComponenteBarraLateral;
