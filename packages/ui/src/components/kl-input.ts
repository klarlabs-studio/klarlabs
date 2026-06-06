import { LitElement, html, css, nothing } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { focusRing, labelType, reducedMotion } from '../styles/shared.js';

export type KlInputType = 'text' | 'email' | 'password' | 'search' | 'url' | 'tel' | 'number';
export type KlInputSize = 'sm' | 'md' | 'lg';

/**
 * Klarlabs form input — label, helper text, error state, form-associated.
 *
 * @slot icon-start - Leading icon inside the field
 * @slot icon-end - Trailing icon inside the field
 * @csspart label - The label element
 * @csspart field - The field wrapper (border carrier)
 * @csspart input - The native input
 * @csspart helper - Helper text
 * @csspart error - Error text
 * @cssprop --kl-input-bg - Field background
 * @cssprop --kl-input-radius - Field border radius
 * @fires input - Native input event (composed)
 * @fires change - Native change event (composed)
 */
@customElement('kl-input')
export class KlInput extends LitElement {
  static formAssociated = true;

  static override styles = [
    focusRing,
    labelType,
    reducedMotion,
    css`
      :host {
        display: block;
        font-family: var(--kl-font-sans, 'DM Sans', system-ui, sans-serif);
      }

      .kl-label {
        display: block;
        color: var(--kl-ink-secondary, #3f3f46);
        margin-block-end: var(--kl-space-2, 0.5rem);
      }

      .field {
        display: flex;
        align-items: center;
        gap: var(--kl-space-2, 0.5rem);
        background: var(--kl-input-bg, var(--kl-surface, #ffffff));
        border: 1px solid var(--kl-border-strong, #d4d4d8);
        border-radius: var(--kl-input-radius, var(--kl-radius-md, 0.5rem));
        padding-inline: var(--kl-space-3, 0.75rem);
        transition:
          border-color var(--kl-duration-fast, 150ms) var(--kl-ease-default, ease),
          box-shadow var(--kl-duration-fast, 150ms) var(--kl-ease-default, ease);
      }

      .field:focus-within {
        border-color: var(--kl-accent, #0d9488);
        box-shadow: var(--kl-shadow-accent, 0 0 0 3px #0d948820);
      }

      :host([error]) .field {
        border-color: var(--kl-error, #dc2626);
      }

      :host([error]) .field:focus-within {
        box-shadow: 0 0 0 3px color-mix(in srgb, var(--kl-error, #dc2626) 15%, transparent);
      }

      :host([disabled]) .field {
        background: var(--kl-surface-muted, #f4f4f5);
        border-color: var(--kl-border, #e4e4e7);
        cursor: not-allowed;
      }

      input {
        flex: 1;
        min-inline-size: 0;
        background: transparent;
        border: none;
        outline: none;
        font-family: inherit;
        font-size: var(--kl-text-sm, 0.8rem);
        color: var(--kl-ink, #0a0a0b);
        padding-block: var(--kl-space-2, 0.5rem);
        min-block-size: 2.25rem;
        box-sizing: border-box;
      }

      :host([size='sm']) input {
        min-block-size: 1.75rem;
        font-size: var(--kl-text-xs, 0.64rem);
      }

      :host([size='lg']) input {
        min-block-size: 2.75rem;
        font-size: var(--kl-text-base, 1rem);
      }

      @media (pointer: coarse) {
        input {
          min-block-size: 44px;
        }
      }

      input::placeholder {
        color: var(--kl-ink-disabled, #a1a1aa);
      }

      input:disabled {
        color: var(--kl-ink-disabled, #a1a1aa);
        cursor: not-allowed;
      }

      .helper,
      .error-text {
        display: block;
        font-size: var(--kl-text-xs, 0.64rem);
        line-height: var(--kl-leading-snug, 1.4);
        margin-block-start: var(--kl-space-2, 0.5rem);
      }

      .helper {
        color: var(--kl-ink-tertiary, #71717a);
      }

      .error-text {
        color: var(--kl-error, #dc2626);
      }

      ::slotted([slot='icon-start']),
      ::slotted([slot='icon-end']) {
        display: inline-flex;
        color: var(--kl-ink-tertiary, #71717a);
      }
    `,
  ];

  /** Field label. */
  @property({ type: String }) label = '';

  /** Input type. */
  @property({ type: String }) type: KlInputType = 'text';

  /** Current value. */
  @property({ type: String }) value = '';

  /** Placeholder text. */
  @property({ type: String }) placeholder = '';

  /** Form field name. */
  @property({ type: String }) name = '';

  /** Size. */
  @property({ type: String, reflect: true }) size: KlInputSize = 'md';

  /** Disabled state. */
  @property({ type: Boolean, reflect: true }) disabled = false;

  /** Required for form submission. */
  @property({ type: Boolean, reflect: true }) required = false;

  /** Readonly state. */
  @property({ type: Boolean, reflect: true }) readonly = false;

  /** Error message — presence switches the field to error state. */
  @property({ type: String, reflect: true }) error = '';

  /** Helper text below the field (hidden while error is set). */
  @property({ type: String }) helper = '';

  /** Autocomplete hint. */
  @property({ type: String }) autocomplete = '';

  @query('input') private inputEl?: HTMLInputElement;

  private internals?: ElementInternals;

  constructor() {
    super();
    // ElementInternals — form participation (guarded for older environments)
    this.internals = this.attachInternals?.();
  }

  /** Focus the native input. */
  override focus(options?: FocusOptions) {
    this.inputEl?.focus(options);
  }

  private handleInput(e: Event) {
    this.value = (e.target as HTMLInputElement).value;
    this.internals?.setFormValue(this.value);
  }

  protected override updated() {
    this.internals?.setFormValue(this.value);
  }

  private get describedBy(): string | typeof nothing {
    if (this.error) return 'error';
    if (this.helper) return 'helper';
    return nothing;
  }

  override render() {
    return html`
      <label class="kl-label" part="label" for="input" ?hidden=${!this.label}>
        ${this.label}
      </label>
      <div class="field" part="field">
        <slot name="icon-start"></slot>
        <input
          id="input"
          part="input"
          type=${this.type}
          .value=${this.value}
          placeholder=${this.placeholder || nothing}
          name=${this.name || nothing}
          autocomplete=${(this.autocomplete || nothing) as never}
          ?disabled=${this.disabled}
          ?required=${this.required}
          ?readonly=${this.readonly}
          aria-invalid=${this.error ? 'true' : nothing}
          aria-describedby=${this.describedBy}
          @input=${this.handleInput}
        />
        <slot name="icon-end"></slot>
      </div>
      <span class="error-text" part="error" id="error" role="alert" ?hidden=${!this.error}
        >${this.error}</span
      >
      <span class="helper" part="helper" id="helper" ?hidden=${!this.helper || !!this.error}
        >${this.helper}</span
      >
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kl-input': KlInput;
  }
}
