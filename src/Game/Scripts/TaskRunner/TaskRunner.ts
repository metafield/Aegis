import type { AnyScript, Context } from '../../Types'

interface Task {
  scripts: AnyScript[]
  name: string
}

export class TaskRunner {
  private paused = false
  private tasks = new Map<string, Task>()

  constructor() {}

  add(task: Task): Task {
    this.tasks.set(task.name, task)
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
