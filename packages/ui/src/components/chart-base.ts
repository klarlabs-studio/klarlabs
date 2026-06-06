import { LitElement, css } from 'lit';
import { property } from 'lit/decorators.js';

export interface ChartMargin {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

/**
 * Shared base for D3 chart components.
 * Handles ResizeObserver re-render, reduced-motion detection, and the
 * common Klarlabs chart styling (axes, grid, mono labels).
 */
export abstract class KlChartBase extends LitElement {
  static baseStyles = css`
    :host {
      display: block;
      inline-size: 100%;
    }

    svg {
      inline-size: 100%;
      block-size: auto;
      overflow: visible;
      display: block;
    }

    .kl-chart-axis text {
      font-family: var(--kl-font-mono, 'DM Mono', monospace);
      font-size: var(--kl-text-xs, 0.64rem);
      fill: var(--kl-ink-tertiary, #71717a);
    }

    .kl-chart-axis line,
    .kl-chart-axis path {
      stroke: var(--kl-border, #e4e4e7);
    }

    .kl-chart-grid line {
      stroke: var(--kl-border, #e4e4e7);
      stroke-dasharray: 4 4;
      opacity: 0.5;
    }

    .kl-chart-grid path {
      display: none;
    }
  `;

  /** Chart data. */
  @property({ type: Array }) data: Record<string, unknown>[] = [];

  /** Key for the x value in each datum. */
  @property({ type: String, attribute: 'x-key' }) xKey = 'x';

  /** Key for the y value in each datum. */
  @property({ type: String, attribute: 'y-key' }) yKey = 'y';

  /** Chart height in px. */
  @property({ type: Number }) height = 200;

  /** Show dashed grid lines. */
  @property({ type: Boolean, attribute: 'show-grid' }) showGrid = true;

  /** Animate on data change (respects prefers-reduced-motion). */
  @property({ type: Boolean }) animated = true;

  /** Accessible chart description. */
  @property({ type: String, attribute: 'aria-chart-label' }) ariaChartLabel = 'Chart';

  protected margin: ChartMargin = { top: 16, right: 16, bottom: 32, left: 48 };

  private resizeObserver?: ResizeObserver;

  protected get motionAllowed(): boolean {
    return (
      this.animated &&
      typeof matchMedia === 'function' &&
      !matchMedia('(prefers-reduced-motion: reduce)').matches
    );
  }

  override firstUpdated() {
    if (typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver(() => this.renderChart());
      this.resizeObserver.observe(this);
    }
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this.resizeObserver?.disconnect();
  }

  override updated() {
    this.renderChart();
  }

  /** Subclasses draw into their SVG here. */
  protected abstract renderChart(): void;
}
