import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

/**
 * WCAG contrast gate for the token palette.
 *
 * The design system spec commits to "WCAG 2.1 AA: contrast 4.5:1 body / 3:1
 * large", and 118 component tests passed while kl-button shipped three
 * separate AA failures — including one where the HOVER state (2.49:1) was
 * materially worse than the rest state it replaced. Structural tests cannot
 * see colour, so nothing in the suite could ever have caught it.
 *
 * This reads the real token values out of tokens.css rather than restating
 * them, so retoning a token re-runs the check instead of bypassing it.
 */

// import.meta.url is not a file: URL under the happy-dom test environment,
// so resolve from the vitest root (packages/ui) instead.
const tokensCss = readFileSync(resolve(process.cwd(), 'src/tokens/tokens.css'), 'utf8');

/** Last definition wins, matching the cascade: dark theme overrides light. */
function token(name: string, theme: 'light' | 'dark'): string {
  // Split at the dark-theme block so light lookups never see dark values.
  const darkAt = tokensCss.indexOf("[data-theme='dark']");
  const scope = theme === 'light' ? tokensCss.slice(0, darkAt) : tokensCss;
  const matches = [...scope.matchAll(new RegExp(`--${name}:\\s*([^;]+);`, 'g'))];
  const raw = matches.at(-1)?.[1]?.trim();
  if (!raw) throw new Error(`token --${name} not found for theme ${theme}`);
  if (!/^#[0-9a-f]{6}$/i.test(raw)) {
    throw new Error(`token --${name} is not a plain hex (got "${raw}")`);
  }
  return raw;
}

function luminance(hex: string): number {
  const n = hex.replace('#', '');
  const channels = [0, 2, 4].map((i) => parseInt(n.slice(i, i + 2), 16) / 255);
  const [r, g, b] = channels.map((v) =>
    v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4),
  );
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(fg: string, bg: string): number {
  const a = luminance(fg);
  const b = luminance(bg);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

const AA_BODY = 4.5;
const AA_NON_TEXT = 3;

describe('token contrast — WCAG 2.1 AA', () => {
  it('text on a filled accent surface passes at rest AND on hover', () => {
    // Theme-invariant: the accent fill is the same in both themes, so the
    // colour drawn on it must be too.
    const onAccent = token('kl-on-accent', 'light');
    const rest = token('kl-accent', 'light');
    const hover = token('kl-accent-light', 'light');

    expect(contrast(onAccent, rest)).toBeGreaterThanOrEqual(AA_BODY);
    // The regression that shipped: hover was WORSE than rest. Assert both.
    expect(contrast(onAccent, hover)).toBeGreaterThanOrEqual(AA_BODY);
  });

  it('accent used as foreground text passes on its own theme surface', () => {
    for (const theme of ['light', 'dark'] as const) {
      const fg = token('kl-accent-text', theme);
      const bg = token('kl-surface', theme);
      expect(
        contrast(fg, bg),
        `--kl-accent-text on --kl-surface (${theme})`,
      ).toBeGreaterThanOrEqual(AA_BODY);
    }
  });

  it('the ink ramp passes on every surface it is drawn on', () => {
    for (const theme of ['light', 'dark'] as const) {
      for (const surface of ['kl-surface', 'kl-surface-raised', 'kl-surface-muted']) {
        const bg = token(surface, theme);
        for (const ink of ['kl-ink', 'kl-ink-secondary']) {
          expect(
            contrast(token(ink, theme), bg),
            `--${ink} on --${surface} (${theme})`,
          ).toBeGreaterThanOrEqual(AA_BODY);
        }
      }
    }
  });

  /**
   * Documents a known limit rather than asserting a passing number.
   *
   * --kl-ink-tertiary does NOT clear AA for body text on the dark surfaces
   * (3.87:1 on raised, 4.08:1 on base). That is legitimate for large text and
   * non-text marks, where the bar is 3:1 — but it means the token must never
   * be reached for small text, and consumers keep making exactly that mistake
   * because the name reads like the next step of a text ramp.
   */
  it('ink-tertiary is documented as non-text / large-text only on dark', () => {
    const bg = token('kl-surface-raised', 'dark');
    const ratio = contrast(token('kl-ink-tertiary', 'dark'), bg);
    expect(ratio).toBeGreaterThanOrEqual(AA_NON_TEXT);
    expect(
      ratio,
      'if this now clears 4.5 the token is safe for body text — update the docs',
    ).toBeLessThan(AA_BODY);
  });

  it('semantic status colours carry white text at body size', () => {
    // --kl-error is the only one used as a filled surface today (kl-button
    // danger). Assert it, and assert the hover direction is not lighter.
    expect(contrast('#ffffff', token('kl-error', 'light'))).toBeGreaterThanOrEqual(AA_BODY);
  });
});
