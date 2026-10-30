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
- Identidad: emblema vectorial propio (el coche del cartel) y foto de perfil de Instagram
  generada desde el mismo dibujo, para que web y redes se vean igual.
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
│   ├── logo-car.svg         (el coche de la marca, vectorial)
│   ├── logo-mark.svg        (el coche en la insignia: favicon e iconos)
│   ├── icon-192.png         (icono de app, generado desde el emblema)
│   ├── icon-512.png         (icono de app)
│   ├── icon-maskable-512.png(icono de app con zona segura de Android)
│   ├── apple-touch-icon.png (icono para iOS, generado desde el emblema)
│   ├── logo.png             (logotipo antiguo del cliente, ya sin uso)
│   └── *.webp               (fotos del sitio)
├── marca/
│   ├── foto-perfil-instagram.png  (foto de perfil 1080 × 1080)
│   ├── destacado-*.png      (portadas de destacados 1080 × 1920)
│   ├── historia-horario.png (historia con el horario, 1080 × 1920)
│   ├── como-se-ve-en-instagram.png(vista previa con recorte circular)
│   └── build-redes.mjs      (script que genera todas esas imágenes)
└── vercel.json              (configuración de despliegue)
```

## Marca

La marca es **el coche del cartel de la fachada del taller**. Partimos de la foto del rótulo
que aportó el cliente y el dibujo se ha **trazado a vectorial** (un único `path` con
`fill-rule="evenodd"`), así que ya no es una recreación aproximada sino el mismo trazo del
cartel, nítido a cualquier tamaño.

| Archivo | Qué es | Dónde se usa |
|---|---|---|
| `img/logo-car.svg` | El coche solo, `fill="currentColor"` (hereda el color del texto) | Cabecera (104 px de ancho) y pie (132 px) |
| `img/logo-mark.svg` | El coche dentro de la insignia granate | Favicon y generación de los iconos de app |
| `img/icon-192.png` · `img/icon-512.png` · `img/icon-maskable-512.png` | 192 / 512 / 512 px | PWA y pantalla de inicio (Android) |
| `img/apple-touch-icon.png` | 180 × 180 px | iOS (guardar en inicio) |
| `img/logo.png` | Logotipo antiguo que aportó el cliente | **Sin uso**: se conserva solo como archivo histórico |

**Cómo se monta en la web:** el `path` se define **una sola vez** en un `<symbol id="marca-coche">`
al principio del `<body>` y la cabecera y el pie lo pintan con `<use href="#marca-coche">`. Así
el HTML no repite los ~5 KB del trazado, el color lo pone el CSS (`fill: currentColor`, tinta en
la cabecera y crema en el pie) y si algún día cambia el dibujo se cambia en un único sitio.

**Por qué el nombre va en HTML:** la tipografía del coche es un trazo, no un texto; el nombre
"TALLER COSTA BRAVA" se escribe con la tipografía del sistema, siempre nítido y seleccionable,
y el coche queda como símbolo decorativo (`aria-hidden="true"`), con el nombre accesible en
`aria-label` del enlace.

**Proporciones:** el dibujo es apaisado (919 × 312, casi 3:1). Por eso en la cabecera se usa a
104 px de ancho (35 px de alto) y en el pie a 132 px; en la insignia cuadrada del favicon va
centrado con aire arriba y abajo, que es lo que permite el formato cuadrado.

> Si el diseñador entrega el original (SVG/AI/PDF), basta con sustituir el `path` de
> `img/logo-car.svg` y volver a generar los PNG de `img/` y las fotos de `marca/`.

### Iconos

Los seis iconos de "Servicios del taller" son un set homogéneo y **todos** siguen la misma
plantilla, para que ninguno destaque por color, estilo o grosor:

```html
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
     stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">…</svg>
