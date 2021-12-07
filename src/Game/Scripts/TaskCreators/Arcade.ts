import type { AnyScript, Context } from '../../Types'
import { CometWave } from '../CometWave'
import { PostRound } from '../PostRound'
import { PreRound } from '../PreRound'
import { Script } from '../Script'

export class Arcade extends Script {
  currentRound = 1

  constructor(public name: string, private parentScriptsRef: AnyScript[]) {
    super(name)
  }

  private createRound() {
    this.parentScriptsRef.push(
      new PreRound(this.currentRound),
      new CometWave('wave' + this.currentRound, 2, 1),
      new PostRound('postRound' + this.currentRound)
    )

    this.currentRound++
  }

  update(ctx: Context): void {
    if (this.parentScriptsRef.length == 0) this.createRound()
  }
}
