// Post-build verification of dist/. Zero dependencies, runs as part of
// `npm run build` so CI fails on a regression instead of shipping one.
//
//   1. every expected page was emitted
//   2. required identity and contact strings are present
//   3. the section spine appears in order with indices 01..05
//   4. every internal link resolves to a real page and a real anchor
//   5. the JSON-LD parses and carries the right Person
//   6. exactly one <h1> per page
import { readdirSync, readFileSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve, relative, sep } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = resolve(__dirname, "../dist");

const NAME = "Sergey Sheleg";
const EXPECTED_PAGES = ["/"];

const REQUIRED = [
  NAME,
  "contact@sshlg.me",
  "@sshlg93",
  "linkedin.com/in/sergey-sheleg",
  "@She_La_Ve",
  "@TheTelegate",
  "github.com/ssheleg",
  "github.com/sshlg",
  "svlab.online",
];

const SECTION_ORDER = ["Whoami", "Toolkit", "Projects", "Writing", "Contact"];

const failures = [];
const fail = (where, why) => failures.push(`${where} → ${why}`);

function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...walk(full));
    else if (entry.endsWith(".html")) out.push(full);
  }
  return out;
}

/** dist/index.html → / ; dist/404.html → /404 ; dist/x/index.html → /x */
function routeOf(file) {
  const rel = relative(distDir, file).split(sep).join("/");
  if (rel === "index.html") return "/";
  if (rel.endsWith("/index.html")) return `/${rel.slice(0, -"/index.html".length)}`;
  return `/${rel.slice(0, -".html".length)}`;
}

let files;
try {
  files = walk(distDir);
} catch {
  console.error(`[check-site] dist/ not found at ${distDir} — build first.`);
  process.exit(1);
}

const pages = new Map();
for (const file of files) {
  const html = readFileSync(file, "utf8");
  const ids = new Set();
  for (const m of html.matchAll(/\sid="([^"]+)"/g)) ids.add(m[1]);
  pages.set(routeOf(file), { file, html, ids });
}

for (const route of EXPECTED_PAGES) {
  if (!pages.has(route)) fail(route, "page missing from dist/");
}

for (const [route, page] of pages) {
  const { html } = page;

  if (route === "/") {
    for (const need of REQUIRED) {
      if (!html.includes(need)) fail(route, `missing required string "${need}"`);
    }

    // Section spine, in order.
    let cursor = -1;
    for (const label of SECTION_ORDER) {
      const at = html.indexOf(`>${label}<`, cursor + 1);
      if (at === -1) {
        fail(route, `section label "${label}" missing or out of order`);
        break;
      }
      cursor = at;
    }

    const nums = [...html.matchAll(/<span class="num"[^>]*>(\d+)<\/span>/g)].map(
      (m) => m[1],
    );
    const expected = SECTION_ORDER.map((_, i) => String(i + 1).padStart(2, "0"));
    if (nums.join(",") !== expected.join(",")) {
      fail(route, `section numbers are [${nums}], expected [${expected}]`);
    }
  } else if (!html.includes(NAME)) {
    fail(route, `missing required string "${NAME}"`);
  }

  const blocks = [
    ...html.matchAll(
      /<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g,
    ),
  ];
  if (blocks.length === 0) fail(route, "no JSON-LD blocks");
  let hasPerson = false;
  for (const [, raw] of blocks) {
    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch (err) {
      fail(route, `JSON-LD does not parse: ${err.message}`);
      continue;
    }
    if (parsed["@type"] === "Person") {
      hasPerson = true;
      if (parsed.name !== NAME) {
        fail(route, `Person schema name is "${parsed.name}", expected "${NAME}"`);
      }
    }
  }
  if (!hasPerson) fail(route, "no Person JSON-LD block");

  const h1s = [...html.matchAll(/<h1[\s>]/g)].length;
  if (h1s !== 1) fail(route, `expected exactly 1 <h1>, found ${h1s}`);
}

for (const [route, page] of pages) {
  for (const [, href] of page.html.matchAll(/\shref="([^"]+)"/g)) {
    if (/^(https?:|mailto:|tel:|data:)/.test(href)) continue;

    const [rawPath, anchor] = href.split("#");
    let targetRoute = rawPath === "" ? route : rawPath;
    if (targetRoute.length > 1 && targetRoute.endsWith("/")) {
      targetRoute = targetRoute.slice(0, -1);
    }
    if (!targetRoute.startsWith("/")) continue;

    const target = pages.get(targetRoute);
    const isAsset = /\.[a-z0-9]{2,4}$/i.test(targetRoute);
    if (!target) {
      if (!isAsset) fail(route, `link "${href}" points to a missing page`);
      continue;
    }
    if (anchor && !target.ids.has(anchor)) {
      fail(route, `link "${href}" points to a missing anchor #${anchor}`);
    }
  }
}

if (failures.length) {
  console.error(`[check-site] ${failures.length} problem(s):`);
  for (const f of failures) console.error(`  ✗ ${f}`);
  process.exit(1);
}

console.log(`[check-site] ok — ${pages.size} pages checked`);
