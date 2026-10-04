<script lang="ts">
  import { onMount } from 'svelte';

  interface Props {
    reducedMotion?: boolean;
    paused?: boolean;
  }

  let { reducedMotion = false, paused = false }: Props = $props();
  let video = $state<HTMLVideoElement>();
  let mounted = $state(false);
  let hidden = $state(false);
  let disposed = false;

  function updatePlayback() {
    if (!mounted || !video || disposed) return;
    video.muted = true;

    if (reducedMotion || paused || hidden) {
      video.pause();
      return;
    }

    // Browsers can refuse autoplay. Keep the decoded frame visible in that case.
    void video.play().catch(() => {});
  }

  onMount(() => {
    const updateVisibility = () => {
      hidden = document.hidden;
      if (hidden) video?.pause();
    };
    updateVisibility();
    document.addEventListener('visibilitychange', updateVisibility);
    mounted = true;

    return () => {
      disposed = true;
      video?.pause();
      document.removeEventListener('visibilitychange', updateVisibility);
    };
  });

  $effect(() => {
    updatePlayback();
  });
</script>

<div class="video-background" aria-hidden="true">
  <video
    bind:this={video}
    src="/p3r-background.mp4"
    autoplay={!reducedMotion && !paused && !hidden}
    muted
    loop
    playsinline
    preload="auto"
    tabindex="-1"
    onloadeddata={updatePlayback}
  ></video>
</div>

<style>
  .video-background {
    position: absolute;
    inset: 0;
    z-index: -4;
    overflow: hidden;
    pointer-events: none;
    contain: paint;
    background: linear-gradient(180deg, #0bdde8, #057ce2 45%, #0016b9);
  }

  video {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: left center;
    pointer-events: none;
  }

  @media (max-width: 600px) {
    video { object-position: 50% center; }
  }
</style>
