<script lang="ts">
  import '../app.css';
  import { onMount } from 'svelte';
  import BackgroundMusic from '$lib/BackgroundMusic.svelte';
  import { createPortfolioExperience, providePortfolioExperience } from '$lib/portfolioExperience';

  let { children } = $props();
  const settings = $state({ soundOn: true, soundUnavailable: false, reducedMotion: false, systemReduced: false });
  const experience = createPortfolioExperience(settings);
  providePortfolioExperience(experience);
  let controls: HTMLDivElement;
  let controlsHeight = $state(28);

  onMount(() => {
    const measure = () => { controlsHeight = Math.ceil(controls.getBoundingClientRect().height); };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(controls);
    return () => observer.disconnect();
  });
</script>

<div class="portfolio-frame" style={`--shared-controls-height:${controlsHeight}px`}>
  {@render children()}
  <div bind:this={controls} class="global-settings" role="group" aria-label="Audio and motion settings">
    <BackgroundMusic />
    <button class="setting" aria-label="Toggle menu sounds" aria-pressed={settings.soundOn} onclick={experience.toggleSound} disabled={settings.soundUnavailable}>SOUND <span>{settings.soundUnavailable ? 'UNAVAILABLE' : settings.soundOn ? 'ON' : 'OFF'}</span></button>
    <button class="setting" aria-label="Reduce motion" aria-pressed={settings.reducedMotion} onclick={experience.toggleMotion} disabled={settings.systemReduced}>MOTION <span>{settings.reducedMotion ? 'REDUCED' : 'ON'}</span></button>
  </div>
</div>

<style>
  .portfolio-frame { height: 100vh; height: 100dvh; overflow: hidden; }
  .global-settings {
    position: fixed;
    left: 4%;
    bottom: max(13px, env(safe-area-inset-bottom));
    z-index: 50;
    display: flex;
    align-items: center;
    gap: 4px 20px;
    flex-wrap: wrap;
    max-width: min(500px, calc(100vw - 320px));
  }
  @media (max-width: 600px) {
    .global-settings {
      left: 5%;
      bottom: max(12px, env(safe-area-inset-bottom));
      max-width: calc(100vw - 125px);
      gap: 4px 12px;
    }
  }
</style>
