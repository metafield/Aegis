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

  hitBox?: RadialHitBox
  isTriggerable?: boolean
  trigger?: (evoker: GameObject) => void

  draw: (context: Context) => void
  update: (context: Context) => void
  destroy: (context: Context) => void
  checkCollisions: (context: Context) => void
}

export interface RadialHitBox {
  pos: Vector | AbstractVector
  radius: number
}

export interface Triggerable {
  hitBox: RadialHitBox
  isTriggerable: boolean
  trigger: (evoker: GameObject) => void
}
