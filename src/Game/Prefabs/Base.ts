import type { Vector } from '../Maths/Vector'
import type { Context } from '../Types'

let frameCount = 0
let t1 = new Date().getTime()
let frames = [0, 0, 0]
let text = ''
let deltaMax = -Infinity
let deltaMin = Infinity
// there is loading lag at the start we need to wait to get consistency
let enableMinMax = false
setTimeout(() => (enableMinMax = true), 3000)

export function drawBase({ ctx, deltaTime }: Context, pos: Vector) {
  let t2 = new Date().getTime()
  if (enableMinMax) {
    deltaMax = Math.max(deltaMax, deltaTime)
    deltaMin = Math.min(deltaMin, deltaTime)
  }
  if (t2 - t1 >= 1000) {
    t1 = t2
    frames.push(frameCount)
    frames.shift()
    frameCount = 0
    text = ((frames[0] + frames[1] + frames[2]) / 3).toFixed(2) + 'fps'
  }

  frameCount++
  ctx.strokeStyle = '#fff'
  ctx.lineWidth = 8
  ctx.strokeRect(pos.x, pos.y, 90, 45)

  ctx.strokeStyle = '#000'
  ctx.lineWidth = 2
  ctx.font = '16px serif'
  ctx.strokeText(text, pos.x + 10, pos.y + 30)
  ctx.strokeText(deltaMin.toFixed(), pos.x + 110, pos.y + 30)
  ctx.strokeText(deltaMax.toFixed(), pos.x + 160, pos.y + 30)
}
