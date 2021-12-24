import type { AnyScript, Context, Scenario } from '../../Types'

// TODO: maybe scenario should be its own thing
export interface Task {
  scripts: AnyScript[]
  name: string
  scenario: Scenario
}

export class TaskRunner {
  private paused = false
  private tasks = new Map<string, Task>()

  constructor() {}

  add(task: Task): Task {
    // register task
    this.tasks.set(task.name, task)
    // listen to the scenario for scripts
    task.scenario.addEventListener('onNewScripts', (scripts) => {
      task.scripts.push(...scripts)
    })

    // listen for when brand new tasks need to be created like say from GameStart to Arcade mode.
    task.scenario.addEventListener('onNewTask', (task) => {
      // TODO: register new task (call add)
    })
    // start the scenario
    task.scenario.start()
    return task
  }

  enqueue(taskName: string, script: AnyScript) {
    this.tasks.get(taskName).scripts.push(script)
  }

  remove(name: string) {
    this.tasks.delete(name)
  }

  pause() {
    this.paused = true
  }

  onQueueEmpty(taskName: string) {
    console.log(`${taskName} has finished its queue`)
  }

  update(ctx: Context) {
    if (this.paused) return

    for (let task of this.tasks.values()) {
      // update the scenario as it may need to add more scripts to the task
      task.scenario.update(ctx)

      // skip this task if there is still no new work
      if (task.scripts.length == 0) continue

      if (task.scripts[0].ended) {
        // last script? If yes trigger some event or wait
        if (task.scripts.length == 1) {
          this.onQueueEmpty(task.name)
        }

        // script has ended. Remove it from the queue.
        task.scripts.shift()
        continue
      }

      // Update the current ( first ) script in the queue.
      task.scripts[0].update(ctx)
    }
  }
}
