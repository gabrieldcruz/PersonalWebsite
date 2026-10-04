<script lang="ts">
  import { onMount, untrack } from 'svelte';

  interface Props {
    active?: number;
    reducedMotion?: boolean;
    paused?: boolean;
  }

  let { active = 0, reducedMotion = false, paused = false }: Props = $props();
  let hidden = $state(false);
  let selectionVersion = $state(0);
  let previousActive: number | undefined;

  // Fixed positions and negative delays keep the first frame consistent across SSR and hydration.
  const facets = [
    { x: -9, y: 4, size: 68, angle: 20, dx: 8, dy: 9, turn: 12, duration: 35, delay: -17, tone: 'ice', outline: false },
    { x: 24, y: -17, size: 60, angle: 118, dx: -5, dy: 10, turn: -9, duration: 42, delay: -8, tone: 'deep', outline: false },
    { x: 40, y: 42, size: 54, angle: 186, dx: -6, dy: -7, turn: 11, duration: 38, delay: -25, tone: 'ice', outline: false },
    { x: -13, y: 68, size: 48, angle: 265, dx: 9, dy: -8, turn: -13, duration: 33, delay: -11, tone: 'deep', outline: false },
    { x: 80, y: 8, size: 46, angle: 35, dx: -7, dy: 6, turn: 9, duration: 41, delay: -29, tone: 'ice', outline: false },
    { x: 26, y: 23, size: 25, angle: 315, dx: 7, dy: -7, turn: 16, duration: 28, delay: -13, tone: 'ice', outline: true },
    { x: 6, y: 52, size: 32, angle: 142, dx: 6, dy: 8, turn: -12, duration: 31, delay: -22, tone: 'ice', outline: true },
    { x: 60, y: 72, size: 23, angle: 28, dx: -5, dy: -8, turn: 15, duration: 36, delay: -6, tone: 'ice', outline: true },
    { x: 89, y: 51, size: 27, angle: 216, dx: -4, dy: 9, turn: -10, duration: 32, delay: -18, tone: 'ice', outline: true }
  ];
  const shards = Array.from({ length: 20 }, (_, i) => ({
    x: (i * 37 + 9) % 100,
    y: (i * 23 + 7) % 100,
    size: 1.1 + (i % 5) * 0.62,
    angle: (i * 71) % 360,
    dx: (i % 2 ? -1 : 1) * (3 + i % 4),
    dy: -(5 + i % 6),
    turn: (i % 2 ? -1 : 1) * (18 + i % 8 * 5),
    duration: 16 + i % 7 * 3,
    delay: -(i * 3.7),
    opacity: 0.17 + i % 4 * 0.055
  }));

  onMount(() => {
    const updateVisibility = () => { hidden = document.hidden; };
    updateVisibility();
    document.addEventListener('visibilitychange', updateVisibility);
    return () => document.removeEventListener('visibilitychange', updateVisibility);
  });

  $effect(() => {
    const next = active;
    const canAnimate = !reducedMotion && !paused && !hidden;
    if (previousActive !== undefined && previousActive !== next && canAnimate) {
      untrack(() => { selectionVersion += 1; });
    }
    previousActive = next;
  });
</script>

<div
  class="triangle-background"
  class:motion-reduced={reducedMotion}
  class:motion-paused={paused || hidden}
  style={`--selection-y:${28 + active * 9}%`}
  aria-hidden="true"
