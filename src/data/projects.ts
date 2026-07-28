export type Project = {
  slug: string;
  name: string;
  domain: string;
  url: string;
  yearStart: number;
  yearEnd: number | "present";
  status: "live" | "archived" | "in-development";
  category: string;
  tagline: string;
  description: string;
  highlights: string[];
  stack: string[];
  accent: "cyan" | "lime" | "violet";
};

export const projects: Project[] = [
  {
    slug: "prowl",
    name: "Prowl",
    domain: "prowl.chat",
    url: "https://prowl.chat",
    yearStart: 2025,
    yearEnd: "present",
    status: "live",
    category: "Agent intelligence · MCP",
    tagline: "One MCP endpoint. 408 market-intelligence tools for your agents.",
    description:
      "The research layer for coding agents. Connect one MCP to Cursor, Claude Code, Codex — or any MCP client — and the agent can call 408 SEO, ads, SERP, review, and market-data tools with real numbers, cross-referenced into a 12-module strategy report shipped as an interactive brief, infographic, PDF, deck, and video. Billed per call from a USD wallet, with a $5 starter credit.",
    highlights: [
      "408 intelligence tools behind one endpoint — SEO, ads, SERP, reviews, trends",
      "12 modules to a sourced brief in ~10 minutes, in 5 output formats",
      "Pay-per-call wallet with per-key scopes, spend caps, and IP allowlists",
    ],
    stack: ["MCP", "TypeScript", "Next.js", "LLM orchestration", "Stripe"],
    accent: "cyan",
  },
  {
    slug: "checkmydata",
    name: "CheckMyData",
    domain: "checkmydata.ai",
    url: "https://checkmydata.ai",
    yearStart: 2025,
    yearEnd: "present",
    status: "live",
    category: "Open-source · NL → SQL",
    tagline: "ChatGPT for your database.",
    description:
      "Open-source, MIT-licensed agent that turns plain-English questions into queries, executes them across PostgreSQL, MySQL, ClickHouse, and MongoDB, and explains results with auto-generated charts. Privacy-first by design and fully self-hostable.",
    highlights: [
      "Multi-DB: PostgreSQL · MySQL · ClickHouse · MongoDB",
      "Indexes your codebase so queries match real business logic",
      "MIT-licensed, self-hostable, zero telemetry",
    ],
    stack: ["TypeScript", "Postgres", "Docker", "LLM agents", "Open source"],
    accent: "lime",
  },
  {
    slug: "privateclawd",
    name: "PrivateClawd",
    domain: "privateclawd.com",
    url: "https://privateclawd.com",
    yearStart: 2025,
    yearEnd: "present",
    status: "live",
    category: "AI agent cloud",
    tagline: "Your first AI employee, deployed in 60 seconds.",
    description:
      "Managed cloud for OpenClaw AI agents. Each customer gets an isolated VM with browser automation, code execution, multi-channel messaging (Telegram, WhatsApp, Discord, Slack, web), built-in budget guardrails, and prompt-injection defense — no servers, no DevOps.",
    highlights: [
      "60-second deploy on dedicated, isolated VMs — 24/7 uptime",
      "Token caps, loop detection, auto-pause — no runaway bills",
      "Prompt-injection & link-preview exfiltration defense built-in",
    ],
    stack: ["Cloud orchestration", "Docker", "OpenClaw", "Stripe", "Edge"],
    accent: "violet",
  },
];

export function formatYears(p: Project): string {
  if (p.yearEnd === "present") return `${p.yearStart} → Present`;
  if (p.yearStart === p.yearEnd) return `${p.yearStart}`;
  return `${p.yearStart} → ${p.yearEnd}`;
}
