# ÁNCORA Fisioterapia · web (concepto)

Landing page de una clínica de fisioterapia **ficticia** en Mérida. Es el ejemplo de la tarifa *Landing page (desde 390 €)* del portfolio: diseño a medida para móvil, botón de WhatsApp, SEO básico y textos legales.

Web publicada: https://danielduranmoya-spec.github.io/ancora-fisio/

```
ancora-fisio/
├── index.html        ← la web (estructura y textos)
├── style.css         ← estilos: colores, tipografías y espaciado al principio, en :root
├── script.js         ← teléfono, WhatsApp, horario y datos de cada zona del cuerpo (CONFIG y ZONAS)
├── aviso-legal.html  ← plantilla: completa los campos [PENDIENTE]
├── privacidad.html   ← plantilla: completa los campos [PENDIENTE]
├── cookies.html      ← qué guarda la web y qué servicios externos usa
└── favicon.svg
```

## Secciones

1. **Inicio**: titular, llamada a WhatsApp y llamada por teléfono, y la ficha con los «48 h».
2. **Dónde te duele**: maniquí articulado con 5 zonas. Al elegir una zona cambian el texto, las sesiones habituales, el precio y el mensaje de WhatsApp. Funciona con ratón, táctil y teclado (Tab y flechas sobre los botones de zona).
3. **Tarifas**: tabla con precios por sesión (en móvil se convierte en fichas).
4. **Equipo**: dos fisioterapeutas ficticios.
5. **Dudas frecuentes**: acordeón con `<details>`.
6. **Dónde estamos**: dirección, aviso «Abierto ahora / Cerrado» calculado con la hora de Madrid, horario y mapa.

## Abrirla en VS Code

```bash
git clone https://github.com/danielduranmoya-spec/ancora-fisio.git
code ancora-fisio
```

Funciona con doble clic en `index.html`, pero es mejor usar la extensión **Live Server** (clic derecho en `index.html` → *Open with Live Server*) para ver los cambios al guardar.

## Qué cambiar para un cliente real

- **Teléfono y WhatsApp**: `CONFIG` al principio de `script.js`. Los enlaces se actualizan solos. Cambia también el número escrito en `index.html` (aparece como texto de respaldo) y en el JSON-LD del `<head>`.
- **Horario**: `CONFIG.horario` en `script.js` y la tabla `.hours` en `index.html`.
- **Zonas del cuerpo**: objeto `ZONAS` en `script.js`. El panel de la zona Lumbar también está escrito en `index.html` para que se vea sin JavaScript.
- **Colores**: variables de `:root` en `style.css` (`--accent` es el único acento).
- **Dirección y mapa**: texto en `index.html`, coordenadas en el JSON-LD y la URL `CONFIG.mapa` (se genera en openstreetmap.org → Compartir → HTML).
- **Barra superior «Concepto»**: bórrala (`.concept-bar`) en la web de un cliente real.

## Privacidad y cookies

- El mapa de OpenStreetMap solo se carga si la persona lo acepta en el aviso o pulsa «Cargar mapa».
- La elección se guarda en `localStorage` con la clave `ancora-consent`.
- Las tipografías (Instrument Serif, Hanken Grotesk y JetBrains Mono) se cargan desde Google Fonts.

## Publicar cambios

La web se publica con GitHub Pages desde la rama `main` (carpeta raíz). Cada `git push` a `main` actualiza la web en uno o dos minutos.
