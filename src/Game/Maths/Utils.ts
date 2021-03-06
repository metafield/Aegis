import type { GameObject } from '../Core/GameObject'
import type { Context } from '../Types'
import { LEFT, RIGHT, v, Vector } from './Vector'

const { floor, random } = Math

export function clamp(num: number, min: number, max: number): number {
  return Math.min(Math.max(num, min), max)
}

export function randomRange(min: number, max: number): number {
  return floor(random() * max) + min
}

export function randomDirection() {
  return floor(random() * 2 - 1)
}

export function randomLeftOrRight() {
  return randomRange(1, 2) % 2 == 0 ? LEFT : RIGHT
}

export function randomRangeLeftRight() {
  return randomLeftOrRight().mulS2(random()).normalise()
}

export function directionToTarget(pos: Vector, target: Vector) {
  let directionNonNormalised = v(target.x - pos.x, target.y - pos.y)
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

export function randomHex() {
  return floor(random() * 255)
    .toString(16)
    .padStart(2, '0')
}
// performance: These can be pre-baked rather than ran from the game loop
export function randomColour() {
  return '#' + randomHex() + randomHex() + randomHex()
}
