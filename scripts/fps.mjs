// Frame-rate measurement in real (headful, GPU) Chrome.
// Scrolls the whole home page and exercises the hero orb, sampling every rAF.
// Usage: node scripts/fps.mjs [baseUrl]
import puppeteer from 'puppeteer-core';

const BASE = process.argv[2] ?? 'http://localhost:4173';
const CHROME = process.env.CHROME_PATH ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: false,
  protocolTimeout: 180000,
  args: ['--window-size=1500,1000', '--disable-features=CalculateNativeWinOcclusion', '--disable-backgrounding-occluded-windows', '--disable-renderer-backgrounding'],
});

function stats(deltas) {
  const d = [...deltas].sort((a, b) => a - b);
  const pct = (p) => d[Math.min(d.length - 1, Math.floor((p / 100) * d.length))];
  const mean = d.reduce((s, x) => s + x, 0) / d.length;
  return {
    frames: d.length,
    avgFps: +(1000 / mean).toFixed(1),
    // "p95 fps": the frame rate that 95% of frames meet or beat (from the 95th-percentile frame time)
    p95Fps: +(1000 / pct(95)).toFixed(1),
    p95FrameMs: +pct(95).toFixed(2),
    p99FrameMs: +pct(99).toFixed(2),
    over18ms: d.filter((x) => x > 18.2).length,
  };
}

async function run(label, { mobile, cpu = 1 }) {
  const page = (await browser.pages())[0];
  await page.bringToFront();
  if (mobile) await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
  else await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
  const cdp = await page.createCDPSession();
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: cpu });
  await page.goto(BASE + '/', { waitUntil: 'networkidle0' });
  // a real visitor's pointer/finger is on the page: that starts the lazy orb (three.js
  // download + shader compile); let fonts, orb and Lenis settle before recording
  if (mobile) await page.touchscreen.tap(200, 120);
  else await page.mouse.move(700, 400);
  await sleep(4500);

  // start the frame recorder
  await page.evaluate(() => {
    window.__dt = [];
    let prev = performance.now();
    const f = (t) => {
      window.__dt.push(t - prev);
      prev = t;
      if (!window.__stop) requestAnimationFrame(f);
    };
    requestAnimationFrame((t) => {
      prev = t;
      requestAnimationFrame(f);
    });
  });

  // 1. hero: move the pointer across the orb (desktop) / touch to start it (mobile)
  if (!mobile) {
    for (let i = 0; i < 60; i++) {
      await page.mouse.move(900 + Math.sin(i / 6) * 260, 420 + Math.cos(i / 5) * 160);
      await sleep(25);
    }
  } else {
    await page.touchscreen.tap(200, 120);
    await sleep(1500);
  }

  // 2. scroll the full page
  const total = await page.evaluate(() => document.documentElement.scrollHeight - innerHeight);
  if (!mobile) {
    let y = 0;
    while (y < total) {
      await page.mouse.wheel({ deltaY: 120 });
      y += 120;
      await sleep(40);
    }
    await sleep(1200);
  } else {
    // touch devices use native (compositor-threaded) scrolling — Lenis is desktop-only —
    // so drive it with synthesized native scroll gestures, one screen at a time
    // (CDP 'touch' gestures don't scroll in a desktop window; 'mouse' is the same native path)
    let y = 0;
    for (let n = 0; y < total - 4 && n < 60; n++) {
      await cdp.send('Input.synthesizeScrollGesture', {
        x: 195,
        y: 650,
        yDistance: -600,
        speed: 1200,
        gestureSourceType: 'mouse',
        preventFling: true,
      });
      y = await page.evaluate(() => window.scrollY);
    }
    await sleep(800);
  }

  const dt = await page.evaluate(() => {
    window.__stop = true;
    return window.__dt.slice(2);
  });
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 1 });
  const s = stats(dt);
  console.log(JSON.stringify({ label, ...s }));
  return s;
}

const results = [];
for (let i = 0; i < 2; i++) {
  results.push(await run('desktop 1440×900', { mobile: false }));
  results.push(await run('mobile 390×844 (touch, DPR 3)', { mobile: true }));
  results.push(await run('mobile 390×844 + 4× CPU throttle', { mobile: true, cpu: 4 }));
}
await browser.close();
