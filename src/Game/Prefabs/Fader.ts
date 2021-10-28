import type { AbstractVector, Vector } from 'vector2d'
import { randomRange } from '../Maths/Utils'

import type { Context, GameObject } from '../Types'
import { Explosion } from './Explosion'

export class Fader implements GameObject {
  dead = false

  private startRadius: number

  constructor(
    public pos: Vector | AbstractVector,
    public direction: Vector | AbstractVector,
    public radius: number = randomRange(5, 35),
    public colour: string,
    public rate: number
  ) {
    this.startRadius = radius
  }

  checkCollisions: (context: Context) => void

  kill(killer: GameObject) {
    this.dead = true
  }

  update({ deltaTime }: Context) {
    this.radius -= deltaTime / this.rate
    if (this.radius <= 0) this.kill(this)
  }

  draw({ ctx }: Context) {
    if (this.dead) return

    ctx.fillStyle = this.colour
    ctx.beginPath()
    ctx.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI * 2, true)
    ctx.fill()
  }

  destroy({ gameObjects }) {
    console.log('destroy: trail')
  }
}
