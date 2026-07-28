export type TrackItem = {
  slug: string;
  name: string;
  domain?: string;
  url?: string;
  yearStart: number;
  yearEnd: number | "present";
  role: string;
  blurb: string;
  tags: string[];
  /**
   * Headline number for the row, e.g. "56M+ organic installs". Only set it
   * where the figure is verified — an empty cell reads better than a guess.
   */
  metric?: string;
  /**
   * Overrides the derived LIVE/ARCHIVED chip. Set it where "in market" would
   * overstate things — early access is not the same as generally available,
   * and it is excluded from the live count.
   */
  status?: "early-access";
};

export const trackRecord: TrackItem[] = [
  {
    slug: "degenphone",
    name: "Degenphone",
    domain: "degenphone.xyz",
    url: "https://degenphone.xyz",
    yearStart: 2025,
    yearEnd: "present",
    role: "Co-founder · build · GTM",
    blurb: "NFT-backed eSIM phone numbers for Web3 users.",
    tags: ["web3", "esim"],
  },
  {
    slug: "nicegram-business",
    name: "Nicegram Business",
    domain: "business.nicegram.app",
    url: "https://business.nicegram.app",
    yearStart: 2026,
    yearEnd: "present",
    role: "Co-founder · product",
    blurb:
      "Nicegram OS — the AI business layer for Telegram-native teams: company-owned accounts, delegated access, retained chat history, approved AI agents, CRM sync. In early access.",
    tags: ["b2b", "ai-agents", "telegram"],
    status: "early-access",
  },
  {
    slug: "nicegram",
    name: "Nicegram",
    domain: "nicegram.app",
    url: "https://nicegram.app",
    yearStart: 2021,
    yearEnd: "present",
    role: "Co-founder · growth",
    blurb: "Privacy-first Telegram client with superior UX. Open source on iOS, Android, and desktop.",
    tags: ["messaging", "privacy", "open source"],
    metric: "56M+ organic installs",
  },
  {
    slug: "whatplantisthis",
    name: "WhatPlantIsThis",
    domain: "whatplantisthis.io",
    url: "https://whatplantisthis.io",
    yearStart: 2021,
    yearEnd: 2025,
    role: "Co-founder · product",
    blurb: "Botany meets ML — visual plant identification for enthusiasts.",
    tags: ["computer-vision", "consumer"],
  },
  {
    slug: "esimplus",
    name: "eSIM Plus",
    domain: "esimplus.me",
    url: "https://esimplus.me",
    yearStart: 2020,
    yearEnd: "present",
    role: "Co-founder · product",
    blurb: "Global mobile connectivity for travelers.",
    tags: ["esim", "travel"],
  },
  {
    slug: "ultimate-guitar",
    name: "Muse (Ultimate Guitar)",
    domain: "ultimate-guitar.com",
    url: "https://ultimate-guitar.com",
    yearStart: 2015,
    yearEnd: 2020,
    role: "Product · growth · monetization",
    blurb: "Built and monetized the Ultimate Guitar mobile apps and launched an AI-powered learning product for the world's largest musician platform.",
    tags: ["consumer", "music", "ai-learning"],
    // "users", not "MAU": the public Muse Group figure is total users, and the
    // narrower claim is the one that survives a buyer checking it.
    metric: "350M+ users · #1 platform for musicians",
  },
  {
    slug: "product-developer",
    name: "Product Developer",
    yearStart: 2013,
    yearEnd: 2015,
    role: "Product developer",
    blurb: "Built products for industry players in tech, agro, AI, and hardware.",
    tags: ["agency", "0-to-1"],
  },
];

export function formatTrackYears(t: TrackItem): string {
  if (t.yearEnd === "present") return `${t.yearStart} → Present`;
  if (t.yearStart === t.yearEnd) return `${t.yearStart}`;
  return `${t.yearStart} → ${t.yearEnd}`;
}
