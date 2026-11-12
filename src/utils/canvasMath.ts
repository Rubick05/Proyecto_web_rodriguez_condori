/**
 * Utilidades matemáticas para el canvas 16:9 de diapositivas
 * 
 * Garantiza que cualquier elemento (imágenes, cajas) permanezca
 * estrictamente dentro de los límites visibles (0% a 100%) sin desbordarse.
 */

export function clamp(val: number, min: number, max: number): number {
  return Math.min(Math.max(val, min), max)
}

export function clampPosition(
  x: number,
  y: number,
  width: number,
  height: number = 30
): { x: number; y: number } {
  const safeWidth = clamp(width, 10, 95)
  const safeHeight = clamp(height, 10, 90)

  const clampedX = clamp(x, 0, 100 - safeWidth)
  const clampedY = clamp(y, 0, 100 - safeHeight)

  return { x: clampedX, y: clampedY }
}

export function clampWidth(newWidth: number, currentX: number): number {
  const maxAvailable = Math.max(0, 100 - currentX)
  return clamp(newWidth, 15, Math.min(maxAvailable, 95))
}
