// Screenshots with real Chrome. Usage: node scripts/shoot.mjs [baseUrl]
import puppeteer from 'puppeteer-core';
import path from 'node:path';

const BASE = process.argv[2] ?? 'http://localhost:4173';
const OUT = path.resolve(import.meta.dirname, '..', 'reports', 'screens');
const CHROME = process.env.CHROME_PATH ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const only = process.env.ONLY?.split(',');

const browser = await puppeteer.launch({ executablePath: CHROME, headless: false, protocolTimeout: 120000, args: ['--window-size=1500,1000', '--hide-scrollbars', '--disable-features=CalculateNativeWinOcclusion', '--disable-backgrounding-occluded-windows', '--disable-renderer-backgrounding', '--disable-background-timer-throttling'] });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

let current = null;
async function page(w, h, mobile = false) {
  // one foreground tab at a time — background tabs don't render
  if (current) await current.close();
  const p = (current = await browser.newPage());
  await p.bringToFront();
  await p.setViewport({ width: w, height: h, deviceScaleFactor: mobile ? 2 : 1, isMobile: mobile, hasTouch: mobile });
  return p;
}
async function scrollTo(p, sel, offset = 90) {
  await p.evaluate((s, o) => {
    const el = document.querySelector(s);
    const y = el.getBoundingClientRect().top + window.scrollY - o;
    window.__lenis ? window.__lenis.scrollTo(y, { immediate: true }) : window.scrollTo(0, y);
  }, sel, offset);
  await sleep(1800);
}

