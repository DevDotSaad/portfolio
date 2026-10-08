import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PROJECTS, conceptById, projectBySlug } from '@/lib/data';
import FlowDiagram from '@/components/FlowDiagram';
import Footer from '@/components/Footer';
import { Mockup } from '@/components/sections/Featured';
import { ArrowLeft, ArrowRight, ArrowUpRight, RevealText } from '@/components/ui';
import Lightbox from '@/components/Lightbox';
import { SCREENS } from '@/lib/screens.generated';

export const dynamicParams = false;

export function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = projectBySlug(slug);
  if (!p) return {};
  return {
    title: p.fullName,
    description: p.tagline,
    alternates: { canonical: `/work/${p.slug}/` },
    openGraph: { title: p.fullName, description: p.tagline, url: `/work/${p.slug}/` },
  };
}

function Block({ n, label, children }: { n: number; label: string; children: React.ReactNode }) {
  return (
    <section className="detail-grid" aria-label={label}>
      <h2 className="detail-label">
        <span>{String(n).padStart(2, '0')}</span>
        {label}
      </h2>
      <div data-reveal="">{children}</div>
    </section>
  );
}

export default async function WorkPage({ params }: Props) {
  const { slug } = await params;
  const p = projectBySlug(slug);
  if (!p) notFound();

  const idx = PROJECTS.findIndex((x) => x.slug === p.slug);
  const next = PROJECTS[(idx + 1) % PROJECTS.length];
  let n = 0;

  return (
    <>
      <main id="main">
        <header className="detail-hero">
          <div className="container" style={{ position: 'relative' }}>
            <Link prefetch={false} href="/#work" className="back">
              <ArrowLeft /> All work
            </Link>
            <RevealText as="h1" text={p.name} className="detail-title" />
            <div className="detail-meta" data-reveal="">
              <span className="chip chip-accent">{p.client}</span>
              <span className="chip">{p.kicker}</span>
              {p.status ? (
                <span className="chip">
                  <span className="dot-live" aria-hidden="true" /> {p.status}
                </span>
              ) : null}
            </div>
            <p className="detail-tagline" data-reveal="">
              {p.tagline}
            </p>
            <div className="detail-actions" data-reveal="">
              {p.link.placeholder ? (
                <a href={p.link.href} className="btn btn-primary" data-magnetic="">
                  {p.link.label} <ArrowUpRight />
                </a>
              ) : (
                <a href={p.link.href} className="btn btn-primary" target="_blank" rel="noopener noreferrer" data-magnetic="">
                  Visit {p.link.label} <ArrowUpRight />
                </a>
              )}
              <a href="#architecture" className="btn">
                See the architecture
              </a>
            </div>
          </div>
        </header>

        <div className="container">
          {/* frame never wider than half the screenshot's pixels, so it stays sharp at 2× */}
          <div
            className="tilt-scene detail-mock"
            style={{ maxWidth: p.cover ? Math.min(900, Math.floor(SCREENS[p.cover].w / 2)) : 900 }}
            data-reveal=""
          >
            <div data-tilt="3">
              <Mockup name={p.name} host={p.host} cover={p.cover} note={p.noShots} eager sizes="(max-width: 900px) 92vw, 900px" />
            </div>
          </div>

          <Block n={++n} label="Problem">
            <p className="detail-text">{p.problem}</p>
          </Block>

          <Block n={++n} label="What I built">
            <ul className="built-list">
              {p.built.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          </Block>

          {p.clients ? (
            <Block n={++n} label="Clients">
              <ul className="clients">
                {p.clients.map((c) => (
                  <li className="client" key={c.name}>
                    <span className="chip chip-accent">{c.name}</span>
                    <p className={c.placeholder ? 'is-placeholder' : undefined}>{c.line}</p>
                  </li>
                ))}
              </ul>
            </Block>
          ) : null}

          <section className="detail-grid is-wide" id="architecture" aria-label="Architecture" style={{ scrollMarginTop: 96 }}>
            <h2 className="detail-label">
              <span>{String(++n).padStart(2, '0')}</span>
              {p.clients ? 'Automation flow' : 'Architecture'}
            </h2>
            <div data-reveal="">
              <FlowDiagram diagram={p.diagram} />
            </div>
          </section>

          <Block n={++n} label="Stack">
            <ul className="chips">
              {p.stack.map((s) => (
                <li className="chip" key={s}>
                  {s}
                </li>
              ))}
            </ul>
          </Block>

          <Block n={++n} label="My role">
            <p className="detail-text">{p.role}</p>
          </Block>

          <Block n={++n} label="Key concepts used">
            <ul className="chips">
              {p.concepts.map((id) => (
                <li key={id}>
                  <Link prefetch={false} className="chip chip-accent" href={`/#concept-${id}`}>
                    {conceptById(id).name}
                  </Link>
                </li>
              ))}
            </ul>
          </Block>

          <Block n={++n} label="Screenshots">
            {p.shots.length ? (
              <Lightbox shots={p.shots} label={p.fullName} />
            ) : (
              <div className="shot shot-empty">
                <strong>{p.name}</strong>
                <span>{p.noShots ?? 'Screenshots coming soon'}</span>
              </div>
            )}
          </Block>

          <Block n={++n} label="Link">
            {p.link.placeholder ? (
              <p className="detail-text muted">{p.status ?? 'Link coming soon.'}</p>
            ) : (
              <a className="btn" href={p.link.href} target="_blank" rel="noopener noreferrer">
                {p.link.label} <ArrowUpRight />
              </a>
            )}
          </Block>

          <Link prefetch={false} href={`/work/${next.slug}/`} className="next-case glass" data-spotlight="">
            <div>
              <span className="eyebrow">Next case study</span>
              <h2>{next.name}</h2>
            </div>
            <span className="btn btn-primary" aria-hidden="true">
              <ArrowRight />
            </span>
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
