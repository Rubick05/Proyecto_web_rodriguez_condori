/**
 * ComponenteNotificacionToast
 * Responsabilidad Única: Visualización de mensajes emergentes temporales (feedback al usuario)
 * con variables descriptivas en español.
 */
export class ComponenteNotificacionToast {
  constructor(idContenedor = 'toast-notice', idMensaje = 'toast-message') {
    this.contenedorToast = document.getElementById(idContenedor);
    this.elementoMensaje = document.getElementById(idMensaje);
    this.temporizadorOcultacion = null;
  }

  mostrar(mensajeTexto, duracionEnMilisegundos = 2200) {
    if (!this.contenedorToast || !this.elementoMensaje) return;

    this.elementoMensaje.textContent = mensajeTexto;
    this.contenedorToast.classList.add('show');

    clearTimeout(this.temporizadorOcultacion);
    this.temporizadorOcultacion = setTimeout(() => {
      this.contenedorToast.classList.remove('show');
    }, duracionEnMilisegundos);
  }

  show(mensaje, duracion) {
    return this.mostrar(mensaje, duracion);
  }
}

export const ToastComponent = ComponenteNotificacionToast;
