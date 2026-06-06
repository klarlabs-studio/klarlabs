import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

export type KlBadgeVariant = 'default' | 'accent' | 'success' | 'warning' | 'error' | 'neutral';
export type KlBadgeSize = 'sm' | 'md';

/**
 * Klarlabs badge — inline status label. Always uppercase.
 *
 * @slot - Badge text
 * @csspart badge - The badge element
 * @cssprop --kl-badge-bg - Background override
 * @cssprop --kl-badge-color - Text color override
 */
@customElement('kl-badge')
export class KlBadge extends LitElement {
  static override styles = css`
    :host {
      display: inline-flex;
      --_bg: var(--kl-badge-bg, var(--kl-surface-muted, #f4f4f5));
      --_color: var(--kl-badge-color, var(--kl-ink-secondary, #3f3f46));
      --_border: var(--kl-border, #e4e4e7);
    }

    :host([variant='accent']) {
      --_bg: var(--kl-accent-dim, #0d948820);
      --_color: var(--kl-accent, #0d9488);
      --_border: var(--kl-accent-border, #0d948840);
    }

    :host([variant='success']) {
      --_bg: color-mix(in srgb, var(--kl-success, #16a34a) 12%, transparent);
      --_color: var(--kl-success, #16a34a);
      --_border: color-mix(in srgb, var(--kl-success, #16a34a) 25%, transparent);
    }

    :host([variant='warning']) {
      --_bg: color-mix(in srgb, var(--kl-warning, #d97706) 12%, transparent);
      --_color: var(--kl-warning, #d97706);
      --_border: color-mix(in srgb, var(--kl-warning, #d97706) 25%, transparent);
    }

    :host([variant='error']) {
      --_bg: color-mix(in srgb, var(--kl-error, #dc2626) 12%, transparent);
      --_color: var(--kl-error, #dc2626);
      --_border: color-mix(in srgb, var(--kl-error, #dc2626) 25%, transparent);
    }

    :host([variant='neutral']) {
      --_bg: transparent;
      --_color: var(--kl-ink-tertiary, #71717a);
      --_border: var(--kl-border-strong, #d4d4d8);
    }

    .badge {
      display: inline-flex;
      align-items: center;
      gap: var(--kl-space-1, 0.25rem);
      background: var(--_bg);
      color: var(--_color);
      border: 1px solid var(--_border);
      border-radius: var(--kl-radius-full, 9999px);
      font-family: var(--kl-font-sans, 'DM Sans', system-ui, sans-serif);
      font-size: var(--kl-text-xs, 0.64rem);
      font-weight: var(--kl-weight-medium, 500);
      letter-spacing: var(--kl-tracking-label, 0.08em);
      text-transform: uppercase;
      line-height: 1;
      padding: var(--kl-space-1, 0.25rem) var(--kl-space-3, 0.75rem);
      white-space: nowrap;
    }

    :host([size='sm']) .badge {
      padding: 0.125rem var(--kl-space-2, 0.5rem);
    }
  `;

  /** Visual variant. */
  @property({ type: String, reflect: true }) variant: KlBadgeVariant = 'default';

  /** Size. */
  @property({ type: String, reflect: true }) size: KlBadgeSize = 'md';

  override render() {
    return html`<span class="badge" part="badge"><slot></slot></span>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kl-badge': KlBadge;
  }
}
