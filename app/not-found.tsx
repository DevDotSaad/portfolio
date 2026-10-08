import Link from 'next/link';

export default function NotFound() {
  return (
    <main id="main" className="container" style={{ minHeight: '80vh', display: 'grid', placeItems: 'center', textAlign: 'center' }}>
      <div style={{ display: 'grid', gap: 20, justifyItems: 'center' }}>
        <span className="eyebrow">404</span>
        <h1 className="h2">This page isn’t here.</h1>
        <Link prefetch={false} href="/" className="btn btn-primary">
          Back home
        </Link>
      </div>
    </main>
  );
}
