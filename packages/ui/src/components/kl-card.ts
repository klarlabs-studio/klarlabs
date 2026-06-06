import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { focusRing, reducedMotion } from '../styles/shared.js';

export type KlCardVariant = 'default' | 'outlined' | 'elevated' | 'interactive';

/**
 * Klarlabs card — clean content container.
 *
 * @slot - Body content
 * @slot header - Card header
 * @slot media - Full-bleed media above header
 * @slot footer - Card footer
 * @csspart container - Outer container
 * @csspart header - Header wrapper
 * @csspart body - Body wrapper
 * @csspart footer - Footer wrapper
 * @cssprop --kl-card-padding - Inner padding
 * @cssprop --kl-card-radius - Border radius
 * @cssprop --kl-card-bg - Background
 */
@customElement('kl-card')
export class KlCard extends LitElement {
  static override styles = [
    focusRing,
    reducedMotion,
    css`
      :host {
        display: block;
        container-type: inline-size;
        container-name: card;
      }

      .card {
        background: var(--kl-card-bg, var(--kl-surface-raised, #fafafa));
        border: 1px solid var(--kl-border, #e4e4e7);
        border-radius: var(--kl-card-radius, var(--kl-radius-lg, 0.75rem));
        overflow: hidden;
        transition:
          border-color var(--kl-duration-fast, 150ms) var(--kl-ease-default, ease),
          box-shadow var(--kl-duration-fast, 150ms) var(--kl-ease-default, ease),
          transform var(--kl-duration-fast, 150ms) var(--kl-ease-default, ease);
      }

      :host([variant='outlined']) .card {
        background: transparent;
        border-color: var(--kl-border-strong, #d4d4d8);
      }

      :host([variant='elevated']) .card {
        border-color: transparent;
        box-shadow: var(--kl-shadow-md, 0 4px 6px -1px rgb(0 0 0 / 0.07));
      }

      :host([variant='interactive']) .card {
        cursor: pointer;
      }

      :host([variant='interactive']) .card:hover {
        border-color: var(--kl-accent, #0d9488);
        box-shadow: var(--kl-shadow-lg, 0 10px 15px -3px rgb(0 0 0 / 0.08));
        transform: translateY(-2px);
      }

      .media ::slotted(*) {
        display: block;
        inline-size: 100%;
      }

      .header {
        padding: var(--kl-card-padding, var(--kl-space-5, 1.25rem));
        padding-block-end: 0;
        font-weight: var(--kl-weight-semibold, 600);
        color: var(--kl-ink, #0a0a0b);
      }

      .body {
        padding: var(--kl-card-padding, var(--kl-space-5, 1.25rem));
        color: var(--kl-ink-secondary, #3f3f46);
        line-height: var(--kl-leading-normal, 1.6);
      }

      .footer {
        padding: var(--kl-card-padding, var(--kl-space-5, 1.25rem));
        padding-block-start: 0;
        display: flex;
        align-items: center;
        gap: var(--kl-space-3, 0.75rem);
      }

      /* Hide empty wrappers so padding never collapses content */
      .header:not(.has-content),
      .footer:not(.has-content) {
        display: none;
      }
    `,
  ];

  /** Visual variant. */
  @property({ type: String, reflect: true }) variant: KlCardVariant = 'default';

  private hasSlotted(name: string): boolean {
    return this.querySelector(`[slot="${name}"]`) !== null;
  }

  private handleSlotChange = () => {
    this.requestUpdate();
  };

  override render() {
    return html`
      <div class="card" part="container">
        <div class="media" part="media">
          <slot name="media"></slot>
        </div>
        <div class="header ${this.hasSlotted('header') ? 'has-content' : ''}" part="header">
          <slot name="header" @slotchange=${this.handleSlotChange}></slot>
        </div>
        <div class="body" part="body">
          <slot></slot>
        </div>
        <div class="footer ${this.hasSlotted('footer') ? 'has-content' : ''}" part="footer">
          <slot name="footer" @slotchange=${this.handleSlotChange}></slot>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kl-card': KlCard;
  }
}
