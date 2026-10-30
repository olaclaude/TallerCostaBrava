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
│   ├── logo-mark.svg        (emblema vectorial: header, footer y favicon)
│   ├── icon-192.png         (icono de app, generado desde el emblema)
│   ├── icon-512.png         (icono de app)
│   ├── icon-maskable-512.png(icono de app con zona segura de Android)
│   ├── apple-touch-icon.png (icono para iOS, generado desde el emblema)
│   ├── logo.png             (logotipo antiguo del cliente, ya sin uso)
│   └── *.webp               (fotos del sitio)
├── marca/
│   ├── foto-perfil-instagram*.png (foto de perfil 1080 × 1080)
│   ├── como-se-ve-en-instagram.png(vista previa con recorte circular)
│   └── build-avatar.mjs     (script que genera esas imágenes)
└── vercel.json              (configuración de despliegue)
```

## Marca

La marca sale del **cartel de la fachada del taller**: el coche de perfil y el nombre
"TALLER COSTA BRAVA". El emblema del sitio es una recreación vectorial de ese coche.

| Archivo | Qué es | Dónde se usa |
|---|---|---|
| `img/logo-mark.svg` | Emblema vectorial: coche de perfil dentro de la insignia granate, **sin texto** | Header (52 px), footer (72 px), favicon, iconos de app |
| `img/icon-192.png` · `img/icon-512.png` · `img/icon-maskable-512.png` | 192 / 512 / 512 px, generados desde el emblema | PWA y pantalla de inicio (Android) |
| `img/apple-touch-icon.png` | 180 × 180 px, generado desde el emblema | iOS (guardar en inicio) |
| `img/logo.png` | Logotipo antiguo que aportó el cliente | **Sin uso**: se conserva solo como archivo histórico |

**Por qué un emblema sin texto:** la tipografía de la insignia original es ilegible por
debajo de ~120 px, así que a tamaño de cabecera (52 px) se usa el símbolo y el nombre lo
escribe el HTML, siempre nítido. Antes el emblema eran dos pistones cruzados; ahora es el
coche del cartel, que es lo que la gente asocia al taller cuando pasa por delante.

**Cómo está dibujado** (`viewBox="0 0 64 64"`, ~1 KB):

- Carrocería en **crema `#fff7e6`** sobre insignia granate `#3e0e05` con aro `#83322c`.
- Las ventanillas, el pilar B y las ruedas van **recortados** en el color de la insignia,
  así que el coche se lee igual a 512 px que a 32 px, sin líneas finas que se pierdan.
- Sin degradados ni sombras: se ve idéntico en pantalla, en un icono de app y en impresión.

> Si algún día llega el logo en vectorial del diseñador, basta con sustituir
> `img/logo-mark.svg` manteniendo el mismo `viewBox="0 0 64 64"`; los PNG de `img/` se
> regeneran rasterizando ese mismo SVG (con `sharp`, o con cualquier exportador de SVG).

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

## Foto de perfil de Instagram

En `marca/` están las tres propuestas, ya a **1080 × 1080** (el tamaño que pide Instagram), y
una vista previa con el **recorte circular real** de la app a 150, 96, 48 y 32 px:

| Archivo | Qué es |
|---|---|
| `marca/foto-perfil-instagram.png` | **Opción recomendada**: coche grande + "TALLER COSTA BRAVA", aro granate |
| `marca/foto-perfil-instagram-b.png` | La insignia del sitio + nombre |
| `marca/foto-perfil-instagram-c.png` | Como el cartel de la fachada, con la banda roja de servicios |
| `marca/como-se-ve-en-instagram.png` | Vista previa de las tres con recorte redondo |

Se sube tal cual desde el móvil o el ordenador (Instagram la recorta en círculo y la reduce
a 320 px). La opción A es la que mejor aguanta ese recorte: el coche sigue leyéndose y el
nombre no se convierte en una mancha.

Para regenerarlas tras cambiar el coche del emblema:

```bash
npm i puppeteer-core @sparticuz/chromium
node marca/build-avatar.mjs
# o, con un Chrome ya instalado:
CHROME_PATH=/usr/bin/google-chrome node marca/build-avatar.mjs
```

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
