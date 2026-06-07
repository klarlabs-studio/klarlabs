export type ProductTheme = 'dark' | 'light';
export type ProductStatus = 'live' | 'beta' | 'coming-soon';

export interface ProductFeature {
  heading: string;
  body: string;
}

export interface Product {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  theme: ProductTheme;
  accent: string;
  status: ProductStatus;
  problem: string;
  solution: string;
  features: ProductFeature[];
  ctaHref?: string;
  ctaLabel?: string;
}

/**
 * Product inventory — Design System v2.
 * Copy marked DRAFT pending review by Felix.
 */
export const products: Product[] = [
  {
    slug: 'obvia',
    name: 'Obvia',
    tagline: 'Observability that explains itself.',
    description: 'Observability that explains itself.',
    theme: 'dark',
    accent: '#6366F1',
    status: 'live',
    problem:
      'Modern systems emit more telemetry than any team can read. Dashboards show what happened — rarely why.',
    solution:
      'Obvia turns raw signals into explanations. Correlated traces, metrics, and logs with the reasoning attached — so the on-call engineer starts at the answer, not the search bar.',
    features: [
      { heading: 'Explained incidents', body: 'Every alert arrives with correlated context and a probable cause, not just a red line.' },
      { heading: 'OpenTelemetry-native', body: 'Standard OTLP ingest. No agents to babysit, no vendor lock-in.' },
      { heading: 'Self-hosted option', body: 'Your telemetry stays your telemetry. Run it on your own infrastructure.' },
    ],
    ctaHref: 'https://obvia.felixgeelhaar.de',
    ctaLabel: 'Open Obvia',
  },
  {
    slug: 'pet-medical',
    name: 'Pet Medical',
    tagline: 'Lifetime health intelligence for your pet.',
    description: 'Lifetime health intelligence for your pet.',
    theme: 'light',
    accent: '#0EA5E9',
    status: 'live',
    problem:
      'Pet health records live in paper folders, vet portals, and memory. When it matters most, the history is incomplete.',
    solution:
      'Pet Medical keeps the full medical life of your pet in one place — vaccinations, medications, lab results, and visits — readable by you and shareable with any vet.',
    features: [
      { heading: 'Complete history', body: 'Every visit, vaccine, and prescription in one timeline — from first checkup onward.' },
      { heading: 'Share with any vet', body: 'Hand over a complete, structured history in seconds. No faxes, no folders.' },
      { heading: 'Reminders that matter', body: 'Boosters, checkups, and medication schedules — surfaced before they are due.' },
    ],
  },
  {
    slug: 'brotwerk',
    name: 'Brotwerk',
    tagline: 'Serious tools for serious bread.',
    description: 'Recipes, schedules, and dough math for ambitious home bakers.',
    theme: 'light',
    accent: '#D97706',
    status: 'live',
    problem:
      'Good bread is timing, ratios, and repetition. Notes apps and spreadsheets lose the details that make a bake repeatable.',
    solution:
      'Brotwerk handles the dough math — hydration, levain builds, timing schedules — so every successful bake can be repeated and refined.',
    features: [
      { heading: 'Dough calculator', body: "Baker's percentages, hydration, and scaling — computed, not guessed." },
      { heading: 'Bake schedules', body: 'Work backwards from when you want bread to when you need to start.' },
      { heading: 'Bake journal', body: 'Track what changed between bakes and keep what worked.' },
    ],
  },
  {
    slug: 'iri',
    name: 'IRI — KraftSport Coach',
    tagline: 'Strength programming, engineered.',
    description: 'Programming, progression, and analysis for strength athletes.',
    theme: 'light',
    accent: '#0D9488',
    status: 'live',
    problem:
      'Strength progress stalls when programming is guesswork. Spreadsheets do not understand fatigue, RPE, or periodisation.',
    solution:
      'IRI plans and adapts strength training — progression schemes, load management, and analysis built on how strength is actually trained.',
    features: [
      { heading: 'Adaptive programming', body: 'Plans that respond to logged performance, not a static spreadsheet.' },
      { heading: 'Load management', body: 'RPE and volume tracking that flags overreach before it costs a week.' },
      { heading: 'Progress analysis', body: 'Estimated 1RMs, trends, and PRs — clearly visualised.' },
    ],
    ctaHref: 'https://kraftsport-coach.de',
    ctaLabel: 'Open KraftSport Coach',
  },
  {
    slug: 'nox',
    name: 'Nox',
    tagline: 'Security findings you can act on.',
    description: 'Code and dependency security scanning built for AI-assisted teams.',
    theme: 'dark',
    accent: '#EF4444',
    status: 'live',
    problem:
      'Security scanners produce noise. Hundreds of findings, no priorities, and no connection to how the code actually ships.',
    solution:
      'Nox scans code, dependencies, and supply chain — then ranks what is real, explains why, and plugs into AI coding agents via MCP so issues get fixed where they are written.',
    features: [
      { heading: 'Signal over noise', body: 'Findings ranked by exploitability and reach — with baselines for accepted risk.' },
      { heading: 'SBOM + supply chain', body: 'Know what you ship: SBOM generation, dependency analysis, VEX status.' },
      { heading: 'MCP-native', body: 'Claude Code, Cursor, and other agents query findings and fix plans directly.' },
    ],
  },
  {
    slug: 'armada',
    name: 'Armada',
    tagline: 'Developer workflow tooling for Atlassian.',
    description: 'Developer workflow tooling on the Atlassian Marketplace.',
    theme: 'dark',
    accent: '#0D9488',
    status: 'live',
    problem:
      'Engineering reality and Jira drift apart. Keeping boards honest is manual work nobody wants.',
    solution:
      'Armada keeps developer workflows and Atlassian tools in sync — less ceremony, more signal.',
    features: [
      { heading: 'Marketplace-native', body: 'Installs from the Atlassian Marketplace into your existing setup.' },
      { heading: 'Workflow automation', body: 'The repetitive board work, automated.' },
      { heading: 'Built for engineers', body: 'Designed around how development actually flows.' },
    ],
    ctaHref: 'https://marketplace.atlassian.com',
    ctaLabel: 'View on Marketplace',
  },
  {
    slug: 'nexa',
    name: 'Nexa',
    tagline: 'Coming soon.',
    description: 'In development.',
    theme: 'light',
    accent: '#8B5CF6',
    status: 'coming-soon',
    problem: '',
    solution: 'Nexa is in development. Details soon.',
    features: [],
  },
  {
    slug: 'lexora',
    name: 'Lexora',
    tagline: 'Coming soon.',
    description: 'In development.',
    theme: 'light',
    accent: '#0D9488',
    status: 'coming-soon',
    problem: '',
    solution: 'Lexora is in development. Details soon.',
    features: [],
  },
];

