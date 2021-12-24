import type { AnyScript, Context } from '../Types'
import type { Task } from './TaskRunner/TaskRunner'

type ScriptEvent = 'onNewScripts' | 'onNewTask'

type ScriptEventHandler = (payload) => void

export abstract class Script {
  ended = false
  onEnd: Function | undefined

  protected events: Record<ScriptEvent, ScriptEventHandler> = {
    onNewScripts: undefined,
    onNewTask: undefined,
  }

  constructor(public name: string) {}

  public addEventListener(event: ScriptEvent, cb: ScriptEventHandler) {
    this.events[event] = cb
  }

  // these functions send payload to subscribers
  protected newScripts(scripts: AnyScript[]) {
    this.events.onNewScripts(scripts)
  }

  protected newTask(task: Task) {
    this.events.onNewTask(task)
  }

  protected finished() {
    if (this.onEnd) {
      this.onEnd(this.name)
    }

    this.ended = true
  }

  abstract update(ctx: Context): void
}
