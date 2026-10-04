/** Move one menu selection at a time without scrolling the page. */
export function attachMenuWheel(step: (direction: number) => void, enabled: () => boolean = () => true): () => void {
  let accumulated = 0;
  let lastChange = -Infinity;
  let lastEvent = -Infinity;

  function handleWheel(event: WheelEvent) {
    if (!enabled() || event.defaultPrevented || event.ctrlKey || event.metaKey || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
    const target = event.target;
    if (target instanceof Element && target.closest('.global-settings, a:not(.menu-option), input, textarea, select, [contenteditable="true"], dialog')) return;
    if (!event.deltaY) return;
    event.preventDefault();
    const now = performance.now();
    const delta = event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? window.innerHeight : 1);
    if (now - lastEvent > 180 || Math.sign(delta) !== Math.sign(accumulated)) accumulated = 0;
    lastEvent = now;
    if (now - lastChange < 220) { accumulated = 0; return; }
    accumulated += delta;
    if (Math.abs(accumulated) < 30) return;
    step(Math.sign(accumulated));
    accumulated = 0;
    lastChange = now;
  }

  window.addEventListener('wheel', handleWheel, { passive: false });
  return () => window.removeEventListener('wheel', handleWheel);
}
