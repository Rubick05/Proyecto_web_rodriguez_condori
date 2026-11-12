import { describe, it, expect } from 'vitest'
import { clamp, clampPosition, clampWidth } from '../utils/canvasMath'

describe('canvasMath (Canvas Clamping & Bounds)', () => {
  it('clamp debe restringir valores fuera de rango', () => {
    expect(clamp(-10, 0, 100)).toBe(0)
    expect(clamp(150, 0, 100)).toBe(100)
    expect(clamp(50, 0, 100)).toBe(50)
  })

  it('clampPosition debe asegurar que la imagen nunca se salga del canvas 16:9', () => {
    // Si intenta colocarse en X negativa, se ajusta a 0
    expect(clampPosition(-20, 10, 40, 30).x).toBe(0)

    // Si intenta salirse por la derecha (x=80 con width=40 superaría 100)
    expect(clampPosition(80, 10, 40, 30).x).toBe(60)

    // Si intenta salirse por abajo (y=90 con height=30 superaría 100)
    expect(clampPosition(10, 90, 40, 30).y).toBe(70)

    // Si está dentro de los límites válidos
    const valid = clampPosition(25, 25, 40, 30)
    expect(valid.x).toBe(25)
    expect(valid.y).toBe(25)
  })

  it('clampWidth debe limitar el ancho disponible según la posición X actual', () => {
    // Con x = 60%, el ancho máximo disponible es 40%
    expect(clampWidth(60, 60)).toBe(40)

    // El ancho mínimo garantizado es 15%
    expect(clampWidth(5, 10)).toBe(15)

    // No debe superar 95%
    expect(clampWidth(100, 0)).toBe(95)
  })
})
