import type { AnyScript, Context, DIFFICULTY } from '../../Types'
import { CometWave } from '../CometWave'
import { NewRound } from '../NewRound'
import { Script } from '../Script'

export class Arcade extends Script {
  currentRound = 1

  constructor(
    public name: string,
    public onEnd: Function,
    private difficulty: DIFFICULTY = 'NORMAL'
  ) {
    super(name)

    // Round 1
    // this.scripts.set(
    //   'round1',
    //   new NewRound(this.createRemoveScriptCB('round1'))
    // )
    // this.scripts.set(
    //   'wave1',
    //   new CometWave(10, 0, this.createRemoveScriptCB('wave1'))
    // )
  }

  update(ctx: Context): void {}
}
