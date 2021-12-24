<script lang="ts">
  import { onMount } from 'svelte'
  import type { Context } from './Game/Types'
  import { directionToTarget, quickDestroy } from './Game/Maths/Utils'
  import { v } from './Game/Maths/Vector'
  import { drawBase } from './Game/Prefabs/Base'
  import { Missile } from './Game/Prefabs/Missile'
  import { HEIGHT, WIDTH } from './Game/Core/game'
  import type { GameObject } from './Game/Core/GameObject'
  import { Director } from './Game/Core/Director'
  import { ScoreBoard } from './Game/Prefabs/GUI/ScoreBoard'
  import Intro from './Game/GUI/Intro.svelte'
  import Title from './Game/GUI/Title.svelte'

  let canvas: HTMLCanvasElement
  const buffer = document.createElement('canvas')
  buffer.width = WIDTH
  buffer.height = HEIGHT

  const basePos = v(WIDTH / 2 - 90 / 2, HEIGHT - 45)
  const firePoint = v(WIDTH / 2, HEIGHT - 45)
  const gameObjects: GameObject[] = []
  const vfxObjects: GameObject[] = []
  const scoreBoard = new ScoreBoard(v(WIDTH - WIDTH * 0.25, 80))
  const director = new Director()

  onMount(async () => {
    const ctx = buffer.getContext('2d')
    const visibleCtx = canvas.getContext('2d')
    const context = {
      gameObjects,
      vfxObjects,
      ctx,
      director,
    } as Context

    // FPS and timings
    let prevTime = 0
    let now: number
    let deltaTime = 0
    let frameTime = 0
    const targetFPS = 60
    const renderInterval = 1000 / targetFPS

    function start() {
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

      // direct
      director.update(context)

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

      // Draw GUI
      scoreBoard.draw(context)

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
  <div id="game" style="--game-width:{WIDTH}px; --game-height:{HEIGHT}px;">
    <Title />
    <Intro />
    <canvas
      on:mousedown={handleMousedown}
      bind:this={canvas}
      width={WIDTH}
      height={HEIGHT}
    />
  </div>
</main>

<style>
  #game {
    position: relative;
    max-width: var(--game-width);
    height: var(--game-height);
    overflow: hidden;
  }

  canvas {
    position: absolute;
    top: 0;
    left: 0;
    background-color: cornflowerblue;
  }

  main {
    padding: 1em;
  }

  @media (min-width: 640px) {
  }
</style>
