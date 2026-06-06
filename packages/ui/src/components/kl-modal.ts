import { LitElement, html, css } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { focusRing, reducedMotion } from '../styles/shared.js';

/**
 * Klarlabs modal — dialog built on native `<dialog>`.
 * Native focus trap, Escape close, ::backdrop. Open via the `open`
 * property/attribute or the `show()` method.
 *
 * @slot - Modal body
 * @slot header - Modal title row
 * @slot footer - Actions row
 * @csspart dialog - The native dialog element
 * @csspart header - Header wrapper
 * @csspart body - Body wrapper
 * @csspart footer - Footer wrapper
 * @csspart close - The close button
 * @fires kl-open - Fired after the modal opens
 * @fires kl-close - Fired after the modal closes
 * @cssprop --kl-modal-width - Max width (default 32rem)
 * @cssprop --kl-modal-padding - Inner padding
 */
@customElement('kl-modal')
export class KlModal extends LitElement {
  static override styles = [
    focusRing,
    reducedMotion,
    css`
      :host {
        display: contents;
      }

      dialog {
        background: var(--kl-surface-raised, #fafafa);
        color: var(--kl-ink, #0a0a0b);
        border: 1px solid var(--kl-border, #e4e4e7);
        border-radius: var(--kl-radius-lg, 0.75rem);
        box-shadow: var(--kl-shadow-xl, 0 20px 25px -5px rgb(0 0 0 / 0.08));
        padding: 0;
        inline-size: min(var(--kl-modal-width, 32rem), calc(100vw - 2rem));
        max-block-size: calc(100dvh - 4rem);
        overflow: auto;
      }

      dialog[open] {
        animation: modal-in var(--kl-duration-normal, 250ms) var(--kl-ease-default, ease);
      }

      dialog::backdrop {
        background: rgb(0 0 0 / 0.5);
        backdrop-filter: blur(2px);
      }

      @keyframes modal-in {
        from {
          opacity: 0;
          translate: 0 12px;
        }
        to {
          opacity: 1;
          translate: 0 0;
        }
      }

      .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: var(--kl-space-4, 1rem);
        padding: var(--kl-modal-padding, var(--kl-space-6, 1.5rem));
        padding-block-end: 0;
        font-family: var(--kl-font-sans, 'DM Sans', system-ui, sans-serif);
        font-size: var(--kl-text-md, 1.25rem);
        font-weight: var(--kl-weight-semibold, 600);
        letter-spacing: var(--kl-tracking-tight, -0.03em);
      }

      .body {
        padding: var(--kl-modal-padding, var(--kl-space-6, 1.5rem));
        font-family: var(--kl-font-sans, 'DM Sans', system-ui, sans-serif);
        font-size: var(--kl-text-sm, 0.8rem);
        line-height: var(--kl-leading-normal, 1.6);
        color: var(--kl-ink-secondary, #3f3f46);
      }

      .footer {
        display: flex;
        justify-content: flex-end;
        gap: var(--kl-space-3, 0.75rem);
        padding: var(--kl-modal-padding, var(--kl-space-6, 1.5rem));
        padding-block-start: 0;
      }

      .close {
        display: grid;
        place-items: center;
        inline-size: 2rem;
        block-size: 2rem;
        flex: none;
        background: transparent;
        border: none;
        border-radius: var(--kl-radius-sm, 0.25rem);
        color: var(--kl-ink-tertiary, #71717a);
        cursor: pointer;
        padding: 0;
        font-size: var(--kl-text-base, 1rem);
        transition: color var(--kl-duration-fast, 150ms) var(--kl-ease-default, ease);
      }

      .close:hover {
        color: var(--kl-ink, #0a0a0b);
      }
    `,
  ];

  /** Open state. Set to open/close the modal. */
  @property({ type: Boolean, reflect: true }) open = false;

  /** Close when the backdrop is clicked. */
  @property({ type: Boolean, attribute: 'close-on-backdrop' }) closeOnBackdrop = true;

  /** Accessible dialog label. */
  @property({ type: String, attribute: 'aria-modal-label' }) ariaModalLabel = '';

  @query('dialog') private dialogEl?: HTMLDialogElement;

  /** Open the modal. */
  show() {
    this.open = true;
  }

  /** Close the modal. */
  close() {
    this.open = false;
  }

  protected override updated(changed: Map<string, unknown>) {
    if (!changed.has('open') || !this.dialogEl) return;
    if (this.open && !this.dialogEl.open) {
      // showModal gives focus trap + ::backdrop; fall back for older DOM impls
      if (typeof this.dialogEl.showModal === 'function') {
        this.dialogEl.showModal();
      } else {
        this.dialogEl.setAttribute('open', '');
      }
      this.dispatchEvent(new CustomEvent('kl-open', { bubbles: true, composed: true }));
    } else if (!this.open && this.dialogEl.open) {
      if (typeof this.dialogEl.close === 'function') {
        this.dialogEl.close();
      } else {
        this.dialogEl.removeAttribute('open');
      }
    }
  }

  /** Native cancel (Escape) and close events → sync state + emit. */
  private handleNativeClose = () => {
    if (this.open) {
      this.open = false;
    }
    this.dispatchEvent(new CustomEvent('kl-close', { bubbles: true, composed: true }));
  };

  private handleBackdropClick(e: MouseEvent) {
    // Clicks on the dialog element itself (not its children) hit the backdrop
    if (this.closeOnBackdrop && e.target === this.dialogEl) {
      this.close();
    }
  }

  override render() {
    return html`
      <dialog
        part="dialog"
        aria-label=${this.ariaModalLabel || 'Dialog'}
        @close=${this.handleNativeClose}
        @click=${this.handleBackdropClick}
      >
        <div class="header" part="header">
          <slot name="header"></slot>
          <button class="close" part="close" aria-label="Close dialog" @click=${this.close}>
            ✕
          </button>
        </div>
        <div class="body" part="body">
          <slot></slot>
        </div>
        <div class="footer" part="footer">
          <slot name="footer"></slot>
        </div>
      </dialog>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kl-modal': KlModal;
  }
}
