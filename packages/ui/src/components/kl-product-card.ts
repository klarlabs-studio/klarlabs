import { LitElement, html, css, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { focusRing, labelType, reducedMotion } from '../styles/shared.js';

export type KlProductStatus = 'live' | 'beta' | 'coming-soon';

const STATUS_LABEL: Record<KlProductStatus, string> = {
  live: 'Live',
  beta: 'Beta',
  'coming-soon': 'Coming soon',
};

/**
 * Klarlabs product card — showcases a product on the studio landing page.
 * Hover: teal border + slight lift, border-inline-start accent.
 *
 * @csspart container - The anchor container
 * @csspart name - Product name
 * @csspart description - Product description
 * @csspart status - Status badge
 * @cssprop --kl-product-card-padding - Inner padding
 */
@customElement('kl-product-card')
export class KlProductCard extends LitElement {
  static override styles = [
    focusRing,
    labelType,
    reducedMotion,
    css`
      :host {
        display: block;
      }

      .card {
        display: grid;
        grid-template-columns: auto 1fr auto;
        grid-template-areas:
          'logo head arrow'
          'logo desc arrow';
        column-gap: var(--kl-space-4, 1rem);
        row-gap: var(--kl-space-1, 0.25rem);
        align-items: start;
        padding: var(--kl-product-card-padding, var(--kl-space-5, 1.25rem));
        background: var(--kl-surface-raised, #fafafa);
        border: 1px solid var(--kl-border, #e4e4e7);
        border-inline-start: 2px solid var(--kl-border, #e4e4e7);
        border-radius: var(--kl-radius-lg, 0.75rem);
        text-decoration: none;
        color: inherit;
        transition:
          border-color var(--kl-duration-fast, 150ms) var(--kl-ease-default, ease),
          transform var(--kl-duration-fast, 150ms) var(--kl-ease-default, ease),
          box-shadow var(--kl-duration-fast, 150ms) var(--kl-ease-default, ease);
      }

      .card:hover {
        border-color: var(--kl-accent, #0d9488);
        border-inline-start-color: var(--kl-accent, #0d9488);
        box-shadow: var(--kl-shadow-md, 0 4px 6px -1px rgb(0 0 0 / 0.07));
        transform: translateY(-2px);
      }

      .logo {
        grid-area: logo;
        inline-size: 40px;
        block-size: 40px;
        border-radius: var(--kl-radius-md, 0.5rem);
        object-fit: contain;
        background: var(--kl-surface-muted, #f4f4f5);
      }

      .logo-fallback {
        display: grid;
        place-items: center;
        font-family: var(--kl-font-mono, 'DM Mono', monospace);
        font-size: var(--kl-text-md, 1.25rem);
        color: var(--kl-accent, #0d9488);
      }

      .head {
        grid-area: head;
        display: flex;
        align-items: center;
        gap: var(--kl-space-3, 0.75rem);
        min-block-size: 1.5rem;
      }

      .name {
        font-family: var(--kl-font-sans, 'DM Sans', system-ui, sans-serif);
        font-size: var(--kl-text-base, 1rem);
        font-weight: var(--kl-weight-semibold, 600);
        letter-spacing: var(--kl-tracking-normal, -0.01em);
        color: var(--kl-ink, #0a0a0b);
      }

      .kl-label {
        border: 1px solid;
        border-radius: var(--kl-radius-full, 9999px);
        padding: 0.125rem var(--kl-space-2, 0.5rem);
        line-height: 1.4;
        white-space: nowrap;
      }
      .status-live {
        color: var(--kl-accent, #0d9488);
        border-color: var(--kl-accent-border, #0d948840);
        background: var(--kl-accent-dim, #0d948820);
      }
      .status-beta {
        color: var(--kl-warning, #d97706);
        border-color: color-mix(in srgb, var(--kl-warning, #d97706) 25%, transparent);
        background: color-mix(in srgb, var(--kl-warning, #d97706) 12%, transparent);
      }
      .status-coming-soon {
        color: var(--kl-ink-tertiary, #71717a);
        border-color: var(--kl-border-strong, #d4d4d8);
        background: transparent;
      }

      .description {
        grid-area: desc;
        margin: 0;
        font-size: var(--kl-text-sm, 0.8rem);
        line-height: var(--kl-leading-snug, 1.4);
        color: var(--kl-ink-secondary, #3f3f46);
      }

      .arrow {
        grid-area: arrow;
        align-self: center;
        color: var(--kl-ink-tertiary, #71717a);
        transition:
          color var(--kl-duration-fast, 150ms) var(--kl-ease-default, ease),
          translate var(--kl-duration-fast, 150ms) var(--kl-ease-default, ease);
      }

      .card:hover .arrow {
        color: var(--kl-accent, #0d9488);
        translate: 2px 0;
      }
    `,
  ];

  /** Product name. */
  @property({ type: String }) name = '';

  /** One-sentence description. */
  @property({ type: String }) description = '';

  /** Link target. */
  @property({ type: String }) href = '';

  /** Logo image URL (40×40). Falls back to first letter. */
  @property({ type: String, attribute: 'logo-src' }) logoSrc = '';

  /** Product status. */
  @property({ type: String, reflect: true }) status: KlProductStatus = 'live';

  override render() {
    const statusLabel = STATUS_LABEL[this.status] ?? this.status;
    return html`
      <a class="card" part="container" href=${this.href || nothing}>
        ${this.logoSrc
          ? html`<img class="logo" src=${this.logoSrc} alt="" width="40" height="40" />`
          : html`<span class="logo logo-fallback" aria-hidden="true"
              >${this.name.charAt(0).toUpperCase()}</span
            >`}
        <span class="head">
          <span class="name" part="name">${this.name}</span>
          <span class="kl-label status-${this.status}" part="status">${statusLabel}</span>
        </span>
        <p class="description" part="description">${this.description}</p>
        <span class="arrow" aria-hidden="true">→</span>
      </a>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kl-product-card': KlProductCard;
  }
}
