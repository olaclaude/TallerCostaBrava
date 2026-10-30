/**
 * Genera la foto de perfil de Instagram (y sus alternativas) a partir del
 * mismo coche vectorial que usa el emblema del sitio.
 *
 * Uso:
 *   npm i puppeteer-core @sparticuz/chromium     # o usa un Chrome local
 *   node marca/build-avatar.mjs
 *
 * Salida (1080 × 1080, el tamaño que recomienda Instagram):
 *   marca/foto-perfil-instagram.png     opción A (la recomendada)
 *   marca/foto-perfil-instagram-b.png   opción B
 *   marca/foto-perfil-instagram-c.png   opción C
 *   marca/como-se-ve-en-instagram.png   vista previa con recorte circular
 *
 * Si tienes Chrome instalado, no hace falta @sparticuz/chromium:
 *   CHROME_PATH=/usr/bin/google-chrome node marca/build-avatar.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));

const CREAM = '#fff7e6', BADGE = '#3e0e05', RED = '#8e2f26', RING = '#83322c';

// El coche es el mismo trazado vectorial que usa el sitio (img/logo-car.svg),
// así que la foto de perfil y la web nunca se pueden desincronizar.
const carFile = fs.readFileSync(path.join(here, '..', 'img', 'logo-car.svg'), 'utf8');
const CAR_D = carFile.match(/<path[^>]*\sd="([^"]+)"/)[1];
const CAR_BOX = '0 0 919 312';

const carSvg = () => `
<svg viewBox="${CAR_BOX}" xmlns="http://www.w3.org/2000/svg">
  <path fill="${CREAM}" fill-rule="evenodd" d="${CAR_D}"/>
</svg>`;

const badgeSvg = () => `
<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
  <rect x="1.6" y="1.6" width="60.8" height="60.8" rx="15" fill="${BADGE}"/>
  <rect x="2.6" y="2.6" width="58.8" height="58.8" rx="14.4" fill="none" stroke="${RING}" stroke-width="2"/>
  <g transform="translate(5 22.83) scale(.058762)">
    <path fill="${CREAM}" fill-rule="evenodd" d="${CAR_D}"/>
  </g>
</svg>`;

const base = `
  *{margin:0;padding:0;box-sizing:border-box}
  html,body{width:1080px;height:1080px;overflow:hidden}
  body{font-family:"DejaVu Sans",system-ui,sans-serif;color:${CREAM};background:${BADGE}}
  .stage{position:relative;width:1080px;height:1080px;display:flex;flex-direction:column;align-items:center;
    justify-content:center;background:
    radial-gradient(circle at 50% 38%, rgba(255,247,230,.075), rgba(255,247,230,0) 62%), ${BADGE}}
  .ring{position:absolute;inset:40px;border-radius:50%;border:14px solid ${RED}}
  .ring2{position:absolute;inset:96px;border-radius:50%;border:3px solid rgba(255,247,230,.17)}
  svg{display:block}
  .word{text-transform:uppercase;white-space:nowrap;letter-spacing:.3em;text-indent:.3em;font-size:36px;line-height:1}
  .word b{font-weight:800}
  .band{position:absolute;left:0;right:0;bottom:0;height:290px;background:${RED};display:flex;align-items:center;justify-content:center}
`;

const variants = {
  'foto-perfil-instagram': { // A: coche grande + nombre
    html: `<div class="ring"></div><div class="ring2"></div>
      <div style="display:flex;flex-direction:column;align-items:center;gap:76px;margin-top:6px">
        <div style="width:760px">${carSvg()}</div>
        <div class="word">Taller <b>Costa Brava</b></div>
      </div>`
  },
  'foto-perfil-instagram-b': { // B: el emblema del sitio + nombre
    html: `<div class="ring"></div><div class="ring2"></div>
      <div style="display:flex;flex-direction:column;align-items:center;gap:56px;margin-top:-6px">
        <div style="width:380px">${badgeSvg()}</div>
        <div class="word">Taller <b>Costa Brava</b></div>
      </div>`
  },
  'foto-perfil-instagram-c': { // C: como el cartel de la fachada
    html: `<div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:40px;padding-bottom:290px">
        <div style="width:700px">${carSvg()}</div>
        <div class="word" style="font-size:40px">Taller <b>Costa Brava</b></div>
      </div>
      <div class="band"><div class="word" style="font-size:30px;letter-spacing:.22em">Mecànica · Pneumàtics · Reprog.</div></div>`
  }
};

const mockup = (imgs) => `<!doctype html><html><head><meta charset="utf-8"><style>
 body{margin:0;background:#fff;font-family:system-ui,"DejaVu Sans",sans-serif;color:#1a1210;padding:34px 40px}
 h1{font-size:26px;margin:0 0 6px} p.sub{margin:0 0 26px;color:#5b504c;font-size:15px}
 .row{display:flex;gap:34px;margin-bottom:30px;align-items:flex-end}
 .col{display:flex;flex-direction:column;gap:14px;align-items:center}
 .sizes{display:flex;gap:18px;align-items:center;background:#f4efe6;border-radius:14px;padding:16px 20px}
 .circ{border-radius:50%;overflow:hidden;background:#000;display:block}
 .lbl{width:26px;text-align:center;font-weight:700;font-size:15px;color:#8e2f26}
</style></head><body>
<h1>Cómo se ve la foto de perfil en Instagram</h1>
<p class="sub">Recorte circular real de la app, a tamaño completo y a los tamaños en que aparece (96 px en el perfil, 48 px en comentarios).</p>
<div class="row">
  ${Object.entries(imgs).map(([k, src]) => `
    <div class="col"><div class="lbl">${k}</div>
      <div class="sizes">
        <img class="circ" src="${src}" width="150" height="150">
        <img class="circ" src="${src}" width="96" height="96">
        <img class="circ" src="${src}" width="48" height="48">
        <img class="circ" src="${src}" width="32" height="32">
      </div>
    </div>`).join('')}
</div>
<div style="display:flex;gap:20px;align-items:center;margin-top:8px">
  <img class="circ" src="${imgs.A}" width="220" height="220">
  <span style="font-size:22px;font-weight:700">taller__costa___brava</span>
  <span style="font-size:15px;color:#6b605c">— así se ve la opción A en la cabecera del perfil</span>
</div>
</body></html>`;

const puppeteer = await import('puppeteer-core');
let executablePath = process.env.CHROME_PATH;
let args = ['--no-sandbox', '--disable-dev-shm-usage', '--font-render-hinting=none'];
if (!executablePath) {
  const chromium = (await import('@sparticuz/chromium')).default;
  executablePath = await chromium.executablePath();
  args = chromium.args;
}

const browser = await puppeteer.default.launch({ args, executablePath, headless: 'shell' });
const page = await browser.newPage();
await page.setViewport({ width: 1080, height: 1080, deviceScaleFactor: 1 });

const dataUris = {};
for (const [name, v] of Object.entries(variants)) {
  await page.setContent(`<html><head><style>${base}</style></head><body><div class="stage">${v.html}</div></body></html>`, { waitUntil: 'load' });
  await new Promise((r) => setTimeout(r, 120));
  const out = path.join(here, `${name}.png`);
  await page.screenshot({ path: out });
  dataUris[name === 'foto-perfil-instagram' ? 'A' : name.slice(-1).toUpperCase()] = 'data:image/png;base64,' + fs.readFileSync(out).toString('base64');
  console.log('ok', path.basename(out));
}

await page.setViewport({ width: 1000, height: 700, deviceScaleFactor: 2 });
await page.setContent(mockup(dataUris), { waitUntil: 'load' });
await new Promise((r) => setTimeout(r, 200));
await page.screenshot({ path: path.join(here, 'como-se-ve-en-instagram.png'), fullPage: true });
console.log('ok como-se-ve-en-instagram.png');

await browser.close();
