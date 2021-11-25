import type { Director } from './Core/Director'
import type { GameObject } from './Core/GameObject'
import type { Vector } from './Maths/Vector'

export type TAG =
  | 'city'
  | 'player1_explosion'
  | 'explosion'
  | 'missile'
  | 'comet'

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

// TODO: look into why this is I-GameObject when we have the class
export interface IGameObject {
  dead: Boolean
  pos: Vector
  direction: Vector

  hitBox?: RadialHitBox
  isTriggerable?: boolean
  trigger?: (context: Context, evoker: GameObject) => void

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
  trigger: (context: Context, evoker: GameObject) => void
}
