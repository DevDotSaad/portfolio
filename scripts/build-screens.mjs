// Product screenshots: rename sources by product, crop to the product UI only
// (no browser chrome, taskbars, personal emails or blank margins), export WebP in
// two sizes and emit lib/screens.generated.ts. Run with `npm run screens`.
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const SRC = process.env.SCREENS ?? path.resolve(root, '..', 'portfolio-assets', 'screens');
const OUT = path.join(root, 'public', 'img', 'work');

/* 1. Rename by product (identified by opening every image). Logged so it can be reversed. */
const RENAME = {
  '05e90ad5-09bf-41a9-a0e5-7590422ab9f6.png': 'crm-ghl-workflow-pipeline-sync.png',
  '13a654a2-f4ac-4c84-b96d-6cd569d19372.png': 'blog-latest-posts.png',
  '1a39e8cc-670a-46dc-ae29-97416753b318.png': 'salon-hero.png',
  '1ff50f72-836a-420e-85e8-94e2803c2f1c.png': 'blog-home.png',
  '25ebddf7-8aad-4543-b87c-6fa84ce1390b.png': 'weather-dashboard.png',
  '2b470418-2ce9-4834-a038-301de4d2a67f.png': 'crm-ghl-workflow-customer-emails.png',
  '3f71516b-0c85-44e0-bce2-65fc3bf8a20c.png': 'salon-booking.png',
  '400222d6-1527-467f-9b20-f68599b4f446.png': 'taskflow-testimonials-pricing.png',
  '58d5e46c-d96e-45fd-8a64-9242783bac17.png': 'coach-ai-live-coach.png',
  '60ab0ebc-f331-44c8-a79b-3cba401c0b0a (1).png': 'crm-ghl-opportunities-pipeline (duplicate).png',
  '60ab0ebc-f331-44c8-a79b-3cba401c0b0a.png': 'crm-ghl-opportunities-pipeline.png',
  '84c4ad59-23ef-4fee-9ce8-b69a1b71c972.png': 'coach-ai-overlay-phone-video-1.png',
  '8b31cabe-994b-43b3-902a-c22736c56399.png': 'coach-ai-overlay-phone-video-2.png',
  '8ffe3a4b-b988-460c-92e4-8ec96fa0718e.png': 'crm-ghl-workflow-follow-up-sms.png',
  '99e73b9e-baa5-4361-8e22-27d6c26e59bc.png': 'crm-ghl-workflow-branches.png',
  '9a2ba95a-3785-453f-8b32-1ab85f166174.png': 'taskflow-home.png',
  'ChatGPT Image Oct 8, 2026, 08_44_27 PM.png': 'sales-copilot-overlay-live-call.png',
  'ChatGPT Image Oct 8, 2026, 08_44_30 PM.png': 'sales-copilot-overlay-transcript.png',
  'ChatGPT Image Oct 8, 2026, 08_44_34 PM.png': 'sales-copilot-overlay-follow-up.png',
  'ChatGPT Image Oct 8, 2026, 08_44_36 PM.png': 'sales-copilot-dashboard-team.png',
  'ChatGPT Image Oct 8, 2026, 08_44_38 PM.png': 'sales-copilot-overlay-assistant.png',
  'ChatGPT Image Oct 8, 2026, 08_44_39 PM.png': 'sales-copilot-dashboard-knowledge-base.png',
  'ChatGPT Image Oct 8, 2026, 08_44_41 PM.png': 'sales-copilot-dashboard-reports.png',
  'ChatGPT Image Oct 8, 2026, 08_44_42 PM.png': 'sales-copilot-dashboard-weekly.png',
  'ChatGPT Image Oct 8, 2026, 08_44_44 PM.png': 'sales-copilot-dashboard-home.png',
  'a1de67d7-a9df-4484-88e6-2af7254b8405.png': 'crm-ghl-workflow-pvl-purchase.png',
  'aafbc5b4-601c-491b-a72b-b69a8f2f8da5.png': 'coach-ai-dashboard.png',
  'b00612a4-dccd-4f88-be0a-8b82318aa45d.png': 'crm-ai-chat-agent-test.png',
  'chain-incoming-1440.png': 'ai-interpreter-site-they-speak.png',
  'chain-outgoing-1440.png': 'ai-interpreter-site-you-answer.png',
  'd5c32741-1708-4703-bac3-8acfd4f5ba5c.png': 'coach-ai-overlay-phone-video-3.png',
  'e96953a5-3625-4e32-9464-facb54247d03.png': 'crm-ghl-workflow-reply-branches.png',
  'ebaf924c-8bff-4e6e-b6dc-8f28da9a32c1.png': 'coach-ai-knowledge-base.png',
  'edbbbaee-be4c-4524-a5e6-f38633f46c8b.png': 'coach-ai-meetings.png',
  'f95a5189-0f1f-449c-8e3d-6527f6e3131f.png': 'salon-services-gallery.png',
  'ffbdd445-ac75-4379-adf3-cbabc03fd885 (1).png': 'crm-ghl-opportunities-subscriptions (duplicate).png',
  'ffbdd445-ac75-4379-adf3-cbabc03fd885.png': 'crm-ghl-opportunities-subscriptions.png',
  'fix-endofcall-1440.png': 'ai-interpreter-site-pricing.png',
  'fx-band-1440.png': 'ai-interpreter-site-on-your-machine.png',
  'fx-band-390.png': 'ai-interpreter-site-on-your-machine-mobile.png',
  'image-1791474419664.png': 'ai-interpreter-site-on-your-machine-2.png',
  'image-1791474508663.png': 'ai-interpreter-site-hero.png',
  'review-three-things-hover-1440.png': 'ai-interpreter-site-three-things.png',
  'rework-nav-top-1440.png': 'ai-interpreter-site-hero-2.png',
  'wf-workflow-1440.png': 'ai-interpreter-site-pipeline.png',
};
// The nine "ChatGPT Image"-named files are real Sales Coach captures (the filename was
// misleading). A previous pass mislabelled them generated-not-for-site-*; restore those names.
for (const to of Object.values(RENAME)) {
  const wrong = 'generated-not-for-site-' + to;
  if (to.startsWith('sales-copilot-') && fs.existsSync(path.join(SRC, wrong)) && !fs.existsSync(path.join(SRC, to))) RENAME[wrong] = to;
}
const logPath = path.join(SRC, 'rename-log.json');
const log = fs.existsSync(logPath) ? JSON.parse(fs.readFileSync(logPath, 'utf8')) : {};
for (const [from, to] of Object.entries(RENAME)) {
  const a = path.join(SRC, from);
  if (fs.existsSync(a) && !fs.existsSync(path.join(SRC, to))) {
    fs.renameSync(a, path.join(SRC, to));
    log[to] = log[from] ?? from;
    delete log[from];
  }
}
fs.writeFileSync(logPath, JSON.stringify(log, null, 2));

