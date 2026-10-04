<script module lang="ts">
  interface MusicPlayer {
    playVideo(): void;
    pauseVideo(): void;
    unMute(): void;
    setVolume(volume: number): void;
    destroy(): void;
  }

  interface MusicEvents {
    onReady(event: { target: MusicPlayer }): void;
    onStateChange(event: { data: number }): void;
    onError(): void;
    onAutoplayBlocked(): void;
  }

  interface YouTubeAPI {
    Player: new (frame: HTMLIFrameElement, options: { events: MusicEvents }) => MusicPlayer;
  }

  type YouTubeWindow = Window & {
    YT?: YouTubeAPI;
    onYouTubeIframeAPIReady?: () => void;
  };

  let apiPromise: Promise<YouTubeAPI> | undefined;

  function loadMusicAPI(): Promise<YouTubeAPI> {
    const host = window as YouTubeWindow;
    if (host.YT?.Player) return Promise.resolve(host.YT);
    if (apiPromise) return apiPromise;

    apiPromise = new Promise((resolve, reject) => {
      const previousReady = host.onYouTubeIframeAPIReady;
      let script = document.querySelector<HTMLScriptElement>('script[src="https://www.youtube.com/iframe_api"]');
      let settled = false;

      const finish = (error?: Error) => {
        if (settled || (!error && !host.YT?.Player)) return;
        settled = true;
        window.clearTimeout(timeout);
        window.clearInterval(poll);
        script?.removeEventListener('error', onError);
        if (host.onYouTubeIframeAPIReady === onReady) host.onYouTubeIframeAPIReady = previousReady;
        if (error) reject(error);
        else resolve(host.YT!);
      };
      const onError = () => finish(new Error('Music player unavailable'));
      const onReady = () => {
        try { previousReady?.(); } catch { /* Another player's callback must not block this one. */ }
        finish();
      };
      const poll = window.setInterval(() => finish(), 100);
      const timeout = window.setTimeout(onError, 15000);
      host.onYouTubeIframeAPIReady = onReady;

      if (!script) {
        script = document.createElement('script');
        script.src = 'https://www.youtube.com/iframe_api';
        script.async = true;
        script.addEventListener('error', onError, { once: true });
        document.head.append(script);
      } else {
        script.addEventListener('error', onError, { once: true });
      }
    });
    return apiPromise;
  }
</script>

