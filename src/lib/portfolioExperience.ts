import { getContext, onMount, setContext } from 'svelte';
import { createMenuAudio, type MenuAudio, type MenuSound } from '$lib/menuAudio';

export interface ExperienceState {
  soundOn: boolean;
  soundUnavailable: boolean;
  reducedMotion: boolean;
  systemReduced: boolean;
}

export interface PortfolioExperience {
  state: ExperienceState;
  playTone: (kind?: MenuSound) => void;
  toggleSound: (event: MouseEvent) => void;
  toggleMotion: () => void;
}

const experienceContext = Symbol('portfolio-experience');

/** The root layout owns audio and preferences so route changes preserve them. */
export function createPortfolioExperience(state: ExperienceState): PortfolioExperience {
  let audio: MenuAudio | undefined;
  let audioReady = false;
  let audioUnlock: Promise<boolean> | undefined;
  let destroyed = true;
  let audioGeneration = 0;

  function unlockAudio(event: Event): void {
    if (!event.isTrusted || !state.soundOn || state.soundUnavailable || audioUnlock || !audio) return;
    const generation = audioGeneration;
    const attempt = audio.unlock(event);
    audioUnlock = attempt;
    void attempt.then(available => {
      if (destroyed || generation !== audioGeneration || audioUnlock !== attempt || !state.soundOn) return;
      audioReady = available;
      audioUnlock = undefined;
      if (!available) {
        state.soundUnavailable = true;
        state.soundOn = false;
      }
    });
  }

  function playTone(kind: MenuSound = 'select'): void {
    if (!state.soundOn || !audio || destroyed) return;
    if (audioReady && audio.play(kind)) return;
    if (audioUnlock) {
      const generation = audioGeneration;
      const currentAudio = audio;
      void audioUnlock.then(available => {
        if (available && state.soundOn && !destroyed && generation === audioGeneration && audio === currentAudio) {
          currentAudio.play(kind);
        }
      });
    }
  }

  function toggleSound(event: MouseEvent): void {
    if (state.soundUnavailable) return;
    state.soundOn = !state.soundOn;
    try { localStorage.setItem('reload-sound', state.soundOn ? 'on' : 'off'); } catch {}
    if (state.soundOn) {
      unlockAudio(event);
      playTone('confirm');
    } else {
      ++audioGeneration;
      audioReady = false;
      audioUnlock = undefined;
      void audio?.suspend();
    }
  }

  function toggleMotion(): void {
    if (state.systemReduced) return;
    state.reducedMotion = !state.reducedMotion;
    try { localStorage.setItem('reload-reduce-motion', String(state.reducedMotion)); } catch {}
  }

  onMount(() => {
    destroyed = false;
    ++audioGeneration;
    audio = createMenuAudio();
    try { state.soundOn = localStorage.getItem('reload-sound') !== 'off'; } catch {}
    window.addEventListener('pointerdown', unlockAudio, { capture: true });
    window.addEventListener('keydown', unlockAudio, { capture: true });

    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateMotion = () => {
      state.systemReduced = media.matches;
      let saved = false;
      try { saved = localStorage.getItem('reload-reduce-motion') === 'true'; } catch {}
      state.reducedMotion = state.systemReduced || saved;
    };
    updateMotion();
    media.addEventListener('change', updateMotion);

    return () => {
      destroyed = true;
      ++audioGeneration;
      audioReady = false;
      audioUnlock = undefined;
      media.removeEventListener('change', updateMotion);
      window.removeEventListener('pointerdown', unlockAudio, { capture: true });
      window.removeEventListener('keydown', unlockAudio, { capture: true });
      audio?.dispose();
      audio = undefined;
    };
  });

  return { state, playTone, toggleSound, toggleMotion };
}

export function providePortfolioExperience(experience: PortfolioExperience): PortfolioExperience {
  setContext(experienceContext, experience);
  return experience;
}

export function usePortfolioExperience(): PortfolioExperience {
  const experience = getContext<PortfolioExperience | undefined>(experienceContext);
  if (!experience) {
    throw new Error('Portfolio experience is missing. Provide it from the root layout during initialization.');
  }
  return experience;
}
