// Point sshlg.me at GitHub Pages and attach the custom domain.
//
// Reads the Cloudflare token from CLOUDFLARE_API_TOKEN or ~/.cloudflare-token
// (chmod 600). The token needs Zone:DNS:Edit on the sshlg.me zone. Nothing is
// printed except record names and outcomes — never the token.
//
//   node scripts/setup-dns.mjs           # apply
//   node scripts/setup-dns.mjs --dry-run # show what would change
import { readFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

const ZONE = "sshlg.me";
const PAGES_HOST = "ssheleg.github.io";
const APEX_IPS = [
  "185.199.108.153",
  "185.199.109.153",
  "185.199.110.153",
  "185.199.111.153",
];

const dryRun = process.argv.includes("--dry-run");

function readToken() {
  if (process.env.CLOUDFLARE_API_TOKEN) return process.env.CLOUDFLARE_API_TOKEN.trim();
  try {
    return readFileSync(join(homedir(), ".cloudflare-token"), "utf8").trim();
  } catch {
    console.error(
      "No token. Set CLOUDFLARE_API_TOKEN, or write it to ~/.cloudflare-token (chmod 600).",
    );
    process.exit(1);
  }
}

const token = readToken();

async function cf(path, init = {}) {
  const res = await fetch(`https://api.cloudflare.com/client/v4${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
  });
  const body = await res.json().catch(() => ({}));
  if (!body.success) {
    const detail = (body.errors ?? []).map((e) => `${e.code} ${e.message}`).join("; ");
    throw new Error(`${init.method ?? "GET"} ${path} failed: ${detail || res.status}`);
  }
  return body.result;
}

const zones = await cf(`/zones?name=${ZONE}`);
if (zones.length === 0) {
  console.error(`Zone ${ZONE} not visible to this token.`);
  process.exit(1);
}
const zoneId = zones[0].id;
console.log(`[dns] zone ${ZONE} ok`);

const existing = await cf(`/zones/${zoneId}/dns_records?per_page=200`);

/** Desired state: four apex A records + www CNAME, all unproxied. */
const desired = [
  ...APEX_IPS.map((ip) => ({ type: "A", name: ZONE, content: ip })),
  { type: "CNAME", name: `www.${ZONE}`, content: PAGES_HOST },
];

for (const want of desired) {
  const match = existing.find(
    (r) => r.type === want.type && r.name === want.name && r.content === want.content,
  );

  if (match) {
    if (match.proxied) {
      // Proxying the apex breaks GitHub's certificate issuance for the domain.
      console.log(`[dns] ${want.type} ${want.name} → ${want.content}: unproxying`);
      if (!dryRun) {
        await cf(`/zones/${zoneId}/dns_records/${match.id}`, {
          method: "PATCH",
          body: JSON.stringify({ proxied: false }),
        });
      }
    } else {
      console.log(`[dns] ${want.type} ${want.name} → ${want.content}: already correct`);
    }
    continue;
  }

  // A stale record of the same type and name pointing elsewhere would keep the
  // domain resolving to the wrong place, so replace rather than add.
  const stale = existing.find(
    (r) => r.type === want.type && r.name === want.name && !desired.some((d) => d.content === r.content),
  );

  if (stale) {
    console.log(`[dns] ${want.type} ${want.name}: replacing ${stale.content} → ${want.content}`);
    if (!dryRun) {
      await cf(`/zones/${zoneId}/dns_records/${stale.id}`, {
        method: "PUT",
        body: JSON.stringify({ ...want, ttl: 1, proxied: false }),
      });
    }
    continue;
  }

  console.log(`[dns] ${want.type} ${want.name} → ${want.content}: creating`);
  if (!dryRun) {
    await cf(`/zones/${zoneId}/dns_records`, {
      method: "POST",
      body: JSON.stringify({ ...want, ttl: 1, proxied: false }),
    });
  }
}

console.log(
  dryRun
    ? "[dns] dry run — nothing changed"
    : "[dns] done. Next: gh api -X PUT repos/ssheleg/sshlg-me/pages -f cname=sshlg.me",
);
