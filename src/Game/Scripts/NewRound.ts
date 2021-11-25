import { WIDTH, HEIGHT } from '../Core/game'
import { v, ZERO } from '../Maths/Vector'
import { City } from '../Prefabs/City'
import type { Context, Script } from '../Types'

export class NewRound implements Script {
  constructor(private onEnd: Function) {}

  update(ctx: Context): void {
    // add cities
    ctx.gameObjects.push(
      new City(v(WIDTH / 12, HEIGHT - 80), ZERO.clone()),
      new City(v((WIDTH / 12) * 3, HEIGHT - 80), ZERO.clone()),
      new City(v((WIDTH / 12) * 8, HEIGHT - 80), ZERO.clone()),
      new City(v((WIDTH / 12) * 10, HEIGHT - 80), ZERO.clone())
    )

    this.finished()
  }

  finished(): void {
    this.onEnd()
  }
}
