import { LitElement, html, css, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { focusRing, reducedMotion } from '../styles/shared.js';

export type KlToastVariant = 'default' | 'accent' | 'success' | 'warning' | 'error';

/**
 * Klarlabs toast — notification item.
 * Stack instances inside a fixed-position container (e.g. a simple
 * `position: fixed; inset-block-end/inline-end` flex column at
 * `--kl-z-toast`). Auto-dismisses after `duration` ms (0 = sticky).
 *
 * @slot - Toast message
 * @slot title - Optional bold title above the message
 * @csspart toast - The toast container
 * @csspart dismiss - The dismiss button
 * @fires kl-dismiss - Fired when the toast closes (auto or manual)
 * @cssprop --kl-toast-bg - Background override
 */
@customElement('kl-toast')
export class KlToast extends LitElement {
  static override styles = [
    focusRing,
    reducedMotion,
    css`
      :host {
        display: none;
        --_accent: var(--kl-ink-tertiary, #71717a);
      }

      :host([open]) {
        display: block;
      }

      :host([variant='accent']) {
        --_accent: var(--kl-accent, #0d9488);
      }
      :host([variant='success']) {
        --_accent: var(--kl-success, #16a34a);
      }
      :host([variant='warning']) {
        --_accent: var(--kl-warning, #d97706);
      }
      :host([variant='error']) {
        --_accent: var(--kl-error, #dc2626);
      }

      .toast {
        display: flex;
        align-items: flex-start;
        gap: var(--kl-space-3, 0.75rem);
        background: var(--kl-toast-bg, var(--kl-surface-raised, #fafafa));
        border: 1px solid var(--kl-border-strong, #d4d4d8);
        border-inline-start: 3px solid var(--_accent);
        border-radius: var(--kl-radius-md, 0.5rem);
        box-shadow: var(--kl-shadow-lg, 0 10px 15px -3px rgb(0 0 0 / 0.08));
        padding: var(--kl-space-3, 0.75rem) var(--kl-space-4, 1rem);
        max-inline-size: var(--kl-content-xs, 20rem);
        animation: slide-in var(--kl-duration-normal, 250ms) var(--kl-ease-default, ease);
      }

      @keyframes slide-in {
        from {
          opacity: 0;
          translate: 0 8px;
        }
        to {
          opacity: 1;
          translate: 0 0;
        }
      }

      .content {
        flex: 1;
        font-family: var(--kl-font-sans, 'DM Sans', system-ui, sans-serif);
        font-size: var(--kl-text-sm, 0.8rem);
        line-height: var(--kl-leading-snug, 1.4);
        color: var(--kl-ink-secondary, #3f3f46);
      }

      .title {
        display: block;
        font-weight: var(--kl-weight-semibold, 600);
        color: var(--kl-ink, #0a0a0b);
        margin-block-end: var(--kl-space-1, 0.25rem);
      }

      .title:not(.has-content) {
        display: none;
      }

      .dismiss {
        display: grid;
        place-items: center;
        inline-size: 1.5rem;
        block-size: 1.5rem;
        flex: none;
        background: transparent;
        border: none;
        border-radius: var(--kl-radius-sm, 0.25rem);
        color: var(--kl-ink-tertiary, #71717a);
        cursor: pointer;
        padding: 0;
        font-size: var(--kl-text-sm, 0.8rem);
        transition: color var(--kl-duration-fast, 150ms) var(--kl-ease-default, ease);
      }

      .dismiss:hover {
        color: var(--kl-ink, #0a0a0b);
      }
    `,
  ];

  /** Visual variant — colors the inline-start accent bar. */
  @property({ type: String, reflect: true }) variant: KlToastVariant = 'default';

  /** Visibility. */
  @property({ type: Boolean, reflect: true }) open = false;

  /** Auto-dismiss after N milliseconds. 0 disables. */
  @property({ type: Number }) duration = 5000;

  /** Show a dismiss button. */
  @property({ type: Boolean }) dismissible = true;

  private timer?: ReturnType<typeof setTimeout>;

  protected override updated(changed: Map<string, unknown>) {
    if (changed.has('open') || changed.has('duration')) {
      clearTimeout(this.timer);
      if (this.open && this.duration > 0) {
        this.timer = setTimeout(() => this.dismiss(), this.duration);
      }
    }
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    clearTimeout(this.timer);
  }

  /** Close the toast and emit kl-dismiss. */
  dismiss() {
    if (!this.open) return;
    this.open = false;
    clearTimeout(this.timer);
    this.dispatchEvent(new CustomEvent('kl-dismiss', { bubbles: true, composed: true }));
  }

  private handleTitleSlot(e: Event) {
    const slot = e.target as HTMLSlotElement;
    slot.parentElement?.classList.toggle('has-content', slot.assignedNodes().length > 0);
  }

  override render() {
    const role = this.variant === 'error' || this.variant === 'warning' ? 'alert' : 'status';
    return html`
      <div class="toast" part="toast" role=${role}>
        <div class="content">
          <span class="title ${this.querySelector('[slot="title"]') ? 'has-content' : ''}">
            <slot name="title" @slotchange=${this.handleTitleSlot}></slot>
          </span>
          <slot></slot>
        </div>
        ${this.dismissible
          ? html`
              <button class="dismiss" part="dismiss" aria-label="Dismiss" @click=${this.dismiss}>
                ✕
              </button>
            `
          : nothing}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kl-toast': KlToast;
  }
}
