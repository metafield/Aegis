import type { Context } from '../Types'

export class Renderer {
  // FPS and timings
  prevTime = 0
  now: number
  deltaTime = 0
  frameTime = 0
  targetFPS = 60
  renderInterval = 1000 / this.targetFPS

  update(ctx: Context) {}
}
