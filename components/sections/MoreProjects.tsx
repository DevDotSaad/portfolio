import { MORE_PROJECTS } from '@/lib/data';
import { ArrowUpRight, SectionHead } from '@/components/ui';
import Shot from '@/components/Shot';

export default function MoreProjects() {
  return (
    <section className="section" id="projects" aria-labelledby="projects-title">
      <div className="container">
        <SectionHead eyebrow="More projects" id="projects-title" title="Smaller builds, same care." />
        <ul className="grid-2">
          {MORE_PROJECTS.map((p, i) => (
            <li className="tilt-scene" key={p.name} data-reveal="" style={{ ['--d' as string]: i % 2 }}>
              <a href={p.href} className="mini glass" data-tilt="8" data-spotlight="" target="_blank" rel="noopener noreferrer">
                <span className="mini-thumb">
                  <Shot k={p.thumb} sizes="(max-width: 720px) 88vw, 520px" />
                </span>
                <div className="mini-top">
                  <h3>{p.name}</h3>
                  <span className="arrow" aria-hidden="true">
                    <ArrowUpRight />
                  </span>
                </div>
                <span className="muted">{p.desc}</span>
                <span className="chips">
                  {p.tags.map((t) => (
                    <span className="chip" key={t}>
                      {t}
                    </span>
                  ))}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
