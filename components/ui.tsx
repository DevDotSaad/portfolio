import { ICONS, type IconKey } from '@/lib/icons.generated';
import { Fragment, type ElementType } from 'react';

/** Brand logo from the bundled simple-icons subset. */
export function BrandIcon({ name, title }: { name: IconKey; title?: string }) {
  return (
    <svg viewBox="0 0 24 24" role={title ? 'img' : undefined} aria-hidden={title ? undefined : true} aria-label={title}>
      <path d={ICONS[name].path} />
    </svg>
  );
}

/** Heading whose words rise from a mask when scrolled into view. */
export function RevealText({ as: Tag = 'h2', text, className = '' }: { as?: ElementType; text: string; className?: string }) {
  const words = text.split(' ');
  return (
    <Tag className={`rt ${className}`} aria-label={text}>
      {words.map((w, i) => (
        <Fragment key={i}>
          <span className="w" aria-hidden="true">
            <span style={{ ['--i' as string]: i }}>{w}</span>
          </span>
          {i < words.length - 1 ? ' ' : null}
        </Fragment>
      ))}
    </Tag>
  );
}

export function SectionHead({ eyebrow, title, lede, id }: { eyebrow: string; title: string; lede?: string; id?: string }) {
  return (
    <div className="section-head">
      <span className="eyebrow" id={id}>{eyebrow}</span>
      <RevealText text={title} className="h2" />
      {lede ? <p className="lede" data-reveal="">{lede}</p> : null}
    </div>
  );
}

const stroke = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;

export function ArrowRight() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...stroke}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}
export function ArrowUpRight() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...stroke}>
      <path d="M7 17 17 7M9 7h8v8" />
    </svg>
  );
}
export function DownloadIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...stroke}>
      <path d="M12 4v11M7 10l5 5 5-5M5 20h14" />
    </svg>
  );
}
export function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...stroke}>
      <rect x="3" y="5" width="18" height="14" rx="3" />
      <path d="m4 7 8 6 8-6" />
    </svg>
  );
}
export function CopyIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...stroke}>
      <rect x="9" y="9" width="11" height="11" rx="2.5" />
      <path d="M15 9V6.5A2.5 2.5 0 0 0 12.5 4h-6A2.5 2.5 0 0 0 4 6.5v6A2.5 2.5 0 0 0 6.5 15H9" />
    </svg>
  );
}
export function TeamIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" {...stroke}>
      <circle cx="9" cy="8" r="3" />
      <path d="M3.5 19a5.5 5.5 0 0 1 11 0" />
      <circle cx="17" cy="9" r="2.3" />
      <path d="M15.5 14.2A4.5 4.5 0 0 1 21 18.5" />
    </svg>
  );
}

/** Line icons for the "How I work" one-liners. */
const WORK_PATHS: Record<string, React.ReactNode> = {
  ship: (<><path d="M4 17h16l-2 3H6z" /><path d="M12 3v11M12 3l5 7H7z" /></>),
  mentor: (<><circle cx="8" cy="7" r="3" /><path d="M2.5 19a5.5 5.5 0 0 1 11 0" /><path d="m15 11 2 2 4-4" /></>),
  measure: (<><path d="M4 20V10M10 20V4M16 20v-7M22 20H2" /></>),
};
export function WorkIcon({ id }: { id: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...stroke}>
      {WORK_PATHS[id]}
    </svg>
  );
}

export function ArrowLeft() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" {...stroke}>
      <path d="M19 12H5M11 6l-6 6 6 6" />
    </svg>
  );
}

/** Tiny line icons for the concept cards. */
const CONCEPT_PATHS: Record<string, React.ReactNode> = {
  rag: (<><path d="M6 3h8l4 4v6" /><path d="M14 3v4h4" /><path d="M6 3v18h6" /><circle cx="16.5" cy="16.5" r="3" /><path d="m19 19 2 2" /></>),
  embeddings: (<><circle cx="6" cy="7" r="1.6" /><circle cx="17" cy="5" r="1.6" /><circle cx="12" cy="13" r="1.6" /><circle cx="5" cy="18" r="1.6" /><circle cx="18" cy="17" r="1.6" /><path d="M7.4 8l3.4 3.8M13.4 12l3-5.4M13.3 14l3.4 2.2M10.6 14 6.4 17" /></>),
  prompting: (<><path d="M4 12h6" /><path d="M10 12c3 0 4-6 8-6M10 12h8M10 12c3 0 4 6 8 6" /><path d="m16 4 2 2-2 2M16 10l2 2-2 2M16 16l2 2-2 2" /></>),
  stt: (<><path d="M3 12h2M7 8v8M11 5v14M15 9v6M19 11v2" /><path d="M21 12h0" /></>),
  tts: (<><path d="M4 9h3l5-4v14l-5-4H4z" /><path d="M16 9a4 4 0 0 1 0 6M18.5 6.5a7.5 7.5 0 0 1 0 11" /></>),
  webrtc: (<><circle cx="12" cy="12" r="2" /><path d="M8.5 8.5a5 5 0 0 0 0 7M15.5 8.5a5 5 0 0 1 0 7M5.6 5.6a9 9 0 0 0 0 12.8M18.4 5.6a9 9 0 0 1 0 12.8" /></>),
  node: (<><path d="M12 2.8 20 7.4v9.2l-8 4.6-8-4.6V7.4z" /><path d="m13 7-3 5.5h4L11 17" /></>),
  electron: (<><rect x="3" y="4" width="14" height="11" rx="2" /><rect x="8" y="9" width="13" height="11" rx="2" /><path d="M12 14.5c1.5-1.6 3.5-1.6 5 0M14.5 13l3 3" /></>),
  webhooks: (<><path d="M9 7a3 3 0 1 1 4.4 2.6L10 16" /><path d="M7 17a3 3 0 1 1 1.6-5.5" /><path d="M14 17h4a3 3 0 1 0-1.8-5.4" /></>),
  capi: (<><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="4" /><circle cx="12" cy="12" r="0.8" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3" /></>),
  'voice-agents': (<><path d="M5 4h3l2 5-2.2 1.3a11 11 0 0 0 5.9 5.9L15 14l5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" /><path d="M15 4.5a5 5 0 0 1 4.5 4.5M15 1.5a8 8 0 0 1 7.5 7.5" /></>),
  rls: (<><path d="M12 3 19 6v6c0 4.4-3 7.7-7 9-4-1.3-7-4.6-7-9V6z" /><rect x="9" y="11" width="6" height="5" rx="1" /><path d="M10.2 11V9.5a1.8 1.8 0 0 1 3.6 0V11" /></>),
};

export function ConceptIcon({ id }: { id: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...stroke}>
      {CONCEPT_PATHS[id]}
    </svg>
  );
}
