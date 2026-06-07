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
    tagline: 'Predict incidents before they happen.',
    description: 'AI-powered incident prediction and governed auto-remediation.',
    theme: 'dark',
    accent: '#6366F1',
    status: 'live',
    problem:
      'Operations teams react. Telemetry piles up in dashboards, anomalies surface as outages, and remediation is a 3 a.m. runbook under pressure.',
    solution:
      'Obvia sits on the observability stack you already pay for — Datadog, Prometheus, OpenSearch — detects anomalies, predicts outages, and remediates under explicit governance. Workflows graduate from draft to shadow to auto-execution only after the evaluation harness clears them.',
    features: [
      { heading: 'Pattern detection', body: 'Threshold, error-rate, and trend detectors with calibration and confidence scoring — over-confident detectors stay out of the queue.' },
      { heading: 'Governed remediation', body: 'Runtime Policy Language gates every action by confidence, blast radius, scope, and environment. Operators stay in the loop until the loop is proven.' },
      { heading: 'Blast-path topology', body: 'Walks the service dependency graph to surface every downstream service an incident will touch — before approval.' },
      { heading: 'Multi-agent fleet', body: 'Pipeline-scoped agents own slices of the topology, each with its own tool allowlist and scope filter.' },
    ],
    ctaHref: 'https://obvia.klarlabs.de',
    ctaLabel: 'Open Obvia',
  },
  {
    slug: 'pet-medical',
    name: 'Pet Medical',
    tagline: 'Calm health intelligence for your pet.',
    description: 'See your pet’s health drift months before the next vet visit.',
    theme: 'light',
    accent: '#0EA5E9',
    status: 'live',
    problem:
      'A lab value looks fine in isolation, but you sense something has changed. Records live in PDFs, notebooks, and memory — and most pet apps just wrap an LLM around your data and call it a diagnosis.',
    solution:
      'Pet Medical watches lab values, weight, and behavior over months with a deterministic signal engine — built for chronic-condition and senior animals. Thor, your animal’s AI helper, explains what changed and what to do next. Calm framing, transparent confidence, never a diagnosis.',
    features: [
      { heading: 'Deterministic, not generative', body: 'Seven signal types — thresholds, drift, baseline deviation, persistence, and more. Every concern reproducible from the same inputs; Thor explains, never invents.' },
      { heading: 'No red alerts. Ever.', body: 'Five severity tiers and language that names what changed without naming what could go wrong.' },
      { heading: 'Vet prep briefs', body: 'A 30-second summary of active concerns, recent changes, and suggested questions — shareable as PDF or secure link.' },
      { heading: 'EU-hosted, GDPR-first', body: 'Your data is never sold, never used for AI training.' },
    ],
    ctaHref: 'https://pet-medical.de',
    ctaLabel: 'Open Pet Medical',
  },
  {
    slug: 'brotwerk',
    name: 'Brotwerk',
    tagline: 'Daily AI coaching for your sourdough.',
    description: 'A photo, a verdict, a tip — daily AI companionship for real sourdough.',
    theme: 'light',
    accent: '#D97706',
    status: 'beta',
    problem:
      'Reading a sourdough starter is guesswork. Is it ready? Underfed? Past its peak? Most advice is folklore, not observation.',
    solution:
      'Brotwerk reads your starter from a photo. A morning and evening snapshot from your phone — the model reads dome, bubbles, and rise, scores ripeness 0–100 with confidence, and answers in one plain sentence: feed, hydrate, wait, or bake.',
    features: [
      { heading: 'Photo → verdict → tip', body: 'Eight seconds to photograph, six to assess, five to read. No light box, no tripod.' },
      { heading: 'Ripeness score', body: 'A 0–100 maturity reading with confidence — dome, bubbles, and level, tracked across the seven-day arc.' },
      { heading: 'Privacy by design', body: 'EU-hosted, no tracking pixels, photos never used for AI training. GDPR export and deletion built in.' },
    ],
    ctaHref: 'https://brotwerk.app',
    ctaLabel: 'Open Brotwerk',
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
    tagline: 'The security scanner that understands your AI app.',
    description: 'Catches the LLM and MCP threats every other scanner misses — offline-first, open source.',
    theme: 'dark',
    accent: '#EF4444',
    status: 'live',
    problem:
      'Teams ship LLM features — chat completions, RAG ingest, agents with tool calls, MCP servers — and every conventional scanner is blind to the threats that come with them.',
    solution:
      'Nox understands AI applications: full OWASP MCP Top 10 coverage, prompt injection at the call site, embedding leakage, agent over-privilege, and cross-file AI taint — plus secrets, dependencies, IaC, and containers in one deterministic pass. Offline-first: no API, no token, no telemetry. Open source, Apache-2.0.',
    features: [
      { heading: 'Full MCP threat coverage', body: 'Tool poisoning, rug-pull, auth/SSRF, shadow servers — mapped to the OWASP MCP Top 10.' },
      { heading: 'Cross-file AI taint', body: 'Tracks request data through service hops into LLM call sites — across functions and files.' },
      { heading: '717 rules, 19 plugins', body: 'SAST, DAST, reachability, k8s runtime, red team, GRC across 12 compliance frameworks.' },
      { heading: 'Signed marketplace', body: 'Every official plugin Sigstore-verified; unsigned drops refused by default.' },
    ],
    ctaHref: 'https://nox-hq.dev',
    ctaLabel: 'Open Nox',
  },
  {
    slug: 'armada',
    name: 'Armada',
    tagline: 'Mission control for Jira at scale.',
    description: 'Launch, track, and govern campaigns across 50+ Jira teams.',
    theme: 'dark',
    accent: '#0D9488',
    status: 'live',
    problem:
      'Coordinating work across 50+ teams should not require 50+ spreadsheets. Security patches stall in scattered backlogs, compliance tasks lose their audit trail, and nobody can answer "are we delivering value?" at renewal.',
    solution:
      'Armada turns Jira into mission control for large-scale campaigns: one-click fan-out to 50+ teams, outcome metrics, audit-ready governance, and BYOK AI postmortems — inside the Jira your operators already use.',
    features: [
      { heading: 'Campaign launch', body: 'One click creates 50+ linked issues across projects — atomic, templated, with rollback on failure.' },
      { heading: 'Governance + audit', body: 'Approval gates, 180-day audit log, one-click CSV export. Compliance-grade without leaving Jira.' },
      { heading: 'Outcome metrics', body: 'Time-to-launch, completion, recall rate, drift, AI spend — derived from real events, not opinions.' },
      { heading: 'BYOK AI postmortems', body: 'Your provider key, your residency, your retention — OpenAI, Anthropic, Azure, or custom.' },
    ],
    ctaHref: 'https://armada.run',
    ctaLabel: 'Open Armada',
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
