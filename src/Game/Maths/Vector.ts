import Vector2d from 'vector2d'

export function ZERO() {
  return new Vector2d.Vector(0, 0)
}

export function UP() {
  return new Vector2d.Vector(0, -1)
}

export function DOWN() {
  return new Vector2d.Vector(0, 1)
}

export function LEFT() {
  return new Vector2d.Vector(-1, 0)
}

export function RIGHT() {
  return new Vector2d.Vector(-1, 0)
}

export function vector(x: number, y: number): Vector2d.Vector {
  return new Vector2d.Vector(x, y)
}
