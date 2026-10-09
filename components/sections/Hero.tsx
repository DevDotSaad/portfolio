import { MARQUEE, SITE } from '@/lib/data';
import Orb from '@/components/Orb';
import { ArrowRight, DownloadIcon, MailIcon, TeamIcon } from '@/components/ui';

export default function Hero() {
  const nameWords = ['Muhammad', 'Saad', 'Zubair'];
  let i = 0;
  return (
    <section className="hero is-spinning" aria-labelledby="hero-name" data-inview="">
      <div className="aurora" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>

      <div className="container hero-grid">
        <div className="hero-copy">
          <span className="eyebrow rise" style={{ ['--i' as string]: i++ }}>
            Karachi · Pakistan
          </span>
          <h1 className="hero-name" id="hero-name" aria-label={SITE.name}>
            {nameWords.map((w, k) => (
              <span key={w} aria-hidden="true">
                <span className="word-mask">
                  <span className={`rise${k === 2 ? ' accent' : ''}`} style={{ ['--i' as string]: i++ }}>
                    {w}
                  </span>
                </span>
                {k < nameWords.length - 1 ? ' ' : ''}
              </span>
            ))}
          </h1>
          <p className="hero-title rise" style={{ ['--i' as string]: i++ }}>
            {SITE.title}
          </p>
          <ul className="hero-chips rise" style={{ ['--i' as string]: i++ }} aria-label="Focus">
            <li className="chip chip-accent">{SITE.heroChips[0]}</li>
            <li className="chip chip-accent">
              <TeamIcon />
              {SITE.heroChips[1]}
            </li>
          </ul>
          <p className="hero-intro rise" style={{ ['--i' as string]: i++ }}>
            {SITE.intro}
          </p>
          <div className="hero-ctas rise" style={{ ['--i' as string]: i++ }}>
            <a href="#work" className="btn btn-primary" data-magnetic="">
              View work <ArrowRight />
            </a>
            <a href={SITE.cv} className="btn" download={SITE.cvFileName} data-magnetic="">
              <DownloadIcon /> Download CV
            </a>
            <a href={`mailto:${SITE.email}`} className="btn btn-ghost" data-magnetic="">
              <MailIcon /> Email me
            </a>
          </div>
        </div>

        <div className="hero-visual">
          <Orb />
          <div className="photo-wrap">
            <figure className="photo-card" data-tilt="10" style={{ margin: 0 }}>
              <img
                src="/img/saad-960.webp"
                srcSet="/img/saad-480.webp 480w, /img/saad-960.webp 960w"
                sizes="(max-width: 900px) min(76vw, 340px), 320px"
                width={960}
                height={1200}
                alt="Portrait of Muhammad Saad Zubair"
                fetchPriority="high"
                decoding="async"
              />
              <figcaption className="photo-chip">
                <span className="dot-live" aria-hidden="true" />
                Available for work · Karachi
              </figcaption>
            </figure>
          </div>
        </div>
      </div>

      <div className="marquee" aria-label="Tools I work with">
        <div className="marquee-track">
          {[0, 1].map((g) => (
            <ul className="marquee-group" key={g} aria-hidden={g === 1 ? 'true' : undefined}>
              {MARQUEE.map((m) => (
                <li className="marquee-item" key={m}>
                  {m}
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  );
}
