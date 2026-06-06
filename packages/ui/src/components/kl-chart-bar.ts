import { html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import { createRef, ref, type Ref } from 'lit/directives/ref.js';
import { max } from 'd3-array';
import { axisBottom, axisLeft } from 'd3-axis';
import { easeQuadOut } from 'd3-ease';
import { scaleBand, scaleLinear } from 'd3-scale';
import { select } from 'd3-selection';
import 'd3-transition';
import { KlChartBase } from './chart-base.js';

/**
 * Klarlabs bar chart — D3 inside Lit.
 * Same design language as kl-chart-line: teal bars, dashed grid,
 * mono axis labels. Responsive via viewBox + ResizeObserver.
 *
 * @csspart svg - The SVG element
 */
@customElement('kl-chart-bar')
export class KlChartBar extends KlChartBase {
  static override styles = [
    KlChartBase.baseStyles,
    css`
      .kl-chart-bar {
        fill: var(--kl-accent, #0d9488);
        rx: 2;
      }

      .kl-chart-bar:hover {
        fill: var(--kl-accent-light, #14b8a6);
      }
    `,
  ];

  private svgRef: Ref<SVGSVGElement> = createRef();

  protected renderChart() {
    const svgEl = this.svgRef.value;
    if (!svgEl || !this.data.length) return;

    const width = this.getBoundingClientRect().width || 640;
    const { top, right, bottom, left } = this.margin;
    const innerWidth = Math.max(width - left - right, 0);
    const innerHeight = Math.max(this.height - top - bottom, 0);

    const svg = select(svgEl);
    svg.selectAll('*').remove();

    const g = svg
      .attr('viewBox', `0 0 ${width} ${this.height}`)
      .append('g')
      .attr('transform', `translate(${left},${top})`);

    const xVal = (d: Record<string, unknown>) => String(d[this.xKey]);
    const yVal = (d: Record<string, unknown>) => Number(d[this.yKey]);

    const x = scaleBand()
      .domain(this.data.map(xVal))
      .range([0, innerWidth])
      .padding(0.25);

    const y = scaleLinear()
      .domain([0, (max(this.data, yVal) ?? 0) * 1.1])
      .range([innerHeight, 0]);

    if (this.showGrid) {
      g.append('g')
        .attr('class', 'kl-chart-grid')
        .call(
          axisLeft(y)
            .tickSize(-innerWidth)
            .tickFormat(() => ''),
        );
    }

    const bars = g
      .selectAll('rect.kl-chart-bar')
      .data(this.data)
      .join('rect')
      .attr('class', 'kl-chart-bar')
      .attr('x', (d) => x(xVal(d)) ?? 0)
      .attr('width', x.bandwidth());

    if (this.motionAllowed) {
      bars
        .attr('y', innerHeight)
        .attr('height', 0)
        .transition()
        .duration(600)
        .ease(easeQuadOut)
        .delay((_, i) => i * 40)
        .attr('y', (d) => y(yVal(d)))
        .attr('height', (d) => innerHeight - y(yVal(d)));
    } else {
      bars
        .attr('y', (d) => y(yVal(d)))
        .attr('height', (d) => innerHeight - y(yVal(d)));
    }

    g.append('g')
      .attr('class', 'kl-chart-axis')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(axisBottom(x));

    g.append('g').attr('class', 'kl-chart-axis').call(axisLeft(y).ticks(5));
  }

  override render() {
    return html`<svg
      ${ref(this.svgRef)}
      part="svg"
      role="img"
      aria-label=${this.ariaChartLabel}
    ></svg>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kl-chart-bar': KlChartBar;
  }
}
