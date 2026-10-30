# Taller Costa Brava — Sitio web

Web corporativa estática (HTML + CSS + JS, sin dependencias) para **Taller Costa Brava**,
taller mecánico de Sant Feliu de Guíxols (Girona).

## Datos del negocio

- **Dirección:** Calle Girona 125-127, 17200 Sant Feliu de Guíxols, Girona
- **Teléfonos:** +34 673 21 04 78 · 972 32 83 82
- **Instagram:** [@taller__costa___brava](https://www.instagram.com/taller__costa___brava/)
- **Horario:** L-V 09:00-13:00 / 15:00-19:00 · S 09:00-13:00 · D cerrado

## Secciones

1. **Hero** con llamada a la acción de WhatsApp y teléfono.
2. **Servicios:** mecánica, neumáticos, reprogramaciones, diagnosis, pre-ITV, ITV.
3. **El taller:** presentación y valores.
4. **Galería** de trabajos reales.
5. **Pedir cita:** formulario que genera un mensaje de WhatsApp ya redactado.
6. **Horarios** con indicador "abierto/cerrado" en tiempo real + mapa de Google Maps.
7. **Footer** con contacto completo y botón flotante de WhatsApp.

## Características técnicas

- 100 % estática: sin build, sin frameworks, sin dependencias (~100 KB en total).
- Responsive (móvil primero), animaciones ligeras con `IntersectionObserver`
  que se desactivan con `prefers-reduced-motion` y nunca dejan contenido oculto.
- SEO local: meta tags, Open Graph, `manifest` instalable y datos estructurados
  `schema.org/AutoRepair`.
- Formulario de cita sin backend: abre WhatsApp con el mensaje pre-rellenado,
  con validación accesible en línea (sin `alert()`).
- Cabeceras de seguridad y de caché definidas en `vercel.json` (CSP, `nosniff`,
  `Referrer-Policy`, `Permissions-Policy`, HSTS).

## Estructura

```
TallerCostaBrava/
├── index.html
├── css/styles.css
├── js/main.js
├── img/
│   ├── logo-mark.svg        (emblema vectorial: header y favicon)
│   ├── logo.png             (logotipo completo: footer a 140 px)
│   ├── apple-touch-icon.png (icono para iOS, generado desde el emblema)
│   └── *.webp               (fotos del sitio)
└── vercel.json              (configuración de despliegue)
```

## Marca

El logotipo tiene **dos versiones**, según el tamaño al que se use:

| Archivo | Qué es | Dónde se usa |
|---|---|---|
| `img/logo-mark.svg` | Emblema vectorial: dos pistones cruzados, **sin texto** | Header, favicon, icono de app |
| `img/logo.png` | Logotipo completo original (insignia con "TALLER" y "COSTA BRAVA") | Footer, a **140 px** |
| `img/apple-touch-icon.png` | 180 × 180 px, generado desde el emblema | iOS (guardar en inicio) |

**Por qué dos versiones:** la tipografía curva de la insignia es ilegible por debajo de
~120 px, así que a tamaño de cabecera (52 px) se usa el emblema sin texto y el nombre lo
escribe el HTML, siempre nítido. El logotipo completo aparece a 140 px en el footer, que es
donde se lee bien.

El emblema es una **recreación vectorial** del original (mismos colores y motivo: pistones
cruzados), pensada para verse limpia a cualquier tamaño y con un peso de ~1 KB. Si en el
futuro se consigue el logo completo en vectorial (SVG/AI/PDF) del diseñador, basta con
sustituir `img/logo-mark.svg` manteniendo el mismo `viewBox="0 0 64 64"`.

**Paleta del sitio**, tomada del logotipo: granate `#8e2f26` (botones, acentos), granate
oscuro `#63211b` (hover), crema `#f7f2e6` (fondos alternos) y negro cálido `#1f0d08`
(secciones oscuras y footer). Están como variables en `:root` al principio de
`css/styles.css`.

## Accesibilidad y buenas prácticas

Comprobado con navegador real (Chromium) en escritorio (1440 px) y móvil (390 px):

- **Estructura:** `<main>` único, jerarquía de encabezados correcta, enlace
  "Saltar al contenido", `lang="es"`.
- **Foco:** `:focus-visible` visible en todos los controles, con color adaptado
  sobre fondos oscuros.
- **Formulario:** etiquetas asociadas, `autocomplete`, `inputmode`,
  errores en línea con `aria-invalid` + `aria-describedby`, foco automático en el
  primer campo erróneo y mensajes anunciados por lectores (`role="status"`).
- **Imágenes:** todas con `alt`, `width`/`height` (sin saltos de layout) y `lazy`
  salvo la del hero, que se precarga.
- **Movimiento:** respeta `prefers-reduced-motion`; el contenido se ve aunque
  JavaScript falle (hay `noscript` y una red de seguridad en el script).
- **Contraste:** todos los pares texto/fondo usados superan WCAG AA (4,5:1);
  la mayoría superan AAA.
- **Menú móvil:** `aria-expanded`/`aria-label` sincronizados, se cierra con
  `Esc` y al pulsar fuera.

## Privacidad

- El **mapa de Google no se carga por defecto**: el iframe se inyecta solo cuando
  el visitante pulsa "Ver el mapa". Así no se instalan cookies de terceros ni se
  envía la IP a Google sin consentimiento. Siempre hay un enlace directo a Maps.
- El formulario **no envía datos a ningún servidor**: compone el mensaje y lo abre
  en WhatsApp, que es un servicio externo cuya privacidad aplica la propia app.

## Antes de publicar (pendientes)

1. **Dominio definitivo**: al tenerlo, poner las URLs absolutas de `og:image` y
   añadir `<link rel="canonical">` (hay un `TODO` en el `<head>`), además de la
   línea `Sitemap:` en `robots.txt`.
2. **Fotos en alta resolución**: `hero.webp` es de 640 × 357 px y en pantallas
   grandes se ve algo blanda (es la imagen LCP). Conviene una versión de
   1920 × 1080; las de la galería, idealmente 1200 px de ancho.
3. **Textos legales**: faltan *Aviso legal*, *Política de privacidad* y, si se
   activa analítica, *Cookies*.
4. **Logo vectorial** del diseñador (SVG/AI/PDF) para sustituir los PNG.

## Uso local

```bash
# Con Python
python3 -m http.server 3000

# O con Node
npx serve -l 3000
```

Luego abre http://localhost:3000

## Despliegue en Vercel

El proyecto es estático: Vercel lo detecta automáticamente.

1. Sube este repositorio a GitHub.
2. En Vercel: **Add New → Project** → importa el repositorio.
3. Framework preset: **Other** (no necesita build). Directorio raíz: `/`.
4. Deploy. Listo.

También puedes desplegar con la CLI:

```bash
npm i -g vercel
vercel --prod
```
