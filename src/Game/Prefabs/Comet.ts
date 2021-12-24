import { DEBUG, GRAVITY, HEIGHT } from '../Core/game'
import { GameObject } from '../Core/GameObject'
import { randomRange } from '../Maths/Utils'
import { DOWN, UP, Vector, ZERO } from '../Maths/Vector'

import type { Context, RadialHitBox, Triggerable } from '../Types'

import { Explosion } from './Explosion'
import { Fader } from './Fader'

export class Comet extends GameObject implements Triggerable {
  dead = false
  isTriggerable = true
  hitBox = {} as RadialHitBox

  private score = 100
  private colour = '#fff'
  private divideRadius = 24
  private invulnTime = 400
  private invuln = this.invulnTime
  private trailInterval = 15 * (this.radius / 2)
  private trail = this.trailInterval
  private gravity = GRAVITY
  private drag = GRAVITY
  public velocity = DOWN.mulS2(GRAVITY)

  constructor(
    public pos: Vector,
    public horizontalForce: Vector,
    public radius: number = randomRange(5, 35)
  ) {
    super()
    this.hitBox.pos = pos.clone()
    this.hitBox.radius = this.radius
    this.tags.push('comet')

    if (this.radius > this.divideRadius) {
      this.colour = '#ddd'
    }
  }

  trigger(ctx: Context, evoker: GameObject) {
    if (this.invuln > 0) return

    // can set the trigger to false for a one shot
    // or could use a timeout/cool down that we minus deltaTime from
    this.colour = '#00f'
    this.isTriggerable = false
    // TODO: Lots of other games engines put this logic here
    // but logic for kill/hit could be in some extracted place.
    // not sure yet.
    // if the killer was a missile then we need to assign points.
    // TODO: missiles and maybe all game objects should store the playerID
    // for multiplayer later?
    if (evoker.tags.includes('player1_explosion')) {
      ctx.director.addScore(this.score)
    }

    this.kill()
  }

  kill() {
    if (this.invuln > 0) return
    this.dead = true
  }

  checkCollisions(ctx: Context) {
    // Lots of ways to be performant here:
    // wide then narrow, using quadrants etc
    // best way here is we know that collisions cannot happen in the sky(at the moment)
    // so return if we are higher than the HEIGHT - City height + this.radius
    // TODO: decide on and implement max city height, replace this literal
    const maxCityHeight = 100
    if (this.pos.y < HEIGHT - (maxCityHeight + this.radius)) {
      return
    }

    let distanceFromCenters = Infinity
    let actualDistance = Infinity

    for (let i = 0; i < ctx.gameObjects.length; i++) {
      // look for cities to hit
      // Performance: the order of these checks matters. By Tags is fastest.
      if (
        !ctx.gameObjects[i].tags.includes('city') ||
        !ctx.gameObjects[i].isTriggerable
      ) {
        continue
      }

      distanceFromCenters = ctx.gameObjects[i].hitBox.pos.distance(
        this.hitBox.pos
      )

      actualDistance =
        distanceFromCenters -
        this.hitBox.radius -
        ctx.gameObjects[i].hitBox.radius
      if (actualDistance <= 0) {
        ctx.gameObjects[i].trigger(ctx, this)
      }
    }
  }

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

    // debug: display forces
    if (DEBUG) {
      ctx.strokeStyle = `hsla(${90 - 90 * dragPCofMax}, 100%, 50%, 1)`
      ctx.lineWidth = 2
      ctx.font = '16px serif'
      ctx.strokeText(
        dragPCofMax.toFixed(1),
        this.pos.x + this.radius + 16,
        this.pos.y
      )
    }
  }

  update(context: Context) {
    this.invuln -= context.deltaTime

    // calc velocity
    this.velocity.zero()

    // drag: max possible is 10 to match gravity. 2 factors: Atmospheric and Surface Area
    // The atmospheric drag is based on how far down in Y (how close to Earth) the comet is.
    // The SA drag is derived from the radius of the comet:
    // drag = relation of this Y to the height of the screen
    // 10 * (this.pos.y / HEIGHT + offset) - the max value should be off the screen for now
    this.drag = 10 * (this.pos.y / (HEIGHT * 1.5))
    // bleed off the horizontal force
    this.horizontalForce.mulS(0.991 + randomRange(0.004, 0.006))

    this.velocity
      .add(DOWN.mulS2(this.gravity * context.deltaTime))
      .add(UP.mulS2(this.drag * context.deltaTime))
      .add(this.horizontalForce.mulS2(context.deltaTime))

    // update hit boxes
    this.pos.add(this.velocity.mulS2(0.01))
    this.hitBox.radius = this.radius
    this.hitBox.pos = this.pos.clone()

    // drop trails
    this.trail -= context.deltaTime
    // update interval = new time - current elapsed
    this.trail = Math.min(this.trail, this.trailInterval)

    if (this.trail < 0) {
      context.vfxObjects.unshift(
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

    // death condition: off the screen
    if (this.pos.y >= HEIGHT) this.kill()

    // check collisions
    this.checkCollisions(context)
  }

  destroy({ gameObjects }) {
    // Off the screen. Explode then return early.
    if (this.pos.y >= HEIGHT) {
      gameObjects.push(
        new Explosion(this.pos, ZERO, 'comet', this.radius * 1.5)
      )
      return
    }

    // If it's big then it splits.
    if (this.radius > this.divideRadius) {
      gameObjects.push(
        new Comet(
          this.pos.clone(),
          this.horizontalForce.clone().reverse(),
          this.radius / 2
        ),
        new Comet(this.pos.clone(), this.horizontalForce, this.radius / 2)
      )
    } else {
      // Regular explosion
      gameObjects.push(
        new Explosion(this.pos, ZERO, 'comet', this.radius * 1.5)
      )
    }
  }
}
