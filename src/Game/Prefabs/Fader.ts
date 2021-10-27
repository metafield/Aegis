import type { AbstractVector, Vector } from 'vector2d'
import { randomRange } from '../Maths/Utils'

import type { Context, GameObject } from '../Types'
import { Explosion } from './Explosion'

export class Fader implements GameObject {
  dead = false

  private speed = 0

  constructor(
    public pos: Vector | AbstractVector,
    public direction: Vector | AbstractVector,
    public radius: number = randomRange(5, 35),
    public colour: string
  ) {}

  checkCollisions: (context: Context) => void

  draw({ ctx }: Context) {
    ctx.fillStyle = this.colour
    ctx.beginPath()
    ctx.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI * 2, true)
    ctx.fill()
  }

  kill(killer: GameObject) {
    this.dead = true
  }

  update({ deltaTime }: Context) {
    this.radius -= deltaTime / 100
    if (this.radius <= 0) this.kill(this)
  }

  destroy({ gameObjects }) {
    console.log('destroy: trail')
  }
}
