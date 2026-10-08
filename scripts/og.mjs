// Renders public/og.png (1200×630) and public/apple-icon.png (180×180) with real Chrome.
// Run after `npm run assets` (needs scripts/og-photo.jpg and app/fonts).
import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const b64 = (p) => fs.readFileSync(path.join(root, p)).toString('base64');
const font = (f) => `url(data:font/woff2;base64,${b64('app/fonts/' + f)}) format('woff2')`;
const CHROME = process.env.CHROME_PATH ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe';

const css = `
@font-face{font-family:P;font-weight:700;src:${font('poppins-latin-700-normal.woff2')}}
@font-face{font-family:P;font-weight:600;src:${font('poppins-latin-600-normal.woff2')}}
@font-face{font-family:I;font-weight:500;src:${font('inter-latin-600-normal.woff2')}}
*{margin:0;box-sizing:border-box}body{background:#0B1524}`;

const og = `<style>${css}
.c{position:relative;width:1200px;height:630px;overflow:hidden;background:#0B1524;color:#F2F6FC;font-family:I}
.glow{position:absolute;width:900px;height:700px;right:-200px;top:-260px;background:radial-gradient(closest-side,rgba(34,211,238,.25),transparent 70%)}
.glow2{position:absolute;width:700px;height:600px;left:-260px;bottom:-320px;background:radial-gradient(closest-side,rgba(56,120,220,.22),transparent 70%)}
.t{position:absolute;left:72px;top:0;bottom:0;width:640px;display:flex;flex-direction:column;justify-content:center;gap:26px}
.e{font:500 18px I;letter-spacing:.2em;text-transform:uppercase;color:#22D3EE}
h1{font:700 76px/1.02 P;letter-spacing:-.035em}h1 span{color:#22D3EE}
.r{font:600 26px/1.4 P;color:#F2F6FC}.c2{display:flex;gap:10px;flex-wrap:wrap}.c2 span{font:500 17px I;color:#22D3EE;border:1px solid rgba(34,211,238,.45);border-radius:999px;padding:7px 14px}.r i{color:#22D3EE;font-style:normal;margin:0 8px}
.ph{position:absolute;right:72px;top:75px;width:400px;height:480px;border-radius:28px;overflow:hidden;
box-shadow:0 0 0 2px rgba(34,211,238,.6),24px 0 70px -20px rgba(34,211,238,.55),0 40px 80px -30px #000}
.ph img{width:100%;height:100%;object-fit:cover;object-position:50% 20%}
.m{position:absolute;left:72px;bottom:48px;width:52px;height:52px;border-radius:50%;background:#22D3EE;color:#0B1524;display:grid;place-items:center;font:700 18px P}
</style><div class="c"><div class="glow"></div><div class="glow2"></div>
<div class="t"><div class="e">Karachi · Pakistan</div><h1>Muhammad<br>Saad <span>Zubair</span></h1>
<div class="r">AI Engineer &amp; Full Stack AI Developer</div><div class="c2"><span>AI Automation · RAG · Real-time voice</span><span>Leads a small dev team</span></div></div>
<div class="ph"><img src="data:image/jpeg;base64,${b64('scripts/og-photo.jpg')}"></div><div class="m">SZ</div></div>`;

const icon = `<style>${css}
.i{width:180px;height:180px;background:#0B1524;display:grid;place-items:center;font:700 74px P;letter-spacing:-.04em;color:#22D3EE;
box-shadow:inset 0 0 0 5px rgba(34,211,238,.5);border-radius:0}</style><div class="i">SZ</div>`;

const browser = await puppeteer.launch({ executablePath: CHROME, headless: true });
const page = await browser.newPage();
for (const [html, w, h, out] of [[og, 1200, 630, 'public/og.png'], [icon, 180, 180, 'public/apple-icon.png']]) {
  await page.setViewport({ width: w, height: h, deviceScaleFactor: 1 });
  await page.setContent(html, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: path.join(root, out), clip: { x: 0, y: 0, width: w, height: h } });
  console.log('wrote', out);
}
await browser.close();
