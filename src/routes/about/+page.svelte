<script lang="ts">
  import { goto } from '$app/navigation';
  import { onMount, tick } from 'svelte';
  import { externalLink, profile } from '$lib/portfolio';
  import { usePortfolioExperience } from '$lib/portfolioExperience';
  import { attachMenuWheel } from '$lib/menuWheel';

  const experience = usePortfolioExperience();
  const sections = [
    { id: 'profile', number: '01', label: 'PROFILE', title: 'Meet Gabriel', summary: profile.bio },
    { id: 'background', number: '02', label: 'BACKGROUND', title: 'My experience', summary: profile.background },
    { id: 'interests', number: '03', label: 'INTERESTS', title: 'Outside class', summary: profile.interests },
  ];
  let active = $state(0);
  let tabs: HTMLButtonElement[] = [];
  const selected = $derived(sections[active]);

  async function selectSection(index: number, focus = false) {
    const next = (index + sections.length) % sections.length;
    if (next !== active) experience.playTone('select');
    active = next;
    if (focus) {
      await tick();
      tabs[next]?.focus({ preventScroll: true });
    }
  }

  onMount(() => attachMenuWheel(direction => { void selectSection(active + direction); }));

  function playBack() { experience.playTone('back'); }

  function handleKey(event: KeyboardEvent) {
    if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return;
    const target = event.target;
    if (target instanceof HTMLElement && (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName))) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      playBack();
      void goto('/');
      return;
    }
    if (target instanceof Element && target.closest('.about-details, .global-settings, a')) return;
    let next: number | undefined;
    if (event.key === 'ArrowDown' || event.key === 'ArrowRight' || event.key.toLowerCase() === 's') next = active + 1;
    if (event.key === 'ArrowUp' || event.key === 'ArrowLeft' || event.key.toLowerCase() === 'w') next = active - 1;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = sections.length - 1;
    if (next !== undefined) { event.preventDefault(); void selectSection(next, true); }
  }
</script>

<svelte:head>
  <title>About Me — {profile.name}</title>
  <meta name="description" content={`${profile.name} — ${profile.intro} My background and interests.`} />
</svelte:head>

<svelte:window onkeydown={handleKey} />

