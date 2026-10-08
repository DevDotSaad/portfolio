// Runs Lighthouse N times per form factor and reports the median run.
// Usage: node scripts/lighthouse.mjs [url] [runs]   (serve the build first: npm start)
import lighthouse from 'lighthouse';
import desktopConfig from 'lighthouse/core/config/desktop-config.js';
import * as chromeLauncher from 'chrome-launcher';
import fs from 'node:fs';
import path from 'node:path';

const URL = process.argv[2] ?? 'http://localhost:3000/';
const RUNS = Number(process.argv[3] ?? 5);
const OUT = path.resolve(import.meta.dirname, '..', 'reports', 'lighthouse');
fs.mkdirSync(OUT, { recursive: true });

const median = (xs) => [...xs].sort((a, b) => a - b)[Math.floor(xs.length / 2)];

for (const formFactor of ['mobile', 'desktop']) {
  const runs = [];
  for (let i = 0; i < RUNS; i++) {
    const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless=new'] });
    const result = await lighthouse(URL, { port: chrome.port, output: 'json', logLevel: 'error' }, formFactor === 'desktop' ? desktopConfig : undefined);
    await chrome.kill();
    const { lhr } = result;
    const a = lhr.audits;
    runs.push({
      perf: Math.round(lhr.categories.performance.score * 100),
      a11y: Math.round(lhr.categories.accessibility.score * 100),
      bp: Math.round(lhr.categories['best-practices'].score * 100),
      seo: Math.round(lhr.categories.seo.score * 100),
      fcp: a['first-contentful-paint'].numericValue,
      lcp: a['largest-contentful-paint'].numericValue,
      tbt: a['total-blocking-time'].numericValue,
      cls: a['cumulative-layout-shift'].numericValue,
      si: a['speed-index'].numericValue,
      bench: Math.round(lhr.environment.benchmarkIndex),
      json: result.report,
    });
    console.log(`${formFactor} run ${i + 1}: perf ${runs.at(-1).perf}  benchmarkIndex ${runs.at(-1).bench}`);
  }
  const med = runs.find((r) => r.perf === median(runs.map((r) => r.perf)));
  fs.writeFileSync(path.join(OUT, `${formFactor}-median.json`), med.json);
  console.log(
    `\n${formFactor.toUpperCase()} median of ${RUNS}: Performance ${med.perf} · Accessibility ${med.a11y} · Best practices ${med.bp} · SEO ${med.seo}\n` +
      `  FCP ${(med.fcp / 1000).toFixed(1)} s · LCP ${(med.lcp / 1000).toFixed(1)} s · TBT ${Math.round(med.tbt)} ms · CLS ${med.cls.toFixed(3)} · SI ${(med.si / 1000).toFixed(1)} s\n` +
      `  all runs: ${runs.map((r) => r.perf).join(', ')}\n`,
  );
}
