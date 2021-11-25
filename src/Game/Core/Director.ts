import type { Context } from '../Types'
import { CometWave } from '../Scripts/CometWave'

export class Director {
  // script to do one wave
  scripts = new Map<string, CometWave>()

  waveEnd = () => {
    this.scripts.delete('wave1')
  }

  constructor() {
    this.scripts.set('wave1', new CometWave(20, 0, this.waveEnd))
  }

  update(ctx: Context) {
    for (let script of this.scripts.values()) {
      script.update(ctx)
    }
  }
}