<main class="about-screen" class:reduce-motion={experience.state.reducedMotion}>
  <div class="water-light" aria-hidden="true"></div>
  <div class="photo-accent" aria-hidden="true"></div>
  <figure class="portrait">
    <img src="/gabriel-portrait.jpg" alt="Gabriel Cruz at Old Trafford" width="1500" height="2000" fetchpriority="high" />
  </figure>
  <div class="shards" aria-hidden="true">
    {#each Array(6) as _, index}<span style={`--shard:${index}`}></span>{/each}
  </div>

  <header class="about-header">
    <h1>ABOUT ME</h1>
    <a class="header-back" href="/" onclick={playBack} aria-label="Back to the main menu"><span aria-hidden="true">↖</span> MENU</a>
  </header>

  <div class="about-body">
    <div class="dossier-flow">
      <section class="section-navigation" aria-label="About Me sections">
        <p class="list-caption"><span aria-hidden="true">✦</span> {profile.name}</p>
        <div class="section-list" role="tablist" aria-label="About Me sections" aria-orientation="vertical">
          {#each sections as section, index}
            <button bind:this={tabs[index]} class="section-tab" class:selected={active === index} type="button" role="tab"
              id={`about-tab-${section.id}`} aria-selected={active === index} aria-controls="about-details" tabindex={active === index ? 0 : -1}
              onclick={() => selectSection(index)}>
              <span class="selection-crystal" aria-hidden="true"></span>
              <span class="category">{section.label}</span>
              <span class="section-number" aria-hidden="true">{section.number}</span>
              <span class="section-title">{section.title}</span>
            </button>
          {/each}
        </div>
      </section>

      <div class="about-details" id="about-details" role="tabpanel" aria-labelledby={`about-tab-${selected.id}`} tabindex="0">
        {#key selected.id}
          <div class="section-content">
            <p class="detail-kicker">PERSONAL FILE <span>／ {selected.number}</span></p>
            <h2>{selected.label}</h2>
            <p class="section-summary">{selected.summary}</p>
            {#if selected.id === 'profile' && externalLink(profile.github)}
              <a class="github-link" href={externalLink(profile.github)} target="_blank" rel="noopener noreferrer" onclick={() => experience.playTone('confirm')}>
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
                  <path d="M12 .75a11.25 11.25 0 0 0-3.56 21.92c.56.1.77-.24.77-.54v-2.1c-3.14.68-3.8-1.33-3.8-1.33-.51-1.3-1.25-1.65-1.25-1.65-1.02-.7.08-.68.08-.68 1.13.08 1.73 1.16 1.73 1.16 1 1.72 2.64 1.22 3.28.94.1-.73.39-1.22.71-1.5-2.5-.29-5.13-1.25-5.13-5.56 0-1.23.44-2.24 1.16-3.03-.12-.29-.5-1.44.11-3 0 0 .95-.3 3.09 1.16a10.7 10.7 0 0 1 5.62 0c2.15-1.46 3.09-1.16 3.09-1.16.62 1.56.23 2.71.12 3 .72.79 1.15 1.8 1.15 3.03 0 4.32-2.63 5.27-5.14 5.55.4.35.76 1.04.76 2.09v3.08c0 .3.2.65.78.54A11.25 11.25 0 0 0 12 .75Z" />
                </svg>
                <span>Open on GitHub <span aria-hidden="true">↗</span></span>
              </a>
            {/if}
            {#if selected.id === 'background'}
              <p class="detail-meta">{profile.internshipDates} <span>／</span> {profile.internshipLocation}</p>
            {/if}
          </div>
        {/key}
      </div>
    </div>
  </div>

  <footer class="about-footer">
    <div class="guide">
      <p>Scroll to explore.</p>
      <div class="guide-controls">
        <span class="navigate-hint"><kbd>↑</kbd><kbd>↓</kbd> Select</span>
        <a href="/" onclick={playBack}><kbd>ESC</kbd> Back to menu</a>
      </div>
    </div>
  </footer>
</main>

<style>
  .about-screen {
    position: relative; isolation: isolate; height: 100vh; height: 100dvh; min-height: 0; overflow: hidden;
    display: grid; grid-template-columns: minmax(0, 1fr); grid-template-rows: 20% minmax(0, 1fr) auto;
    color: #41fbff; background: radial-gradient(ellipse at 15% 0, #086ceb 0%, transparent 65%), linear-gradient(150deg, #063ad2, #0719a7 50%, #020751);
  }
  .water-light { position: absolute; z-index: -4; inset: -4%; pointer-events: none; background: repeating-linear-gradient(165deg, transparent 0 15%, #63faff09 17%, transparent 20% 30%); animation: water-drift 20s ease-in-out infinite alternate; }
  .portrait, .photo-accent { position: absolute; inset: 12% -1% -2% 50%; margin: 0; pointer-events: none; }
  .photo-accent { z-index: -3; background: #ff6bd5; clip-path: polygon(18% 0, 22% 0, 9% 50%, 2% 100%, 0 100%, 7% 50%); }
  .portrait { z-index: -2; clip-path: polygon(22% 0, 100% 0, 100% 100%, 2% 100%, 9% 50%); }
  .portrait img { width: 100%; height: 100%; object-fit: cover; object-position: 50% 75%; display: block; }
  .portrait::after { content: ''; position: absolute; inset: 0; background: linear-gradient(90deg, #071aa960, transparent 35%), linear-gradient(0deg, #020751d9, transparent 24%); }
  .about-header { position: relative; min-height: 0; min-width: 0; }
  .about-header::before { content: ''; position: absolute; inset: 0 -1% -16% -1%; z-index: -1; background: white; clip-path: polygon(0 0, 76% 0, 66% 68%, 0 100%); }
  h1 { color: #d9d9d9; font: italic 900 min(18vw, 21dvh)/.85 var(--menu-display); letter-spacing: -.075em; white-space: nowrap; margin: -.02em 0 0 -.04em; transform: skew(-3deg); }
  .header-back { position: absolute; top: 20px; right: 4%; display: flex; gap: 9px; align-items: center; font-size: 11px; font-weight: 700; letter-spacing: 1.5px; color: #d1ffff; background: #000a5fbc; padding: 9px 13px; border-bottom: 2px solid #ff6bd5; }
  .header-back span { color: #ff6bd5; font-size: 19px; line-height: .8; }
  .about-body { min-height: 0; min-width: 0; padding: 1.8vh 4% 0; container-type: size; }
  .dossier-flow { width: 55%; height: 100%; min-height: 0; display: grid; grid-template-rows: auto minmax(0, 1fr); gap: min(2.8cqh, 24px); }
  .section-navigation { min-width: 0; }
  .list-caption { font-size: 10px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: #c2fbff; margin: 0 0 12px 6%; display: flex; gap: 9px; align-items: center; }
  .list-caption span { color: #ff6bd5; font-size: 17px; }
  .section-list { display: grid; gap: min(1.5cqh, 11px); }
  .section-tab { position: relative; display: flex; align-items: center; gap: 12px; width: 100%; min-width: 0; height: min(9cqh, 67px); min-height: 36px; padding: 4px 3% 4px 6%; border: 0; border-top: 4px solid transparent; color: #32fdff; background: transparent; text-align: left; transition: background .12s, color .12s; }
  .category { display: flex; align-items: center; justify-content: center; align-self: stretch; flex: 0 0 46%; min-width: 0; padding: 0 6px; font: italic 800 clamp(18px, 2.6vw, 40px)/1 var(--display); color: #29f9ff; background: #001454; }
  .section-number { flex-shrink: 0; font: italic 600 clamp(24px, 3.3vw, 48px)/1 var(--display); color: inherit; }
  .section-title { font: 600 clamp(16px, 2.1vw, 30px)/1.05 var(--display); color: inherit; white-space: nowrap; }
  .section-tab.selected { color: #070b23; background: #fff; border-top-color: #fe222e; border-radius: 0 6px 0 0; }
  .selected .category { background: #05e4ed; color: #071946; }
  .selection-crystal { position: absolute; left: 0; top: 50%; width: min(3.2vw, 44px); height: min(4vw, 54px); background: linear-gradient(140deg, #8bffff, #42dfff 43%, #f6ffff 46%, #23b8ff 51%, #004cb5); border: 1px solid #b9ffff; box-shadow: 0 0 0 2px #023b6f; transform: translate(-25%, -50%) rotate(-23deg); opacity: 0; pointer-events: none; }
  .selected .selection-crystal { opacity: 1; animation: crystal-enter .22s ease-out both, crystal-glow 2.5s ease-in-out infinite .22s; }
  .about-details { align-self: center; min-height: 0; min-width: 0; padding: 0 6%; color: white; border-left: 2px solid transparent; }
  .about-details:focus-visible { outline: none; border-left-color: #ff6bd5; }
  .section-content { animation: details-enter .22s ease-out both; }
  .detail-kicker { margin: 0 0 8px; font-size: 9px; letter-spacing: 2.3px; color: #b2faff; }
  .detail-kicker span { color: #ff84dc; }
  h2 { font: italic 900 clamp(32px, 4.2vw, 58px)/.96 var(--display); color: #4cf4fc; margin: 0; letter-spacing: -.02em; }
  .section-summary { margin: 12px 0 0; max-width: 610px; color: #f0f9ff; font-size: clamp(13px, 1.25vw, 18px); line-height: 1.65; }
  .github-link { display: inline-flex; align-items: center; gap: 8px; min-height: 28px; margin-top: 12px; color: #d1ffff; font-size: 12px; font-weight: 700; border-bottom: 1px solid #55ebff; }
  .github-link svg { flex-shrink: 0; }
  .github-link:hover { color: white; border-color: #ff6bd5; }
  .github-link:focus-visible { outline: 2px solid #ff6bd5; outline-offset: 4px; }
  .detail-meta { font-size: 10px; color: #9dddff; letter-spacing: .5px; margin: 11px 0 0; }
  .detail-meta span { color: #ff6bd5; padding: 0 5px; }
  .about-footer { display: flex; justify-content: flex-end; min-width: 0; padding: 10px 4% 18px 260px; min-height: max(54px, calc(var(--shared-controls-height, 28px) + 26px)); }
  .guide { min-width: 0; width: min(360px, 100%); }
  .guide p { font: italic 800 clamp(23px, 2.5vw, 34px)/1 var(--display); color: white; margin: 0 0 9px; text-shadow: 2px 2px #02093c; }
  .guide-controls { display: flex; justify-content: space-between; align-items: center; gap: 14px; color: #eafcff; font: italic 700 17px/1 var(--display); }
  .guide-controls a, .navigate-hint { display: inline-flex; align-items: center; gap: 5px; white-space: nowrap; }
  kbd { display: inline-flex; align-items: center; justify-content: center; border: 1.5px solid #c4faff; border-radius: 20px; min-width: 24px; height: 24px; padding: 0 5px; font: 600 10px/1 'DM Sans', sans-serif; box-shadow: 0 0 0 2px #021261; }
  .shards { position: absolute; z-index: -1; inset: 0; pointer-events: none; overflow: hidden; }
  .shards span { position: absolute; width: calc(9px + var(--shard) * 2px); height: calc(18px + var(--shard) * 3px); left: calc(11% + var(--shard) * 7%); top: calc(27% + var(--shard) * 11%); background: #ff55d5; clip-path: polygon(0 0, 100% 25%, 60% 100%, 15% 74%); opacity: .6; animation: shard-drift calc(7s + var(--shard) * 1.6s) ease-in-out infinite alternate; animation-delay: calc(var(--shard) * -2s); }
  @keyframes shard-drift { from { transform: translate(0, 12px) rotate(-20deg); } to { transform: translate(23px, -38px) rotate(45deg); } }
  @keyframes water-drift { to { transform: translateY(3%) scale(1.06); } }
  @keyframes crystal-enter { from { opacity: 0; translate: -10px 0; } to { opacity: 1; translate: 0 0; } }
  @keyframes crystal-glow { 50% { filter: brightness(1.25); } }
  @keyframes details-enter { from { opacity: 0; transform: translateX(10px); } to { opacity: 1; transform: translateX(0); } }
  @media (max-width: 900px) {
    .dossier-flow { width: 55%; }
    .section-tab { gap: 8px; }
    .category { font-size: clamp(17px, 2.7vw, 27px); }
    .section-title { font-size: clamp(15px, 2vw, 22px); }
    .section-number { font-size: clamp(25px, 3.3vw, 36px); }
  }
  @media (max-width: 600px) {
    .about-screen { grid-template-rows: 12% minmax(0, 1fr) auto; }
    h1 { font-size: min(18vw, 12dvh); margin-top: .1em; }
    .about-header::before { inset: 0 -1% -20% -1%; clip-path: polygon(0 0, 97% 0, 78% 64%, 0 100%); }
    .header-back { top: auto; bottom: 0; right: 4%; font-size: 9px; padding: 6px 8px; letter-spacing: 1px; }
    .header-back span { font-size: 15px; }
    .portrait, .photo-accent { inset: 14% -8% auto 48%; height: min(42dvh, 350px); }
    .portrait::after { background: linear-gradient(0deg, #0719a7, transparent 30%); }
    .about-body { padding: 12px 5% 0 4%; }
    .dossier-flow { width: 100%; gap: 14px; }
    .section-navigation { width: 62%; }
    .list-caption { font-size: 9px; letter-spacing: 1px; margin-bottom: 10px; }
    .section-list { gap: min(1.5cqh, 9px); }
    .section-tab { height: min(8.5cqh, 52px); min-height: 36px; padding: 3px 5% 3px 8%; border-top-width: 3px; gap: 8px; }
    .category { flex: 1; font-size: clamp(20px, 5.4vw, 25px); padding: 0 3px; }
    .section-number { font-size: 27px; }
    .section-title { display: none; }
    .selection-crystal { width: 24px; height: 33px; }
    .about-details { padding: 0 2% 0 6%; align-self: center; }
    h2 { font-size: 38px; }
    .section-summary { font-size: 13px; line-height: 1.65; margin-top: 11px; }
    .detail-meta { font-size: 9px; line-height: 1.5; }
    .about-footer { padding: 8px 5% 15px 185px; }
    .guide p, .navigate-hint { display: none; }
    .guide-controls { justify-content: flex-end; font-size: 17px; }
  }
  @media (max-height: 690px) and (max-width: 600px) {
    .about-body { padding-top: 10px; }
    .dossier-flow { gap: 8px; }
    .section-tab { min-height: 34px; height: min(8cqh, 43px); }
    .section-list { gap: 5px; }
    .list-caption { margin-bottom: 7px; }
    h2 { font-size: 32px; }
    .section-summary { font-size: 12px; margin-top: 8px; }
    .detail-kicker { font-size: 8px; margin-bottom: 6px; }
    .detail-meta { margin-top: 8px; }
    .github-link { margin-top: 7px; min-height: 24px; font-size: 11px; }
  }
  @media (max-width: 360px) {
    .category { font-size: 20px; }
    .section-number { font-size: 24px; }
    .section-tab { gap: 6px; }
    .about-footer { padding-left: 180px; }
    .guide-controls { font-size: 15px; }
    h2 { font-size: 30px; }
  }
  @media (max-height: 650px) and (min-width: 601px) {
    .about-screen { grid-template-rows: 18% minmax(0, 1fr) auto; }
    h1 { font-size: min(18vw, 19dvh); }
    .about-body { padding-top: 8px; }
    .dossier-flow { gap: 12px; }
    .section-tab { height: min(9cqh, 47px); min-height: 32px; border-top-width: 3px; }
    .category { font-size: clamp(18px, 2.4vw, 30px); }
    .section-number { font-size: 32px; }
    .section-title { font-size: 23px; }
    .section-list { gap: 6px; }
    .about-details { align-self: center; }
    h2 { font-size: 38px; }
    .section-summary { font-size: 13px; margin-top: 8px; line-height: 1.5; }
    .detail-meta { font-size: 9px; margin-top: 7px; }
    .about-footer { padding-top: 6px; padding-bottom: 14px; }
    .guide p { font-size: 25px; margin-bottom: 7px; }
  }
  @media (max-height: 450px) and (min-width: 601px) {
    .about-screen { grid-template-rows: 17% minmax(0, 1fr) auto; }
    .header-back { top: 12px; padding: 7px 10px; }
    .dossier-flow { gap: 6px; }
    .list-caption { margin-bottom: 4px; font-size: 8px; }
    .list-caption span { font-size: 12px; line-height: 1; }
    .section-tab { height: 29px; min-height: 29px; padding-top: 2px; padding-bottom: 2px; }
    .section-list { gap: 3px; }
    .category { font-size: 20px; }
    .section-number { font-size: 25px; }
    .section-title { font-size: 19px; }
    .detail-kicker { font-size: 8px; margin-bottom: 5px; }
    h2 { font-size: 29px; }
    .section-summary { font-size: 11.5px; margin-top: 6px; line-height: 1.45; }
    .detail-meta { margin-top: 5px; font-size: 8px; }
    .github-link { margin-top: 5px; min-height: 22px; font-size: 10px; }
    .about-footer { padding-top: 5px; padding-bottom: 10px; }
    .guide p { display: none; }
    .guide-controls { font-size: 15px; }
  }
  @media (prefers-reduced-motion: reduce) {
    .about-screen *, .about-screen *::before, .about-screen *::after { animation: none !important; transition: none !important; }
  }
</style>
