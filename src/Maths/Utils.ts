import { Vector } from 'vector2d';

export const directionToTarget = (pos: Vector, target: Vector) => {
  let directionNonNormalised = new Vector(target.x - pos.x, target.y - pos.y);
  return directionNonNormalised.normalise();
};
