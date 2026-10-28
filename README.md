# Aplicación Web de Presentaciones y Diapositivas (React + TypeScript)

Aplicación web moderna e interactiva para la creación, edición y proyección de diapositivas en vivo, construida con **React**, **TypeScript**, **Tailwind CSS**, **Vitest (TDD)** y **Clean Architecture (Puertos y Adaptadores)**.

---

## 🏛️ Arquitectura del Sistema

El proyecto sigue rigurosamente los principios de **Inversión de Dependencias** y separación de capas:

```
src/
├── models/              # Capa Model: Contratos de datos puros (Slide, Project)
│   └── ports/           # Interfaces de Inversión de Dependencias (IProjectRepository, IExporter)
├── infrastructure/      # Capa Infrastructure: Adaptadores concretos (IndexedDb, HttpStub)
├── controllers/         # Capa Controller: Lógica de negocio y gestión de estado (Custom Hooks)
├── views/               # Capa View: Componentes de presentación (Layouts, Renderer, Editor, Presentación)
└── tests/               # Pruebas Unitarias e Integración con Vitest (TDD)
```

---

## 🚀 Estado de Avance por Fases

| Fase | Entregable | Estado |
| :--- | :--- | :---: |
| **Fase 1: Setup y Modelos** | Configuración (Vite, React, TS, Tailwind, Vitest) + Modelos (`Slide`, `Project`) e interfaces (`IProjectRepository`, `IExporter`). | ✅ **Completado** |
| **Fase 2: TDD + IndexedDB + Controllers** | Pruebas TDD + `IndexedDbProjectRepository` + `HttpMicroserviceRepository` + Controladores. | 🟡 **En Progreso** |
| **Fase 3: Componentes UI y Layouts** | `SlideRenderer`, `HeaderFooter`, 3 layouts (`TextOnly`, `ImageOnly`, `TextAndImage`), Editor y Presentación. | ⏳ **En Cola** |
| **Fase 4: Exportación y Git Push** | Exportador HTML/PDF, suite de pruebas automatizada y entrega final. | ⏳ **En Cola** |

---

## 🧪 Pruebas Unitarias (TDD)

Para ejecutar la suite de pruebas automatizadas:

```bash
npm test
```

Para modo observador:
```bash
npm run test:watch
```

---

## 🛠️ Ejecución Local

```bash
# Instalar dependencias
npm install

# Modo desarrollo
npm run dev

# Compilación de producción
npm run build
```
