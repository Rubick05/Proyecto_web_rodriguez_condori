/**
 * DiapositivasPorDefecto
 * Responsabilidad Única: Definición de los datos iniciales y estructura base
 * de la presentación por defecto con propiedades y variables descriptivas en español.
 */
export const PRESENTACION_POR_DEFECTO = {
  id: 'presentacion_por_defecto',
  titulo: 'Web Slides Simples',
  title: 'Web Slides Simples',
  fechaCreacion: new Date().toISOString(),
  fechaActualizacion: new Date().toISOString(),
  diapositivas: [
    {
      id: 'diapositiva_1',
      titulo: 'Bienvenido a Web Slides',
      cuerpo: '<p>Este proyecto está diseñado para ser <b>simple y directo</b>. Puedes hacer clic en cualquier texto para modificarlo al instante.</p><p>Personaliza el <b>color del texto</b>, la <b>fuente</b> y el <b>tamaño de fuente</b> desde la barra superior.</p>',
      title: 'Bienvenido a Web Slides',
      body: '<p>Este proyecto está diseñado para ser <b>simple y directo</b>. Puedes hacer clic en cualquier texto para modificarlo al instante.</p><p>Personaliza el <b>color del texto</b>, la <b>fuente</b> y el <b>tamaño de fuente</b> desde la barra superior.</p>',
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
    },
    {
      id: 'diapositiva_2',
      titulo: 'Persistencia en IndexedDB y LocalStorage',
      cuerpo: '<p>Tus modificaciones se guardan automáticamente en <b>IndexedDB</b> sin necesidad de pulsar botones de guardar.</p><p>Además, <b>LocalStorage</b> recuerda en qué diapositiva te encontrabas para continuar sin interrupciones al recargar la página.</p>',
      title: 'Persistencia en IndexedDB y LocalStorage',
      body: '<p>Tus modificaciones se guardan automáticamente en <b>IndexedDB</b> sin necesidad de pulsar botones de guardar.</p><p>Además, <b>LocalStorage</b> recuerda en qué diapositiva te encontrabas para continuar sin interrupciones al recargar la página.</p>',
      colorTexto: '#1e3a8a',
      textColor: '#1e3a8a',
      fuenteTitulo: "'Outfit', sans-serif",
      titleFontFamily: "'Outfit', sans-serif",
      fuenteCuerpo: "'Inter', sans-serif",
      bodyFontFamily: "'Inter', sans-serif",
      tamanoFuenteTitulo: '34px',
      titleFontSize: '34px',
      tamanoFuenteCuerpo: '20px',
      bodyFontSize: '20px',
      relacionAspecto: '16/9',
      aspectRatio: '16/9'
    },
    {
      id: 'diapositiva_3',
      titulo: 'Personalización de Texto',
      cuerpo: '<p>Prueba las herramientas disponibles en la barra superior:</p><p>Al hacer clic en el <b>título</b> o en el <b>contenido</b>, puedes cambiar independientemente el tipo de fuente y el tamaño sin afectar las demás diapositivas.</p>',
      title: 'Personalización de Texto',
      body: '<p>Prueba las herramientas disponibles en la barra superior:</p><p>Al hacer clic en el <b>título</b> o en el <b>contenido</b>, puedes cambiar independientemente el tipo de fuente y el tamaño sin afectar las demás diapositivas.</p>',
      colorTexto: '#065f46',
      textColor: '#065f46',
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
    },
    {
      id: 'diapositiva_4',
      titulo: 'Navegación Intuitiva',
      cuerpo: '<p>Puedes desplazarte entre las diapositivas con las miniaturas de la izquierda, los botones ◀ y ▶ o con las <b>flechas del teclado</b>.</p><p>Usa los botones <b>Añadir Diapositiva</b> y <b>Borrar</b> para gestionar tu presentación.</p>',
      title: 'Navegación Intuitiva',
      body: '<p>Puedes desplazarte entre las diapositivas con las miniaturas de la izquierda, los botones ◀ y ▶ o con las <b>flechas del teclado</b>.</p><p>Usa los botones <b>Añadir Diapositiva</b> y <b>Borrar</b> para gestionar tu presentación.</p>',
      colorTexto: '#581c87',
      textColor: '#581c87',
      fuenteTitulo: "'Outfit', sans-serif",
      titleFontFamily: "'Outfit', sans-serif",
      fuenteCuerpo: "'Inter', sans-serif",
      bodyFontFamily: "'Inter', sans-serif",
      tamanoFuenteTitulo: '34px',
      titleFontSize: '34px',
      tamanoFuenteCuerpo: '20px',
      bodyFontSize: '20px',
      relacionAspecto: '16/9',
      aspectRatio: '16/9'
    }
  ]
};

// Referencia bidireccional slides/diapositivas
PRESENTACION_POR_DEFECTO.slides = PRESENTACION_POR_DEFECTO.diapositivas;
export const DEFAULT_PRESENTATION = PRESENTACION_POR_DEFECTO;
