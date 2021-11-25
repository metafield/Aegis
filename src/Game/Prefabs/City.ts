import { GameObject } from '../Core/GameObject'
import { roundedRect } from '../Maths/Drawing'
import { v, Vector } from '../Maths/Vector'

import type { Context, RadialHitBox } from '../Types'

export class City extends GameObject {
  dead = false
  isTriggerable = true
  hitBox = {} as RadialHitBox
  colour = '#fff'

  constructor(public pos: Vector, public direction: Vector) {
    super()

    this.hitBox.pos = pos.clone().add(v(50, 50))
    this.hitBox.radius = 50
    this.tags.push('city')
  }

  trigger(ctx: Context, evoker: GameObject) {
    this.colour = '#00f'
    this.isTriggerable = false
    this.kill()
  }

  update(ctx: Context) {}

  draw({ ctx }: Context) {
    if (this.dead) return

    ctx.strokeStyle = this.colour
    ctx.lineWidth = 5
    ctx.lineJoin = 'round'

    roundedRect(ctx, this.pos, 100, 100, 30)

    // hit box
    ctx.strokeStyle = `#0f0`
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.arc(
      this.hitBox.pos.x,
      this.hitBox.pos.y,
      this.hitBox.radius,
      0,
      Math.PI * 2,
      true
    )
    ctx.stroke()
  }

  kill() {
    this.dead = true
  }

  destroy() {}
}
