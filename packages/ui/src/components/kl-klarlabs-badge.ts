import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { focusRing, reducedMotion } from '../styles/shared.js';

/**
 * "A Klarlabs Product" badge — nav/footer of every product Unterseite.
 * Links back to the studio.
 *
 * @csspart badge - The anchor pill
 */
@customElement('kl-klarlabs-badge')
export class KlKlarlabsBadge extends LitElement {
  static override styles = [
    focusRing,
    reducedMotion,
    css`
      :host {
        display: inline-flex;
      }

      a {
        display: inline-flex;
        align-items: center;
        gap: var(--kl-space-2, 0.5rem);
        font-family: var(--kl-font-sans, 'DM Sans', system-ui, sans-serif);
        font-size: var(--kl-text-xs, 0.64rem);
        font-weight: var(--kl-weight-normal, 400);
        color: var(--kl-ink-tertiary, #71717a);
        text-decoration: none;
        border: 1px solid var(--kl-border, #e4e4e7);
        border-radius: var(--kl-radius-full, 9999px);
        padding: var(--kl-space-1, 0.25rem) var(--kl-space-3, 0.75rem);
        transition:
          color var(--kl-duration-fast, 150ms) var(--kl-ease-default, ease),
          border-color var(--kl-duration-fast, 150ms) var(--kl-ease-default, ease);
      }

      a:hover {
        color: var(--kl-accent, #0d9488);
        border-color: var(--kl-accent-border, color-mix(in srgb, #0d9488 30%, transparent));
      }

      .mark {
        font-family: var(--kl-font-mono, 'DM Mono', monospace);
        font-weight: var(--kl-weight-medium, 500);
        color: var(--kl-accent, #0d9488);
      }
    `,
  ];

  /** Link target — defaults to the studio. */
  @property({ type: String }) href = 'https://klarlabs.de';

  override render() {
    return html`
      <a part="badge" href=${this.href}>
        <span class="mark" aria-hidden="true">kl</span>
        A Klarlabs Product
      </a>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kl-klarlabs-badge': KlKlarlabsBadge;
  }
}
