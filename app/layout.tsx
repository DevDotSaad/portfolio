import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import { SITE } from '@/lib/data';
import Nav from '@/components/Nav';
import MotionRuntime from '@/components/MotionRuntime';
import './globals.css';

const poppins = localFont({
  src: [
    { path: './fonts/poppins-latin-600-normal.woff2', weight: '600' },
    { path: './fonts/poppins-latin-700-normal.woff2', weight: '700' },
  ],
  variable: '--font-heading',
  display: 'swap',
  fallback: ['system-ui', 'Segoe UI', 'Arial'],
});

const inter = localFont({
  src: [
    { path: './fonts/inter-latin-400-normal.woff2', weight: '400' },
    { path: './fonts/inter-latin-600-normal.woff2', weight: '600' },
  ],
  variable: '--font-body',
  display: 'swap',
  // body text renders in the metric-matched fallback first; only the heading face is preloaded
  preload: false,
  fallback: ['system-ui', 'Segoe UI', 'Arial'],
});

const description =
  'Muhammad Saad Zubair — AI Engineer & Full Stack AI Developer in Karachi. Real-time AI products end to end: speech, retrieval, LLMs, desktop and web, plus CRM and AI automation.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — ${SITE.title}`,
    template: `%s — ${SITE.name}`,
  },
  description,
  authors: [{ name: SITE.name }],
  openGraph: {
    type: 'website',
    title: `${SITE.name} — ${SITE.title}`,
    description,
    url: '/',
    siteName: SITE.name,
    images: [{ url: '/og.png', width: 1200, height: 630, alt: `${SITE.name} — ${SITE.title}` }],
  },
  twitter: { card: 'summary_large_image', images: ['/og.png'] },
  icons: { icon: '/icon.svg', apple: '/apple-icon.png' },
};

export const viewport: Viewport = {
  themeColor: '#0B1524',
  colorScheme: 'dark',
};

// Adds `motion` to <html> before first paint unless the visitor prefers reduced
// motion. All scroll-reveal hidden states are scoped to `.motion`, so the page is
// fully readable without JS or animation.
const motionScript = `try{if(!matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.classList.add('motion')}catch(e){}`;

const personLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: SITE.name,
  jobTitle: SITE.title,
  email: `mailto:${SITE.email}`,
  address: { '@type': 'PostalAddress', addressLocality: 'Karachi', addressCountry: 'PK' },
  url: SITE.url,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${poppins.variable} ${inter.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: motionScript }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd) }} />
      </head>
      <body>
        <a className="skip" href="#main">Skip to content</a>
        <Nav />
        {children}
        <MotionRuntime />
      </body>
    </html>
  );
}
