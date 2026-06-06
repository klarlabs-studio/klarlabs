/**
 * Edge-case and branch coverage for behaviors not covered by the
 * per-component happy-path suites.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';
import '../src/index.js';
import type { KlButton } from '../src/components/kl-button.js';
import type { KlCard } from '../src/components/kl-card.js';
import type { KlCode } from '../src/components/kl-code.js';
import type { KlMetric } from '../src/components/kl-metric.js';
import type { KlModal } from '../src/components/kl-modal.js';
import type { KlToast } from '../src/components/kl-toast.js';
import type { KlDivider } from '../src/components/kl-divider.js';
import type { KlInput } from '../src/components/kl-input.js';
import type { KlProductCard } from '../src/components/kl-product-card.js';
import type { KlChartLine } from '../src/components/kl-chart-line.js';
import type { KlChartBar } from '../src/components/kl-chart-bar.js';
import { fixture, cleanup } from './helpers.js';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe('index entrypoint', () => {
  it('registers every kl- element', () => {
    for (const tag of [
      'kl-button',
      'kl-card',
      'kl-badge',
      'kl-metric',
      'kl-code',
      'kl-product-card',
      'kl-nav',
      'kl-hero',
      'kl-chart-line',
      'kl-chart-bar',
      'kl-input',
      'kl-divider',
      'kl-toast',
      'kl-modal',
    ]) {
      expect(customElements.get(tag), tag).toBeDefined();
    }
  });
});

describe('kl-button edge cases', () => {
  it('omits rel for non-blank targets', async () => {
    const el = await fixture<KlButton>('<kl-button href="/x" target="_self">Go</kl-button>');
    expect(el.shadowRoot!.querySelector('a')!.hasAttribute('rel')).toBe(false);
  });

  it('supports submit type', async () => {
    const el = await fixture<KlButton>('<kl-button type="submit">Send</kl-button>');
    expect(el.shadowRoot!.querySelector('button')!.type).toBe('submit');
  });
});

describe('kl-card slot updates', () => {
  it('re-renders when slotted content is added after mount', async () => {
    const el = await fixture<KlCard>('<kl-card>Body</kl-card>');
    expect(el.shadowRoot!.querySelector('.footer')!.classList.contains('has-content')).toBe(false);

    const footer = document.createElement('span');
    footer.slot = 'footer';
    footer.textContent = 'F';
    el.appendChild(footer);
    await el.updateComplete;
    await el.updateComplete; // slotchange → requestUpdate → second cycle
    expect(el.shadowRoot!.querySelector('.footer')!.classList.contains('has-content')).toBe(true);
  });
});

describe('kl-code copy', () => {
  it('copies code text and toggles the copied state', async () => {
    vi.useFakeTimers();
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal('navigator', { ...navigator, clipboard: { writeText } });

    const el = await fixture<KlCode>('<kl-code copyable>const x = 1;</kl-code>');
    const button = el.shadowRoot!.querySelector<HTMLButtonElement>('[part="copy-button"]')!;
    button.click();
    await vi.waitFor(() => expect(writeText).toHaveBeenCalledWith('const x = 1;'), {
      timeout: 1000,
    });
    await el.updateComplete;
    expect(button.textContent!.trim()).toBe('Copied');

    vi.advanceTimersByTime(2100);
    await el.updateComplete;
    expect(button.textContent!.trim()).toBe('Copy');
    vi.useRealTimers();
  });

  it('survives clipboard failure without state change', async () => {
    vi.stubGlobal('navigator', {
      ...navigator,
      clipboard: { writeText: vi.fn().mockRejectedValue(new Error('denied')) },
    });
    const el = await fixture<KlCode>('<kl-code copyable>x</kl-code>');
    const button = el.shadowRoot!.querySelector<HTMLButtonElement>('[part="copy-button"]')!;
    button.click();
    await el.updateComplete;
    expect(button.textContent!.trim()).toBe('Copy');
  });
});

describe('kl-metric neutral trend', () => {
  it('renders → arrow and "unchanged" label', async () => {
    const el = await fixture<KlMetric>(
      '<kl-metric value="7" label="Products" trend="neutral"></kl-metric>',
    );
    const trend = el.shadowRoot!.querySelector('[part="trend"]')!;
    expect(trend.textContent).toContain('→');
    expect(trend.getAttribute('aria-label')).toBe('unchanged');
  });
});

describe('kl-modal backdrop', () => {
  it('closes on backdrop click when enabled', async () => {
    const el = await fixture<KlModal>('<kl-modal open>Body</kl-modal>');
    await el.updateComplete;
    el.shadowRoot!.querySelector('dialog')!.dispatchEvent(
      new MouseEvent('click', { bubbles: true }),
    );
    await el.updateComplete;
    expect(el.open).toBe(false);
  });

  it('stays open on backdrop click when close-on-backdrop is off', async () => {
    const el = await fixture<KlModal>('<kl-modal open>Body</kl-modal>');
    el.closeOnBackdrop = false;
    await el.updateComplete;
    el.shadowRoot!.querySelector('dialog')!.dispatchEvent(
      new MouseEvent('click', { bubbles: true }),
    );
    await el.updateComplete;
    expect(el.open).toBe(true);
  });

  it('ignores clicks on modal content', async () => {
    const el = await fixture<KlModal>('<kl-modal open>Body</kl-modal>');
    await el.updateComplete;
    el.shadowRoot!.querySelector('.body')!.dispatchEvent(
      new MouseEvent('click', { bubbles: true }),
    );
    await el.updateComplete;
    expect(el.open).toBe(true);
  });
});

describe('kl-toast title slot', () => {
  it('marks the title wrapper when a title is slotted', async () => {
    const el = await fixture<KlToast>(
      '<kl-toast open duration="0"><span slot="title">Deployed</span>Live.</kl-toast>',
    );
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector('.title')!.classList.contains('has-content')).toBe(true);
  });
});

describe('kl-divider slot updates', () => {
  it('switches from plain to labelled when text is added', async () => {
    const el = await fixture<KlDivider>('<kl-divider></kl-divider>');
    expect(el.shadowRoot!.querySelector('.divider')!.classList.contains('plain')).toBe(true);

    el.append('Open source');
    await el.updateComplete;
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector('.divider')!.classList.contains('plain')).toBe(false);
  });
});

describe('kl-input aria wiring', () => {
  it('points aria-describedby at helper, then error', async () => {
    const el = await fixture<KlInput>('<kl-input helper="Hint"></kl-input>');
    const input = el.shadowRoot!.querySelector('input')!;
    expect(input.getAttribute('aria-describedby')).toBe('helper');

    el.error = 'Broken';
    await el.updateComplete;
    expect(input.getAttribute('aria-describedby')).toBe('error');
  });

  it('omits aria-describedby without helper or error', async () => {
    const el = await fixture<KlInput>('<kl-input></kl-input>');
    expect(el.shadowRoot!.querySelector('input')!.hasAttribute('aria-describedby')).toBe(false);
  });

  it('forwards name/required/readonly to the native input', async () => {
    const el = await fixture<KlInput>('<kl-input name="email" required readonly></kl-input>');
    const input = el.shadowRoot!.querySelector('input')!;
    expect(input.getAttribute('name')).toBe('email');
    expect(input.required).toBe(true);
    expect(input.readOnly).toBe(true);
  });
});

describe('kl-product-card unknown status', () => {
  it('falls back to the raw status string', async () => {
    const el = await fixture<KlProductCard>(
      '<kl-product-card name="X" status="archived"></kl-product-card>',
    );
    expect(el.shadowRoot!.querySelector('[part="status"]')!.textContent).toBe('archived');
  });
});

describe('chart edge cases', () => {
  const lineData = [
    { x: 1, y: 10 },
    { x: 2, y: 20 },
  ];

  it('kl-chart-line uses a linear x-scale when time-scale is off', async () => {
    const el = await fixture<KlChartLine>('<kl-chart-line></kl-chart-line>');
    el.animated = false;
    el.timeScale = false;
    el.data = lineData;
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector('.kl-chart-line')).not.toBeNull();
  });

  it('kl-chart-line renders without grid when show-grid removed', async () => {
    const el = await fixture<KlChartLine>('<kl-chart-line></kl-chart-line>');
    el.animated = false;
    el.showGrid = false;
    el.data = lineData;
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector('.kl-chart-grid')).toBeNull();
  });

  it('kl-chart-line animates the line draw when motion is allowed', async () => {
    const el = await fixture<KlChartLine>('<kl-chart-line></kl-chart-line>');
    // happy-dom lacks getTotalLength — provide it on the rendered path
    el.data = lineData;
    const proto = Object.getPrototypeOf(
      el.shadowRoot!.querySelector('svg')!,
    ) as unknown as Record<string, unknown>;
    void proto;
    // re-render with a stubbed getTotalLength via prototype of created paths
    const origCreate = document.createElementNS.bind(document);
    vi.spyOn(document, 'createElementNS').mockImplementation(((ns: string, name: string) => {
      const node = origCreate(ns, name) as SVGPathElement & { getTotalLength?: () => number };
      if (name === 'path') node.getTotalLength = () => 100;
      return node;
    }) as never);
    el.data = [...lineData, { x: 3, y: 30 }];
    await el.updateComplete;
    const path = el.shadowRoot!.querySelector('.kl-chart-line')!;
    expect(path.getAttribute('stroke-dasharray')).toContain('100');
  });

  it('kl-chart-bar renders animated bars without throwing', async () => {
    const el = await fixture<KlChartBar>('<kl-chart-bar></kl-chart-bar>');
    el.data = [
      { x: 'a', y: 1 },
      { x: 'b', y: 2 },
    ];
    await el.updateComplete;
    expect(el.shadowRoot!.querySelectorAll('.kl-chart-bar').length).toBe(2);
  });

  it('charts render nothing with empty data', async () => {
    const el = await fixture<KlChartLine>('<kl-chart-line></kl-chart-line>');
    el.data = [];
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector('.kl-chart-line')).toBeNull();
  });

  it('disconnect tears down the ResizeObserver without errors', async () => {
    const el = await fixture<KlChartBar>('<kl-chart-bar></kl-chart-bar>');
    el.remove();
    expect(el.isConnected).toBe(false);
  });
});
