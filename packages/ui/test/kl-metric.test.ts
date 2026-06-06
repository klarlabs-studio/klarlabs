import { describe, it, expect, afterEach } from 'vitest';
import '../src/components/kl-metric.js';
import type { KlMetric } from '../src/components/kl-metric.js';
import { fixture, cleanup } from './helpers.js';

describe('kl-metric', () => {
  afterEach(cleanup);

  it('registers the custom element', () => {
    expect(customElements.get('kl-metric')).toBeDefined();
  });

  it('renders value and label', async () => {
    const el = await fixture<KlMetric>('<kl-metric value="99.98%" label="Uptime"></kl-metric>');
    expect(el.shadowRoot!.querySelector('[part="value"]')!.textContent).toBe('99.98%');
    expect(el.shadowRoot!.querySelector('[part="label"]')!.textContent).toBe('Uptime');
  });

  it('hides the trend indicator without a trend', async () => {
    const el = await fixture<KlMetric>('<kl-metric value="1" label="x"></kl-metric>');
    expect(el.shadowRoot!.querySelector('[part="trend"]')).toBeNull();
  });

  it('renders an accessible trend with delta', async () => {
    const el = await fixture<KlMetric>(
      '<kl-metric value="1.2M" label="Requests" trend="up" delta="+12%"></kl-metric>',
    );
    const trend = el.shadowRoot!.querySelector('[part="trend"]')!;
    expect(trend.classList.contains('up')).toBe(true);
    expect(trend.getAttribute('aria-label')).toBe('trending up, +12%');
    expect(trend.textContent).toContain('↑');
    expect(trend.textContent).toContain('+12%');
  });

  it('uses down arrow and error color class for downward trend', async () => {
    const el = await fixture<KlMetric>(
      '<kl-metric value="3" label="Errors" trend="down" delta="-2%"></kl-metric>',
    );
    const trend = el.shadowRoot!.querySelector('[part="trend"]')!;
    expect(trend.classList.contains('down')).toBe(true);
    expect(trend.textContent).toContain('↓');
  });
});
