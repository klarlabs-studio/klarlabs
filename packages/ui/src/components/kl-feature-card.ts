import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

/**
 * Klarlabs feature card — product Unterseiten feature highlight.
 * Raised surface with a 2px accent inline-start border.
 *
 * @slot icon - 24×24 icon (rendered in the accent color)
 * @slot - Body copy
 * @csspart card - The card container
 * @csspart heading - Feature heading
 * @csspart body - Body wrapper
 * @cssprop --kl-feature-accent - Accent override (per-product accent)
 */
@customElement('kl-feature-card')
export class KlFeatureCard extends LitElement {
  static override styles = css`
    :host {
      display: block;
      --_accent: var(--kl-feature-accent, var(--kl-accent, #0d9488));
    }

    .card {
      block-size: 100%;
      box-sizing: border-box;
      background: var(--kl-surface-raised, #fafafa);
      border: 1px solid var(--kl-border, #e4e4e7);
      border-inline-start: 2px solid var(--_accent);
      border-radius: var(--kl-radius-lg, 0.75rem);
      padding: var(--kl-space-5, 1.25rem);
      display: flex;
      flex-direction: column;
      gap: var(--kl-space-3, 0.75rem);
    }

    .icon {
      display: inline-flex;
      inline-size: 24px;
      block-size: 24px;
      color: var(--_accent);
    }

    .icon ::slotted(*) {
      inline-size: 24px;
      block-size: 24px;
    }

    .heading {
      font-family: var(--kl-font-sans, 'DM Sans', system-ui, sans-serif);
      font-size: var(--kl-text-base, 1rem);
      font-weight: var(--kl-weight-semibold, 600);
      color: var(--kl-ink, #0a0a0b);
    }

    .body {
      font-family: var(--kl-font-sans, 'DM Sans', system-ui, sans-serif);
      font-size: var(--kl-text-sm, 0.8rem);
      line-height: var(--kl-leading-normal, 1.6);
      color: var(--kl-ink-secondary, #3f3f46);
    }
  `;

  /** Feature heading. */
  @property({ type: String }) heading = '';

  override render() {
    return html`
      <div class="card" part="card">
        <span class="icon" aria-hidden="true"><slot name="icon"></slot></span>
        <span class="heading" part="heading">${this.heading}</span>
        <div class="body" part="body"><slot></slot></div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kl-feature-card': KlFeatureCard;
  }
}
