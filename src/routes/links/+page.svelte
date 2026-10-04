<script lang="ts">
  import { goto } from '$app/navigation';
  import { tick } from 'svelte';
  import { contactLinks } from '$lib/contactLinks';
  import { profile } from '$lib/portfolio';
  import { usePortfolioExperience } from '$lib/portfolioExperience';
  import VideoBackground from '$lib/VideoBackground.svelte';

  const experience = usePortfolioExperience();
  let active = $state(0);
  let rows: HTMLElement[] = [];
  const selected = $derived(contactLinks[active]);

  async function selectLink(index: number, focus = false) {
    const next = (index + contactLinks.length) % contactLinks.length;
    if (active !== next) experience.playTone('select');
    active = next;
    await tick();
    if (focus) rows[next]?.focus({ preventScroll: true });
  }

  function handleKey(event: KeyboardEvent) {
    if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return;
    const target = event.target;
    if (target instanceof HTMLElement && (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName))) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      experience.playTone('back');
      void goto('/');
      return;
    }
    if (target instanceof Element && target.closest('.global-settings, .links-back')) return;
    let next: number | undefined;
    if (event.key === 'ArrowDown' || event.key.toLowerCase() === 's') next = active + 1;
    if (event.key === 'ArrowUp' || event.key.toLowerCase() === 'w') next = active - 1;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = contactLinks.length - 1;
    if (next !== undefined) {
      event.preventDefault();
      void selectLink(next, true);
      return;
    }
    if (event.key === 'Enter' && !(target instanceof Element && target.closest('a, button'))) {
      event.preventDefault();
      rows[active]?.focus({ preventScroll: true });
      rows[active]?.click();
    }
  }
</script>

<svelte:head>
  <title>Links — {profile.name}</title>
  <meta name="description" content="Find Gabriel Cruz’s code, connect professionally, or get in touch." />
</svelte:head>

<svelte:window onkeydown={handleKey} />

