import { GameObject } from '../Core/GameObject'
import type { Vector } from '../Maths/Vector'
import type { Context, RadialHitBox, TAG } from '../Types'

export class Explosion extends GameObject {
  dead = false

  public hitBox = {} as RadialHitBox
  private radius = 0
  private colour = '#FFF'

  constructor(
    public pos: Vector,
    public direction: Vector,
    private creatorTag: TAG,
    public maxRadius: number = 30
  ) {
    super()
    this.hitBox.pos = pos.clone()
    this.hitBox.radius = this.radius
    this.tags.push('explosion', creatorTag)
  }

  draw({ ctx }: Context) {
    // uses hit box to help with debugging
    ctx.strokeStyle = this.colour
    ctx.lineWidth = 4
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

  update(context: Context) {
    this.radius = this.radius + context.deltaTime / 10

    // update hit box
    this.hitBox.radius = this.radius
    this.hitBox.pos = this.pos.clone()

    // check collisions
    this.checkCollisions(context)

    // death condition
    if (this.radius > this.maxRadius) this.dead = true
  }

  checkCollisions(ctx: Context) {
    let distanceFromCenters = Infinity
    let actualDistance = Infinity

    for (let i = 0; i < ctx.gameObjects.length; i++) {
      if (ctx.gameObjects[i].isTriggerable) {
        distanceFromCenters = ctx.gameObjects[i].hitBox.pos.distance(
          this.hitBox.pos
        )

        actualDistance =
          distanceFromCenters -
          this.hitBox.radius -
          ctx.gameObjects[i].hitBox.radius

        if (actualDistance <= 0) {
          ctx.gameObjects[i].trigger(ctx, this)
        }
      }
    }
  }

  destroy() {}
}
