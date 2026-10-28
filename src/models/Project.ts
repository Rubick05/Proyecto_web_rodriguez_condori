import { type Slide, createDefaultSlide } from './Slide'

/**
 * Entidad de Dominio: Project (Presentación)
 * Agregado principal que contiene los metadatos y la colección de diapositivas.
 */
export interface Project {
  id: string
  title: string
  author: string
  description?: string
  slides: Slide[]
  createdAt: string
  updatedAt: string
}

/**
 * Factory helper para crear un nuevo proyecto inicializado con una diapositiva de bienvenida
 */
export function createDefaultProject(title: string = 'Nueva Presentación', author: string = 'Autor'): Project {
  const timestamp = new Date().toISOString()
  const initialSlide = createDefaultSlide(0, 'text-only')
  initialSlide.title = 'Título de la Presentación'
  initialSlide.content = 'Bienvenido a tu nueva presentación. Personaliza este texto y agrega diapositivas adicionales.'

  return {
    id: `project-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    title,
    author,
    description: 'Presentación creada con el editor de diapositivas',
    slides: [initialSlide],
    createdAt: timestamp,
    updatedAt: timestamp,
  }
}
