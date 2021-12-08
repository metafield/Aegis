import { currentRound } from '../../store/GameUI'
import { WIDTH, HEIGHT } from '../Core/game'
import { v, ZERO } from '../Maths/Vector'
import { City } from '../Prefabs/City'
import type { Context } from '../Types'
import { Script } from './Script'
import { Timer } from './utils/Timer'

export class PreRound extends Script {
  private citiesPlaced = 0
  private cityXMul = [1, 3, 8, 10]
  private cityY = HEIGHT - 80

  private initialDelay = new Timer(300)
  private cityInterval = new Timer(300)
  private displayTime = new Timer(2000)

  constructor(public roundNo: number) {
    super(`Round${roundNo}`)

    // TODO: display round
    currentRound.set(roundNo)
  }

  update(ctx: Context): void {
    if (this.initialDelay.tick(ctx.deltaTime) == false) {
      return
    }

    if (this.citiesPlaced < 4) {
      this.cityInterval.tick(ctx.deltaTime, () => this.placeCity(ctx))
    } else {
      // keep alive to show round start animations
      this.displayTime.tick(ctx.deltaTime, () => this.finished())
    }
  }

  private placeCity(ctx: Context) {
    ctx.gameObjects.push(
      new City(
        v((WIDTH / 12) * this.cityXMul[this.citiesPlaced], this.cityY),
        ZERO.clone()
      )
    )

    this.citiesPlaced++
  }
}
