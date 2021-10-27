import type { AbstractVector, Vector } from 'vector2d'
import { randomColour } from '../Maths/Utils'
import type {
  Context,
  GameObject,
  RadialHitBox,
  Triggerable,
} from '../Types'

export class Comet implements GameObject, Triggerable {
  dead = false
  isTriggerable = true
  hitBox = {} as RadialHitBox

  private radius = 20
  private colour = '#fff'

  constructor(
    public pos: Vector | AbstractVector,
    public direction: Vector
  ) {
    this.hitBox.pos = pos.clone()
    this.hitBox.radius = this.radius
  }

  trigger(evoker: GameObject) {
    // can set the trigger to false for a one shot
    // or could use a timeout/cool down that we minus deltaTime from
    this.colour = '#00f'
    this.isTriggerable = false
    console.log('I was hit by ', evoker)
  }

  checkCollisions: (context: Context) => void

  draw({ ctx }: Context) {
    ctx.fillStyle = this.colour
    ctx.beginPath()
    ctx.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI * 2, true)
    ctx.fill()

    // hit box
    ctx.strokeStyle = '#f00'
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

  update({ deltaTime }: Context) {
    // update hit box
    this.hitBox.radius = this.radius
    this.hitBox.pos = this.pos.clone()

    // death condition
    // if (this.radius > this.maxSize) this.dead = true
  }

  destroy() {
    console.log('destroy: comet exploded')
  }
}
