# 🧠 Guía Maestra de Prompting para Desarrollo Web Iterativo

Esta guía documenta la reestructuración y optimización de las instrucciones del usuario en un marco formal de **Ingeniería de Prompts (Prompt Engineering)** para la creación de aplicaciones web sencillas, robustas y mantenibles con asistencia de Inteligencia Artificial.

---

## 1. Análisis Comparativo: Prompt Original vs. Prompt Estructurado

### 🔴 Instrucción Original
> *"conectate con este github y realiza el proyecto iterativamente siguiendo un plan de implmentacion claro y consciso, los commits que sean simples en español y explicalos, al igual que las variables del codigo deben ser descriptivas y en español y quisiear agregar el prompting modifica mis instrucciones para que esten bien estructuradas mostrando un proceso de creacion de web sencilla de forma correcta"*

### 🔍 Diagnóstico Técnico
| Aspecto | Instrucción Original | Versión Optimizada (Framework CRISPE) |
| :--- | :--- | :--- |
| **Rol y Experiencia** | Implícito | Ingeniero Web Frontend Senior y Especialista en Arquitectura Limpia |
| **Contexto de Proyecto** | Solo enlace de GitHub | Especificación del stack (HTML5 semántico, Vanilla CSS / W3.CSS, ES Modules, IndexedDB) |
| **Nivel de Detalle** | Múltiples requerimientos en una sola frase | Estructurado en bloques: Contexto, Objetivo, Reglas de Código, Git y Fases |
| **Criterios de Aceptación** | "Que esté bien hecho" | Verificable con pruebas visuales, persistencia y código limpio |
| **Control de Git** | Commits simples | Commits atómicos siguiendo Conventional Commits en español y explicados |

---

## 2. Plantilla Maestra Reutilizable (Prompt Master)

Para iniciar proyectos web similares en el futuro, utiliza este formato:

```markdown
# PROMPT MAESTRO: CREACIÓN ITERATIVA DE APLICACIÓN WEB

## 1. ROL Y CONTEXTO
Actúa como un Desarrollador Web Senior y Arquitecto Frontend. Vamos a construir una aplicación web interactiva, moderna y ligera llamada "[NOMBRE DEL PROYECTO]".
- Stack: HTML5 semántico, Vanilla CSS moderno con diseño responsivo, Vanilla JavaScript (ES6 Modules).
- Sin frameworks pesados ni dependencias innecesarias (salvo CSS utilitario ligero como W3.CSS).
- Persistencia cliente: IndexedDB para datos estructurados y LocalStorage para preferencias/sesión.

## 2. OBJETIVO DEL PROYECTO
[Describir en 2 o 3 líneas qué hace la aplicación, qué problema resuelve y qué interacciones clave permite al usuario].

## 3. REGLAS ESTRICTAS DE CÓDIGO Y NOMENCLATURA
1. **Nombres de Variables y Funciones en Español**: Todas las variables, funciones, métodos y parámetros deben ser descriptivos, autoexplicativos y en idioma español (ej: `indiceDiapositivaActiva`, `guardarEnPersistencia`).
2. **Principio de Responsabilidad Única (SRP)**: Cada archivo debe tener una sola función bien delimitada (Almacenamiento, Estado, Componentes UI, Orquestación).
3. **Persistencia Reactiva**: Todo cambio relevante del usuario debe sincronizarse automáticamente en segundo plano (debounce).
4. **Diseño Visual de Primer Nivel**: Interfaz moderna, paleta de colores armónica, transiciones suaves y estados interactivos claros.

## 4. FLUJO DE TRABAJO GIT ITERATIVO
- Repositorio remoto: [URL_DEL_REPOSITORIO_GITHUB]
- Realiza el trabajo paso a paso dividiéndolo en hitos pequeños (commits atómicos).
- Los mensajes de commit deben ser simples, en español y seguir el estándar de conventional commits:
  - `chore: ...`
  - `feat: ...`
  - `docs: ...`
- Explica detalladamente cada commit realizado: qué cambios incluye, por qué se hicieron y cómo impactan al usuario.

## 5. FASES DE EJECUCIÓN OBLIGATORIAS
1. Fase 1: Plan de implementación y estructura base (HTML semántico + CSS tokens).
2. Fase 2: Servicios de persistencia (IndexedDB + LocalStorage).
3. Fase 3: Gestor de estado centralizado (Patrón Observador).
4. Fase 4: Componentes de interfaz independientes.
5. Fase 5: Conexión principal (main.js) y validación en navegador.
6. Fase 6: Documentación técnica (README.md y Guía de Prompting).
```

