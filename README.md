# sshlg.me

Personal site of **Sergey Sheleg** (registered as Siarhei Sheleh) — technical
entrepreneur in Warsaw, Poland. One page: who I am, what I'm building, every
product I've shipped, where I write, and how to reach me.

Commercial work — consulting, advisory, forward deployment — lives on
[svlab.online](https://svlab.online). This site links there; it doesn't
duplicate it.

- **Stack:** [Astro 6](https://astro.build) · TypeScript · plain CSS (no UI framework)
- **Hosting:** GitHub Pages (static) on the apex domain `sshlg.me`
- **DNS:** Cloudflare
- **Contact:** `contact@sshlg.me`

---

## Local development

```bash
nvm use            # Node 22 (see .nvmrc)
npm install
npm run dev        # http://localhost:4321
```

Other scripts:

```bash
npm run build      # type-check, regenerate the OG PNG, build to ./dist, verify
npm run check      # verify ./dist on its own (scripts/check-site.mjs)
npm run preview    # preview the production build locally
```

## Page spine

The home page runs one numbered spine. `scripts/check-site.mjs` fails the build
if the order or numbering changes without the check being updated.

| # | Section | What it holds |
|---|---------|---------------|
| 01 | Whoami | Name, role, expertise strip, counters derived from the ledger |
| 02 | Now | The four live SV Lab projects + the `sshlg-skills` family |
| 03 | Projects | Nicegram spotlight + the full ledger of everything shipped |
| 04 | Writing | The two Telegram channels (RU + EN) |
| 05 | Contact | Email, Telegram, X, both GitHub accounts |

## Design

Clean white techno-minimal, light only — no theme toggle, by design.

- `#ffffff` page, `#0a0c10` ink, `#e7e9ee` hairlines, one accent `#1a3cff`
- Grotesk (Geist) for headlines, monospace (Geist Mono) for navigation, labels,
  metrics, and identifiers
- No gradients, no shadows. Structure comes from density, hairlines, and
  monospace — not decoration.

Tokens live at the top of `src/styles/global.css`; components carry their own
scoped styles.

## Data

```
src/data/
  site.ts          # identity, contacts, Telegram channels, lab link
  projects.ts      # live SV Lab projects (cards in section 02)
  track-record.ts  # everything shipped before/alongside them
  open-source.ts   # the Nicegram platform + the sshlg-skills family
  ledger.ts        # one ordered view over projects + track record
```

Counts shown on the page (`11 products`, `7 running`, `13 years`) come from
`ledgerStats` — never hardcoded — so adding an entry can't desync the copy.

**Source of truth.** `projects.ts`, `track-record.ts`, and `open-source.ts` are
mirrored on svlab.online. Person-level facts change **here first**, then get
ported. If the two drift often enough to hurt, extract a shared package.

## Verification

`scripts/check-site.mjs` runs as part of `npm run build`:

1. every expected page is emitted
2. required identity and contact strings are present (name, email, every handle)
3. the section spine appears in order with indices `01..05`
4. every internal link resolves to a real page and a real anchor
5. the JSON-LD parses and carries `Person` = Sergey Sheleg
6. exactly one `<h1>` per page

Failures print `page → reason` and exit non-zero, so CI blocks the deploy.

## Deploy

Push to `main` → GitHub Actions builds with `withastro/action` and publishes to
GitHub Pages. `public/CNAME` pins the apex domain.

DNS (Cloudflare, zone `sshlg.me`) needs the GitHub Pages apex records:

```
A     sshlg.me  185.199.108.153
A     sshlg.me  185.199.109.153
A     sshlg.me  185.199.110.153
A     sshlg.me  185.199.111.153
CNAME www       ssheleg.github.io
```

Proxy status must be **DNS only** (grey cloud) — proxying the apex breaks
GitHub's certificate issuance for the custom domain.

`npm run dns` applies exactly those records. It reads the Cloudflare token from
`CLOUDFLARE_API_TOKEN` or `~/.cloudflare-token` (needs Zone:DNS:Edit on the
zone), is idempotent, un-proxies anything proxied, and never prints the token.
Add `--dry-run` to see the diff first.

`contact@sshlg.me` needs Cloudflare Email Routing (or equivalent) on the same
zone; the site publishes the address but does not provision the mailbox.

---

© Sergey Sheleg (Siarhei Sheleh), Poland.
