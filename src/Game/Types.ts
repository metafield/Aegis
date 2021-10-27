import type { AbstractVector, Vector } from 'vector2d'
export interface Context {
  ctx: CanvasRenderingContext2D
  gameObjects: GameObject[]
  deltaTime: number
}
export interface GameObject {
  dead: Boolean
  pos: Vector | AbstractVector
  direction: Vector

  draw: (context: Context) => void
  update: (context: Context) => void
  destroy: (context: Context) => void
}

export interface RadialHitBox {
  pos: Vector | AbstractVector
  radius: number
}
