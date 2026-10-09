import Link from 'next/link';

/**
 * Static-export stand-in for a server redirect: a meta refresh plus a visible link.
 * On Vercel, vercel.json also answers these paths with a real 308.
 */
export default function Moved({ to, label }: { to: string; label: string }) {
  return (
    <main id="main" className="container" style={{ minHeight: '70vh', display: 'grid', placeItems: 'center', textAlign: 'center' }}>
      <meta httpEquiv="refresh" content={`0; url=${to}`} />
      <p>
        This case study moved to{' '}
        <Link prefetch={false} href={to} style={{ color: 'var(--accent)' }}>
          {label}
        </Link>
        .
      </p>
    </main>
  );
}
