import { LitElement, html, css, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { labelType } from '../styles/shared.js';

export type KlMetricTrend = 'up' | 'down' | 'neutral';

/**
 * Klarlabs metric — single KPI/stat display.
 * Value in DM Mono, label uppercase DM Sans, optional trend arrow + delta.
 *
 * @csspart value - The metric value
 * @csspart label - The metric label
 * @csspart trend - The trend indicator
 * @cssprop --kl-metric-value-size - Value font size
 */
@customElement('kl-metric')
export class KlMetric extends LitElement {
  static override styles = [
    labelType,
    css`
      :host {
        display: inline-flex;
        flex-direction: column;
        gap: var(--kl-space-1, 0.25rem);
      }

      .value-row {
        display: flex;
        align-items: baseline;
        gap: var(--kl-space-2, 0.5rem);
      }

      .value {
        font-family: var(--kl-font-mono, 'DM Mono', monospace);
        font-size: var(--kl-metric-value-size, clamp(2rem, 4vw, 3rem));
        font-weight: var(--kl-weight-bold, 700);
        line-height: var(--kl-leading-tight, 1.2);
        letter-spacing: var(--kl-tracking-tight, -0.03em);
        color: var(--kl-ink, #0a0a0b);
        font-variant-numeric: tabular-nums;
      }

      .kl-label {
        color: var(--kl-ink-tertiary, #71717a);
      }

      .trend {
        display: inline-flex;
        align-items: center;
        gap: var(--kl-space-1, 0.25rem);
        font-family: var(--kl-font-mono, 'DM Mono', monospace);
        font-size: var(--kl-text-sm, 0.8rem);
        font-variant-numeric: tabular-nums;
      }

      .trend.up {
        color: var(--kl-success, #16a34a);
      }
      .trend.down {
        color: var(--kl-error, #dc2626);
      }
      .trend.neutral {
        color: var(--kl-ink-tertiary, #71717a);
      }
    `,
  ];

  /** Metric value, preformatted (e.g. "1.2M", "99.98%"). */
  @property({ type: String }) value = '';

  /** Short label below the value. */
  @property({ type: String }) label = '';

  /** Trend direction. */
  @property({ type: String, reflect: true }) trend: KlMetricTrend | '' = '';

  /** Delta text shown next to the trend arrow (e.g. "+12%"). */
  @property({ type: String }) delta = '';

  private trendArrow(): string {
    if (this.trend === 'up') return '↑';
    if (this.trend === 'down') return '↓';
    return '→';
  }

  private trendLabel(): string {
    if (this.trend === 'up') return 'trending up';
    if (this.trend === 'down') return 'trending down';
    return 'unchanged';
  }

  override render() {
    return html`
      <div class="value-row">
        <span class="value" part="value">${this.value}</span>
        ${this.trend
          ? html`
              <span
                class="trend ${this.trend}"
                part="trend"
                role="img"
                aria-label="${this.trendLabel()}${this.delta ? `, ${this.delta}` : ''}"
              >
                <span aria-hidden="true">${this.trendArrow()}</span>
                ${this.delta ? html`<span aria-hidden="true">${this.delta}</span>` : nothing}
              </span>
            `
          : nothing}
      </div>
      <span class="kl-label" part="label">${this.label}</span>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kl-metric': KlMetric;
  }
}
