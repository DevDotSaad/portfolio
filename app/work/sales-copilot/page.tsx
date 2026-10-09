import type { Metadata } from 'next';
import Moved from '@/components/Moved';

// Old slug of the Sales Coach case study.
const TARGET = '/work/sales-coach/';

export const metadata: Metadata = {
  title: 'Moved: Sales Coach — Thelaywala',
  alternates: { canonical: TARGET },
  robots: { index: false, follow: true },
};

export default function OldSlug() {
  return <Moved to={TARGET} label="Sales Coach — Thelaywala" />;
}
