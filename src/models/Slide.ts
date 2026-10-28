/**
 * Tipos de layout soportados por el motor de diapositivas
 */
export type SlideLayoutType = 'text-only' | 'image-only' | 'text-and-image'

/**
 * Entidad de Dominio: Slide (Diapositiva)
 * Representa una unidad de presentación independiente y agnóstica de frameworks UI.
 */
export interface Slide {
  id: string
  title: string
  layout: SlideLayoutType
  content: string
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
    notes: '',
    order,
    createdAt: timestamp,
    updatedAt: timestamp,
  }
}
