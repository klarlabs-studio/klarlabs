import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { labelType, reducedMotion } from '../styles/shared.js';

/**
 * Klarlabs hero — full-width landing section.
 * Dark surface with subtle dot grid, staggered entrance animation.
 *
 * @slot eyebrow - Small uppercase label above the title
 * @slot title - Main heading
 * @slot subtitle - Supporting copy
 * @slot actions - CTA buttons
 * @slot visual - Optional visual below/beside content
 * @csspart section - The section element
 * @csspart content - Inner content wrapper
 * @cssprop --kl-hero-bg - Background override
 * @cssprop --kl-hero-min-height - Minimum height (default 70vh)
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
        background: var(--kl-hero-bg, var(--kl-dark-surface, #09090b));
        color: var(--kl-dark-ink, #fafafa);
        overflow: hidden;
      }

      /* Subtle dot grid */
      section::before {
        content: '';
        position: absolute;
        inset: 0;
        background-image: radial-gradient(
          circle 1px at 1px 1px,
          var(--kl-dark-border, #27272a) 1px,
          transparent 0
        );
        background-size: 24px 24px;
        mask-image: radial-gradient(ellipse 80% 70% at 50% 40%, black 30%, transparent 100%);
        pointer-events: none;
      }

      .content {
        position: relative;
        display: grid;
        gap: var(--kl-space-6, 1.5rem);
        justify-items: center;
        text-align: center;
        max-inline-size: var(--kl-content-md, 48rem);
      }

      .eyebrow {
        color: var(--kl-accent, #0d9488);
      }

      .title ::slotted(*) {
        margin: 0;
        font-family: var(--kl-font-sans, 'DM Sans', system-ui, sans-serif);
        font-size: clamp(2.5rem, 5vw, 4rem);
        font-weight: var(--kl-weight-bold, 700);
        line-height: var(--kl-leading-tight, 1.2);
        letter-spacing: var(--kl-tracking-tight, -0.03em);
        text-wrap: balance;
      }

      .subtitle ::slotted(*) {
        margin: 0;
        font-size: var(--kl-text-md, 1.25rem);
        line-height: var(--kl-leading-normal, 1.6);
        color: var(--kl-dark-ink-secondary, #a1a1aa);
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
      :host([animated]) .stagger:nth-child(1) {
        animation-delay: 0ms;
      }
      :host([animated]) .stagger:nth-child(2) {
        animation-delay: 100ms;
      }
      :host([animated]) .stagger:nth-child(3) {
        animation-delay: 200ms;
      }
      :host([animated]) .stagger:nth-child(4) {
        animation-delay: 300ms;
      }
      :host([animated]) .stagger:nth-child(5) {
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
