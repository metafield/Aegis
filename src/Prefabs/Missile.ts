import type { Vector } from 'vector2d';
import { vector } from '../Maths/Vector';

export class Missile {
  public dead: boolean = false;

  private speed = 0.7;
  private minTargetDist = Infinity;

  constructor(
    public pos: Vector,
    public direction: Vector,
    public target: Vector
  ) {}

  draw(ctx: CanvasRenderingContext2D) {
    // target marker
    ctx.strokeStyle = '#f00';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(this.target.x, this.target.y, 2, 0, Math.PI * 2, true);
    ctx.stroke();

    // main projectile
    ctx.strokeStyle = '#0f0';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(this.pos.x, this.pos.y, 5, 0, Math.PI * 2, true);
    ctx.stroke();
  }

  update(deltaTime: number) {
    this.pos.x += this.direction.x * this.speed * deltaTime;
    this.pos.y += this.direction.y * this.speed * deltaTime;

    const lastMin = this.minTargetDist;
    this.minTargetDist = Math.min(this.pos.distance(this.target), lastMin);

    // distance never changed we reached the target and now we need to go boom
    if (lastMin == this.minTargetDist) {
      this.dead = true;
    }
  }

  destroy() {
    console.log('BOOM');
  }
}
