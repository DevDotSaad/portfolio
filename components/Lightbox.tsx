'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { SCREENS, type ScreenKey } from '@/lib/screens.generated';
import Shot from '@/components/Shot';

/** Screenshot grid; each tile opens a native <dialog> with the full, uncropped-by-frame image. */
export default function Lightbox({ shots, label }: { shots: readonly ScreenKey[]; label: string }) {
  const ref = useRef<HTMLDialogElement>(null);
  const [i, setI] = useState(0);

  const open = (n: number) => {
    setI(n);
    ref.current?.showModal();
  };
  const step = useCallback((d: number) => setI((n) => (n + d + shots.length) % shots.length), [shots.length]);

  useEffect(() => {
    const dlg = ref.current;
    if (!dlg) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
    };
    dlg.addEventListener('keydown', onKey);
    return () => dlg.removeEventListener('keydown', onKey);
  }, [step]);

  const s = SCREENS[shots[i]];

  return (
    <>
      <ul className="shots">
        {shots.map((k, n) => (
          <li key={k}>
            <button type="button" className="shot shot-btn" onClick={() => open(n)} aria-label={`Open screenshot ${n + 1} of ${shots.length}: ${SCREENS[k].alt}`}>
              <Shot k={k} sizes="(max-width: 800px) 92vw, 460px" />
            </button>
          </li>
        ))}
      </ul>

      <dialog
        ref={ref}
        className="lightbox"
        aria-label={`${label} screenshots`}
        onClick={(e) => {
          if (e.target === e.currentTarget) ref.current?.close();
        }}
      >
        <figure className="lightbox-fig">
          <img src={s.lg} width={s.w} height={s.h} alt={s.alt} decoding="async" />
          <figcaption>
            <span>{s.alt}</span>
            <span className="muted">
              {i + 1} / {shots.length}
            </span>
          </figcaption>
        </figure>
        <div className="lightbox-nav">
          {shots.length > 1 ? (
            <>
              <button type="button" className="btn btn-sm" onClick={() => step(-1)} aria-label="Previous screenshot">
                ←
              </button>
              <button type="button" className="btn btn-sm" onClick={() => step(1)} aria-label="Next screenshot">
                →
              </button>
            </>
          ) : null}
          <button type="button" className="btn btn-sm btn-primary" onClick={() => ref.current?.close()} autoFocus>
            Close
          </button>
        </div>
      </dialog>
    </>
  );
}
