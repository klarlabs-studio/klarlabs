import { css } from 'lit';

/** Visible teal focus ring — WCAG 2.4.7. */
export const focusRing = css`
  :focus-visible {
    outline: 2px solid var(--kl-accent, #0d9488);
    outline-offset: 2px;
  }
`;

/** Kill animation/transition under prefers-reduced-motion. */
export const reducedMotion = css`
  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      animation-duration: 0.01ms !important;
      transition-duration: 0.01ms !important;
      transform: none !important;
    }
  }
`;

/** Uppercase label typography — DM Sans 500, tracking 0.08em. */
export const labelType = css`
  .kl-label {
    font-family: var(--kl-font-sans, 'DM Sans', system-ui, sans-serif);
    font-size: var(--kl-text-xs, 0.64rem);
    font-weight: var(--kl-weight-medium, 500);
    letter-spacing: var(--kl-tracking-label, 0.08em);
    text-transform: uppercase;
  }
`;
