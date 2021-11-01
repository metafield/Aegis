import { GRAVITY } from '../../store/game'
import { GameObject } from '../Core/GameObject'
import { randomRange } from '../Maths/Utils'
import { DOWN, LEFT, RIGHT, Vector, ZERO } from '../Maths/Vector'

import type { Context, RadialHitBox, Triggerable } from '../Types'

import { Explosion } from './Explosion'
import { Fader } from './Fader'

export class Comet extends GameObject implements Triggerable {
  dead = false
  isTriggerable = true
  hitBox = {} as RadialHitBox

  private speed = 44
  private colour = '#fff'
  private divideRadius = 24
  private invulnTime = 400
  private invuln = this.invulnTime
  private trailInterval = 4 * this.speed
  private trail = this.trailInterval
  private velocity = ZERO.clone()
  private gravity = ZERO.clone()

  constructor(
    public pos: Vector,
    public direction: Vector,
    public radius: number = randomRange(5, 35)
  ) {
    super()
    this.hitBox.pos = pos.clone()
    this.hitBox.radius = this.radius

    if (this.radius > this.divideRadius) {
      this.colour = '#ddd'
    }
  }

  trigger(evoker: GameObject) {
    if (this.invuln > 0) return

    // can set the trigger to false for a one shot
    // or could use a timeout/cool down that we minus deltaTime from
    this.colour = '#00f'
    this.isTriggerable = false
    this.kill(this)
  }

  checkCollisions: (context: Context) => void

  draw({ ctx }: Context) {
    ctx.fillStyle = this.colour
    ctx.beginPath()
    ctx.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI * 2, true)
    ctx.fill()

    // hit box
    ctx.strokeStyle = '#000'
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

  kill(killer: GameObject) {
    if (this.invuln > 0) return
    this.dead = true
  }

  update({ deltaTime, vfxObjects }: Context) {
    this.invuln -= deltaTime

    this.gravity = DOWN.mulS2(GRAVITY * deltaTime)
    this.velocity = this.direction.mulS2(deltaTime).add(this.gravity)

    this.pos.add(this.velocity.mulS2(0.01))
    this.hitBox.radius = this.radius
    this.hitBox.pos = this.pos.clone()

    // drop trails
    this.trail -= deltaTime
    if (this.trail < 0) {
      vfxObjects.unshift(
        new Fader(
          this.pos.clone(),
          this.direction.clone(),
          this.radius,
          '#ffbb22',
          100
        )
      )

      this.trail = this.trailInterval
    }

    // death condition
    // TODO: need height here
    if (this.pos.y >= 800) this.kill(this)
  }

  destroy({ gameObjects }) {
    // TODO: height here
    if (this.pos.y >= 800) {
      gameObjects.push(new Explosion(this.pos, ZERO, 60))
      return
    }

    if (this.radius > this.divideRadius) {
      gameObjects.push(
        new Comet(this.pos.clone(), LEFT, this.radius / 2),
        new Comet(this.pos.clone(), RIGHT, this.radius / 2)
      )
    } else {
      gameObjects.push(new Explosion(this.pos, ZERO, 60))
    }
  }
}
