/**
 * ServicioIndexedDB
 * Responsabilidad Única: Gestión de persistencia no volátil y estructurada
 * en la base de datos IndexedDB del navegador para almacenar presentaciones completas
 * con variables, parámetros y métodos descriptivos en español.
 */
export class ServicioIndexedDB {
  constructor(
    nombreBaseDatos = 'DiapositivasWebBD',
    versionEsquema = 1,
    nombreAlmacenObjetos = 'presentaciones'
  ) {
    this.nombreBaseDatos = nombreBaseDatos;
    this.versionEsquema = versionEsquema;
    this.nombreAlmacenObjetos = nombreAlmacenObjetos;
    this.instanciaBaseDatos = null;
  }

  async inicializarBaseDatos() {
    if (this.instanciaBaseDatos) {
      return this.instanciaBaseDatos;
    }

    return new Promise((resolverPromesa, rechazarPromesa) => {
      const solicitudApertura = indexedDB.open(this.nombreBaseDatos, this.versionEsquema);

      solicitudApertura.onupgradeneeded = (eventoActualizacion) => {
        const baseDatos = eventoActualizacion.target.result;
        if (!baseDatos.objectStoreNames.contains(this.nombreAlmacenObjetos)) {
          const almacenCreado = baseDatos.createObjectStore(this.nombreAlmacenObjetos, { keyPath: 'id' });
          almacenCreado.createIndex('fechaActualizacion', 'fechaActualizacion', { unique: false });
        }
      };

      solicitudApertura.onsuccess = (eventoExito) => {
        this.instanciaBaseDatos = eventoExito.target.result;
        resolverPromesa(this.instanciaBaseDatos);
      };

      solicitudApertura.onerror = (eventoError) => {
        console.error('[ServicioIndexedDB] Error al inicializar la base de datos:', eventoError.target.error);
        rechazarPromesa(eventoError.target.error);
      };
    });
  }

  async guardarPresentacion(objetoPresentacion) {
    const baseDatos = await this.inicializarBaseDatos();
    const fechaActual = new Date().toISOString();
    objetoPresentacion.fechaActualizacion = fechaActual;
    objetoPresentacion.updatedAt = fechaActual;

    return new Promise((resolverPromesa, rechazarPromesa) => {
      const transaccionEscritura = baseDatos.transaction([this.nombreAlmacenObjetos], 'readwrite');
      const almacenObjetos = transaccionEscritura.objectStore(this.nombreAlmacenObjetos);
      const solicitudGuardado = almacenObjetos.put(objetoPresentacion);

      solicitudGuardado.onsuccess = () => resolverPromesa(objetoPresentacion);
      solicitudGuardado.onerror = (eventoError) => rechazarPromesa(eventoError.target.error);
    });
  }

  async obtenerPresentacionPorId(identificadorPresentacion) {
    const baseDatos = await this.inicializarBaseDatos();

    return new Promise((resolverPromesa, rechazarPromesa) => {
      const transaccionLectura = baseDatos.transaction([this.nombreAlmacenObjetos], 'readonly');
      const almacenObjetos = transaccionLectura.objectStore(this.nombreAlmacenObjetos);
      const solicitudLectura = almacenObjetos.get(identificadorPresentacion);

      solicitudLectura.onsuccess = (eventoExito) => resolverPromesa(eventoExito.target.result || null);
      solicitudLectura.onerror = (eventoError) => rechazarPromesa(eventoError.target.error);
    });
  }

  async obtenerTodasLasPresentaciones() {
    const baseDatos = await this.inicializarBaseDatos();

    return new Promise((resolverPromesa, rechazarPromesa) => {
      const transaccionLectura = baseDatos.transaction([this.nombreAlmacenObjetos], 'readonly');
      const almacenObjetos = transaccionLectura.objectStore(this.nombreAlmacenObjetos);
      const solicitudLecturaTotal = almacenObjetos.getAll();

      solicitudLecturaTotal.onsuccess = (eventoExito) => resolverPromesa(eventoExito.target.result || []);
      solicitudLecturaTotal.onerror = (eventoError) => rechazarPromesa(eventoError.target.error);
    });
  }

  // Métodos de compatibilidad
  init() { return this.inicializarBaseDatos(); }
  savePresentation(presentacion) { return this.guardarPresentacion(presentacion); }
  getPresentation(id) { return this.obtenerPresentacionPorId(id); }
  getAllPresentations() { return this.obtenerTodasLasPresentaciones(); }
}

export const IndexedDBService = ServicioIndexedDB;
