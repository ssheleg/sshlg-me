// Generate the Open Graph PNG (1200x630) with @resvg/resvg-js. Light,
// techno-minimal — same identity as the site. Idempotent: regenerates only
// when this script is newer than the target (or the target is missing).
import { Resvg } from "@resvg/resvg-js";
import { writeFileSync, statSync, existsSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = resolve(__dirname, "../public");
const scriptPath = resolve(__dirname, "build-og.mjs");

const INK = "#0a0c10";
const MUTED = "#565f6d";
const SUBTLE = "#8b93a1";
const LINE = "#e7e9ee";
const ACCENT = "#1a3cff";

function escapeXml(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function renderSvg({ kicker, line1, line2, footerLeft, footerRight }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
  <defs>
    <pattern id="grid" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
      <path d="M 60 0 L 0 0 0 60" fill="none" stroke="${LINE}" stroke-width="1"/>
    </pattern>
  </defs>

  <rect width="1200" height="630" fill="#ffffff"/>
  <rect width="1200" height="630" fill="url(#grid)"/>

  <g transform="translate(80, 76)">
    <rect x="0" y="0" width="56" height="56" rx="12" fill="${INK}"/>
    <path d="M16 20L26 28L16 36" stroke="#ffffff" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
    <path d="M31 37H43" stroke="${ACCENT}" stroke-width="3.6" stroke-linecap="round" fill="none"/>
    <text x="76" y="26" fill="${INK}" font-family="ui-sans-serif, system-ui, sans-serif" font-size="22" font-weight="600" letter-spacing="-0.02em">Sergey Sheleg</text>
    <text x="76" y="48" fill="${SUBTLE}" font-family="ui-monospace, monospace" font-size="13" letter-spacing="0.14em">SSHLG.ME · WARSAW, PL</text>
  </g>

  <text x="80" y="272" fill="${ACCENT}" font-family="ui-monospace, monospace" font-size="18" letter-spacing="0.18em">${escapeXml(kicker)}</text>

  <text x="80" y="368" fill="${INK}" font-family="ui-sans-serif, system-ui, sans-serif" font-size="76" font-weight="600" letter-spacing="-0.035em">${escapeXml(line1)}</text>
  <text x="80" y="452" fill="${MUTED}" font-family="ui-sans-serif, system-ui, sans-serif" font-size="76" font-weight="600" letter-spacing="-0.035em">${escapeXml(line2)}</text>

  <line x1="80" y1="516" x2="1120" y2="516" stroke="${LINE}" stroke-width="1"/>

  <text x="80" y="560" fill="${INK}" font-family="ui-monospace, monospace" font-size="15" letter-spacing="0.12em">${escapeXml(footerLeft)}</text>
  <text x="1120" y="560" text-anchor="end" fill="${SUBTLE}" font-family="ui-monospace, monospace" font-size="15" letter-spacing="0.12em">${escapeXml(footerRight)}</text>
</svg>`;
}

const pages = [
  {
    out: "og.png",
    kicker: "// TECHNICAL ENTREPRENEUR · WARSAW, PL",
    line1: "Sergey Sheleg.",
    line2: "Still in the code.",
    // No counts here on purpose: the OG image can't import the ledger, so a
    // number baked in would drift the moment an entry is added.
    footerLeft: "13 YEARS SHIPPING PRODUCTS",
    footerRight: "CONTACT@SSHLG.ME",
  },
];

if (!existsSync(publicDir)) mkdirSync(publicDir, { recursive: true });

const scriptMtime = statSync(scriptPath).mtimeMs;
let regenerated = 0;

for (const page of pages) {
  const target = resolve(publicDir, page.out);
  if (existsSync(target) && statSync(target).mtimeMs >= scriptMtime) {
    console.log(`[build-og] ${page.out} is up to date, skipping`);
    continue;
  }
  const png = new Resvg(renderSvg(page), {
    background: "#ffffff",
    fitTo: { mode: "width", value: 1200 },
    font: { loadSystemFonts: true, defaultFontFamily: "Helvetica" },
  })
    .render()
    .asPng();
  writeFileSync(target, png);
  console.log(`[build-og] wrote ${page.out} (${png.byteLength} bytes)`);
  regenerated += 1;
}

console.log(`[build-og] done · regenerated ${regenerated}/${pages.length}`);
