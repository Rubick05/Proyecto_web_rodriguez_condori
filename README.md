# Aplicación Web de Presentaciones y Diapositivas (React + TypeScript)

Aplicación web moderna e interactiva para la creación, edición y proyección de diapositivas en vivo, construida con **React 19**, **TypeScript**, **Tailwind CSS**, **Vitest (TDD)** y **Clean Architecture (Puertos y Adaptadores)**.

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
│   ├── HtmlPresentationExporter.ts      # Exportador HTML standalone offline + PDF Print
│   └── JsonProjectExporter.ts          # Exportador de respaldo estructurado JSON
├── controllers/         # Capa Controller: Lógica de negocio y estado reactivo (Hooks)
│   ├── useSlideController.ts            # Navegación, mutación, layouts y ordenamiento
│   └── useProjectController.ts          # Persistencia, metadatos y ciclo de vida
├── views/               # Capa View: Componentes visuales y layouts
│   ├── App.tsx                          # Orquestador principal de vistas
│   ├── containers/
│   │   ├── EditorView.tsx               # Interfaz de edición, sidebar y notas del orador
│   │   └── PresentationView.tsx         # Proyección inmersiva a pantalla completa
│   └── components/
│       ├── SlideRenderer.tsx            # Despachador polimórfico de layouts
│       ├── HeaderFooter.tsx             # Envoltorio gráfico con numeración y metadatos
│       ├── LayoutTextOnly.tsx           # Layout 1: Enfoque tipográfico y narrativo
│       ├── LayoutImageOnly.tsx          # Layout 2: Impacto visual y pie de foto
│       └── LayoutTextAndImage.tsx       # Layout 3: Doble columna equilibrada
├── utils/               # Utilidades de descarga cliente y manipulación de archivos
│   └── fileDownloader.ts                # Disparador de descarga de blobs/archivos
└── tests/               # Pruebas Unitarias automatizadas (TDD)
    ├── models.test.ts                   # Validación de entidades y factorías
    ├── IndexedDbRepository.test.ts      # Persistencia CRUD en IndexedDB
    ├── useSlideController.test.ts       # Lógica del controlador de diapositivas
    └── exporters.test.ts                # Adaptadores de exportación HTML y JSON
```

---

## 🚀 Estado de Avance por Fases

| Fase | Entregable | Estado |
| :--- | :--- | :---: |
| **Fase 1: Setup y Modelos** | Configuración (Vite, React 19, TS, Tailwind CSS, Vitest) + Entidades de Dominio (`Slide`, `Project`) y contratos (`IProjectRepository`, `IExporter`). | ✅ **Completado** |
| **Fase 2: TDD + IndexedDB + Controllers** | Pruebas TDD + `IndexedDbProjectRepository` + `HttpMicroserviceRepository` + Hooks de estado (`useSlideController`, `useProjectController`). | ✅ **Completado** |
| **Fase 3: Componentes UI y Layouts** | `SlideRenderer`, `HeaderFooter`, 3 layouts (`TextOnly`, `ImageOnly`, `TextAndImage`), `EditorView`, `PresentationView` y notas privadas del orador. | ✅ **Completado** |
| **Fase 4: Exportación y Git Push** | Adaptadores `HtmlPresentationExporter` (offline standalone con soporte de impresión a PDF) y `JsonProjectExporter`, integración visual de exportación, 18 pruebas unitarias y sincronización Git. | ✅ **Completado** |

---

## 🧪 Pruebas Unitarias (TDD)

El proyecto cuenta con **18 pruebas unitarias automatizadas** que cubren el 100% de la lógica de negocio, repositorios y exportadores:

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