const shots = {
  async heroDesktop() {
    const p = await page(1440, 900);
    await p.goto(BASE + '/', { waitUntil: 'networkidle0' });
    await sleep(3500);
    await p.mouse.move(1050, 420);
    await sleep(600);
    await p.mouse.move(1110, 470, { steps: 12 });
    await sleep(500);
    await p.screenshot({ path: `${OUT}/01-hero-desktop.png` });
    return p;
  },
  async heroMobile() {
    const p = await page(390, 844, true);
    await p.goto(BASE + '/', { waitUntil: 'networkidle0' });
    await sleep(3500);
    await p.screenshot({ path: `${OUT}/02-hero-mobile.png` });
    await p.screenshot({ path: `${OUT}/02b-hero-mobile-full.png`, clip: { x: 0, y: 0, width: 390, height: 1500 }, captureBeyondViewport: true });
  },
  async featured() {
    const p = await page(1440, 900);
    await p.goto(BASE + '/', { waitUntil: 'networkidle0' });
    await sleep(1500);
    await scrollTo(p, '#work .featured', 60);
    await p.mouse.move(500, 400);
    await sleep(300);
    await p.mouse.move(560, 330, { steps: 10 });
    await sleep(700);
    await p.screenshot({ path: `${OUT}/03-featured-card.png` });
  },
  async detail() {
    const p = await page(1440, 900);
    await p.goto(BASE + '/work/coach-ai/', { waitUntil: 'networkidle0' });
    await sleep(1500);
    await p.screenshot({ path: `${OUT}/04-detail-top.png` });
    await scrollTo(p, '#architecture', 120);
    await p.screenshot({ path: `${OUT}/05-detail-architecture.png` });
    const m = await page(390, 844, true);
    await m.goto(BASE + '/work/ai-interpreter/', { waitUntil: 'networkidle0' });
    await sleep(1200);
    await scrollTo(m, '#architecture', 80);
    await m.screenshot({ path: `${OUT}/05b-detail-architecture-mobile.png` });
    const c = await page(1440, 900);
    await c.goto(BASE + '/work/crm-automation-suite/', { waitUntil: 'networkidle0' });
    await sleep(1200);
    await scrollTo(c, '[aria-label="Clients"]', 100);
    await c.screenshot({ path: `${OUT}/05c-crm-clients-flow.png` });
  },
  async concepts() {
    const p = await page(1440, 900);
    await p.goto(BASE + '/', { waitUntil: 'networkidle0' });
    await sleep(1200);
    await scrollTo(p, '#concepts', 70);
    await p.screenshot({ path: `${OUT}/06-concepts.png` });
  },
  async stack() {
    const p = await page(1440, 900);
    await p.goto(BASE + '/', { waitUntil: 'networkidle0' });
    await sleep(1200);
    await scrollTo(p, '#stack .constellation', 120);
    const btn = await p.$('.hub:nth-child(3) .orbit-btn');
    const box = await btn.boundingBox();
    await p.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await sleep(800);
    await p.screenshot({ path: `${OUT}/07-stack-constellation.png` });
  },
  async timeline() {
    const p = await page(1440, 900);
    await p.goto(BASE + '/', { waitUntil: 'networkidle0' });
    await sleep(1200);
    await scrollTo(p, '#experience .timeline', 140);
    await p.evaluate(() => window.__lenis?.scrollTo(window.scrollY + 300));
    await sleep(4500);
    await p.screenshot({ path: `${OUT}/08-timeline.png` });
  },
  async reducedMotion() {
    const p = await page(1440, 900);
    await p.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
    await p.goto(BASE + '/', { waitUntil: 'networkidle0' });
    await sleep(1200);
    await p.screenshot({ path: OUT + "/10-reduced-motion-hero.png" });
    await p.evaluate(() => document.querySelector('#concepts').scrollIntoView());
    await sleep(800);
    await p.screenshot({ path: OUT + "/11-reduced-motion-concepts.png" });
  },
  async contactMobile() {
    const p = await page(390, 844, true);
    await p.goto(BASE + '/', { waitUntil: 'networkidle0' });
    await sleep(1000);
    await p.evaluate(() => document.querySelector('#contact').scrollIntoView());
    await sleep(1800);
    await p.screenshot({ path: OUT + "/12-contact-mobile.png" });
  },
  async featuredAll() {
    const p = await page(1440, 900);
    await p.goto(BASE + '/', { waitUntil: 'networkidle0' });
    await sleep(1500);
    let k = 0;
    for (const sel of ['#case-coach-ai', '#case-sales-copilot', '#case-ai-interpreter', '#case-crm-automation-suite']) {
      await scrollTo(p, sel, 200);
      await sleep(1200);
      await p.screenshot({ path: OUT + '/13-featured-' + ++k + '.png' });
    }
  },
  async caseStudies() {
    for (const slug of ['sales-copilot', 'coach-ai']) {
      const p = await page(1440, 900);
      await p.goto(BASE + '/work/' + slug + '/', { waitUntil: 'networkidle0' });
      await sleep(2200);
      await p.screenshot({ path: OUT + '/14-' + slug + '-top.png' });
      await scrollTo(p, '.detail-mock', 110);
      await sleep(1500);
      await p.screenshot({ path: OUT + '/14-' + slug + '-mockup.png' });
      await scrollTo(p, '.shots', 160);
      await sleep(2000);
      await p.screenshot({ path: OUT + '/14-' + slug + '-screenshots.png' });
      await p.click('.shot-btn');
      await sleep(1200);
      await p.screenshot({ path: OUT + '/14-' + slug + '-lightbox.png' });
    }
    const m = await page(390, 844, true);
    await m.goto(BASE + '/work/sales-copilot/', { waitUntil: 'networkidle0' });
    await sleep(1500);
    await m.evaluate(() => document.querySelector('.shots').scrollIntoView());
    await sleep(2000);
    await m.screenshot({ path: OUT + '/14-sales-copilot-screenshots-mobile.png' });
  },
  async interpreterAndProjects() {
    const p = await page(1440, 900);
    await p.goto(BASE + '/work/ai-interpreter/', { waitUntil: 'networkidle0' });
    await sleep(2000);
    await p.screenshot({ path: OUT + '/15-ai-interpreter-top.png' });
    await p.goto(BASE + '/', { waitUntil: 'networkidle0' });
    await sleep(1200);
    await scrollTo(p, '#projects', 70);
    await sleep(1500);
    await p.screenshot({ path: OUT + '/16-more-projects.png' });
    await scrollTo(p, '#how-i-work', 110);
    await sleep(2500);
    await p.screenshot({ path: OUT + '/17-how-i-work-experience.png' });
  },
  async round3() {
    const p = await page(1440, 900);
    await p.goto(BASE + '/', { waitUntil: 'networkidle0' });
    await sleep(1500);
    await scrollTo(p, '#case-ai-interpreter', 200);
    await sleep(1500);
    await p.screenshot({ path: OUT + '/18-ai-interpreter-card.png' });
    await scrollTo(p, '#case-sales-copilot', 200);
    await sleep(1500);
    await p.screenshot({ path: OUT + '/18-sales-copilot-card.png' });
    await p.goto(BASE + '/work/ai-interpreter/', { waitUntil: 'networkidle0' });
    await sleep(2200);
    await p.screenshot({ path: OUT + '/19-ai-interpreter-top.png' });
    await scrollTo(p, '.detail-mock', 110);
    await sleep(1500);
    await p.screenshot({ path: OUT + '/19-ai-interpreter-mockup.png' });
    await scrollTo(p, '.shots', 160);
    await sleep(2000);
    await p.screenshot({ path: OUT + '/19-ai-interpreter-screenshots.png' });
    await p.click('.shot-btn');
    await sleep(1200);
    await p.screenshot({ path: OUT + '/19-ai-interpreter-lightbox.png' });
    await p.goto(BASE + '/work/sales-copilot/', { waitUntil: 'networkidle0' });
    await sleep(1500);
    await scrollTo(p, '.shots', 160);
    await sleep(2000);
    await p.screenshot({ path: OUT + '/20-sales-copilot-screenshots.png' });
    await p.click('.shot-btn');
    await sleep(1200);
    await p.screenshot({ path: OUT + '/20-sales-copilot-lightbox.png' });
    await p.goto(BASE + '/work/crm-automation-suite/', { waitUntil: 'networkidle0' });
    await sleep(1500);
    await scrollTo(p, '[aria-label="Clients"]', 100);
    await sleep(2000);
    await p.screenshot({ path: OUT + '/21-crm-clients.png' });
    await p.goto(BASE + '/', { waitUntil: 'networkidle0' });
    await sleep(1000);
    await scrollTo(p, '#experience .timeline', 140);
    await p.evaluate(() => window.__lenis?.scrollTo(window.scrollY + 300));
    await sleep(4500);
    await p.screenshot({ path: OUT + '/22-timeline.png' });
  },
  async contact() {
    const p = await page(1440, 900);
    await p.goto(BASE + '/', { waitUntil: 'networkidle0' });
    await sleep(1200);
    await scrollTo(p, '#contact', 120);
    await p.screenshot({ path: `${OUT}/09-contact.png` });
  },
};

for (const [name, fn] of Object.entries(shots)) {
  if (only && !only.includes(name)) continue;
  try {
    await fn();
    console.log('ok', name);
  } catch (e) {
    console.log('FAIL', name, e.message);
  }
}
await browser.close();
