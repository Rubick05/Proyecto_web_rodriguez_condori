# 🖥️ Web Slides - Editor Interactivo de Diapositivas

> Aplicación web modular, ligera y moderna para crear, editar y presentar diapositivas interactivas en tiempo real, construida con **HTML5 Semántico, Vanilla CSS, W3.CSS, Vanilla JavaScript (ES Modules), IndexedDB y LocalStorage**.

Repositorio Remoto Principal: [https://github.com/Rubick05/importadora_sergio.git](https://github.com/Rubick05/importadora_sergio.git)  
Repositorio Alternativo: [https://github.com/Rubick05/Proyecto_web_rodriguez_condori.git](https://github.com/Rubick05/Proyecto_web_rodriguez_condori.git)

---

## 🚀 Características Principales

- **Edición en Tiempo Real**: Haz clic directamente sobre el título o el contenido de la diapositiva para editar el texto al instante.
- **Formato Independiente por Elemento**: Modifica el tipo de fuente y el tamaño de texto de forma independiente para el título y el cuerpo de cada diapositiva.
- **Paleta de Color Dinámica**: Cambia el color del texto con vista previa inmediata.
- **Relaciones de Aspecto Flexibles**: Alterna entre formato panorámico (**16:9**) y estándar (**4:3**).
- **Persistencia Reactiva en Dos Niveles**:
  - **IndexedDB**: Guarda de forma asíncrona (con debounce) la presentación completa y el historial de diapositivas sin perder datos al cerrar la pestaña.
  - **LocalStorage**: Recuerda la diapositiva activa en la que te quedaste para retomar el trabajo exactamente donde lo dejaste.
- **Navegación Fluida y Accesible**:
  - Panel lateral de miniaturas con indicador visual de diapositiva activa.
  - Botones anterior (◀) y siguiente (▶) con deshabilitación inteligente en los extremos.
  - Atajos de teclado: Flechas `←` / `→`, `Espacio`, `Page Up` / `Page Down`.
  - Barra de progreso interactiva que refleja el porcentaje avanzado.
- **Nomenclatura 100% en Español**: Todas las variables, clases, métodos y parámetros del código fuente son descriptivos y están escritos en idioma español.

---

## 📂 Arquitectura del Proyecto

El proyecto sigue una arquitectura limpia basada en el **Principio de Responsabilidad Única (SRP)** y el patrón de diseño **Observador**:

```text
proyecto_web/
├── index.html                           # Estructura semántica principal
├── css/
│   ├── base.css                         # Tokens de diseño, tipografías y variables CSS
│   ├── components.css                   # Estilos modulares de cada componente UI
│   └── w3.css                           # Framework CSS ligero para soporte visual
├── js/
│   ├── main.js                          # Punto de entrada y orquestador principal
│   ├── storage/
│   │   ├── servicioAlmacenamientoLocal.js # Manejo de LocalStorage con variables en español
│   │   └── servicioIndexedDB.js           # Base de datos IndexedDB con variables en español
│   ├── data/
│   │   └── diapositivasPorDefecto.js     # Datos de demostración y estructura inicial
│   ├── state/
│   │   └── gestorDeEstado.js              # Gestor central reactivo y patrón Observador
│   └── components/
│       ├── notificacionToast.js          # Mensajes emergentes temporales (feedback)
│       ├── lienzoDiapositiva.js          # Escenario de renderizado y edición interactiva
│       ├── barraHerramientas.js          # Cinta superior de controles y formato
│       ├── barraLateral.js               # Miniaturas sincronizadas de diapositivas
│       └── navegacion.js                 # Control de avance, retroceso y teclado
├── PROMPTING_GUIA.md                    # Guía estructurada de prompting para desarrollo web
├── .gitignore                           # Exclusión de archivos de sistema y temporales
└── README.md                            # Documentación integral del proyecto
```

---

## 📜 Historial de Commits Iterativos y Explicación Detallada

Cada hito del proyecto fue desarrollado y confirmado de forma atómica:

### 1. `chore: inicializar repositorio y estructura base del proyecto web`
- **¿Qué se hizo?**: Se inicializó el repositorio Git local con la rama principal `main`, se vinculó al remoto de GitHub y se agregaron el archivo `.gitignore`, la estructura semántica de `index.html` y los estilos CSS base (`base.css`, `components.css`, `w3.css`).
- **Explicación**: Establece la base sólida del proyecto asegurando la compatibilidad de navegadores y un sistema visual limpio antes de escribir la lógica.

### 2. `feat: implementar servicios de persistencia en IndexedDB y LocalStorage con variables descriptivas`
- **¿Qué se hizo?**: Se crearon `servicioAlmacenamientoLocal.js` y `servicioIndexedDB.js` utilizando variables y métodos descriptivos en español (`guardarPresentacion`, `obtenerPresentacionPorId`, `obtenerIndiceDiapositivaActiva`).
- **Explicación**: Separa completamente la capa de persistencia de la vista, garantizando que el usuario nunca pierda su trabajo.

### 3. `feat: implementar gestor de estado centralizado y datos iniciales de diapositivas`
- **¿Qué se hizo?**: Se desarrollaron `diapositivasPorDefecto.js` y `gestorDeEstado.js`, implementando el patrón Observador, autoguardado con debounce y sincronización de datos con variables en español.
- **Explicación**: El gestor de estado actúa como la única fuente de verdad (Single Source of Truth), evitando acoplamientos innecesarios entre los componentes visuales.

### 4. `feat: implementar componentes visuales e interactivos de la interfaz de diapositivas`
- **¿Qué se hizo?**: Se crearon `notificacionToast.js`, `lienzoDiapositiva.js`, `barraHerramientas.js`, `barraLateral.js` y `navegacion.js` con nomenclatura en español.
- **Explicación**: Proporciona una experiencia de usuario interactiva y fluida: edición directa en el lienzo, selección de elemento activo (título o contenido), cambio de colores, fuentes y miniaturas dinámicas.

### 5. `feat: conectar punto de entrada principal y orquestación reactiva de la aplicación`
- **¿Qué se hizo?**: Se implementó `main.js` para instanciar los servicios, inyectar dependencias y coordinar la carga inicial del estado. Se validó visual e interactivamente mediante navegador.
- **Explicación**: Enlaza todas las piezas del rompecabezas en un flujo ordenado y libre de errores de ejecución.

### 6. `docs: agregar guia de prompting estructurado y documentacion completa en README`
- **¿Qué se hizo?**: Se creó `PROMPTING_GUIA.md` con el análisis y reestructuración de instrucciones para desarrollo web asistido por IA, y este archivo `README.md`.
- **Explicación**: Brinda claridad metodológica, facilitando el mantenimiento futuro y la replicación del flujo de trabajo en nuevos proyectos.

---

## 💻 Instrucciones de Ejecución Local

Dado que el proyecto utiliza **ES6 Modules**, debe servirse mediante un servidor HTTP local para evitar restricciones de CORS del navegador:

### Opción 1: Con Python
```bash
python -m http.server 8080
```
Luego abre tu navegador en: [http://localhost:8080](http://localhost:8080)

### Opción 2: Con Node.js / npx
```bash
npx serve .
```

### Opción 3: Con VS Code
Instala la extensión **Live Server** y haz clic en *"Go Live"* en la esquina inferior derecha.

---

## 🛠️ Cómo Sincronizar los Cambios con GitHub

Para enviar las ramas y commits al repositorio remoto:

```bash
git push -u origin main
```
