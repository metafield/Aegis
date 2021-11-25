import { Vector, ZERO } from '../Maths/Vector'
import type { Context, RadialHitBox, TAG } from '../Types'

export abstract class GameObject {
  tags: TAG[] = []
  dead: Boolean = false
  pos: Vector = ZERO
  velocity: Vector = ZERO

  hitBox?: RadialHitBox
  isTriggerable?: boolean
  trigger?(context: Context, evoker: any) {}

  draw(context: Context) {}
  update(context: Context) {}
  destroy(context: Context) {}

  checkCollisions(context: Context) {}
}
