# sshlg.me — personal site

Date: 2026-07-28
Status: approved (owner: Sergey Sheleg)

## Problem

Everything about the person currently lives on svlab.online, a site whose job is
to sell lab work and consulting. There is no place that is simply *him*: the
full project history, the open-source work, the channels he writes in, and the
ways to reach him — without a commercial funnel wrapped around it.

## Goals

1. One page that answers "who is this person, what have they shipped, how do I
   reach them" without scrolling through a services pitch.
2. Carry **every** project, not a curated subset.
3. Contacts as a first-class section: email, Telegram, X, both GitHub accounts,
   and the two Telegram channels he writes in.
4. A look that reads as an engineer's page, not a SaaS landing: clean white
   techno-minimal.
5. Ship on GitHub Pages under the apex domain `sshlg.me`.

## Non-goals

- No blog engine. Writing lives in the Telegram channels; the site links to them.
- No consulting funnel — that stays on svlab.online, one link away.
- No theme toggle. Light is the identity.
- No CMS, no analytics, no third-party scripts.

## Decisions

| Decision | Choice | Why |
|---|---|---|
| Relationship to svlab.online | Personal hub; svlab keeps the business | Avoids duplicate content competing in search; each site has one job |
| Look | Clean white techno-minimal | Owner's call. Reads technical without neon cosplay |
| Theme | Light only | A toggle would dilute the identity for no user gain |
| Stack | Astro 6 + TS, plain CSS | Same toolchain as svlab; no UI framework needed for one page |
| Data | Copy the fact files, this repo is source of truth | Shared package is premature for two consumers |
| Domain | Apex `sshlg.me`, `www` as CNAME | Matches the CNAME file GitHub Pages expects |

## Page spine

`01 Whoami` → `02 Now` → `03 Projects` → `04 Writing` → `05 Contact`

- **Whoami** — prompt line, name as `<h1>`, role, lede, expertise strip, and
  four counters derived from the ledger.
- **Now** — the four live SV Lab projects as cards, then the `sshlg-skills`
  family with its install command and five skills.
- **Projects** — the Nicegram spotlight (56M+ organic installs) followed by the
  full ledger: every entry, newest first, with kind badges, status chips, and
  verified metrics only.
- **Writing** — the two Telegram channels, RU and EN.
- **Contact** — email, Telegram, X, GitHub personal, GitHub org. Email and
  Telegram are marked primary.

## Design system

Tokens at the top of `src/styles/global.css`:

- surface `#ffffff`, subtle `#fafafa`, ink `#0a0c10`, muted `#565f6d`,
  subtle ink `#8b93a1`
- hairlines `#e7e9ee` / `#d3d7de`, accent `#1a3cff`, live `#0f7b4f`
- Geist for headlines, Geist Mono for navigation, labels, metrics, identifiers
- no gradients, no shadows; hierarchy comes from density and hairlines

Shared primitives: `.section-index` (`01 ── WHOAMI` with a rule to the edge),
`.term` (prompt line), `.chip-live` / `.chip-early` / `.chip-archived` /
`.chip-kind`, `.tag`, `.btn`.

## Data model

`src/data/ledger.ts` merges `projects.ts` and `track-record.ts` into one ordered
list with `kind` (`ai-product` | `open-source` | `work`), optional `metric`, and
optional `status: "early-access"`. `ledgerStats` derives total, live, and years;
the page never hardcodes a count.

Early access is excluded from the live count — "still live" must keep meaning
generally available.

## Verification

`scripts/check-site.mjs`, zero dependencies, wired into `npm run build`:

1. expected pages emitted
2. required strings present: name, `contact@sshlg.me`, `@sshlg93`, `@sshlg`,
   `@She_La_Ve`, `@TheTelegate`, both GitHub URLs, the svlab link
3. section labels in order, indices exactly `01..05`
4. every internal link resolves to a real page and a real anchor
5. JSON-LD parses; a `Person` block names Sergey Sheleg
6. exactly one `<h1>` per page

## Rollout

GitHub Pages via `.github/workflows/deploy.yml` on push to `main`. `public/CNAME`
pins `sshlg.me`. Cloudflare DNS needs the four GitHub Pages A records plus a
`www` CNAME, all **DNS only** — proxying the apex breaks certificate issuance.

`contact@sshlg.me` requires Email Routing on the zone. The site publishes the
address; provisioning the mailbox is a separate, human step.

## Risks

- **Data drift between the two sites.** Mitigated by naming this repo the source
  of truth in both READMEs. If it keeps hurting, extract a shared package.
- **Duplicate-content dilution.** Mitigated by the split: person-level content
  here, commercial content on svlab, cross-linked rather than mirrored.
- **Apex + Cloudflare proxy.** Documented explicitly; the grey-cloud requirement
  is the usual failure mode for this setup.
