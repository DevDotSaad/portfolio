import Link from 'next/link';
import { PROJECTS } from '@/lib/data';
import { ArrowRight, ArrowUpRight, SectionHead } from '@/components/ui';
import Shot from '@/components/Shot';
import type { ScreenKey } from '@/lib/screens.generated';

/** Desktop-frame mockup: the product's best screenshot, or a placeholder frame with its name. */
export function Mockup({
  name,
  host,
  cover,
  note = 'Screenshot coming soon',
  eager = false,
  sizes = '(max-width: 900px) 92vw, 620px',
}: {
  name: string;
  host: string;
  cover?: ScreenKey;
  note?: string;
  eager?: boolean;
  sizes?: string;
}) {
  return (
    <div className="mock">
      <div className="mock-bar" aria-hidden="true">
        <i />
        <i />
        <i />
        <span className="mock-url">{host}</span>
      </div>
      <div className="mock-screen">
        <div className={`mock-parallax${cover ? ' has-shot' : ''}`} data-parallax={cover ? '4' : '7'}>
          {cover ? (
            <Shot k={cover} sizes={sizes} eager={eager} />
          ) : (
            <div className="mock-name">
              <strong>{name}</strong>
              <span>{note}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Featured() {
  return (
    <section className="section" id="work" aria-labelledby="work-title">
      <div className="container">
        <SectionHead
          eyebrow="Featured products"
          id="work-title"
          title="Real-time AI, shipped end to end."
          lede="Four products across speech, retrieval, LLMs, desktop overlays and CRM automation. Each opens into a case study with the architecture behind it."
        />
        <div className="featured">
          {PROJECTS.map((p, i) => (
            <div className="tilt-scene" key={p.slug} data-reveal="">
              <article className="case glass" data-tilt="4" data-spotlight="" aria-labelledby={`case-${p.slug}`}>
                <div className="case-body">
                  <span className="case-index">
                    <b>{String(i + 1).padStart(2, '0')}</b> / {String(PROJECTS.length).padStart(2, '0')} · {p.kicker}
                  </span>
                  <h3 className="case-title" id={`case-${p.slug}`}>
                    {p.name}
                  </h3>
                  <span className="case-client">
                    {p.client}
                    {p.status ? ` · ${p.status}` : ''}
                  </span>
                  <p className="case-tagline">{p.tagline}</p>
                  <div className="case-actions">
                    <Link prefetch={false} href={`/work/${p.slug}/`} className="btn btn-primary btn-sm case-link" data-magnetic="">
                      <span>Read case study</span> <ArrowRight />
                    </Link>
                    {!p.link.placeholder ? (
                      <a href={p.link.href} className="btn btn-sm" target="_blank" rel="noopener noreferrer">
                        Live site <ArrowUpRight />
                      </a>
                    ) : null}
                  </div>
                </div>
                <div className="case-media">
                  <Mockup name={p.name} host={p.host} cover={p.cover} note={p.noShots} />
                </div>
              </article>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
