/**
 * GestorDeEstado
 * Responsabilidad Única: Gestión centralizada del estado reactivo de la presentación,
 * coordinación de persistencia en segundo plano y notificación a componentes suscriptores.
 * Diseñado con variables y métodos descriptivos en español.
 */
export class GestorDeEstado {
  constructor(servicioIndexedDB, servicioAlmacenamientoLocal, presentacionPorDefecto) {
    this.servicioIndexedDB = servicioIndexedDB;
    this.servicioAlmacenamientoLocal = servicioAlmacenamientoLocal;
    this.presentacionPorDefecto = presentacionPorDefecto;

    this.presentacionActual = null;
    this.indiceDiapositivaActual = 0;
    this.objetivoSeleccionado = 'title'; // 'title' o 'body'
    this.listaSuscriptores = [];
    this.temporizadorGuardado = null;
    this.manejadorEstadoGuardado = null;

    // Aliases para máxima compatibilidad
    this.idb = this.servicioIndexedDB;
    this.ls = this.servicioAlmacenamientoLocal;
    this.subscribers = this.listaSuscriptores;
  }

  // Getters y Setters de sincronización para propiedades legadas
  get presentation() { return this.presentacionActual; }
  set presentation(valor) { this.presentacionActual = valor; }

  get currentSlideIndex() { return this.indiceDiapositivaActual; }
  set currentSlideIndex(valor) { this.indiceDiapositivaActual = valor; }

  get selectedTarget() { return this.objetivoSeleccionado; }
  set selectedTarget(valor) { this.objetivoSeleccionado = valor; }

  get onSaveStatusChange() { return this.manejadorEstadoGuardado; }
  set onSaveStatusChange(funcionManejadora) { this.manejadorEstadoGuardado = funcionManejadora; }

  async cargarEstadoInicial() {
    try {
      await this.servicioIndexedDB.inicializarBaseDatos?.() || await this.servicioIndexedDB.init?.();
      const idPresentacionGuardada = this.servicioAlmacenamientoLocal.obtenerIdentificadorPresentacionActual?.() 
        || this.servicioAlmacenamientoLocal.getCurrentPresentationId?.() 
        || 'presentacion_por_defecto';

      let presentacionCargada = await this.servicioIndexedDB.obtenerPresentacionPorId?.(idPresentacionGuardada)
        || await this.servicioIndexedDB.getPresentation?.(idPresentacionGuardada);

      const diapositivas = presentacionCargada?.diapositivas || presentacionCargada?.slides;

      if (!presentacionCargada || !diapositivas || diapositivas.length === 0) {
        presentacionCargada = JSON.parse(JSON.stringify(this.presentacionPorDefecto));
        await this.servicioIndexedDB.guardarPresentacion?.(presentacionCargada)
          || await this.servicioIndexedDB.savePresentation?.(presentacionCargada);
      } else {
        // Garantizar propiedades por diapositiva tanto en español como en inglés
        diapositivas.forEach((diapositiva) => {
          diapositiva.titulo = diapositiva.titulo || diapositiva.title || 'Título de Diapositiva';
          diapositiva.cuerpo = diapositiva.cuerpo || diapositiva.body || '<p>Contenido</p>';
          diapositiva.title = diapositiva.titulo;
          diapositiva.body = diapositiva.cuerpo;

          diapositiva.colorTexto = diapositiva.colorTexto || diapositiva.textColor || '#0f172a';
          diapositiva.textColor = diapositiva.colorTexto;

          diapositiva.fuenteTitulo = diapositiva.fuenteTitulo || diapositiva.titleFontFamily || "'Outfit', sans-serif";
          diapositiva.fuenteCuerpo = diapositiva.fuenteCuerpo || diapositiva.bodyFontFamily || "'Inter', sans-serif";
          diapositiva.titleFontFamily = diapositiva.fuenteTitulo;
          diapositiva.bodyFontFamily = diapositiva.fuenteCuerpo;

          diapositiva.tamanoFuenteTitulo = diapositiva.tamanoFuenteTitulo || diapositiva.titleFontSize || '36px';
          diapositiva.tamanoFuenteCuerpo = diapositiva.tamanoFuenteCuerpo || diapositiva.bodyFontSize || '20px';
          diapositiva.titleFontSize = diapositiva.tamanoFuenteTitulo;
          diapositiva.bodyFontSize = diapositiva.tamanoFuenteCuerpo;

          diapositiva.relacionAspecto = diapositiva.relacionAspecto || diapositiva.aspectRatio || '16/9';
          diapositiva.aspectRatio = diapositiva.relacionAspecto;
        });

        // Garantizar doble referencia slides / diapositivas
        presentacionCargada.diapositivas = diapositivas;
        presentacionCargada.slides = diapositivas;
      }

      this.presentacionActual = presentacionCargada;
      const indiceGuardado = this.servicioAlmacenamientoLocal.obtenerIndiceDiapositivaActiva?.()
        ?? this.servicioAlmacenamientoLocal.getActiveSlideIndex?.()
        ?? 0;

      const totalDiapositivas = this.obtenerTotalDiapositivas();
      this.indiceDiapositivaActual = (indiceGuardado >= 0 && indiceGuardado < totalDiapositivas) ? indiceGuardado : 0;
    } catch (errorCarga) {
      console.error('[GestorDeEstado] Error al cargar el estado inicial:', errorCarga);
      this.presentacionActual = JSON.parse(JSON.stringify(this.presentacionPorDefecto));
      this.indiceDiapositivaActual = 0;
    }

    this.notificarSuscriptores('initial_load');
  }

