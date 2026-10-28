export type ProductTheme = 'dark' | 'light';
export type ProductStatus = 'live' | 'beta' | 'coming-soon';
export type ProductLine = 'secure' | 'remember' | 'operate';

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
  /** Path under public/ to a square logo with a transparent background. */
  logo?: string;
  /**
   * The line of the AI-infrastructure family this product belongs to. Products
   * without one are studio work outside that story, listed in the compact
   * "Also from the studio" row rather than the main product grid.
   */
  line?: ProductLine;
}

/**
 * Product inventory — Design System v2.
 * Copy marked DRAFT pending review by Felix.
 */
export const products: Product[] = [
  {
    slug: 'vorhut',
    line: 'operate',
    name: 'Vorhut',
    tagline: 'Predict incidents before they happen.',
    description: 'AI-powered incident prediction and governed auto-remediation.',
    theme: 'dark',
    accent: '#6366F1',
    status: 'beta',
    problem:
      'Operations teams react. Telemetry piles up in dashboards, anomalies surface as outages, and remediation is a 3 a.m. runbook under pressure.',
    solution:
      'Vorhut sits on the observability stack you already pay for — Datadog, Prometheus, OpenSearch — detects anomalies, predicts outages, and remediates under explicit governance. Workflows graduate from draft to shadow to auto-execution only after the evaluation harness clears them.',
    features: [
      { heading: 'Pattern detection', body: 'Threshold, error-rate, and trend detectors with calibration and confidence scoring — over-confident detectors stay out of the queue.' },
      { heading: 'Governed remediation', body: 'Runtime Policy Language gates every action by confidence, blast radius, scope, and environment. Operators stay in the loop until the loop is proven.' },
      { heading: 'Blast-path topology', body: 'Walks the service dependency graph to surface every downstream service an incident will touch — before approval.' },
      { heading: 'Multi-agent fleet', body: 'Pipeline-scoped agents own slices of the topology, each with its own tool allowlist and scope filter.' },
    ],
    ctaHref: 'https://vorhut.dev',
    ctaLabel: 'Open Vorhut',
  },
  {
    slug: 'tokenops',
    line: 'operate',
    logo: '/logos/tokenops.svg',
    name: 'TokenOps',
    tagline: "Know what's left. Set what's allowed. Let your agents work.",
    description: 'Guardrails for coding agents: what is left on every AI plan, steering inside the session, and limits your agents respect. Local-first; prompts never leave your machine.',
    theme: 'dark',
    accent: '#C6F432',
    status: 'live',
    problem:
      'Coding agents now run for hours across several plans at once — Claude, Codex, Cursor, Copilot, API keys. Each vendor shows its own meter in its own place, so the cutoff arrives mid-refactor, a looping agent burns an hour of the window before anyone looks, and an unattended run has no moment where someone asks "should this keep going?"',
    solution:
      'TokenOps reads every plan and account your agents draw on, more than 80 providers, and acts inside the session before a limit, a budget or a rule you set is crossed. It runs as a local daemon with a menu bar app, a status line and MCP tools for the agent itself; prompts and code never leave the machine. Teams share the same guardrails on the hosted team plane, free during the beta.',
    features: [
      { heading: 'Know what is left', body: 'Every 5-hour, weekly and monthly window in one view, with its pace and its reset — in the menu bar, the status line and the agent\'s own context. A reading that stopped shows its age, never passes for current.' },
      { heading: 'Steer the session it is in', body: 'A loop breaker pauses the call that repeats with nothing changed, a redundant file read is refused before it costs a token, and long command output is cut to what the agent needs.' },
      { heading: 'Set what is allowed', body: 'Action boundaries on session cost, the last of a plan or a bigger model start in shadow, then enforce. Only a person at a terminal can approve — never the agent that was stopped.' },
      { heading: 'Shared, not surveilled', body: 'The team plane rolls up derived figures by team, repository and kind of work — never prompts, files or paths. Owners set signed rules members can tighten but never loosen. Hosted in Germany.' },
    ],
    ctaHref: 'https://team.klarlabs.de',
    ctaLabel: 'Open TokenOps',
  },
  {
    slug: 'mnemos',
    line: 'remember',
    name: 'Mnemos',
    tagline: 'Self-hosted memory that thinks — and gets better with use.',
    description: 'A self-hosted memory + evidence layer for AI agents — with a full cognitive layer that consolidates, forgets, predicts, and learns from its own errors. No vendor cloud, no LLM.',
    theme: 'dark',
    accent: '#0891B2',
    status: 'live',
    problem:
      'AI agents forget, or remember wrong. Hosted memory services meter every call and hold your data; vector stores retrieve but keep no structure, no evidence, no sense of what contradicts what. And a memory that only ever grows is a memory that rots — it never learns which of its beliefs were actually right.',
    solution:
      'Mnemos is a memory layer you run yourself: every claim carries its evidence, every contradiction surfaces, and a cognitive layer runs the background work a brain does. It consolidates duplicates and forgets what has decayed (while protecting what matters); it makes falsifiable predictions, measures its own error when reality arrives, and spends that error to keep confirmed beliefs and let go of refuted ones; it distils recurring experience into reusable skills and tunes them by how well they actually work. All deterministic, with no model in the loop.',
    features: [
      { heading: 'Evidence, not vibes', body: 'Every claim links back to the source it came from, and contradictions are first-class — surfaced in the query response, not silently overwritten. Bi-temporal, so you can ask what was believed at any point in time.' },
      { heading: 'A brain, not a bucket', body: 'A scheduled "sleep" pass consolidates and forgets; salience protects what matters; retrieval fuses dense and sparse, grades itself, spends effort by the stakes, and follows the current train of thought. An abstain gate lets an agent say "I don\'t know enough" instead of confabulating. All with no LLM.' },
      { heading: 'Gets better with use', body: 'Mnemos closes the loop on prediction error: it predicts, checks itself against what happened, and routes that surprise into what it keeps, forgets, and rehearses. It turns experience into skills that self-tune by outcome, routes a question to whichever agent knows most, and recognises when it has "seen this shape before."' },
      { heading: 'Self-hosted & deterministic', body: 'A single Go binary on your infrastructure. No vendor cloud, no per-call billing on your own recall, no data leaving your servers. Five storage backends; MIT-licensed.' },
      { heading: 'Drops into any runtime', body: 'HTTP, CLI, gRPC, and MCP entrypoints plus first-party Python / TypeScript / Go SDKs. Works with Claude Code, Cursor, LangGraph, CrewAI, or your own agent.' },
    ],
    ctaHref: 'https://github.com/klarlabs-studio/mnemos',
    ctaLabel: 'View on GitHub',
  },
  {
    slug: 'pet-medical',
    name: 'Pet Medical',
    tagline: 'Calm health intelligence for your pet.',
    description: 'See your pet’s health drift months before the next vet visit.',
    theme: 'light',
    accent: '#0EA5E9',
    status: 'beta',
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
    slug: 'kraftsport-coach',
    name: 'KraftSport Coach',
    tagline: 'Strength programming, engineered.',
    description: 'Programming, progression, and analysis — coached by IRI, the strength AI.',
    theme: 'light',
    accent: '#0D9488',
    status: 'beta',
    problem:
      'Strength progress stalls when programming is guesswork. Spreadsheets do not understand fatigue, RPE, or periodisation.',
    solution:
      'KraftSport Coach plans and adapts strength training — progression schemes, load management, and analysis built on how strength is actually trained. IRI, the AI coach inside, reads your logged sessions and adjusts the plan.',
    features: [
      { heading: 'Adaptive programming', body: 'IRI responds to logged performance — not a static spreadsheet.' },
      { heading: 'Load management', body: 'RPE and volume tracking that flags overreach before it costs a week.' },
      { heading: 'Progress analysis', body: 'Estimated 1RMs, trends, and PRs — clearly visualised.' },
    ],
    ctaHref: 'https://kraftsport-coach.de',
    ctaLabel: 'Open KraftSport Coach',
  },
  {
    slug: 'roady',
    line: 'remember',
    name: 'Roady',
    tagline: 'The plan-of-record for AI coding agents.',
    description: 'Spec, plan, and drift detection that survive context resets — file-based, git-versioned, MCP-native. Runs no model of its own.',
    theme: 'dark',
    accent: '#7C3AED',
    status: 'live',
    problem:
      'You pair with an agent on a multi-day feature. Three days in it has forgotten what was decided, rewritten the wrong thing, or quietly drifted off-spec — and nothing tells you which. Chat history is lossy across a reset, and the tracker your PM uses is not where the work is happening.',
    solution:
      'Roady keeps intent, plan, and execution state as durable files in the repo, and continuously diffs them against reality. Every task carries a citation back to the document that motivated it, every state change lands in a hash-chained log, and every operation is an MCP tool your agent can call. It holds no API key: it assembles the context a model needs and hands it to the agent that already has one.',
    features: [
      { heading: 'Drift detection', body: 'Diffs intent against plan against code — including a plan the repository has quietly moved past. Exits non-zero, so it gates CI.' },
      { heading: 'Provenance you can audit', body: 'Every event records the agent and session behind it. Ask which agent touched a task and what evidence backs it.' },
      { heading: 'Reports, not dashboards', body: 'A self-contained progress document you can email, commit, or publish. Nothing to host, nothing to log into.' },
      { heading: 'Bidirectional tracker sync', body: 'Linear, Jira, GitHub, Trello, Asana, Notion. Status and priority flow both ways; your policy guards travel with them.' },
    ],
    ctaHref: 'https://github.com/klarlabs-studio/roady',
    ctaLabel: 'Open Roady',
  },
  {
    slug: 'nox',
    line: 'secure',
    logo: '/logos/nox.webp',
    name: 'Nox',
    tagline: 'The security scanner that understands your AI app.',
    description: 'Secrets, dependencies, IaC, and the LLM and MCP risks other scanners miss — in one offline-first pass. Open source.',
    theme: 'dark',
    accent: '#3B82F6',
    status: 'live',
    problem:
      'Teams ship LLM features — chat completions, RAG ingest, agents with tool calls, MCP servers — and every conventional scanner is blind to the threats that come with them. The ones it does see arrive as a wall of alerts nobody can tell apart from a real attack path.',
    solution:
      'Nox understands AI applications: the OWASP LLM, MCP, and Agentic Top 10, prompt injection at the call site, cross-file AI taint, hallucinated packages — plus secrets, dependencies, IaC, and containers in one deterministic pass. It runs on your machine and sends no source code anywhere; dependency answers come from NOX Intelligence and are checked against OSV.dev on every scan. Findings land as SARIF, CycloneDX, and SPDX, in your editor over LSP, and in your agent over MCP. Open source, Apache-2.0.',
    features: [
      { heading: 'Built for AI applications', body: 'Tool poisoning, rug-pull, auth/SSRF, and shadow servers mapped to the OWASP MCP Top 10; prompt injection traced from request to model call across functions and files.' },
      { heading: 'Proof, not alarms', body: 'nox attack turns findings into exploit hypotheses and, only when you authorise it, tests them against a running target. A finding is confirmed by reproduction — never by an LLM’s opinion.' },
      { heading: 'Fixes, not just findings', body: 'nox fix plans, applies, and verifies dependency and action-pin upgrades. The Remediate GitHub Action opens the pull request for you.' },
      { heading: 'Offline-first, deterministic', body: 'Same input, same output. No account, no telemetry, no API key — and one setting turns off the network entirely.' },
    ],
    ctaHref: 'https://nox-hq.dev',
    ctaLabel: 'Open Nox',
  },
  {
    slug: 'nox-intelligence',
    line: 'secure',
    logo: '/logos/nox.webp',
    name: 'NOX Intelligence',
    tagline: 'Vulnerability answers you can verify, not just trust.',
    description: 'The advisory service behind every Nox scan — everything OSV.dev knows plus what the NOX network has found, checked against OSV.dev on every lookup.',
    theme: 'dark',
    accent: '#A371F7',
    status: 'live',
    problem:
      'Your scanner trusts one vulnerability database. When it is wrong, late, or down, you find out from an incident — and the risks that come with AI-written code, like packages a model invented, are in no database at all.',
    solution:
      'NOX Intelligence answers every dependency lookup with everything OSV.dev returns, plus what the NOX network has found — never less. The Nox scanner verifies that on every run and restores anything missing, so a bad day for the service cannot cost you a finding. Answers come from a continuously synced mirror in about half a second; lookups carry package names and versions, never source code. It is on by default in every Nox scan, with no sign-up and no API key.',
    features: [
      { heading: 'A guarantee, not a promise', body: 'Every answer is the union with OSV.dev, and the scanner checks it. When the mirror cannot vouch for an answer, the service asks OSV.dev live instead of guessing.' },
      { heading: 'Fast enough for every commit', body: 'About half a second for a typical lookup, with EPSS, CISA KEV, and reachability context included — free.' },
      { heading: 'AI supply chain', body: 'A signed weekly blocklist of package names language models are likely to hallucinate, and an advisory feed for MCP packages — so the tools your agents call are covered like any other dependency.' },
      { heading: 'Evidence that cannot be gamed', body: 'Opt in, and your scans become independent evidence. Confidence counts distinct reporters, not repeated scans, and only people notify maintainers or publish a disclosure.' },
    ],
    ctaHref: 'https://intel.klarlabs.de',
    ctaLabel: 'Open NOX Intelligence',
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
    slug: 'devatlas',
    name: 'DevAtlas',
    tagline: 'One place that knows every service you run.',
    description: 'An internal developer portal built on a context lake — services, ownership, dependencies, and operational history unified for humans and AI agents.',
    theme: 'dark',
    accent: '#059669',
    status: 'coming-soon',
    problem:
      'Engineering context is scattered — ownership in a wiki, dependencies in someone’s head, SLOs in Datadog, incidents in PagerDuty. When a service breaks at 3 a.m., nobody can answer "who owns this and what does it touch?" — and the AI agents you point at your stack inherit the same blindness.',
    solution:
      'DevAtlas ingests from the tools you already run — GitHub, GitLab, Jira, PagerDuty, Datadog — into a single context lake: a live catalog of services, dependencies, ownership, and operational history. Humans self-serve answers; AI agents consume the same context under RBAC, tenant isolation, and audit logging. Ask in plain language "what breaks if service X goes down?" and get an answer grounded in the graph, not a guess.',
    features: [
      { heading: 'Context lake, not another wiki', body: 'Connectors keep the catalog in sync with reality — services, APIs, dependencies, tech stacks, SLOs, and incident history flow in from GitHub, Jira, PagerDuty, and Datadog automatically.' },
      { heading: 'Blast radius on demand', body: '"What breaks if this goes down?" answered from the live dependency graph — before you deploy, not after the incident.' },
      { heading: 'Governed by default', body: 'RBAC, PostgreSQL row-level tenant isolation, full audit logging, and tiered rate limits on every endpoint. Safe enough for agents to act on.' },
      { heading: 'Built for human + agent', body: 'Ask DevAtlas in natural language, or let AI agents consume the same governed context for AIOps, anomaly detection, and always-current docs.' },
    ],
  },
  {
    slug: 'nexa',
    name: 'Nexa',
    tagline: 'Your personal finances, on autopilot.',
    description: 'A personal finance operating system powered by intelligent agents.',
    theme: 'light',
    accent: '#8B5CF6',
    status: 'coming-soon',
    problem:
      'Financial life is scattered across banks, insurers, employers, portals, and inboxes — with no single owner. Documents get lost, deductions get missed, and paperwork waits until it is urgent.',
    solution:
      'Nexa is a personal finance operating system powered by intelligent agents. Delegate taxes, documents, deadlines, and obligations to an agent that collects, organizes, and optimizes year-round — with full transparency and control. You focus on decisions; Nexa handles the administration. Starting with German tax.',
    features: [
      { heading: 'Continuous, not seasonal', body: 'Works through the year — not a panicked week in spring. Nothing missed, no deadline blown.' },
      { heading: 'Document intelligence', body: 'Messy real-world paperwork read, organized, and remembered — across years and life events.' },
      { heading: 'Transparent agency', body: 'The agent explains what it does and why. You stay in control of every action.' },
    ],
  },
  {
    slug: 'lexora',
    name: 'Lexora',
    tagline: 'Regulation, operationalized.',
    description: 'A regulatory operating system — obligations turned into executable workflows.',
    theme: 'light',
    accent: '#0D9488',
    status: 'coming-soon',
    problem:
      'GDPR, the EU AI Act, DORA, NIS2, CRA — regulations are fragmented, frequently updated, and operationally disconnected. "Can we launch this feature?" should not require a consulting engagement.',
    solution:
      'Lexora transforms regulations into executable operational workflows: regulation → obligation → control → process → evidence. Instead of proving compliance after the fact, organizations see what applies, what to do, and stay compliant continuously as systems and rules evolve.',
    features: [
      { heading: 'Obligation mapping', body: 'Which regulations apply, what they require, and what changed — in one place.' },
      { heading: 'Executable workflows', body: 'Obligations become concrete actions with owners — not PDF checklists.' },
      { heading: 'Evidence continuity', body: 'Evidence collected as work happens. Audit-ready by default, not by fire drill.' },
    ],
  },
];

