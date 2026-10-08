import { SCREENS, type ScreenKey } from '@/lib/screens.generated';

/**
 * A product screenshot in a fixed-ratio frame: object-fit: cover, anchored on the
 * most informative region (per-image `pos`). Never stretched. Lazy by default.
 */
export default function Shot({
  k,
  sizes,
  eager = false,
  className = '',
}: {
  k: ScreenKey;
  sizes: string;
  eager?: boolean;
  className?: string;
}) {
  const s = SCREENS[k];
  const srcSet = (s.sm as string) === s.lg ? undefined : `${s.sm} ${s.smW}w, ${s.lg} ${s.lgW}w`;
  return (
    <img
      className={`shot-img ${className}`}
      src={s.lg}
      srcSet={srcSet}
      sizes={srcSet ? sizes : undefined}
      width={s.w}
      height={s.h}
      alt={s.alt}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      style={{ objectPosition: s.pos }}
    />
  );
}
