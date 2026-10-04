<script lang="ts">
  import { goto } from '$app/navigation';
  import { tick } from 'svelte';
  import { externalLink, profile, projects, type ProjectMedia } from '$lib/portfolio';
  import { usePortfolioExperience } from '$lib/portfolioExperience';
  import VideoBackground from '$lib/VideoBackground.svelte';

  const experience = usePortfolioExperience();
  const accents = ['#f7e56b', '#ef4bd1', '#4f85ff', '#f45674', '#fea948', '#46e3c6'];
  let active = $state(0);
  let rows: HTMLButtonElement[] = [];
  const selected = $derived(projects[active]);
  type DetailTab = 'overview' | 'reason' | 'challenge' | 'improvement' | 'media';
  const detailTabs: { id: DetailTab; label: string }[] = [
    { id: 'overview', label: 'About' }, { id: 'reason', label: 'Reason' },
    { id: 'challenge', label: 'Hardest' }, { id: 'improvement', label: 'Improve' },
    { id: 'media', label: 'Media' }
  ];
  const storyTitles = { reason: 'Reason for the project', challenge: 'Hardest part of the project', improvement: 'How I would improve it' };
  let detailTab = $state<DetailTab>('overview');
  let tabButtons: HTMLButtonElement[] = [];
  let mediaDialog: HTMLDialogElement;
  let openedMedia = $state<ProjectMedia | null>(null);
  let openedProject = $state('');
  let mediaTrigger: HTMLButtonElement | undefined;
  let mediaVideo = $state<HTMLVideoElement>();

  async function selectProject(index: number, focus = false) {
    if (!projects.length) return;
    const next = (index + projects.length) % projects.length;
    if (next !== active) experience.playTone('select');
    active = next;
    if (detailTab === 'media' && !projects[next].media?.length) detailTab = 'overview';
    await tick();
    if (focus) rows[next]?.focus({ preventScroll: true });
  }

  function playBack() { experience.playTone('back'); }

  function selectTab(tab: DetailTab) {
    if (detailTab !== tab) experience.playTone('select');
    detailTab = tab;
  }

  function moveDetail(direction: number) {
    const available = detailTabs.filter(tab => tab.id !== 'media' || selected?.media?.length);
    const current = available.findIndex(tab => tab.id === detailTab);
    const next = available[(current + direction + available.length) % available.length];
    selectTab(next.id);
    tabButtons[detailTabs.findIndex(tab => tab.id === next.id)]?.focus({ preventScroll: true });
  }

  function handleTabKey(event: KeyboardEvent, index: number) {
    const available = detailTabs.filter(tab => tab.id !== 'media' || selected?.media?.length);
    const current = available.findIndex(tab => tab.id === detailTabs[index].id);
    let next: number | undefined;
    if (event.key === 'ArrowRight') next = (current + 1) % available.length;
    if (event.key === 'ArrowLeft') next = (current - 1 + available.length) % available.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = available.length - 1;
    if (next === undefined) return;
    event.preventDefault();
    const tab = available[next];
    selectTab(tab.id);
    tabButtons[detailTabs.findIndex(item => item.id === tab.id)]?.focus({ preventScroll: true });
  }

  async function openMedia(media: ProjectMedia, event: MouseEvent) {
    mediaTrigger = event.currentTarget as HTMLButtonElement;
    openedMedia = media;
    openedProject = selected?.name ?? '';
    experience.playTone('confirm');
    await tick();
    mediaDialog.showModal();
  }

  function didCloseMedia() {
    mediaVideo?.pause();
    openedMedia = null;
    mediaTrigger?.focus({ preventScroll: true });
  }

  function handleKey(event: KeyboardEvent) {
    if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return;
    if (mediaDialog?.open) return;
    const target = event.target;
    if (target instanceof HTMLElement && (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName))) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      playBack();
      void goto('/');
      return;
    }
    if (target instanceof Element && target.closest('.global-settings, .projects-back')) return;
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault();
      moveDetail(event.key === 'ArrowRight' ? 1 : -1);
      return;
    }
    let next: number | undefined;
    if (event.key === 'ArrowDown' || event.key.toLowerCase() === 's') next = active + 1;
    if (event.key === 'ArrowUp' || event.key.toLowerCase() === 'w') next = active - 1;
    if (!(target instanceof Element && target.closest('.project-detail'))) {
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = projects.length - 1;
    }
    if (next !== undefined && projects.length) {
      event.preventDefault();
      void selectProject(next, true);
    }
  }
