import { LitElement, html, css, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { focusRing, labelType, reducedMotion } from '../styles/shared.js';

export type KlProductStatus = 'live' | 'beta' | 'coming-soon';

const STATUS_LABEL: Record<KlProductStatus, string> = {
  live: 'Live',
  beta: 'Public Beta',
  'coming-soon': 'Coming Soon',
};

/**
 * Klarlabs product card — v2 layout: icon top-left, status badge
 * top-right, name, two-line description, "Explore →" footer link.
 * Hover: teal border + slight lift + shadow.
 *
 * @csspart container - The anchor container
 * @csspart name - Product name
 * @csspart description - Product description
 * @csspart status - Status badge
 * @csspart explore - Footer link row
 * @cssprop --kl-product-card-padding - Inner padding
 * @cssprop --kl-product-card-accent - Per-product accent (icon tint)
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
        display: flex;
        flex-direction: column;
        gap: var(--kl-space-3, 0.75rem);
        block-size: 100%;
        box-sizing: border-box;
        padding: var(--kl-product-card-padding, var(--kl-space-6, 1.5rem));
        background: var(--kl-surface-raised, #fafafa);
        border: 1px solid var(--kl-border, #e4e4e7);
        border-radius: var(--kl-radius-xl, 1rem);
        text-decoration: none;
        color: inherit;
        transition:
          border-color var(--kl-duration-normal, 250ms) var(--kl-ease-default, ease),
          transform var(--kl-duration-normal, 250ms) var(--kl-ease-default, ease),
          box-shadow var(--kl-duration-normal, 250ms) var(--kl-ease-default, ease);
      }

      .card:hover {
        border-color: var(--kl-accent-border, color-mix(in srgb, #0d9488 30%, transparent));
        box-shadow: var(--kl-shadow-md, 0 4px 6px -1px rgb(0 0 0 / 0.07));
        transform: translateY(-2px);
      }

      .top {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: var(--kl-space-3, 0.75rem);
      }

      .logo {
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
        color: var(--kl-product-card-accent, var(--kl-accent, #0d9488));
      }

      .kl-label {
        border-radius: var(--kl-radius-full, 9999px);
        padding: 2px var(--kl-space-2, 0.5rem);
        line-height: 1.4;
        white-space: nowrap;
      }
      .status-live {
        color: var(--kl-accent, #0d9488);
        background: var(--kl-accent-dim, color-mix(in srgb, #0d9488 12%, transparent));
      }
      .status-beta {
        color: var(--kl-warning, #d97706);
        background: var(--kl-warning-dim, color-mix(in srgb, #d97706 10%, transparent));
      }
      .status-coming-soon {
        color: var(--kl-ink-tertiary, #71717a);
        background: var(--kl-surface-muted, #f4f4f5);
      }

      .name {
        font-family: var(--kl-font-sans, 'DM Sans', system-ui, sans-serif);
        font-size: var(--kl-text-md, 1.25rem);
        font-weight: var(--kl-weight-semibold, 600);
        letter-spacing: var(--kl-tracking-normal, -0.01em);
        color: var(--kl-ink, #0a0a0b);
      }

      .description {
        margin: 0;
        font-family: var(--kl-font-sans, 'DM Sans', system-ui, sans-serif);
        font-size: var(--kl-text-sm, 0.8rem);
        line-height: var(--kl-leading-snug, 1.4);
        color: var(--kl-ink-secondary, #3f3f46);
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        flex: 1;
      }

      .explore {
        display: inline-flex;
        align-items: center;
        gap: var(--kl-space-1, 0.25rem);
        font-family: var(--kl-font-sans, 'DM Sans', system-ui, sans-serif);
        font-size: var(--kl-text-sm, 0.8rem);
        font-weight: var(--kl-weight-medium, 500);
        color: var(--kl-accent, #0d9488);
      }

      .explore .arrow {
        transition: translate var(--kl-duration-fast, 150ms) var(--kl-ease-default, ease);
      }

      .card:hover .explore .arrow {
        translate: 2px 0;
      }
    `,
  ];

  /** Product name. */
  @property({ type: String }) name = '';

  /** One-sentence description (clamped to 2 lines). */
  @property({ type: String }) description = '';

  /** Link target. */
  @property({ type: String }) href = '';

  /** Logo image URL (40×40). Falls back to first letter. */
  @property({ type: String, attribute: 'logo-src' }) logoSrc = '';

  /** Product status. */
  @property({ type: String, reflect: true }) status: KlProductStatus = 'live';

  /** Footer link label. */
  @property({ type: String, attribute: 'explore-label' }) exploreLabel = 'Explore';

  override render() {
    const statusLabel = STATUS_LABEL[this.status] ?? this.status;
    return html`
      <a class="card" part="container" href=${this.href || nothing}>
        <span class="top">
          ${this.logoSrc
            ? html`<img class="logo" src=${this.logoSrc} alt="" width="40" height="40" />`
            : html`<span class="logo logo-fallback" aria-hidden="true"
                >${this.name.charAt(0).toUpperCase()}</span
              >`}
          <span class="kl-label status-${this.status}" part="status">${statusLabel}</span>
        </span>
        <span class="name" part="name">${this.name}</span>
        <p class="description" part="description">${this.description}</p>
        <span class="explore" part="explore"
          >${this.exploreLabel} <span class="arrow" aria-hidden="true">→</span></span
        >
      </a>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kl-product-card': KlProductCard;
  }
}
