<script lang="ts">
  import { onMount } from 'svelte'
  import type { Context, GameObject } from './Game/Types'
  import {
    directionToTarget,
    quickDestroy,
    randomDirection,
    randomLeftRight,
  } from './Game/Maths/Utils'
  import { vector } from './Game/Maths/Vector'
  import { drawBase } from './Game/Prefabs/Base'
  import { Missile } from './Game/Prefabs/Missile'
  import { height, width } from './store/game'
  import { Comet } from './Game/Prefabs/Comet'

  let canvas: HTMLCanvasElement
  const basePos = vector($width / 2 - 90 / 2, $height - 45)
  const firePoint = vector($width / 2, $height - 45)
  const gameObjects: GameObject[] = []
  const vfxObjects: GameObject[] = []

  onMount(async () => {
    const ctx = canvas.getContext('2d')
    const context = {
      gameObjects,
      vfxObjects,
      ctx,
    } as Context

    let prevTime = 0
    let deltaTime = 0

    let enemySpawnCD = 800
    let enemySpawnTimer = enemySpawnCD

    // temp: add comets

    function gameLoop(timeMs: number) {
      // clear
      ctx.clearRect(0, 0, $width, $height)

      // Time - calculate delta
      deltaTime = timeMs - prevTime
      // fix for tab switching:
      if (deltaTime > 50) deltaTime = 50
      prevTime = timeMs
      context.deltaTime = deltaTime

      // TODO: (temp) add base
      drawBase(ctx, basePos)

      // Gameplay Director

      // spawn things if they are able
      enemySpawnTimer -= deltaTime
      if (enemySpawnTimer <= 0) {
        gameObjects.push(
          new Comet(vector(400, 0), randomLeftRight().mulS(Math.random())),
          new Comet(vector(200, 0), randomLeftRight().mulS(Math.random())),
          new Comet(vector(600, 0), randomLeftRight().mulS(Math.random()))
        )

        enemySpawnTimer = enemySpawnCD
      }

      // Draw vfx
      for (let i = 0; i < vfxObjects.length; i++) {
        vfxObjects[i].update(context)
        vfxObjects[i].draw(context)
      }

      // Draw GO's
      for (let i = 0; i < gameObjects.length; i++) {
        gameObjects[i].update(context)
        gameObjects[i].draw(context)
      }

      // Remove dead objects and invoke destroy
      quickDestroy(gameObjects, context)

      requestAnimationFrame(gameLoop)
    }

    gameLoop(0)
  })

  function handleMousedown(event) {
    let mouse = vector(event.offsetX, event.offsetY)
    let directionFromBase = directionToTarget(firePoint, mouse)

    gameObjects.push(
      new Missile(firePoint.clone(), directionFromBase, mouse)
    )
    // target.set(new Vector(event.offsetX, event.offsetY));
    // add target to the canvas and the outliner
  }
</script>

<main>
  <h1>Aegis</h1>
  <canvas
    on:mousedown={handleMousedown}
    bind:this={canvas}
    width={$width}
    height={$height}
  />
</main>

<style>
  canvas {
    background-color: cornflowerblue;
  }

  main {
    text-align: center;
    padding: 1em;
    margin: 0 auto;
  }

  h1 {
    color: blueviolet;
    text-transform: uppercase;
    font-size: 4em;
    font-weight: 100;
  }

  @media (min-width: 640px) {
  }
</style>
