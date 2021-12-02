import type { Context } from '../Types'

export abstract class Script {
  ended = false

  onEnd: Function | undefined

  constructor(public name: string) {}

  finished() {
    if (this.onEnd) {
      this.onEnd(this.name)
    }

    this.ended = true
  }

  abstract update(ctx: Context): void
}
