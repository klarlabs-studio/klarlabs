import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { labelType, reducedMotion } from '../styles/shared.js';

/**
 * Klarlabs hero — full-width landing section. Theme-aware:
 * dark theme gets dot grid + teal glow (token-driven via
 * --kl-grid-color / --kl-hero-glow), light theme subtle grid lines.
 *
 * @slot eyebrow - Small uppercase label above the title
 * @slot title - Main heading
 * @slot subtitle - Supporting copy
 * @slot actions - CTA buttons
 * @slot visual - Optional visual below content (screenshot, code, terminal)
 * @csspart section - The section element
 * @csspart content - Inner content wrapper
 * @cssprop --kl-hero-bg - Background override
 * @cssprop --kl-hero-min-height - Minimum height (default 70vh)
 * @cssprop --kl-hero-accent - Accent for eyebrow (per-product accent)
 */
@customElement('kl-hero')
export class KlHero extends LitElement {
  static override styles = [
    labelType,
    reducedMotion,
    css`
      :host {
        display: block;
      }

      section {
        position: relative;
        display: grid;
        place-items: center;
        min-block-size: var(--kl-hero-min-height, 70vh);
        padding-block: var(--kl-space-24, 6rem);
        padding-inline: clamp(var(--kl-space-4, 1rem), 4vw, var(--kl-space-12, 3rem));
        background: var(--kl-hero-bg, var(--kl-surface, #ffffff));
        color: var(--kl-ink, #0a0a0b);
        overflow: hidden;
      }

      /* Theme-aware dot grid (visible per --kl-grid-color) */
      section::before {
        content: '';
        position: absolute;
        inset: 0;
        background-image: radial-gradient(
          circle 1px at 1px 1px,
          var(--kl-grid-color, rgb(0 0 0 / 0.04)) 1px,
          transparent 0
        );
        background-size: 24px 24px;
        mask-image: radial-gradient(ellipse 80% 70% at 50% 40%, black 30%, transparent 100%);
        pointer-events: none;
      }

      /* Fade hero into the page surface */
      section::after {
        content: '';
        position: absolute;
        inset: 0;
        background: linear-gradient(to bottom, transparent 60%, var(--kl-surface, #ffffff));
        pointer-events: none;
      }

      /* Accent glow — token resolves to none in light theme */
      .glow {
        position: absolute;
        inset-block-start: -10%;
        inset-inline-start: 50%;
        translate: -50% 0;
        inline-size: min(600px, 90vw);
        block-size: 400px;
        background: var(--kl-hero-glow, none);
        filter: blur(80px);
        pointer-events: none;
      }

      .content {
        position: relative;
        z-index: 1;
        display: grid;
        gap: var(--kl-space-6, 1.5rem);
        justify-items: center;
        text-align: center;
        max-inline-size: var(--kl-content-md, 48rem);
      }

      .eyebrow {
        color: var(--kl-hero-accent, var(--kl-accent, #0d9488));
      }

      .title ::slotted(*) {
        margin: 0;
        font-family: var(--kl-font-sans, 'DM Sans', system-ui, sans-serif);
        font-size: clamp(2.2rem, 5vw, 3.5rem);
        font-weight: var(--kl-weight-bold, 700);
        line-height: var(--kl-leading-tight, 1.2);
        letter-spacing: var(--kl-tracking-tight, -0.03em);
        text-wrap: balance;
      }

      .subtitle ::slotted(*) {
        margin: 0;
        font-size: var(--kl-text-md, 1.25rem);
        line-height: var(--kl-leading-normal, 1.6);
        color: var(--kl-ink-secondary, #3f3f46);
        max-inline-size: 48ch;
        text-wrap: balance;
      }

      .actions {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: var(--kl-space-3, 0.75rem);
      }

      .visual {
        margin-block-start: var(--kl-space-10, 2.5rem);
        inline-size: 100%;
      }

      /* Staggered entrance — 100ms per element */
      :host([animated]) .stagger {
        opacity: 0;
        translate: 0 16px;
        animation: rise var(--kl-duration-slower, 600ms) var(--kl-ease-default, ease) forwards;
      }
      :host([animated]) .stagger:nth-child(2) {
        animation-delay: 0ms;
      }
      :host([animated]) .stagger:nth-child(3) {
        animation-delay: 100ms;
      }
      :host([animated]) .stagger:nth-child(4) {
        animation-delay: 200ms;
      }
      :host([animated]) .stagger:nth-child(5) {
        animation-delay: 300ms;
      }
      :host([animated]) .stagger:nth-child(6) {
        animation-delay: 400ms;
      }

      @keyframes rise {
        to {
          opacity: 1;
          translate: 0 0;
        }
      }

      @media (prefers-reduced-motion: reduce) {
        :host([animated]) .stagger {
          opacity: 1;
          translate: 0 0;
          animation: none;
        }
      }
    `,
  ];

  /** Enable staggered entrance animation. */
  @property({ type: Boolean, reflect: true }) animated = false;

  override render() {
    return html`
      <section part="section">
        <div class="glow" aria-hidden="true"></div>
        <div class="content" part="content">
          <span class="eyebrow kl-label stagger"><slot name="eyebrow"></slot></span>
          <div class="title stagger"><slot name="title"></slot></div>
          <div class="subtitle stagger"><slot name="subtitle"></slot></div>
          <div class="actions stagger"><slot name="actions"></slot></div>
          <div class="visual stagger"><slot name="visual"></slot></div>
        </div>
      </section>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kl-hero': KlHero;
  }
}
