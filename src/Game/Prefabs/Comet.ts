import type { AbstractVector, Vector } from 'vector2d'
import { GRAVITY, randomDirection, randomRange } from '../Maths/Utils'
import { DOWN, LEFT, RIGHT, vector, ZERO } from '../Maths/Vector'

import type {
  Context,
  GameObject,
  RadialHitBox,
  Triggerable,
} from '../Types'
import { Explosion } from './Explosion'
import { Fader } from './Fader'

export class Comet implements GameObject, Triggerable {
  dead = false
  isTriggerable = true
  hitBox = {} as RadialHitBox

  private speed = 12
  private colour = '#fff'
  private divideRadius = 24
  private invulnTime = 400
  private invuln = this.invulnTime
  private trailInterval = this.speed * 18
  private trail = this.trailInterval

  constructor(
    public pos: Vector | AbstractVector,
    public direction: Vector | AbstractVector,
    public radius: number = randomRange(5, 35)
  ) {
    this.hitBox.pos = pos.clone()
    this.hitBox.radius = this.radius

    if (this.radius > this.divideRadius) {
      this.colour = '#ddd'
      this.speed += 5
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

  update({ deltaTime, gameObjects }: Context) {
    this.invuln -= deltaTime

    // drop trails
    this.trail -= deltaTime
    if (this.trail < 0) {
      gameObjects.push(
        new Fader(
          this.pos.clone(),
          this.direction.clone(),
          this.radius,
          this.colour
        )
      )

      this.trail = this.trailInterval
    }

    const velocity = this.direction.clone().mulS(deltaTime / this.speed)
    const gravity = DOWN.clone().mulS((GRAVITY + 8) / this.speed)
    this.pos.add(velocity).add(gravity)

    this.hitBox.radius = this.radius
    this.hitBox.pos = this.pos.clone()

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
      gameObjects.push(new Comet(this.pos.clone(), LEFT, this.radius / 2))
      gameObjects.push(new Comet(this.pos.clone(), RIGHT, this.radius / 2))
    } else {
      gameObjects.push(new Explosion(this.pos, ZERO, 60))
    }
    console.log('destroy: comet exploded')
  }
}
