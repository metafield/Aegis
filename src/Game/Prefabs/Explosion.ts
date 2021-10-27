import type { Vector } from 'vector2d'
import type { GameObject } from '../GameObject'

export class Explosion implements GameObject {
  private radius = 0

  constructor(public pos: Vector, public direction: Vector) {}

  draw(ctx: CanvasRenderingContext2D) {
    ctx.strokeStyle = '#0f0'
    ctx.lineWidth = 4
    ctx.beginPath()
    ctx.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI * 2, true)
    ctx.stroke()
  }

  update(deltaTime: number) {
    this.radius = this.radius + deltaTime / 10
  }

  destroy() {}
}
