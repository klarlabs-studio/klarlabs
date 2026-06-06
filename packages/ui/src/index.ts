/**
 * @klarlabs/ui — Klarlabs design system.
 * Lit web components. Import the side-effectful component modules to
 * register custom elements, or import classes for typing.
 */
export { KlButton } from './components/kl-button.js';
export { KlCard } from './components/kl-card.js';
export { KlBadge } from './components/kl-badge.js';
export { KlMetric } from './components/kl-metric.js';
export { KlCode } from './components/kl-code.js';
export { KlProductCard } from './components/kl-product-card.js';
export { KlNav } from './components/kl-nav.js';
export { KlHero } from './components/kl-hero.js';
export { KlChartLine } from './components/kl-chart-line.js';
export { KlChartBar } from './components/kl-chart-bar.js';
export { KlChartBase } from './components/chart-base.js';
export { KlInput } from './components/kl-input.js';
export { KlDivider } from './components/kl-divider.js';
export { KlToast } from './components/kl-toast.js';
export { KlModal } from './components/kl-modal.js';

export type { KlButtonVariant, KlButtonSize } from './components/kl-button.js';
export type { KlCardVariant } from './components/kl-card.js';
export type { KlBadgeVariant, KlBadgeSize } from './components/kl-badge.js';
export type { KlMetricTrend } from './components/kl-metric.js';
export type { KlProductStatus } from './components/kl-product-card.js';
export type { ChartMargin } from './components/chart-base.js';
export type { KlInputType, KlInputSize } from './components/kl-input.js';
export type { KlDividerOrientation } from './components/kl-divider.js';
export type { KlToastVariant } from './components/kl-toast.js';

export { chartDataSchema, parseChartData } from './schemas/chart-data.js';
export type { ChartDatum } from './schemas/chart-data.js';
