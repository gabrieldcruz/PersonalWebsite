<script lang="ts">
  import { goto } from '$app/navigation';
  import { tick } from 'svelte';
  import { profile } from '$lib/portfolio';
  import { resumes } from '$lib/resumes';
  import { usePortfolioExperience } from '$lib/portfolioExperience';
  import VideoBackground from '$lib/VideoBackground.svelte';

  const experience = usePortfolioExperience();
  let active = $state(0);
  let rows: HTMLButtonElement[] = [];
  const selected = $derived(resumes[active]);

  async function selectResume(index: number, focus = false) {
    const next = (index + resumes.length) % resumes.length;
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
    if (target instanceof Element && target.closest('.global-settings, .resumes-back')) return;
    let next: number | undefined;
    if (event.key === 'ArrowDown' || event.key === 'ArrowRight' || event.key.toLowerCase() === 's') next = active + 1;
    if (event.key === 'ArrowUp' || event.key === 'ArrowLeft' || event.key.toLowerCase() === 'w') next = active - 1;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = resumes.length - 1;
    if (next === undefined) return;
    event.preventDefault();
    void selectResume(next, true);
  }
</script>

<svelte:head>
  <title>Resumes — {profile.name}</title>
  <meta name="description" content="Gabriel Cruz’s software, general technical, and firmware resumes. View or download the version that fits your role." />
</svelte:head>

<svelte:window onkeydown={handleKey} />