>
  <div class="facet-field">
    {#each facets as facet}
      <svg
        class="facet"
        class:outline={facet.outline}
        class:deep={facet.tone === 'deep'}
        viewBox="0 0 100 100"
        focusable="false"
        style={`--x:${facet.x}%;--y:${facet.y}%;--size:${facet.size}vmin;--angle:${facet.angle}deg;--dx:${facet.dx}vw;--dy:${facet.dy}vh;--turn:${facet.turn}deg;--duration:${facet.duration}s;--delay:${facet.delay}s`}
      >
        <polygon points="0,0 100,24 24,100" vector-effect="non-scaling-stroke" />
      </svg>
    {/each}
  </div>

  <div class="shard-field">
    {#each shards as shard, i}
      <svg
        class="shard"
        class:hollow={i % 3 === 0}
        viewBox="0 0 100 100"
        focusable="false"
        style={`--x:${shard.x}%;--y:${shard.y}%;--size:${shard.size}vmin;--angle:${shard.angle}deg;--dx:${shard.dx}vw;--dy:${shard.dy}vh;--turn:${shard.turn}deg;--duration:${shard.duration}s;--delay:${shard.delay}s;--opacity:${shard.opacity}`}
      >
        <polygon points="8,6 94,26 26,94" vector-effect="non-scaling-stroke" />
      </svg>
    {/each}
  </div>

  {#if selectionVersion > 0 && !reducedMotion}
    {#key selectionVersion}
      <div class="selection-ripple">
        <svg class="ripple-wave" viewBox="0 0 100 100" focusable="false">
          <polygon points="0,8 100,50 0,92" vector-effect="non-scaling-stroke" />
        </svg>
        <svg class="ripple-wave echo" viewBox="0 0 100 100" focusable="false">
          <polygon points="0,8 100,50 0,92" vector-effect="non-scaling-stroke" />
        </svg>
        {#each [0, 1, 2] as i}
          <svg class="ripple-spark" viewBox="0 0 100 100" focusable="false" style={`--spark:${i}`}>
            <polygon points="8,6 94,26 26,94" />
          </svg>
        {/each}
      </div>
    {/key}
  {/if}
</div>

<style>
  .triangle-background {
    position: absolute;
    inset: 0;
    z-index: -3;
    overflow: hidden;
    pointer-events: none;
    contain: paint;
  }

  .facet-field,
  .shard-field {
    position: absolute;
    inset: 0;
    /* Keep the larger shapes quiet over the character's face. */
    mask-image: linear-gradient(90deg, #000 38%, #000a 64%, #0005 100%);
  }

  .facet,
  .shard {
    position: absolute;
    left: var(--x);
    top: var(--y);
    width: var(--size);
    height: var(--size);
    overflow: visible;
    transform: translate3d(0, 0, 0) rotate(var(--angle));
    transform-origin: 42% 42%;
    animation: facet-drift var(--duration) ease-in-out var(--delay) infinite alternate;
    color: #adf5ff;
  }

  .facet polygon {
    fill: currentColor;
    fill-opacity: 0.075;
    stroke: currentColor;
    stroke-width: 1;
    stroke-opacity: 0.16;
  }

  .facet.deep { color: #00133e; }
  .facet.deep polygon { fill-opacity: 0.14; stroke: none; }
  .facet.outline polygon { fill-opacity: 0.015; stroke-opacity: 0.25; }

  .shard {
    opacity: var(--opacity);
    animation-name: shard-drift;
  }

  .shard polygon { fill: currentColor; }
  .shard.hollow polygon { fill: none; stroke: currentColor; stroke-width: 1; }

  .selection-ripple {
    position: absolute;
    left: 28%;
    top: var(--selection-y);
    width: clamp(190px, 30vw, 520px);
    aspect-ratio: 1.6;
    transform: translateY(-50%);
  }

  .ripple-wave {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    overflow: visible;
    animation: selection-wave 650ms cubic-bezier(0.16, 1, 0.3, 1) both;
  }

  .ripple-wave polygon {
    fill: #92efff;
    fill-opacity: 0.045;
    stroke: #bdf8ff;
    stroke-width: 1.4;
    stroke-opacity: 0.55;
  }

  .ripple-wave.echo {
    animation-duration: 780ms;
    animation-delay: 60ms;
  }

  .ripple-wave.echo polygon { fill: none; stroke-width: 0.8; stroke-opacity: 0.3; }

  .ripple-spark {
    position: absolute;
    left: calc(55% + var(--spark) * 9%);
    top: calc(28% + var(--spark) * 20%);
    width: calc(13px + var(--spark) * 6px);
    height: calc(13px + var(--spark) * 6px);
    color: #bdf8ff;
    fill: currentColor;
    animation: selection-spark 540ms cubic-bezier(0.16, 1, 0.3, 1) both;
  }

  .motion-paused svg { animation-play-state: paused; }

  .motion-reduced svg { animation: none; }
  .motion-reduced .selection-ripple { display: none; }

  @keyframes facet-drift {
    to {
      transform: translate3d(var(--dx), var(--dy), 0) rotate(calc(var(--angle) + var(--turn)));
    }
  }

  @keyframes shard-drift {
    0% {
      opacity: calc(var(--opacity) * 0.65);
      transform: translate3d(0, 0, 0) rotate(var(--angle));
    }
    65% { opacity: var(--opacity); }
    100% {
      opacity: calc(var(--opacity) * 0.45);
      transform: translate3d(var(--dx), var(--dy), 0) rotate(calc(var(--angle) + var(--turn)));
    }
  }

  @keyframes selection-wave {
    0% { opacity: 0; transform: translateX(-20px) scale(0.72); }
    12% { opacity: 0.85; }
    100% { opacity: 0; transform: translateX(65px) scale(1.2); }
  }

  @keyframes selection-spark {
    0% { opacity: 0; transform: translateX(-10px) rotate(10deg); }
    12% { opacity: 0.55; }
    100% {
      opacity: 0;
      transform: translate(calc(35px + var(--spark) * 13px), calc(-20px + var(--spark) * 20px)) rotate(70deg);
    }
  }

  @media (max-width: 680px) {
    .facet-field { opacity: 0.7; }
    .shard-field { opacity: 0.8; }
    .selection-ripple { left: 19%; width: 63vw; }
    .shard:nth-child(n + 13) { display: none; }
  }

  @media (prefers-reduced-motion: reduce) {
    .facet,
    .shard { animation: none; }
    .selection-ripple { display: none; }
  }
</style>
