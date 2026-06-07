import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { focusRing, reducedMotion } from '../styles/shared.js';

const STORAGE_KEY = 'kl-theme';

/**
 * Theme toggle — studio page only. Switches data-theme on <html>
 * between dark and light, persists the choice to localStorage, and
 * applies a saved preference on connect.
 *
 * @csspart button - The toggle button
 * @fires kl-theme-change - detail: { theme: 'dark' | 'light' }
 */
@customElement('kl-theme-toggle')
export class KlThemeToggle extends LitElement {
  static override styles = [
    focusRing,
    reducedMotion,
    css`
      :host {
        display: inline-flex;
      }

      button {
        display: grid;
        place-items: center;
        inline-size: 44px;
        block-size: 44px;
        background: transparent;
        border: 1px solid var(--kl-border, #e4e4e7);
        border-radius: var(--kl-radius-md, 0.5rem);
        color: var(--kl-ink-secondary, #3f3f46);
        cursor: pointer;
        padding: 0;
        transition:
          color var(--kl-duration-fast, 150ms) var(--kl-ease-default, ease),
          border-color var(--kl-duration-fast, 150ms) var(--kl-ease-default, ease);
      }

      button:hover {
        color: var(--kl-accent, #0d9488);
        border-color: var(--kl-accent-border, color-mix(in srgb, #0d9488 30%, transparent));
      }

      svg {
        inline-size: 18px;
        block-size: 18px;
      }
    `,
  ];

  @state() private theme: 'dark' | 'light' = 'dark';

  private get storage(): Storage | undefined {
    try {
      return globalThis.localStorage ?? window.localStorage;
    } catch {
      return undefined; // storage blocked (privacy mode) — toggle still works, no persistence
    }
  }

  override connectedCallback() {
    super.connectedCallback();
    const saved = this.storage?.getItem(STORAGE_KEY) as 'dark' | 'light' | null;
    const current = document.documentElement.getAttribute('data-theme') as
      | 'dark'
      | 'light'
      | null;
    const preferred =
      saved ??
      current ??
      (typeof matchMedia === 'function' && matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light');
    this.apply(preferred, false);
  }

  private apply(theme: 'dark' | 'light', persist: boolean) {
    this.theme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    if (persist) this.storage?.setItem(STORAGE_KEY, theme);
    this.dispatchEvent(
      new CustomEvent('kl-theme-change', {
        detail: { theme },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private toggle() {
    this.apply(this.theme === 'dark' ? 'light' : 'dark', true);
  }

  override render() {
    const next = this.theme === 'dark' ? 'light' : 'dark';
    return html`
      <button part="button" aria-label="Switch to ${next} theme" @click=${this.toggle}>
        ${this.theme === 'dark'
          ? html`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
              <circle cx="12" cy="12" r="4" />
              <path
                d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
              />
            </svg>`
          : html`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>`}
      </button>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kl-theme-toggle': KlThemeToggle;
  }
}