/* 2. Crops (source pixels) and where each image is used. `pos` anchors object-fit: cover. */
const SHOTS = {
  // Sales Coach — Thelaywala (sidebar account email / overlay email cropped out)
  'sales-copilot-dashboard-home': { file: 'sales-copilot-dashboard-home.png', crop: [0, 0, 1640, 1230], pos: '50% 0%', alt: 'Sales Coach web dashboard: customer, session, open-task and health summary with recent call activity' },
  'sales-copilot-dashboard-weekly': { file: 'sales-copilot-dashboard-weekly.png', crop: [0, 0, 1640, 1010], pos: '50% 0%', alt: 'Sales Coach weekly digest: what moved, health changes per customer and a call-prep builder' },
  'sales-copilot-dashboard-reports': { file: 'sales-copilot-dashboard-reports.png', crop: [0, 0, 1640, 1200], pos: '50% 0%', alt: 'Sales Coach reports: generating a call record PDF for a customer' },
  'sales-copilot-overlay-live-call': { file: 'sales-copilot-overlay-live-call.png', crop: [192, 165, 528, 1191], pos: '50% 78%', alt: 'Sales Coach desktop overlay during a live call: transcript, heads-up, customer mood and the suggested next line' },
  // AI Interpreter — marketing site (scrollbar and the "Built by Thelaywala" line cropped out)
  'ai-interpreter-site-hero': { file: 'ai-interpreter-site-hero.png', crop: [0, 0, 1424, 788], pos: '0% 0%', alt: 'AI Interpreter site hero: two-way captions over a video call — “Speak your language. Be heard in la suya.”' },
  'ai-interpreter-site-pipeline': { file: 'ai-interpreter-site-pipeline.png', crop: [0, 0, 1424, 885], pos: '50% 20%', alt: 'AI Interpreter pipeline on device: call audio, listen, transcribe, translate, speak, cable to call' },
  'ai-interpreter-site-they-speak': { file: 'ai-interpreter-site-they-speak.png', crop: [120, 0, 1160, 725], pos: '50% 50%', alt: 'AI Interpreter: the other side’s sentence arrives as a caption in your language' },
  'ai-interpreter-site-on-your-machine': { file: 'ai-interpreter-site-on-your-machine.png', crop: [0, 0, 1424, 795], pos: '50% 20%', alt: 'AI Interpreter overlay with live two-way captions, and what stays on your machine' },
  // Coach AI — PainterGrowth.com (empty side margins and browser zoom widget cropped out)
  'coach-ai-dashboard': { file: 'coach-ai-dashboard.png', crop: [340, 32, 1210, 906], pos: '50% 0%', alt: 'Coach AI dashboard: customers, sessions, open tasks, customer health, contacts to reach today and recent sessions' },
  'coach-ai-live-coach': { file: 'coach-ai-live-coach.png', crop: [340, 32, 1200, 528], pos: '50% 0%', alt: 'Coach AI Live Coach: a customer conversation ready for memory-aware coaching' },
  'coach-ai-knowledge-base': { file: 'coach-ai-knowledge-base.png', crop: [330, 48, 1060, 890], pos: '50% 0%', alt: 'Coach AI knowledge base of winning moments from closed calls, by stage' },
  'coach-ai-meetings': { file: 'coach-ai-meetings.png', crop: [330, 38, 1080, 900], pos: '50% 0%', alt: 'Coach AI meetings: saved calls with a call score, AI summary, next steps and transcript' },
  // CRM & AI Automation Suite — GoHighLevel (bottom taskbar edge cropped out)
  'crm-ghl-workflow-pipeline-sync': { file: 'crm-ghl-workflow-pipeline-sync.png', crop: [0, 0, 1911, 930], pos: '50% 0%', alt: 'GoHighLevel workflow: inbound webhook creates a contact, then branches by event to update tags and pipeline opportunities' },
  'crm-ghl-workflow-customer-emails': { file: 'crm-ghl-workflow-customer-emails.png', crop: [0, 6, 1898, 930], pos: '50% 0%', alt: 'GoHighLevel workflow: webhook-driven customer email sequences with waits and follow-up conditions' },
  'crm-ghl-workflow-reply-branches': { file: 'crm-ghl-workflow-reply-branches.png', crop: null, pos: '50% 0%', alt: 'GoHighLevel workflow branches for contact replies and time-outs, updating the AI bot status' },
  'crm-ghl-workflow-pvl-purchase': { file: 'crm-ghl-workflow-pvl-purchase.png', crop: null, pos: '50% 0%', alt: 'GoHighLevel workflow: tag, wait and condition steps leading to an SMS follow-up' },
  // More projects
  'salon-hero': { file: 'salon-hero.png', crop: null, pos: '50% 40%', alt: 'Salon website hero with booking call to action' },
  'weather-dashboard': { file: 'weather-dashboard.png', crop: [300, 0, 1300, 942], pos: '50% 20%', alt: 'Weather app showing current conditions and a three-day forecast' },
  'taskflow-home': { file: 'taskflow-home.png', crop: [250, 0, 1400, 700], pos: '50% 0%', alt: 'TaskFlow landing page with features and testimonials' },
  'blog-home': { file: 'blog-home.png', crop: [330, 0, 1230, 945], pos: '50% 30%', alt: 'Blog app with search, category filters and post cards' },
};

