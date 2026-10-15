/**
 * Punto de Entrada Principal (Web Slides)
 * Responsabilidad Única: Orquestación, inyección de dependencias e inicialización
 * de los servicios de persistencia, gestor de estado centralizado y componentes de interfaz.
 * Escrito con variables descriptivas en español.
 */

import { ServicioAlmacenamientoLocal } from './storage/servicioAlmacenamientoLocal.js';
import { ServicioIndexedDB } from './storage/servicioIndexedDB.js';
import { PRESENTACION_POR_DEFECTO } from './data/diapositivasPorDefecto.js';
import { GestorDeEstado } from './state/gestorDeEstado.js';
import { ComponenteNotificacionToast } from './components/notificacionToast.js';
import { ComponenteBarraHerramientas } from './components/barraHerramientas.js';
import { ComponenteLienzoDiapositiva } from './components/lienzoDiapositiva.js';
import { ComponenteBarraLateral } from './components/barraLateral.js';
import { ComponenteNavegacion } from './components/navegacion.js';

class AplicacionDiapositivasWeb {
  static async iniciar() {
    // 1. Inicializar servicios de persistencia de datos
    const servicioAlmacenamientoLocal = new ServicioAlmacenamientoLocal();
    const servicioIndexedDB = new ServicioIndexedDB();

    // 2. Inicializar gestor centralizado del estado reactivo
    const gestorDeEstado = new GestorDeEstado(
      servicioIndexedDB,
      servicioAlmacenamientoLocal,
      PRESENTACION_POR_DEFECTO
    );

    // 3. Inicializar componentes de la interfaz de usuario
    const componenteNotificacionToast = new ComponenteNotificacionToast();
    const componenteLienzoDiapositiva = new ComponenteLienzoDiapositiva(gestorDeEstado);
    const componenteBarraHerramientas = new ComponenteBarraHerramientas(gestorDeEstado, componenteNotificacionToast);
    const componenteBarraLateral = new ComponenteBarraLateral(gestorDeEstado);
    const componenteNavegacion = new ComponenteNavegacion(gestorDeEstado, componenteLienzoDiapositiva);

    // 4. Enlazar elementos del encabezado (indicador de autoguardado y título)
    const indicadorEstadoGuardado = document.getElementById('save-status');
    const campoTituloPresentacion = document.getElementById('presentation-title');

    gestorDeEstado.onSaveStatusChange = (estadoGuardado) => {
      if (!indicadorEstadoGuardado) return;
      if (estadoGuardado === 'saving') {
        indicadorEstadoGuardado.innerHTML = '<span class="status-dot saving"></span> <span>Guardando...</span>';
      } else if (estadoGuardado === 'saved') {
        indicadorEstadoGuardado.innerHTML = '<span class="status-dot"></span> <span>Guardado en IndexedDB</span>';
      } else if (estadoGuardado === 'error') {
        indicadorEstadoGuardado.innerHTML = '<span class="status-dot error"></span> <span>Error al guardar</span>';
      }
    };

    campoTituloPresentacion?.addEventListener('input', (eventoEntrada) => {
      gestorDeEstado.actualizarTituloPresentacion(eventoEntrada.target.value);
    });

    gestorDeEstado.suscribirse((tipoEvento) => {
      if (tipoEvento === 'initial_load' && campoTituloPresentacion) {
        const presentacionActual = gestorDeEstado.obtenerPresentacionActual();
        campoTituloPresentacion.value = presentacionActual?.titulo || presentacionActual?.title || 'Web Slides Simples';
      }
    });

    // 5. Cargar estado inicial desde persistencia
    await gestorDeEstado.cargarEstadoInicial();
    componenteNotificacionToast.mostrar('Web Slides iniciada');

    // Referencia global mínima para inspección y depuración
    window.__aplicacion = {
      gestorDeEstado,
      componenteBarraHerramientas,
      componenteLienzoDiapositiva,
      componenteBarraLateral,
      componenteNavegacion,
      componenteNotificacionToast
    };
    window.__app = window.__aplicacion;
  }
}

// Iniciar aplicación automáticamente al cargar el DOM
document.addEventListener('DOMContentLoaded', () => {
  AplicacionDiapositivasWeb.iniciar();
});
