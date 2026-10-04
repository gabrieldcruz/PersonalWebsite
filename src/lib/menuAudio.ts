export type MenuSound = 'select' | 'confirm' | 'back';
export type MenuAudio = ReturnType<typeof createMenuAudio>;

type AudioWindow = Window & { webkitAudioContext?: typeof AudioContext };

/** Quiet, original menu cues. No audio resources are created before a user gesture. */
export function createMenuAudio() {
  let context: AudioContext | undefined;
  let output: GainNode | undefined;
  let voices: Set<() => void> | undefined;
  let disposed = false;
  let muted = true;
  let lastSelection = -Infinity;
  let activation = 0;

  async function unlock(event?: Event): Promise<boolean> {
    if (disposed || typeof window === 'undefined') return false;
    const request = ++activation;

    // A running context has already been allowed by the browser. Resuming or
    // creating one must happen synchronously inside a trusted activation handler.
    if (context?.state !== 'running') {
      const trustedGesture = event?.isTrusted && /^(click|pointerdown|pointerup|touchend|keydown)$/.test(event.type);
      if (!trustedGesture && !navigator.userActivation?.isActive) return false;
    }

    try {
      if (!context || context.state === 'closed') {
        const AudioConstructor = window.AudioContext ?? (window as AudioWindow).webkitAudioContext;
        if (!AudioConstructor) return false;
        context = new AudioConstructor();
        output = context.createGain();
        output.gain.value = 0.7;
        output.connect(context.destination);
        voices = new Set();
      }

      // Call resume before the first await so Safari keeps the user activation.
      if (context.state !== 'running') await context.resume();
      if (disposed || request !== activation || context.state !== 'running') return false;
      muted = false;
      return true;
    } catch {
      if (request === activation) muted = true;
      return false;
    }
  }

  function tone(type: OscillatorType, from: number, to: number, start: number, duration: number, volume: number) {
    if (!context || !output || !voices) return;
    const oscillator = context.createOscillator();
    const envelope = context.createGain();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(from, start);
    oscillator.frequency.exponentialRampToValueAtTime(to, start + duration);
    envelope.gain.setValueAtTime(0.0001, start);
    envelope.gain.exponentialRampToValueAtTime(volume, start + 0.003);
    envelope.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    oscillator.connect(envelope);
    envelope.connect(output);

    const cleanup = () => {
      oscillator.onended = null;
      oscillator.disconnect();
      envelope.disconnect();
      voices?.delete(stop);
    };
    const stop = () => {
      try { oscillator.stop(); } catch { /* Already stopped. */ }
      cleanup();
    };
    voices.add(stop);
    oscillator.onended = cleanup;
    oscillator.start(start);
    oscillator.stop(start + duration + 0.005);
  }

  function play(kind: MenuSound): boolean {
    if (disposed || muted || !context || context.state !== 'running') return false;
    const now = context.currentTime;
    if (kind === 'select') {
      // Hover and focus can arrive together, and rapid pointer movement should
      // stay quiet. Confirmation and back cues are never rate limited.
      if (now - lastSelection < 0.05) return false;
      lastSelection = now;
      tone('triangle', 1450, 940, now, 0.036, 0.026);
      tone('sine', 2850, 1900, now, 0.019, 0.008);
    } else if (kind === 'confirm') {
      tone('triangle', 880, 1320, now, 0.045, 0.031);
      tone('sine', 1760, 2640, now + 0.04, 0.065, 0.019);
    } else {
      tone('triangle', 1050, 560, now, 0.06, 0.025);
      tone('sine', 520, 360, now + 0.025, 0.045, 0.011);
    }
    return true;
  }

  async function suspend(): Promise<void> {
    ++activation;
    muted = true;
    voices?.forEach(stop => stop());
    if (context && context.state !== 'closed') {
      try { await context.suspend(); } catch { /* Muting still works if suspension is unavailable. */ }
    }
  }

  function dispose(): void {
    ++activation;
    disposed = true;
    muted = true;
    voices?.forEach(stop => stop());
    voices?.clear();
    output?.disconnect();
    if (context && context.state !== 'closed') void context.close().catch(() => {});
    output = undefined;
    context = undefined;
    voices = undefined;
  }

  return { unlock, play, suspend, dispose };
}
