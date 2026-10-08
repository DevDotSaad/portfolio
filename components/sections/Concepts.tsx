import Link from 'next/link';
import { CONCEPTS, projectBySlug } from '@/lib/data';
import { ConceptIcon, SectionHead } from '@/components/ui';

export default function Concepts() {
  return (
    <section className="section" id="concepts" aria-labelledby="concepts-title">
      <div className="container">
        <SectionHead
          eyebrow="Concepts I work with"
          id="concepts-title"
          title="The ideas under the products."
          lede="Plain-English definitions of the building blocks behind my work, and where each one shows up."
        />
        <ul className="concepts">
          {CONCEPTS.map((c, i) => (
            <li key={c.id} id={`concept-${c.id}`} className="concept glass" data-spotlight="" data-reveal="" style={{ ['--d' as string]: i % 3 }}>
              <span className="concept-icon">
                <ConceptIcon id={c.id} />
              </span>
              <h3>{c.name}</h3>
              <p>{c.def}</p>
              <p className="used-in">
                <span>Used in:</span>
                {c.usedIn.map((slug) => (
                  <Link prefetch={false} key={slug} href={`/work/${slug}/`}>
                    {projectBySlug(slug)!.name}
                  </Link>
                ))}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
