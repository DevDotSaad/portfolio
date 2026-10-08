'use client';

import { useEffect, useRef } from 'react';

/** Static rings: shown for reduced motion, and as the poster while WebGL loads. */
function StaticRings() {
  return (
    <svg className="orb-static" viewBox="0 0 400 400" aria-hidden="true">
      <defs>
        <radialGradient id="orb-core" cx="50%" cy="45%" r="50%">
          <stop offset="0" stopColor="#22D3EE" stopOpacity="0.35" />
          <stop offset="0.55" stopColor="#22D3EE" stopOpacity="0.08" />
          <stop offset="1" stopColor="#22D3EE" stopOpacity="0" />
        </radialGradient>
        <pattern id="orb-dots" width="9" height="9" patternUnits="userSpaceOnUse">
          <circle cx="4.5" cy="4.5" r="1.1" fill="#22D3EE" fillOpacity="0.55" />
        </pattern>
        <clipPath id="orb-clip">
          <circle cx="200" cy="200" r="82" />
        </clipPath>
      </defs>
      <circle cx="200" cy="200" r="150" fill="url(#orb-core)" />
      <g clipPath="url(#orb-clip)" opacity="0.8">
        <rect x="100" y="100" width="200" height="200" fill="url(#orb-dots)" />
      </g>
      <circle cx="200" cy="200" r="82" fill="none" stroke="#22D3EE" strokeOpacity="0.45" />
      <g fill="none" stroke="#22D3EE" strokeWidth="1">
        <ellipse cx="200" cy="200" rx="110" ry="34" strokeOpacity="0.35" transform="rotate(-18 200 200)" />
        <ellipse cx="200" cy="200" rx="130" ry="46" strokeOpacity="0.25" transform="rotate(24 200 200)" />
        <ellipse cx="200" cy="200" rx="150" ry="26" strokeOpacity="0.2" transform="rotate(-62 200 200)" />
      </g>
      <circle cx="303" cy="166" r="3" fill="#BFF6FF" />
      <circle cx="96" cy="256" r="2.5" fill="#BFF6FF" />
    </svg>
  );
}

export default function Orb() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let dispose: (() => void) | undefined;
    let cancelled = false;

    const boot = async () => {
      // WebGL support check before pulling in three.js
      const probe = document.createElement('canvas');
      if (!(probe.getContext('webgl2') || probe.getContext('webgl'))) return;
      const { createOrb } = await import('./orb-scene');
      if (cancelled) return;
      dispose = createOrb(el, () => el.classList.add('is-live'));
    };

    // three.js is large, so it never competes with first paint: it loads on the
    // first interaction, or (desktop pointers) once the page has gone idle.
    // Until then the static rings act as the poster.
    let started = false;
    const events = ['pointermove', 'pointerdown', 'touchstart', 'scroll', 'keydown', 'wheel'] as const;
    const start = () => {
      if (started) return;
      started = true;
      events.forEach((e) => window.removeEventListener(e, start));
      void boot();
    };
    events.forEach((e) => window.addEventListener(e, start, { passive: true, once: true }));

    let idleId = 0;
    const onLoad = () => {
      idleId = window.setTimeout(() => {
        typeof window.requestIdleCallback === 'function' ? window.requestIdleCallback(start, { timeout: 2000 }) : start();
      }, 1200);
    };
    const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (fine) {
      if (document.readyState === 'complete') onLoad();
      else window.addEventListener('load', onLoad, { once: true });
    }

    return () => {
      cancelled = true;
      events.forEach((e) => window.removeEventListener(e, start));
      window.removeEventListener('load', onLoad);
      clearTimeout(idleId);
      dispose?.();
    };
  }, []);

  return (
    <div className="orb" ref={ref} aria-hidden="true">
      <StaticRings />
    </div>
  );
}
