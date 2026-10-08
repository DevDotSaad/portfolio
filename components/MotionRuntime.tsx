'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

type GsapMods = {
  gsap: typeof import('gsap').gsap;
  ScrollTrigger: typeof import('gsap/ScrollTrigger').ScrollTrigger;
};

// GSAP is only fetched when something scroll-linked is about to be seen (or for
// Lenis on desktop), so it never competes with first paint.
let gsapPromise: Promise<GsapMods> | null = null;
function loadGsap() {
  gsapPromise ??= Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(([{ gsap }, { ScrollTrigger }]) => {
    gsap.registerPlugin(ScrollTrigger);
    return { gsap, ScrollTrigger };
  });
  return gsapPromise;
}

type LenisLike = { scrollTo: (t: number, o?: { duration?: number; immediate?: boolean; onComplete?: () => void }) => void };
const lenisRef: { current: LenisLike | null } = { current: null };
const NAV_OFFSET = 96;

/**
 * Scroll an element under the floating nav. Sections use content-visibility, so
 * first render them all (.cv-all) to get real heights; late layout changes (web
 * fonts) can still move the target, so re-measure after the jump and correct.
 */
function renderAllSections() {
  document.documentElement.classList.add('cv-all');
}

function scrollToEl(el: HTMLElement, attempt = 0) {
  renderAllSections();
  const target = () => el.getBoundingClientRect().top + window.scrollY - NAV_OFFSET;
  const check = () => {
    if (attempt < 2 && Math.abs(el.getBoundingClientRect().top - NAV_OFFSET) > 4) scrollToEl(el, attempt + 1);
  };
  const lenis = lenisRef.current;
  if (lenis) lenis.scrollTo(target(), { duration: attempt ? 0.5 : 1.1, onComplete: () => requestAnimationFrame(check) });
  else {
    const smooth = !attempt && !matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: target(), behavior: smooth ? 'smooth' : 'auto' });
    window.setTimeout(check, attempt ? 120 : 900);
  }
}

const onIdle = (cb: () => void) => {
  const run = () =>
    typeof window.requestIdleCallback === 'function' ? window.requestIdleCallback(cb, { timeout: 2000 }) : setTimeout(cb, 800);
  if (document.readyState === 'complete') run();
  else window.addEventListener('load', run, { once: true });
};

/**
 * One place for all page-level motion:
 *  - Lenis smooth scroll (desktop pointers) driven by the GSAP ticker, synced with ScrollTrigger
 *  - IntersectionObserver reveals for [data-reveal] and .rt (split text)
 *  - ScrollTrigger: timeline draw ([data-timeline]) and mockup parallax ([data-parallax])
 *  - Delegated pointer effects: [data-spotlight], [data-tilt], [data-magnetic]
 * With prefers-reduced-motion none of this runs and the page stays static.
 */
