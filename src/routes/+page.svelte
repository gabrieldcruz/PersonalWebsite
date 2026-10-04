<script lang="ts">
  import { onMount, tick } from 'svelte';
  import TriangleBackground from '$lib/TriangleBackground.svelte';
  import VideoBackground from '$lib/VideoBackground.svelte';
  import MenuLabel from '$lib/MenuLabel.svelte';
  import { goto } from '$app/navigation';
  import { usePortfolioExperience } from '$lib/portfolioExperience';
  import { attachMenuWheel } from '$lib/menuWheel';
  import { options, profile, projects, skillGroups, externalLink, resumeLink, emailLink, phoneLink, type ChapterId } from '$lib/portfolio';

  let active = $state(0);
  let opened = $state<ChapterId | null>(null);
  let dialog: HTMLDialogElement;
  let controls: HTMLElement[] = [];
  let dateLabel = $state('PERSONAL');
  let dayLabel = $state('PORTFOLIO');
  const experience = usePortfolioExperience();
  const reducedMotion = $derived(experience.state.reducedMotion);
  const { playTone } = experience;
  let previousOverflow = '';
  const selected = $derived(options[active]);
  const openedOption = $derived(options.find(option => option.id === opened));
  const resumeUrl = resumeLink(profile.resume);

  onMount(() => {
    previousOverflow = document.body.style.overflow;
    const updateDate = () => {
      const now = new Date();
      dateLabel = now.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit' });
      dayLabel = now.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();
    };
    updateDate();
    const timer = window.setInterval(updateDate, 60000);
    const removeWheel = attachMenuWheel(direction => select((active + direction + options.length) % options.length), () => opened === null);
    return () => {
      clearInterval(timer);
      removeWheel();
      document.body.style.overflow = previousOverflow;
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
    if (opened || event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return;
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
    if (id === 'about') {
      await goto('/about');
      return;
    }
    opened = id;
    await tick();
    if (!dialog.open) dialog.showModal();
    dialog.scrollTop = 0;
    document.body.style.overflow = 'hidden';
  }
  function closeChapter() { dialog.close(); }
  function didClose() {
    playTone('back');
    opened = null;
    document.body.style.overflow = previousOverflow;
  }
</script>

<svelte:window onkeydown={navigateFromPage} />

<svelte:head>
  <title>{profile.name} / Portfolio Reload</title>
  <meta name="description" content="Gabriel Cruz — computer science and mathematics student exploring software, systems, and embedded development." />
</svelte:head>

<div class="reload-shell" class:reduce-motion={reducedMotion}>
  <VideoBackground {reducedMotion} paused={opened !== null} />
  <div class="art-shade" aria-hidden="true"></div>
  <TriangleBackground {active} {reducedMotion} paused={opened !== null} />
  <div class="side-counter" aria-hidden="true">0{active + 1}</div>
  <div class="screen-texture" aria-hidden="true"></div>

  <header class="hud">
    <div class="nameplate"><span class="nameplate-small">PLAYER PROFILE / 001 <span class="profile-date">{dateLabel} · {dayLabel}</span></span><h1>{profile.name}</h1><span class="nameplate-school">CS + MATHEMATICS <span>／</span> GEORGIA TECH</span></div>
  </header>

  <main class="menu-area">
    <nav class="pause-menu" aria-label="Portfolio navigation">
      {#each options as option, i}
        <div class="option-wrap" class:active={active === i} style={`--angle:${option.rotation}deg;--offset:${option.offsetX}px;--lift:${option.offsetY}px;--order:${i};z-index:${option.zIndex}`}>
          <svelte:element this={option.id === 'about' ? 'a' : 'button'} bind:this={controls[i]} role={option.id === 'about' ? 'link' : 'button'}
            href={option.id === 'about' ? '/about' : undefined} type={option.id === 'about' ? undefined : 'button'} class="menu-option" class:selected={active === i}
            aria-label={option.name} aria-haspopup={option.id === 'about' ? undefined : 'dialog'} aria-expanded={option.id === 'about' ? undefined : opened === option.id} onmouseenter={() => select(i)} onfocus={() => select(i)}
            onkeydown={(event: KeyboardEvent) => navigate(event, i)} onclick={() => option.id === 'about' ? playTone('confirm') : openChapter(option.id)}>
            <MenuLabel label={option.name} index={i} selected={active === i} />
          </svelte:element>
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

  <dialog bind:this={dialog} class="dossier" aria-labelledby="dossier-title" onclose={didClose}>
    <div class="dossier-header"><span>PORTFOLIO / {openedOption?.name ?? ''}</span><button class="close-button" onclick={closeChapter} aria-label="Close chapter">BACK <kbd>Esc</kbd></button></div>
    <div class="dossier-content">
      <div class="dossier-heading"><span class="dossier-kicker">GABRIEL CRUZ / PERSONAL FILE</span><h2 id="dossier-title">{openedOption?.name ?? ''}<span>.</span></h2></div>
      {#if opened === 'projects'}
        <p class="body-copy">Web applications, automation, and things that interact with the physical world.</p>
        <div class="project-files">
          {#each projects as project, i}
            <details class="project-file" open={i === 0}>
              <summary><span class="file-index">0{i + 1}</span><div><span class="file-category">{project.category}</span><h3>{project.name}</h3></div><span class="file-expand" aria-hidden="true">+</span></summary>
              <div class="file-body"><p>{project.summary}</p><ul>{#each project.features as feature}<li>{feature}</li>{/each}</ul><div class="tag-list">{#each project.stack as tag}<span>{tag}</span>{/each}</div>
                {#if externalLink(project.github)}<a class="text-link" href={externalLink(project.github)} target="_blank" rel="noopener noreferrer">View code</a>{/if}
                {#if externalLink(project.demo)}<a class="text-link" href={externalLink(project.demo)} target="_blank" rel="noopener noreferrer">Open demo</a>{/if}
              </div>
            </details>
          {/each}
        </div>
      {:else if opened === 'skills'}
        <p class="body-copy">The languages and tools I've used across software and hardware projects.</p>
        <div class="skill-groups">{#each skillGroups as group, i}<section class="skill-group"><span class="skill-number">0{i + 1}</span><div><span class="file-category">{group.note}</span><h3>{group.name}</h3><div class="tag-list">{#each group.items as item}<span>{item}</span>{/each}</div></div></section>{/each}</div>
      {:else if opened === 'resume'}
        <p class="lead">{profile.name}</p><p class="body-copy">{profile.degree}<br />{profile.school}</p>
        <dl class="profile-grid"><div><dt>FOCUS</dt><dd>Software engineering<br />Systems & embedded development</dd></div><div><dt>PROJECT EXPERIENCE</dt><dd>Django web applications<br />Python automation<br />ESP32 prototypes</dd></div></dl>
        {#if resumeUrl}<a class="solid-button" href={resumeUrl} target="_blank" rel="noopener noreferrer">Open resume PDF</a>{:else}<div class="empty-link"><span>RESUME PDF</span><p>A downloadable resume hasn't been added yet.</p></div>{/if}
      {:else if opened === 'links'}
        <p class="lead">Let's make something worth building.</p><p class="body-copy">Find my code, connect professionally, or get in touch.</p>
        <div class="link-list">
          {#each [{ name: 'GitHub', sub: 'Code & experiments', href: externalLink(profile.github) }, { name: 'LinkedIn', sub: 'Professional profile', href: externalLink(profile.linkedin) }, { name: 'Email', sub: 'Start a conversation', href: emailLink(profile.email) }, { name: 'Phone', sub: profile.phone, href: phoneLink(profile.phone) }] as link}
            {#if link.href}<a href={link.href} target={link.name === 'Phone' ? undefined : '_blank'} rel="noopener noreferrer" class="link-row"><div><h3>{link.name}</h3><span>{link.sub}</span></div><span>OPEN</span></a>{:else}<div class="link-row unavailable"><div><h3>{link.name}</h3><span>{link.sub}</span></div><span>COMING SOON</span></div>{/if}
          {/each}
        </div>
      {/if}
    </div>
    <div class="dossier-footer"><span>KEEP EXPLORING.</span><button onclick={closeChapter}>Return to menu</button></div>
  </dialog>
</div>