export interface OssLibrary {
  name: string;
  description: string;
  repoHref: string;
  docsHref?: string;
  docsLabel?: string;
}

const gh = (repo: string) => `https://github.com/klarlabs-studio/${repo}`;
const godoc = (repo: string) => `https://pkg.go.dev/github.com/klarlabs-studio/${repo}`;

export const ossLibraries: OssLibrary[] = [
  { name: 'agent-go', description: 'State-driven AI agent runtime for Go.', repoHref: gh('agent-go'), docsHref: godoc('agent-go'), docsLabel: 'pkg.go.dev' },
  { name: 'mcp-go', description: 'Go framework for building MCP servers.', repoHref: gh('mcp-go'), docsHref: godoc('mcp-go'), docsLabel: 'pkg.go.dev' },
  { name: 'fortify', description: 'Resilience patterns for Go + LLM services.', repoHref: gh('fortify'), docsHref: godoc('fortify'), docsLabel: 'pkg.go.dev' },
  { name: 'fortify-ts', description: 'Production-grade fault tolerance for TypeScript.', repoHref: gh('fortify-ts') },
  { name: 'axi-go', description: 'Safe, auditable execution kernel for AI agent tools.', repoHref: gh('axi-go'), docsHref: godoc('axi-go'), docsLabel: 'pkg.go.dev' },
  { name: 'statekit', description: 'Go-native statecharts, XState-JSON compatible.', repoHref: gh('statekit'), docsHref: godoc('statekit'), docsLabel: 'pkg.go.dev' },
  { name: 'bolt', description: "Go logging that solves the Logger's Trilemma.", repoHref: gh('bolt'), docsHref: godoc('bolt'), docsLabel: 'pkg.go.dev' },
  { name: 'scout', description: 'Browser automation. One binary, no Node, no Python.', repoHref: gh('scout') },
  { name: 'mnemos', description: 'Self-hosted memory + evidence layer for AI agents.', repoHref: gh('mnemos') },
  { name: 'coverctl', description: 'Domain-aware test coverage enforcement.', repoHref: gh('coverctl') },
  { name: 'briefkasten', description: 'Email retrieval and sending as an MCP server.', repoHref: gh('briefkasten') },
  { name: 'chronos', description: 'Time-series pattern detection — the temporal layer of the agent cognitive stack.', repoHref: 'https://github.com/felixgeelhaar/chronos', docsHref: 'https://pkg.go.dev/github.com/felixgeelhaar/chronos', docsLabel: 'pkg.go.dev' },
];
