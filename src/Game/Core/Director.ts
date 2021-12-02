import type { AnyScript, Context } from '../Types'
import { CometWave } from '../Scripts/CometWave'
import { Arcade } from '../Scripts/TaskCreators/Arcade'
import { TaskRunner } from '../Scripts/TaskRunner/TaskRunner'

export class Director {
  // Attributes
  private score = 0
  private runner = new TaskRunner()
  private arcadeMode: Arcade
  constructor() {
    const arcadeTask = this.runner.add({
      name: 'ArcadeMode',
      scripts: [],
    })

    this.arcadeMode = new Arcade('ArcadeModeScenario', arcadeTask.scripts)
  }

  addScore(amount: number): void {
    this.score += amount
  }

  getScore(): number {
    return this.score
  }

  update(ctx: Context) {
    this.arcadeMode.update(ctx)
    this.runner.update(ctx)
  }
}
