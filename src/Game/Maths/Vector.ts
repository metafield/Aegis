import Vector2d from 'vector2d'
export class Vector extends Vector2d.Vector {
  constructor(x: number, y: number) {
    super(x, y)
  }

  static create = (x: number, y: number) => new Vector(x, y)

  // Strips the abstract vector type from super clone
  clone() {
    return new Vector(this.x, this.y)
  }

  // all '2' functions are immutable
  add2(vector: Vector) {
    return this.clone().add(vector)
  }

  mulS2(scalar: number) {
    return this.clone().mulS(scalar)
  }
}

export const ZERO = Object.freeze(new Vector(0, 0)) as Vector
export const ONE = Object.freeze(new Vector(1, 1)) as Vector
export const UP = Object.freeze(new Vector(0, -1)) as Vector
export const DOWN = Object.freeze(new Vector(0, 1)) as Vector
export const LEFT = Object.freeze(new Vector(-1, 0)) as Vector
export const RIGHT = Object.freeze(new Vector(1, 0)) as Vector

export const v = Vector.create
