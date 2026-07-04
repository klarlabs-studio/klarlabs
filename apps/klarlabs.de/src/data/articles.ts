export type ArticleBlock =
  | { type: 'p'; text: string }
  | { type: 'h'; text: string }
  | { type: 'quote'; text: string }
  | { type: 'list'; items: string[] }
  | { type: 'stats'; stats: ArticleStat[] }
  | { type: 'code'; code: string; lang?: string; caption?: string; href?: string; hrefLabel?: string }
  /** A chart rendered by tokenops (`tokenops fmt analyze --svg` / `spend --svg`), embedded verbatim. cmd is the exact command that produced it. */
  | {
      type: 'svg';
      id: 'composition' | 'reads' | 'ratio' | 'fmt-roi' | 'tokens-over-time' | 'composition-over-time';
      cmd: string;
      caption?: string;
    };

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
    slug: 'the-tool-was-guessing',
    title: 'The tool was guessing',
    dek: 'We built a tool to tell an AI agent when it was about to hit its rate-limit cap. A code review found it was answering with a guess — while the real number sat unread in its own database. Here is the bug, and why it is the most dangerous kind.',
    date: '2026-07-04',
    readingMinutes: 8,
    author: 'Felix Geelhaar',
    accent: '#0D9488',
    tags: ['AI', 'Developer Tools', 'Measurement', 'Debugging'],
    blocks: [
      {
        type: 'p',
        text: 'On a flat-rate AI subscription the dollar cost is fixed, but tokens are not free — they are rate-limit headroom. Burn through the window and you hit a mid-task cutoff four hours into a refactor. So the question an agent actually wants to ask before a long task is simple: am I about to hit the cap? We built a tool to answer it. A code review found the tool was answering with a guess.',
      },
      {
        type: 'p',
        text: 'The tool is tokenops. It exposes a function the agent can call — session_budget — that returns one of four recommendations (continue, slow down, switch model, wait for the reset) plus a confidence level. The idea is that the agent checks its headroom before committing to something long. The idea was fine. The number underneath it was not.',
      },
      {
        type: 'stats',
        stats: [
          { value: '0', label: 'lines of code that read the vendor’s own usage meter' },
          { value: '5', label: 'high-signal event types the counter explicitly threw away' },
          { value: '“high”', label: 'the confidence the tool reported — on a number it guessed' },
        ],
      },
      {
        type: 'h',
        text: 'The answer it never read',
      },
      {
        type: 'p',
        text: 'To know how much of your rate-limit window you have used, you can count. How many messages have I sent in the last five hours, against the cap? That is what the tool did. But there is a far better source: the vendor tells you directly. Anthropic’s session data carries a five-hour used-percentage. Codex’s responses carry a rate-limits block. Copilot’s API returns how much quota remains. And tokenops was already ingesting every one of them into its own event store.',
      },
      {
        type: 'code',
        lang: 'json',
        code: `// the shape of a snapshot the poller writes every cycle — the vendor's own meter:
{
  "granularity":        "quota_snapshot",
  "five_hour_used_pct": "87.00",                     // ← the answer (an example reading)
  "five_hour_reset_at": "2026-06-15T18:30:00Z"       // ← and exactly when it clears
}`,
        caption: 'The number the tool needed was written to its own database every poll — and read by nothing.',
      },
      {
        type: 'p',
        text: 'And nothing read it. A search for anything consuming those percentages — outside the code that wrote them — came back empty. The tool fetched the vendor’s own answer, stored it, and then computed its recommendation from something else entirely.',
      },
      {
        type: 'code',
        lang: 'console',
        code: `$ grep -rn "five_hour_used_pct" --include=*.go
poller.go:   "five_hour_used_pct": fmt.Sprintf("%.2f", pct)   # writes it
# …and nothing, anywhere, that reads it.`,
        caption: 'The whole bug in one grep: written, never read.',
      },
      {
        type: 'h',
        text: 'Computed from the wrong half of the data',
      },
      {
        type: 'p',
        text: 'It was worse than ignored. The message counter had an exclusion list — and it excluded exactly the high-signal sources. The per-turn usage records that carry the real token counts were tagged one way; the vendor quota snapshots were tagged another. Both were on the do-not-count list.',
      },
      {
        type: 'code',
        lang: 'go',
        code: `func countsAsMessage(env *Envelope) bool {
    switch env.Attributes["granularity"] {
    case "assistant_turn", "daily", "bucket",
         "quota_snapshot", "monthly_snapshot":
        return false   // ← the high-signal sources — all excluded
    default:
        return true
    }
}`,
        caption: 'The records that carried the truth were the ones the counter threw away.',
      },
      {
        type: 'p',
        text: 'So for the exact users the tool was built for — Claude Max, Claude Code, Codex, Copilot — the window count came out near zero. Near-zero of the cap reads as “plenty of room.” The recommendation: continue. Meanwhile the vendor’s meter, sitting one table over in the same database, might be reading 87%. The tool never looked.',
      },
      {
        type: 'quote',
        text: 'The dangerous bug in a measurement tool is not the one that crashes. It is the one that confidently reports a number it computed from the wrong inputs.',
      },
      {
        type: 'h',
        text: 'The confidence was computed from data the number ignored',
      },
      {
        type: 'p',
        text: 'The tell was the confidence label. tokenops grades its own trust: low when it is only seeing keep-alive pings, high when a real per-turn usage source is present. So the moment that per-turn data started flowing in, confidence was promoted to “high.” But that same data was on the exclusion list for the count. The label said “trust this” about a number derived from inputs the label’s own evidence was barred from touching. Confidence and answer came from disjoint halves of the same store — which is exactly why the failure was invisible. Nothing looked broken. It just looked confident.',
      },
      {
        type: 'h',
        text: 'The fix was to read the meter',
      },
      {
        type: 'p',
        text: 'The fix is not clever, and that is the point. When a vendor snapshot exists, use its percentage and its exact reset time — directly, at high confidence. Fall back to the message-count heuristic only when there is no meter to read. It also closed a quieter gap: plans that publish a rolling window but no message cap (Claude Code’s Max and Pro tiers) could not be scored by the count path at all, so they had always come back “unknown.” Reading the meter gives them a real answer for the first time.',
      },
      {
        type: 'code',
        lang: 'text',
        code: `before  →  recommendation: continue      confidence: high     (window: ~0% used)
after   →  recommendation: slow_down     confidence: high     (window: 87% used, resets in 42m)`,
        caption: 'Same session, same instant. One reads the vendor’s meter; one guessed.',
      },
      {
        type: 'p',
        text: 'For the flagship plans the central question — will I hit the cap? — moved from a guess to the vendor’s own number, with the exact reset time attached so “wait for the reset” finally knows how long. It shipped in the next release.',
      },
      {
        type: 'h',
        text: 'The lesson',
      },
      {
        type: 'p',
        text: 'Two lessons, and the second one surprised me. The first is the familiar one: a tool that measures can still measure the wrong thing, and the failure hides because it arrives with a confident number bolted to it. Grade your own signal quality by the inputs you actually used, not the inputs you happen to have.',
      },
      {
        type: 'p',
        text: 'The second: the data you need is often already in your system, written and unread. This was not a missing-data bug. It was a tool that fetched the right answer, filed it away, and then went and computed a different one. The most valuable line of code we shipped that week deleted a heuristic and read a column that had been sitting there the whole time.',
      },
      {
        type: 'quote',
        text: 'Last time, the lesson was that the AI-token economy is full of confident advice measured against the wrong denominator. This time the thing doing the measuring was the one measuring against the wrong denominator.',
      },
      {
        type: 'p',
        text: 'tokenops is open source. It reads the logs and vendor signals your agent already produces and — now — reports rate-limit headroom from the meter, not a guess. Every bug in this post is a real commit; the fix is in the latest release. If you run an AI agent on a flat-rate plan, point it at your own usage and let it tell you the truth before the cutoff does.',
      },
    ],
    cta: {
      heading: 'tokenops is open source',
      body: 'Rate-limit headroom for your AI agent, read from the vendor’s own meter. Local-first, deterministic, no telemetry.',
      href: 'https://github.com/klarlabs-studio/tokenops',
      label: 'View on GitHub',
    },
  },
  {
    slug: 'where-ai-coding-tokens-actually-go',
    title: '800 to 1',
    dek: 'We set out to cut the token bill on our AI-assisted coding. The popular fix — make the model talk in terse shorthand — turned out to touch about 1% of it. Here is what the numbers actually showed, and the tool we built and open-sourced to find out.',
    date: '2026-07-03',
    readingMinutes: 9,
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
        text: 'Over several weeks of heavy real usage we sent tens of billions of input tokens and received about forty million output tokens back. That is a ratio near 800 to 1. Every turn re-sends the entire growing context — system prompt, tool definitions, file contents, command output, conversation history — to get back a few hundred tokens of reply.',
      },
      {
        type: 'svg',
        id: 'ratio',
        cmd: 'tokenops spend --svg ratio.svg',
        caption: 'From `tokenops spend`. The output bar is 0.12% of the total, drawn to scale — a hairline. That sliver is the only thing “make the AI talk terse” can touch.',
      },
      {
        type: 'p',
        text: 'And it is not an average hiding a lucky week. Bucket the same logs by week and the shape never moves — output stays pinned to the baseline against input, every single week.',
      },
      {
        type: 'svg',
        id: 'tokens-over-time',
        cmd: 'tokenops fmt analyze --svg ./charts   # → tokens-over-time.svg',
        caption: 'From `tokenops fmt analyze`. Input vs output tokens, week by week over recent weeks. The output line hugs the baseline every week — the ratio is structural, not a snapshot.',
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
        type: 'svg',
        id: 'composition',
        cmd: 'tokenops fmt analyze --svg ./charts   # → composition.svg',
        caption: 'Generated by tokenops from our own logs (`tokenops fmt analyze --svg`). “Model prose” — the slice the terse-speak trick compresses — is third, and small.',
      },
      {
        type: 'p',
        text: 'We did not eyeball this, and we did not draw that chart by hand — tokenops rendered it. The tool reads the JSONL logs the agent already writes and reports the split directly, no daemon, no setup:',
      },
      {
        type: 'code',
        lang: 'console',
        code: `$ tokenops fmt analyze --top 6

Context composition — 768 sessions, 78539 tool results
  SOURCE                 ~TOKENS    SHARE
  Read                     14.3M    46.5%
  Bash                      8.2M    26.6%
  (assistant prose)         3.5M    11.4%
  (user prose)              1.1M     3.7%
  Agent                     861k     2.8%
  Edit                      723k     2.3%`,
        caption: 'tokenops fmt analyze — context composition from your own logs.',
        href: 'https://github.com/klarlabs-studio/tokenops',
        hrefLabel: 'github.com/klarlabs-studio/tokenops',
      },
      {
        type: 'p',
        text: 'And that split is not a one-off snapshot either. Bucket the same logs by week and the mix holds: file reads and command output dominate the context every week, not just on average.',
      },
      {
        type: 'svg',
        id: 'composition-over-time',
        cmd: 'tokenops fmt analyze --svg ./charts   # → composition-over-time.svg',
        caption: 'Also from tokenops. The context mix week by week — Read and Bash stay dominant throughout, while model prose stays a thin band on top.',
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
        type: 'svg',
        id: 'fmt-roi',
        cmd: 'tokenops fmt analyze --svg ./charts   # → fmt-roi.svg',
        caption: 'From `tokenops fmt analyze`. The same 57–68% formatters, measured against our real command mix instead of a benchmark corpus.',
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
        type: 'svg',
        id: 'reads',
        cmd: 'tokenops fmt analyze --svg ./charts   # → reads.svg',
        caption: 'Also from tokenops. Most repeats are ranged or post-edit — legitimate. A hook classifies each re-read live and reclaims only the genuinely wasteful case:',
      },
      {
        type: 'code',
        lang: 'console',
        code: `$ tokenops read-guard stats

read-guard — 112 reads seen across 3 sessions
  repeat reads (same file again in a session): 53
    ├─ reclaimable (unchanged full re-read): 4 · ~5354 tokens
    ├─ post-edit (file changed — not waste):  2
    └─ ranged (intentional partial re-read):  47`,
        caption: 'tokenops read-guard — a Claude Code hook that blocks only redundant re-reads.',
        href: 'https://github.com/klarlabs-studio/tokenops',
        hrefLabel: 'github.com/klarlabs-studio/tokenops',
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
        text: 'We built and open-sourced tokenops: a local-first CLI and MCP server. It reads the logs your agent already writes and tells you where your tokens actually go — no daemon, no account, no telemetry leaving your machine. It ships the deterministic command-output formatters, and a hook that reclaims genuinely redundant file re-reads at the source. Every number and chart in this post came out of it, pointed at our own usage.',
      },
      {
        type: 'code',
        lang: 'console',
        code: `$ brew install felixgeelhaar/tap/tokenops

# where do my AI-coding tokens actually go?
$ tokenops fmt analyze

# what would the command-output formatters save on my traffic?
$ tokenops fmt learn`,
        caption: 'Point it at your own logs. Local-first, deterministic, no telemetry.',
        href: 'https://github.com/klarlabs-studio/tokenops',
        hrefLabel: 'github.com/klarlabs-studio/tokenops',
      },
      {
        type: 'h',
        text: 'Point it at your own usage',
      },
      {
        type: 'p',
        text: 'Setup is not installing another optimizer — it is aiming the measurement at your own situation. Everything below reads the logs your agent already writes; the only question is how much you want wired in. Four common starting points, in order of commitment.',
      },
      {
        type: 'p',
        text: 'If you only want to check your own denominator before trusting anyone’s percentage: install, run one command, read the split. No daemon, no account, nothing left running. This is where every number in this post came from.',
      },
      {
        type: 'code',
        lang: 'console',
        code: `$ brew install felixgeelhaar/tap/tokenops

# context composition from the logs already on disk — no daemon, no account
$ tokenops fmt analyze`,
        caption: 'Cost-curious / skeptic — measure first, decide later. Nothing persists.',
        href: 'https://github.com/klarlabs-studio/tokenops',
        hrefLabel: 'github.com/klarlabs-studio/tokenops',
      },
      {
        type: 'p',
        text: 'If you are the person in this post — coding all day against a Claude Max or ChatGPT plan and tired of mid-task cutoffs — bind your plan so tokenops can predict the window, and wire the read-guard hook so genuinely redundant full re-reads never spend tokens. It starts in observe mode; you flip it to active once you have seen what it would block.',
      },
      {
        type: 'code',
        lang: 'console',
        code: `$ tokenops init --detect                      # sniff installed AI clients
$ tokenops plan set anthropic claude-max-20x  # predict the rate-limit window
$ tokenops read-guard hook                    # prints the Claude Code settings.json block`,
        caption: 'Solo dev on a flat-rate plan — predict the cutoff, reclaim redundant re-reads.',
      },
      {
        type: 'p',
        text: 'If you are building your own agent or MCP workflow, the deterministic formatters are the reusable part. Wrap a noisy command so its output is compressed — losslessly for errors and changed state — before it ever reaches context, or run the whole thing as an MCP server your agent calls directly.',
      },
      {
        type: 'code',
        lang: 'console',
        code: `$ tokenops fmt -- go test ./...            # compress this command's output in place
$ eval "$(tokenops fmt hook --shell zsh)"  # then: export TOKENOPS_FMT=1 to activate
$ tokenops serve                           # MCP server over stdio — tools your agent calls`,
        caption: 'Agent / tool builder — the deterministic formatters and MCP tools, in your own pipeline.',
      },
      {
        type: 'p',
        text: 'And if you run a team, the daemon adds per-project and per-session attribution: which project burns the most, and where a specific session went wide. The coach turns that into ranked, dollar- and hour-denominated recommendations — measured against your traffic, not a benchmark corpus.',
      },
      {
        type: 'code',
        lang: 'console',
        code: `$ tokenops start            # daemon: proxy + analytics + dashboard
$ tokenops spend --by agent  # which project burns the most
$ tokenops coach prompts     # per-session waste, ranked by tokens / $ / hours`,
        caption: 'Team / eng lead — attribution across projects and sessions, plus ranked coaching.',
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
      href: 'https://github.com/klarlabs-studio/tokenops',
      label: 'View on GitHub',
    },
  },
];