  obtenerPresentacionActual() {
    return this.presentacionActual;
  }

  obtenerDiapositivaActual() {
    const lista = this.presentacionActual?.diapositivas || this.presentacionActual?.slides;
    return lista ? lista[this.indiceDiapositivaActual] : null;
  }

  obtenerIndiceActivo() {
    return this.indiceDiapositivaActual;
  }

  obtenerTotalDiapositivas() {
    const lista = this.presentacionActual?.diapositivas || this.presentacionActual?.slides;
    return lista?.length || 0;
  }

  obtenerObjetivoSeleccionado() {
    return this.objetivoSeleccionado;
  }

  establecerObjetivoSeleccionado(nuevoObjetivo) {
    if (nuevoObjetivo === 'title' || nuevoObjetivo === 'body' || nuevoObjetivo === 'titulo' || nuevoObjetivo === 'cuerpo') {
      // Normalizar internamente
      this.objetivoSeleccionado = (nuevoObjetivo === 'cuerpo' || nuevoObjetivo === 'body') ? 'body' : 'title';
      this.notificarSuscriptores('target_selected', { target: this.objetivoSeleccionado, objetivo: this.objetivoSeleccionado });
    }
  }

  establecerIndiceActivo(nuevoIndice, origenAccion = 'user_action') {
    if (nuevoIndice >= 0 && nuevoIndice < this.obtenerTotalDiapositivas()) {
      this.indiceDiapositivaActual = nuevoIndice;
      this.servicioAlmacenamientoLocal.establecerIndiceDiapositivaActiva?.(nuevoIndice)
        || this.servicioAlmacenamientoLocal.setActiveSlideIndex?.(nuevoIndice);

      this.notificarSuscriptores('slide_changed', { index: nuevoIndice, indice: nuevoIndice, source: origenAccion, origen: origenAccion });
    }
  }

  agregarDiapositiva() {
    if (!this.presentacionActual) return;

    const lista = this.presentacionActual.diapositivas || this.presentacionActual.slides;
    const nuevaDiapositiva = {
      id: 'diapositiva_' + Date.now(),
      titulo: 'Nueva Diapositiva',
      cuerpo: '<p>Haz clic aquí para escribir el contenido centrado al medio.</p>',
      title: 'Nueva Diapositiva',
      body: '<p>Haz clic aquí para escribir el contenido centrado al medio.</p>',
      colorTexto: '#0f172a',
      textColor: '#0f172a',
      fuenteTitulo: "'Outfit', sans-serif",
      titleFontFamily: "'Outfit', sans-serif",
      fuenteCuerpo: "'Inter', sans-serif",
      bodyFontFamily: "'Inter', sans-serif",
      tamanoFuenteTitulo: '36px',
      titleFontSize: '36px',
      tamanoFuenteCuerpo: '20px',
      bodyFontSize: '20px',
      relacionAspecto: '16/9',
      aspectRatio: '16/9'
    };

    const siguienteIndice = this.indiceDiapositivaActual + 1;
    lista.splice(siguienteIndice, 0, nuevaDiapositiva);
    this.presentacionActual.diapositivas = lista;
    this.presentacionActual.slides = lista;

    this.indiceDiapositivaActual = siguienteIndice;
    this.objetivoSeleccionado = 'title';

    this.activarGuardadoTemporizado(true);
    this.notificarSuscriptores('slides_list_changed');
    this.notificarSuscriptores('slide_changed', { index: siguienteIndice, indice: siguienteIndice, source: 'add_slide', origen: 'agregar_diapositiva' });
  }

