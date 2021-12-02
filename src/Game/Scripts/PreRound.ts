import { WIDTH, HEIGHT } from '../Core/game'
import { v, ZERO } from '../Maths/Vector'
import { City } from '../Prefabs/City'
import type { Context } from '../Types'
import { Script } from './Script'

export class PreRound extends Script {
  constructor(public name: string, public onEnd: Function) {
    super(name)
  }

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
}
