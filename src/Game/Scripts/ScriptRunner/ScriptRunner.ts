import type { AnyScript, Context } from '../../Types'

export class ScriptRunner {
  private scripts = new Map<string, AnyScript>()
  private paused = false

  constructor() {}

  add(script: AnyScript) {
    this.scripts.set(script.name, script)
  }

  remove(name: string) {
    this.scripts.delete(name)
  }

  pause() {
    this.paused = true
  }

  update(ctx: Context) {
    if (this.paused) return

    for (let script of this.scripts.values()) {
      if (script.ended) {
        this.scripts.delete(script.name)
        // TODO: make a logger for debugging
        console.log(
          `Runner > script: ${script.name} has finished and was removed`
        )
        continue
      }

      script.update(ctx)
    }
  }
}