  eliminarDiapositiva() {
    if (!this.presentacionActual || this.obtenerTotalDiapositivas() <= 1) {
      return false;
    }

    const lista = this.presentacionActual.diapositivas || this.presentacionActual.slides;
    lista.splice(this.indiceDiapositivaActual, 1);

    if (this.indiceDiapositivaActual >= this.obtenerTotalDiapositivas()) {
      this.indiceDiapositivaActual = this.obtenerTotalDiapositivas() - 1;
    }

    this.presentacionActual.diapositivas = lista;
    this.presentacionActual.slides = lista;
    this.objetivoSeleccionado = 'title';

    this.activarGuardadoTemporizado(true);
    this.notificarSuscriptores('slides_list_changed');
    this.notificarSuscriptores('slide_changed', { index: this.indiceDiapositivaActual, indice: this.indiceDiapositivaActual, source: 'delete_slide', origen: 'eliminar_diapositiva' });
    return true;
  }

  actualizarTituloPresentacion(nuevoTitulo) {
    if (!this.presentacionActual) return;
    const tituloLimpio = nuevoTitulo.trim() || 'Sin título';
    this.presentacionActual.titulo = tituloLimpio;
    this.presentacionActual.title = tituloLimpio;
    this.activarGuardadoTemporizado(false);
  }

  actualizarPropiedadDiapositivaActiva(clavePropiedad, valorPropiedad, inmediato = false) {
    const diapositivaActiva = this.obtenerDiapositivaActual();
    if (!diapositivaActiva) return;

    diapositivaActiva[clavePropiedad] = valorPropiedad;

    // Sincronizar pares clave en inglés y español
    if (clavePropiedad === 'colorTexto') diapositivaActiva.textColor = valorPropiedad;
    if (clavePropiedad === 'textColor') diapositivaActiva.colorTexto = valorPropiedad;
    if (clavePropiedad === 'titulo') diapositivaActiva.title = valorPropiedad;
    if (clavePropiedad === 'title') diapositivaActiva.titulo = valorPropiedad;
    if (clavePropiedad === 'cuerpo') diapositivaActiva.body = valorPropiedad;
    if (clavePropiedad === 'body') diapositivaActiva.cuerpo = valorPropiedad;
    if (clavePropiedad === 'relacionAspecto') diapositivaActiva.aspectRatio = valorPropiedad;
    if (clavePropiedad === 'aspectRatio') diapositivaActiva.relacionAspecto = valorPropiedad;

    this.activarGuardadoTemporizado(inmediato);
    this.notificarSuscriptores('slide_property_updated', {
      key: clavePropiedad,
      clave: clavePropiedad,
      value: valorPropiedad,
      valor: valorPropiedad,
      index: this.indiceDiapositivaActual,
      indice: this.indiceDiapositivaActual
    });
  }

  actualizarTamanoFuenteElemento(valorTamano, inmediato = true) {
    const diapositivaActiva = this.obtenerDiapositivaActual();
    if (!diapositivaActiva) return;

    const esTitulo = this.objetivoSeleccionado === 'title' || this.objetivoSeleccionado === 'titulo';
    const clavePropiedadEspanol = esTitulo ? 'tamanoFuenteTitulo' : 'tamanoFuenteCuerpo';
    const clavePropiedadIngles = esTitulo ? 'titleFontSize' : 'bodyFontSize';

    diapositivaActiva[clavePropiedadEspanol] = valorTamano;
    diapositivaActiva[clavePropiedadIngles] = valorTamano;

    this.activarGuardadoTemporizado(inmediato);
    this.notificarSuscriptores('element_font_size_updated', {
      target: this.objetivoSeleccionado,
      objetivo: this.objetivoSeleccionado,
      propKey: clavePropiedadIngles,
      clave: clavePropiedadEspanol,
      size: valorTamano,
      tamano: valorTamano,
      index: this.indiceDiapositivaActual,
      indice: this.indiceDiapositivaActual
    });
  }

  obtenerTamanoFuenteObjetivo() {
    const diapositivaActiva = this.obtenerDiapositivaActual();
    if (!diapositivaActiva) return '20px';

    const esTitulo = this.objetivoSeleccionado === 'title' || this.objetivoSeleccionado === 'titulo';
    return esTitulo
      ? (diapositivaActiva.tamanoFuenteTitulo || diapositivaActiva.titleFontSize || '36px')
      : (diapositivaActiva.tamanoFuenteCuerpo || diapositivaActiva.bodyFontSize || '20px');
  }

  actualizarTipoFuenteElemento(valorFamiliaFuente, inmediato = true) {
    const diapositivaActiva = this.obtenerDiapositivaActual();
    if (!diapositivaActiva) return;

    const esTitulo = this.objetivoSeleccionado === 'title' || this.objetivoSeleccionado === 'titulo';
    const clavePropiedadEspanol = esTitulo ? 'fuenteTitulo' : 'fuenteCuerpo';
    const clavePropiedadIngles = esTitulo ? 'titleFontFamily' : 'bodyFontFamily';

    diapositivaActiva[clavePropiedadEspanol] = valorFamiliaFuente;
    diapositivaActiva[clavePropiedadIngles] = valorFamiliaFuente;

    this.activarGuardadoTemporizado(inmediato);
    this.notificarSuscriptores('element_font_family_updated', {
      target: this.objetivoSeleccionado,
      objetivo: this.objetivoSeleccionado,
      propKey: clavePropiedadIngles,
      clave: clavePropiedadEspanol,
      fontFamily: valorFamiliaFuente,
      familiaFuente: valorFamiliaFuente,
      index: this.indiceDiapositivaActual,
      indice: this.indiceDiapositivaActual
    });
  }

