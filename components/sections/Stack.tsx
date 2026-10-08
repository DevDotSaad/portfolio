'use client';

import { useState } from 'react';
import { STACK, type Hub } from '@/lib/data';
import { BrandIcon, SectionHead } from '@/components/ui';

const DURATIONS = ['44s', '52s', '60s', '48s'];

function HubCard({ hub, index }: { hub: Hub; index: number }) {
  const [sel, setSel] = useState<number | null>(null);
  const n = hub.tools.length;
  const tool = sel === null ? null : hub.tools[sel];
  const detailId = `hub-${hub.id}-detail`;

  return (
    <li
      className="hub glass"
      data-spotlight=""
      data-inview=""
      data-reveal=""
      style={{ ['--dur' as string]: DURATIONS[index % DURATIONS.length], ['--d' as string]: index }}
    >
      <h3 className="hub-name">
        {hub.name}
        <span className="hub-count">{n} tools</span>
      </h3>

      <div className="orbit-scene">
        <span className="orbit-core" aria-hidden="true" />
        <div className="orbit-ring">
          {hub.tools.map((t, i) => (
            <span className="orbit-item" key={t.name} style={{ ['--a' as string]: `${(360 / n) * i}deg` }}>
              <span className="orbit-face">
                <button
                  type="button"
                  className="orbit-btn"
                  aria-label={t.name}
                  aria-pressed={sel === i}
                  aria-describedby={detailId}
                  onMouseEnter={() => setSel(i)}
                  onFocus={() => setSel(i)}
                  onClick={() => setSel(i)}
                >
                  {t.icon ? <BrandIcon name={t.icon} /> : <span className="mono" aria-hidden="true">{t.mono}</span>}
                </button>
              </span>
            </span>
          ))}
        </div>
      </div>

      <div className="hub-detail" id={detailId} aria-live="polite">
        {tool ? (
          <>
            <strong>{tool.name}</strong>
            <p>
              {tool.used.length ? (
                <>
                  Used in{' '}
                  {tool.used.map((u, k) => (
                    <span key={u.label}>
                      <a href={u.href}>{u.label}</a>
                      {k < tool.used.length - 1 ? ', ' : ''}
                    </span>
                  ))}
                </>
              ) : (
                'Part of my everyday toolkit.'
              )}
            </p>
          </>
        ) : (
          <>
            <strong>{hub.name}</strong>
            <p>Hover or tap a logo to see where I used it.</p>
          </>
        )}
      </div>
    </li>
  );
}

export default function Stack() {
  return (
    <section className="section" id="stack" aria-labelledby="stack-title">
      <div className="container">
        <SectionHead
          eyebrow="Tech stack"
          id="stack-title"
          title="A constellation of tools."
          lede="Four hubs, each orbited by the tools I use. Hover a logo to see where it shows up in my work."
        />
        <ul className="constellation">
          {STACK.map((hub, i) => (
            <HubCard hub={hub} index={i} key={hub.id} />
          ))}
        </ul>

        <div className="stack-list">
          {STACK.map((hub) => (
            <div key={hub.id}>
              <h3>{hub.name}</h3>
              <ul>
                {hub.tools.map((t) => (
                  <li key={t.name}>{t.name}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
