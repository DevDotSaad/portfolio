import type { Metadata } from 'next';
import Link from 'next/link';

// Old slug → /work/sales-copilot/. Static export has no server redirects, so this
// page redirects with a meta refresh (vercel.json also issues a real 308 on Vercel).
const TARGET = '/work/sales-copilot/';

export const metadata: Metadata = {
  title: 'Moved: AI Real-Time Sales Copilot — Thelaywala',
  alternates: { canonical: TARGET },
  robots: { index: false, follow: true },
};

export default function OldSalesCoach() {
  return (
    <main id="main" className="container" style={{ minHeight: '70vh', display: 'grid', placeItems: 'center', textAlign: 'center' }}>
      <meta httpEquiv="refresh" content={`0; url=${TARGET}`} />
      <p>
        This case study moved to{' '}
        <Link prefetch={false} href={TARGET} style={{ color: 'var(--accent)' }}>
          AI Real-Time Sales Copilot — Thelaywala
        </Link>
        .
      </p>
    </main>
  );
}