  obtenerTipoFuenteObjetivo() {
    const diapositivaActiva = this.obtenerDiapositivaActual();
    if (!diapositivaActiva) return "'Inter', sans-serif";

    const esTitulo = this.objetivoSeleccionado === 'title' || this.objetivoSeleccionado === 'titulo';
    return esTitulo
      ? (diapositivaActiva.fuenteTitulo || diapositivaActiva.titleFontFamily || "'Outfit', sans-serif")
      : (diapositivaActiva.fuenteCuerpo || diapositivaActiva.bodyFontFamily || "'Inter', sans-serif");
  }

  activarGuardadoTemporizado(inmediato = false) {
    clearTimeout(this.temporizadorGuardado);

    if (this.manejadorEstadoGuardado) {
      this.manejadorEstadoGuardado('saving');
    }

    const accionGuardar = async () => {
      try {
        await this.servicioIndexedDB.guardarPresentacion?.(this.presentacionActual)
          || await this.servicioIndexedDB.savePresentation?.(this.presentacionActual);

        this.servicioAlmacenamientoLocal.establecerIndiceDiapositivaActiva?.(this.indiceDiapositivaActual)
          || this.servicioAlmacenamientoLocal.setActiveSlideIndex?.(this.indiceDiapositivaActual);

        if (this.manejadorEstadoGuardado) {
          this.manejadorEstadoGuardado('saved');
        }
      } catch (errorGuardado) {
        console.error('[GestorDeEstado] Error al guardar en persistencia:', errorGuardado);
        if (this.manejadorEstadoGuardado) {
          this.manejadorEstadoGuardado('error');
        }
      }
    };

    if (inmediato) {
      accionGuardar();
    } else {
      this.temporizadorGuardado = setTimeout(accionGuardar, 350);
    }
  }

  suscribirse(devolucionLlamada) {
    this.listaSuscriptores.push(devolucionLlamada);
    return () => {
      this.listaSuscriptores = this.listaSuscriptores.filter(cb => cb !== devolucionLlamada);
    };
  }

  notificarSuscriptores(tipoEvento, datosAdicionales = {}) {
    this.listaSuscriptores.forEach(devolucionLlamada => {
      try {
        devolucionLlamada(tipoEvento, datosAdicionales);
      } catch (errorSuscriptor) {
        console.error(`[GestorDeEstado] Error notificando evento '${tipoEvento}':`, errorSuscriptor);
      }
    });
  }

  // Métodos puente para compatibilidad total
  loadInitialState() { return this.cargarEstadoInicial(); }
  getCurrentPresentation() { return this.obtenerPresentacionActual(); }
  getCurrentSlide() { return this.obtenerDiapositivaActual(); }
  getActiveIndex() { return this.obtenerIndiceActivo(); }
  getSlideCount() { return this.obtenerTotalDiapositivas(); }
  getSelectedTarget() { return this.obtenerObjetivoSeleccionado(); }
  setSelectedTarget(target) { return this.establecerObjetivoSeleccionado(target); }
  setActiveIndex(idx, src) { return this.establecerIndiceActivo(idx, src); }
  addSlide() { return this.agregarDiapositiva(); }
  deleteSlide() { return this.eliminarDiapositiva(); }
  updatePresentationTitle(titulo) { return this.actualizarTituloPresentacion(titulo); }
  updateActiveSlideProperty(k, v, imm) { return this.actualizarPropiedadDiapositivaActiva(k, v, imm); }
  updateSelectedElementFontSize(sz, imm) { return this.actualizarTamanoFuenteElemento(sz, imm); }
  getTargetFontSize() { return this.obtenerTamanoFuenteObjetivo(); }
  updateSelectedElementFontFamily(f, imm) { return this.actualizarTipoFuenteElemento(f, imm); }
  getTargetFontFamily() { return this.obtenerTipoFuenteObjetivo(); }
  triggerDebouncedSave(imm) { return this.activarGuardadoTemporizado(imm); }
  subscribe(cb) { return this.suscribirse(cb); }
  notifySubscribers(ev, d) { return this.notificarSuscriptores(ev, d); }
}

export const StateManager = GestorDeEstado;
