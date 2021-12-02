import type { AnyScript, Context } from '../Types'
import { CometWave } from '../Scripts/CometWave'
import { NewRound } from '../Scripts/NewRound'
import { Arcade } from '../Scripts/Scenarios/Arcade'
import { ScriptRunner } from '../Scripts/ScriptRunner/ScriptRunner'

export class Director {
  // Attributes
  private score = 0
  private runner = new ScriptRunner()

  constructor() {
    this.runner.add(new CometWave('wave', 2, 1))
  }

  addScore(amount: number): void {
    this.score += amount
  }

  getScore(): number {
    return this.score
  }

  update(ctx: Context) {
    this.runner.update(ctx)
  }
}