export interface ProductLineInfo {
  id: ProductLine;
  title: string;
  summary: string;
}

/** The AI-infrastructure family, in the order the home page tells it. */
export const productLines: ProductLineInfo[] = [
  { id: 'secure', title: 'Secure', summary: 'Find what AI-built software gets wrong, and prove which findings are real.' },
  { id: 'remember', title: 'Remember & plan', summary: 'Memory and a plan of record that keep agents on track across sessions.' },
  { id: 'operate', title: 'Operate', summary: 'Keep agents within their limits, and predict and remediate incidents, under explicit governance.' },
];

/** Products in a line, in inventory order. */
export const productsIn = (line: ProductLine): Product[] => products.filter((p) => p.line === line);

/** Studio work outside the AI-infrastructure family. */
export const alsoFromStudio: Product[] = products.filter((p) => !p.line);

export interface OssLibrary {
  name: string;
  description: string;
  repoHref: string;
  docsHref?: string;
  docsLabel?: string;
}

export interface OssGroup {
  title: string;
  libraries: OssLibrary[];
}

const gh = (repo: string) => `https://github.com/klarlabs-studio/${repo}`;
const godoc = (repo: string) => `https://pkg.go.dev/github.com/klarlabs-studio/${repo}`;
// Most Go libs publish under the go.klarlabs.de vanity import path, whose last
// segment differs from the repo name (agent-go -> agent, mcp-go -> mcp, …).
const vdoc = (mod: string) => `https://pkg.go.dev/go.klarlabs.de/${mod}`;

