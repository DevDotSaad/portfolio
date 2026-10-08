'use client';

import { useState, type FormEvent } from 'react';
import { SITE } from '@/lib/data';
import { CopyIcon, RevealText } from '@/components/ui';

export default function Contact() {
  const [copied, setCopied] = useState('');

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(SITE.email);
      setCopied('Copied');
    } catch {
      setCopied('Press Ctrl+C');
    }
    window.setTimeout(() => setCopied(''), 2200);
  };

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get('name') ?? '').trim();
    const message = String(data.get('message') ?? '').trim();
    const subject = name ? `Project enquiry from ${name}` : 'Project enquiry';
    const body = `${message}${name ? `\n\n— ${name}` : ''}`;
    window.location.href = `mailto:${SITE.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <section className="section" id="contact" aria-labelledby="contact-title">
      <div className="container">
        <div className="contact glass" data-spotlight="" data-reveal="">
          <div>
            <span className="eyebrow">Contact</span>
            <RevealText as="h2" text="Let’s build something." className="contact-title" />
            <div className="contact-lines">
              <div className="contact-row">
                <span className="label">Email</span>
                <div className="email-line">
                  <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
                  <button type="button" className="btn btn-sm" onClick={copy} aria-label="Copy email address">
                    <CopyIcon /> Copy
                  </button>
                  <span className="copy-status" role="status" aria-live="polite">
                    {copied}
                  </span>
                </div>
              </div>
              <div className="contact-row">
                <span className="label">Phone</span>
                <a href={SITE.phoneHref}>{SITE.phone}</a>
              </div>
              <div className="contact-row">
                <span className="label">LinkedIn</span>
                <a href={SITE.linkedin}>LinkedIn profile</a>
              </div>
            </div>
          </div>

          <form className="form" onSubmit={submit} aria-label="Send me an email">
            <div className="field">
              <label htmlFor="c-name">Your name</label>
              <input id="c-name" name="name" autoComplete="name" />
            </div>
            <div className="field">
              <label htmlFor="c-msg">What are you building?</label>
              <textarea id="c-msg" name="message" required />
            </div>
            <button type="submit" className="btn btn-primary" data-magnetic="">
              Open in email
            </button>
            <p className="form-note">Opens your email app with the message ready to send.</p>
          </form>
        </div>
      </div>
    </section>
  );
}