</script>

<svelte:head>
  <title>Projects — {profile.name}</title>
  <meta name="description" content={`Projects by ${profile.name}. Software, hardware, and ideas brought to life.`} />
</svelte:head>

<svelte:window onkeydown={handleKey} />

<main class="projects-screen" class:reduce-motion={experience.state.reducedMotion}>
  <VideoBackground reducedMotion={experience.state.reducedMotion} />
  <div class="inventory-tint" aria-hidden="true"></div>
  <div class="inventory-texture" aria-hidden="true"></div>
  <div class="inventory-shards" aria-hidden="true">
    {#each Array(5) as _, index}<span style={`--shard:${index}`}></span>{/each}
  </div>

  <header class="projects-header">
    <h1>PROJECTS</h1>
    <div class="file-browser">
      <button class="browse-arrow" type="button" aria-label="Previous project" disabled={projects.length < 2} onclick={() => selectProject(active - 1)}><span aria-hidden="true">‹</span></button>
      <div class="browser-label"><span>Project Files</span><p><i aria-hidden="true"></i> {String(projects.length).padStart(2, '0')} FILES <i aria-hidden="true"></i></p></div>
      <button class="browse-arrow" type="button" aria-label="Next project" disabled={projects.length < 2} onclick={() => selectProject(active + 1)}><span aria-hidden="true">›</span></button>
    </div>
  </header>

  <div class="projects-body">
    <section class="project-inventory" aria-label="Project inventory">
      <p class="inventory-caption"><span>{profile.name}</span><span>PROJECT ARCHIVE</span></p>
      <div class="project-list" role="group" aria-label="Projects"
        style={`--project-count:${projects.length || accents.length}`}>
        {#each projects as project, index (project.id)}
          <button bind:this={rows[index]} class="project-row" class:selected={active === index} type="button"
            id={`project-link-${project.id}`} aria-pressed={active === index} aria-controls="project-details"
            title="View project details" aria-describedby={`project-summary-${project.id}`}
            style={`--accent:${accents[index % accents.length]}`} onmouseenter={() => selectProject(index)} onfocus={() => selectProject(index)}
            onclick={() => { experience.playTone('confirm'); void selectProject(index); }}>
            <span class="file-emblem" aria-hidden="true"><span>{String(index + 1).padStart(2, '0')}</span></span>
            <span class="project-name">{project.name}</span>
            <span class="row-mark" aria-hidden="true">›</span>
            <span class="sr-only" id={`project-summary-${project.id}`}>{project.summary} View project details.</span>
          </button>
        {:else}
          {#each accents as accent, index}
            <div class="project-row project-slot" aria-hidden="true" style={`--accent:${accent};--slot:${index}`}>
              <span class="file-emblem"><span class="empty-emblem"></span></span>
              <span class="blank-name"></span>
              <span class="blank-mark"></span>
            </div>
          {/each}
        {/each}
      </div>
    </section>

    <section class="project-detail" id="project-details" aria-labelledby="project-detail-label"
      onwheel={(event: WheelEvent) => event.stopPropagation()}>
      <div class="detail-title-bar">
        <span class="detail-emblem" aria-hidden="true"><span></span></span>
        <h2 id="project-detail-label" class:empty-heading={!selected}>{selected?.name ?? 'Project details'}</h2>
        <span class="file-count" aria-hidden="true">{selected ? String(active + 1).padStart(2, '0') : '—'}</span>
      </div>
      {#if selected}
        <div class="detail-tabs" role="tablist" aria-label="Project information">
          {#each detailTabs as tab, index}
            <button bind:this={tabButtons[index]} class="detail-tab" type="button" role="tab"
              id={`detail-tab-${tab.id}`} aria-controls="detail-panel" aria-selected={detailTab === tab.id}
              tabindex={detailTab === tab.id ? 0 : -1} disabled={tab.id === 'media' && !selected.media?.length}
              onclick={() => selectTab(tab.id)} onkeydown={(event) => handleTabKey(event, index)}>{tab.label}</button>
          {/each}
        </div>
        <div class="detail-content">
          <div class="detail-panel" id="detail-panel" role="tabpanel" aria-labelledby={`detail-tab-${detailTab}`} tabindex="0">
            {#if detailTab === 'overview'}
              <p class="project-summary" id="project-summary">{selected.summary}</p>
              <div class="project-stack" aria-label="Technology stack">{#each selected.stack as tool}<span>{tool}</span>{/each}</div>
            {:else if detailTab === 'media'}
              <div class="project-media">
                {#each selected.media ?? [] as media}
                  <button class="media-thumbnail" type="button" aria-label={`Open ${media.alt}`}
                    onclick={(event) => openMedia(media, event)}>
                    {#if media.kind === 'image'}<img src={media.src} alt={media.alt} loading="lazy" />
                    {:else if media.poster}<img src={media.poster} alt={media.alt} loading="lazy" />
                    {:else}<span class="video-thumbnail" aria-hidden="true">▶</span>{/if}
                    <span>{media.kind === 'video' ? 'Play demo' : 'View image'} <i aria-hidden="true">↗</i></span>
                  </button>
                {/each}
              </div>
            {:else}
              <div class="project-story"><h3>{storyTitles[detailTab]}</h3><p>{selected.story?.[detailTab] ?? ''}</p></div>
            {/if}
          </div>
          <div class="project-links">
            {#if detailTab === 'overview'}
              {#if externalLink(selected.github ?? '')}
                <a class="github-link" id="project-open-hint" href={externalLink(selected.github ?? '')} target="_blank" rel="noopener noreferrer">
                  <svg class="github-logo" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 .5C5.37.5 0 5.87 0 12.5c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.725-4.043-1.61-4.043-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.729.083-.729 1.205.085 1.838 1.237 1.838 1.237 1.07 1.835 2.809 1.305 3.495.998.108-.776.418-1.305.762-1.605-2.665-.303-5.467-1.333-5.467-5.93 0-1.31.468-2.382 1.236-3.222-.123-.303-.536-1.524.118-3.176 0 0 1.008-.322 3.301 1.23A11.52 11.52 0 0 1 12 6.301c1.02.005 2.047.138 3.005.404 2.291-1.552 3.297-1.23 3.297-1.23.656 1.652.243 2.873.12 3.176.77.84 1.235 1.912 1.235 3.222 0 4.609-2.807 5.624-5.479 5.921.43.371.814 1.102.814 2.222 0 1.606-.015 2.898-.015 3.293 0 .322.216.694.825.576C20.565 22.297 24 17.8 24 12.5 24 5.87 18.627.5 12 .5Z" /></svg>
                  Open on GitHub <span aria-hidden="true">↗</span>
                </a>
              {/if}
              {#if externalLink(selected.demo ?? '')}<a href={externalLink(selected.demo ?? '')} target="_blank" rel="noopener noreferrer">Open project <span aria-hidden="true">↗</span></a>{/if}
            {/if}
          </div>
        </div>
      {:else}
        <div class="blank-details" aria-hidden="true">
          {#each Array(4) as _, index}
            <div class="blank-detail-row" style={`--line:${index}`}><span class="blank-detail-icon"></span><span class="blank-detail-line"></span><span class="blank-detail-count">—</span></div>
          {/each}
        </div>
        <p class="project-empty-label"><span>INFO</span> No projects added yet.</p>
      {/if}
    </section>
  </div>

  <footer class="projects-footer">
    <div class="project-guide">
      <p>Explore this project.</p>
      <div class="guide-rule"><span>↑ ↓ Projects · ← → Details</span><i></i></div>
      <a class="projects-back" href="/" onclick={playBack}><kbd>ESC</kbd> Back to menu</a>
    </div>
  </footer>

  <dialog bind:this={mediaDialog} class="media-viewer" aria-labelledby="media-viewer-title" onclose={didCloseMedia}>
    <div class="media-viewer-header"><h2 id="media-viewer-title">{openedProject}</h2>
      <button type="button" aria-label="Close project media" onclick={() => mediaDialog.close()}>Close <span aria-hidden="true">×</span></button>
    </div>
    {#if openedMedia}
      <figure>
        {#if openedMedia.kind === 'video'}
          <video bind:this={mediaVideo} src={openedMedia.src} poster={openedMedia.poster} controls playsinline preload="metadata" aria-label={openedMedia.alt}>
            <track kind="captions" src={openedMedia.captions} srclang="en" label="English" default={!!openedMedia.captions} />
            <a href={openedMedia.src}>Open video</a>
          </video>
        {:else}<img src={openedMedia.src} alt={openedMedia.alt} />{/if}
        <figcaption>{openedMedia.caption}</figcaption>
      </figure>
    {/if}
  </dialog>
</main>

<style>
  .projects-screen { position: relative; isolation: isolate; display: grid; grid-template-rows: 18% minmax(0, 1fr) auto; height: 100vh; height: 100dvh; overflow: hidden; color: #42faff; background: #003dcc; }
  .inventory-tint { position: absolute; z-index: -3; inset: 0; pointer-events: none; background: linear-gradient(180deg, #11b8fd55 15%, #036af997 42%, #0117b5d9 100%); }
  .inventory-texture { position: absolute; z-index: -2; inset: 0; pointer-events: none; opacity: .25; background: repeating-linear-gradient(0deg, transparent 0 3px, #032c6b12 3px 4px); }
  .projects-header { position: relative; display: grid; grid-template-columns: 47% minmax(0, 1fr); align-items: center; min-height: 0; min-width: 0; background: white; z-index: 1; }
  h1 { align-self: start; margin: -.05em 0 0 -.065em; font: italic 900 min(9.2vw, 19dvh)/1 var(--menu-display); letter-spacing: -.075em; color: #bfbfbf; white-space: nowrap; transform: skew(-3deg); }
  .file-browser { display: flex; align-items: center; justify-content: space-around; gap: 12px; padding: 0 6% 0 1%; height: 100%; min-width: 0; }
  .browser-label { text-align: center; color: #070a13; }
  .browser-label > span { font: 600 clamp(24px, 2.7vw, 44px)/1 var(--display); }
  .browser-label p { display: flex; align-items: center; justify-content: center; gap: 12px; margin: 12px 0 0; font-size: 9px; font-weight: 700; letter-spacing: 3px; }
  .browser-label i { width: 7px; height: 7px; border-radius: 50%; background: #080b15; }
  .browse-arrow { padding: 0 8px; border: 0; background: transparent; color: white; -webkit-text-stroke: 2px #f91c46; font: 700 clamp(62px, 7vw, 110px)/.8 var(--display); }
  .browse-arrow:disabled { opacity: .65; }
  .projects-body { display: grid; grid-template-columns: 44% minmax(0, 1fr); align-items: start; gap: 6%; min-width: 0; min-height: 0; padding: 2.7vh 6% 1vh 0; }
  .project-inventory { display: grid; grid-template-rows: auto minmax(0, 1fr); min-width: 0; min-height: 0; height: 100%; container-type: size; }
  .inventory-caption { display: flex; justify-content: space-between; gap: 8px; padding: 0 7% 0 8%; margin: 0 0 12px; font-size: 9px; font-weight: 700; letter-spacing: 1.8px; text-transform: uppercase; color: #bafaff; }
  .inventory-caption > span:last-child { color: #ddf6ff; opacity: .7; font-size: 8px; }
  .project-list { display: grid; grid-template-rows: repeat(var(--project-count), minmax(0, 1fr)); align-content: stretch; gap: min(.7vh, 7px); min-width: 0; min-height: 0; height: 100%; overflow: visible; }
  .project-row { position: relative; display: flex; align-items: center; gap: 4%; min-width: 0; min-height: 0; width: 100%; height: 100%; border: 0; padding: 0 6% 0 4%; background: #03050b; color: white; text-align: left; clip-path: polygon(3% 0, 100% 0, 96% 100%, 0 100%); }
  .project-row.selected { background: white; color: #050b25; box-shadow: inset 0 min(.6vh, 4px) #ff243f; }
  .project-row:focus-visible { outline: 0; box-shadow: inset 0 0 0 3px #ff6bd5; }
  .file-emblem { display: grid; place-items: center; position: relative; flex: 0 0 18%; align-self: stretch; overflow: hidden; background: var(--accent); clip-path: polygon(18% 0, 100% 0, 78% 100%, 0 100%); }
  .file-emblem::before { content: ''; position: absolute; width: 18%; height: 140%; top: -20%; left: 13%; background: #fff; transform: rotate(35deg); opacity: .88; }
  .file-emblem > span { position: relative; font: italic 800 clamp(18px, min(2.4vw, 5cqh), 34px)/1 var(--display); color: white; text-shadow: 2px 2px #03194b5c; }
  .file-emblem .empty-emblem { width: 30%; aspect-ratio: 1; border: 3px solid white; transform: rotate(45deg); background: transparent; }
  .project-name { flex: 1; min-width: 0; font: 600 clamp(15px, min(1.8vw, 4cqh), 28px)/1.05 var(--display); }
  .row-mark { font: 600 24px/1 var(--display); color: var(--accent); }
  .blank-name { width: 39%; height: 2px; background: #d2f5ff20; }
  .blank-mark { width: 10%; height: 14px; margin-left: auto; border-bottom: 2px solid var(--accent); transform: skew(-16deg); opacity: .7; }
  .project-detail { min-width: 0; min-height: 0; width: 100%; max-height: 100%; margin-top: 13px; }
  .project-detail:focus-visible { outline: 2px solid #ff6bd5; outline-offset: 4px; }
  .detail-title-bar { display: flex; align-items: center; gap: 14px; min-width: 0; min-height: clamp(58px, 8dvh, 82px); padding: 10px 5% 10px 3%; border-top: 6px solid #ff2438; border-radius: 8px 0 0 8px; background: white; color: #030511; }
  .detail-emblem { display: grid; place-items: center; flex: 0 0 16%; height: 35px; background: #003dbc; transform: skew(-15deg); }
  .detail-emblem > span { display: block; width: 28px; height: 16px; border: 3px solid white; transform: rotate(23deg); }
  h2 { flex: 1; min-width: 0; margin: 0; font: 600 clamp(26px, 3vw, 44px)/1 var(--display); overflow-wrap: anywhere; }
  .empty-heading { opacity: 0; }
  .file-count { display: grid; place-items: center; flex: 0 0 18%; min-height: 28px; padding: 1px 12px; border-radius: 40px; color: white; background: black; font: 500 clamp(24px, 2.8vw, 36px)/1 var(--display); }
  .blank-details { display: grid; gap: clamp(15px, 3.2vh, 30px); padding: 25px 6% 0; }
  .blank-detail-row { display: flex; align-items: center; gap: 15px; transform: translateX(calc(var(--line) * -4px)); }
  .blank-detail-icon { display: block; flex: 0 0 15%; height: 26px; background: #0842bba6; transform: skew(-16deg); border-left: 3px solid #c5fcffb3; }
  .blank-detail-line { width: calc(53% - var(--line) * 4%); height: 2px; background: #48ffff8c; }
  .blank-detail-count { display: grid; place-items: center; margin-left: auto; width: 19%; height: 28px; border-radius: 30px; color: #c8faff; background: #010820; font: 500 23px/1 var(--display); }
  .project-empty-label { display: flex; align-items: center; gap: 13px; padding: 0 5%; margin: clamp(30px, 7vh, 70px) 0 0; color: #59ffff; font: 500 clamp(20px, 2.3vw, 32px)/1.2 var(--display); }
  .project-empty-label > span { flex-shrink: 0; padding: 2px 11px; border: 2px solid #50fbff; border-radius: 8px; font: 700 10px/1 var(--display); letter-spacing: 1px; }
  .detail-tabs { display: flex; gap: 4px; margin: 12px 5% 0; border-bottom: 1px solid #6bffff6b; }
  .detail-tab { flex: 1; min-width: 0; padding: 9px 3px; border: 0; border-bottom: 3px solid transparent; color: #b6faff; background: transparent; font-size: 12px; font-weight: 700; }
  .detail-tab[aria-selected='true'] { color: white; border-bottom-color: #ff70d7; }
  .detail-tab:disabled { opacity: .4; cursor: default; }
  .detail-tab:focus-visible, .media-thumbnail:focus-visible, .media-viewer button:focus-visible { outline: 2px solid #ff79db; outline-offset: 2px; }
  .detail-content { display: grid; grid-template-rows: minmax(0, 1fr) auto; gap: 14px; height: clamp(230px, 34dvh, 340px); padding: 16px 5%; }
  .detail-panel { min-width: 0; min-height: 0; }
  .detail-panel:focus-visible { outline: 1px solid #6bffff; outline-offset: 4px; }
  .project-summary, .project-story p { color: #ecfbff; font-size: clamp(14px, 1.3vw, 18px); line-height: 1.65; }
  .project-summary { margin: 0; }
  .project-stack { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 16px; }
  .project-stack > span { padding: 5px 8px; border: 1px solid #79f6ffa6; color: #aeffff; font-size: 11px; line-height: 1; }
  .project-story h3 { margin: 0 0 12px; color: #8affff; font: 600 clamp(22px, 2.1vw, 30px)/1.1 var(--display); }
  .project-story p { margin: 0; }
  .project-media { display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 12px; height: 100%; }
  .media-thumbnail { display: grid; grid-template-rows: minmax(0, 1fr) auto; min-width: 0; min-height: 0; padding: 6px; border: 1px solid #79f6ff80; color: white; background: #00154d80; }
  .media-thumbnail img { width: 100%; height: 100%; min-height: 0; object-fit: contain; background: #f5f7fb; }
  .media-thumbnail > span { padding: 8px 3px 2px; font-size: 11px; }
  .media-thumbnail i { color: #ff79db; font-style: normal; }
  .media-thumbnail .video-thumbnail { display: grid; place-items: center; padding: 0; font-size: 38px; color: #8affff; }
  .project-links { display: flex; flex-wrap: wrap; gap: 22px; min-height: 28px; margin-top: 0; }
  .project-links > a { display: inline-flex; align-items: center; gap: 8px; min-height: 28px; font-size: 13px; color: white; text-decoration: underline; text-underline-offset: 5px; }
  .project-links span { color: #ff79db; }
  .github-logo { flex-shrink: 0; width: 16px; height: 16px; }
  .media-viewer { width: min(1050px, 94vw); max-height: 92dvh; padding: 0; border: 2px solid #6bffff; color: white; background: #031d51; }
  .media-viewer::backdrop { background: #000d28dd; }
  .media-viewer-header { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 14px 20px; border-top: 5px solid #ff2438; background: white; color: #031d51; }
  .media-viewer-header h2 { font-size: clamp(21px, 3vw, 34px); }
  .media-viewer-header button { flex-shrink: 0; padding: 7px 10px; border: 1px solid #031d51; font-size: 13px; color: #031d51; background: white; }
  .media-viewer figure { margin: 0; padding: 16px; }
  .media-viewer figure img, .media-viewer video { display: block; width: 100%; max-height: 69dvh; object-fit: contain; background: #020b20; }
  .media-viewer figcaption { margin-top: 12px; color: #c6faff; font-size: 12px; line-height: 1.5; }
  .projects-footer { display: flex; justify-content: flex-end; min-width: 0; padding: 12px 5% 19px 270px; min-height: max(58px, calc(var(--shared-controls-height, 28px) + 26px)); }
  .project-guide { width: min(460px, 100%); }
  .project-guide > p { margin: 0; color: white; font: italic 800 clamp(22px, 2.5vw, 36px)/1 var(--display); text-shadow: 2px 2px #001258; }
  .guide-rule { display: flex; align-items: center; gap: 8px; margin: 4px 0 10px; color: white; font-size: 8px; }
  .guide-rule > i { height: 2px; flex: 1; background: white; }
  .projects-back { display: flex; justify-content: flex-end; align-items: center; gap: 8px; color: white; font: italic 700 20px/1 var(--display); }
  .projects-back kbd { display: grid; place-items: center; height: 26px; min-width: 32px; padding: 0 6px; border: 2px solid white; border-radius: 20px; color: #fff; background: #00184da6; box-shadow: 0 0 0 2px #657ab3; font: 700 9px/1 'DM Sans', sans-serif; }
  .inventory-shards { position: absolute; z-index: -1; inset: 18% 0 0; pointer-events: none; overflow: hidden; }
  .inventory-shards > span { position: absolute; left: calc(31% + var(--shard) * 11%); top: calc(10% + var(--shard) * 18%); width: 16px; height: 36px; background: #ff5ddd; opacity: .5; clip-path: polygon(0 0, 100% 27%, 50% 100%, 15% 75%); animation: shard-drift 9s ease-in-out infinite alternate; animation-delay: calc(var(--shard) * -1.6s); }
  @keyframes shard-drift { to { transform: translate(22px, -28px) rotate(35deg); } }
  @media (max-width: 900px) {
    .projects-body { grid-template-columns: 45% minmax(0, 1fr); gap: 5%; padding-right: 4%; }
    .inventory-caption { font-size: 8px; letter-spacing: 1px; }
    .inventory-caption > span:last-child { display: none; }
    .project-empty-label { font-size: 24px; }
    .detail-title-bar { gap: 8px; }
  }
  @media (max-width: 600px) {
    .projects-screen { grid-template-rows: 104px minmax(0, 1fr) auto; }
    .projects-header { grid-template-columns: 1fr; grid-template-rows: 1fr 1fr; }
    h1 { position: absolute; top: 0; font-size: min(16vw, 9dvh); margin-top: -.07em; }
    .file-browser { grid-row: 2; padding: 0 5%; gap: 8px; }
    .browser-label > span { font-size: 22px; }
    .browser-label p { font-size: 7px; letter-spacing: 2px; gap: 8px; margin-top: 4px; }
    .browser-label i { width: 5px; height: 5px; }
    .browse-arrow { font-size: 44px; -webkit-text-stroke-width: 1.5px; }
    .projects-body { grid-template-columns: 1fr; grid-template-rows: minmax(0, 1fr) auto; gap: 14px; padding: 12px 6% 8px 0; }
    .project-inventory { width: 100%; }
    .inventory-caption { padding-left: 8%; margin-bottom: 7px; }
    .project-list { gap: 4px; }
    .project-row { gap: 3%; padding: 0 4% 0 3%; }
    .file-emblem { flex-basis: 13%; }
    .file-emblem > span { font-size: clamp(18px, 5.4vw, 23px); }
    .file-emblem .empty-emblem { width: 22%; border-width: 2px; }
    .project-name { font-size: clamp(15px, 4.5vw, 22px); }
    .row-mark { display: none; }
    .blank-mark { height: 9px; }
    .project-detail { width: 100%; margin-top: 0; padding-left: 6%; }
    .detail-title-bar { min-height: 46px; padding: 6px 4% 6px 3%; gap: 8px; border-top-width: 4px; border-radius: 5px 0 0 5px; }
    .detail-emblem { height: 23px; flex-basis: 12%; }
    .detail-emblem > span { width: 18px; height: 12px; border-width: 2px; }
    h2 { font-size: clamp(18px, 5.2vw, 23px); }
    .file-count { min-height: 21px; font-size: 24px; flex-basis: 14%; padding: 1px 8px; }
    .blank-details { gap: 13px; padding-top: 15px; }
    .blank-detail-row { gap: 10px; }
    .blank-detail-icon { height: 17px; }
    .blank-detail-count { height: 19px; font-size: 20px; }
    .project-empty-label { gap: 10px; margin-top: 22px; font-size: 21px; }
    .project-empty-label > span { font-size: 8px; padding: 2px 8px; }
    .detail-tabs { margin: 6px 5% 0; gap: 2px; }
    .detail-tab { padding: 6px 1px; font-size: 10px; border-bottom-width: 2px; }
    .detail-content { height: 159px; padding: 8px 5% 0; gap: 7px; }
    .project-summary { font-size: 12px; line-height: 1.45; }
    .project-stack { gap: 4px; margin-top: 7px; }
    .project-stack > span { padding: 3px 5px; font-size: 10px; }
    .project-story h3 { margin-bottom: 7px; font-size: 20px; }
    .project-story p { font-size: 12px; line-height: 1.45; }
    .project-media { grid-template-columns: repeat(auto-fit, minmax(65px, 1fr)); gap: 6px; }
    .media-thumbnail { padding: 3px; }
    .media-thumbnail > span { padding-top: 5px; font-size: 10px; }
    .project-links { min-height: 25px; }
    .project-links > a { min-height: 25px; font-size: 12px; }
    .projects-footer { padding: 8px 6% 15px 180px; }
    .project-guide > p, .guide-rule { display: none; }
    .projects-back { font-size: 17px; gap: 6px; }
    .projects-back kbd { min-width: 28px; height: 24px; font-size: 8px; }
  }
  @media (max-height: 650px) and (min-width: 601px) {
    .projects-body { padding-top: 12px; }
    .inventory-caption { margin-bottom: 7px; }
    .project-name { font-size: clamp(13px, 1.8vw, 22px); line-height: 1; }
    .project-detail { margin-top: 6px; }
    .detail-title-bar { min-height: 46px; padding-top: 6px; padding-bottom: 6px; border-top-width: 4px; }
    .detail-emblem { height: 26px; }
    h2 { font-size: 28px; }
    .file-count { font-size: 25px; min-height: 24px; }
    .blank-details { gap: 12px; padding-top: 16px; }
    .blank-detail-icon { height: 20px; }
    .blank-detail-count { height: 22px; }
    .project-empty-label { margin-top: 25px; font-size: 23px; }
    .detail-tabs { margin-top: 7px; }
    .detail-tab { padding-top: 6px; padding-bottom: 6px; font-size: 11px; }
    .detail-content { height: 195px; padding: 12px 5%; gap: 9px; }
    .project-summary { font-size: 13px; line-height: 1.5; }
    .project-stack { margin-top: 9px; }
    .project-story p { font-size: 13px; line-height: 1.5; }
    .project-story h3 { font-size: 24px; margin-bottom: 9px; }
    .projects-footer { padding-top: 8px; padding-bottom: 15px; }
    .project-guide > p { font-size: 24px; }
  }
  @media (max-height: 450px) and (min-width: 601px) {
    .projects-screen { grid-template-rows: 56px minmax(0, 1fr) auto; }
    h1 { font-size: min(9.2vw, 14dvh); }
    .projects-body { padding-top: 8px; }
    .project-list { gap: 2px; }
    .project-row { gap: 3%; padding-right: 5%; }
    .project-name { font-size: clamp(12px, 2vw, 18px); line-height: 1; }
    .file-emblem { flex-basis: 14%; }
    .file-emblem > span { font-size: 18px; }
    .row-mark { font-size: 18px; }
    .file-emblem .empty-emblem { width: 20%; border-width: 2px; }
    .blank-details { gap: 9px; padding-top: 12px; }
    .blank-detail-icon { height: 16px; }
    .blank-detail-count { height: 18px; font-size: 19px; }
    .project-empty-label { margin-top: 17px; font-size: 20px; }
    .detail-content { height: 143px; padding: 10px 5%; gap: 7px; }
    .project-summary { font-size: 12px; line-height: 1.45; }
    .project-stack { gap: 4px; margin-top: 7px; }
    .project-stack > span { padding: 3px 5px; font-size: 10px; }
    .project-story p { font-size: 12px; line-height: 1.45; }
    .project-story h3 { font-size: 22px; margin-bottom: 7px; }
    .project-guide > p, .guide-rule { display: none; }
    .projects-back { font-size: 18px; }
    .browser-label > span { font-size: 26px; }
    .browser-label p { margin-top: 6px; }
    .browse-arrow { font-size: 57px; }
  }
  @media (max-height: 650px) and (max-width: 600px) {
    .projects-screen { grid-template-rows: 76px minmax(0, 1fr) auto; }
    h1 { font-size: min(16vw, 7dvh); }
    .browser-label > span { font-size: 19px; }
    .browse-arrow { font-size: 36px; }
    .projects-body { padding-top: 8px; padding-bottom: 4px; gap: 8px; }
    .project-list { gap: 2px; }
    .project-name { font-size: 15px; line-height: 1; }
    .file-emblem > span { font-size: 18px; }
    .detail-title-bar { min-height: 40px; padding-top: 4px; padding-bottom: 4px; }
    .detail-content { height: 118px; padding: 6px 5% 0; gap: 5px; }
    .project-summary { font-size: 11px; line-height: 1.4; }
    .project-stack { gap: 3px; margin-top: 3px; }
    .project-stack > span { padding: 2px 4px; font-size: 9px; }
    .project-story h3 { font-size: 18px; margin-bottom: 6px; }
    .project-story p { font-size: 11px; line-height: 1.4; }
    .blank-details { gap: 8px; padding-top: 10px; }
    .blank-detail-icon { height: 14px; }
    .blank-detail-count { height: 16px; font-size: 17px; }
    .project-empty-label { margin-top: 14px; font-size: 19px; }
    .projects-back { font-size: 15px; }
  }
  @media (prefers-reduced-motion: reduce) {
    .inventory-shards > span { animation: none; }
  }
</style>
