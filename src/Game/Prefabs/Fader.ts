import { GameObject } from '../Core/GameObject'
import { randomRange } from '../Maths/Utils'
import type { Vector } from '../Maths/Vector'

import type { Context } from '../Types'

export class Fader extends GameObject {
  dead = false

  private startRadius: number

  constructor(
    public pos: Vector,
    public direction: Vector,
    public radius: number = randomRange(5, 35),
    public colour: string,
    public rate: number
  ) {
    super()
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

  destroy() {}
}
