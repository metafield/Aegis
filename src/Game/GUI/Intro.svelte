<script lang="ts">
  import { afterUpdate, onMount } from 'svelte'
  import { currentRound } from '../../store/GameUI'
  import gsap from 'gsap'

  let ref: HTMLHeadingElement
  let timeline: GSAPTimeline
  let curRound = 0

  function triggerAnimation() {
    curRound = $currentRound
    ref.innerText = `Round ${curRound}`
    timeline.restart()
  }

  onMount(() => {
    timeline = gsap.timeline()
    timeline.fromTo(
      ref,
      { opacity: 0, scale: 10 },
      {
        opacity: 1,
        scale: 1,
        duration: 1,
      }
    )
    timeline.to(ref, {
      opacity: 0,
      scale: 10,
      delay: 1,
      onStart: () => {
        ref.textContent = 'Start!'
      },
    })
  })

  afterUpdate(() => {
    if ($currentRound != curRound) {
      triggerAnimation()
    }
  })
</script>

<h1 bind:this={ref}>Round</h1>

<style>
  h1 {
    z-index: 1;
    position: absolute;
    top: 30%;
    left: 50%;
    transform: translate(-50%, -50%);
    pointer-events: none;
  }
</style>
