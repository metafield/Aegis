import type { AbstractVector, Vector } from 'vector2d'

export interface GameObject {
  pos: Vector | AbstractVector
  direction: Vector

  draw: (ctx: CanvasRenderingContext2D) => void
  update: (deltaTime: number) => void
  destroy: () => void
}
