<script lang="ts">
  import { onMount } from 'svelte';
  import TriangleBackground from '$lib/TriangleBackground.svelte';
  import VideoBackground from '$lib/VideoBackground.svelte';
  import MenuLabel from '$lib/MenuLabel.svelte';
  import { goto } from '$app/navigation';
  import { usePortfolioExperience } from '$lib/portfolioExperience';
  import { attachMenuWheel } from '$lib/menuWheel';
  import { options, profile, type ChapterId } from '$lib/portfolio';

  let active = $state(0);
  let controls: HTMLAnchorElement[] = [];
  let dateLabel = $state('PERSONAL');
  let dayLabel = $state('PORTFOLIO');
  const experience = usePortfolioExperience();
  const reducedMotion = $derived(experience.state.reducedMotion);
  const { playTone } = experience;
  const selected = $derived(options[active]);

  onMount(() => {
    const updateDate = () => {
      const now = new Date();
      dateLabel = now.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit' });
      dayLabel = now.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();
    };
    updateDate();
    const timer = window.setInterval(updateDate, 60000);
    const removeWheel = attachMenuWheel(direction => select((active + direction + options.length) % options.length));
    return () => {
      clearInterval(timer);
      removeWheel();
    };
  });

  function select(index: number) {
    if (active === index) return;
    playTone();
    active = index;
  }
  function navigate(event: KeyboardEvent, index: number) {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    let next = index;
    if (event.key === 'ArrowDown' || event.key.toLowerCase() === 's') next = (index + 1) % options.length;
    else if (event.key === 'ArrowUp' || event.key.toLowerCase() === 'w') next = (index - 1 + options.length) % options.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = options.length - 1;
    else return;
    event.preventDefault();
    select(next);
    controls[next]?.focus();
  }
  function navigateFromPage(event: KeyboardEvent) {
    if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return;
    const target = event.target;
    if (target instanceof Element && target.closest('button, a, input, textarea, select, [contenteditable="true"]')) return;
    if (event.key === 'Enter') {
      event.preventDefault();
      controls[active]?.focus();
      void openChapter(selected.id);
    } else navigate(event, active);
  }
  async function openChapter(id: ChapterId) {
    playTone('confirm');
    await goto(`/${id}`);
  }
</script>

<svelte:window onkeydown={navigateFromPage} />

<svelte:head>
  <title>{profile.name} / Portfolio Reload</title>
  <meta name="description" content="Gabriel Cruz — computer science and mathematics student exploring software, systems, and embedded development." />
</svelte:head>

<div class="reload-shell" class:reduce-motion={reducedMotion}>
  <VideoBackground {reducedMotion} />
  <div class="art-shade" aria-hidden="true"></div>
  <TriangleBackground {active} {reducedMotion} />
  <div class="side-counter" aria-hidden="true">0{active + 1}</div>
  <div class="screen-texture" aria-hidden="true"></div>

  <header class="hud">
    <div class="nameplate"><span class="nameplate-small">PLAYER PROFILE / 001 <span class="profile-date">{dateLabel} · {dayLabel}</span></span><h1>{profile.name}</h1><span class="nameplate-school">CS + MATHEMATICS <span>／</span> GEORGIA TECH</span></div>
  </header>

  <main class="menu-area">
    <nav class="pause-menu" aria-label="Portfolio navigation">
      {#each options as option, i}
        <div class="option-wrap" class:active={active === i} style={`--angle:${option.rotation}deg;--offset:${option.offsetX}px;--lift:${option.offsetY}px;--order:${i};z-index:${option.zIndex}`}>
          <a bind:this={controls[i]} href={`/${option.id}`} class="menu-option" class:selected={active === i}
            aria-label={option.name} onmouseenter={() => select(i)} onfocus={() => select(i)}
            onkeydown={(event: KeyboardEvent) => navigate(event, i)} onclick={() => playTone('confirm')}>
            <MenuLabel label={option.name} index={i} selected={active === i} />
          </a>
        </div>
      {/each}
    </nav>
  </main>

  <div class="menu-bottom">
    <div class="description-ribbon">
      {#key active}
        <span class="ribbon-index">0{active + 1}</span><div class="ribbon-copy"><span class="ribbon-title">{selected.name}</span><p>{selected.description}</p><div class="command-rule"><span>Command</span><span class="command-line"></span></div></div>
      {/key}
    </div>
    <footer class="controls-bar">
      <span class="edition">GABRIEL CRUZ <span>／</span> PORTFOLIO RELOAD</span>
      <div class="key-guide"><span><kbd>↑↓</kbd> Select</span><span><kbd>↵</kbd> Confirm</span></div>
      <span class="touch-guide">TAP TO OPEN</span>
    </footer>
  </div>

</div>
