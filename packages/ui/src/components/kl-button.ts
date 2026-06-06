import { LitElement, html, css, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { focusRing, reducedMotion } from '../styles/shared.js';

export type KlButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type KlButtonSize = 'sm' | 'md' | 'lg';

/**
 * Klarlabs button.
 *
 * @slot - Button label
 * @slot icon-start - Leading icon
 * @slot icon-end - Trailing icon
 * @csspart button - The native button or anchor element
 * @cssprop --kl-button-bg - Background override
 * @cssprop --kl-button-color - Text color override
 * @cssprop --kl-button-radius - Border radius override
 * @cssprop --kl-button-padding - Padding override
 */
@customElement('kl-button')
export class KlButton extends LitElement {
  static override styles = [
    focusRing,
    reducedMotion,
    css`
      :host {
        display: inline-flex;
        /* Variant defaults — primary */
        --_bg: var(--kl-button-bg, var(--kl-accent, #0d9488));
        --_bg-hover: var(--kl-accent-light, #14b8a6);
        --_color: var(--kl-button-color, #ffffff);
        --_border: transparent;
      }

      :host([variant='secondary']) {
        --_bg: transparent;
        --_bg-hover: var(--kl-accent-dim, #0d948820);
        --_color: var(--kl-accent, #0d9488);
        --_border: var(--kl-accent-border, #0d948840);
      }

      :host([variant='ghost']) {
        --_bg: transparent;
        --_bg-hover: var(--kl-surface-muted, #f4f4f5);
        --_color: var(--kl-ink, #0a0a0b);
        --_border: transparent;
      }

      :host([variant='danger']) {
        --_bg: var(--kl-error, #dc2626);
        --_bg-hover: color-mix(in srgb, var(--kl-error, #dc2626) 88%, white);
        --_color: #ffffff;
        --_border: transparent;
      }

      :host([disabled]) {
        pointer-events: none;
      }

      .button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: var(--kl-space-2, 0.5rem);
        background: var(--_bg);
        color: var(--_color);
        border: 1px solid var(--_border);
        font-family: var(--kl-font-sans, 'DM Sans', system-ui, sans-serif);
        font-weight: var(--kl-weight-medium, 500);
        letter-spacing: var(--kl-tracking-normal, -0.01em);
        border-radius: var(--kl-button-radius, var(--kl-radius-md, 0.5rem));
        cursor: pointer;
        text-decoration: none;
        white-space: nowrap;
        transition:
          background var(--kl-duration-fast, 150ms) var(--kl-ease-default, ease),
          transform var(--kl-duration-fast, 150ms) var(--kl-ease-default, ease),
          box-shadow var(--kl-duration-fast, 150ms) var(--kl-ease-default, ease);
      }

      /* Sizes — md default; min 44px touch target on coarse pointers */
      .button {
        font-size: var(--kl-text-sm, 0.8rem);
        padding: var(--kl-button-padding, var(--kl-space-2, 0.5rem) var(--kl-space-4, 1rem));
        min-height: 2.25rem;
      }
      :host([size='sm']) .button {
        font-size: var(--kl-text-xs, 0.64rem);
        padding: var(--kl-space-1, 0.25rem) var(--kl-space-3, 0.75rem);
        min-height: 1.75rem;
      }
      :host([size='lg']) .button {
        font-size: var(--kl-text-base, 1rem);
        padding: var(--kl-space-3, 0.75rem) var(--kl-space-6, 1.5rem);
        min-height: 2.75rem;
      }
      @media (pointer: coarse) {
        .button {
          min-height: 44px;
          min-width: 44px;
        }
      }

      .button:hover {
        background: var(--_bg-hover);
        transform: translateY(-1px);
      }

      .button:active {
        transform: translateY(0);
      }

      .button:disabled,
      :host([disabled]) .button {
        background: var(--kl-surface-muted, #f4f4f5);
        color: var(--kl-ink-disabled, #a1a1aa);
        border-color: transparent;
        cursor: not-allowed;
        transform: none;
      }

      .spinner {
        display: none;
        inline-size: 1em;
        block-size: 1em;
        border: 2px solid currentColor;
        border-block-start-color: transparent;
        border-radius: var(--kl-radius-full, 9999px);
        animation: spin 0.6s linear infinite;
      }

      :host([loading]) .spinner {
        display: inline-block;
      }

      @keyframes spin {
        to {
          rotate: 360deg;
        }
      }
    `,
  ];

  /** Visual variant. */
  @property({ type: String, reflect: true }) variant: KlButtonVariant = 'primary';

  /** Size. */
  @property({ type: String, reflect: true }) size: KlButtonSize = 'md';

  /** Disabled state. */
  @property({ type: Boolean, reflect: true }) disabled = false;

  /** Loading state — shows spinner, blocks interaction. */
  @property({ type: Boolean, reflect: true }) loading = false;

  /** Renders an anchor instead of a button when set. */
  @property({ type: String }) href = '';

  /** Anchor target (only with href). */
  @property({ type: String }) target = '';

  /** Button type (only without href). */
  @property({ type: String }) type: 'button' | 'submit' | 'reset' = 'button';

  override render() {
    const content = html`
      <span class="spinner" aria-hidden="true"></span>
      <slot name="icon-start"></slot>
      <slot></slot>
      <slot name="icon-end"></slot>
    `;

    if (this.href && !this.disabled) {
      return html`
        <a
          class="button"
          part="button"
          href=${this.href}
          target=${this.target || nothing}
          rel=${this.target === '_blank' ? 'noopener noreferrer' : nothing}
          aria-busy=${this.loading ? 'true' : nothing}
        >
          ${content}
        </a>
      `;
    }

    return html`
      <button
        class="button"
        part="button"
        type=${this.type}
        ?disabled=${this.disabled || this.loading}
        aria-busy=${this.loading ? 'true' : nothing}
      >
        ${content}
      </button>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kl-button': KlButton;
  }
}
