import { SITE } from '@/lib/data';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <span>
          {SITE.name} · {SITE.location}
        </span>
        <span>© 2026</span>
      </div>
    </footer>
  );
}
