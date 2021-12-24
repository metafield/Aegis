export class Timer {
  constructor(
    private targetMs: number,
    private time: number = 0,
    private timesReset = 0
  ) {}

  tick(delta: number, foo?: (i: number) => void): boolean {
    this.time += delta

    if (this.targetMs > this.time) {
      return true
    }

    if (foo) {
      foo(this.timesReset)
    }

    this.time = 0
    this.timesReset++
    return false
  }
}
