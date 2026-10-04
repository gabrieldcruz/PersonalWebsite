<script lang="ts">
  import { onMount, tick } from 'svelte';

  let { label, index, selected }: { label: string; index: number; selected: boolean } = $props();
  const instanceId = $props.id();
  const clipId = `${instanceId}-selector`;
  const colors = ['#16cffb', '#7de6fd', '#77fefc'];
  let labelNode = $state<SVGTextElement>();
  let measuredWidth = $state<number | null>(null);
  let disposed = false;
  const width = $derived(measuredWidth ?? Math.max(100, label.length * 53));
  const whitePoints = $derived(`-135,110 ${width + 55},-70 ${width + 20},105`);
  const pinkPoints = $derived(`-152,117 ${width + 68},-83 ${width + 28},114`);

  function measure() {
    if (disposed || !labelNode) return;
    const length = labelNode.getComputedTextLength();
    if (Number.isFinite(length) && length > 0) measuredWidth = Math.ceil(length + 5);
  }

  onMount(() => {
    disposed = false;
    void document.fonts.ready.then(() => {
      if (!disposed) measure();
    });
    document.fonts.addEventListener('loadingdone', measure);
    return () => {
      disposed = true;
      document.fonts.removeEventListener('loadingdone', measure);
    };
  });

  $effect(() => {
    label;
    if (!labelNode) return;
    let current = true;
    void tick().then(() => {
      if (current && !disposed) measure();
    });
    return () => { current = false; };
  });
</script>

<svg class="menu-label" class:active={selected} aria-hidden="true" focusable="false"
  viewBox={`0 0 ${width} 100`} style:width={`${width / 100}em`}>
  {#if selected}
    <defs>
      <mask id={clipId} maskUnits="userSpaceOnUse" maskContentUnits="userSpaceOnUse"
        x="-180" y="-110" width={width + 300} height="280" style="mask-type: alpha;">
        <g class="selector-shape">
          <polygon points={whitePoints} fill="#fff" />
          <polygon class="pink-pulse" points={pinkPoints} fill="#fff" />
        </g>
      </mask>
    </defs>
    <g class="selector-shape">
      <polygon class="pink-pulse" points={pinkPoints} fill="#ff6cdd" />
      <polygon points={whitePoints} fill="#fff" />
    </g>
  {/if}
  <g class="label-text">
    <text bind:this={labelNode} class="option-label" x="0" y="90"
      fill={selected ? '#03070e' : colors[index % colors.length]}>{label}</text>
  </g>
  {#if selected}
    <g mask={`url(#${clipId})`}>
      <g class="label-text"><text class="red-label" x="0" y="90" fill="#ff161b">{label}</text></g>
    </g>
  {/if}
</svg>

<style>
  .menu-label {
    display: block;
    height: 1em;
    flex: none;
    overflow: visible;
    pointer-events: none;
  }
  text {
    font-family: var(--menu-display, var(--display));
    font-size: 100px;
    font-style: italic;
    font-weight: 900;
    letter-spacing: -.09em;
  }
  .label-text { transform-origin: left center; }
  .active .label-text { animation: label-pop 310ms cubic-bezier(.16, 1, .3, 1) both; }
  .selector-shape {
    transform-origin: -135px 110px;
    animation: selector-in 300ms cubic-bezier(.16, 1, .3, 1) both;
  }
  .pink-pulse {
    transform-origin: -135px 110px;
    animation: selector-pulse 1100ms ease-in-out infinite alternate;
  }
  @keyframes label-pop {
    0% { transform: translateX(-9px) scale(.92); }
    55% { transform: translateX(3px) scale(1.025); }
    100% { transform: translateX(0) scale(1); }
  }
  @keyframes selector-in {
    from { transform: scaleX(.65); opacity: .2; }
    to { transform: scaleX(1); opacity: 1; }
  }
  @keyframes selector-pulse {
    from { transform: scale(1); }
    to { transform: scale(1.018, 1.04); }
  }
  :global(.reduce-motion) .label-text,
  :global(.reduce-motion) .selector-shape,
  :global(.reduce-motion) .pink-pulse { animation: none; }
  @media (prefers-reduced-motion: reduce) {
    .label-text, .selector-shape, .pink-pulse { animation: none !important; }
  }
</style>
