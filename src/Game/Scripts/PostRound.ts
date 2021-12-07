import type { GameObject } from '../Core/GameObject'
import type { City } from '../Prefabs/City'
import type { Context } from '../Types'
import { Script } from './Script'
import { Timer } from './utils/Timer'

export class PostRound extends Script {
  private cityTimer = new Timer(400)
  private cities: GameObject[]

  scoreCities = (ctx: Context) => {
    /* 
      Cities were not being found in the correct order with a for loop. The next best thing is
      to pull out each city and sort them. Filter is great here because we are not in a game
      loop and it will only be ran once.
    */
    if (!this.cities) {
      this.cities = ctx.gameObjects.filter((go) =>
        go.tags.includes('city')
      )
      this.cities.sort((a, b) => b.pos.x - a.pos.x)
    }

    const city = this.cities.pop()

    if (city) {
      ctx.director.addScore(500)
      city.dead = true
      // returning here creates a delay between each scoring
      return
    }

    // No more cities to score.
    this.finished()
  }

  update(ctx: Context): void {
    this.cityTimer.tick(ctx.deltaTime, () => this.scoreCities(ctx))
  }
}
