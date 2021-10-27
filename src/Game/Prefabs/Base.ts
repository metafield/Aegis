import type { Vector } from 'vector2d';

export function drawBase(ctx: CanvasRenderingContext2D, pos: Vector) {
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 8;
  ctx.strokeRect(pos.x, pos.y, 90, 45);
}
