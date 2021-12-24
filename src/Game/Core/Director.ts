import type { AnyScript, Context } from '../Types'
import { CometWave } from '../Scripts/CometWave'
import { Arcade } from '../Scripts/Scenarios/Arcade'
import { TaskRunner } from '../Scripts/TaskRunner/TaskRunner'

export class Director {
  // Attributes
  private score = 0
  private runner = new TaskRunner()
  constructor() {
    /* 
      A task is added to a runner. A Scenario then
      uses game logic to populate the scripts for this runner. 
    */

    this.runner.add({
      name: 'ArcadeMode',
      scripts: [],
      scenario: new Arcade('ArcadeModeScenario'),
    })
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
