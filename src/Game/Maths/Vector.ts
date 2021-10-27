import Vector2d from 'vector2d';

export default class Vector extends Vector2d.Vector {
  static get ZERO() {
    return new Vector2d.Vector(0, 0);
  }

  static get UP() {
    return new Vector2d.Vector(0, -1);
  }

  static get DOWN() {
    return new Vector2d.Vector(0, 1);
  }

  static get LEFT() {
    return new Vector2d.Vector(-1, 0);
  }

  static get RIGHT() {
    return new Vector2d.Vector(-1, 0);
  }

  static create(x: number, y: number) {
    return new Vector2d.Vector(x, y);
  }
}

export function vector(x: number, y: number): Vector2d.Vector {
  return Vector.create(x, y);
}
