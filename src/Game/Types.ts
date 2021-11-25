import type { Director } from './Core/Director'
import type { GameObject } from './Core/GameObject'
import type { Vector } from './Maths/Vector'

export interface Context {
  ctx: CanvasRenderingContext2D
  director: Director
  gameObjects: GameObject[]
  vfxObjects: GameObject[]
  deltaTime: number
}

export interface Script {
  update(ctx: Context): void
  finished(): void
}
export interface IGameObject {
  dead: Boolean
  pos: Vector
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
  pos: Vector
  radius: number
}

export interface Triggerable {
  hitBox: RadialHitBox
  isTriggerable: boolean
  trigger: (evoker: GameObject) => void
}
