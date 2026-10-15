/**
 * ServicioAlmacenamientoLocal
 * Responsabilidad Única: Gestión del almacenamiento local (LocalStorage)
 * para almacenar datos de sesión como la diapositiva activa
 * y preferencias de usuario con variables descriptivas en español.
 */
export class ServicioAlmacenamientoLocal {
  constructor(prefijoClave = 'webslides_') {
    this.prefijoClave = prefijoClave;
  }

  obtener(claveIdentificadora, valorPorDefecto = null) {
    try {
      const valorSerializado = localStorage.getItem(this.prefijoClave + claveIdentificadora);
      return valorSerializado === null ? valorPorDefecto : JSON.parse(valorSerializado);
    } catch (errorLectura) {
      console.warn(`[ServicioAlmacenamientoLocal] Error al leer la clave '${claveIdentificadora}':`, errorLectura);
      return valorPorDefecto;
    }
  }

  guardar(claveIdentificadora, valorAGuardar) {
    try {
      localStorage.setItem(this.prefijoClave + claveIdentificadora, JSON.stringify(valorAGuardar));
    } catch (errorEscritura) {
      console.warn(`[ServicioAlmacenamientoLocal] Error al guardar la clave '${claveIdentificadora}':`, errorEscritura);
    }
  }

  eliminar(claveIdentificadora) {
    try {
      localStorage.removeItem(this.prefijoClave + claveIdentificadora);
    } catch (errorEliminacion) {
      console.warn(`[ServicioAlmacenamientoLocal] Error al eliminar la clave '${claveIdentificadora}':`, errorEliminacion);
    }
  }

  obtenerIndiceDiapositivaActiva() {
    return this.obtener('indice_diapositiva_activa', 0);
  }

  establecerIndiceDiapositivaActiva(indiceDiapositiva) {
    this.guardar('indice_diapositiva_activa', indiceDiapositiva);
  }

  obtenerIdentificadorPresentacionActual() {
    return this.obtener('id_presentacion_actual', 'presentacion_por_defecto');
  }

  establecerIdentificadorPresentacionActual(identificadorPresentacion) {
    this.guardar('id_presentacion_actual', identificadorPresentacion);
  }

  // Métodos de compatibilidad
  get(clave, valorPorDefecto) { return this.obtener(clave, valorPorDefecto); }
  set(clave, valor) { return this.guardar(clave, valor); }
  remove(clave) { return this.eliminar(clave); }
  getActiveSlideIndex() { return this.obtenerIndiceDiapositivaActiva(); }
  setActiveSlideIndex(indice) { return this.establecerIndiceDiapositivaActiva(indice); }
  getCurrentPresentationId() { return this.obtenerIdentificadorPresentacionActual(); }
  setCurrentPresentationId(identificador) { return this.establecerIdentificadorPresentacionActual(identificador); }
}

export const LocalStorageService = ServicioAlmacenamientoLocal;