---

## 3. Desglose de Prompts por Fases (Metodología Iterativa)

Para proyectos donde desees guiar a la IA paso a paso, utiliza esta secuencia de prompts modulares:

### 📍 Fase 1: Arquitectura y Sistema Visual
```text
"Actúa como arquitecto web. Genera la estructura de carpetas (/css, /js, /js/components, /js/storage, /js/state, /js/data) e inicializa el index.html con estructura semántica (header, nav, main, aside, footer). Define en css/base.css los tokens de diseño (variables CSS para fuentes modernas como Outfit/Inter, paleta oscura elegante y elevaciones). No agregues lógica JS todavía. Presenta un commit: 'chore: inicializar repositorio y estructura base del proyecto web'."
```

### 📍 Fase 2: Servicios de Almacenamiento
```text
"Implementa la capa de persistencia en js/storage/ con dos módulos independientes:
1. servicioAlmacenamientoLocal.js: maneja claves de sesión y preferencias en LocalStorage con manejo seguro de JSON.
2. servicioIndexedDB.js: inicializa una base de datos IndexedDB con almacén de objetos y métodos asíncronos para guardar y recuperar registros por ID.
Requisitos: Todas las variables, nombres de funciones y parámetros deben ser descriptivos y en español. Crea el commit: 'feat: implementar servicios de persistencia en IndexedDB y LocalStorage con variables descriptivas'."
```

### 📍 Fase 3: Estado Centralizado
```text
"Implementa en js/state/gestorDeEstado.js un gestor de estado centralizado reactivo utilizando el patrón Observador (métodos suscribirse y notificarSuscriptores). Debe incluir:
- Autoguardado con debounce en IndexedDB para no saturar transacciones.
- Métodos para modificar propiedades de la diapositiva activa, añadir y eliminar elementos.
- Variables descriptivas en español. En js/data/diapositivasPorDefecto.js incluye el contenido inicial.
Genera el commit: 'feat: implementar gestor de estado centralizado y datos iniciales de diapositivas'."
```

### 📍 Fase 4: Componentes UI Modulares
```text
"Crea los componentes de interfaz en js/components/:
1. lienzoDiapositiva.js: renderiza el contenido editable en tiempo real.
2. barraHerramientas.js: cinta superior con selectores de color, tipografía y tamaño individual.
3. barraLateral.js: lista de miniaturas sincronizadas con la diapositiva activa.
4. navegacion.js: flechas anterior/siguiente, contador, atajos de teclado y barra de progreso.
5. notificacionToast.js: aviso temporal de confirmación.
Requisito: Ningún componente debe mutar directamente la base de datos; todos deben interactuar a través del gestor de estado. Todas las variables internas deben ser descriptivas en español. Crea el commit: 'feat: implementar componentes visuales e interactivos de la interfaz de diapositivas'."
```

### 📍 Fase 5: Orquestación y Pruebas
```text
"En js/main.js, instancia los servicios, inyecta las dependencias al gestor de estado e inicializa los componentes UI al dispararse DOMContentLoaded. Ejecuta un servidor local y realiza pruebas de usuario en navegador para validar que la edición en vivo, el cambio de formato y el guardado automático funcionan sin errores en consola. Crea el commit: 'feat: conectar punto de entrada principal y orquestación reactiva de la aplicación'."
```

---

## 4. Claves del Éxito en Prompting para Proyectos Web

1. **Claridad sobre Suposiciones**: Si necesitas un repositorio o una dependencia, especifica la URL y el alcance desde el inicio.
2. **Restricción Lingüística Precisa**: Indicar expresamente `"todas las variables deben ser descriptivas y en español"` previene mezclas confusas de Spanglish en el código fuente.
3. **Modularidad Estricta**: Dividir la web en componentes desacoplados facilita la depuración y permite iterar sin romper funcionalidades existentes.
4. **Verificación en Vivo**: Siempre exigir validación mediante subagente de navegador o servidor local para confirmar que la aplicación no solo compila sino que funciona visual e interactivamente.
