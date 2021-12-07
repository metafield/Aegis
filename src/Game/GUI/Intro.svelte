<script lang="ts">
  import { afterUpdate, beforeUpdate, onMount } from 'svelte'
  import { currentRound } from '../../store/GameUI'
  import gsap from 'gsap'

  let ref: HTMLHeadingElement
  let timeline: GSAPTimeline
  $: message = `Round ${$currentRound}`

  function trigger(round) {
    timeline.restart()
  }

  onMount(() => {
    timeline = gsap.timeline()
    timeline.fromTo(
      ref,
      { opacity: 0, scale: 10 },
      { opacity: 1, scale: 1, duration: 1 }
    )
    timeline.to(ref, { opacity: 0, scale: 10, delay: 1 })
  })

  afterUpdate(() => {
    trigger($currentRound)
  })
</script>

<h1 bind:this={ref}>{message}</h1>

<style>
  h1 {
    position: relative;
    align-self: center;
    top: 340px;
    z-index: 1;
    pointer-events: none;
  }
</style>
