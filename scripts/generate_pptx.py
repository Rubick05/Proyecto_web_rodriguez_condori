import os
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.enum.text import PP_ALIGN
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE

def create_deck():
    prs = Presentation()
    # Configurar formato panorámico 16:9 (13.333 x 7.5 pulgadas)
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6]

    # Paleta de colores
    COLOR_BG_DARK = RGBColor(15, 23, 42)       # Slate 900
    COLOR_BG_LIGHT = RGBColor(248, 250, 252)   # Slate 50
    COLOR_WHITE = RGBColor(255, 255, 255)
    COLOR_PRIMARY = RGBColor(79, 70, 229)      # Indigo 600
    COLOR_PRIMARY_LIGHT = RGBColor(238, 242, 255) # Indigo 50
    COLOR_EMERALD = RGBColor(5, 150, 105)      # Emerald 600
    COLOR_EMERALD_LIGHT = RGBColor(236, 253, 245) # Emerald 50
    COLOR_TEXT_DARK = RGBColor(15, 23, 42)
    COLOR_TEXT_MUTED = RGBColor(100, 116, 139) # Slate 500
    COLOR_TEXT_LIGHT = RGBColor(226, 232, 240)
    COLOR_BORDER = RGBColor(226, 232, 240)
    COLOR_CARD_BG = RGBColor(255, 255, 255)

    def set_slide_background(slide, color):
        background = slide.background
        fill = background.fill
        fill.solid()
        fill.fore_color.rgb = color

    def add_header(slide, category, title, dark=False):
        # Badge de Categoría
        badge_box = slide.shapes.add_shape(
            MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(0.5), Inches(2.8), Inches(0.35)
        )
        badge_box.fill.solid()
        badge_box.fill.fore_color.rgb = COLOR_PRIMARY_LIGHT if not dark else RGBColor(30, 41, 59)
        badge_box.line.color.rgb = COLOR_PRIMARY if not dark else COLOR_PRIMARY
        badge_box.line.width = Pt(1)
        tf_badge = badge_box.text_frame
        tf_badge.word_wrap = True
        p_badge = tf_badge.paragraphs[0]
        p_badge.text = category.upper()
        p_badge.font.size = Pt(10)
        p_badge.font.bold = True
        p_badge.font.color.rgb = COLOR_PRIMARY if not dark else RGBColor(129, 140, 248)
        p_badge.alignment = PP_ALIGN.CENTER

        # Título de la diapositiva
        title_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.9), Inches(11.7), Inches(0.8))
        tf_title = title_box.text_frame
        tf_title.word_wrap = True
        p_title = tf_title.paragraphs[0]
        p_title.text = title
        p_title.font.size = Pt(24)
        p_title.font.bold = True
        p_title.font.color.rgb = COLOR_TEXT_DARK if not dark else COLOR_WHITE

    def add_card(slide, left, top, width, height, title, subtitle=None, bg_color=COLOR_CARD_BG, border_color=COLOR_BORDER):
        card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(left), Inches(top), Inches(width), Inches(height))
        card.fill.solid()
        card.fill.fore_color.rgb = bg_color
        card.line.color.rgb = border_color
        card.line.width = Pt(1.2)

        tf = card.text_frame
        tf.word_wrap = True
        tf.margin_left = Inches(0.25)
        tf.margin_right = Inches(0.25)
        tf.margin_top = Inches(0.25)
        tf.margin_bottom = Inches(0.25)

        p = tf.paragraphs[0]
        p.text = title
        p.font.size = Pt(15)
        p.font.bold = True
        p.font.color.rgb = COLOR_TEXT_DARK

        if subtitle:
            p_sub = tf.add_paragraph()
            p_sub.text = subtitle
            p_sub.font.size = Pt(11)
            p_sub.font.color.rgb = COLOR_PRIMARY
            p_sub.font.bold = True
            p_sub.space_before = Pt(4)

        return tf

    # -------------------------------------------------------------
    # SLIDE 1: PORTADA
    # -------------------------------------------------------------
    slide1 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide1, COLOR_BG_DARK)

    # Decoración superior
    pill = slide1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.0), Inches(1.4), Inches(4.5), Inches(0.4))
    pill.fill.solid()
    pill.fill.fore_color.rgb = RGBColor(30, 41, 59)
    pill.line.color.rgb = COLOR_PRIMARY
    pill.line.width = Pt(1)
    tf_pill = pill.text_frame
    p_pill = tf_pill.paragraphs[0]
    p_pill.text = "ARQUITECTURA DE SOFTWARE & INGENIERÍA WEB"
    p_pill.font.size = Pt(10)
    p_pill.font.bold = True
    p_pill.font.color.rgb = RGBColor(129, 140, 248)
    p_pill.alignment = PP_ALIGN.CENTER

    # Título principal
    tb_title = slide1.shapes.add_textbox(Inches(1.0), Inches(2.0), Inches(11.3), Inches(2.2))
    tf_t = tb_title.text_frame
    tf_t.word_wrap = True
    p1 = tf_t.paragraphs[0]
    p1.text = "Plataforma Web de Diapositivas e Interoperabilidad"
    p1.font.size = Pt(36)
    p1.font.bold = True
    p1.font.color.rgb = COLOR_WHITE

    p2 = tf_t.add_paragraph()
    p2.text = "Diseño modular con React 19, TypeScript, Clean Architecture y TDD en 4 Fases"
    p2.font.size = Pt(18)
    p2.font.color.rgb = COLOR_TEXT_LIGHT
    p2.space_before = Pt(12)

    # Métricas y cualidades distintivas en la portada
    features = [
        ("Clean Architecture", "Puertos y Adaptadores"),
        ("TDD Integral", "21 Pruebas Automáticas"),
        ("Persistencia Local", "IndexedDB Asíncrono"),
        ("Visor Embebido", "HTML Offline Autónomo")
    ]
    for idx, (head, desc) in enumerate(features):
        box = slide1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.0 + idx * 2.85), Inches(4.6), Inches(2.65), Inches(1.5))
        box.fill.solid()
        box.fill.fore_color.rgb = RGBColor(30, 41, 59)
        box.line.color.rgb = RGBColor(51, 65, 85)
        tf_box = box.text_frame
        tf_box.word_wrap = True
        tf_box.margin_top = Inches(0.2)
        p_h = tf_box.paragraphs[0]
        p_h.text = head
        p_h.font.size = Pt(13)
        p_h.font.bold = True
        p_h.font.color.rgb = COLOR_WHITE
        p_d = tf_box.add_paragraph()
        p_d.text = desc
        p_d.font.size = Pt(11)
        p_d.font.color.rgb = RGBColor(148, 163, 184)
        p_d.space_before = Pt(6)

    # Pie de portada
    footer_box = slide1.shapes.add_textbox(Inches(1.0), Inches(6.5), Inches(11.3), Inches(0.5))
    tf_f = footer_box.text_frame
    p_f = tf_f.paragraphs[0]
    p_f.text = "Presentación Técnica de Arquitectura e Implementación por Fases"
    p_f.font.size = Pt(11)
    p_f.font.color.rgb = RGBColor(100, 116, 139)

    # -------------------------------------------------------------
    # SLIDE 2: VISIÓN DEL PROYECTO Y DESAFÍO
    # -------------------------------------------------------------
    slide2 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide2, COLOR_BG_LIGHT)
    add_header(slide2, "Contexto y Propósito", "Visión del Proyecto: Rendimiento, Autonomía y Calidad")

    tf_c1 = add_card(slide2, 0.8, 1.8, 5.7, 5.0, "El Problema en Apps de Presentación Web", "Limitaciones tradicionales")
    bullets_c1 = [
        "Acoplamiento excesivo al backend o nube para guardar cambios.",
        "Límite estricto de 5 MB de LocalStorage, impidiendo imágenes pesadas.",
        "Dependencia del runtime: sin servidor ni internet la presentación no abre.",
        "Impresión rota en el navegador (solo se imprime la diapositiva en pantalla).",
        "Código espagueti en React donde la UI manipula directamente el almacenamiento."
    ]
    for b in bullets_c1:
        p_item = tf_c1.add_paragraph()
        p_item.text = "• " + b
        p_item.font.size = Pt(12)
        p_item.font.color.rgb = COLOR_TEXT_MUTED
        p_item.space_before = Pt(10)

    tf_c2 = add_card(slide2, 6.8, 1.8, 5.7, 5.0, "La Solución Arquitectónica Desarrollada", "Principios de ingeniería aplicados")
    bullets_c2 = [
        "Clean Architecture: Capas de Dominio, Controladores, Vistas y Adaptadores.",
        "IndexedDB Nativo: Almacenamiento local asíncrono con capacidad ilimitada.",
        "Doble Modalidad UI: Editor en vivo con notas del orador + Proyector a pantalla completa.",
        "Visor Embebido Autónomo: Archivo HTML único con motor propio sin dependencias.",
        "TDD Estricto: 21 pruebas unitarias automáticas con Vitest y 100% de éxito."
    ]
    for b in bullets_c2:
        p_item = tf_c2.add_paragraph()
        p_item.text = "✓ " + b
        p_item.font.size = Pt(12)
        p_item.font.color.rgb = COLOR_TEXT_DARK
        p_item.font.bold = True
        p_item.space_before = Pt(10)

    # -------------------------------------------------------------
    # SLIDE 3: ARQUITECTURA LIMPIA (PUERTOS Y ADAPTADORES)
    # -------------------------------------------------------------
    slide3 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide3, COLOR_BG_LIGHT)
    add_header(slide3, "Patrón de Diseño", "Clean Architecture: Desacoplamiento e Inversión de Dependencias")

    layers = [
        ("1. Capa Dominio (Models)", "Entidades puras 'Slide' y 'Project'", "Agnósticas de frameworks UI o BD. Contienen la definición de layouts, notas y factorías de inicialización.", 0.8),
        ("2. Puertos (Interfaces)", "'IProjectRepository' e 'IExporter'", "Contratos de abstracción que dictan operaciones sin saber qué tecnología concreta se usará.", 3.8),
        ("3. Controladores (Hooks)", "'useSlideController' y 'useProjectController'", "Lógica reactiva pura, inmutabilidad, ordenamiento y orquestación de persistencia asíncrona.", 6.8),
        ("4. Infraestructura & Views", "IndexedDB, Exporters, React UI", "Adaptadores reemplazables: almacenamiento en navegador, generador PDF, HTML offline y layouts.", 9.8)
    ]
    for title, sub, desc, left in layers:
        tf_lay = add_card(slide3, left, 1.8, 2.7, 5.0, title, sub)
        p_desc = tf_lay.add_paragraph()
        p_desc.text = desc
        p_desc.font.size = Pt(11)
        p_desc.font.color.rgb = COLOR_TEXT_MUTED
        p_desc.space_before = Pt(12)

    # -------------------------------------------------------------
    # SLIDE 4: FASE 1 - DOMINIO Y PUERTOS
    # -------------------------------------------------------------
    slide4 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide4, COLOR_BG_LIGHT)
    add_header(slide4, "Fase 1: Setup & Dominio", "Modelado de Dominio Puro y Contratos de Inversión (DIP)")

    tf_f1_left = add_card(slide4, 0.8, 1.8, 5.7, 5.0, "Entidades de Dominio e Inmutabilidad", "src/models/Slide.ts & Project.ts")
    f1_points_left = [
        "Entidad 'Slide': Identificador único UUID, título, contenido, URL de imagen, pie de foto, notas del orador privadas y orden secuencial.",
        "Tipos de Layout: 'text-only', 'image-only' y 'text-and-image'.",
        "Entidad Raíz 'Project': Agregado que resguarda el título, autor, descripción y la colección de diapositivas.",
        "Factorías Puras: Funciones 'createDefaultSlide' y 'createDefaultProject' que aseguran estados iniciales válidos y marcas de tiempo ISO."
    ]
    for p in f1_points_left:
        p_item = tf_f1_left.add_paragraph()
        p_item.text = "• " + p
        p_item.font.size = Pt(12)
        p_item.font.color.rgb = COLOR_TEXT_MUTED
        p_item.space_before = Pt(10)

    tf_f1_right = add_card(slide4, 6.8, 1.8, 5.7, 5.0, "Puertos de Abstracción (DIP)", "src/models/ports/")
    f1_points_right = [
        "IProjectRepository: Contrato CRUD asíncrono (save, getById, getAll, delete). Permite cambiar IndexedDB por un backend REST sin alterar la UI.",
        "IExporter: Contrato universal de salida que exige un nombre de formato, extensión y método 'export(project): Promise<ExportResult>'.",
        "Aislamiento de Frameworks: Ninguna entidad de dominio importa paquetes de React, asegurando portabilidad hacia React Native o Node.js.",
        "2 Pruebas Unitarias Iniciales: Verificación automática de creación de modelos por defecto en Vitest."
    ]
    for p in f1_points_right:
        p_item = tf_f1_right.add_paragraph()
        p_item.text = "• " + p
        p_item.font.size = Pt(12)
        p_item.font.color.rgb = COLOR_TEXT_MUTED
        p_item.space_before = Pt(10)

    # -------------------------------------------------------------
    # SLIDE 5: FASE 2 - PERSISTENCIA Y TDD
    # -------------------------------------------------------------
    slide5 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide5, COLOR_BG_LIGHT)
    add_header(slide5, "Fase 2: Controllers & Storage", "Persistencia Asíncrona en IndexedDB y Controladores con TDD")

    tf_f2_1 = add_card(slide5, 0.8, 1.8, 3.7, 5.0, "IndexedDbProjectRepository", "Persistencia Asíncrona")
    f2_p1 = [
        "Utiliza la API IndexedDB nativa del navegador.",
        "Almacén 'projects' con clave primaria 'id'.",
        "Capacidad de almacenamiento masivo sin límite de 5 MB de LocalStorage.",
        "Operaciones envueltas en Promesas nativas.",
        "Resiliencia offline total."
    ]
    for p in f2_p1:
        pi = tf_f2_1.add_paragraph()
        pi.text = "• " + p
        pi.font.size = Pt(11)
        pi.font.color.rgb = COLOR_TEXT_MUTED
        pi.space_before = Pt(8)

    tf_f2_2 = add_card(slide5, 4.8, 1.8, 3.7, 5.0, "useSlideController", "Lógica de Diapositivas")
    f2_p2 = [
        "Gestión inmutable del array de diapositivas.",
        "Navegación protegida: 'goToSlide', 'nextSlide', 'prevSlide'.",
        "Reordenamiento ágil mediante splice de clones.",
        "Regla de frontera crítica: Impide borrar si solo queda 1 diapositiva.",
        "Mutación reactiva y actualización de fecha ISO."
    ]
    for p in f2_p2:
        pi = tf_f2_2.add_paragraph()
        pi.text = "• " + p
        pi.font.size = Pt(11)
        pi.font.color.rgb = COLOR_TEXT_MUTED
        pi.space_before = Pt(8)

    tf_f2_3 = add_card(slide5, 8.8, 1.8, 3.7, 5.0, "useProjectController", "Ciclo de Vida del Proyecto")
    f2_p3 = [
        "Inyección de IProjectRepository.",
        "Carga inicial automática en el montaje.",
        "Semillado por defecto si la base de datos está vacía.",
        "Banderas reactivas de estado: 'isLoading' y 'isSaving'.",
        "Manejo robusto de errores de I/O."
    ]
    for p in f2_p3:
        pi = tf_f2_3.add_paragraph()
        pi.text = "• " + p
        pi.font.size = Pt(11)
        pi.font.color.rgb = COLOR_TEXT_MUTED
        pi.space_before = Pt(8)

    # -------------------------------------------------------------
    # SLIDE 6: FASE 3 - UI, LAYOUTS Y EXPERIENCIA
    # -------------------------------------------------------------
    slide6 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide6, COLOR_BG_LIGHT)
    add_header(slide6, "Fase 3: UX & Componentes", "Interfaz de Edición Dual, Layouts Polimórficos y Notas del Orador")

    tf_f3_left = add_card(slide6, 0.8, 1.8, 5.7, 5.0, "EditorView & Notas del Orador", "Espacio de trabajo creativo")
    f3_left_items = [
        "Barra Superior: Selector en vivo de layout, edición de título y acciones principales.",
        "Sidebar Lateral: Miniaturas en tiempo real con controles para subir, bajar o eliminar diapositiva.",
        "Canvas 16:9 Central: Renderizado fiel con edición tipográfica directa.",
        "Drawer de Notas del Orador: Panel desplegable flotante con 'textarea' enlazado a 'activeSlide.notes'. Apuntes privados exclusivos para el autor que no se proyectan."
    ]
    for item in f3_left_items:
        pi = tf_f3_left.add_paragraph()
        pi.text = "• " + item
        pi.font.size = Pt(12)
        pi.font.color.rgb = COLOR_TEXT_MUTED
        pi.space_before = Pt(10)

    tf_f3_right = add_card(slide6, 6.8, 1.8, 5.7, 5.0, "PresentationView & Layouts Dinámicos", "Proyección escénica inmersiva")
    f3_right_items = [
        "Modo Proyector: Fondo oscuro 'bg-slate-950', pantalla completa nativa y barra de progreso inferior reactiva.",
        "Atajos de Teclado Globales: Flechas, Espacio para avanzar y Escape para volver al editor.",
        "Patrón Strategy en SlideRenderer: Despacho polimórfico a 'LayoutTextOnly', 'LayoutImageOnly' o 'LayoutTextAndImage'.",
        "Marco HeaderFooter: Encabezado corporativo, indicador de pulso, fecha formateada y paginación 'X / Y'."
    ]
    for item in f3_right_items:
        pi = tf_f3_right.add_paragraph()
        pi.text = "• " + item
        pi.font.size = Pt(12)
        pi.font.color.rgb = COLOR_TEXT_MUTED
        pi.space_before = Pt(10)

    # -------------------------------------------------------------
    # SLIDE 7: FASE 4 - EXPORTACIÓN E INTEROPERABILIDAD
    # -------------------------------------------------------------
    slide7 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide7, COLOR_BG_LIGHT)
    add_header(slide7, "Fase 4: Exportación & Portabilidad", "Visor Embebido Autónomo, PDF Vectorial y Carga JSON")

    f4_cards = [
        ("Visor HTML Embebido", "HtmlPresentationExporter", "Genera un único archivo .html autosuficiente con CSS 16:9 y script de navegación en JavaScript Vanilla. Funciona sin internet, sin Node.js y sanitiza contra ataques XSS.", 0.8),
        ("Descarga PDF Vectorial", "PdfPresentationExporter", "Genera matemáticamente un archivo .pdf apaisado 16:9 (297 x 167.06 mm) con la librería jsPDF. Dibuja títulos, párrafos con saltos de línea automáticos y paginación en un clic.", 3.8),
        ("Impresión Multi-página", "@media print & DOM Oculto", "Soluciona la impresión parcial: monta un contenedor oculto con todas las diapositivas y 'page-break-after: always'. El navegador genera un PDF de 1 página por slide (1 a N).", 6.8),
        ("Cargar y Respaldo JSON", "importProjectFromJson", "Cierra el ciclo de backup y restore: permite descargar el proyecto en JSON y volverlo a subir para reconstruir todos los slides, notas y metadatos al 100%.", 9.8)
    ]
    for title, sub, desc, left in f4_cards:
        tf_c = add_card(slide7, left, 1.8, 2.7, 5.0, title, sub)
        pi = tf_c.add_paragraph()
        pi.text = desc
        pi.font.size = Pt(11)
        pi.font.color.rgb = COLOR_TEXT_MUTED
        pi.space_before = Pt(12)

    # -------------------------------------------------------------
    # SLIDE 8: CALIDAD Y METODOLOGÍA TDD (21 TESTS)
    # -------------------------------------------------------------
    slide8 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide8, COLOR_BG_LIGHT)
    add_header(slide8, "Garantía de Calidad", "Suite Automatizada TDD con Vitest: 21 Pruebas Superadas (100%)")

    tf_test_box = add_card(slide8, 0.8, 1.8, 7.5, 5.0, "Desglose de Suites de Prueba Automatizadas", "Ejecución continua con 'npm test'")
    test_rows = [
        ("models.test.ts (2 tests)", "Valida contratos de entidad pura, factorías y marcas de tiempo."),
        ("IndexedDbRepository.test.ts (5 tests)", "CRUD completo en IndexedDB con 'fake-indexeddb' en entorno jsdom."),
        ("useSlideController.test.ts (6 tests)", "Navegación, agregado, ordenamiento, mutación y guarda anti-borrado."),
        ("useProjectController.test.ts (2 tests)", "Carga de proyectos desde JSON válido y rechazo de archivos corruptos."),
        ("exporters.test.ts (6 tests)", "Generación de HTML offline, PDF en Blob, sanitización XSS y backup JSON.")
    ]
    for t_name, t_desc in test_rows:
        pi = tf_test_box.add_paragraph()
        pi.text = "✓ " + t_name + ": " + t_desc
        pi.font.size = Pt(11.5)
        pi.font.color.rgb = COLOR_TEXT_DARK
        pi.space_before = Pt(8)

    # Panel lateral de métricas
    tf_m1 = add_card(slide8, 8.6, 1.8, 3.9, 2.35, "21 de 21 Tests", "100% de Cobertura Exitosa", COLOR_EMERALD_LIGHT, COLOR_EMERALD)
    pm1 = tf_m1.add_paragraph()
    pm1.text = "Ninguna regresión entre fases. Pruebas ejecutadas en menos de 7 segundos en Vitest."
    pm1.font.size = Pt(11)
    pm1.font.color.rgb = COLOR_TEXT_DARK
    pm1.space_before = Pt(6)

    tf_m2 = add_card(slide8, 8.6, 4.45, 3.9, 2.35, "Compilación Limpia", "TypeScript 5.8 + Vite", COLOR_PRIMARY_LIGHT, COLOR_PRIMARY)
    pm2 = tf_m2.add_paragraph()
    pm2.text = "Cero errores de tipado estricto con 'tsc -b'. Bundle de producción optimizado y libre de vulnerabilidades."
    pm2.font.size = Pt(11)
    pm2.font.color.rgb = COLOR_TEXT_DARK
    pm2.space_before = Pt(6)

    # -------------------------------------------------------------
    # SLIDE 9: CONCLUSIONES Y FACTORES DISTINTIVOS
    # -------------------------------------------------------------
    slide9 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide9, COLOR_BG_DARK)

    # Header en modo oscuro
    add_header(slide9, "Balance Final", "Cualidades Distintivas y Conclusión de Ingeniería", dark=True)

    points = [
        ("1. Portabilidad Total", "La presentación no depende de React ni de Node.js una vez exportada; el archivo HTML o PDF funciona en cualquier sistema operativo de manera inmediata."),
        ("2. Resiliencia y Almacenamiento Ilimitado", "A través de IndexedDB, el usuario puede crear presentaciones pesadas con imágenes sin preocuparse por la cuota reducida de LocalStorage."),
        ("3. Mantenibilidad Clean Architecture", "El desacoplamiento entre modelos, controladores e interfaz permite sustituir la persistencia o agregar nuevos layouts en minutos sin tocar el resto del sistema."),
        ("4. Madurez de Software con TDD", "21 pruebas automatizadas respaldan cada función, asegurando que la experiencia de edición, presentación y exportación sea completamente predecible y robusta.")
    ]

    for idx, (head, desc) in enumerate(points):
        top_pos = 1.8 + idx * 1.25
        card = slide9.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(top_pos), Inches(11.7), Inches(1.1))
        card.fill.solid()
        card.fill.fore_color.rgb = RGBColor(30, 41, 59)
        card.line.color.rgb = RGBColor(51, 65, 85)
        tf_c = card.text_frame
        tf_c.word_wrap = True
        tf_c.margin_left = Inches(0.3)
        tf_c.margin_top = Inches(0.15)
        
        p_h = tf_c.paragraphs[0]
        p_h.text = head
        p_h.font.size = Pt(13)
        p_h.font.bold = True
        p_h.font.color.rgb = RGBColor(129, 140, 248)

        p_d = tf_c.add_paragraph()
        p_d.text = desc
        p_d.font.size = Pt(11)
        p_d.font.color.rgb = COLOR_WHITE
        p_d.space_before = Pt(3)

    # Guardar archivo
    output_filename = "Presentacion_Proyecto_Fases_Web.pptx"
    prs.save(output_filename)
    print(f"Presentacion generada exitosamente: {output_filename}")

if __name__ == "__main__":
    create_deck()

