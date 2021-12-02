import { WIDTH, HEIGHT } from '../Core/game'
import { v, ZERO } from '../Maths/Vector'
import { City } from '../Prefabs/City'
import type { Context } from '../Types'
import { Script } from './Script'

export class PreRound extends Script {
  private initialDelay = 5000
  private time = 0

  private cityDelay = 300
  private cityTime = 0

  private cities = 0
  private cityXMul = [1, 3, 8, 10]
  private cityY = HEIGHT - 80

  constructor(public name: string) {
    super(name)

    // TODO: display round
  }

  update(ctx: Context): void {
    this.time += ctx.deltaTime
    if (this.initialDelay > this.time) {
      return
    }

    if (this.cities < 4) {
      this.cityTime += ctx.deltaTime
      if (this.cityDelay > this.cityTime) {
        return
      }

      ctx.gameObjects.push(
        new City(
          v((WIDTH / 12) * this.cityXMul[this.cities], this.cityY),
          ZERO.clone()
        )
      )

      this.cities++
      this.cityTime = 0
    } else {
      this.finished()
    }
  }
}
