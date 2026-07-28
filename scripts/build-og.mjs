// Generate the Open Graph image (1200x630) from the banner illustration in
// assets/, with the name and handle set over the empty left half. Idempotent:
// regenerates only when this script or the banner is newer than the output.
import { Resvg } from "@resvg/resvg-js";
import { readFileSync, writeFileSync, statSync, existsSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = resolve(__dirname, "../public");
const scriptPath = resolve(__dirname, "build-og.mjs");
const bannerPath = resolve(__dirname, "../assets/banner.png");
const target = resolve(publicDir, "og.png");

const W = 1200;
const H = 630;

// The banner is 2172x724 (aspect 3.0) and the subject sits on its right side.
// Cover 1200x630 (aspect 1.905) by scaling to height and pulling the crop
// window to the right, so the figure stays in frame instead of being centred
// out of it.
const SRC_W = 2172;
const SRC_H = 724;
const scale = H / SRC_H;
const scaledW = SRC_W * scale;
// 0 = crop from the left edge, 1 = from the right. The figure is right-of-centre.
const FOCUS = 0.6;
const offsetX = -(scaledW - W) * FOCUS;

const banner = readFileSync(bannerPath).toString("base64");

const svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
  <defs>
    <linearGradient id="scrim" x1="0" y1="0" x2="${W}" y2="0" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#000000" stop-opacity="0.92"/>
      <stop offset="50%" stop-color="#000000" stop-opacity="0.78"/>
      <stop offset="76%" stop-color="#000000" stop-opacity="0"/>
    </linearGradient>
  </defs>

  <rect width="${W}" height="${H}" fill="#000000"/>
  <image href="data:image/png;base64,${banner}" x="${offsetX}" y="0" width="${scaledW}" height="${H}" preserveAspectRatio="none"/>
  <rect width="${W}" height="${H}" fill="url(#scrim)"/>

  <text x="72" y="250" fill="#ffffff" font-family="ui-monospace, monospace" font-size="17" letter-spacing="0.2em">SSHLG.ME</text>

  <text x="72" y="342" fill="#ffffff" font-family="ui-sans-serif, system-ui, sans-serif" font-size="74" font-weight="600" letter-spacing="-0.035em">Sergey Sheleg</text>

  <text x="72" y="392" fill="#c8ccd4" font-family="ui-sans-serif, system-ui, sans-serif" font-size="25" letter-spacing="-0.01em">Technical entrepreneur · Warsaw, PL</text>

  <rect x="72" y="438" width="470" height="1" fill="rgba(255,255,255,0.25)"/>

  <text x="72" y="486" fill="#9aa2ae" font-family="ui-monospace, monospace" font-size="16" letter-spacing="0.12em">13 YEARS SHIPPING PRODUCTS</text>
  <text x="72" y="518" fill="#9aa2ae" font-family="ui-monospace, monospace" font-size="16" letter-spacing="0.12em">CONTACT@SSHLG.ME</text>
</svg>`;

if (!existsSync(publicDir)) mkdirSync(publicDir, { recursive: true });

const newestInput = Math.max(
  statSync(scriptPath).mtimeMs,
  statSync(bannerPath).mtimeMs,
);

if (existsSync(target) && statSync(target).mtimeMs >= newestInput) {
  console.log("[build-og] og.png is up to date, skipping");
} else {
  const png = new Resvg(svg, {
    background: "#000000",
    fitTo: { mode: "width", value: W },
    font: { loadSystemFonts: true, defaultFontFamily: "Helvetica" },
  })
    .render()
    .asPng();
  writeFileSync(target, png);
  console.log(`[build-og] wrote og.png (${png.byteLength} bytes)`);
}
