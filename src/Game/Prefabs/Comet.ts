import { GRAVITY, HEIGHT } from '../../store/game'
import { GameObject } from '../Core/GameObject'
import { clamp, randomRange } from '../Maths/Utils'
import {
  DOWN,
  LEFT,
  ONE,
  RIGHT,
  UP,
  v,
  Vector,
  ZERO,
} from '../Maths/Vector'

import type { Context, RadialHitBox, Triggerable } from '../Types'

import { Explosion } from './Explosion'
import { Fader } from './Fader'

export class Comet extends GameObject implements Triggerable {
  dead = false
  isTriggerable = true
  hitBox = {} as RadialHitBox

  private colour = '#fff'
  private divideRadius = 24
  private invulnTime = 400
  private invuln = this.invulnTime
  private trailInterval = 15 * (this.radius / 2)
  private trail = this.trailInterval
  private gravity = GRAVITY
  private drag = GRAVITY

  constructor(
    public pos: Vector,
    public velocity: Vector = DOWN.mulS2(GRAVITY),
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
    // physics info: get the drag to colour it
    let dragPCofMax = this.drag / (this.gravity - 2)

    ctx.fillStyle = this.colour
    ctx.beginPath()
    ctx.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI * 2, true)
    ctx.fill()

    // outline (uses hit box to spot bugs)
    ctx.strokeStyle = `hsla(${50 - 25 * dragPCofMax}, 100%, 50%, 1)`
    ctx.lineWidth = 3 * dragPCofMax
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

    ctx.strokeStyle = `hsla(${90 - 90 * dragPCofMax}, 100%, 50%, 1)`
    ctx.lineWidth = 2
    ctx.font = '16px serif'
    ctx.strokeText(
      dragPCofMax.toFixed(1),
      this.pos.x + this.radius + 16,
      this.pos.y
    )
  }

  kill(killer: GameObject) {
    if (this.invuln > 0) return
    this.dead = true
  }

  update({ deltaTime, vfxObjects }: Context) {
    this.invuln -= deltaTime

    // calc velocity
    this.velocity.zero()

    // drag: max possible is 10 to match gravity. 2 factors: Atmospheric and Surface Area
    // The atmospheric drag is based on how far down in Y (how close to Earth) the comet is.
    // The SA drag is derived from the radius of the comet:
    // drag = relation of this Y to the height of the screen
    // 10 * (this.pos.y / HEIGHT + offset) - the max value should be off the screen for now
    this.drag = 10 * (this.pos.y / (HEIGHT * 1.5))
    this.velocity
      .add(DOWN.mulS2(this.gravity * deltaTime))
      .add(UP.mulS2(this.drag * deltaTime))

    // update hit boxes
    this.pos.add(this.velocity.mulS2(0.01))
    this.hitBox.radius = this.radius
    this.hitBox.pos = this.pos.clone()

    // drop trails
    this.trail -= deltaTime
    // update interval = new time - current elapsed

    this.trail = Math.min(this.trail, this.trailInterval)

    if (this.trail < 0) {
      vfxObjects.unshift(
        new Fader(
          this.pos.clone(),
          this.velocity.clone(),
          this.radius,
          `hsla(${50 - 25 * (this.pos.y / HEIGHT)}, 100%, 50%, 1)`,
          8 + (this.pos.y / HEIGHT) * 2,
          2000 - (this.pos.y / HEIGHT) * 1200
        )
      )

      this.trail = this.trailInterval
    }

    // death condition
    if (this.pos.y >= HEIGHT) this.kill(this)
  }

  destroy({ gameObjects }) {
    if (this.pos.y >= HEIGHT) {
      gameObjects.push(new Explosion(this.pos, ZERO, 60))
      return
    }

    if (this.radius > this.divideRadius) {
      gameObjects.push(
        new Comet(this.pos.clone(), LEFT.clone(), this.radius / 2),
        new Comet(this.pos.clone(), RIGHT.clone(), this.radius / 2)
      )
    } else {
      gameObjects.push(new Explosion(this.pos, ZERO, 60))
    }
  }
}