/**
 * Open-source libraries grouped by role — mirrors the org overview at
 * github.com/klarlabs-studio so the portfolio reads as a coherent stack
 * rather than a flat list of repos.
 */
export const ossGroups: OssGroup[] = [
  {
    title: 'Agent infrastructure',
    libraries: [
      { name: 'agent-go', description: 'State-driven AI agent runtime for Go.', repoHref: gh('agent-go'), docsHref: vdoc('agent'), docsLabel: 'pkg.go.dev' },
      { name: 'axi-go', description: 'Safe, auditable execution kernel for AI agent tools.', repoHref: gh('axi-go'), docsHref: vdoc('axi'), docsLabel: 'pkg.go.dev' },
      { name: 'mnemos', description: 'Self-hosted memory brain for AI agents: evidence-backed claims, contradiction detection, and a cognitive layer that consolidates, forgets, predicts, and learns from its own errors — gets better with use, no vendor cloud, no LLM required.', repoHref: gh('mnemos'), docsHref: vdoc('mnemos'), docsLabel: 'pkg.go.dev' },
      { name: 'chronos', description: 'Time-series pattern detection for AI agents — trends, spikes, drops, anomalies as structured signals.', repoHref: 'https://github.com/felixgeelhaar/chronos', docsHref: 'https://pkg.go.dev/github.com/felixgeelhaar/chronos', docsLabel: 'pkg.go.dev' },
      { name: 'mcp-go', description: 'Go framework for building MCP servers.', repoHref: gh('mcp-go'), docsHref: vdoc('mcp'), docsLabel: 'pkg.go.dev' },
      { name: 'scout', description: 'Browser automation. One binary, no Node, no Python.', repoHref: gh('scout'), docsHref: vdoc('scout'), docsLabel: 'pkg.go.dev' },
      { name: 'briefkasten', description: 'Any mailbox as an MCP server — list, fetch, send, search.', repoHref: gh('briefkasten'), docsHref: vdoc('briefkasten'), docsLabel: 'pkg.go.dev' },
    ],
  },
  {
    title: 'Resilience & observability',
    libraries: [
      { name: 'fortify', description: 'Composable resilience for Go: circuit breaker, retry, rate limit, timeout — one API.', repoHref: gh('fortify'), docsHref: vdoc('fortify'), docsLabel: 'pkg.go.dev' },
      { name: 'fortify-ts', description: 'Composable resilience for TypeScript: circuit breaker, retry, rate limit, bulkhead, fallback.', repoHref: gh('fortify-ts') },
      { name: 'bolt', description: 'Zero-allocation slog handler for Go, with first-class OpenTelemetry.', repoHref: gh('bolt'), docsHref: vdoc('bolt'), docsLabel: 'pkg.go.dev' },
      { name: 'auth-go', description: 'Auth for Go — magic link, password, TOTP, passkeys, sessions.', repoHref: gh('auth-go'), docsHref: godoc('auth-go'), docsLabel: 'pkg.go.dev' },
    ],
  },
  {
    title: 'Developer tooling',
    libraries: [
      { name: 'coverctl', description: 'Coverage your AI coding agent checks before commit — domain-aware, MCP-native.', repoHref: gh('coverctl'), docsHref: vdoc('coverctl'), docsLabel: 'pkg.go.dev' },
      { name: 'statekit', description: 'Go-native statecharts, XState-JSON compatible.', repoHref: gh('statekit'), docsHref: vdoc('statekit'), docsLabel: 'pkg.go.dev' },
    ],
  },
];

/** Flat view of every library, derived from the grouped source. */
export const ossLibraries: OssLibrary[] = ossGroups.flatMap((g) => g.libraries);