<script lang="ts">
  import { onMount, tick } from 'svelte';

  const trackId = 'NQ8mg_lSfxQ';
  const trackTitle = 'Color Your Night (Instrumental)';
  const quietVolume = 8;
  let enabled = $state(true);
  let playing = $state(false);
  let unavailable = $state(false);
  let showFrame = $state(false);
  let origin = $state('');
  let frame = $state<HTMLIFrameElement>();
  let button = $state<HTMLButtonElement>();
  let player: MusicPlayer | undefined;
  let ready = $state(false);
  let activated = false;
  let hidden = false;
  let initializing = $state(false);
  let disposed = false;
  let fadeTimer: number | undefined;
  let waiting = $derived(initializing || (showFrame && !ready));

  function clearFade() {
    if (fadeTimer !== undefined) window.clearInterval(fadeTimer);
    fadeTimer = undefined;
  }

  function wantsPlayback() {
    return enabled && activated && !hidden && !disposed && !unavailable;
  }

  function fadeIn() {
    clearFade();
    const startedAt = Date.now();
    fadeTimer = window.setInterval(() => {
      if (!player || !playing || !wantsPlayback()) {
        clearFade();
        return;
      }
      const progress = Math.min(1, (Date.now() - startedAt) / 800);
      try { player.setVolume(quietVolume * progress); } catch { fail(); }
      if (progress === 1) clearFade();
    }, 40);
  }

  function pause() {
    clearFade();
    playing = false;
    if (!ready || !player) return;
    try {
      player.setVolume(0);
      player.pauseVideo();
    } catch { fail(); }
  }

  function fail() {
    clearFade();
    playing = false;
    unavailable = true;
    ready = false;
    showFrame = false;
    const oldPlayer = player;
    player = undefined;
    try { oldPlayer?.destroy(); } catch { /* The iframe may already be gone. */ }
  }

  function play() {
    if (!ready || !player || !wantsPlayback()) return;
    try {
      if (!playing) player.setVolume(0);
      player.unMute();
      player.playVideo();
    } catch { fail(); }
  }

  async function activate() {
    activated = true;
    if (player) {
      if (ready) play();
      return;
    }
    if (initializing || disposed || unavailable) return;
    initializing = true;
    showFrame = true;
    try {
      const api = await loadMusicAPI();
      await tick();
      if (disposed || !frame) return;
      player = new api.Player(frame, {
        events: {
          onReady: (event) => {
            if (disposed || unavailable) {
              try { event.target.destroy(); } catch { /* Already disposed. */ }
              return;
            }
            player = event.target;
            ready = true;
            try { player.setVolume(0); } catch { fail(); return; }
            play();
          },
          onStateChange: ({ data }) => {
            if (disposed || unavailable) return;
            if (data === 1) {
              if (!wantsPlayback()) {
                pause();
                return;
              }
              playing = true;
              fadeIn();
            } else {
              playing = false;
              clearFade();
              try { if (ready) player?.setVolume(0); } catch { fail(); }
              if (data === 0) play();
            }
          },
          onError: fail,
          onAutoplayBlocked: () => {
            playing = false;
            clearFade();
            try { if (ready) player?.setVolume(0); } catch { fail(); }
          }
        }
      });
    } catch {
      if (!disposed) fail();
    } finally {
      initializing = false;
    }
  }

  function setEnabled(value: boolean) {
    enabled = value;
    try { localStorage.setItem('reload-music', value ? 'on' : 'off'); } catch { /* Storage is optional. */ }
  }

  function toggleMusic(event: MouseEvent) {
    if (!event.isTrusted || unavailable) return;
    if (playing || (enabled && waiting)) {
      setEnabled(false);
      pause();
    } else {
      setEnabled(true);
      void activate();
    }
  }

  onMount(() => {
    origin = window.location.origin;
    hidden = document.hidden;
    try { enabled = localStorage.getItem('reload-music') !== 'off'; } catch { /* Use the quiet default. */ }

    const firstInteraction = (event: Event) => {
      if (!event.isTrusted || activated || !enabled || unavailable) return;
      if (event.target instanceof Node && button?.contains(event.target)) return;
      if (event instanceof KeyboardEvent && ['Shift', 'Control', 'Alt', 'Meta', 'CapsLock'].includes(event.key)) return;
      void activate();
    };
    const visibilityChanged = () => {
      hidden = document.hidden;
      if (hidden) pause();
      else if (activated && enabled) play();
    };
    document.addEventListener('pointerdown', firstInteraction, true);
    document.addEventListener('keydown', firstInteraction, true);
    document.addEventListener('visibilitychange', visibilityChanged);

    return () => {
      disposed = true;
      clearFade();
      document.removeEventListener('pointerdown', firstInteraction, true);
      document.removeEventListener('keydown', firstInteraction, true);
      document.removeEventListener('visibilitychange', visibilityChanged);
      const oldPlayer = player;
      player = undefined;
      try {
        if (ready) {
          oldPlayer?.setVolume(0);
          oldPlayer?.pauseVideo();
        }
      } catch { /* Navigation may have already removed the iframe. */ }
      try { oldPlayer?.destroy(); } catch { /* Already disposed. */ }
    };
  });
</script>

<button
  bind:this={button}
  class="setting music-setting"
  aria-label="Toggle background music"
  aria-pressed={enabled}
  title={trackTitle}
  disabled={unavailable}
  onclick={toggleMusic}
>
  MUSIC <span>{unavailable ? 'UNAVAILABLE' : !enabled ? 'OFF' : playing ? 'ON' : waiting ? 'WAIT' : 'PLAY'}</span>
</button>

{#if showFrame}
  <div class="music-player" aria-hidden="true">
    <iframe
      bind:this={frame}
      title={trackTitle}
      src={`https://www.youtube.com/embed/${trackId}?autoplay=0&mute=0&loop=1&playlist=${trackId}&controls=0&playsinline=1&disablekb=1&enablejsapi=1&origin=${encodeURIComponent(origin)}&rel=0`}
      tabindex="-1"
      allow="autoplay; encrypted-media"
      referrerpolicy="strict-origin-when-cross-origin"
    ></iframe>
  </div>
{/if}

<style>
  .music-player {
    position: fixed;
    width: 320px;
    height: 200px;
    inset: auto auto 0 0;
    z-index: -5;
    overflow: hidden;
    opacity: 0;
    pointer-events: none;
  }

  iframe {
    position: absolute;
    width: 320px;
    height: 200px;
    border: 0;
    pointer-events: none;
  }
</style>
