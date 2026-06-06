import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { createRef, ref, type Ref } from 'lit/directives/ref.js';
import { extent, max } from 'd3-array';
import { axisBottom, axisLeft } from 'd3-axis';
import { easeQuadOut } from 'd3-ease';
import { scaleLinear, scaleTime } from 'd3-scale';
import { select } from 'd3-selection';
import { area as d3Area, line as d3Line, curveMonotoneX } from 'd3-shape';
import 'd3-transition';
import { KlChartBase } from './chart-base.js';

/**
 * Klarlabs line chart — D3 inside Lit.
 * Teal line, optional 10%-accent area fill, dashed grid, mono axis labels.
 * Responsive via viewBox + ResizeObserver.
 *
 * @csspart svg - The SVG element
 */
@customElement('kl-chart-line')
export class KlChartLine extends KlChartBase {
  static override styles = [
    KlChartBase.baseStyles,
    css`
      .kl-chart-line {
        fill: none;
        stroke: var(--kl-accent, #0d9488);
        stroke-width: 2;
      }

      .kl-chart-area {
        fill: color-mix(in srgb, var(--kl-accent, #0d9488) 10%, transparent);
      }
    `,
  ];

  /** Fill the area under the line. */
  @property({ type: Boolean, attribute: 'show-area' }) showArea = true;

  /** Treat x values as time (Date or timestamp). */
  @property({ type: Boolean, attribute: 'time-scale' }) timeScale = true;

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

    const xVal = (d: Record<string, unknown>) => d[this.xKey] as number | Date;
    const yVal = (d: Record<string, unknown>) => Number(d[this.yKey]);

    const domain = extent(this.data, xVal) as [number, number];
    const x = this.timeScale
      ? scaleTime().domain(domain).range([0, innerWidth])
      : scaleLinear().domain(domain).range([0, innerWidth]);

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

    if (this.showArea) {
      const area = d3Area<Record<string, unknown>>()
        .x((d) => x(xVal(d)))
        .y0(innerHeight)
        .y1((d) => y(yVal(d)))
        .curve(curveMonotoneX);

      g.append('path').datum(this.data).attr('class', 'kl-chart-area').attr('d', area);
    }

    const line = d3Line<Record<string, unknown>>()
      .x((d) => x(xVal(d)))
      .y((d) => y(yVal(d)))
      .curve(curveMonotoneX);

    const path = g.append('path').datum(this.data).attr('class', 'kl-chart-line').attr('d', line);

    if (this.motionAllowed) {
      const node = path.node();
      const totalLength = node?.getTotalLength?.() ?? 0;
      if (totalLength > 0) {
        path
          .attr('stroke-dasharray', `${totalLength} ${totalLength}`)
          .attr('stroke-dashoffset', totalLength)
          .transition()
          .duration(1000)
          .ease(easeQuadOut)
          .attr('stroke-dashoffset', 0);
      }
    }

    g.append('g')
      .attr('class', 'kl-chart-axis')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(axisBottom(x).ticks(5));

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
    'kl-chart-line': KlChartLine;
  }
}
