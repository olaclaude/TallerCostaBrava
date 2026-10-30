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

- 100 % estática: sin build, sin frameworks, sin dependencias.
- Responsive (móvil primero), animaciones ligeras con `IntersectionObserver`.
- SEO local: meta tags, Open Graph y datos estructurados `schema.org/AutoRepair`.
- Formulario de cita sin backend: abre WhatsApp con el mensaje pre-rellenado.

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
