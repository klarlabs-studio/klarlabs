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
    }
  /** A hand-authored conceptual diagram (inline SVG, no command line). */
  | { type: 'diagram'; id: 'store-vs-memory' | 'trust-salience' | 'brain-mechanisms' | 'circadian-dissonance'; caption?: string };

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
    slug: 'is-the-brain-healthy',
    title: 'Is the brain healthy?',
    dek: 'Most memory for AI is a database with an embedding index. Mnemos is a brain: it consolidates while you are away, forgets what stopped mattering, and takes its own vital signs. This is how it measures the health of what it believes \u2014 five cognitive vitals, one verdict \u2014 and what running one in production taught us about counting the right thing.',
    date: '2026-07-22',
    readingMinutes: 15,
    author: 'Felix Geelhaar',
    accent: '#E11D48',
    tags: ['AI', 'Memory', 'Measurement', 'Engineering'],
    blocks: [
      { type: 'p', text: 'A health check on an ordinary service asks one question: is it up? Return a 200 and you are healthy. That question is meaningless for a memory system. A brain can answer every request, on time, while quietly believing things that are stale, contradictory, or never happened. Its failures are not crashes — they are wrong beliefs held with confidence. So the interesting question is not "is it running" but "is what it knows any good," and that needs a different kind of check.' },
      { type: 'p', text: 'An earlier note described building the cognitive half of Mnemos — consolidation, forgetting, salience, self-correcting recall. This one is about a smaller, sharper thing: how we score a brain’s health, what the score is made of, and what we learned when we finally ran it against a real one. The honest headline is that the hardest part was not designing the vitals. It was making sure they measured the set they claimed to.' },

      { type: 'h', text: 'What a brain’s vitals actually measure' },
      { type: 'p', text: 'Mnemos frames health the way active-inference frames a mind: a healthy brain is one whose model of the world keeps its prediction error low. It is not surprised by what it later observes; its confidence matches its accuracy; it does not hold beliefs that flatly contradict each other. From that idea fall a handful of vitals, each a number in the unit interval where higher is worse, each with its own warn and critical line. One rolled-up verdict — healthy, degraded, or unhealthy — takes the worst of them, so a single sick organ is never hidden by four well ones.' },
      { type: 'list', items: [
        'Free energy — the aggregate prediction-error signal, and a pointer to which layer is most wrong. It is the headline number; the rest explain it.',
        'Calibration — expected calibration error: when the brain says it is 80% sure, is it right about 80% of the time? A brain that is confidently wrong is worse than one that is unsure.',
        'Dissonance — active, high-stakes contradictions per belief. Not every disagreement; the ones between beliefs established enough that a conflict means something has to give.',
        'Low-trust — the share of currently-valid beliefs whose trust has decayed below a floor. Trust falls as the evidence behind a belief ages without re-verification.',
        'Staleness — the share of valid beliefs not seen or re-verified within a horizon. A recency proxy for "still load-bearing, or just still present?"',
      ]},
      { type: 'p', text: 'Alongside the vitals sit three integrity checks — structural, not cognitive. Orphan beliefs: claims with zero evidence, which should not exist, because every belief in Mnemos is supposed to trace back to a source event. Dangling edges: relationships pointing at a belief that is gone. Stale expectations: predictions the brain made and never reconciled. These are the data-integrity smell tests; a single orphan is a warning, a dangling edge is an error.' },
      { type: 'diagram', id: 'brain-mechanisms', caption: 'One brain, five processes. Mnemos runs each one — and the vitals are simply the brain measuring its own \u201creflect\u201d organ.' },
      { type: 'p', text: 'That is the whole instrument. It is deliberately boring — sums and rates over the belief set, no model in the loop, cheap enough to run on a schedule. The subtlety is entirely in one phrase that appears in every vital: "currently-valid beliefs." Get the definition of that set wrong and every number is quietly off. Which, it turned out, is exactly what happened.' },

      { type: 'h', text: 'Running it turned the vitals red' },
      { type: 'p', text: 'We wired the brain into an agent’s daily loop and let it capture weeks of real work. For a long stretch capture barely ran — a couple of claims a day. Then a change landed that made it capture incrementally, throughout a session rather than only at the end, and it started working properly. "Working properly" meant absorbing the entire transcript. Intake went from around two claims a day to several thousand; on the brain we were watching, thirty-one percent of everything it knew had been created in a single working day.' },
      {
        type: 'stats',
        stats: [
          { value: '~2/day', label: 'claims captured before incremental capture worked' },
          { value: '~4,000/day', label: 'after — the same feature, now actually running' },
          { value: '31%', label: 'of the entire brain created in one working day' },
        ],
      },
      { type: 'p', text: 'Volume is not the problem; a brain is allowed to learn a lot in a day. The problem is what the volume was. We hand-labelled a sample and it came back roughly fifty-eight percent narration — not knowledge. Progress reports, status snapshots, completion announcements. "First test fails." "CI passed in 1m59s." "Merged as abc123." Every one true at the moment it was written, and none true for long. This is the exact thing the vitals are built to assume away: knowledge erodes slowly, so trust and staleness decay over a 90-day horizon. Narration does not erode — it flips, from true to false, the instant something happens. Feed a slow-decay model a stream of instant-flip beliefs and the vitals go red for a real reason and a wrong reason at once.' },

      { type: 'h', text: 'Dissonance: a conversation arguing with itself' },
      { type: 'p', text: 'The vital that flashed hardest was dissonance. Contradiction detection is one of the parts of Mnemos we are proudest of — surfacing a conflict instead of silently overwriting is the whole point of an evidence layer — so a brain full of contradictions reads as alarming, and we started pruning them. Then we stopped and measured what they actually were. Only about a fifth were genuine: two durable beliefs that truly disagreed. The rest had a narration endpoint — the beginning of a conversation lexically colliding with its end, across unrelated sessions.' },
      { type: 'quote', text: '“Both PRs are open” contradicting “PR #23 squash-merged.” “Key suspicion forming: the timeout is 90s” contradicting “Root cause confirmed: the field is unset.” A narrative that moves will always disagree with itself — its start conflicts with its finish. That is not a contradiction. It is progress.' },
      { type: 'p', text: 'Eighty percent of the "contradictions" were an intake problem wearing a detection costume. The detectors were mostly fine; you cannot prune your way out of it, because the next session just makes more. That reframed the work: the fix is not a better detector, it is teaching the brain which of its own utterances are knowledge and which are just narration passing through.' },

      { type: 'h', text: 'The check was counting the wrong set' },
      { type: 'p', text: 'Here is the humbling part, and the reason a whole section of this piece is about measurement rather than memory. Pruning never moved the dissonance number — and it was not because we pruned too little. The vitals were miscounting, in more than one way, each found only by distrusting them. Every one traces back to that innocent phrase: "currently-valid beliefs."' },
      { type: 'p', text: 'A belief in Mnemos can be retired two different ways. You can close its valid-time — forget it, so recall stops surfacing it — or you can deprecate its status — mark it stale while its valid-time stays open. Two mechanisms, one meaning: this belief is no longer current. The health code only knew about the first one. It decided "currently-valid" by valid-time alone and never looked at status. So every deprecated belief still counted as current.' },
      { type: 'p', text: 'That single blind spot surfaced twice, months apart. First in dissonance: it counted contradictions whose endpoints had been deprecated as active, high-stakes conflicts. Retiring a bad belief — the one remedy the tooling offered — moved the number by exactly zero, because the retired belief was still in the count. Two thousand of the flagged edges had an endpoint that no longer existed as a live belief.' },
      { type: 'p', text: 'Then, later and worse, in the vitals themselves. The loop that computes low-trust, staleness, and the orphan check walked every belief with an open valid-time — deprecated ones included. On a 26,000-claim brain that meant 3,379 retired beliefs were being counted as currently-valid, inflating the denominator every rate divides by. And it produced a genuinely maddening symptom: an ungrounded belief that we deprecated specifically to retire it kept raising the "orphan" integrity warning that deprecating it was supposed to clear. There was no way to clear it, because the count could not see that it was gone. The fix, both times, was one clause — a deprecated belief is not a currently-valid one — and it took the brain from degraded to healthy without touching a single piece of data.' },
      { type: 'p', text: 'The third miscount was subtler and about arithmetic. A cleanup pass reported that twenty-eight percent of the claims it examined were narration — low against every hand-count. It was dividing by every claim on its work list, including the ones it had run out of time to look at, counting the unexamined as though they had been judged fine. Over what was actually classified the rate was sixty-one percent: understated by more than half, and it was the exact quantity you would use to decide whether the pass was worth running.' },

      { type: 'h', text: 'And the threshold was never real' },
      { type: 'p', text: 'Fixing the counts moved the numbers to where they should have been all along. But there was one more layer, and it was the foundation. The lines between healthy, degraded, and unhealthy — 0.05 here, 0.40 there — were described in our own design doc as "conservative defaults," with a note that tuning them against real data was the entire purpose of a metrics journal we had built for it. We opened the journal. It was empty. Recording a health snapshot required a flag nothing ever set, so in months of use it had collected precisely zero data points.' },
      { type: 'quote', text: 'We had spent a week reading a system against a red line that was a placeholder, over a set that counted the retired as the living, calibrated on data that was never collected. The badge was real. What it meant was not.' },
      { type: 'p', text: 'So we wired the snapshot to record itself, once a day, without anyone asking. The series is short now; in a few weeks it will be long enough to replace the guessed thresholds with ones drawn from how this brain actually behaves. Only then does "degraded" become a grounded verdict rather than a conservative default. A health metric is only ever as good as the data it was tuned on — and that data is something you collect, on purpose, over time.' },

      { type: 'h', text: 'The discipline underneath: distrust your instruments' },
      { type: 'p', text: 'The measurement bugs were instances of one habit, and the habit is the transferable part. Over and over a fix started with a plausible story and a supporting number, and the honest move was to check the number before believing the story.' },
      { type: 'list', items: [
        'A detector looked broken; a sample of eight pairs "confirmed" it. Re-running over all of them showed the fault was in a different detector entirely. Eight is not a sample; it is an anecdote with error bars.',
        'A rewritten classifier prompt scored a huge jump — ninety-two percent — on the examples it was tuned against, and was indistinguishable from the original on examples it had never seen. That is not an improvement; it is overfitting with a good story attached.',
        'A classification pass reported "zero classified" with no error, which read as a broken model. It was a stale endpoint in a config pointing a cloud client at a local address; every call failed into a safe empty result, and the safety looked like output.',
      ]},
      { type: 'p', text: 'None were hard to catch, and each was cheaper to catch than the work it would have wasted. What they share is that the wrong answer arrived pre-packaged with a reason to believe it. A number that confirms your plan deserves more suspicion than one that contradicts it, not less — and a health metric is nothing but a pile of such numbers about your own system.' },

      { type: 'h', text: 'How the brain actually stays healthy: mark, don’t delete' },
      { type: 'p', text: 'Diagnosis is only half of health; the other half is what you do about it, and here Mnemos makes one load-bearing choice. Knowing most intake was narration, the tempting move is to drop it at the door. We do not. Narration is not wrong — it was true when written — and real knowledge is threaded all through it. Deleting a belief on a misclassification is an invisible loss: you never see the thing you no longer know. So instead of dropping, we mark. Each belief carries a durability — does its value outlive the conversation that produced it? Session-local beliefs stay in the store, stay queryable, and simply stop competing with knowledge: they no longer rank in recall, and they no longer generate contradictions with each other.' },
      { type: 'p', text: 'The safety property that makes this liveable is the same clause the health bugs violated, applied deliberately: unclassified is treated as durable. The entire back catalogue predates the durability field, so absence of a verdict never demotes a belief, and an unrecognised value fails toward keeping a belief in play. Every irreversible step bends toward not losing knowledge — which is exactly the guarantee a memory system exists to make.' },

      { type: 'h', text: 'Measure the model before you trust it, too' },
      { type: 'p', text: 'The classifier that decides durability is itself a measurement instrument, so it got the same treatment. A local model was reliable in one direction and a coin-flip in the other: when it called something session-local it was almost always right; when it called something durable it was right about half the time. That asymmetry is usable — we key the destructive action, suppressing a contradiction, on the reliable direction only, so a mistake leaves a belief exactly where it was.' },
      { type: 'p', text: 'A stronger, hosted model changed the economics: its session-local precision measured between ninety-two and one hundred percent on held-out samples — reliable enough to act on aggressively and safely, and that single number is what let one pass cleanly separate roughly seventeen hundred pieces of narration from knowledge. But we only trusted it because we scored it first, on examples it had never seen, more than once — having already been burned by a model that scored fifty-five percent on a run where every call had silently failed and returned nothing.' },

      { type: 'h', text: 'The brain recovers on its own now' },
      { type: 'p', text: 'A memory system that needs a human to run its maintenance is not really a brain; it is a database with good intentions. So the last piece is the one that makes the rest autonomous. Mnemos already had every organ of consolidation \u2014 dedupe, trust decay, forgetting, reinforcement, replay \u2014 but nothing ran them on a clock, so the day\u2019s narration accumulated and dissonance only ever fell when someone ran a pass by hand. A brain that consolidates only when poked has insomnia.' },
      { type: 'p', text: 'It sleeps now. Once a day, when a session opens after a long enough gap \u2014 the equivalent of waking \u2014 a detached background pass runs the full consolidation, including the classifier that separates the day\u2019s narration from its knowledge and quietly retires the contradictions between passing remarks. Off the critical path, conservative by default, and impossible to get stuck: it forgets only what an outcome refuted, and a corrupt marker fails toward sleeping rather than never sleeping again.' },
      { type: 'diagram', id: 'circadian-dissonance', caption: 'Without a sleep cycle, dissonance ratchets up and stays there. With nightly consolidation it rises through a working day and falls each night \u2014 a rhythm, not a one-way climb.' },
      { type: 'p', text: 'That turns \u201cdegraded by evening, healthy by morning\u201d from a bug into the correct shape of a brain that is used and then rests. The dissonance you see is the honest residue of a working day, and it clears while you are away.' },
      { type: 'h', text: 'What it looks like from the command line' },
      { type: 'p', text: 'None of this is a service you call or a cloud you trust. Mnemos is one Go binary, local-first, and every mechanism in this piece is a subcommand you can run against your own brain. The whole health loop is three of them.' },
      { type: 'p', text: 'The instrument itself is one command, mnemos health. It prints the five vitals, the three integrity checks, and the single rolled-up verdict — the exact numbers this piece has been about.' },
      { type: 'code', lang: 'text', caption: 'A real reading from the brain this piece is about, caught mid-afternoon: dissonance over its line, one orphan — the honest residue of a working day. The sleep pass below clears both by morning.', code: '$ mnemos health --human\n\nBrain health: degraded  (ADR 0019)\n\n  vitals\n    [ ok ]   free_energy   0.142   prediction-error aggregate; most wrong at: dissonance\n    [ ok ]   calibration   0.000   expected calibration error over 0 adjudicated belief(s)\n    [warn]   dissonance    0.142   active high-stakes contradictions per belief\n    [ ok ]   low_trust     0.000   0/24990 valid beliefs below trust 0.30\n    [ ok ]   staleness     0.000   0/24990 valid beliefs unverified in 90 days\n  integrity\n    [warn]   orphan_claims       1   currently-valid beliefs with zero evidence\n    [ ok ]   dangling_edges      0   relationships whose endpoint belief is missing\n    [ ok ]   stale_expectations  0   open predictions past their horizon (unreconciled)' },
      { type: 'p', text: 'The sleep pass is mnemos consolidate. With no flags it just dedupes and refreshes trust; the nightly form turns on the safe organs — forget only what an outcome refuted, reinforce what an outcome validated, tag salience, and clear the day’s session-noise contradictions. It is exactly the command the SessionStart hook fires unattended, once a day.' },
      { type: 'code', lang: 'bash', caption: 'The sleep pass — deterministic but for the LLM narration-clearing at the end, conservative by default, and safe to run by hand or leave to the hook.', href: 'https://github.com/klarlabs-studio/mnemos', hrefLabel: 'Mnemos on GitHub', code: 'mnemos consolidate \\\n  --forget-refuted \\\n  --reinforce-validated \\\n  --salience \\\n  --clear-session-noise' },
      { type: 'p', text: 'Because the intake filters only run going forward, a brain that predates them carries old pollution the nightly pass never revisits. A one-off, mnemos prune --narration, re-runs the current filter over everything already stored and retires what it now recognises as narration — reversibly, through the audited writer, and with a dry run first so you read the verdict before it acts.' },
      { type: 'code', lang: 'text', caption: 'Real output. Every line it flags is a status report or a “let me…” aside — true when written, worthless as a belief. Drop the flag and it deprecates them, reversibly.', code: '$ mnemos prune --narration --dry-run\n\nprunable claims: 21869 (active + contested)\nnarration/junk:  1791 (8.2%) — 1395 active, 396 contested\n  - All checks pass: `tsc --noEmit` clean, `lint` ex…\n  - Let me fix those now, starting with `field.creat…\n  - Let me verify the repo state myself first:\n  - Updating it to the real API contract:\n  … and 1787 more\n\n(dry run — nothing written; re-run without --dry-run to apply)' },
      { type: 'p', text: 'Wiring the loop into an agent is a single command: mnemos init detects the setup and installs the recall, brief, and capture hooks plus the nightly sleep. After that the brain fills, consolidates, and takes its own vitals with nobody at the keyboard.' },

      { type: 'h', text: 'So — is the brain healthy?' },
      { type: 'p', text: 'Now, yes: every vital green, the integrity checks clean, dissonance sitting just under its line. And the remaining contradictions are, for the first time, worth reading — genuine conflicts between durable beliefs, plus a smaller set where a live observation bumps into something the brain holds as settled, which is precisely the signal the vital exists to raise. What was removed was noise; what is left is a question worth a human. But the badge is the least interesting part of the answer. The number moved because we taught the check to count the right set and to tell narration from knowledge — not because the brain underneath ever changed. It was sound the whole time. It was just talking a lot, and we had built a check that could not tell the talking from the knowing.' },
      { type: 'p', text: 'A coda, in the spirit of the thing. We wrote most of this piece the day the brain first read healthy — and then, cleaning up one last stubborn orphan warning, found the second half of the deprecated-belief bug described above, still live, still miscounting the retired as the living. The article’s own lesson, proving itself one more time on the article’s own author. That is the nature of measuring your own system: the check is another part of the system, and it is wrong in the same quiet ways everything else is. Health is not a badge you reach. It is a practice of distrusting your instruments until they earn it.' },
    ],
    cta: {
      heading: 'Give your agents a brain, not a log',
      body: 'Mnemos is MIT-licensed, a single Go binary, and local-first \u2014 the evidence layer, the cognitive processes, the health vitals, and the nightly sleep are all in the box. Point it at your own work, then run `mnemos health` and watch what it has learned.',
      href: 'https://github.com/klarlabs-studio/mnemos',
      label: 'Explore Mnemos on GitHub',
    },
  },
  {
    slug: 'from-store-to-brain',
    title: 'From store to brain',
    dek: 'A memory library that only writes and reads is missing the interesting half. What building the other half — consolidation, forgetting, salience, self-correcting recall, and metacognition — taught us, with no language model in the loop.',
    date: '2026-07-04',
    readingMinutes: 7,
    author: 'Felix Geelhaar',
    accent: '#0891B2',
    tags: ['AI', 'Memory', 'Systems', 'Engineering'],
    blocks: [
      { type: 'p', text: 'Mnemos started as an evidence layer: typed claims, each linked back to the source event that produced it, with contradictions surfaced instead of silently overwritten. That part is useful on its own. But the longer we ran it, the more it looked like a store — something you write to and read from — and less like a memory, which is something that also changes on its own between the writes and the reads.' },
      { type: 'p', text: 'A brain does not just record and recall. While you sleep it consolidates the day into gist, forgets what did not matter, and quietly strengthens what did. At encoding it tags some things as important and lets others fade. At retrieval it notices when it comes up short and looks again. And it flags, loudly, when new evidence contradicts something you were sure of. We spent a stretch building those processes into Mnemos. Here is what we learned — including the parts we got wrong first.' },
      { type: 'diagram', id: 'store-vs-memory', caption: 'A store keeps bytes between a write and a read. A memory runs continuous processes in between — so what it recalls tomorrow depends on the work it did overnight.' },
      { type: 'h', text: 'A store is not a memory system' },
      { type: 'p', text: 'The most useful realisation came early and was slightly humbling: most of the organs of a memory system were already in the codebase, just never wired to run on their own. Trust scoring with half-life decay was there, but only computed at query time. A consolidation routine existed, but as a manual command. A bias-detection pass existed, but ran on demand. Temporal pattern detection was computed and then never read.' },
      { type: 'p', text: 'The lever, over and over, was not "build a new capability" — it was "take the capability you have and make it a process." Schedule the consolidation. Read the temporal signals into the recall path. Turn the one-shot bias check into a standing alert. If you are building a memory system, audit what you already compute and throw away before you add anything new.' },
      { type: 'h', text: 'Forgetting is reduced retrievability, not deletion' },
      { type: 'p', text: 'Forgetting sounds destructive, so it is worth being precise. In Mnemos a forgotten claim is invalidated, not erased: we close its valid-time. Recall stops surfacing it, but the claim and its full history stay in the store — a point-in-time query still shows what was once believed. Forgetting is a drop in retrievability, not a delete. Human-promoted knowledge is never forgotten at all.' },
      { type: 'p', text: 'This is also where we shipped a bug and learned something. Our first forget implementation marked claims deprecated by status. It looked right and did nothing — the forgotten claims kept showing up in recall. The reason: recall filters by valid-time, not by status. Deprecating a claim changed a field nothing downstream read. Closing its validity was what actually removed it from results.' },
      { type: 'quote', text: 'Before you build forgetting, know exactly what your retrieval path filters on. Ours filtered on valid-time; we spent an afternoon changing a field that recall never looked at.' },
      { type: 'p', text: 'The bi-temporal model — separate axes for when a fact was true and when it was recorded — is what makes forgetting safe rather than lossy. You can prune aggressively because nothing is gone; it is only no longer current.' },
      { type: 'h', text: 'Trust and importance are different axes' },
      { type: 'p', text: 'We nearly conflated two things that need to stay separate. Trust answers "is this still true?" and it decays — an unverified claim gets less trustworthy as its evidence ages. Salience answers "does this matter enough to keep, even if I rarely recall it?" and it does not decay. A Sev-1 post-mortem is important the day it is written and important a year later, regardless of how fresh the evidence is.' },
      { type: 'p', text: 'If forgetting keys only on decayed trust, you forget the consequential-but-old — exactly the memories you most want to keep. So salience is a separate, write-time score, computed from signals already on the claim: confidence, how much independent evidence corroborates it, its kind (a decision or a verified test result outweighs a passing remark), source authority. The consolidation pass protects anything sufficiently salient from being forgotten, and prunes only the mundane tail. It is the rule-based analog of the poignancy score other systems ask a language model for — and it costs nothing to compute.' },
      { type: 'diagram', id: 'trust-salience', caption: 'Trust decays with the age of the evidence; salience does not. Forgetting looks at both — so an old, unverified aside is pruned while an old, consequential decision is kept.' },
      { type: 'h', text: 'For hybrid search, fuse ranks, not scores' },
      { type: 'p', text: 'Embedding similarity has a systematic blind spot: exact tokens. A commit SHA, a service name, an error code, a flag — cosine blurs these, because they carry little semantic weight. So a query for a specific identifier can miss the one event that contains it, even with a perfectly good embedder.' },
      { type: 'p', text: 'The fix is hybrid retrieval — run a sparse full-text leg alongside the dense vector leg — but the interesting part is the fusion. The two legs produce incomparable scores: cosine distance and a full-text rank are on different scales, and normalising them is guesswork. Reciprocal Rank Fusion sidesteps this entirely by consuming only ranks.' },
      { type: 'code', code: 'score(result) = Σ  1 / (k + rank_in_leg)      # k ≈ 60, summed over the legs it appears in', caption: 'Reciprocal Rank Fusion: no score calibration, only ranks.' },
      { type: 'p', text: 'No calibration, no tuning, and a result that ranks well in both legs naturally beats one that tops a single leg. It is a two-line idea that removed a whole category of "how do we weight these" bikeshedding.' },
      { type: 'h', text: 'Self-correction has to be bounded and non-regressive' },
      { type: 'p', text: 'When a recall comes back weak — no claims, or low aggregate confidence — the obvious move is to look again: widen the search, relax a filter. But "look again" is how you build an unbounded loop that blows a latency budget, and how you accidentally return a worse answer than the one you had.' },
      { type: 'p', text: 'Two constraints kept it honest. First, bounded: exactly one corrective pass, ever — structurally, not by a timeout. One retry respects a tool-call budget without any deadline plumbing. Second, non-regressive: the corrective answer only replaces the first one if it is strictly better (more claims, or higher confidence), and it never trades a real answer for an empty one. A self-correcting step that can make things worse is a liability; make it provably unable to.' },
      { type: 'p', text: 'And relax the right filters. We widen the corpus and drop the soft trust floor, but we never touch the semantic filters — scope, visibility, point-in-time. Loosening those would return results the caller explicitly excluded, which is not recovering recall, it is answering a different question.' },
      { type: 'h', text: 'Metacognition: surface the contradictions that matter' },
      { type: 'p', text: 'Contradiction detection is table stakes; the metacognitive move is knowing which contradictions deserve a human. When new evidence contradicts a claim nobody vetted, that is ordinary churn. When it contradicts an established belief — one a human promoted, or one that earned high trust — that is the event worth attention: either a settled belief is now wrong, or the new claim is suspect. Mnemos surfaces exactly those, most-established-first.' },
      { type: 'p', text: 'Resolving one taught us the valid-time-versus-status lesson a second time. Retiring a claim means transitioning it to superseded — but that sets a lifecycle field, and our alert query filtered on valid-time, so resolving a conflict left the alert standing. The fix was to make the alert query also treat a superseded side as resolved. Same shape of bug as forgetting: a write that changes a field the read never consults does nothing you can see. It is worth writing down which field each query keys on, and checking every mutation against it.' },
      { type: 'h', text: 'The constraint that shaped all of it: no model in the loop' },
      { type: 'p', text: 'Every one of these runs with no language model. Salience is a weighting rule, not an LLM importance rating. Consolidation is embedding similarity plus deterministic merges. Contradiction detection is rule-based across polarity, numeric, entity, and temporal axes. That was a deliberate constraint, and it did more to shape the design than any feature decision.' },
      { type: 'p', text: 'Determinism means the memory layer is self-hostable, reproducible, and free to run — no per-operation billing on your own recall, no data leaving your infrastructure, no third service to be down at 3 a.m. It also forces a certain honesty: you cannot hand-wave that the model will figure out what is important. You have to say, in code, what important means. Writing those rules down turned out to be clarifying rather than limiting.' },
      { type: 'p', text: 'We leaned on neuroscience for the shape of it — complementary learning systems for the hippocampus-to-neocortex consolidation, synaptic renormalisation for the pruning of weak traces, salience gating for write-time importance, the hypercorrection effect for the intuition that high-confidence errors correct hardest — and cross-checked each against how leading agent-memory systems approach the same problems. But the implementations are boring on purpose: SQL, rank fusion, a scheduled job. A brain worth of behaviour does not require a brain worth of magic.' },
    ],
    cta: {
      heading: 'Mnemos is open source',
      body: 'MIT-licensed, a single Go binary, and it runs entirely on your infrastructure. The cognitive layer described here — consolidation, forgetting, salience, hybrid and corrective retrieval, hypercorrection — is all in the box.',
      href: 'https://github.com/klarlabs-studio/mnemos',
      label: 'View Mnemos on GitHub',
    },
  },
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
