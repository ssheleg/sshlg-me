export const site = {
  name: "Sergey Sheleg",
  // Registered transliteration. Kept in schema.org `alternateName` so both
  // spellings resolve in search.
  nameAlternate: "Siarhei Sheleh",
  role: "Technical entrepreneur · products used by millions",
  url: "https://sshlg.me",
  email: "contact@sshlg.me",
  location: "Warsaw, Poland",
  locality: "Warsaw",
  countryCode: "PL",
  // Both literals, not derived from the build date: a build-time
  // `getFullYear()` makes the output non-reproducible. Review together yearly.
  shippingSince: 2013,
  yearsExperience: 13,
  availability: "AVAILABLE",
  availabilityDetail: "Available for consulting",
  description:
    "Sergey Sheleg — technical entrepreneur in Warsaw, Poland. 13 years building and launching products used by millions: AI integrations and agent systems, marketing and research tooling, growth and retention mechanics, and the go-to-market that puts them in front of users.",
  expertise: [
    "Product engineering",
    "AI integrations",
    "Agent systems",
    "Marketing & research tools",
    "Growth & retention",
    "Go-to-market",
  ],
  /** The lab this person ships under. Consulting lives there, not here. */
  lab: {
    name: "SV Lab",
    url: "https://svlab.online",
    consultingUrl: "https://svlab.online/consulting",
  },
} as const;

export type Contact = {
  label: string;
  handle: string;
  href: string;
  note: string;
  /** Primary channels are surfaced first and get the emphasized treatment. */
  primary?: boolean;
};

export const contacts: Contact[] = [
  {
    label: "Email",
    handle: "contact@sshlg.me",
    href: "mailto:contact@sshlg.me",
    note: "Anything that needs a real answer.",
    primary: true,
  },
  {
    label: "Telegram",
    handle: "@sshlg",
    href: "https://t.me/sshlg",
    note: "Quick things.",
    primary: true,
  },
  {
    label: "X",
    handle: "@sshlg93",
    href: "https://x.com/sshlg93",
    note: "Short posts.",
  },
  {
    label: "LinkedIn",
    handle: "sergey-sheleg",
    href: "https://www.linkedin.com/in/sergey-sheleg-02579692/",
    note: "Work history.",
  },
  {
    label: "GitHub",
    handle: "@sshlg",
    href: "https://github.com/sshlg",
    note: "Personal account.",
  },
  {
    label: "GitHub org",
    handle: "@ssheleg",
    href: "https://github.com/ssheleg",
    note: "Projects and the skills.",
  },
];

export type Channel = {
  name: string;
  handle: string;
  href: string;
  language: string;
  about: string;
};

/** Telegram channels I actually write in. */
export const channels: Channel[] = [
  {
    name: "She La Ve",
    handle: "@She_La_Ve",
    href: "https://t.me/She_La_Ve",
    language: "RU",
    about: "In Russian. Products, AI, and what running them actually costs.",
  },
  {
    name: "The Telegate",
    handle: "@TheTelegate",
    href: "https://t.me/TheTelegate",
    language: "EN",
    about: "In English. Same subjects, wider room.",
  },
];
