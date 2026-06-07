import { LitElement, html, css, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { focusRing, reducedMotion } from '../styles/shared.js';

/**
 * Klarlabs OSS card — open source library entry.
 * Horizontal: mono name (code aesthetic) + description + doc/repo links.
 *
 * @csspart card - The card container
 * @csspart name - Library name (DM Mono, accent)
 * @csspart description - Library description
 * @csspart links - Links row
 */
@customElement('kl-oss-card')
export class KlOssCard extends LitElement {
  static override styles = [
    focusRing,
    reducedMotion,
    css`
      :host {
        display: block;
      }

      .card {
        display: flex;
        flex-wrap: wrap;
        align-items: baseline;
        gap: var(--kl-space-2, 0.5rem) var(--kl-space-4, 1rem);
        background: transparent;
        border: 1px solid var(--kl-border, #e4e4e7);
        border-radius: var(--kl-radius-lg, 0.75rem);
        padding: var(--kl-space-4, 1rem);
        transition:
          border-color var(--kl-duration-fast, 150ms) var(--kl-ease-default, ease),
          background var(--kl-duration-fast, 150ms) var(--kl-ease-default, ease);
      }

      .card:hover {
        border-color: var(--kl-border-strong, #d4d4d8);
        background: var(--kl-surface-raised, #fafafa);
      }

      .name {
        font-family: var(--kl-font-mono, 'DM Mono', monospace);
        font-size: var(--kl-text-sm, 0.8rem);
        font-weight: var(--kl-weight-medium, 500);
        color: var(--kl-accent, #0d9488);
        min-inline-size: 7rem;
      }

      .description {
        flex: 1;
        min-inline-size: 12rem;
        margin: 0;
        font-family: var(--kl-font-sans, 'DM Sans', system-ui, sans-serif);
        font-size: var(--kl-text-sm, 0.8rem);
        line-height: var(--kl-leading-snug, 1.4);
        color: var(--kl-ink-secondary, #3f3f46);
      }

      .links {
        display: inline-flex;
        gap: var(--kl-space-3, 0.75rem);
      }

      .links a {
        font-family: var(--kl-font-sans, 'DM Sans', system-ui, sans-serif);
        font-size: var(--kl-text-xs, 0.64rem);
        color: var(--kl-ink-tertiary, #71717a);
        text-decoration: none;
        transition: color var(--kl-duration-fast, 150ms) var(--kl-ease-default, ease);
      }

      .links a:hover {
        color: var(--kl-accent, #0d9488);
      }
    `,
  ];

  /** Library name (rendered in DM Mono). */
  @property({ type: String }) name = '';

  /** One-line description. */
  @property({ type: String }) description = '';

  /** GitHub repository URL. */
  @property({ type: String, attribute: 'repo-href' }) repoHref = '';

  /** Docs URL (pkg.go.dev, npm, …). */
  @property({ type: String, attribute: 'docs-href' }) docsHref = '';

  /** Docs link label. */
  @property({ type: String, attribute: 'docs-label' }) docsLabel = 'docs';

  override render() {
    return html`
      <div class="card" part="card">
        <span class="name" part="name">${this.name}</span>
        <p class="description" part="description">${this.description}</p>
        <span class="links" part="links">
          ${this.docsHref
            ? html`<a href=${this.docsHref} target="_blank" rel="noopener noreferrer"
                >${this.docsLabel}</a
              >`
            : nothing}
          ${this.repoHref
            ? html`<a href=${this.repoHref} target="_blank" rel="noopener noreferrer">GitHub</a>`
            : nothing}
        </span>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kl-oss-card': KlOssCard;
  }
}
