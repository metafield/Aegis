import type { Vector } from './Vector'

export function roundedRect(
  ctx: CanvasRenderingContext2D,
  pos: Vector,
  width: number,
  height: number,
  radius: number
) {
  ctx.beginPath()
  ctx.moveTo(pos.x, pos.y + radius)
  ctx.arcTo(pos.x, pos.y + height, pos.x + radius, pos.y + height, radius)
  ctx.arcTo(
    pos.x + width,
    pos.y + height,
    pos.x + width,
    pos.y + height - radius,
    radius
  )
  ctx.arcTo(pos.x + width, pos.y, pos.x + width - radius, pos.y, radius)
  ctx.arcTo(pos.x, pos.y, pos.x, pos.y + radius, radius)
  ctx.stroke()
}
