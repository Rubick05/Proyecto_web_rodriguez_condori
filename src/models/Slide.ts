/**
 * Tipos de layout soportados por el motor de diapositivas
 */
export type SlideLayoutType = 'text-only' | 'image-only' | 'text-and-image'

export type FontFamilyType = 'sans' | 'serif' | 'mono'
export type FontSizeScale = 'sm' | 'md' | 'lg' | 'xl'
export type TextAlignType = 'left' | 'center' | 'right'

/**
 * Configuración tipográfica personalizada para la diapositiva
 */
export interface SlideTypography {
  fontFamily: FontFamilyType
  titleSize: FontSizeScale
  contentSize: FontSizeScale
  isBold: boolean
  isItalic: boolean
  textAlign: TextAlignType
}

/**
 * Configuración espacial y dimensional de la imagen dentro del canvas 16:9
 */
export interface SlideImageConfig {
  url: string
  caption?: string
  x: number       // Posición horizontal en porcentaje relativo (0% a 100%)
  y: number       // Posición vertical en porcentaje relativo (0% a 100%)
  width: number   // Ancho en porcentaje relativo del canvas (15% a 95%)
  height?: number // Altura en porcentaje relativo o automático proporcional
}

/**
 * Entidad de Dominio: Slide (Diapositiva)
 * Representa una unidad de presentación independiente y agnóstica de frameworks UI.
 */
export interface Slide {
  id: string
  title: string
  layout: SlideLayoutType
  content: string
  typography?: SlideTypography
  imageConfig?: SlideImageConfig
  imageUrl?: string
  imageCaption?: string
  notes?: string
  order: number
  createdAt: string
  updatedAt: string
}

/**
 * Factory helper para crear una nueva diapositiva con valores por defecto
 */
export function createDefaultSlide(order: number, layout: SlideLayoutType = 'text-only'): Slide {
  const timestamp = new Date().toISOString()
  return {
    id: `slide-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    title: `Diapositiva ${order + 1}`,
    layout,
    content: 'Haz clic aquí para editar el contenido...',
    typography: {
      fontFamily: 'sans',
      titleSize: 'lg',
      contentSize: 'md',
      isBold: true,
      isItalic: false,
      textAlign: 'left',
    },
    imageConfig: {
      url: '',
      caption: '',
      x: 10,
      y: 20,
      width: 50,
    },
    notes: '',
    order,
    createdAt: timestamp,
    updatedAt: timestamp,
  }
}
