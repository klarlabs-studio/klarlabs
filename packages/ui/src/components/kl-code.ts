import { LitElement, html, css, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { focusRing, labelType, reducedMotion } from '../styles/shared.js';

/**
 * Klarlabs code display — inline or block.
 * DM Mono, monochrome, teal accent. Block mode: optional copy button,
 * language label, line numbers.
 *
 * @slot - Code content (preformatted text)
 * @csspart container - Block container / inline code element
 * @csspart copy-button - Copy button (block mode)
 * @cssprop --kl-code-bg - Background override
 */
@customElement('kl-code')
export class KlCode extends LitElement {
  static override styles = [
    focusRing,
    labelType,
    reducedMotion,
    css`
      :host {
        display: block;
      }
      :host([inline]) {
        display: inline;
      }

      code.inline {
        font-family: var(--kl-font-mono, 'DM Mono', monospace);
        font-size: 0.9em;
        background: var(--kl-code-bg, var(--kl-surface-muted, #f4f4f5));
        border: 1px solid var(--kl-border, #e4e4e7);
        border-radius: var(--kl-radius-sm, 0.25rem);
        padding: 0.1em 0.4em;
        color: var(--kl-ink, #0a0a0b);
      }

      .block {
        position: relative;
        background: var(--kl-code-bg, var(--kl-surface-muted, #f4f4f5));
        border: 1px solid var(--kl-border, #e4e4e7);
        border-radius: var(--kl-radius-md, 0.5rem);
        overflow: hidden;
      }

      .toolbar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: var(--kl-space-2, 0.5rem);
        padding: var(--kl-space-2, 0.5rem) var(--kl-space-4, 1rem);
        border-block-end: 1px solid var(--kl-border, #e4e4e7);
      }

      .kl-label {
        color: var(--kl-ink-tertiary, #71717a);
      }

      .copy {
        font-family: var(--kl-font-sans, 'DM Sans', system-ui, sans-serif);
        font-size: var(--kl-text-xs, 0.64rem);
        font-weight: var(--kl-weight-medium, 500);
        color: var(--kl-ink-tertiary, #71717a);
        background: transparent;
        border: 1px solid var(--kl-border, #e4e4e7);
        border-radius: var(--kl-radius-sm, 0.25rem);
        padding: var(--kl-space-1, 0.25rem) var(--kl-space-2, 0.5rem);
        cursor: pointer;
        transition: color var(--kl-duration-fast, 150ms) var(--kl-ease-default, ease);
      }

      .copy:hover {
        color: var(--kl-accent, #0d9488);
        border-color: var(--kl-accent-border, #0d948840);
      }

      .copy.copied {
        color: var(--kl-accent, #0d9488);
        border-color: var(--kl-accent-border, #0d948840);
      }

      pre {
        margin: 0;
        padding: var(--kl-space-4, 1rem);
        overflow-x: auto;
        display: flex;
        gap: var(--kl-space-4, 1rem);
      }

      code,
      .lines {
        font-family: var(--kl-font-mono, 'DM Mono', monospace);
        font-size: var(--kl-text-sm, 0.8rem);
        line-height: var(--kl-leading-normal, 1.6);
        color: var(--kl-ink, #0a0a0b);
      }

      .lines {
        color: var(--kl-ink-disabled, #a1a1aa);
        text-align: end;
        user-select: none;
        font-variant-numeric: tabular-nums;
      }
    `,
  ];

  /** Inline rendering instead of block. */
  @property({ type: Boolean, reflect: true }) inline = false;

  /** Language label shown in the toolbar (block mode). */
  @property({ type: String }) language = '';

  /** Show copy button (block mode). */
  @property({ type: Boolean, attribute: 'copyable' }) copyable = false;

  /** Show line numbers (block mode). */
  @property({ type: Boolean, attribute: 'line-numbers' }) lineNumbers = false;

  @state() private copied = false;

  private get codeText(): string {
    return (this.textContent ?? '').replace(/^\n+|\s+$/g, '');
  }

  private async copy() {
    try {
      await navigator.clipboard.writeText(this.codeText);
      this.copied = true;
      setTimeout(() => {
        this.copied = false;
      }, 2000);
    } catch {
      /* clipboard unavailable — leave button state unchanged */
    }
  }

  override render() {
    if (this.inline) {
      return html`<code class="inline" part="container"><slot></slot></code>`;
    }

    const lineCount = this.codeText.split('\n').length;
    const showToolbar = this.language || this.copyable;

    return html`
      <div class="block" part="container">
        ${showToolbar
          ? html`
              <div class="toolbar">
                <span class="kl-label">${this.language}</span>
                ${this.copyable
                  ? html`
                      <button
                        class="copy ${this.copied ? 'copied' : ''}"
                        part="copy-button"
                        @click=${this.copy}
                        aria-label="Copy code"
                      >
                        ${this.copied ? 'Copied' : 'Copy'}
                      </button>
                    `
                  : nothing}
              </div>
            `
          : nothing}
        <pre><!--
       -->${this.lineNumbers
          ? html`<span class="lines" aria-hidden="true"
              >${Array.from({ length: lineCount }, (_, i) => String(i + 1)).join('\n')}</span
            >`
          : nothing}<code><slot></slot></code></pre>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kl-code': KlCode;
  }
}