```

- **Estilo de línea** (nunca relleno) y grosor de trazo 2 en todos, sobre geometría de 24 px.
- **Color heredado** con `currentColor`: el icono toma el granate del contenedor
  `.card-icon`. No se pone `fill` ni `stroke` con valor fijo en ningún icono.
- `aria-hidden="true"`: el significado lo da el `<h3>` de la tarjeta, así que el icono es decorativo.
- Símbolos distintos entre sí: llave inglesa (mecánica), rueda (neumáticos), chip
  (reprogramaciones), monitor con señal (diagnosis), lista de comprobación (pre-ITV) y sello
  con check (ITV).

> Si se añade o cambia un icono, hay que copiar el `<svg>` completo de arriba. Un `<path>`
> suelto sin `fill="none"` se pinta **negro sólido** por defecto y rompe el conjunto: fue
> justo el fallo que se corrigió aquí.

**Paleta del sitio**, tomada del logotipo: granate `#8e2f26` (botones, acentos), granate
oscuro `#63211b` (hover), crema `#f7f2e6` (fondos alternos) y negro cálido `#1f0d08`
(secciones oscuras y footer). Están como variables en `:root` al principio de
`css/styles.css`.

## Redes sociales (Instagram)

Todo lo de redes se genera con el **mismo coche** del sitio (`img/logo-car.svg`) y la misma
paleta, así que perfil, destacados y web van siempre a la una. Son PNG listos para subir:

| Archivo | Formato | Para qué |
|---|---|---|
| `marca/foto-perfil-instagram.png` | 1080 × 1080 | Foto de perfil: **el coche solo, sin texto** |
| `marca/destacado-horario.png` | 1080 × 1920 | Portada del destacado «Horario» (reloj) |
| `marca/destacado-servicios.png` | 1080 × 1920 | Portada de «Servicios» (llave) |
| `marca/destacado-opiniones.png` | 1080 × 1920 | Portada de «Opiniones» (estrella) |
| `marca/destacado-contacto.png` | 1080 × 1920 | Portada de «Contacto» (teléfono) |
| `marca/historia-horario.png` | 1080 × 1920 | **Historia con el horario real**, para subir dentro del destacado |
| `marca/como-se-ve-en-instagram.png` | — | Vista previa con el recorte circular real |

**La foto de perfil va sin texto a propósito.** Instagram la muestra a 40 px en los
comentarios: el nombre se convierte en una mancha y ensucia el coche. El nombre ya lo dice
el usuario de la cuenta y la biografía, y en la web lo escribe el HTML.

**Los destacados sí llevan una palabra**, porque ahí el recorte es de ~140 px y se lee. La
composición está pensada para el recorte circular: todo el contenido vive dentro del círculo
central de la imagen de 1080 × 1920 (Instagram recorta el cuadrado central), con el aro
granate a la vista.

La historia del horario sale del mismo array `HORARIO` del script: si cambian las horas, se
toca ahí y se vuelve a lanzar. El texto está en castellano; para catalán basta con cambiar
las etiquetas (`Lunes a viernes` → `De dilluns a divendres`, `Cerrado` → `Tancat`).

Para regenerarlo todo después de tocar el logo:

```bash
npm i puppeteer-core @sparticuz/chromium
node marca/build-redes.mjs
# o, con un Chrome ya instalado:
CHROME_PATH=/usr/bin/google-chrome node marca/build-redes.mjs
```

El script lee el trazado de `img/logo-car.svg`, así que cambiando el coche del sitio se
actualizan perfil y destacados a la vez. Para añadir otro destacado basta con una línea más
en la lista `DESTACADOS` (icono + texto).

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
4. **Logo del diseñador**: el emblema actual es una recreación vectorial del coche del
   cartel. Si el diseñador entrega el original (SVG/AI/PDF), se sustituye `img/logo-mark.svg`
   sin tocar nada más.

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

### Caché de CSS y JS

`vercel.json` sirve `styles.css` y `main.js` con `max-age=0, must-revalidate`: el navegador
pregunta al servidor y, si no ha cambiado, se queda con la copia local (un 304, barato). Antes
se servían con 7 días de caché, y eso provocó un fallo real: tras cambiar el logo, quien tenía
el CSS antiguo veía el HTML nuevo con reglas que no existían — el coche de la cabecera se
quedaba en 0 × 0 (invisible) y el del pie salía enorme y en negro.

Por eso el `<link>` lleva una versión (`css/styles.css?v=…`): si algún visitante tiene la copia
vieja cacheada de la URL anterior, al cambiar la versión vuelve a descargarla. **Al tocar
`styles.css` conviene subir ese `?v=`.**

Y por eso el logo no depende del CSS para verse: los `<svg>` de la cabecera y el pie llevan
`width`, `height` y `fill` como atributos. Si el CSS llega tarde o está cacheado, el coche se
pinta igual (algo más grande, pero correcto).
