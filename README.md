# Aplicación Web de Presentaciones y Diapositivas (React + TypeScript)

Aplicación web moderna e interactiva para la creación, edición, proyección e importación/exportación de diapositivas en vivo, construida con **React 19**, **TypeScript**, **Tailwind CSS**, **Vitest (TDD)** y **Clean Architecture (Puertos y Adaptadores)**.

---

## 🏛️ Arquitectura del Sistema

El proyecto sigue rigurosamente los principios de **Inversión de Dependencias (DIP)** y separación de responsabilidades:

```
src/
├── models/              # Capa Model (Dominio puro): Contratos de datos (Slide, Project)
│   └── ports/           # Interfaces de Inversión de Dependencias (IProjectRepository, IExporter)
├── infrastructure/      # Capa Infrastructure: Adaptadores concretos
│   ├── IndexedDbProjectRepository.ts    # Persistencia local asíncrona
│   ├── HttpMicroserviceRepository.ts    # Conexión futura a microservicios en la nube
│   ├── PdfPresentationExporter.ts       # Exportador directo a PDF vectorial 16:9
│   ├── HtmlPresentationExporter.ts      # Exportador HTML standalone offline + PDF Print
│   └── JsonProjectExporter.ts          # Exportador de respaldo estructurado JSON
├── controllers/         # Capa Controller: Lógica de negocio y estado reactivo (Hooks)
│   ├── useSlideController.ts            # Navegación, mutación, layouts y ordenamiento
│   └── useProjectController.ts          # Persistencia, importación JSON y metadatos
├── views/               # Capa View: Componentes visuales y layouts
│   ├── App.tsx                          # Orquestador principal de vistas
│   ├── containers/
│   │   ├── EditorView.tsx               # Interfaz de edición, sidebar, importación y notas
│   │   └── PresentationView.tsx         # Proyección inmersiva a pantalla completa
│   └── components/
│       ├── SlideRenderer.tsx            # Despachador polimórfico de layouts
│       ├── HeaderFooter.tsx             # Envoltorio gráfico con numeración y metadatos
│       ├── FormattingToolbar.tsx        # Barra flotante de tipografía (fuente, tamaño, B, I, alineación)
│       ├── InteractiveCanvasImage.tsx   # Imagen interactiva con drag, resize y subida local
│       ├── LayoutTextOnly.tsx           # Layout 1: Enfoque tipográfico y narrativo
│       ├── LayoutImageOnly.tsx          # Layout 2: Impacto visual y pie de foto interactivo
│       └── LayoutTextAndImage.tsx       # Layout 3: Doble columna con imagen interactiva
├── utils/               # Utilidades de descarga cliente, tipografía y matemáticas de canvas
│   ├── fileDownloader.ts                # Disparador de descarga de blobs/archivos
│   ├── typographyStyles.ts              # Mapeo tipográfico reactivo a clases Tailwind
│   └── canvasMath.ts                    # Fórmulas de contención estricta al 100% del canvas
└── tests/               # Pruebas Unitarias automatizadas (TDD)
    ├── models.test.ts                   # Validación de entidades y factorías
    ├── canvasMath.test.ts               # Validación de matemáticas de contención 16:9
    ├── IndexedDbRepository.test.ts      # Persistencia CRUD en IndexedDB
    ├── useSlideController.test.ts       # Lógica del controlador de diapositivas
    ├── useProjectController.test.ts     # Importación y persistencia de proyectos
    └── exporters.test.ts                # Adaptadores de exportación HTML, PDF y JSON
```

---

## 🚀 Estado de Avance por Fases

| Fase | Entregable | Estado |
| :--- | :--- | :---: |
| **Fase 1: Setup y Modelos** | Configuración (Vite, React 19, TS, Tailwind CSS, Vitest) + Entidades de Dominio (`Slide`, `Project`) y contratos (`IProjectRepository`, `IExporter`). | ✅ **Completado** |
| **Fase 2: TDD + IndexedDB + Controllers** | Pruebas TDD + `IndexedDbProjectRepository` + `HttpMicroserviceRepository` + Hooks de estado (`useSlideController`, `useProjectController`). | ✅ **Completado** |
| **Fase 3: Componentes UI y Layouts** | `SlideRenderer`, `HeaderFooter`, 3 layouts (`TextOnly`, `ImageOnly`, `TextAndImage`), `EditorView`, `PresentationView` y notas privadas del orador. | ✅ **Completado** |
| **Fase 4: Exportación, Importación y PDF** | `PdfPresentationExporter`, `HtmlPresentationExporter`, `JsonProjectExporter`, importador JSON completo, impresión de todas las diapositivas y 21 pruebas TDD. | ✅ **Completado** |
| **Mejoras UX: Tipografía e Imágenes en Canvas** | Barra flotante de estilo de fuente (Sans/Serif/Mono), tamaño (sm..xl), negrita, cursiva y alineación. Carga de imágenes locales desde PC (Base64 offline) y manipulación interactiva (Drag & Resize) con contención estricta al 100% del canvas 16:9. | ✅ **Completado** |

---

## 🎨 Tipografía Personalizada y Manipulación de Imágenes en Canvas

1. **Barra Flotante de Formato Tipográfico**:
   - Selector de Familia Tipográfica: Moderna (`Sans`), Editorial (`Serif`) y Técnica (`Mono`).
   - Escala de Tamaños Proporcionales: `sm`, `md`, `lg`, `xl`.
   - Modificadores Rápidos: **Negrita** (`B`) y *Cursiva* (`I`).
   - Alineación de Texto: Izquierda, Centro y Derecha.
   - Aplica de forma reactiva al título, subtítulo y contenido de la diapositiva activa, persistiendo en IndexedDB y reflejándose en exportaciones HTML y PDF.

2. **Carga de Imágenes Locales (Offline-First)**:
   - Permite subir fotos directamente desde la computadora mediante selector de archivos y lectura con `FileReader` a Base64 Data URI.
   - La imagen queda almacenada directamente en IndexedDB, eliminando la dependencia de servidores externos de alojamiento o riesgos de enlaces rotos (CORS).
   - Incluye soporte alternativo para URLs externas en línea y botón de eliminación rápida.

3. **Manipulación Interactiva en Canvas (16:9)**:
   - **Arrastrar y Mover (Drag & Drop)** con Pointer Events reactivos.
   - **Redimensionamiento en Tiempo Real (Corner Handle)** desde el tirador de la esquina inferior derecha.
   - **Contención Matemática Estricta**: Mediante las funciones de cálculo `clampPosition` y `clampWidth`, la imagen nunca puede salirse de los márgenes del canvas ni desbordar la proporción 16:9.

---

## 🧪 Pruebas Unitarias (TDD)

El proyecto cuenta con **24 pruebas unitarias automatizadas** que cubren el 100% de la lógica de negocio, repositorios, controladores, exportadores y matemáticas de contención geométrica:

```bash
# Ejecutar todas las pruebas unitarias
npm test

# Modo observador (watch)
npm run test:watch
```

---

## 🛠️ Ejecución Local y Compilación

```bash
# Instalar dependencias
npm install

# Modo desarrollo
npm run dev

# Compilación para producción (TypeScript + Vite)
npm run build
```
