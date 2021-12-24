import { GameObject } from '../../Core/GameObject'
import type { Vector } from '../../Maths/Vector'
import type { Context } from '../../Types'

// TODO: extends GUI ?
export class ScoreBoard extends GameObject {
  private colour = '#fff'

  constructor(public pos: Vector) {
    super()
  }

  update(ctx: Context) {}

  draw(ctx: Context) {
    ctx.ctx.fillStyle = this.colour
    ctx.ctx.font = '64px sans-serif'
    ctx.ctx.fillText(
      ctx.director.getScore().toString().padStart(4, '0'),
      this.pos.x,
      this.pos.y
    )
  }

  destroy() {}
}
