import type { AbstractVector, Vector } from 'vector2d'
import { randomColour } from '../Maths/Utils'
import type { Context, GameObject, RadialHitBox } from '../Types'

export class Explosion implements GameObject {
  dead = false

  public hitBox = {} as RadialHitBox
  private radius = 0
  private maxSize = 30
  private colour = randomColour()

  constructor(
    public pos: Vector | AbstractVector,
    public direction: Vector
  ) {
    this.hitBox.pos = pos.clone()
    this.hitBox.radius = this.radius
  }

  draw({ ctx }: Context) {
    ctx.strokeStyle = this.colour
    ctx.lineWidth = 4
    ctx.beginPath()
    ctx.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI * 2, true)
    ctx.stroke()

    // hit box
    ctx.strokeStyle = '#f00'
    ctx.lineWidth = 1
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

  update({ deltaTime }: Context) {
    this.radius = this.radius + deltaTime / 10

    // update hit box
    this.hitBox.radius = this.radius
    this.hitBox.pos = this.pos.clone()

    // death condition
    if (this.radius > this.maxSize) this.dead = true
  }

  destroy() {
    console.log('destroy: explosion done')
  }
}
