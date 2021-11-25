import { randomRange, randomRangeLeftRight } from '../../Maths/Utils'
import { v } from '../../Maths/Vector'
import { Comet } from '../../Prefabs/Comet'

import type { Context } from '../../Types'

interface Script {
  update(ctx: Context): void
}

export class CometWave implements Script {
  cometCooldown: number
  cometSpawnTimer: number

  constructor(
    private amountOfComets: number,
    private difficulty: number,
    private onEnd: Function
  ) {
    // difficulty goes between: 0- 3000ms 9- 300ms
    this.cometCooldown = 3000 - 270 * 0
    this.cometSpawnTimer = this.cometCooldown
  }

  update(ctx: Context): void {
    this.cometSpawnTimer -= ctx.deltaTime

    if (this.cometSpawnTimer <= 0) {
      ctx.gameObjects.push(
        new Comet(
          v(randomRange(200, 600), -50),
          randomRangeLeftRight().mulS(randomRange(1, 10))
        )
      )

      this.cometSpawnTimer = this.cometCooldown
    }
  }
}
