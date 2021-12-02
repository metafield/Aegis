import { randomRange, randomRangeLeftRight } from '../Maths/Utils'
import { v } from '../Maths/Vector'
import { Comet } from '../Prefabs/Comet'

import type { Context } from '../Types'
import { Script } from './Script'

export class CometWave extends Script {
  cometCooldown: number
  cometSpawnTimer: number
  cometsLeftToSpawn: number

  constructor(
    public name: string,
    private amountOfComets: number,
    private difficulty: number
  ) {
    super(name)
    // difficulty goes between: 0- 3000ms 9- 300ms
    this.cometCooldown = 3000 - 270 * this.difficulty
    this.cometSpawnTimer = this.cometCooldown
    this.cometsLeftToSpawn = this.amountOfComets
  }

  update(ctx: Context): void {
    this.cometSpawnTimer -= ctx.deltaTime

    if (this.cometsLeftToSpawn <= 0) {
      // TODO: how fast is .some? we can make a fast one with a for loop
      // lingering comets, wait to end script
      if (ctx.gameObjects.some((go) => go.tags.includes('comet'))) {
        return
      }

      this.finished()
      return
    }

    if (this.cometSpawnTimer <= 0) {
      ctx.gameObjects.push(
        new Comet(
          v(randomRange(200, 600), -50),
          randomRangeLeftRight().mulS(randomRange(1, 10))
        )
      )

      this.cometsLeftToSpawn--
      this.cometSpawnTimer = this.cometCooldown
    }
  }
}
