/**
 * Genera los materiales de marca para redes a partir del mismo coche vectorial
 * que usa el sitio (img/logo-car.svg): foto de perfil y portadas de destacados.
 *
 * Uso:
 *   npm i puppeteer-core @sparticuz/chromium     # o usa un Chrome local
 *   node marca/build-redes.mjs
 *
 * Salida:
 *   marca/foto-perfil-instagram.png    1080 × 1080 (coche solo, sin texto)
 *   marca/destacado-horario.png        1080 × 1920
 *   marca/destacado-servicios.png      1080 × 1920
 *   marca/destacado-opiniones.png      1080 × 1920
 *   marca/destacado-contacto.png       1080 × 1920
 *   marca/como-se-ve-en-instagram.png  vista previa con el recorte circular real
 *
 * Si tienes Chrome instalado, no hace falta @sparticuz/chromium:
 *   CHROME_PATH=/usr/bin/google-chrome node marca/build-redes.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));

const CREAM = '#fff7e6', BADGE = '#3e0e05', RED = '#8e2f26', RING = '#83322c';

// El coche es el mismo trazado que el del sitio: si cambia el logo, cambia aquí solo.
const carFile = fs.readFileSync(path.join(here, '..', 'img', 'logo-car.svg'), 'utf8');
const CAR_D = carFile.match(/<path[^>]*\sd="([^"]+)"/)[1];

const carSvg = (px) => `
<svg viewBox="0 0 919 312" width="${px}" xmlns="http://www.w3.org/2000/svg">
  <path fill="${CREAM}" fill-rule="evenodd" d="${CAR_D}"/>
</svg>`;

// Iconos de línea, mismos que usa la web (24 × 24, trazo 2, remates redondos)
const ICONS = {
  horario: '<circle cx="12" cy="12" r="9"/><path d="M12 7.2V12l3.3 2"/>',
  servicios: '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>',
  opiniones: '<path d="M12 3.8l2.6 5.3 5.8.8-4.2 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8-4.2-4.1 5.8-.8z"/>',
  contacto: '<path d="M6.7 3.6h3l1.5 3.8-2 1.4a12 12 0 0 0 5.2 5.2l1.4-2 3.8 1.5v3c0 1-.8 1.8-1.8 1.7A16.6 16.6 0 0 1 5 5.4c-.1-1 .7-1.8 1.7-1.8z"/>'
};

const iconSvg = (name, px) => `
<svg viewBox="0 0 24 24" width="${px}" height="${px}" fill="none" stroke="${CREAM}"
     stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"
     xmlns="http://www.w3.org/2000/svg">${ICONS[name]}</svg>`;

const base = `
  *{margin:0;padding:0;box-sizing:border-box}
  body{font-family:"DejaVu Sans",system-ui,sans-serif;color:${CREAM};background:${BADGE}}
  .stage{position:relative;display:flex;flex-direction:column;align-items:center;justify-content:center;
    background:radial-gradient(circle at 50% 37%, rgba(255,247,230,.075), rgba(255,247,230,0) 62%), ${BADGE}}
  .ring{position:absolute;border-radius:50%}
  .word{text-transform:uppercase;white-space:nowrap;font-weight:700;line-height:1}
  .fila{display:flex;justify-content:space-between;align-items:center;width:860px;
        padding:56px 0;border-bottom:1px solid rgba(255,247,230,.16)}
  .fila:last-child{border-bottom:0}
  .fila-lab{font-size:40px;line-height:1.35;letter-spacing:.14em;text-transform:uppercase;font-weight:700;
            color:rgba(255,247,230,.62);width:330px;flex:none}
  .fila-hor{text-align:right;font-size:64px;font-weight:700;line-height:1.24;letter-spacing:.01em;white-space:nowrap}
  .fila-hor span{display:block}
  .cerrado{color:#d98b82;letter-spacing:.06em}
`;

// 1080 × 1080: el dibujo va solo, sin texto (a 40 px no se lee nada)
const perfilHtml = `
<div class="stage" style="width:1080px;height:1080px">
  <div class="ring" style="inset:40px;border:14px solid ${RED}"></div>
  <div class="ring" style="inset:96px;border:3px solid rgba(255,247,230,.17)"></div>
  <div style="margin-top:0">${carSvg(830)}</div>
</div>`;

// 1080 × 1920: Instagram recorta en círculo el cuadrado central, así que el
// contenido vive dentro del círculo de 540 px de radio centrado en la imagen.
const destacadoHtml = (icon, label) => `
<div class="stage" style="width:1080px;height:1920px">
  <div class="ring" style="left:40px;top:460px;width:1000px;height:1000px;border:14px solid ${RED}"></div>
  <div class="ring" style="left:96px;top:516px;width:888px;height:888px;border:3px solid rgba(255,247,230,.17)"></div>
  <div style="position:absolute;top:710px;left:0;right:0;display:flex;justify-content:center">${iconSvg(icon, 360)}</div>
  <div class="word" style="position:absolute;top:1126px;left:0;right:0;text-align:center;
       font-size:84px;letter-spacing:.24em;text-indent:.24em">${label}</div>
</div>`;

// 1080 × 1920: la historia que va dentro del destacado, con el horario real
const HORARIO = [
  ['Lunes a viernes', ['09:00 – 13:00', '15:00 – 19:00'], false],
  ['Sábado', ['09:00 – 13:00'], false],
  ['Domingo', ['Cerrado'], true]
];

const filaHtml = ([label, horas, cerrado]) => `
  <div class="fila">
    <div class="fila-lab">${label}</div>
    <div class="fila-hor">${horas.map((h) => `<span class="${cerrado ? 'cerrado' : ''}">${h}</span>`).join('')}</div>
  </div>`;

const storyHorarioHtml = `
<div class="stage" style="width:1080px;height:1920px">
  <div style="display:flex;flex-direction:column;align-items:center;width:100%">
    ${iconSvg('horario', 110)}
    <div class="word" style="margin-top:34px;font-size:80px;letter-spacing:.3em;text-indent:.3em">Horario</div>
    <div style="width:860px;height:1px;background:rgba(255,247,230,.28);margin:56px 0 8px"></div>
    <div>${HORARIO.map(filaHtml).join('')}</div>
    <div style="margin-top:78px;text-align:center;font-size:34px;line-height:1.65;
                color:rgba(255,247,230,.62);letter-spacing:.03em">
      Calle Girona 125-127 · Sant Feliu de Guíxols<br>
      673 21 04 78 · 972 32 83 82
    </div>
  </div>
</div>`;

const DESTACADOS = [
  ['destacado-horario', 'horario', 'Horario'],
  ['destacado-servicios', 'servicios', 'Servicios'],
  ['destacado-opiniones', 'opiniones', 'Opiniones'],
  ['destacado-contacto', 'contacto', 'Contacto']
];

const mockup = (perfil, destacados, historia) => `<!doctype html><html><head><meta charset="utf-8"><style>
 body{margin:0;background:#fff;font-family:system-ui,"DejaVu Sans",sans-serif;color:#1a1210;padding:34px 40px}
 h1{font-size:26px;margin:0 0 6px} h2{font-size:16px;margin:28px 0 10px;color:#8e2f26;letter-spacing:.06em;text-transform:uppercase}
 p.sub{margin:0 0 22px;color:#5b504c;font-size:15px}
 .sizes{display:flex;gap:18px;align-items:center;background:#f4efe6;border-radius:14px;padding:16px 20px}
 .circ{border-radius:50%;overflow:hidden;background:#000;display:block;object-fit:cover;object-position:center}
 .cards{display:flex;gap:26px}
 .card{display:flex;flex-direction:column;align-items:center;gap:10px}
 .cap{font-size:13px;color:#6b605c}
</style></head><body>
<h1>Foto de perfil y portadas de destacados</h1>
<p class="sub">Recorte circular real de la app, a los tamaños en que se ve cada pieza.</p>

<h2>Foto de perfil</h2>
<div class="sizes">
  <img class="circ" src="${perfil}" width="150" height="150">
  <img class="circ" src="${perfil}" width="96" height="96">
  <img class="circ" src="${perfil}" width="48" height="48">
  <img class="circ" src="${perfil}" width="32" height="32">
</div>

<h2>Historia del destacado</h2>
<div style="display:flex;gap:24px;align-items:flex-start">
  <img src="${historia}" width="240" style="border-radius:18px;display:block">
  <p class="sub" style="max-width:420px;margin:0">Esta es la historia que se sube dentro del destacado «Horario».
  Formato 1080 × 1920, con los márgenes de arriba y abajo libres para que no los tape la interfaz de Instagram.</p>
</div>

<h2>Destacados</h2>
<div class="cards">
  ${destacados.map(([label, src]) => `
    <div class="card">
      <img class="circ" src="${src}" width="140" height="140">
      <span class="cap">${label}</span>
    </div>`).join('')}
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
await page.setViewport({ width: 1080, height: 1920, deviceScaleFactor: 1 });

const shot = async (html, w, h, file) => {
  await page.setViewport({ width: w, height: h, deviceScaleFactor: 1 });
  await page.setContent(`<html><head><style>${base}</style></head><body>${html}</body></html>`, { waitUntil: 'load' });
  await new Promise((r) => setTimeout(r, 120));
  await page.screenshot({ path: file });
  console.log('ok', path.basename(file));
  return 'data:image/png;base64,' + fs.readFileSync(file).toString('base64');
};

const perfilUri = await shot(perfilHtml, 1080, 1080, path.join(here, 'foto-perfil-instagram.png'));

const destacadosUris = [];
for (const [file, icon, label] of DESTACADOS) {
  const uri = await shot(destacadoHtml(icon, label), 1080, 1920, path.join(here, `${file}.png`));
  destacadosUris.push([label, uri]);
}

const storyUri = await shot(storyHorarioHtml, 1080, 1920, path.join(here, 'historia-horario.png'));

await page.setViewport({ width: 1000, height: 1160, deviceScaleFactor: 2 });
await page.setContent(mockup(perfilUri, destacadosUris, storyUri), { waitUntil: 'load' });
await new Promise((r) => setTimeout(r, 200));
await page.screenshot({ path: path.join(here, 'como-se-ve-en-instagram.png'), fullPage: true });
console.log('ok como-se-ve-en-instagram.png');

await browser.close();
