import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { focusRing, reducedMotion } from '../styles/shared.js';

/**
 * Klarlabs navigation bar.
 * Transparent over hero, solid + border after scroll. Mobile: hamburger →
 * slide-in drawer.
 *
 * @slot brand - Wordmark / logo (left)
 * @slot - Nav links (center/right)
 * @slot cta - Optional CTA button (right)
 * @csspart nav - The nav element
 * @csspart drawer - Mobile drawer
 * @csspart toggle - Hamburger button
 * @cssprop --kl-nav-height - Bar height (default 4rem)
 * @cssprop --kl-nav-bg - Solid background after scroll
 */
@customElement('kl-nav')
export class KlNav extends LitElement {
  static override styles = [
    focusRing,
    reducedMotion,
    css`
      :host {
        display: block;
        position: sticky;
        inset-block-start: 0;
        z-index: var(--kl-z-overlay, 100);
      }

      nav {
        display: flex;
        align-items: center;
        gap: var(--kl-space-6, 1.5rem);
        block-size: var(--kl-nav-height, 4rem);
        padding-inline: clamp(var(--kl-space-4, 1rem), 4vw, var(--kl-space-12, 3rem));
        background: transparent;
        border-block-end: 1px solid transparent;
        transition:
          background var(--kl-duration-normal, 250ms) var(--kl-ease-default, ease),
          border-color var(--kl-duration-normal, 250ms) var(--kl-ease-default, ease),
          backdrop-filter var(--kl-duration-normal, 250ms) var(--kl-ease-default, ease);
      }

      :host([scrolled]) nav {
        background: var(
          --kl-nav-bg,
          color-mix(in srgb, var(--kl-surface, #ffffff) 85%, transparent)
        );
        backdrop-filter: blur(12px);
        border-block-end-color: var(--kl-border, #e4e4e7);
      }

      .brand {
        display: flex;
        align-items: center;
        margin-inline-end: auto;
      }

      .links {
        display: none;
        align-items: center;
        gap: var(--kl-space-6, 1.5rem);
      }

      .links ::slotted(a) {
        font-family: var(--kl-font-sans, 'DM Sans', system-ui, sans-serif);
        font-size: var(--kl-text-sm, 0.8rem);
        font-weight: var(--kl-weight-medium, 500);
        color: var(--kl-ink-secondary, #3f3f46);
        text-decoration: none;
        transition: color var(--kl-duration-fast, 150ms) var(--kl-ease-default, ease);
      }

      .links ::slotted(a:hover) {
        color: var(--kl-accent, #0d9488);
      }

      .cta {
        display: none;
      }

      .toggle {
        display: grid;
        place-items: center;
        inline-size: 44px;
        block-size: 44px;
        background: transparent;
        border: none;
        cursor: pointer;
        color: var(--kl-ink, #0a0a0b);
        padding: 0;
      }

      .toggle svg {
        inline-size: 20px;
        block-size: 20px;
      }

      @media (min-width: 768px) {
        .links,
        .cta {
          display: flex;
        }
        .toggle {
          display: none;
        }
      }

      /* ── Mobile drawer ─────────────────────────────────────── */
      .drawer {
        position: fixed;
        inset-block: 0;
        inset-inline-end: 0;
        inline-size: min(20rem, 85vw);
        background: var(--kl-surface, #ffffff);
        border-inline-start: 1px solid var(--kl-border, #e4e4e7);
        box-shadow: var(--kl-shadow-xl, 0 20px 25px -5px rgb(0 0 0 / 0.08));
        padding: var(--kl-space-8, 2rem) var(--kl-space-6, 1.5rem);
        display: flex;
        flex-direction: column;
        gap: var(--kl-space-4, 1rem);
        translate: 100% 0;
        visibility: hidden;
        transition:
          translate var(--kl-duration-normal, 250ms) var(--kl-ease-default, ease),
          visibility var(--kl-duration-normal, 250ms);
        z-index: var(--kl-z-modal, 200);
      }

      .drawer.open {
        translate: 0 0;
        visibility: visible;
      }

      .drawer ::slotted(a) {
        font-family: var(--kl-font-sans, 'DM Sans', system-ui, sans-serif);
        font-size: var(--kl-text-md, 1.25rem);
        font-weight: var(--kl-weight-medium, 500);
        color: var(--kl-ink, #0a0a0b);
        text-decoration: none;
        padding-block: var(--kl-space-2, 0.5rem);
      }

      .scrim {
        position: fixed;
        inset: 0;
        background: rgb(0 0 0 / 0.4);
        opacity: 0;
        visibility: hidden;
        transition:
          opacity var(--kl-duration-normal, 250ms) var(--kl-ease-default, ease),
          visibility var(--kl-duration-normal, 250ms);
        z-index: var(--kl-z-overlay, 100);
        border: none;
        cursor: pointer;
      }

      .scrim.open {
        opacity: 1;
        visibility: visible;
      }

      .drawer-close {
        align-self: flex-end;
        inline-size: 44px;
        block-size: 44px;
        display: grid;
        place-items: center;
        background: transparent;
        border: none;
        cursor: pointer;
        color: var(--kl-ink, #0a0a0b);
        font-size: var(--kl-text-md, 1.25rem);
        padding: 0;
      }
    `,
  ];

  /** Scroll offset (px) after which the bar turns solid. */
  @property({ type: Number, attribute: 'scroll-threshold' }) scrollThreshold = 80;

  /** Reflected when the page is scrolled past the threshold. */
  @property({ type: Boolean, reflect: true }) scrolled = false;

  @state() private drawerOpen = false;

  private onScroll = () => {
    this.scrolled = window.scrollY > this.scrollThreshold;
  };

  private onKeydown = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && this.drawerOpen) this.closeDrawer();
  };

  override connectedCallback() {
    super.connectedCallback();
    window.addEventListener('scroll', this.onScroll, { passive: true });
    window.addEventListener('keydown', this.onKeydown);
    this.onScroll();
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('scroll', this.onScroll);
    window.removeEventListener('keydown', this.onKeydown);
  }

  private openDrawer() {
    this.drawerOpen = true;
  }

  private closeDrawer() {
    this.drawerOpen = false;
  }

  override render() {
    return html`
      <nav part="nav" aria-label="Main">
        <div class="brand">
          <slot name="brand"></slot>
        </div>
        <div class="links">
          <slot></slot>
        </div>
        <div class="cta">
          <slot name="cta"></slot>
        </div>
        <button
          class="toggle"
          part="toggle"
          aria-label="Open menu"
          aria-expanded=${this.drawerOpen}
          @click=${this.openDrawer}
        >
          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M2 5h16M2 10h16M2 15h16" />
          </svg>
        </button>
      </nav>
      <button
        class="scrim ${this.drawerOpen ? 'open' : ''}"
        aria-label="Close menu"
        tabindex=${this.drawerOpen ? 0 : -1}
        @click=${this.closeDrawer}
      ></button>
      <div class="drawer ${this.drawerOpen ? 'open' : ''}" part="drawer" role="dialog" aria-label="Menu">
        <button class="drawer-close" aria-label="Close menu" @click=${this.closeDrawer}>✕</button>
        <slot name="drawer"></slot>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kl-nav': KlNav;
  }
}
