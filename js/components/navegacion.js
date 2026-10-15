/**
 * ComponenteNavegacion
 * Responsabilidad Única: Gestión de los controles de avance y retroceso,
 * indicador de diapositiva actual, barra de progreso y atajos de teclado
 * con variables descriptivas en español.
 */
export class ComponenteNavegacion {
  constructor(gestorEstado, componenteLienzo) {
    this.gestorEstado = gestorEstado;
    this.componenteLienzo = componenteLienzo;

    this.elementosDOM = {
      botonAnterior: document.getElementById('prev-slide-btn'),
      botonSiguiente: document.getElementById('next-slide-btn'),
      numeroDiapositivaActual: document.getElementById('current-slide-num'),
      numeroTotalDiapositivas: document.getElementById('total-slides-num'),
      barraProgreso: document.getElementById('slide-progress-bar')
    };

    // Referencias legadas para compatibilidad
    this.state = this.gestorEstado;
    this.slideStage = this.componenteLienzo;
    this.elements = {
      prevBtn: this.elementosDOM.botonAnterior,
      nextBtn: this.elementosDOM.botonSiguiente,
      currentNum: this.elementosDOM.numeroDiapositivaActual,
      totalNum: this.elementosDOM.numeroTotalDiapositivas,
      progressBar: this.elementosDOM.barraProgreso
    };

    this.enlazarEventos();

    this.gestorEstado.subscribe?.((tipoEvento) => {
      if (['initial_load', 'slide_changed', 'slides_list_changed'].includes(tipoEvento)) {
        this.actualizarInterfaz();
      }
    });
  }

  actualizarInterfaz() {
    const totalDiapositivas = this.gestorEstado.obtenerTotalDiapositivas?.() ?? this.gestorEstado.getSlideCount?.() ?? 1;
    const indiceActual = this.gestorEstado.obtenerIndiceActivo?.() ?? this.gestorEstado.getActiveIndex?.() ?? 0;
    const numeroActual = indiceActual + 1;

    if (this.elementosDOM.numeroDiapositivaActual) {
      this.elementosDOM.numeroDiapositivaActual.textContent = numeroActual;
    }
    if (this.elementosDOM.numeroTotalDiapositivas) {
      this.elementosDOM.numeroTotalDiapositivas.textContent = totalDiapositivas;
    }

    const esPrimera = indiceActual === 0;
    const esUltima = indiceActual === totalDiapositivas - 1;

    if (this.elementosDOM.botonAnterior) {
      this.elementosDOM.botonAnterior.disabled = esPrimera;
    }
    if (this.elementosDOM.botonSiguiente) {
      this.elementosDOM.botonSiguiente.disabled = esUltima;
    }

    if (this.elementosDOM.barraProgreso) {
      const porcentajeProgreso = (numeroActual / totalDiapositivas) * 100;
      this.elementosDOM.barraProgreso.style.width = `${porcentajeProgreso}%`;
    }
  }

  retroceder() {
    const indiceActual = this.gestorEstado.obtenerIndiceActivo?.() ?? this.gestorEstado.getActiveIndex?.() ?? 0;
    if (indiceActual > 0) {
      this.gestorEstado.establecerIndiceActivo?.(indiceActual - 1, 'prev')
        || this.gestorEstado.setActiveIndex?.(indiceActual - 1, 'prev');
    }
  }

  avanzar() {
    const indiceActual = this.gestorEstado.obtenerIndiceActivo?.() ?? this.gestorEstado.getActiveIndex?.() ?? 0;
    const totalDiapositivas = this.gestorEstado.obtenerTotalDiapositivas?.() ?? this.gestorEstado.getSlideCount?.() ?? 0;
    if (indiceActual < totalDiapositivas - 1) {
      this.gestorEstado.establecerIndiceActivo?.(indiceActual + 1, 'next')
        || this.gestorEstado.setActiveIndex?.(indiceActual + 1, 'next');
    }
  }

  enlazarEventos() {
    this.elementosDOM.botonAnterior?.addEventListener('click', () => this.retroceder());
    this.elementosDOM.botonSiguiente?.addEventListener('click', () => this.avanzar());

    // Atajos de teclado para navegación fluida
    window.addEventListener('keydown', (eventoTeclado) => {
      // Ignorar navegación si el usuario está escribiendo activamente
      const estaEditando = this.componenteLienzo?.estaEditandoTexto?.() 
        || this.componenteLienzo?.isUserEditingText?.() 
        || ['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName);

      if (estaEditando) return;

      switch (eventoTeclado.key) {
        case 'ArrowRight':
        case 'PageDown':
        case ' ':
          eventoTeclado.preventDefault();
          this.avanzar();
          break;
        case 'ArrowLeft':
        case 'PageUp':
          eventoTeclado.preventDefault();
          this.retroceder();
          break;
      }
    });
  }

  // Métodos de compatibilidad
  updateUI() { return this.actualizarInterfaz(); }
  prev() { return this.retroceder(); }
  next() { return this.avanzar(); }
  bindEvents() { return this.enlazarEventos(); }
}

export const NavigationComponent = ComponenteNavegacion;
