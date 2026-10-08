import { CERTS, EDUCATION, EXPERIENCE, HOW_I_WORK } from '@/lib/data';
import { SectionHead, WorkIcon } from '@/components/ui';

export function HowIWork() {
  return (
    <section className="section how-section" id="how-i-work" aria-labelledby="how-title">
      <div className="container">
        <span className="eyebrow" id="how-title">How I work</span>
        <ul className="how">
          {HOW_I_WORK.map((h, i) => (
            <li className="how-item glass" key={h.title} data-reveal="" data-spotlight="" style={{ ['--d' as string]: i }}>
              <span className="concept-icon">
                <WorkIcon id={h.icon} />
              </span>
              <span>{h.title}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function Experience() {
  return (
    <section className="section" id="experience" aria-labelledby="experience-title">
      <div className="container">
        <SectionHead eyebrow="Experience" id="experience-title" title="Where I’ve been building." />
        <div className="timeline" data-timeline="">
          <span className="timeline-rail" aria-hidden="true" />
          <span className="timeline-fill" aria-hidden="true" />
          <ol className="timeline-list">
            {EXPERIENCE.map((e) => (
              <li className="tl-item glass" key={e.org} data-reveal="left" data-spotlight="">
                <span className="tl-dot" aria-hidden="true" />
                <div className="tl-head">
                  <h3 className="tl-org">{e.org}</h3>
                  <span className="tl-date">{e.date}</span>
                </div>
                <p className="tl-role">{e.role}</p>
                {e.bullets.length ? (
                  <ul className="tl-bullets">
                    {e.bullets.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                ) : null}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

export function Education() {
  return (
    <section className="section" id="education" aria-labelledby="education-title">
      <div className="container">
        <SectionHead eyebrow="Education & certifications" id="education-title" title="Foundations." />
        <ul className="edu">
          {EDUCATION.map((e, i) => (
            <li className="edu-card glass" key={e.degree} data-reveal="" data-spotlight="" style={{ ['--d' as string]: i }}>
              <h3>{e.degree}</h3>
              <p className="muted">{e.school}</p>
              <span className="tl-date">{e.date}</span>
            </li>
          ))}
        </ul>
        <ul className="chips certs" data-reveal="" aria-label="Certifications">
          {CERTS.map((c) => (
            <li className="chip" key={c.name}>
              <b>{c.name}</b> {c.issuer} · {c.year}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
