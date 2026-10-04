<script lang="ts">
  import { goto } from '$app/navigation';
  import { tick } from 'svelte';
  import { profile, projects } from '$lib/portfolio';
  import { skills, type SkillGroup } from '$lib/skills';
  import { usePortfolioExperience } from '$lib/portfolioExperience';
  import VideoBackground from '$lib/VideoBackground.svelte';

  const experience = usePortfolioExperience();
  const categories: { label: string; group?: SkillGroup }[] = [
    { label: 'All' }, { label: 'Software', group: 'Software' },
    { label: 'Systems', group: 'Systems' }, { label: 'Hardware', group: 'Hardware' }
  ];
  const groupLabels = { Software: 'CODE', Systems: 'SYS', Hardware: 'HARDWARE' };
  let category = $state(0);
  let activeId = $state(skills[0].id);
  let rows: HTMLButtonElement[] = [];
  let tabs: HTMLButtonElement[] = [];
  const visibleSkills = $derived(skills.filter(skill => !categories[category].group || skill.group === categories[category].group));
  const selected = $derived(skills.find(skill => skill.id === activeId) ?? skills[0]);
  const relatedProjects = $derived(projects.filter(project => selected.projectIds.includes(project.id)));

  async function selectSkill(index: number, focus = false) {
    const next = (index + visibleSkills.length) % visibleSkills.length;
    if (activeId !== visibleSkills[next].id) experience.playTone('select');
    activeId = visibleSkills[next].id;
    await tick();
    if (focus) rows[next]?.focus({ preventScroll: true });
  }

  async function selectCategory(index: number, focus = false) {
    const next = (index + categories.length) % categories.length;
    if (category !== next) experience.playTone('select');
    category = next;
    if (!visibleSkills.some(skill => skill.id === activeId)) activeId = visibleSkills[0].id;
    await tick();
    if (focus) tabs[next]?.focus({ preventScroll: true });
  }

  function tabKey(event: KeyboardEvent, index: number) {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    let next: number | undefined;
    if (event.key === 'ArrowLeft') next = index - 1;
    if (event.key === 'ArrowRight') next = index + 1;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = categories.length - 1;
    if (next === undefined) return;
    event.preventDefault();
    void selectCategory(next, true);
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
    if (target instanceof Element && target.closest('.global-settings, .skills-back')) return;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      void selectCategory(category + (event.key === 'ArrowRight' ? 1 : -1), true);
      return;
    }
    const current = visibleSkills.findIndex(skill => skill.id === activeId);
    let next: number | undefined;
    if (event.key === 'ArrowDown' || event.key.toLowerCase() === 's') next = current + 1;
    if (event.key === 'ArrowUp' || event.key.toLowerCase() === 'w') next = current - 1;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = visibleSkills.length - 1;
    if (next === undefined) return;
    event.preventDefault();
    void selectSkill(next, true);
  }
</script>

<svelte:head>
  <title>Skills — {profile.name}</title>
  <meta name="description" content="Gabriel Cruz’s software, systems, embedded, and RF toolkit. Explore skills from projects and research experience." />
</svelte:head>

<svelte:window onkeydown={handleKey} />

