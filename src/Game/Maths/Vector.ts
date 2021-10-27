import Vector2d from 'vector2d'

export const ZERO = vector(0, 0)
export const ONE = vector(1, 1)
export const UP = vector(0, -1)
export const DOWN = vector(0, 1)
export const LEFT = vector(-1, 0)
export const RIGHT = vector(1, 0)

export function vector(x: number, y: number): Vector2d.Vector {
  return new Vector2d.Vector(x, y)
}
