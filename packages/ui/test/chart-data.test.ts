import { describe, it, expect, afterEach, vi } from 'vitest';
import { chartDataSchema, parseChartData } from '../src/schemas/chart-data.js';
import '../src/components/kl-chart-bar.js';
import type { KlChartBar } from '../src/components/kl-chart-bar.js';
import { fixture, cleanup } from './helpers.js';

describe('chartDataSchema', () => {
  it('accepts valid datums with numeric y', () => {
    const schema = chartDataSchema('x', 'y');
    const result = schema.safeParse([
      { x: 'a', y: 1 },
      { x: 'b', y: 2.5 },
    ]);
    expect(result.success).toBe(true);
  });

  it('accepts Date x values', () => {
    const schema = chartDataSchema('date', 'value');
    expect(schema.safeParse([{ date: new Date(), value: 10 }]).success).toBe(true);
  });

  it('rejects datums missing the x key', () => {
    const schema = chartDataSchema('x', 'y');
    expect(schema.safeParse([{ y: 1 }]).success).toBe(false);
  });

  it('rejects non-finite y values', () => {
    const schema = chartDataSchema('x', 'y');
    expect(schema.safeParse([{ x: 'a', y: NaN }]).success).toBe(false);
    expect(schema.safeParse([{ x: 'a', y: Infinity }]).success).toBe(false);
    expect(schema.safeParse([{ x: 'a', y: '12' }]).success).toBe(false);
  });

  it('rejects non-array input', () => {
    const schema = chartDataSchema('x', 'y');
    expect(schema.safeParse({ x: 'a', y: 1 }).success).toBe(false);
  });
});

describe('parseChartData', () => {
  afterEach(() => vi.restoreAllMocks());

  it('returns valid datums untouched', () => {
    const data = [{ x: 'a', y: 1 }];
    expect(parseChartData(data, 'x', 'y', 'kl-chart-bar')).toEqual(data);
  });

  it('filters invalid datums and warns', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const result = parseChartData(
      [{ x: 'a', y: 1 }, { x: 'b', y: 'oops' }, { y: 3 }] as never,
      'x',
      'y',
      'kl-chart-bar',
    );
    expect(result).toEqual([{ x: 'a', y: 1 }]);
    expect(warn).toHaveBeenCalledOnce();
    expect(warn.mock.calls[0]![0]).toContain('kl-chart-bar');
  });

  it('returns empty array for non-array input with a warning', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    expect(parseChartData('nope' as never, 'x', 'y', 'kl-chart-line')).toEqual([]);
    expect(warn).toHaveBeenCalledOnce();
  });
});

describe('chart integration', () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it('renders only valid bars when data is partially invalid', async () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    const el = await fixture<KlChartBar>('<kl-chart-bar></kl-chart-bar>');
    el.animated = false;
    el.data = [{ x: 'ok', y: 5 }, { x: 'bad', y: 'NaN' }] as never;
    await el.updateComplete;
    expect(el.shadowRoot!.querySelectorAll('.kl-chart-bar').length).toBe(1);
  });
});