fs.mkdirSync(OUT, { recursive: true });
const manifest = {};
for (const [key, s] of Object.entries(SHOTS)) {
  let img = sharp(path.join(SRC, s.file));
  const meta = await img.metadata();
  const [left, top, width, height] = s.crop ?? [0, 0, meta.width, meta.height];
  img = img.extract({ left, top, width, height });
  const buf = await img.png().toBuffer();
  const large = Math.min(1600, width);
  const small = Math.min(800, width);
  for (const w of new Set([small, large])) {
    await sharp(buf).resize(w).webp({ quality: 80 }).toFile(path.join(OUT, `${key}-${w}.webp`));
  }
  manifest[key] = {
    sm: `/img/work/${key}-${small}.webp`,
    lg: `/img/work/${key}-${large}.webp`,
    smW: small,
    lgW: large,
    w: width,
    h: height,
    pos: s.pos,
    alt: s.alt,
    // a 2× home mockup frame (~600 CSS px) needs ≥1200 source px
    hiRes: width >= 1200,
  };
}
fs.writeFileSync(
  path.join(root, 'lib', 'screens.generated.ts'),
  `// Generated by scripts/build-screens.mjs. Do not edit.\n` +
    `export const SCREENS = ${JSON.stringify(manifest, null, 1)} as const;\nexport type ScreenKey = keyof typeof SCREENS;\n`,
);
console.log(Object.entries(manifest).map(([k, v]) => `${k} ${v.w}×${v.h}${v.hiRes ? '' : ' (grid only)'}`).join('\n'));
