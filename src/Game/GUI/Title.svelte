<script lang="ts">
  import { stage } from '../../store/GameUI'

  let hidden = $stage != 'TITLE'
</script>

<div class:hidden>
  <h1 class="title">Aegis {$stage != 'TITLE'}</h1>
  <button>Arcade Mode</button>
  <button>Credits</button>
</div>

<style>
  .hidden {
    display: none;
  }

  div {
    position: relative;
    display: grid;
    grid-template-rows: 4fr 1fr 1fr 1fr;
    width: 100%;
    height: 100%;
    z-index: 1;
    text-align: center;
  }

  button {
    place-self: center;
    padding: 1rem;
  }

  .title {
    margin: 0;
    pointer-events: none;
    align-self: center;

    color: blueviolet;
    text-transform: uppercase;
    font-size: 8em;
    font-weight: 100;
  }
</style>
