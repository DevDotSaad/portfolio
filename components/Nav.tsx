'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NAV, SITE } from '@/lib/data';

const useIso = typeof window === 'undefined' ? useEffect : useLayoutEffect;

export default function Nav() {
  const pathname = usePathname();
  const home = pathname === '/';
  const [active, setActive] = useState<string | null>(null);
  const [compact, setCompact] = useState(false);
  const [open, setOpen] = useState(false);
  const linksRef = useRef<HTMLDivElement>(null);
  const indRef = useRef<HTMLSpanElement>(null);

  // Compress on scroll.
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        setCompact(window.scrollY > 32);
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  // Active section: the last section whose top has crossed 40% of the viewport.
  useEffect(() => {
    if (!home) {
      setActive(pathname.startsWith('/work') ? 'work' : null);
      return;
    }
    const sections = NAV.map((n) => document.getElementById(n.id)).filter(Boolean) as HTMLElement[];
    const visible = new Set<string>();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => (e.isIntersecting ? visible.add(e.target.id) : visible.delete(e.target.id)));
        const current = NAV.filter((n) => visible.has(n.id)).at(-1)?.id ?? null;
        setActive(current);
      },
      { rootMargin: '0px 0px -60% 0px', threshold: 0 },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [home, pathname]);

  // Slide the indicator under the active link.
  useIso(() => {
    const wrap = linksRef.current;
    const ind = indRef.current;
    if (!wrap || !ind) return;
    const place = () => {
      const link = active ? wrap.querySelector<HTMLElement>(`[data-id="${active}"]`) : null;
      if (!link) {
        ind.style.opacity = '0';
        return;
      }
      ind.style.opacity = '1';
      ind.style.width = `${link.offsetWidth}px`;
      ind.style.transform = `translateX(${link.offsetLeft}px)`;
    };
    place();
    // the pill animates its width when compressing, so re-measure as it resizes
    const ro = new ResizeObserver(place);
    ro.observe(wrap);
    document.fonts?.ready.then(place);
    return () => ro.disconnect();
  }, [active]);

  useEffect(() => setOpen(false), [pathname]);

  const href = (id: string) => (home ? `#${id}` : `/#${id}`);

  return (
    <header className={`nav${compact ? ' is-compact' : ''}`}>
      <nav className="nav-pill" aria-label="Primary">
        <Link prefetch={false} href="/" className="nav-logo" aria-label={`${SITE.name} — home`}>
          {SITE.short}
        </Link>
        <span className="nav-mobile-title">Saad Zubair</span>
        <div className="nav-links" ref={linksRef}>
          <span className="nav-indicator" ref={indRef} aria-hidden="true" />
          {NAV.map((n) => (
            <a key={n.id} data-id={n.id} href={href(n.id)} className="nav-link" aria-current={active === n.id ? 'true' : undefined}>
              {n.label}
            </a>
          ))}
        </div>
        <a href={`mailto:${SITE.email}`} className="btn btn-primary btn-sm nav-cta">
          Hire me
        </a>
        <button
          type="button"
          className="nav-menu-btn"
          aria-expanded={open}
          aria-controls="nav-sheet"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((o) => !o)}
        >
          <span />
        </button>
      </nav>
      <div id="nav-sheet" className="nav-sheet" data-open={open}>
        {NAV.map((n) => (
          <a key={n.id} href={href(n.id)} aria-current={active === n.id ? 'true' : undefined} onClick={() => setOpen(false)}>
            {n.label}
          </a>
        ))}
        <a href={`mailto:${SITE.email}`}>Email me</a>
      </div>
    </header>
  );
}
