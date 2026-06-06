import { z } from 'zod';

export type ChartDatum = Record<string, unknown>;

/**
 * Schema for chart data arrays — runtime validation at the data boundary
 * (chart `data` usually arrives from APIs as untyped JSON).
 * Each datum must carry the x key and a finite numeric y value.
 */
export function chartDataSchema(xKey: string, yKey: string) {
  const datum = z
    .record(z.string(), z.unknown())
    .refine((d) => xKey in d && d[xKey] !== null && d[xKey] !== undefined, {
      message: `missing x value ("${xKey}")`,
    })
    .refine((d) => typeof d[yKey] === 'number' && Number.isFinite(d[yKey]), {
      message: `y value ("${yKey}") must be a finite number`,
    });
  return z.array(datum);
}

/**
 * Validate chart data leniently: keep valid datums, drop invalid ones with
 * a single console.warn naming the offending component. Non-array input
 * yields an empty array.
 */
export function parseChartData(
  data: ChartDatum[],
  xKey: string,
  yKey: string,
  component: string,
): ChartDatum[] {
  if (!Array.isArray(data)) {
    console.warn(`[${component}] data must be an array, got ${typeof data} — ignoring.`);
    return [];
  }

  const schema = chartDataSchema(xKey, yKey);
  const result = schema.safeParse(data);
  if (result.success) return data;

  const badIndices = new Set(result.error.issues.map((issue) => issue.path[0] as number));
  const reasons = result.error.issues
    .slice(0, 3)
    .map((issue) => `[${String(issue.path[0])}] ${issue.message}`)
    .join('; ');
  console.warn(
    `[${component}] dropped ${badIndices.size} invalid datum(s): ${reasons}${
      result.error.issues.length > 3 ? '; …' : ''
    }`,
  );
  return data.filter((_, i) => !badIndices.has(i));
}
