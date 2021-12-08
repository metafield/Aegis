import type { Context } from '../Types'

type ScriptEvent = 'onNewScripts'
type ScriptEventHandler = (payload) => void

export abstract class Script {
  ended = false
  onEnd: Function | undefined

  protected events: Record<ScriptEvent, ScriptEventHandler> = {
    onNewScripts: undefined,
  }

  constructor(public name: string) {}

  public addEventListener(event: ScriptEvent, cb: ScriptEventHandler) {
    this.events[event] = cb
  }

  protected finished() {
    if (this.onEnd) {
      this.onEnd(this.name)
    }

    this.ended = true
  }

  abstract update(ctx: Context): void
}
