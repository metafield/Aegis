import type { Context, Script } from '../Types'
import { CometWave } from '../Scripts/CometWave'
import { NewRound } from '../Scripts/NewRound'

interface AnyScript extends Script {}
export class Director {
  // Attributes
  private score = 0
  private scripts = new Map<string, AnyScript>()
  private createRemoveScript = (name: string) => () =>
    this.scripts.delete(name)

  addScore(amount: number): void {
    this.score += amount
  }

  getScore(): number {
    return this.score
  }

  constructor() {
    this.scripts.set(
      'newRound',
      new NewRound(this.createRemoveScript('newRound'))
    )
    this.scripts.set(
      'wave1',
      new CometWave(10, 0, this.createRemoveScript('wave1'))
    )
  }

  update(ctx: Context) {
    // can have a condition if we want to execute the loaded scripts or just
    // run a script to interrupt/pause (game over / menus etc)
    for (let script of this.scripts.values()) {
      script.update(ctx)
    }
  }
}
