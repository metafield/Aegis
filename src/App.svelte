<script lang="ts">
  import { onMount } from 'svelte';
  import { directionToTarget } from './Maths/Utils';
  import { vector } from './Maths/Vector';
  import { drawBase } from './Prefabs/Base';
  import { Missile } from './Prefabs/Missile';
  import { height, width } from './store/game';

  let canvas: HTMLCanvasElement;
  const basePos = vector($width / 2 - 90 / 2, $height - 45);
  const firePoint = vector($width / 2, $height - 45);
  let missiles: Missile[] = [];

  onMount(async () => {
    const ctx = canvas.getContext('2d');
    let prevTime = 0;
    let deltaTime = 0;

    function gameLoop(timeMs: number) {
      // clear
      ctx.clearRect(0, 0, $width, $height);
      // calculate delta
      deltaTime = timeMs - prevTime;
      prevTime = timeMs;
      // draw
      // buildings
      drawBase(ctx, basePos);
      // Missiles
      for (let i = 0; i < missiles.length; i++) {
        missiles[i].draw(ctx);
        missiles[i].update(deltaTime);
      }
      // Clean up dead game objects
      const died = missiles.filter((m) => m.dead);
      // call death script
      died.forEach((m) => m.destroy());
      // remove dead objects
      missiles = missiles.filter((m) => !m.dead);
      requestAnimationFrame(gameLoop);
    }

    gameLoop(0);
  });

  function handleMousedown(event) {
    let mouse = vector(event.offsetX, event.offsetY);
    let directionFromBase = directionToTarget(firePoint, mouse);

    missiles.push(new Missile(firePoint.clone(), directionFromBase, mouse));
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
