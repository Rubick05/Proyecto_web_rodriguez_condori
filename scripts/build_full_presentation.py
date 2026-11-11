import os
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.enum.text import PP_ALIGN
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE

def build_presentation():
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6]

    # Paleta cromática profesional
    COLOR_BG_DARK = RGBColor(15, 23, 42)         # Slate 900
    COLOR_BG_LIGHT = RGBColor(248, 250, 252)     # Slate 50
    COLOR_WHITE = RGBColor(255, 255, 255)
    COLOR_CARD_DARK = RGBColor(30, 41, 59)       # Slate 800
    COLOR_BORDER_DARK = RGBColor(51, 65, 85)     # Slate 700
    COLOR_TEXT_LIGHT = RGBColor(241, 245, 249)   # Slate 100
    COLOR_TEXT_MUTED_DARK = RGBColor(148, 163, 184) # Slate 400

    COLOR_PRIMARY = RGBColor(79, 70, 229)        # Indigo 600
    COLOR_PRIMARY_LIGHT = RGBColor(238, 242, 255)# Indigo 50
    COLOR_PRIMARY_BORDER = RGBColor(199, 210, 254)
    COLOR_EMERALD = RGBColor(5, 150, 105)        # Emerald 600
    COLOR_EMERALD_LIGHT = RGBColor(236, 253, 245)
    COLOR_AMBER = RGBColor(217, 119, 6)          # Amber 600
    COLOR_AMBER_LIGHT = RGBColor(254, 243, 199)
    COLOR_ROSE = RGBColor(225, 29, 72)           # Rose 600
    COLOR_ROSE_LIGHT = RGBColor(255, 228, 230)
    COLOR_SKY = RGBColor(2, 132, 199)            # Sky 600
    COLOR_SKY_LIGHT = RGBColor(224, 242, 254)

    COLOR_TEXT_DARK = RGBColor(15, 23, 42)
    COLOR_TEXT_MUTED = RGBColor(100, 116, 139)
    COLOR_BORDER_LIGHT = RGBColor(226, 232, 240)
    COLOR_CARD_BG = RGBColor(255, 255, 255)

    def set_bg(slide, color):
        fill = slide.background.fill
        fill.solid()
        fill.fore_color.rgb = color

    def add_header(slide, badge_text, title_text, dark=False, badge_color=COLOR_PRIMARY, badge_bg=COLOR_PRIMARY_LIGHT):
        # Badge
        badge = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(0.45), Inches(3.2), Inches(0.35))
        badge.fill.solid()
        badge.fill.fore_color.rgb = badge_bg if not dark else COLOR_CARD_DARK
        badge.line.color.rgb = badge_color
        badge.line.width = Pt(1)
        tf_b = badge.text_frame
        p_b = tf_b.paragraphs[0]
        p_b.text = badge_text.upper()
        p_b.font.size = Pt(9.5)
        p_b.font.bold = True
        p_b.font.color.rgb = badge_color if not dark else RGBColor(165, 180, 252)
        p_b.alignment = PP_ALIGN.CENTER

        # Título
        tb = slide.shapes.add_textbox(Inches(0.8), Inches(0.85), Inches(11.7), Inches(0.75))
        tf = tb.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = title_text
        p.font.size = Pt(22)
        p.font.bold = True
        p.font.color.rgb = COLOR_TEXT_DARK if not dark else COLOR_WHITE

    def add_card(slide, left, top, width, height, title, subtitle=None, bg_color=COLOR_CARD_BG, border_color=COLOR_BORDER_LIGHT, dark=False):
        card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(left), Inches(top), Inches(width), Inches(height))
        card.fill.solid()
        card.fill.fore_color.rgb = bg_color if not dark else COLOR_CARD_DARK
        card.line.color.rgb = border_color if not dark else COLOR_BORDER_DARK
        card.line.width = Pt(1.2)

        tf = card.text_frame
        tf.word_wrap = True
        tf.margin_left = Inches(0.25)
        tf.margin_right = Inches(0.25)
        tf.margin_top = Inches(0.22)
        tf.margin_bottom = Inches(0.22)

        p = tf.paragraphs[0]
        p.text = title
        p.font.size = Pt(14)
        p.font.bold = True
        p.font.color.rgb = COLOR_TEXT_DARK if not dark else COLOR_WHITE

        if subtitle:
            ps = tf.add_paragraph()
            ps.text = subtitle
            ps.font.size = Pt(10.5)
            ps.font.bold = True
            ps.font.color.rgb = COLOR_PRIMARY if not dark else RGBColor(129, 140, 248)
            ps.space_before = Pt(3)

        return tf

    # =========================================================
    # SLIDE 1: PORTADA EJECUTIVA
    # =========================================================
    s1 = prs.slides.add_slide(blank_layout)
    set_bg(s1, COLOR_BG_DARK)

    p_badge = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.0), Inches(1.2), Inches(5.2), Inches(0.42))
    p_badge.fill.solid()
    p_badge.fill.fore_color.rgb = COLOR_CARD_DARK
    p_badge.line.color.rgb = COLOR_PRIMARY
    p_badge.line.width = Pt(1.2)
    tf_pb = p_badge.text_frame
    p_b0 = tf_pb.paragraphs[0]
    p_b0.text = "PROYECTO WEB DE PRESENTACIONES • CLEAN ARCHITECTURE"
    p_b0.font.size = Pt(10)
    p_b0.font.bold = True
    p_b0.font.color.rgb = RGBColor(165, 180, 252)
    p_b0.alignment = PP_ALIGN.CENTER

    tb1 = s1.shapes.add_textbox(Inches(1.0), Inches(1.85), Inches(11.3), Inches(2.4))
    tf1 = tb1.text_frame
    tf1.word_wrap = True
    p_t1 = tf1.paragraphs[0]
    p_t1.text = "Motor Web Reactivo de Diapositivas"
    p_t1.font.size = Pt(38)
    p_t1.font.bold = True
    p_t1.font.color.rgb = COLOR_WHITE

    p_t2 = tf1.add_paragraph()
    p_t2.text = "Evolución por 4 Fases: Desde el Dominio Puro hasta el Visor Autónomo Offline"
    p_t2.font.size = Pt(18)
    p_t2.font.color.rgb = COLOR_TEXT_LIGHT
    p_t2.space_before = Pt(10)

    # 4 Highlights en la portada
    highlights = [
        ("Fase 1: Dominio", "Modelos agnósticos e Inversión de Dependencias (DIP)"),
        ("Fase 2: Persistencia", "IndexedDB asíncrono y Controladores con TDD"),
        ("Fase 3: UX/UI Dual", "Editor de autor, Proyector escénico y Notas del orador"),
        ("Fase 4: Portabilidad", "Visor embebido offline, PDF 16:9 e Importador JSON")
    ]
    for idx, (h_title, h_desc) in enumerate(highlights):
        c = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.0 + idx * 2.85), Inches(4.5), Inches(2.65), Inches(1.7))
        c.fill.solid()
        c.fill.fore_color.rgb = COLOR_CARD_DARK
        c.line.color.rgb = COLOR_BORDER_DARK
        tf_c = c.text_frame
        tf_c.word_wrap = True
        tf_c.margin_top = Inches(0.2)
        p_ch = tf_c.paragraphs[0]
        p_ch.text = h_title
        p_ch.font.size = Pt(13)
        p_ch.font.bold = True
        p_ch.font.color.rgb = COLOR_WHITE
        p_cd = tf_c.add_paragraph()
        p_cd.text = h_desc
        p_cd.font.size = Pt(10.5)
        p_cd.font.color.rgb = COLOR_TEXT_MUTED_DARK
        p_cd.space_before = Pt(6)

    tb_ft = s1.shapes.add_textbox(Inches(1.0), Inches(6.5), Inches(11.3), Inches(0.5))
    p_ft = tb_ft.text_frame.paragraphs[0]
    p_ft.text = "Stack: React 19 • TypeScript 5.8 • Tailwind CSS • Vitest TDD • jsPDF • IndexedDB Nativo"
    p_ft.font.size = Pt(11)
    p_ft.font.color.rgb = COLOR_TEXT_MUTED_DARK

    # =========================================================
    # SLIDE 2: AGENDA DE LA PRESENTACIÓN
    # =========================================================
    s2 = prs.slides.add_slide(blank_layout)
    set_bg(s2, COLOR_BG_LIGHT)
    add_header(s2, "Estructura de la Exposición", "Agenda Temática del Análisis de Ingeniería")

    agenda_items = [
        ("01", "Desafío y Visión de Ingeniería", "Limitaciones de las aplicaciones web convencionales y la propuesta arquitectónica."),
        ("02", "Arquitectura Limpia & Principios", "Inversión de dependencias, desacoplamiento hexagonal y patrones aplicados."),
        ("03", "Fase 1: Dominio Puro y Contratos", "Modelos agnósticos 'Slide' y 'Project', factorías y puertos de abstracción."),
        ("04", "Fase 2: Persistencia & TDD", "IndexedDB ilimitado, hooks inmutables y el ciclo Red-Green-Refactor."),
        ("05", "Fase 3: UX/UI y Experiencia Dual", "Editor de autor, modo presentación escénica, notas del orador y 3 layouts."),
        ("06", "Fase 4: Exportación & Interoperabilidad", "Visor HTML offline autónomo, PDF vectorial 16:9, print multi-página y carga JSON."),
        ("07", "Garantía de Calidad y Métricas", "21 pruebas unitarias automáticas al 100%, 0 vulnerabilidades y código limpio."),
        ("08", "Conclusiones y Factores Distintivos", "Por qué este proyecto sobresale en modularidad, resiliencia y autonomía.")
    ]

    for idx, (num, ag_t, ag_d) in enumerate(agenda_items):
        row = idx // 2
        col = idx % 2
        left = 0.8 + col * 5.9
        top = 1.7 + row * 1.25

        c = s2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(left), Inches(top), Inches(5.6), Inches(1.1))
        c.fill.solid()
        c.fill.fore_color.rgb = COLOR_WHITE
        c.line.color.rgb = COLOR_BORDER_LIGHT
        c.line.width = Pt(1)

        tf = c.text_frame
        tf.word_wrap = True
        tf.margin_left = Inches(0.2)
        tf.margin_top = Inches(0.15)

        p = tf.paragraphs[0]
        p.text = f"{num}. {ag_t}"
        p.font.size = Pt(12.5)
        p.font.bold = True
        p.font.color.rgb = COLOR_TEXT_DARK

        p2 = tf.add_paragraph()
        p2.text = ag_d
        p2.font.size = Pt(10)
        p2.font.color.rgb = COLOR_TEXT_MUTED
        p2.space_before = Pt(3)

    # =========================================================
    # SLIDE 3: EL DESAFÍO DE INGENIERÍA
    # =========================================================
    s3 = prs.slides.add_slide(blank_layout)
    set_bg(s3, COLOR_BG_LIGHT)
    add_header(s3, "Diagnóstico y Justificación", "El Desafío de Ingeniería en Aplicaciones de Diapositivas")

    tf_d1 = add_card(s3, 0.8, 1.7, 5.7, 5.1, "Problemas de las Soluciones Tradicionales", "Puntos de dolor identificados")
    pains = [
        "Dependencia Forzosa de la Nube: Si el servidor falla o no hay conexión, el usuario no puede editar ni proyectar su material.",
        "Límite de LocalStorage (5 MB): Insuficiente para presentaciones modernas con fotografías, diagramas de alta resolución y múltiples diapositivas.",
        "Impresión Rota del Navegador: Al presionar 'Imprimir' o 'Guardar como PDF', solo se imprime la diapositiva en pantalla, ignorando el resto.",
        "Bloqueo del Ecosistema: Las presentaciones quedan 'atrapadas' dentro de la app web y no pueden abrirse en equipos sin Node.js instalado.",
        "Código Acoplado: Componentes visuales mezclados con llamadas directas a base de datos, dificultando pruebas automatizadas."
    ]
    for p in pains:
        pi = tf_d1.add_paragraph()
        pi.text = "✖ " + p
        pi.font.size = Pt(11)
        pi.font.color.rgb = COLOR_ROSE
        pi.space_before = Pt(8)

    tf_d2 = add_card(s3, 6.8, 1.7, 5.7, 5.1, "Nuestra Respuesta de Arquitectura", "Principios de diseño implementados")
    solutions = [
        "Offline-First Nativo: La aplicación opera con autonomía total en el navegador mediante IndexedDB sin depender de APIs de pago.",
        "Persistencia Asíncrona Escalable: Almacenamiento local de decenas de megabytes sin cuellos de botella de rendimiento.",
        "Impresión Multi-página Fidedigna: Contenedor DOM dual que genera un documento PDF completo de 1 página por diapositiva (1 a N).",
        "Visor Embebido Autónomo: Exportación a un archivo .html autosuficiente que incluye su propio motor de presentación sin React.",
        "Clean Architecture & TDD: Lógica 100% aislada de la UI, con 21 pruebas unitarias que blindan el comportamiento antes de la interfaz."
    ]
    for p in solutions:
        pi = tf_d2.add_paragraph()
        pi.text = "✓ " + p
        pi.font.size = Pt(11)
        pi.font.color.rgb = COLOR_EMERALD
        pi.font.bold = True
        pi.space_before = Pt(8)

    # =========================================================
    # SLIDE 4: ARQUITECTURA LIMPIA Y PRINCIPIOS
    # =========================================================
    s4 = prs.slides.add_slide(blank_layout)
    set_bg(s4, COLOR_BG_LIGHT)
    add_header(s4, "Marco Arquitectónico", "Clean Architecture: Desacoplamiento Hexagonal")

    arch_layers = [
        ("Capa Dominio", "src/models/", "Slide.ts, Project.ts", "Entidades puras y reglas de negocio. No tienen ninguna dependencia de librerías visuales, React ni bases de datos.", COLOR_PRIMARY, 0.8),
        ("Capa Puertos", "src/models/ports/", "IProjectRepository, IExporter", "Interfaces de Inversión de Dependencias (DIP). Fijan los contratos para guardar o exportar sin conocer la tecnología.", COLOR_SKY, 3.8),
        ("Capa Controllers", "src/controllers/", "useSlideController, useProjectController", "Gestión de estado reactivo, inmutabilidad de arrays, validaciones de frontera y control de ciclo de vida.", COLOR_AMBER, 6.8),
        ("Capa Infrastructure & Views", "src/infrastructure/ & src/views/", "IndexedDB, Exporters, React UI", "Adaptadores concretos intercambiables: almacenamiento en navegador, generador PDF, HTML offline y layouts.", COLOR_EMERALD, 9.8)
    ]

    for title, path, files, desc, col, left in arch_layers:
        tf_a = add_card(s4, left, 1.7, 2.7, 5.1, title, path)
        p_f = tf_a.add_paragraph()
        p_f.text = files
        p_f.font.size = Pt(10)
        p_f.font.bold = True
        p_f.font.color.rgb = col
        p_f.space_before = Pt(4)

        p_d = tf_a.add_paragraph()
        p_d.text = desc
        p_d.font.size = Pt(10.5)
        p_d.font.color.rgb = COLOR_TEXT_MUTED
        p_d.space_before = Pt(10)

    # =========================================================
    # SLIDE 5: FASE 1 - DOMINIO Y PUERTOS
    # =========================================================
    s5 = prs.slides.add_slide(blank_layout)
    set_bg(s5, COLOR_BG_LIGHT)
    add_header(s5, "Fase 1: Setup & Dominio", "Modelado de Dominio Puro y Contratos de Inversión (DIP)")

    tf_s5_1 = add_card(s5, 0.8, 1.7, 5.7, 5.1, "Entidades de Dominio e Inmutabilidad", "Slide.ts & Project.ts")
    pts_s5_1 = [
        "Entidad 'Slide': Contrato nuclear que define id (UUID), título, contenido, imageUrl, imageCaption, notes (apuntes privados) y order secuencial.",
        "Tipos de Layout Tipados: 'text-only' (narrativo), 'image-only' (visual) y 'text-and-image' (columna dividida).",
        "Entidad Raíz 'Project': Agregado que encapsula title, author, description y la colección inmutable slides: Slide[].",
        "Factorías Puras: 'createDefaultSlide()' y 'createDefaultProject()' que garantizan inicializaciones con timestamps ISO válidos y estructura homogénea."
    ]
    for p in pts_s5_1:
        pi = tf_s5_1.add_paragraph()
        pi.text = "• " + p
        pi.font.size = Pt(11)
        pi.font.color.rgb = COLOR_TEXT_MUTED
        pi.space_before = Pt(8)

    tf_s5_2 = add_card(s5, 6.8, 1.7, 5.7, 5.1, "Puertos e Inversión de Dependencias (DIP)", "IProjectRepository.ts & IExporter.ts")
    pts_s5_2 = [
        "IProjectRepository: Declara save(project), getById(id), getAll() y delete(id) con Promesas asíncronas.",
        "IExporter: Define formatName, extension y el método export(project): Promise<ExportResult>.",
        "Principio de Abstracción: La capa de presentación solo interactúa con los puertos, permitiendo cambiar el motor de almacenamiento sin tocar un solo botón de la interfaz.",
        "Validación con Pruebas: 2 pruebas unitarias en 'models.test.ts' verificaron la integridad de factorías antes de continuar."
    ]
    for p in pts_s5_2:
        pi = tf_s5_2.add_paragraph()
        pi.text = "• " + p
        pi.font.size = Pt(11)
        pi.font.color.rgb = COLOR_TEXT_MUTED
        pi.space_before = Pt(8)

    # =========================================================
    # SLIDE 6: FASE 2 - PERSISTENCIA INDEXEDDB
    # =========================================================
    s6 = prs.slides.add_slide(blank_layout)
    set_bg(s6, COLOR_BG_LIGHT)
    add_header(s6, "Fase 2: Almacenamiento", "Persistencia Asíncrona en IndexedDB Nativo")

    tf_s6_l = add_card(s6, 0.8, 1.7, 5.7, 5.1, "IndexedDbProjectRepository.ts", "Adaptador Concreto de Persistencia")
    pts_s6_l = [
        "Base de Datos 'presentation_app_db': Conexión nativa mediante indexedDB.open() con versión de esquema controlada.",
        "Almacén de Objetos 'projects': Configurado con clave primaria 'id' para lecturas y escrituras atómicas en tiempo constante O(1).",
        "Operaciones No Bloqueantes: Transacciones 'readwrite' envueltas en Promesas nativas que previenen el congelamiento de la interfaz de usuario.",
        "Resiliencia Offline Real: Todo el trabajo se conserva íntegro en disco local aunque se refresque la página o se cierre el navegador."
    ]
    for p in pts_s6_l:
        pi = tf_s6_l.add_paragraph()
        pi.text = "• " + p
        pi.font.size = Pt(11)
        pi.font.color.rgb = COLOR_TEXT_MUTED
        pi.space_before = Pt(8)

    tf_s6_r = add_card(s6, 6.8, 1.7, 5.7, 5.1, "Comparativa Técnica: IndexedDB vs LocalStorage", "Por qué fue decisivo para el proyecto")
    comp = [
        ("Capacidad de Almacenamiento", "LocalStorage: ~5 MB máximo", "IndexedDB: Cientos de MBs / Gigabytes según el disco."),
        ("Tipo de Operación", "LocalStorage: Síncrona (bloquea el hilo principal)", "IndexedDB: Totalmente asíncrona (fluidez a 60 FPS)."),
        ("Estructura de Datos", "LocalStorage: Solo cadenas de texto planas", "IndexedDB: Objetos JSON nativos, Blobs y arrays complejos."),
        ("Escalabilidad", "LocalStorage: Se degrada con imágenes en base64", "IndexedDB: Soporta presentaciones ricas con fotos de alta resolución.")
    ]
    for metric, bad, good in comp:
        pi = tf_s6_r.add_paragraph()
        pi.text = f"{metric}:"
        pi.font.size = Pt(11)
        pi.font.bold = True
        pi.font.color.rgb = COLOR_TEXT_DARK
        pi.space_before = Pt(6)

        pi_b = tf_s6_r.add_paragraph()
        pi_b.text = f"  ✗ {bad}"
        pi_b.font.size = Pt(10)
        pi_b.font.color.rgb = COLOR_ROSE

        pi_g = tf_s6_r.add_paragraph()
        pi_g.text = f"  ✓ {good}"
        pi_g.font.size = Pt(10)
        pi_g.font.color.rgb = COLOR_EMERALD

    # =========================================================
    # SLIDE 7: FASE 2 - CONTROLADORES REACTIVOS & TDD
    # =========================================================
    s7 = prs.slides.add_slide(blank_layout)
    set_bg(s7, COLOR_BG_LIGHT)
    add_header(s7, "Fase 2: Lógica de Negocio", "Controladores Reactivos Inmutables y Metodología TDD")

    tf_s7_1 = add_card(s7, 0.8, 1.7, 5.7, 5.1, "useSlideController.ts", "Lógica de Diapositivas e Inmutabilidad")
    s7_pts1 = [
        "Navegación Protegida: 'goToSlide(idx)', 'nextSlide()' y 'prevSlide()' con validación de fronteras [0, slides.length - 1].",
        "Regla de Negocio Crítica: 'deleteSlide()' impide borrar si solo queda una diapositiva (length <= 1), garantizando que nunca quede un estado vacío inválido.",
        "Reordenamiento Eficiente: 'reorderSlides(from, to)' clona el arreglo, reposiciona con splice y recalcula 'order' secuencialmente.",
        "Mutación Reactiva: 'updateActiveSlide()' genera un nuevo objeto conservando la inmutabilidad y actualiza el timestamp 'updatedAt'."
    ]
    for p in s7_pts1:
        pi = tf_s7_1.add_paragraph()
        pi.text = "• " + p
        pi.font.size = Pt(11)
        pi.font.color.rgb = COLOR_TEXT_MUTED
        pi.space_before = Pt(8)

    tf_s7_2 = add_card(s7, 6.8, 1.7, 5.7, 5.1, "useProjectController.ts & TDD", "Orquestador de Persistencia")
    s7_pts2 = [
        "Inyección de Dependencias: Acepta cualquier implementación de 'IProjectRepository' (por defecto 'IndexedDbProjectRepository').",
        "Carga Inicial Automática: Lee proyectos guardados al montar; si no existen, inicializa y persiste un proyecto semilla.",
        "Banderas Reactivas de Estado: Expone 'isLoading', 'isSaving' y 'error' para alimentar spinners y notificaciones.",
        "Desarrollo Guiado por Pruebas (TDD): 11 pruebas unitarias (5 de repositorio y 6 de controlador) blindaron la lógica antes de construir las vistas."
    ]
    for p in s7_pts2:
        pi = tf_s7_2.add_paragraph()
        pi.text = "• " + p
        pi.font.size = Pt(11)
        pi.font.color.rgb = COLOR_TEXT_MUTED
        pi.space_before = Pt(8)

    # =========================================================
    # SLIDE 8: FASE 3 - UX/UI Y EXPERIENCIA DUAL
    # =========================================================
    s8 = prs.slides.add_slide(blank_layout)
    set_bg(s8, COLOR_BG_LIGHT)
    add_header(s8, "Fase 3: Interfaz de Usuario", "Experiencia Dual: Editor de Autor vs Modo Proyector Escénico")

    tf_s8_l = add_card(s8, 0.8, 1.7, 5.7, 5.1, "Modo Edición: EditorView.tsx", "Ambiente de creación en tiempo real")
    s8_l_pts = [
        "Barra de Herramientas Superior: Input en vivo para título, selector dinámico de layout y botones de acción rápida.",
        "Sidebar Lateral de Miniaturas: Lista reactiva con número correlativo, tipo de layout y controles al pasar el cursor (subir, bajar, eliminar).",
        "Canvas 16:9 Central: Renderizado fidedigno del aspecto final de la diapositiva con edición tipográfica directa.",
        "Notas Privadas del Orador: Botón flotante que despliega un cajón ('drawer') con textarea para apuntes personales exclusivos del expositor."
    ]
    for p in s8_l_pts:
        pi = tf_s8_l.add_paragraph()
        pi.text = "• " + p
        pi.font.size = Pt(11)
        pi.font.color.rgb = COLOR_TEXT_MUTED
        pi.space_before = Pt(8)

    tf_s8_r = add_card(s8, 6.8, 1.7, 5.7, 5.1, "Modo Presentación: PresentationView.tsx", "Proyección escénica inmersiva")
    s8_r_pts = [
        "Fondo Inmersivo Oscuro: Fondo 'bg-slate-950' que maximiza el contraste y la concentración del público.",
        "Atajos de Teclado Globales: Flecha Derecha/Espacio (Avanzar), Flecha Izquierda (Retroceder) y Escape (Salir).",
        "Pantalla Completa Nativa: Botón conectado a 'document.documentElement.requestFullscreen()'.",
        "Barra de Progreso Reactiva: Indicador visual inferior calculado con '((currentIndex + 1) / total) * 100'.",
        "HUD Flotante Semitransparente: Barra de control con desenfoque de fondo ('backdrop-blur') sensible al puntero."
    ]
    for p in s8_r_pts:
        pi = tf_s8_r.add_paragraph()
        pi.text = "• " + p
        pi.font.size = Pt(11)
        pi.font.color.rgb = COLOR_TEXT_MUTED
        pi.space_before = Pt(8)

    # =========================================================
    # SLIDE 9: FASE 3 - LAYOUTS Y PATRÓN STRATEGY
    # =========================================================
    s9 = prs.slides.add_slide(blank_layout)
    set_bg(s9, COLOR_BG_LIGHT)
    add_header(s9, "Fase 3: Componentes Visuales", "SlideRenderer Polimórfico y los 3 Layouts Especializados")

    layouts_info = [
        ("Layout 1: TextOnly", "LayoutTextOnly.tsx", "Enfoque Narrativo & Tipografía", "Ideal para ideas clave, citas o conceptos teóricos. Título de escala responsiva (text-3xl a 5xl) y cuerpo multilínea.", COLOR_PRIMARY, 0.8),
        ("Layout 2: ImageOnly", "LayoutImageOnly.tsx", "Impacto Visual & Diagramas", "Diseñado para gráficos de arquitectura, esquemas o fotografías. Marco responsivo con object-cover y pie descriptivo centrado.", COLOR_SKY, 4.8),
        ("Layout 3: TextAndImage", "LayoutTextAndImage.tsx", "Doble Columna Equilibrada", "Grid adaptativo (50% texto / 50% imagen). Colapsa verticalmente en pantallas móviles y se equilibra en escritorios.", COLOR_EMERALD, 8.8)
    ]

    for title, file, subtitle, desc, col, left in layouts_info:
        tf_lay = add_card(s9, left, 1.7, 3.7, 3.2, title, subtitle)
        p_fl = tf_lay.add_paragraph()
        p_fl.text = file
        p_fl.font.size = Pt(10)
        p_fl.font.bold = True
        p_fl.font.color.rgb = col
        p_fl.space_before = Pt(3)

        p_dc = tf_lay.add_paragraph()
        p_dc.text = desc
        p_dc.font.size = Pt(10.5)
        p_dc.font.color.rgb = COLOR_TEXT_MUTED
        p_dc.space_before = Pt(8)

    # Envoltorio común HeaderFooter
    tf_hf = add_card(s9, 0.8, 5.15, 11.7, 1.65, "Marco Corporativo Unificado: HeaderFooter.tsx", "Consistencia visual en todas las vistas")
    p_hf = tf_hf.add_paragraph()
    p_hf.text = "Encapsula cada diapositiva con un encabezado institucional (título del proyecto, autor y pulso indicador animado) y un pie de página estandarizado con fecha localizada en español ('es-ES') y contador en tipografía monoespaciada 'X / Y'. Garantiza que todas las diapositivas compartan identidad corporativa."
    p_hf.font.size = Pt(10.5)
    p_hf.font.color.rgb = COLOR_TEXT_MUTED
    p_hf.space_before = Pt(4)

    # =========================================================
    # SLIDE 10: FASE 4 - VISOR EMBEBIDO AUTÓNOMO
    # =========================================================
    s10 = prs.slides.add_slide(blank_layout)
    set_bg(s10, COLOR_BG_LIGHT)
    add_header(s10, "Fase 4: Innovación de Portabilidad", "Visor Embebido Autónomo: Presentaciones HTML Offline")

    tf_s10_1 = add_card(s10, 0.8, 1.7, 5.7, 5.1, "¿Qué es el Visor Embebido?", "HtmlPresentationExporter.ts")
    s10_pts1 = [
        "Un Solo Archivo .html Autosuficiente: Toda la presentación, estilos y motor de interacción viajan dentro de un único archivo plano.",
        "Cero Dependencias del Runtime: No requiere Node.js, React, npm ni conexión a internet para funcionar. Se abre con doble clic en cualquier explorador.",
        "Sanitización Rigurosa contra XSS: Función 'escapeHtml()' que convierte caracteres como <, >, &, \" en entidades seguras, impidiendo inyecciones de código.",
        "Estilos 16:9 Nativos: Embebe CSS moderno con animaciones de transición, tema oscuro y contenedor con relación de aspecto panorámica."
    ]
    for p in s10_pts1:
        pi = tf_s10_1.add_paragraph()
        pi.text = "• " + p
        pi.font.size = Pt(11)
        pi.font.color.rgb = COLOR_TEXT_MUTED
        pi.space_before = Pt(8)

    tf_s10_2 = add_card(s10, 6.8, 1.7, 5.7, 5.1, "Mini-Motor JavaScript Vanilla Embebido", "Ejecución sin Frameworks")
    s10_pts2 = [
        "Script Autoejecutable (IIFE): Función aislada que controla el estado 'currentIndex' y aplica clases '.active' en las diapositivas.",
        "Navegación Completa por Teclado: Soporta Flecha Derecha, Flecha Izquierda, Barra Espaciadora y tecla 'F' para pantalla completa.",
        "Barra de Progreso y Contador en Vivo: Calcula y redibuja en el DOM el porcentaje de avance y el indicador de página actual.",
        "Botón de Guardado PDF Integrado: El archivo exportado contiene su propio botón 'Guardar PDF' que activa las reglas de impresión automáticamente."
    ]
    for p in s10_pts2:
        pi = tf_s10_2.add_paragraph()
        pi.text = "• " + p
        pi.font.size = Pt(11)
        pi.font.color.rgb = COLOR_TEXT_MUTED
        pi.space_before = Pt(8)

    # =========================================================
    # SLIDE 11: FASE 4 - EXPORTACIÓN PDF E IMPRESIÓN
    # =========================================================
    s11 = prs.slides.add_slide(blank_layout)
    set_bg(s11, COLOR_BG_LIGHT)
    add_header(s11, "Fase 4: Salida Documental", "Exportación Directa a PDF 16:9 y Motor de Impresión Multi-página")

    tf_s11_1 = add_card(s11, 0.8, 1.7, 5.7, 5.1, "Descarga Directa de PDF Vectorial", "PdfPresentationExporter.ts (jsPDF)")
    s11_pts1 = [
        "Formato Apaisado Matemático 16:9: Configurado exactamente a 297 mm x 167.06 mm.",
        "Renderizado Vectorial Nítido: Dibuja títulos, líneas divisorias, marcos de imagen y numeración 'X / Y' mediante coordenadas precisas.",
        "Cálculo Automático de Texto: Emplea 'doc.splitTextToSize()' para dividir párrafos largos respetando los márgenes de página.",
        "Descarga Inmediata: Genera un Blob nativo 'application/pdf' que se descarga automáticamente en el equipo del usuario sin pantallas intermedias."
    ]
    for p in s11_pts1:
        pi = tf_s11_1.add_paragraph()
        pi.text = "• " + p
        pi.font.size = Pt(11)
        pi.font.color.rgb = COLOR_TEXT_MUTED
        pi.space_before = Pt(8)

    tf_s11_2 = add_card(s11, 6.8, 1.7, 5.7, 5.1, "Solución al Problema de Impresión Parcial", "Reglas @media print y Árbol DOM Dual")
    s11_pts2 = [
        "El Fallo Original: En React solo se monta la diapositiva activa en el DOM; al imprimir, el navegador solo encontraba 1 página.",
        "La Solución de Contenedor Oculto: Se integró un contenedor con 'hidden print:block' que recorre 'slides.map()' y monta todas las diapositivas.",
        "Paginación Forzada: Cada diapositiva cuenta con 'page-break-after: always' y 'break-after: page' a tamaño completo 100vw x 100vh.",
        "Ocultamiento Limpio: Clases 'print:hidden' hacen desaparecer cabeceras, botones, notas y barras laterales durante la impresión."
    ]
    for p in s11_pts2:
        pi = tf_s11_2.add_paragraph()
        pi.text = "• " + p
        pi.font.size = Pt(11)
        pi.font.color.rgb = COLOR_TEXT_MUTED
        pi.space_before = Pt(8)

    # =========================================================
    # SLIDE 12: FASE 4 - RESPALDO Y CARGA JSON
    # =========================================================
    s12 = prs.slides.add_slide(blank_layout)
    set_bg(s12, COLOR_BG_LIGHT)
    add_header(s12, "Fase 4: Ciclo de Datos", "Respaldo y Restauración Bidireccional en Formato JSON")

    tf_s12_1 = add_card(s12, 0.8, 1.7, 5.7, 5.1, "1. Exportación de Respaldo", "JsonProjectExporter.ts")
    s12_pts1 = [
        "Serialización Estructurada: Convierte la entidad agregada 'Project' completa a formato JSON legible con 'JSON.stringify(project, null, 2)'.",
        "Preservación de Metadatos: Resguarda títulos, autor, layouts, orden secuencial de slides, URLs de imágenes, notas privadas y marcas de tiempo.",
        "Peso Ultraligero: Archivos de apenas unos kilobytes que pueden compartirse por correo, repositorios o sistemas de mensajería.",
        "Independencia de Base de Datos: El JSON es agnóstico del navegador y sirve como estándar universal de intercambio."
    ]
    for p in s12_pts1:
        pi = tf_s12_1.add_paragraph()
        pi.text = "• " + p
        pi.font.size = Pt(11)
        pi.font.color.rgb = COLOR_TEXT_MUTED
        pi.space_before = Pt(8)

    tf_s12_2 = add_card(s12, 6.8, 1.7, 5.7, 5.1, "2. Carga y Restauración al 100%", "importProjectFromJson() en useProjectController")
    s12_pts2 = [
        "Lectura Segura en Memoria Local: Uso de la API nativa 'FileReader' del navegador; el archivo nunca viaja a servidores externos.",
        "Validación Estricta de Esquema: Comprueba la existencia del array de diapositivas y rechaza archivos JSON corruptos o incompatibles.",
        "Normalización Automática: Asigna identificadores por defecto, timestamps actualizados y reindexa los órdenes numéricos.",
        "Persistencia Inmediata: Guarda el proyecto importado en IndexedDB y refresca reactivamente el estado de la aplicación en el slide 1."
    ]
    for p in s12_pts2:
        pi = tf_s12_2.add_paragraph()
        pi.text = "• " + p
        pi.font.size = Pt(11)
        pi.font.color.rgb = COLOR_TEXT_MUTED
        pi.space_before = Pt(8)

    # =========================================================
    # SLIDE 13: GARANTÍA DE CALIDAD Y TDD (21 TESTS)
    # =========================================================
    s13 = prs.slides.add_slide(blank_layout)
    set_bg(s13, COLOR_BG_LIGHT)
    add_header(s13, "Calidad de Software", "Suite Automatizada TDD con Vitest: 21 Pruebas Superadas (100%)")

    tf_s13_main = add_card(s13, 0.8, 1.7, 7.6, 5.1, "Desglose de Suites de Prueba por Capa Arquitectónica", "npm test")
    suites = [
        ("models.test.ts (2 pruebas)", "Valida factorías de dominio 'createDefaultSlide' y 'createDefaultProject' con timestamps válidos."),
        ("IndexedDbRepository.test.ts (5 pruebas)", "CRUD completo en base de datos IndexedDB simulada con 'fake-indexeddb' en entorno jsdom."),
        ("useSlideController.test.ts (6 pruebas)", "Navegación protegida, adición, ordenamiento, actualización reactiva y guarda anti-borrado."),
        ("useProjectController.test.ts (2 pruebas)", "Importación de proyectos desde JSON válido y rechazo controlado de archivos malformados."),
        ("exporters.test.ts (6 pruebas)", "Generación de HTML offline autónomo, Blob PDF con jsPDF, reglas print y sanitización anti-XSS.")
    ]
    for st, sd in suites:
        pi = tf_s13_main.add_paragraph()
        pi.text = "✓ " + st
        pi.font.size = Pt(11.5)
        pi.font.bold = True
        pi.font.color.rgb = COLOR_TEXT_DARK
        pi.space_before = Pt(6)

        pid = tf_s13_main.add_paragraph()
        pid.text = "   " + sd
        pid.font.size = Pt(10)
        pid.font.color.rgb = COLOR_TEXT_MUTED

    # Métricas clave
    tf_q1 = add_card(s13, 8.7, 1.7, 3.8, 2.4, "21 / 21 Tests", "100% Cobertura Exitosa", COLOR_EMERALD_LIGHT, COLOR_EMERALD)
    pq1 = tf_q1.add_paragraph()
    pq1.text = "Toda la lógica crítica fue construida mediante el ciclo Red-Green-Refactor, garantizando cero regresiones entre fases."
    pq1.font.size = Pt(10.5)
    pq1.font.color.rgb = COLOR_TEXT_DARK
    pq1.space_before = Pt(6)

    tf_q2 = add_card(s13, 8.7, 4.4, 3.8, 2.4, "Compilación Limpia", "TypeScript 5.8 + Vite", COLOR_PRIMARY_LIGHT, COLOR_PRIMARY)
    pq2 = tf_q2.add_paragraph()
    pq2.text = "Validado con 'tsc -b && vite build'. Tipado estricto, bundle de producción optimizado y 0 vulnerabilidades de seguridad reportadas."
    pq2.font.size = Pt(10.5)
    pq2.font.color.rgb = COLOR_TEXT_DARK
    pq2.space_before = Pt(6)

    # =========================================================
    # SLIDE 14: CUADRO COMPARATIVO
    # =========================================================
    s14 = prs.slides.add_slide(blank_layout)
    set_bg(s14, COLOR_BG_LIGHT)
    add_header(s14, "Evaluación Comparativa", "Nuestra Solución vs Alternativas Web Tradicionales")

    col_headers = [
        ("Criterio de Evaluación", 0.8, 3.2),
        ("Soluciones Web Comunes", 4.2, 4.3),
        ("Nuestra Implementación (Fases 1-4)", 8.7, 3.8)
    ]

    comp_rows = [
        ("Arquitectura y Código", "Código espagueti en componentes de UI", "Clean Architecture desacoplada con Puertos y Adaptadores"),
        ("Persistencia Local", "LocalStorage limitado a 5 MB o nula", "IndexedDB asíncrono con capacidad ilimitada"),
        ("Garantía de Calidad", "Pruebas manuales propensas a errores", "21 pruebas unitarias automáticas con TDD en Vitest"),
        ("Portabilidad de Salida", "Requiere servidor web para verse", "Visor HTML autónomo con mini-motor JavaScript propio"),
        ("Generación de PDF", "Solo imprime la diapositiva en pantalla", "PDF 16:9 vectorial directo + impresión multi-página"),
        ("Ciclo de Datos", "Sin opción de respaldo estructurado", "Exportación e importación completa bidireccional en JSON")
    ]

    for idx, (crit, bad, good) in enumerate(comp_rows):
        top_pos = 1.7 + idx * 0.85
        card_r = s14.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(top_pos), Inches(11.7), Inches(0.75))
        card_r.fill.solid()
        card_r.fill.fore_color.rgb = COLOR_WHITE
        card_r.line.color.rgb = COLOR_BORDER_LIGHT
        card_r.line.width = Pt(1)

        tfr = card_r.text_frame
        tfr.word_wrap = True
        tfr.margin_left = Inches(0.2)
        tfr.margin_top = Inches(0.12)

        pr = tfr.paragraphs[0]
        pr.text = crit
        pr.font.size = Pt(11)
        pr.font.bold = True
        pr.font.color.rgb = COLOR_TEXT_DARK

        pr2 = tfr.add_paragraph()
        pr2.text = f"  • Tradicional: {bad}   |   • Nuestra Solución: {good}"
        pr2.font.size = Pt(9.5)
        pr2.font.color.rgb = COLOR_PRIMARY
        pr2.space_before = Pt(2)

    # =========================================================
    # SLIDE 15: CONCLUSIONES Y FACTORES DISTINTIVOS
    # =========================================================
    s15 = prs.slides.add_slide(blank_layout)
    set_bg(s15, COLOR_BG_DARK)
    add_header(s15, "Balance Final", "Conclusiones y Factores Distintivos del Proyecto", dark=True)

    final_pillars = [
        ("1. Autonomía y Portabilidad Total", "El proyecto rompe la atadura al runtime de desarrollo: gracias al Visor Embebido y la exportación a PDF, cualquier presentación puede ser visualizada, impresa o proyectada en cualquier dispositivo sin requerir Node.js ni internet."),
        ("2. Resiliencia de Persistencia con IndexedDB", "Superar el umbral de los 5 MB de LocalStorage permite construir presentaciones pesadas con fotografías y contenidos enriquecidos, garantizando persistencia inmediata y tolerancia ante cierres accidentales."),
        ("3. Modularidad y Escalabilidad Limpia", "El estricto cumplimiento de Clean Architecture asegura que nuevos adaptadores (como un backend en la nube o exportador a PowerPoint) puedan incorporarse en minutos sin modificar una sola línea de los componentes visuales."),
        ("4. Madurez de Ingeniería Respaldada por TDD", "Las 21 pruebas unitarias automáticas y la verificación con TypeScript estricto garantizan que el software es predecible, seguro contra inyecciones XSS y listo para operar en entornos reales de producción.")
    ]

    for idx, (head, desc) in enumerate(final_pillars):
        top_pos = 1.7 + idx * 1.3
        card = s15.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(top_pos), Inches(11.7), Inches(1.15))
        card.fill.solid()
        card.fill.fore_color.rgb = COLOR_CARD_DARK
        card.line.color.rgb = COLOR_BORDER_DARK
        card.line.width = Pt(1.2)

        tfc = card.text_frame
        tfc.word_wrap = True
        tfc.margin_left = Inches(0.3)
        tfc.margin_top = Inches(0.15)

        ph = tfc.paragraphs[0]
        ph.text = head
        ph.font.size = Pt(13)
        ph.font.bold = True
        ph.font.color.rgb = RGBColor(129, 140, 248)

        pd = tfc.add_paragraph()
        pd.text = desc
        pd.font.size = Pt(10.5)
        pd.font.color.rgb = COLOR_TEXT_LIGHT
        pd.space_before = Pt(4)

    # Guardar presentación maestra
    output_path = "Presentacion_Proyecto_Fases_Web.pptx"
    prs.save(output_path)
    print(f"[OK] Presentacion maestra generada exitosamente: {output_path} (15 diapositivas)")

if __name__ == "__main__":
    build_presentation()
