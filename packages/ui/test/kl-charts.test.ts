import { describe, it, expect, afterEach } from 'vitest';
import '../src/components/kl-chart-line.js';
import '../src/components/kl-chart-bar.js';
import type { KlChartLine } from '../src/components/kl-chart-line.js';
import type { KlChartBar } from '../src/components/kl-chart-bar.js';
import { fixture, cleanup } from './helpers.js';

const lineData = [
  { x: new Date('2026-01-01'), y: 10 },
  { x: new Date('2026-02-01'), y: 25 },
  { x: new Date('2026-03-01'), y: 18 },
];

const barData = [
  { x: 'agent-go', y: 320 },
  { x: 'mcp-go', y: 410 },
  { x: 'obvia', y: 150 },
];

describe('kl-chart-line', () => {
  afterEach(cleanup);

  it('registers the custom element', () => {
    expect(customElements.get('kl-chart-line')).toBeDefined();
  });

  it('renders an accessible svg', async () => {
    const el = await fixture<KlChartLine>(
      '<kl-chart-line aria-chart-label="Monthly active users"></kl-chart-line>',
    );
    const svg = el.shadowRoot!.querySelector('svg')!;
    expect(svg.getAttribute('role')).toBe('img');
    expect(svg.getAttribute('aria-label')).toBe('Monthly active users');
  });

  it('draws line path and axes from data', async () => {
    const el = await fixture<KlChartLine>('<kl-chart-line animated="false"></kl-chart-line>');
    el.animated = false;
    el.data = lineData;
    await el.updateComplete;

    const svg = el.shadowRoot!.querySelector('svg')!;
    expect(svg.querySelector('.kl-chart-line')).not.toBeNull();
    expect(svg.querySelector('.kl-chart-area')).not.toBeNull();
    expect(svg.querySelectorAll('.kl-chart-axis').length).toBe(2);
    expect(svg.getAttribute('viewBox')).toMatch(/^0 0 \d+ 200$/);
  });

  it('omits the area fill when show-area is false', async () => {
    const el = await fixture<KlChartLine>('<kl-chart-line></kl-chart-line>');
    el.animated = false;
    el.showArea = false;
    el.data = lineData;
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector('.kl-chart-area')).toBeNull();
  });
});

describe('kl-chart-bar', () => {
  afterEach(cleanup);

  it('registers the custom element', () => {
    expect(customElements.get('kl-chart-bar')).toBeDefined();
  });

  it('draws one bar per datum', async () => {
    const el = await fixture<KlChartBar>('<kl-chart-bar></kl-chart-bar>');
    el.animated = false;
    el.data = barData;
    await el.updateComplete;

    const bars = el.shadowRoot!.querySelectorAll('.kl-chart-bar');
    expect(bars.length).toBe(3);
  });

  it('renders grid by default and hides it when show-grid removed', async () => {
    const el = await fixture<KlChartBar>('<kl-chart-bar></kl-chart-bar>');
    el.animated = false;
    el.data = barData;
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector('.kl-chart-grid')).not.toBeNull();

    el.showGrid = false;
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector('.kl-chart-grid')).toBeNull();
  });
});
