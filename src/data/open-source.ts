// Display data for the Open Source section. Products live in `projects.ts`
// and career work in `track-record.ts`; this file only decides what the
// open-source block shows and in what order.

export type SkillEntry = {
  name: string;
  repo: string;
  what: string;
};

export const skillFamily = {
  name: "sshlg-skills",
  repo: "https://github.com/ssheleg/sshlg-skills",
  install: "npx github:ssheleg/sshlg-skills install",
  license: "MIT",
  blurb:
    "The way I take an idea to production — discovery, gated delivery, product marketing, onboarding, retention, search — written down as skills a coding agent follows.",
  skills: [
    {
      name: "task-pipeline",
      repo: "https://github.com/ssheleg/task-pipeline",
      what: "Intake grill that refuses vague work, then nine gated stages from docs and spec to deploy and post-deploy checks.",
    },
    {
      name: "super-ux",
      repo: "https://github.com/ssheleg/super-ux",
      what: "Scenario-driven UX: personas and jobs, flows, screens, scenarios, audits — plus a linter that catches docs drifting from the code.",
    },
    {
      name: "seo-aeo-audit",
      repo: "https://github.com/ssheleg/seo-aeo-audit",
      what: "Evidence-first SEO and AEO/GEO audit: ten tracks, evidence tiers, a dated Google update timeline, and 59 prioritized growth plays.",
      isNew: true,
    },
    {
      name: "make-skill",
      repo: "https://github.com/ssheleg/make-skill",
      what: "Create, retrofit, and ship skills and plugins the proven way, so the toolchain itself stays maintainable.",
    },
    {
      name: "sheleg-design",
      repo: "https://github.com/ssheleg/sheleg-design-skill",
      what: "Cinematic scroll-driven landing and hero design, plus product-UI style packs an agent can apply consistently.",
    },
  ] as (SkillEntry & { isNew?: boolean })[],
  agents: [
    "Claude Code",
    "Cursor",
    "Codex",
    "OpenCode",
    "Gemini CLI",
    "Windsurf",
    "Zed",
    "Kilo",
    "Kimi",
    "Hermes",
    "OpenClaw",
  ],
};

export type PlatformProject = {
  slug: string;
  name: string;
  href: string;
  /** License badge for open-source work, or a status badge for what isn't. */
  badge: string;
  role: string;
  /** Headline figure. Omitted where no verified number is public. */
  metric?: string;
  metricLabel?: string;
  blurb: string;
  links: { label: string; href: string }[];
};

/** The Nicegram platform: the open-source client and the business layer on top. */
export const platformProjects: PlatformProject[] = [
  {
    slug: "nicegram",
    name: "Nicegram",
    href: "https://nicegram.app",
    badge: "GPL-2.0",
    role: "Co-founder · growth",
    metric: "56M+",
    metricLabel: "organic installs",
    blurb:
      "Privacy-first Telegram client with superior UX, open source on iOS, Android, and desktop. Grown to tens of millions of users organically — no paid acquisition.",
    links: [
      { label: "iOS", href: "https://github.com/nicegram/Nicegram-iOS" },
      { label: "Android", href: "https://github.com/nicegram/Nicegram-Android" },
      { label: "Desktop", href: "https://github.com/nicegram/nicegram-desktop" },
    ],
  },
  {
    slug: "nicegram-business",
    name: "Nicegram Business",
    href: "https://business.nicegram.app",
    badge: "EARLY ACCESS",
    role: "Co-founder · product",
    blurb:
      "Nicegram OS — the AI business layer for Telegram-native teams. Company-owned accounts, delegated access, retained chat history, approved AI agents with a controlled context layer, and CRM sync. Revoke a seat and the deals stay with the company.",
    links: [{ label: "business.nicegram.app", href: "https://business.nicegram.app" }],
  },
];
