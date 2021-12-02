import type { AnyScript, Context } from '../../Types'
import { CometWave } from '../CometWave'
import { PostRound } from '../PostRound'
import { PreRound } from '../PreRound'
import { Script } from '../Script'

export class Arcade extends Script {
  currentRound = 1

  constructor(public name: string, private scriptsRef: AnyScript[]) {
    super(name)
  }

  private createRound() {
    this.scriptsRef.push(
      new PreRound('preRound' + this.currentRound),
      new CometWave('wave' + this.currentRound, 2, 1),
      new PostRound('postRound' + this.currentRound)
    )

    this.currentRound++
  }

  update(ctx: Context): void {
    if (this.scriptsRef.length == 0) this.createRound()
  }
}
