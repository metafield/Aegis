import type { Vector } from 'vector2d'

export interface GameObject {
  pos: Vector
  direction: Vector

  draw: (ctx: CanvasRenderingContext2D) => void
  update: (deltaTime: number) => void
  destroy: () => void
}