<main class="links-screen" class:reduce-motion={experience.state.reducedMotion}>
  <div class="links-art" aria-hidden="true"><VideoBackground reducedMotion={experience.state.reducedMotion} /></div>
  <div class="nav-shade" aria-hidden="true"></div>
  <div class="links-content">
    <div class="links-info" aria-live="polite">
      <span class="info-label">Info</span>
      <p id="link-description">{selected.description}</p>
    </div>

    <nav class="links-list" aria-label="Contact links">
      {#each contactLinks as link, index (link.id)}
        <svelte:element this={link.href ? 'a' : 'button'} bind:this={rows[index]} role={link.href ? 'link' : 'button'}
          id={`link-${link.id}`} class="link-option" class:selected={active === index}
          href={link.href} type={link.href ? undefined : 'button'}
          target={link.href && link.newTab ? '_blank' : undefined}
          rel={link.href && link.newTab ? 'noopener noreferrer' : undefined}
          aria-current={link.href && active === index ? 'true' : undefined}
          aria-pressed={link.href ? undefined : active === index}
          aria-describedby="link-description"
          onmouseenter={() => selectLink(index)} onfocus={() => selectLink(index)}
          onclick={() => { experience.playTone('confirm'); void selectLink(index); }}>
          <span class="link-name">{link.name}</span>
          {#if !link.href}<span class="pending-mark">Coming soon</span>{/if}
        </svelte:element>
      {/each}
    </nav>

    <div class="link-destination" aria-live="polite">
      <span>{selected.href ? 'DESTINATION' : 'LINK PENDING'}</span>
      <p>{selected.value || 'Coming soon'}</p>
      {#if selected.newTab && selected.href}<small>Opens in a new tab <i aria-hidden="true">↗</i></small>{/if}
    </div>
  </div>

  <aside class="links-thanks" aria-label="Thank-you message">
    <p>Thanks for visiting my website.</p>
  </aside>

  <footer class="links-footer">
    <h1 class="background-word">LINKS</h1>
    <div class="links-guide">
      <p>Where do you want to go?</p>
      <span><b>Guide</b><i></i></span>
      <small>↑ ↓ Select a link</small>
    </div>
    <div class="links-actions">
      {#if selected.href}
        <a class="links-open" href={selected.href} target={selected.newTab ? '_blank' : undefined}
          rel={selected.newTab ? 'noopener noreferrer' : undefined} onclick={() => experience.playTone('confirm')}
          aria-label={`Open ${selected.name}`}><kbd>↵</kbd> Confirm</a>
      {:else}
        <button type="button" class="links-open" disabled><kbd>↵</kbd> Coming soon</button>
      {/if}
      <a class="links-back" href="/" onclick={() => experience.playTone('back')}><kbd>ESC</kbd> Back</a>
    </div>
  </footer>
</main>

<style>
  .links-screen { position: relative; isolation: isolate; display: grid; grid-template-rows: minmax(0, 1fr) max(132px, 19dvh); width: 100%; height: 100vh; height: 100dvh; overflow: hidden; background: #15234c; color: #24eeeb; }
  .links-art { position: absolute; z-index: -4; inset: 0 0 0 auto; width: 66%; overflow: hidden; isolation: isolate; }
  .links-art :global(.video-background video) { object-position: left center; }
  .nav-shade { position: absolute; z-index: -3; inset: 0; pointer-events: none; background: linear-gradient(90deg, #17234ff5 0%, #17234ff5 41%, #17234fc7 56%, #0919522b 78%); }
  .links-content { min-height: 0; padding-top: clamp(25px, 6.2dvh, 70px); }
  .links-info { display: flex; align-items: flex-start; gap: 14px; width: min(720px, 78%); margin-left: 8%; padding-right: 20px; }
  .info-label { flex-shrink: 0; margin-top: .32em; padding: 0 13px 1px; border: 2px solid #24eeeb; border-radius: 9px; font: 600 18px/1 var(--display); }
  .links-info > p { margin: 0; font: 600 clamp(23px, 2.4vw, 37px)/1.16 var(--display); text-shadow: 0 2px 5px #09123780; }
  .links-list { display: grid; gap: clamp(5px, 1.3dvh, 13px); width: min(45%, 680px); margin-top: clamp(34px, 10dvh, 110px); }
  .link-option { position: relative; display: flex; align-items: center; justify-content: flex-end; gap: 16px; min-height: clamp(53px, 8.2dvh, 85px); width: 100%; padding: 8px 18% 8px 12%; border: 0; border-radius: 0 8px 8px 0; color: #24eeeb; background: transparent; text-align: right; font: 600 clamp(29px, 3.05vw, 46px)/1.05 var(--display); transition: color .14s, background .14s; }
  .link-option.selected { color: #061225; background: white; box-shadow: inset 0 5px #ff315f; }
  .link-option:focus-visible { outline: 0; box-shadow: inset 0 0 0 3px #ff315f; }
  .link-name { min-width: 0; }
  .pending-mark { position: absolute; right: 5%; bottom: 8px; color: #87c7d0; font: 500 8px/1 'DM Sans', sans-serif; letter-spacing: .4px; }
  .link-option.selected .pending-mark { color: #45647a; }
  .link-destination { width: min(520px, 37%); margin: clamp(15px, 3.7dvh, 40px) 0 0 8%; }
  .link-destination > span { color: #97c7d1; font-size: 8px; font-weight: 600; letter-spacing: 1.7px; }
  .link-destination > p { margin: 6px 0 0; color: #c7ffff; font-size: clamp(10px, 1vw, 13px); line-height: 1.5; overflow-wrap: anywhere; }
  .link-destination > small { display: block; margin-top: 7px; color: #92becd; font-size: 9px; }
  .link-destination i { font-style: normal; margin-left: 5px; }
  .links-thanks { position: absolute; top: 28dvh; right: 8%; width: 34%; padding-top: 22px; border-top: 3px solid #24eeeb; }
  .links-thanks > p { margin: 0; color: #fff; text-shadow: 0 2px 8px #071743; font: italic 800 clamp(35px, 4.2vw, 62px)/1.1 var(--display); }
  .links-footer { position: relative; isolation: isolate; display: grid; grid-template-rows: minmax(0, 1fr) auto; justify-items: end; align-items: end; min-height: 0; padding: 18px 4% max(18px, env(safe-area-inset-bottom)); overflow: hidden; background: white; color: #123888; }
  .background-word { position: absolute; z-index: -1; bottom: -.1em; left: -1%; margin: 0; color: #bfc0c4; font: italic 900 clamp(112px, 19dvh, 205px)/.9 var(--menu-display); letter-spacing: -.045em; pointer-events: none; }
  .links-guide { width: min(410px, 43%); padding-bottom: 13px; color: #17346d; }
  .links-guide > p { margin: 0; font: italic 800 clamp(25px, 2.5vw, 38px)/1 var(--display); text-shadow: 1px 1px white; }
  .links-guide > span { display: flex; align-items: center; gap: 7px; margin-top: 5px; }
  .links-guide b { font-size: 8px; font-weight: 500; }
  .links-guide i { flex: 1; height: 2px; background: #17346d; }
  .links-guide small { display: block; margin-top: 6px; font-size: 9px; }
  .links-actions { display: flex; align-items: center; gap: 25px; }
  .links-actions > a, .links-actions > button { display: inline-flex; align-items: center; gap: 8px; padding: 0; border: 0; background: transparent; color: #183777; font: italic 800 24px/1 var(--display); }
  .links-actions > button:disabled { opacity: .55; }
  .links-actions kbd { display: grid; place-items: center; min-width: 30px; height: 29px; padding: 0 6px; border: 2px solid white; border-radius: 50%; background: #133577; box-shadow: 0 0 0 2px #7787ad; color: white; font: 700 10px/1 'DM Sans', sans-serif; }
  .links-open kbd { font-size: 18px; }
  :global(.portfolio-frame:has(.links-screen) .global-settings .setting) { color: #153984; }
  :global(.portfolio-frame:has(.links-screen) .global-settings .setting > span) { color: #0756bf; }
  .reduce-motion .link-option { transition: none; }
  @media (max-width: 1000px) {
    .links-list { width: 49%; }
    .link-option { padding-right: 16%; }
    .link-destination { width: 40%; }
    .links-guide { width: 45%; }
  }
  @media (max-width: 600px) {
    .links-screen { grid-template-rows: minmax(0, 1fr) max(154px, calc(var(--shared-controls-height, 28px) + 110px)); }
    .links-art { width: 100%; }
    .links-art :global(.video-background video) { object-position: 52% center; }
    .nav-shade { background: linear-gradient(90deg, #17234ff5, #17234fe0 65%, #17234f90); }
    .links-content { padding-top: 35px; }
    .links-info { gap: 10px; width: 90%; margin-left: 7%; padding-right: 0; }
    .info-label { margin-top: 4px; padding: 0 9px 1px; font-size: 15px; }
    .links-info > p { min-height: 52px; font-size: 25px; line-height: 1.12; }
    .links-list { width: 52%; margin-top: 37px; gap: 9px; }
    .link-option { min-height: 65px; padding-right: 16%; font-size: 34px; }
    .links-thanks { top: 154px; right: 4%; width: 42%; padding-top: 15px; border-top-width: 2px; }
    .links-thanks > p { font-size: 28px; }
    .link-destination { width: 80%; margin-top: 28px; margin-left: 7%; }
    .link-destination > p { font-size: 11px; }
    .links-footer { align-content: start; justify-items: stretch; padding: 16px 5% 54px; }
    .background-word { font-size: 115px; bottom: 21px; opacity: .45; }
    .links-guide { width: 100%; padding-bottom: 10px; }
    .links-guide > p { font-size: 28px; }
    .links-guide small { display: none; }
    .links-actions { justify-content: flex-end; gap: 20px; }
    .links-actions > a, .links-actions > button { font-size: 20px; }
    .links-actions kbd { min-width: 27px; height: 25px; font-size: 8px; }
    .links-open kbd { font-size: 16px; }
  }
  @media (max-width: 600px) and (max-height: 650px) {
    .links-screen { grid-template-rows: minmax(0, 1fr) max(146px, calc(var(--shared-controls-height, 28px) + 108px)); }
    .links-content { padding-top: 22px; }
    .links-info > p { min-height: 46px; font-size: 22px; }
    .links-info { gap: 8px; }
    .links-list { margin-top: 24px; gap: 6px; }
    .link-option { min-height: 49px; font-size: 29px; }
    .links-thanks { top: 130px; padding-top: 12px; }
    .links-thanks > p { font-size: 24px; }
    .link-destination { margin-top: 18px; }
    .link-destination > small { margin-top: 4px; font-size: 8px; }
    .links-footer { padding-top: 12px; }
    .links-guide > p { font-size: 25px; }
    .links-actions > a, .links-actions > button { font-size: 18px; }
  }
  @media (min-width: 601px) and (max-height: 550px) {
    .links-screen { grid-template-rows: minmax(0, 1fr) 90px; }
    .links-content { padding-top: 20px; }
    .links-info > p { font-size: 23px; }
    .links-info { gap: 10px; }
    .info-label { font-size: 15px; }
    .links-list { margin-top: 24px; gap: 4px; }
    .link-option { min-height: 43px; padding-top: 4px; padding-bottom: 4px; font-size: 28px; }
    .link-destination { width: 40%; margin: 8px 0 0 8%; }
    .link-destination > span { display: block; font-size: 7px; line-height: 1; }
    .link-destination > p { margin-top: 3px; font-size: 9px; }
    .link-destination > small { display: none; }
    .links-thanks { top: 92px; right: 4%; width: 28%; padding-top: 14px; border-top-width: 2px; }
    .links-thanks > p { font-size: 31px; }
    .links-footer { padding-top: 12px; padding-bottom: 13px; }
    .background-word { font-size: 100px; }
    .links-guide { padding-bottom: 9px; }
    .links-guide > p { font-size: 25px; }
    .links-guide small { display: none; }
    .links-actions > a, .links-actions > button { font-size: 19px; }
    .links-actions kbd { height: 24px; min-width: 26px; }
  }
</style>
