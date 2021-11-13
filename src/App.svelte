<script lang="ts">
  import { onMount } from 'svelte'
  import type { Context } from './Game/Types'
  import {
    directionToTarget,
    quickDestroy,
    randomRangeLeftRight,
  } from './Game/Maths/Utils'
  import { DOWN, v, ZERO } from './Game/Maths/Vector'
  import { drawBase } from './Game/Prefabs/Base'
  import { Missile } from './Game/Prefabs/Missile'
  import { HEIGHT, WIDTH } from './Game/Core/game'
  import { Comet } from './Game/Prefabs/Comet'
  import type { GameObject } from './Game/Core/GameObject'
  import { City } from './Game/Prefabs/City'

  let canvas: HTMLCanvasElement
  const buffer = document.createElement('canvas')
  buffer.width = WIDTH
  buffer.height = HEIGHT

  const basePos = v(WIDTH / 2 - 90 / 2, HEIGHT - 45)
  const firePoint = v(WIDTH / 2, HEIGHT - 45)
  const gameObjects: GameObject[] = []
  const vfxObjects: GameObject[] = []

  onMount(async () => {
    const ctx = buffer.getContext('2d')
    const visibleCtx = canvas.getContext('2d')
    const context = {
      gameObjects,
      vfxObjects,
      ctx,
    } as Context

    let enemySpawnCD = 2000
    let enemySpawnTimer = enemySpawnCD

    // FPS and timings
    let prevTime = 0
    let now: number
    let deltaTime = 0
    let frameTime = 0
    const targetFPS = 60
    const renderInterval = 1000 / targetFPS

    function start() {
      // add cities
      gameObjects.push(
        new City(v(WIDTH / 12, HEIGHT - 80), ZERO.clone()),
        new City(v((WIDTH / 12) * 3, HEIGHT - 80), ZERO.clone()),
        new City(v((WIDTH / 12) * 8, HEIGHT - 80), ZERO.clone()),
        new City(v((WIDTH / 12) * 10, HEIGHT - 80), ZERO.clone())
      )

      gameLoop(0)
    }

    function gameLoop(timeMs: number) {
      requestAnimationFrame(gameLoop)
      now = Date.now()
      // Time - calculate delta
      deltaTime = timeMs - prevTime
      deltaTime = now - prevTime

      if (deltaTime > renderInterval) {
        draw()
        prevTime = now - (deltaTime % renderInterval)
      }
    }

    function draw() {
      frameTime = new Date().getTime()
      // clear
      visibleCtx.clearRect(0, 0, WIDTH, HEIGHT)
      ctx.clearRect(0, 0, WIDTH, HEIGHT)

      // fix for browser tab switching:
      if (deltaTime > 50) deltaTime = 50
      context.deltaTime = deltaTime

      // TODO: (temp) add base
      drawBase(context, basePos)

      // Gameplay Director

      // spawn things if they are able
      enemySpawnTimer -= deltaTime
      if (enemySpawnTimer <= 0) {
        gameObjects.push(
          new Comet(v(400, -50), randomRangeLeftRight().mulS(10)),
          new Comet(v(200, -50), randomRangeLeftRight().mulS(10)),
          new Comet(v(600, -50), randomRangeLeftRight().mulS(10))
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

      // render to the screen with double buffering
      visibleCtx.drawImage(buffer, 0, 0)

      // Remove dead objects and invoke destroy
      quickDestroy(gameObjects, context)
      quickDestroy(vfxObjects, context)

      // log current frame time
      // console.log(new Date().getTime() - frameTime)
    }

    start()
  })

  function handleMousedown(event) {
    let mouse = v(event.offsetX, event.offsetY)
    let directionFromBase = directionToTarget(firePoint, mouse)

    gameObjects.push(
      new Missile(
        firePoint.clone(),
        directionFromBase.clone(),
        mouse.clone()
      )
    )
  }
</script>

<main>
  <h1>Aegis</h1>
  <canvas
    on:mousedown={handleMousedown}
    bind:this={canvas}
    width={WIDTH}
    height={HEIGHT}
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
