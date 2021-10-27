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

export class Comet implements GameObject, Triggerable {
  dead = false
  isTriggerable = true
  hitBox = {} as RadialHitBox

  private speed = 10
  private colour = '#fff'
  private invuln = 400

  constructor(
    public pos: Vector | AbstractVector,
    public direction: Vector | AbstractVector,
    public radius: number = randomRange(5, 35)
  ) {
    this.hitBox.pos = pos.clone()
    this.hitBox.radius = this.radius
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
    // ctx.strokeStyle = '#f00'
    // ctx.lineWidth = 1
    // ctx.beginPath()
    // ctx.arc(
    //   this.hitBox.pos.x,
    //   this.hitBox.pos.y,
    //   this.hitBox.radius,
    //   0,
    //   Math.PI * 2,
    //   true
    // )
    // ctx.stroke()
  }

  kill(killer: GameObject) {
    if (this.invuln > 0) return
    this.dead = true
  }

  update({ deltaTime }: Context) {
    this.invuln -= deltaTime

    const velocity = this.direction.clone().mulS(deltaTime / this.speed)
    const gravity = DOWN.clone().mulS(GRAVITY / this.speed)
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

    if (this.radius > 14) {
      gameObjects.push(new Comet(this.pos.clone(), LEFT, this.radius / 2))
      gameObjects.push(new Comet(this.pos.clone(), RIGHT, this.radius / 2))
    } else {
      gameObjects.push(new Explosion(this.pos, ZERO, 60))
    }
    console.log('destroy: comet exploded')
  }
}