<main class="skills-screen" class:reduce-motion={experience.state.reducedMotion} style={`--skill-accent:${selected.accent}`}>
  <VideoBackground reducedMotion={experience.state.reducedMotion} />
  <div class="status-tint" aria-hidden="true"></div>
  <div class="status-orbit" aria-hidden="true"><span>SKILL STATUS ／ GABRIEL CRUZ ／</span></div>
  <div class="status-shards" aria-hidden="true"><i></i><i></i><i></i></div>

  <header class="skills-header">
    <h1>SKILLS</h1>
    <div class="status-browser">
      <div class="status-command">
        <button class="category-arrow" type="button" aria-label="Previous skill category" onclick={() => selectCategory(category - 1)}><span aria-hidden="true">‹</span><b aria-hidden="true">L</b></button>
        <div class="command-label"><span>Check Skills</span><small>MY PERSONAL TOOLKIT</small></div>
        <button class="category-arrow right-arrow" type="button" aria-label="Next skill category" onclick={() => selectCategory(category + 1)}><b aria-hidden="true">R</b><span aria-hidden="true">›</span></button>
      </div>
      <div class="status-tabs" role="tablist" aria-label="Skill categories">
        {#each categories as item, index}
          <button bind:this={tabs[index]} class="status-tab" type="button" role="tab" id={`category-${index}`}
            aria-selected={category === index} aria-controls="skill-list" tabindex={category === index ? 0 : -1}
            onclick={() => selectCategory(index)} onkeydown={event => tabKey(event, index)}><i aria-hidden="true"></i>{item.label}</button>
        {/each}
      </div>
    </div>
  </header>

  <div class="skills-body">
    <section class="skill-inventory" aria-label="Skill inventory">
      <div class="inventory-caption"><span>{profile.name} / TOOLKIT</span><span>{String(visibleSkills.length).padStart(2, '0')} SKILLS</span></div>
      <div class="skill-list" id="skill-list" role="tabpanel" aria-labelledby={`category-${category}`}>
        {#each visibleSkills as skill, index (skill.id)}
          <button bind:this={rows[index]} class="skill-row" class:selected={activeId === skill.id} type="button"
            id={`skill-${skill.id}`} aria-pressed={activeId === skill.id} aria-controls="skill-details"
            style={`--accent:${skill.accent};--row:${index}`} onmouseenter={() => selectSkill(index)} onfocus={() => selectSkill(index)}
            onclick={() => { experience.playTone('confirm'); void selectSkill(index); }}>
            <span class="skill-emblem" aria-hidden="true"><span>{skill.monogram}</span></span>
            <span class="skill-name">{skill.name}</span>
            <span class="row-category" aria-hidden="true">{groupLabels[skill.group]}</span>
            <span class="row-stat" aria-hidden="true">{#if skill.projectIds.length}<small>PRJ</small><b>{String(skill.projectIds.length).padStart(2, '0')}</b>{:else}<span>TOOL</span>{/if}</span>
          </button>
        {/each}
      </div>
    </section>

    <section class="skill-detail" id="skill-details" aria-labelledby="skill-title">
      <div class="skill-seal" aria-hidden="true"><div class="seal-ring"></div><span>{selected.monogram}</span><i></i></div>
      <div class="skill-dossier">
        <div class="detail-kicker"><span>SKILL STATUS</span><span>{String(skills.findIndex(skill => skill.id === activeId) + 1).padStart(2, '0')} / {skills.length}</span></div>
        <div class="skill-heading"><h2 id="skill-title">{selected.name}</h2><span>{selected.group}</span></div>
        <p class="skill-summary">{selected.summary}</p>
        <div class="skill-focus" aria-label="Focus areas">{#each selected.focus as focus}<span>{focus}</span>{/each}</div>
        {#if relatedProjects.length}
          <div class="project-evidence">
            <p><span>IN THE PROJECTS</span><b>{String(relatedProjects.length).padStart(2, '0')}</b></p>
            <div class="related-projects">{#each relatedProjects.slice(0, 3) as project}<span>{project.name}</span>{/each}{#if relatedProjects.length > 3}<span class="more-projects">+{relatedProjects.length - 3} more</span>{/if}</div>
          </div>
        {:else if selected.evidence}
          <div class="project-evidence"><p><span>EXPERIENCE</span></p><div class="related-projects"><span>{selected.evidence}</span></div></div>
        {/if}
        <a class="explore-projects" href="/projects" onclick={() => experience.playTone('confirm')}>Explore the projects <span aria-hidden="true">↗</span></a>
      </div>
    </section>
  </div>

  <footer class="skills-footer">
    <div class="skill-guide"><p>Which skill do you want to view?</p><span><b>Guide</b><i></i></span><small>↑ ↓ Skills <span>／</span> ← → Categories</small></div>
    <a class="skills-back" href="/" onclick={() => experience.playTone('back')}><kbd>ESC</kbd> Back</a>
  </footer>
</main>

<style>
  .skills-screen { position: relative; isolation: isolate; display: grid; grid-template-rows: 17% minmax(0, 1fr) auto; width: 100%; height: 100vh; height: 100dvh; overflow: hidden; background: #005ce933; }
  .status-tint { position: absolute; z-index: -3; inset: 0; background: linear-gradient(110deg, #007aed55, #0635ad75 48%, #052bafa6), linear-gradient(0deg, #04119a, transparent 80%); pointer-events: none; }
  .status-orbit { position: absolute; z-index: -2; width: min(79vw, 1050px); aspect-ratio: 1; right: -15%; top: 2%; border: clamp(22px, 4vw, 58px) solid #eefaffde; border-radius: 50%; box-shadow: 0 0 0 12px #0452d9, 0 0 0 28px #eefaffb8; transform: rotate(-23deg); pointer-events: none; }
  .status-orbit::before { content: ''; position: absolute; inset: -11%; border: 2px solid #89ffff70; border-radius: 50%; }
  .status-orbit > span { position: absolute; left: 7%; top: 19%; color: #fff; opacity: .35; font: 900 clamp(32px, 5vw, 80px)/1 var(--display); letter-spacing: 4px; transform: rotate(-35deg); }
  .skills-header { position: relative; display: grid; grid-template-columns: 45% minmax(0, 1fr); align-items: center; z-index: 2; background: #fff; color: #050510; }
  h1 { margin: -.12em 0 0 7%; color: #b7b9bd; font: italic 900 clamp(64px, 9vw, 150px)/.9 var(--menu-display); letter-spacing: -.045em; }
  .status-browser { align-self: stretch; display: grid; align-content: center; padding: 0 7% 0 0; }
  .status-command { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
  .category-arrow { display: flex; align-items: center; justify-content: center; gap: 6px; padding: 0; border: 0; background: transparent; color: white; }
  .category-arrow > span { color: white; font: 800 clamp(42px, 5vw, 78px)/.75 var(--display); -webkit-text-stroke: 2px #f22c46; }
  .category-arrow b { color: white; font: italic 900 clamp(44px, 5.4vw, 84px)/.85 var(--display); -webkit-text-stroke: 1.8px #030510; }
  .command-label { text-align: center; }
  .command-label > span { display: block; font: 600 clamp(24px, 2.7vw, 40px)/1 var(--display); }
  .command-label small { display: block; margin-top: 5px; font-size: 8px; font-weight: 700; letter-spacing: 2.5px; }
  .status-tabs { display: flex; justify-content: center; align-items: center; gap: 14px; margin-top: 13px; }
  .status-tab { display: flex; align-items: center; gap: 5px; padding: 3px 0; border: 0; background: transparent; color: #475270; font-size: 10px; font-weight: 700; white-space: nowrap; }
  .status-tab > i { display: block; width: 7px; height: 7px; border-radius: 50%; background: #0a1538; }
  .status-tab[aria-selected='true'] { color: #021239; }
  .status-tab[aria-selected='true'] > i { background: #075aee; box-shadow: 0 0 0 2px white, 0 0 0 3.5px #075aee; }
  .skills-body { display: grid; grid-template-columns: 48% minmax(0, 1fr); gap: 4%; min-height: 0; padding: 22px 5% 8px 0; }
  .skill-inventory { min-width: 0; min-height: 0; display: grid; grid-template-rows: auto minmax(0, 1fr); }
  .inventory-caption { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding-left: 8%; padding-right: 5%; margin-bottom: 12px; color: #bdffff; font-size: 9px; font-weight: 700; letter-spacing: 1.7px; }
  .skill-list { display: grid; grid-template-rows: repeat(12, minmax(0, 1fr)); gap: min(.8dvh, 7px); min-height: 0; }
  .skill-row { position: relative; display: flex; align-items: center; gap: 4%; min-width: 0; min-height: 0; width: 100%; border: 0; padding: 0 6% 0 5%; color: white; background: #02030a; clip-path: polygon(2.5% 0, 100% 0, 97.5% 100%, 0 100%); transition: background .15s, color .15s, transform .15s; }
  .skill-row:nth-child(3n + 2) { transform: translateX(8px); }
  .skill-row:nth-child(3n) { transform: translateX(15px); }
  .skill-row.selected { background: white; color: #020b1c; }
  .skill-row.selected::after { content: ''; position: absolute; top: 0; left: 20%; width: 42%; height: 3px; background: #ff314a; transform: skew(-25deg); }
  .skill-row:focus-visible { outline: 0; box-shadow: inset 0 0 0 3px #ff77d6; }
  .skill-emblem { position: relative; display: grid; place-items: center; align-self: stretch; flex: 0 0 18%; min-width: 0; overflow: hidden; color: white; background: var(--accent); clip-path: polygon(5% 0, 100% 0, 77% 50%, 100% 100%, 0 100%); }
  .skill-emblem::before { content: ''; position: absolute; width: 45%; height: 200%; left: -2%; top: -40%; background: #fff7; transform: rotate(-34deg); }
  .skill-emblem > span { z-index: 1; padding-right: 9%; text-shadow: 1px 2px #07173155; font: italic 800 clamp(20px, 2.2vw, 32px)/1 var(--display); }
  .skill-name { flex: 1; min-width: 0; text-align: left; white-space: nowrap; font: 600 clamp(19px, 1.9vw, 29px)/1 var(--display); }
  .row-category { font: italic 600 clamp(10px, .85vw, 13px)/1 var(--display); letter-spacing: .7px; color: var(--accent); }
  .skill-row.selected .row-category { color: #254b89; }
  .row-stat { display: flex; justify-content: flex-end; align-items: baseline; gap: 3px; flex: 0 0 14%; border-bottom: 3px solid #48f3fa; color: #48f3fa; font: italic 500 clamp(20px, 2.1vw, 32px)/1 var(--display); }
  .row-stat small { font: italic 700 9px/1 var(--display); }
  .row-stat b { font-weight: 500; }
  .row-stat > span { padding-bottom: 3px; color: #f4e85b; font: italic 600 13px/1 var(--display); }
  .skill-row.selected .row-stat { color: #007caa; border-color: #00b9da; }
  .skill-row.selected .row-stat > span { color: #887900; }
  .skill-detail { min-width: 0; min-height: 0; display: grid; grid-template-rows: minmax(80px, 1fr) auto; align-content: center; padding: 0 5% 2% 3%; }
  .skill-seal { position: relative; display: grid; place-items: center; width: min(25vw, 230px); aspect-ratio: 1; align-self: center; justify-self: center; max-height: 25dvh; }
  .seal-ring { position: absolute; inset: 5%; border: 3px solid #8af8ff; border-radius: 50%; box-shadow: 0 0 0 10px #ffffff14, inset 0 0 0 11px #001e8799; }
  .seal-ring::before { content: ''; position: absolute; inset: -12%; border: 11px solid #ffffffb3; border-left-color: transparent; border-bottom-color: transparent; border-radius: 50%; transform: rotate(27deg); }
  .skill-seal > span { position: relative; font: italic 900 clamp(60px, 7vw, 110px)/1 var(--display); color: var(--skill-accent); text-shadow: 4px 4px #00246e, -1px -1px white; }
  .skill-seal > i { position: absolute; width: 21px; height: 21px; bottom: 6%; right: 9%; background: var(--skill-accent); transform: rotate(45deg); box-shadow: 0 0 0 4px #083588; }
  .skill-dossier { position: relative; padding: 20px 6% 16px; background: #032885e8; border-top: 4px solid var(--skill-accent); box-shadow: 8px 8px #04196e66; }
  .detail-kicker { display: flex; justify-content: space-between; gap: 12px; color: #9beeff; font-size: 9px; font-weight: 700; letter-spacing: 1.6px; }
  .skill-heading { display: flex; align-items: baseline; flex-wrap: wrap; gap: 8px 15px; margin-top: 8px; }
  h2 { margin: 0; color: white; font: italic 800 clamp(30px, 3.8vw, 56px)/1 var(--display); }
  .skill-heading > span { padding-bottom: 2px; border-bottom: 2px solid #f4e45b; color: #f4e45b; font: italic 600 18px/1 var(--display); }
  .skill-summary { margin: 14px 0 0; color: #e5f9ff; font-size: clamp(13px, 1.1vw, 16px); line-height: 1.6; }
  .skill-focus { display: flex; flex-wrap: wrap; gap: 5px; margin-top: 13px; }
  .skill-focus > span { border: 1px solid #87eeff8c; padding: 4px 7px; color: #b5fcff; font-size: 10px; }
  .project-evidence { margin-top: 17px; }
  .project-evidence > p { display: flex; align-items: center; gap: 12px; margin: 0 0 8px; font-size: 9px; letter-spacing: 1.5px; color: #a6f8ff; }
  .project-evidence b { padding: 1px 8px; border-radius: 12px; background: #44eaf0; color: #03226e; font: italic 700 16px/1 var(--display); letter-spacing: 0; }
  .related-projects { display: flex; flex-wrap: wrap; gap: 5px 12px; }
  .related-projects > span { color: white; font: 500 17px/1.15 var(--display); }
  .related-projects > span::before { content: '／'; color: var(--skill-accent); padding-right: 2px; }
  .related-projects .more-projects { color: #92f7ff; }
  .explore-projects { display: inline-flex; align-items: center; gap: 20px; margin-top: 17px; padding: 4px 0; color: white; font-size: 11px; text-decoration: underline; text-underline-offset: 4px; }
  .explore-projects > span { color: #ff8fda; font-size: 18px; }
  .skills-footer { display: flex; align-items: flex-end; justify-content: flex-end; gap: 35px; min-height: max(75px, calc(var(--shared-controls-height, 28px) + 26px)); padding: 12px 5% 20px 280px; }
  .skill-guide { width: min(420px, 100%); }
  .skill-guide > p { margin: 0; color: white; font: italic 800 clamp(21px, 2.5vw, 36px)/1 var(--display); text-shadow: 2px 2px #06216c; }
  .skill-guide > span { display: flex; align-items: center; gap: 8px; margin-top: 5px; }
  .skill-guide b { font-size: 8px; font-weight: 500; }
  .skill-guide i { flex: 1; height: 2px; background: white; }
  .skill-guide small { display: block; margin-top: 6px; color: #c6ffff; font-size: 9px; }
  .skill-guide small > span { color: #ff8fda; padding: 0 8px; }
  .skills-back { display: flex; align-items: center; gap: 8px; flex-shrink: 0; color: white; font: italic 700 22px/1 var(--display); }
  .skills-back kbd { display: grid; place-items: center; min-width: 32px; height: 26px; padding: 0 6px; border: 2px solid white; border-radius: 20px; background: #001d709c; box-shadow: 0 0 0 2px #7394c9; font: 700 9px/1 'DM Sans', sans-serif; }
  .status-shards { position: absolute; z-index: -1; inset: 0; pointer-events: none; }
  .status-shards i { position: absolute; width: 13px; height: 32px; background: #ff6dd0; opacity: .6; clip-path: polygon(0 0, 100% 23%, 30% 100%); transform: rotate(-18deg); }
  .status-shards i:nth-child(1) { left: 46%; top: 31%; }
  .status-shards i:nth-child(2) { right: 5%; top: 59%; transform: rotate(40deg); }
  .status-shards i:nth-child(3) { left: 39%; bottom: 8%; }
  @media (max-width: 1000px) {
    .skills-body { grid-template-columns: 49% minmax(0, 1fr); gap: 3%; padding-right: 4%; }
    .row-category { display: none; }
    .skill-detail { padding-left: 0; padding-right: 0; }
    .skill-dossier { padding: 15px 5% 13px; }
    .status-tabs { gap: 10px; }
    .status-tab { font-size: 9px; }
    .skill-heading > span { font-size: 15px; }
    .skills-footer { gap: 20px; padding-left: 260px; }
  }
  @media (max-width: 600px) {
    .skills-screen { grid-template-rows: 110px minmax(0, 1fr) auto; }
    .skills-header { grid-template-columns: 1fr; grid-template-rows: 39px 1fr; }
    h1 { margin: -.08em 0 0 5%; font-size: 40px; }
    .status-browser { padding: 0 6% 5px; }
    .category-arrow b { font-size: 30px; -webkit-text-stroke-width: 1px; }
    .category-arrow > span { font-size: 34px; -webkit-text-stroke-width: 1.2px; }
    .command-label > span { font-size: 24px; }
    .command-label small { display: none; }
    .status-tabs { gap: 14px; margin-top: 8px; }
    .status-tab { font-size: 9px; gap: 5px; }
    .status-tab > i { width: 5px; height: 5px; }
    .skills-body { grid-template-columns: 1fr; grid-template-rows: minmax(0, 1fr) auto; gap: 13px; padding: 11px 6% 4px 0; }
    .inventory-caption { margin-bottom: 7px; font-size: 8px; letter-spacing: 1px; }
    .skill-list { gap: 3px; }
    .skill-row { padding: 0 5% 0 4%; gap: 5%; }
    .skill-row:nth-child(3n + 2) { transform: translateX(3px); }
    .skill-row:nth-child(3n) { transform: translateX(6px); }
    .skill-emblem { flex-basis: 15%; }
    .skill-emblem > span { font-size: 21px; }
    .skill-name { font-size: 19px; }
    .row-category { display: block; font-size: 9px; }
    .row-stat { flex-basis: 12%; font-size: 24px; border-bottom-width: 2px; }
    .row-stat small { font-size: 7px; }
    .row-stat > span { font-size: 11px; padding-bottom: 2px; }
    .skill-row.selected::after { height: 2px; }
    .skill-detail { display: block; padding: 0 0 0 6%; }
    .skill-seal { display: none; }
    .skill-dossier { padding: 10px 5% 9px; box-shadow: 5px 5px #04196e66; border-top-width: 3px; min-height: 202px; }
    .detail-kicker { font-size: 7px; letter-spacing: 1px; }
    .skill-heading { margin-top: 5px; gap: 5px 10px; }
    h2 { font-size: 28px; }
    .skill-heading > span { font-size: 14px; }
    .skill-summary { margin-top: 7px; font-size: 11px; line-height: 1.45; }
    .skill-focus { gap: 4px; margin-top: 7px; }
    .skill-focus > span { padding: 3px 5px; font-size: 8px; }
    .project-evidence { margin-top: 9px; }
    .project-evidence > p { margin-bottom: 5px; font-size: 7px; letter-spacing: 1px; }
    .project-evidence b { font-size: 12px; padding: 1px 6px; }
    .related-projects { gap: 3px 7px; }
    .related-projects > span { font-size: 13px; }
    .explore-projects { margin-top: 7px; padding: 2px 0; font-size: 10px; gap: 10px; }
    .explore-projects > span { font-size: 13px; }
    .status-orbit { right: -34%; top: 39%; width: 120vw; border-width: 19px; opacity: .35; }
    .skills-footer { min-height: max(55px, calc(var(--shared-controls-height, 28px) + 24px)); padding: 8px 6% 17px 190px; }
    .skill-guide { display: none; }
    .skills-back { font-size: 17px; }
    .skills-back kbd { min-width: 28px; height: 24px; font-size: 8px; }
  }
  @media (max-height: 650px) and (min-width: 601px) {
    .skills-screen { grid-template-rows: 82px minmax(0, 1fr) auto; }
    h1 { font-size: min(10vw, 14dvh); }
    .category-arrow b { font-size: 42px; }
    .category-arrow > span { font-size: 42px; }
    .command-label > span { font-size: 27px; }
    .command-label small { font-size: 7px; margin-top: 3px; }
    .status-tabs { margin-top: 7px; }
    .skills-body { padding-top: 10px; }
    .inventory-caption { margin-bottom: 7px; font-size: 8px; letter-spacing: 1px; }
    .skill-list { gap: 3px; }
    .skill-name { font-size: 20px; }
    .skill-emblem > span { font-size: 21px; }
    .row-stat { font-size: 23px; border-bottom-width: 2px; }
    .row-stat small { font-size: 7px; }
    .row-stat > span { font-size: 10px; }
    .skill-detail { grid-template-rows: minmax(0, 1fr) auto; }
    .skill-seal { width: 90px; max-height: 90px; }
    .skill-seal > span { font-size: 43px; }
    .skill-seal > i { width: 12px; height: 12px; }
    .seal-ring::before { border-width: 5px; }
    .skill-dossier { padding: 10px 5%; border-top-width: 3px; }
    h2 { font-size: 34px; }
    .skill-summary { margin-top: 8px; font-size: 12px; line-height: 1.45; }
    .skill-focus { margin-top: 7px; }
    .skill-focus > span { font-size: 8px; padding: 3px 5px; }
    .project-evidence { margin-top: 10px; }
    .project-evidence > p { font-size: 7px; margin-bottom: 5px; }
    .related-projects > span { font-size: 14px; }
    .explore-projects { margin-top: 9px; font-size: 10px; }
    .skills-footer { min-height: 56px; padding-top: 8px; padding-bottom: 16px; }
    .skill-guide > p { font-size: 23px; }
  }
  @media (max-height: 450px) and (min-width: 601px) {
    .skills-screen { grid-template-rows: 63px minmax(0, 1fr) auto; }
    .command-label small, .skill-seal, .skill-guide { display: none; }
    .category-arrow b, .category-arrow > span { font-size: 32px; }
    .command-label > span { font-size: 24px; }
    .status-tabs { margin-top: 4px; }
    .skills-body { padding-top: 7px; padding-bottom: 3px; }
    .skill-list { gap: 2px; }
    .skill-name { font-size: 16px; }
    .skill-emblem > span { font-size: 16px; }
    .row-stat { font-size: 18px; }
    .skill-detail { display: flex; align-items: flex-start; }
    .skill-dossier { width: 100%; padding-top: 8px; padding-bottom: 7px; }
    .skill-heading { margin-top: 5px; }
    h2 { font-size: 29px; }
    .detail-kicker { font-size: 7px; }
    .skill-summary { font-size: 11px; }
    .project-evidence { margin-top: 7px; }
    .related-projects > span { font-size: 12px; }
    .skills-footer { min-height: max(51px, calc(var(--shared-controls-height, 28px) + 23px)); }
    .skills-back { font-size: 18px; }
  }
  @media (max-height: 650px) and (max-width: 600px) {
    .skills-screen { grid-template-rows: 72px minmax(0, 1fr) auto; }
    .skills-header { grid-template-rows: 25px 1fr; }
    h1 { font-size: 28px; }
    .command-label > span { font-size: 20px; }
    .category-arrow b, .category-arrow > span { font-size: 26px; }
    .status-tabs { gap: 10px; margin-top: 5px; }
    .status-tab { font-size: 8px; }
    .skills-body { padding-top: 7px; gap: 8px; }
    .inventory-caption { margin-bottom: 5px; font-size: 7px; }
    .skill-list { gap: 2px; }
    .skill-name { font-size: 15px; }
    .skill-emblem > span { font-size: 16px; }
    .row-stat { font-size: 17px; }
    .row-stat small { font-size: 6px; }
    .row-category { font-size: 8px; }
    .row-stat > span { font-size: 9px; }
    .skill-dossier { min-height: 164px; padding: 7px 5%; }
    .detail-kicker, .skill-focus { display: none; }
    .skill-heading { margin-top: 0; }
    h2 { font-size: 25px; }
    .skill-heading > span { font-size: 12px; }
    .skill-summary { font-size: 10px; margin-top: 5px; line-height: 1.4; }
    .skill-focus { margin-top: 5px; gap: 3px; }
    .skill-focus > span { padding: 2px 4px; font-size: 7px; }
    .project-evidence { margin-top: 7px; }
    .related-projects > span { font-size: 11px; }
    .explore-projects { margin-top: 6px; font-size: 9px; }
    .skills-footer { min-height: max(51px, calc(var(--shared-controls-height, 28px) + 23px)); padding-top: 6px; padding-bottom: 16px; }
    .skills-back { font-size: 16px; }
  }
  .reduce-motion .skill-row { transition: none; }
  @media (prefers-reduced-motion: reduce) { .skill-row { transition: none; } }
</style>