export default function MotionRuntime() {
  const pathname = usePathname();

  // Global: Lenis + pointer effects (mounted once, desktop pointers only).
  useEffect(() => {
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (reduce || !fine) return;

    let destroyed = false;
    let cleanupLenis = () => {};

    onIdle(async () => {
      const [{ default: Lenis }, { gsap, ScrollTrigger }] = await Promise.all([import('lenis'), loadGsap()]);
      if (destroyed) return;
      const lenis = new Lenis({ duration: 1.1, smoothWheel: true });
      lenisRef.current = lenis;
      lenis.on('scroll', ScrollTrigger.update);
      const tick = (t: number) => lenis.raf(t * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      (window as unknown as { __lenis?: unknown }).__lenis = lenis;
      cleanupLenis = () => {
        gsap.ticker.remove(tick);
        lenis.destroy();
        lenisRef.current = null;
      };
    });

    let tiltEl: HTMLElement | null = null;
    let magEl: HTMLElement | null = null;
    let frame = 0;
    let last: PointerEvent | null = null;

    const resetTilt = () => {
      if (!tiltEl) return;
      tiltEl.classList.remove('is-tilting');
      tiltEl.style.removeProperty('--rx');
      tiltEl.style.removeProperty('--ry');
      tiltEl = null;
    };
    const resetMag = () => {
      if (!magEl) return;
      magEl.style.transform = '';
      magEl.style.transition = 'transform .6s cubic-bezier(.22,1,.36,1), border-color .3s, background-color .3s, box-shadow .3s';
      magEl = null;
    };

    const apply = () => {
      frame = 0;
      const e = last;
      if (!e) return;
      const target = e.target as Element | null;

      const spot = target?.closest<HTMLElement>('[data-spotlight]');
      if (spot) {
        const r = spot.getBoundingClientRect();
        spot.style.setProperty('--mx', `${e.clientX - r.left}px`);
        spot.style.setProperty('--my', `${e.clientY - r.top}px`);
      }

      const tilt = target?.closest<HTMLElement>('[data-tilt]') ?? null;
      if (tilt !== tiltEl) resetTilt();
      if (tilt) {
        tiltEl = tilt;
        const max = Number(tilt.dataset.tilt) || 8;
        const r = tilt.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        tilt.classList.add('is-tilting');
        tilt.style.setProperty('--ry', `${(px * 2 * max).toFixed(2)}deg`);
        tilt.style.setProperty('--rx', `${(-py * 2 * max).toFixed(2)}deg`);
      }

      const mag = target?.closest<HTMLElement>('[data-magnetic]') ?? null;
      if (mag !== magEl) resetMag();
      if (mag) {
        magEl = mag;
        const r = mag.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        mag.style.transition = 'transform .25s cubic-bezier(.22,1,.36,1), border-color .3s, background-color .3s, box-shadow .3s';
        mag.style.transform = `translate3d(${(dx * 0.28).toFixed(1)}px, ${(dy * 0.38).toFixed(1)}px, 0)`;
      }
    };

    const onMove = (e: PointerEvent) => {
      last = e;
      if (!frame) frame = requestAnimationFrame(apply);
    };
    const onLeave = () => {
      resetTilt();
      resetMag();
    };

    // While scrolling, content slides under a stationary pointer and would fire hover
    // effects (tilt, spotlight, lifts) on every card it passes — large repaints that
    // cost frames. Suspend pointer hit-testing until scrolling settles.
    const root = document.documentElement;
    let scrollIdle = 0;
    const onScroll = () => {
      if (!root.classList.contains('is-scrolling')) {
        root.classList.add('is-scrolling');
        onLeave();
      }
      clearTimeout(scrollIdle);
      scrollIdle = window.setTimeout(() => root.classList.remove('is-scrolling'), 150);
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    document.addEventListener('pointermove', onMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave);
    return () => {
      destroyed = true;
      window.removeEventListener('scroll', onScroll);
      clearTimeout(scrollIdle);
      root.classList.remove('is-scrolling');
      cleanupLenis();
      document.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('pointerleave', onLeave);
      cancelAnimationFrame(frame);
    };
  }, []);

  // In-page anchors (all devices): land precisely under the nav.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return;
      const a = (e.target as Element | null)?.closest<HTMLAnchorElement>('a[href^="#"]');
      const id = a?.getAttribute('href')?.slice(1);
      const el = id ? document.getElementById(id) : null;
      if (!el) return;
      e.preventDefault();
      history.pushState(null, '', );
      scrollToEl(el);
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  // Arriving with a hash (direct visit, or a /#concept-… link from a case study).
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    const el = id ? document.getElementById(id) : null;
    if (!el) return;
    // jump (no animation) and re-check while late layout (fonts) settles
    renderAllSections();
    const jump = () => {
      const top = el.getBoundingClientRect().top + window.scrollY - NAV_OFFSET;
      if (Math.abs(el.getBoundingClientRect().top - NAV_OFFSET) <= 2) return;
      if (lenisRef.current) lenisRef.current.scrollTo(top, { immediate: true });
      else window.scrollTo({ top, behavior: 'auto' });
    };
    const timers = [80, 300, 700, 1200, 2000, 3200].map((ms) => window.setTimeout(jump, ms));
    // the visitor takes over as soon as they interact
    const stop = () => {
      timers.forEach(clearTimeout);
      inputs.forEach((ev) => window.removeEventListener(ev, stop));
    };
    const inputs = ['wheel', 'touchstart', 'keydown', 'pointerdown'] as const;
    inputs.forEach((ev) => window.addEventListener(ev, stop, { passive: true }));
    return stop;
  }, [pathname]);

  // Per route: reveals + scroll-linked animations.
  useEffect(() => {
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const targets = document.querySelectorAll<HTMLElement>('[data-reveal], .rt, .tl-item, [data-inview]');

    if (reduce || !('IntersectionObserver' in window)) {
      targets.forEach((el) => el.classList.add('is-in'));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const el = entry.target as HTMLElement;
          if ('inview' in el.dataset) {
            // toggling (used to pause off-screen CSS animations)
            el.classList.toggle('is-spinning', entry.isIntersecting);
            if (entry.isIntersecting) el.classList.add('is-in');
            continue;
          }
          if (entry.isIntersecting) {
            el.classList.add('is-in');
            io.unobserve(el);
          }
        }
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.08 },
    );
    targets.forEach((el) => io.observe(el));

    // Scroll-linked GSAP work, loaded when the first such element approaches.
    let ctx: { revert: () => void } | null = null;
    let bodyRo: ResizeObserver | null = null;
    let cancelled = false;
    const linked = document.querySelectorAll<HTMLElement>('[data-timeline], [data-parallax]');
    const setup = async () => {
      const { gsap, ScrollTrigger } = await loadGsap();
      if (cancelled) return;
      ctx = gsap.context(() => {
        document.querySelectorAll<HTMLElement>('[data-timeline]').forEach((tl) => {
          const fill = tl.querySelector('.timeline-fill');
          if (!fill) return;
          gsap.fromTo(
            fill,
            { scaleY: 0 },
            {
              scaleY: 1,
              ease: 'none',
              scrollTrigger: { trigger: tl, start: 'top 70%', end: 'bottom 60%', scrub: 0.6 },
            },
          );
        });
        document.querySelectorAll<HTMLElement>('[data-parallax]').forEach((el) => {
          // travel (in % of the layer) must stay inside the layer's overscan
          const amt = Number(el.dataset.parallax) || 7;
          gsap.fromTo(
            el,
            { yPercent: -amt },
            {
              yPercent: amt,
              ease: 'none',
              scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true },
            },
          );
        });
      });
      ScrollTrigger.refresh();
      // keep trigger positions right when the page height changes (fonts, images)
      let t = 0;
      bodyRo = new ResizeObserver(() => {
        clearTimeout(t);
        t = window.setTimeout(() => ScrollTrigger.refresh(), 150);
      });
      bodyRo.observe(document.body);
    };
    const near = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          near.disconnect();
          void setup();
        }
      },
      { rootMargin: '150px 0px' },
    );
    linked.forEach((el) => near.observe(el));

    return () => {
      cancelled = true;
      io.disconnect();
      near.disconnect();
      bodyRo?.disconnect();
      ctx?.revert();
    };
  }, [pathname]);

  return null;
}