<main class="resumes-screen" class:reduce-motion={experience.state.reducedMotion} style={`--resume-accent:${selected.accent}`}>
  <div class="resume-art" aria-hidden="true"><VideoBackground reducedMotion={experience.state.reducedMotion} /></div>
  <div class="paper-ground" aria-hidden="true"></div>
  <div class="paper-shards" aria-hidden="true"><i></i><i></i><i></i></div>
  <h1 class="background-word">RESUMES</h1>

  <header class="resumes-header">
    <div class="file-stamp"><span>GABRIEL CRUZ / PERSONAL FILES</span><p>Choose your loadout.</p></div>
    <span class="file-total">02 <i>/</i> RESUMES</span>
  </header>

  <div class="resumes-body">
    <section class="resume-inventory" aria-label="Available resumes">
      <div class="inventory-heading"><span>SELECT A RESUME</span><span>PDF</span></div>
      <div class="resume-list" role="group" aria-label="Resume versions">
        {#each resumes as resume, index (resume.id)}
          <button bind:this={rows[index]} type="button" class="resume-row" class:selected={active === index}
            id={`resume-${resume.id}`} aria-pressed={active === index} aria-controls="resume-details"
            style={`--accent:${resume.accent}`} onmouseenter={() => selectResume(index)} onfocus={() => selectResume(index)}
            onclick={() => { experience.playTone('confirm'); void selectResume(index); }}>
            <span class="resume-emblem" aria-hidden="true"><span>{resume.monogram}</span></span>
            <span class="resume-row-copy"><span class="resume-name">{resume.name}</span><small>{resume.role}</small></span>
            <span class="selection-mark" aria-hidden="true">{active === index ? '+' : '›'}</span>
          </button>
        {/each}
      </div>
      <div class="owner-note"><span>GABRIEL CRUZ</span><p>Georgia Tech <i>／</i> CS + Mathematics</p><small>Three perspectives on the work I build.</small></div>
    </section>

    <section class="resume-detail" id="resume-details" aria-labelledby="resume-title">
      <div class="detail-caption"><span>RESUME DETAILS</span><b>{String(active + 1).padStart(2, '0')}</b></div>
      <h2 id="resume-title">{selected.name}</h2>
      <p class="resume-summary">{selected.summary}</p>
      <dl class="equipment-list">
        {#each selected.highlights as highlight, index}
          <div class="equipment-item">
            <dt>{highlight.label}</dt>
            <dd><span class="equipment-icon" aria-hidden="true">{#if index === 0}&lt;/&gt;{:else if index === 1}∑{:else if index === 2}↗{:else if index === 3}⌘{:else}◇{/if}</span><span>{highlight.value}</span></dd>
          </div>
        {/each}
      </dl>
      <div class="resume-actions">
        <a class="resume-open" href={selected.src} target="_blank" rel="noopener noreferrer" onclick={() => experience.playTone('confirm')}><span>Open PDF</span><i aria-hidden="true">↗</i></a>
        <a class="resume-download" href={selected.src} download={selected.filename} onclick={() => experience.playTone('confirm')}><span>Download</span><i aria-hidden="true">↓</i></a>
      </div>
    </section>

    {#if selected.preview}
      <figure class="resume-preview">
        <div class="preview-label"><span>DOCUMENT PREVIEW</span><span>01 / 01</span></div>
        <div class="document-sheet"><img src={selected.preview} alt={`${selected.name} resume, first-page preview`} /></div>
        <figcaption>View the full document with <b>Open PDF.</b></figcaption>
      </figure>
    {/if}
  </div>

  <footer class="resumes-footer">
    <div class="resume-guide"><p>Which resume do you want to view?</p><span><b>Guide</b><i></i></span><small>↑ ↓ Select a resume <span>／</span> Open or download the PDF</small></div>
    <a class="resumes-back" href="/" onclick={() => experience.playTone('back')}><kbd>ESC</kbd> Back</a>
  </footer>
</main>

<style>
  .resumes-screen { position: relative; isolation: isolate; display: grid; grid-template-rows: 88px minmax(0, 1fr) auto; width: 100%; height: 100vh; height: 100dvh; overflow: hidden; color: #071437; background: #fff; }
  :global(.portfolio-frame:has(.resumes-screen) .global-settings .setting) { color: #153984; }
  :global(.portfolio-frame:has(.resumes-screen) .global-settings .setting > span) { color: #0756bf; }
  .resume-art { position: absolute; z-index: -4; inset: 0 0 0 auto; width: 43%; overflow: hidden; isolation: isolate; }
  .resume-art :global(.video-background video) { object-position: 34% center; }
  .paper-ground { position: absolute; z-index: -3; inset: 0; background: linear-gradient(108deg, #fff 0%, #fff 67%, #ffffff88 67.2%, #ffffff12 80%); pointer-events: none; }
  .paper-ground::before { content: ''; position: absolute; top: 0; left: 0; width: 29%; height: 45px; background: linear-gradient(110deg, #00e5ed, #38aaf1); clip-path: polygon(0 0, 100% 0, 85% 100%, 0 100%); }
  .paper-ground::after { content: ''; position: absolute; bottom: 0; left: 0; width: 80px; height: 80px; background: #064ddb; clip-path: polygon(0 0, 0 100%, 100% 100%); }
  .background-word { position: absolute; z-index: -2; bottom: -.085em; left: 5%; margin: 0; color: #b8bbbf; opacity: .65; font: italic 900 clamp(90px, 17vw, 270px)/.86 var(--menu-display); letter-spacing: -.055em; white-space: nowrap; pointer-events: none; }
  .resumes-header { display: flex; justify-content: space-between; align-items: flex-start; padding: 19px 4% 0 7%; }
  .file-stamp > span { color: #092363; font-size: 8px; font-weight: 700; letter-spacing: 1.7px; }
  .file-stamp > p { margin: 15px 0 0; color: #14358b; font: italic 800 28px/1 var(--display); }
  .file-total { margin-top: 6px; color: #073995; font: italic 700 17px/1 var(--display); letter-spacing: 1px; }
  .file-total > i { padding: 0 7px; color: #ed3f77; font-style: normal; }
  .resumes-body { display: grid; grid-template-columns: 32% 31% minmax(0, 1fr); gap: 3%; min-height: 0; padding: 30px 4% 8px 0; }
  .resume-inventory { min-width: 0; min-height: 0; }
  .inventory-heading { display: flex; justify-content: space-between; gap: 10px; padding-left: 11%; padding-right: 7%; margin-bottom: 14px; color: #3462ac; font-size: 9px; font-weight: 700; letter-spacing: 1.2px; }
  .resume-list { display: grid; gap: 10px; }
  .resume-row { position: relative; display: flex; align-items: center; gap: 5%; width: 100%; min-width: 0; min-height: 99px; padding: 10px 8% 10px 6%; border: 0; background: #02050c; color: white; overflow: hidden; clip-path: polygon(3% 0, 100% 0, 97% 100%, 0 100%); transition: background .15s, color .15s; }
  .resume-row.selected { color: #071437; background: white; box-shadow: inset 0 3px #ff334e, inset 0 -3px #ff334e; }
  .resume-row.selected::after { content: ''; position: absolute; right: 1%; top: 0; width: 3px; height: 100%; background: #ff334e; transform: skew(-9deg); }
  .resume-row:focus-visible { outline: 0; box-shadow: inset 0 0 0 3px #ff5ebc; }
  .resume-emblem { position: relative; flex: 0 0 22%; display: grid; place-items: center; align-self: stretch; min-height: 58px; color: white; background: var(--accent); clip-path: polygon(8% 0, 100% 0, 77% 50%, 100% 100%, 0 100%); overflow: hidden; }
  .resume-emblem::before { content: ''; position: absolute; left: 0; top: -30%; height: 160%; width: 31%; background: #ffffff77; transform: rotate(-24deg); }
  .resume-emblem > span { position: relative; padding-right: 15%; font: italic 800 30px/1 var(--display); text-shadow: 2px 2px #03297744; }
  .resume-row-copy { flex: 1; min-width: 0; text-align: left; }
  .resume-name { display: block; font: 600 clamp(24px, 2.3vw, 36px)/1 var(--display); }
  .resume-row-copy > small { display: block; margin-top: 7px; color: #93efff; font-size: 9px; }
  .resume-row.selected .resume-row-copy > small { color: #365a91; }
  .selection-mark { color: #89faff; font: 500 37px/1 var(--display); flex: 0 0 5%; text-align: right; }
  .resume-row.selected .selection-mark { color: #ff334e; }
  .owner-note { padding: 28px 9% 0 12%; }
  .owner-note > span { color: #123c91; font: italic 800 28px/1 var(--display); }
  .owner-note > p { margin: 7px 0 0; color: #254578; font-size: 11px; }
  .owner-note i { color: #dc3b7e; font-style: normal; }
  .owner-note > small { display: block; margin-top: 15px; color: #62799c; font-size: 10px; line-height: 1.5; }
  .resume-detail { min-width: 0; min-height: 0; padding-top: 3px; }
  .detail-caption { display: flex; align-items: center; gap: 12px; color: #5273a6; font-size: 8px; font-weight: 700; letter-spacing: 1.5px; }
  .detail-caption > b { display: inline-block; padding: 2px 8px; color: white; background: #113785; transform: skew(-13deg); font: italic 700 13px/1 var(--display); letter-spacing: 0; }
  h2 { margin: 10px 0 0; color: #10327c; font: italic 800 clamp(30px, 3.2vw, 48px)/1 var(--display); }
  .resume-summary { margin: 13px 0 0; color: #425b85; font-size: clamp(12px, 1vw, 14px); line-height: 1.55; }
  .equipment-list { display: grid; gap: clamp(12px, 2.1dvh, 24px); margin: 22px 0 0; }
  .equipment-item { min-width: 0; }
  .equipment-item > dt { display: inline-block; min-width: 64%; padding: 3px 18px; border-radius: 30px; color: #bcf8ff; background: #102d79; text-align: center; font: italic 600 17px/1 var(--display); }
  .equipment-item > dd { display: flex; align-items: center; gap: 13px; margin: 7px 0 0 9%; color: #0a1834; font: 500 clamp(19px, 1.7vw, 26px)/1.1 var(--display); }
  .equipment-item > dd > span:last-child { min-width: 0; }
  .equipment-icon { display: grid; place-items: center; flex: 0 0 50px; height: 28px; background: linear-gradient(135deg, #0436bd, #0067fa); color: #a6fbff; transform: skew(-15deg); font: italic 700 24px/1 var(--display); }
  .resume-actions { display: flex; gap: 9px; margin-top: 24px; }
  .resume-actions > a { display: inline-flex; justify-content: center; align-items: center; gap: 17px; min-height: 35px; padding: 7px 15px; color: white; background: #0b3db1; font: italic 700 18px/1 var(--display); border-bottom: 3px solid #49deec; }
  .resume-actions > .resume-download { color: #15388c; border: 1px solid #4574c7; border-bottom-width: 3px; background: white; }
  .resume-actions i { font-style: normal; }
  .resume-preview { align-self: center; min-width: 0; min-height: 0; width: 100%; margin: -5% 0 0; transform: rotate(4deg); }
  .preview-label { display: flex; justify-content: space-between; gap: 10px; margin-bottom: 9px; padding: 0 5%; color: white; text-shadow: 1px 1px #053276; font-size: 8px; font-weight: 700; letter-spacing: 1px; }
  .document-sheet { padding: 8px; border: 1px solid #9acdfb; background: white; box-shadow: 10px 13px #05358c66; }
  .document-sheet > img { display: block; width: 100%; height: auto; max-height: 65dvh; object-fit: contain; background: white; }
  .resume-preview > figcaption { margin-top: 16px; color: white; text-shadow: 1px 1px #063383; text-align: center; font-size: 10px; line-height: 1.5; }
  .resumes-footer { display: flex; align-items: flex-end; justify-content: flex-end; gap: 30px; min-height: max(92px, calc(var(--shared-controls-height, 28px) + 27px)); padding: 15px 4% 20px 280px; }
  .resume-guide { width: min(465px, 100%); color: #123888; }
  .resume-guide > p { margin: 0; font: italic 800 clamp(24px, 2.6vw, 38px)/1 var(--display); text-shadow: 1px 1px #ffffffdd; }
  .resume-guide > span { display: flex; align-items: center; gap: 8px; margin-top: 5px; }
  .resume-guide b { font-size: 8px; font-weight: 500; }
  .resume-guide i { flex: 1; height: 2px; background: #123888; }
  .resume-guide small { display: block; margin-top: 6px; color: #295294; font-size: 9px; }
  .resume-guide small > span { color: #d5327f; padding: 0 8px; }
  .resumes-back { display: flex; align-items: center; gap: 8px; flex-shrink: 0; color: white; font: italic 700 22px/1 var(--display); text-shadow: 1px 1px #06327f; }
  .resumes-back kbd { display: grid; place-items: center; min-width: 32px; height: 26px; padding: 0 6px; border: 2px solid white; border-radius: 20px; background: #093378; box-shadow: 0 0 0 2px #7394c9; font: 700 9px/1 'DM Sans', sans-serif; }
  .paper-shards { position: absolute; z-index: -1; inset: 0; pointer-events: none; }
  .paper-shards > i { position: absolute; left: 46%; bottom: 10%; width: 24px; height: 43px; background: #37eafa77; clip-path: polygon(0 0, 100% 25%, 28% 100%); transform: rotate(-25deg); }
  .paper-shards > i:nth-child(2) { left: 65%; bottom: 16%; background: #ff61c777; transform: rotate(55deg); }
  .paper-shards > i:nth-child(3) { left: 34%; top: 62%; background: #064ff533; transform: rotate(17deg); }
  @media (max-width: 1000px) {
    .resumes-body { grid-template-columns: 34% 33% minmax(0, 1fr); gap: 2%; padding-right: 3%; }
    .resume-row { min-height: 90px; padding-right: 7%; }
    .resume-name { font-size: 25px; }
    .resume-emblem { flex-basis: 19%; }
    .resume-emblem > span { font-size: 22px; }
    .selection-mark { font-size: 29px; }
    .resume-row-copy > small { font-size: 8px; }
    .equipment-item > dd { gap: 9px; margin-left: 5%; font-size: 20px; }
    .equipment-icon { flex-basis: 35px; height: 23px; font-size: 20px; }
    .equipment-item > dt { font-size: 15px; }
    .resume-actions > a { gap: 10px; padding: 7px 11px; font-size: 16px; }
    .owner-note > span { font-size: 23px; }
    .owner-note > p { font-size: 10px; }
    .preview-label { font-size: 7px; letter-spacing: .5px; }
    .resumes-footer { padding-left: 270px; }
  }
  @media (max-width: 600px) {
    .resumes-screen { grid-template-rows: 65px minmax(0, 1fr) auto; }
    .resumes-header { padding: 15px 6% 0 7%; }
    .file-stamp > span { font-size: 7px; letter-spacing: 1px; }
    .file-stamp > p { margin-top: 8px; font-size: 23px; }
    .file-total { font-size: 13px; margin-top: 3px; }
    .file-total > i { padding: 0 3px; }
    .paper-ground { background: #ffffffed; }
    .paper-ground::before { width: 67%; height: 25px; opacity: .65; }
    .resume-art { width: 100%; }
    .background-word { left: 4%; bottom: 43px; font-size: 19vw; opacity: .22; }
    .resumes-body { grid-template-columns: 1fr; grid-template-rows: auto minmax(0, 1fr); gap: 18px; padding: 10px 6% 7px 0; }
    .inventory-heading { margin-bottom: 8px; font-size: 8px; }
    .resume-list { gap: 6px; }
    .resume-row { min-height: 68px; padding: 7px 6%; gap: 5%; }
    .resume-emblem { min-height: 40px; flex-basis: 16%; }
    .resume-emblem > span { font-size: 23px; }
    .resume-name { font-size: 26px; }
    .resume-row-copy > small { margin-top: 4px; font-size: 8px; }
    .selection-mark { font-size: 30px; }
    .owner-note, .resume-preview { display: none; }
    .resume-detail { align-self: center; padding: 0 0 0 7%; }
    .detail-caption { font-size: 7px; letter-spacing: 1px; }
    h2 { margin-top: 6px; font-size: 31px; }
    .resume-summary { margin-top: 8px; font-size: 11px; line-height: 1.45; }
    .equipment-list { margin-top: 15px; gap: 12px; }
    .equipment-item > dt { min-width: 59%; font-size: 15px; padding: 3px 14px; }
    .equipment-item > dd { margin-top: 5px; margin-left: 7%; gap: 11px; font-size: 20px; }
    .equipment-icon { flex-basis: 42px; height: 25px; font-size: 21px; }
    .resume-actions { margin-top: 17px; gap: 9px; }
    .resume-actions > a { min-height: 34px; font-size: 17px; padding: 7px 15px; gap: 20px; }
    .resumes-footer { min-height: max(56px, calc(var(--shared-controls-height, 28px) + 24px)); padding: 9px 6% 17px 190px; }
    .resume-guide { display: none; }
    .resumes-back { color: #16397d; font-size: 18px; text-shadow: none; }
    .resumes-back kbd { min-width: 28px; height: 24px; font-size: 8px; border-color: #153984; color: #153984; background: white; box-shadow: 0 0 0 2px #b7c9ea; }
  }
  @media (max-height: 700px) and (min-width: 601px) {
    .resumes-screen { grid-template-rows: 69px minmax(0, 1fr) auto; }
    .file-stamp > p { margin-top: 9px; font-size: 23px; }
    .resumes-body { padding-top: 12px; }
    .resume-row { min-height: 80px; }
    h2 { font-size: 31px; margin-top: 6px; }
    .resume-summary { margin-top: 7px; font-size: 11px; }
    .equipment-list { margin-top: 13px; gap: 10px; }
    .equipment-item > dt { font-size: 14px; padding: 2px 12px; }
    .equipment-item > dd { margin-top: 4px; font-size: 18px; }
    .equipment-icon { height: 22px; font-size: 19px; }
    .resume-actions { margin-top: 15px; }
    .resume-actions > a { min-height: 29px; padding-top: 5px; padding-bottom: 5px; font-size: 15px; }
    .owner-note { padding-top: 22px; }
    .resumes-footer { min-height: 65px; padding-top: 8px; padding-bottom: 17px; }
    .resume-guide > p { font-size: 26px; }
    .document-sheet > img { max-height: 64dvh; }
  }
  @media (max-height: 450px) and (min-width: 601px) {
    .resumes-screen { grid-template-rows: 50px minmax(0, 1fr) auto; }
    .resumes-header { padding-top: 10px; }
    .file-stamp > p { margin-top: 5px; font-size: 19px; }
    .file-total { font-size: 14px; margin-top: 3px; }
    .resumes-body { grid-template-columns: 32% 40% minmax(0, 1fr); padding-top: 8px; }
    .inventory-heading { font-size: 7px; margin-bottom: 7px; }
    .resume-row { min-height: 70px; padding-top: 7px; padding-bottom: 7px; }
    .resume-emblem { min-height: 38px; }
    .resume-name { font-size: 23px; }
    .owner-note { padding-top: 18px; }
    .owner-note > small { display: none; }
    .detail-caption { display: none; }
    h2 { font-size: 25px; margin-top: 0; }
    .resume-summary { display: none; }
    .equipment-list { margin-top: 8px; gap: 4px; }
    .equipment-item > dt { display: block; width: 64%; font-size: 12px; padding: 2px 10px; }
    .equipment-item > dd { gap: 7px; font-size: 15px; margin-top: 3px; }
    .equipment-icon { flex-basis: 30px; height: 17px; font-size: 17px; }
    .resume-actions { margin-top: 8px; }
    .resume-actions > a { min-height: 25px; font-size: 13px; padding: 4px 9px; gap: 8px; }
    .resumes-footer { min-height: max(51px, calc(var(--shared-controls-height, 28px) + 23px)); }
    .resume-guide, .resume-preview > figcaption { display: none; }
    .resumes-back { font-size: 18px; }
    .preview-label { margin-bottom: 5px; font-size: 6px; }
    .document-sheet { padding: 4px; }
    .document-sheet > img { max-height: 60dvh; }
  }
  @media (max-height: 650px) and (max-width: 600px) {
    .resumes-screen { grid-template-rows: 53px minmax(0, 1fr) auto; }
    .resumes-header { padding-top: 10px; }
    .file-stamp > span { font-size: 6px; }
    .file-stamp > p { font-size: 20px; margin-top: 7px; }
    .file-total { font-size: 12px; }
    .resumes-body { padding-top: 8px; gap: 9px; }
    .inventory-heading { font-size: 7px; margin-bottom: 6px; }
    .resume-row { min-height: 55px; padding-top: 5px; padding-bottom: 5px; }
    .resume-name { font-size: 22px; }
    .resume-emblem { min-height: 35px; }
    .resume-emblem > span { font-size: 20px; }
    .resume-detail { align-self: start; }
    .detail-caption { display: none; }
    h2 { margin-top: 0; font-size: 26px; }
    .resume-summary { display: none; }
    .equipment-list { margin-top: 7px; gap: 2px; }
    .equipment-item > dt { font-size: 12px; padding: 2px 12px; }
    .equipment-item > dd { margin-top: 3px; font-size: 14px; gap: 9px; }
    .equipment-icon { flex-basis: 32px; height: 19px; font-size: 17px; }
    .resume-actions { margin-top: 8px; }
    .resume-actions > a { min-height: 29px; padding: 5px 12px; font-size: 15px; }
    .resumes-footer { min-height: max(51px, calc(var(--shared-controls-height, 28px) + 23px)); padding-top: 6px; padding-bottom: 16px; }
    .resumes-back { font-size: 16px; }
  }
  .reduce-motion .resume-row { transition: none; }
  @media (prefers-reduced-motion: reduce) { .resume-row { transition: none; } }
</style>
