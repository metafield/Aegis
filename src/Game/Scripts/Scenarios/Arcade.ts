import type { AnyScript, Context, Scenario } from '../../Types'
import { CometWave } from '../CometWave'
import { PostRound } from '../PostRound'
import { PreRound } from '../PreRound'
import { Script } from '../Script'

export class Arcade extends Script implements Scenario {
  currentRound = 1

  constructor(public name: string) {
    super(name)
  }

  public start() {
    this.createRound()
  }

  private createRound() {
    console.log('creating round')
    const postRound = new PostRound('postRound' + this.currentRound)
    // make a new round when this one ends
    postRound.onEnd = () => this.createRound()

    this.newScripts([
      new PreRound(this.currentRound),
      new CometWave('wave' + this.currentRound, 2, 1),
      postRound,
    ])

    this.currentRound++
  }

  newScripts(scripts: AnyScript[]) {
    this.events.onNewScripts(scripts)
  }

  update(ctx: Context): void {}
}
