export type ArticleBlock =
  | { type: 'p'; text: string }
  | { type: 'h'; text: string }
  | { type: 'quote'; text: string }
  | { type: 'list'; items: string[] }
  | { type: 'stats'; stats: ArticleStat[] };

export interface ArticleStat {
  value: string;
  label: string;
}

export interface ArticleCta {
  heading: string;
  body: string;
  href: string;
  label: string;
}

export interface Article {
  slug: string;
  title: string;
  dek: string;
  date: string; // ISO
  readingMinutes: number;
  author: string;
  accent: string;
  tags: string[];
  blocks: ArticleBlock[];
  cta?: ArticleCta;
}

/**
 * Klarlabs writing — engineering notes.
 */
export const articles: Article[] = [
  {
    slug: 'where-ai-coding-tokens-actually-go',
    title: '800 to 1',
    dek: 'We set out to cut the token bill on our AI-assisted coding. The popular fix — make the model talk in terse shorthand — turned out to touch about 1% of it. Here is what the numbers actually showed, and the tool we built and open-sourced to find out.',
    date: '2026-07-03',
    readingMinutes: 7,
    author: 'Felix Geelhaar',
    accent: '#6366F1',
    tags: ['AI', 'Developer Tools', 'Measurement', 'Open Source'],
    blocks: [
      {
        type: 'p',
        text: 'Most of our development now runs through an AI coding agent. On a flat-rate subscription the dollar cost is fixed, but tokens are not free — they are rate-limit headroom. Burn through them and you hit a mid-task cutoff four hours into a refactor. So we wanted to spend fewer tokens per unit of work.',
      },
      {
        type: 'p',
        text: 'The advice that circulates is simple: tell the model to answer tersely — drop the filler, speak in fragments — and you cut your token usage by "up to 75%." It is a satisfying idea. We decided to measure whether it was true for us before believing it.',
      },
      {
        type: 'stats',
        stats: [
          { value: '~800 : 1', label: 'input tokens vs. output tokens, on our real usage' },
          { value: '0.12%', label: 'of our tokens are the model’s own prose' },
          { value: '$19k', label: 'API-list-price value absorbed by a flat plan (so $0 out of pocket)' },
        ],
      },
      {
        type: 'h',
        text: 'Output is a rounding error',
      },
      {
        type: 'p',
        text: 'Over roughly six months of real usage we sent tens of billions of input tokens and received about forty million output tokens back. That is a ratio near 800 to 1. Every turn re-sends the entire growing context — system prompt, tool definitions, file contents, command output, conversation history — to get back a few hundred tokens of reply.',
      },
      {
        type: 'p',
        text: 'The terse-talking trick compresses only the model’s prose, and it leaves code, tool calls, and structured output alone. That prose is 0.12% of our token volume. Even weighting for the fact that output tokens are priced several times higher than input, the absolute ceiling on what "make the AI talk less" could ever save us is around 1% of the bill. We were about to optimize a rounding error.',
      },
      {
        type: 'quote',
        text: 'The token-saving trick that goes viral optimizes the thing you can see — the model’s words — not the thing you can’t: the context you re-send every single turn.',
      },
      {
        type: 'h',
        text: 'Where the tokens actually live',
      },
      {
        type: 'p',
        text: 'So we pointed the analyzer at the logs the agent already writes and measured the composition of everything that flows into context. It was not the model’s prose. It was not even close.',
      },
      {
        type: 'list',
        items: [
          'File contents (the agent reading source files): ~46% of context — the single largest slice.',
          'Command output (git, tests, builds, greps): roughly a third.',
          'The model’s own prose: ~11–15% — the part the terse trick addresses.',
        ],
      },
      {
        type: 'h',
        text: 'Command output: real, but not where we assumed',
      },
      {
        type: 'p',
        text: 'Command output looked promising, so we built a deterministic compressor for it — 46 per-command formatters that strip the noise from tool output (progress bars, up-to-date chatter, passing-test scaffolding) while guaranteeing that no error, failure, or changed-state line is ever dropped. On a benchmark corpus it removes 57–68% of the volume.',
      },
      {
        type: 'p',
        text: 'Then we ran it against our actual command history — and it reclaimed 1–4%. The formatters are excellent at compressing noisy builds and verbose test runs. Our commands, it turned out, are mostly grep, cat, echo, and small git calls — already terse, nothing to strip. The catalog was not wrong; our usage simply does not lean on the commands it shines at. Honest measurement beat the demo number.',
      },
      {
        type: 'h',
        text: 'The real lever: reading the same file twice',
      },
      {
        type: 'p',
        text: 'The biggest slice was file reads. Within it we looked for waste: the same file read more than once, and byte-identical content re-sent. About 16% of reads were repeats and 24% was duplicate content — reclaimable in principle. But more than half of all our reads already used ranged reads (offset/limit), and when we isolated the genuinely wasteful case — the same file read in full, unchanged, twice in a session — it came out to a handful of reads and a few thousand tokens across several sessions.',
      },
      {
        type: 'p',
        text: 'In other words: we were already reading efficiently. The lever existed, but for us it was nearly empty. The tool proved that rather than assuming it.',
      },
      {
        type: 'quote',
        text: 'The biggest win was not a compression trick. It was measuring — which killed three plausible optimizations before we shipped snake oil to ourselves.',
      },
      {
        type: 'h',
        text: 'What we shipped',
      },
      {
        type: 'p',
        text: 'The through-line of all of this is the same: you cannot optimize what you have not measured, and the AI-token economy is full of confident advice measured against the wrong denominator. So the useful artifact was never a single compression knob — it was the measurement itself.',
      },
      {
        type: 'p',
        text: 'We built and open-sourced tokenops: a local-first CLI and MCP server. It reads the logs your agent already writes and tells you where your tokens actually go — no daemon, no account, no telemetry leaving your machine. It ships the deterministic command-output formatters, and a hook that reclaims genuinely redundant file re-reads at the source. Every number in this post came out of it, pointed at our own usage.',
      },
      {
        type: 'h',
        text: 'The lesson',
      },
      {
        type: 'p',
        text: 'For us the honest answer was: you are already lean, and the fashionable optimizations would have bought almost nothing. That is not a disappointing result — it is the correct one, and a tool that can prove it is worth more than one that manufactures a saving. Measure your own usage. The denominator is almost never where the internet says it is.',
      },
    ],
    cta: {
      heading: 'tokenops is open source',
      body: 'Point it at your own logs and see where your AI-coding tokens actually go. Local-first, deterministic, no telemetry.',
      href: 'https://github.com/felixgeelhaar/tokenops',
      label: 'View on GitHub',
    },
  },
];
