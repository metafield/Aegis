import type { Vector } from '../Maths/Vector'
import type { Context, RadialHitBox } from '../Types'

export abstract class GameObject {
  dead: Boolean
  pos: Vector
  direction: Vector

  hitBox?: RadialHitBox
  isTriggerable?: boolean
  trigger?(evoker: any) {}

  draw(context: Context) {}
  update(context: Context) {}
  destroy(context: Context) {}

  checkCollisions(context: Context) {}
}
