import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { labelType } from '../styles/shared.js';

export type KlDividerOrientation = 'horizontal' | 'vertical';

/**
 * Klarlabs divider — section separator, optional centered label.
 *
 * @slot - Optional label centered on the line (horizontal only)
 * @csspart divider - The separator container
 * @cssprop --kl-divider-color - Line color
 * @cssprop --kl-divider-spacing - Block margin (horizontal) / inline margin (vertical)
 */
@customElement('kl-divider')
export class KlDivider extends LitElement {
  static override styles = [
    labelType,
    css`
      :host {
        display: block;
        --_color: var(--kl-divider-color, var(--kl-border, #e4e4e7));
      }

      :host([orientation='vertical']) {
        display: inline-block;
        align-self: stretch;
        block-size: auto;
      }

      .divider {
        display: flex;
        align-items: center;
        gap: var(--kl-space-4, 1rem);
        margin-block: var(--kl-divider-spacing, var(--kl-space-6, 1.5rem));
      }

      .divider::before,
      .divider::after {
        content: '';
        flex: 1;
        border-block-start: 1px solid var(--_color);
      }

      /* Without a label, collapse to a single line */
      .divider.plain::after {
        display: none;
      }
      .divider.plain {
        gap: 0;
      }

      :host([orientation='vertical']) .divider {
        block-size: 100%;
        min-block-size: 1.5em;
        margin-block: 0;
        margin-inline: var(--kl-divider-spacing, var(--kl-space-4, 1rem));
      }

      :host([orientation='vertical']) .divider::before {
        flex: none;
        block-size: 100%;
        border-block-start: none;
        border-inline-start: 1px solid var(--_color);
      }

      .kl-label {
        color: var(--kl-ink-tertiary, #71717a);
        white-space: nowrap;
      }
    `,
  ];

  /** Orientation. */
  @property({ type: String, reflect: true }) orientation: KlDividerOrientation = 'horizontal';

  private hasLabel(): boolean {
    return this.childNodes.length > 0 && (this.textContent ?? '').trim().length > 0;
  }

  private handleSlotChange = () => {
    this.requestUpdate();
  };

  override render() {
    const labelled = this.orientation === 'horizontal' && this.hasLabel();
    return html`
      <div
        class="divider ${labelled ? '' : 'plain'}"
        part="divider"
        role="separator"
        aria-orientation=${this.orientation}
      >
        ${labelled
          ? html`<span class="kl-label"><slot @slotchange=${this.handleSlotChange}></slot></span>`
          : html`<slot hidden @slotchange=${this.handleSlotChange}></slot>`}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kl-divider': KlDivider;
  }
}
