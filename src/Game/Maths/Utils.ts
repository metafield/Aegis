import { Vector } from 'vector2d'
import type { Context, GameObject } from '../Types'

export function directionToTarget(pos: Vector, target: Vector) {
  let directionNonNormalised = new Vector(
    target.x - pos.x,
    target.y - pos.y
  )
  return directionNonNormalised.normalise()
}

export function quickDestroy(
  gameObjectsRef: GameObject[],
  context: Context
) {
  // swap pop for performance
  let arr = gameObjectsRef
  let swapTemp

  for (let i = arr.length - 1; i >= 0; i--) {
    if (arr[i].dead) {
      arr[i].destroy(context)

      if (i == arr.length - 1) {
        arr.pop()
        continue
      }

      swapTemp = arr[arr.length - 1]
      arr[arr.length - 1] = arr[i]
      arr[i] = swapTemp
      arr.pop()
    }
  }
}
