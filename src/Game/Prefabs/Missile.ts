import { Vector, ZERO } from '../Maths/Vector'
import type { Context, GameObject, RadialHitBox } from '../Types'
import { Explosion } from './Explosion'

export class Missile implements GameObject {
  public dead = false

  private speed = 0.7
  private minTargetDist = Infinity

  constructor(
    public pos: Vector,
    public direction: Vector,
    public target: Vector
  ) {}
  hitBox?: RadialHitBox
  isTriggerable?: boolean

  checkCollisions: (context: Context) => void

  draw({ ctx }: Context) {
    // target marker
    ctx.strokeStyle = '#f00'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.arc(this.target.x, this.target.y, 2, 0, Math.PI * 2, true)
    ctx.stroke()

    // main projectile
    ctx.strokeStyle = '#0f0'
    ctx.lineWidth = 4
    ctx.beginPath()
    ctx.arc(this.pos.x, this.pos.y, 5, 0, Math.PI * 2, true)
    ctx.stroke()
  }

  update({ deltaTime }: Context) {
    // TODO: get the vector math down to one line
    this.pos.x += this.direction.x * this.speed * deltaTime
    this.pos.y += this.direction.y * this.speed * deltaTime

    const lastMin = this.minTargetDist
    this.minTargetDist = Math.min(this.pos.distance(this.target), lastMin)
    this.speed = this.minTargetDist / 200 + 0.1

    // If the distance never changed or changed a tiny amount
    // then we reached the target and now we need to go boom
    const change = lastMin - this.minTargetDist

    console.log()
    if (change < Math.abs(0.1)) {
      this.dead = true
    }
  }

  destroy({ gameObjects }: Context) {
    console.log('destroy: Missile')
    gameObjects.push(new Explosion(this.pos, ZERO))
  }
}
