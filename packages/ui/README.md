# @klarlabs-studio/ui

Klarlabs design system — Lit web components. Refined monochrome with a single precise accent (Klarlabs Teal `#0D9488`). Framework-agnostic: works in Astro, Vue, React, or plain HTML.

## Install

```bash
pnpm add @klarlabs-studio/ui lit
```

## Usage

```html
<!-- Load tokens once, globally -->
<link rel="stylesheet" href="@klarlabs-studio/ui/tokens.css" />

<script type="module">
  import '@klarlabs-studio/ui/kl-button.js';
  import '@klarlabs-studio/ui/kl-card.js';
</script>

<kl-card variant="interactive">
  <span slot="header">agent-go</span>
  Production-grade AI agent framework for Go.
  <kl-button slot="footer" variant="secondary">Learn more</kl-button>
</kl-card>
```

Import everything: `import '@klarlabs-studio/ui'` (registers all elements, exports classes + types).

## Components

| Element | Purpose |
| --- | --- |
| `kl-button` | Actions — `primary` / `secondary` / `ghost` / `danger`, `sm`/`md`/`lg`, loading, `href` renders anchor |
| `kl-card` | Container — `default` / `outlined` / `elevated` / `interactive`; slots `header`, `media`, `footer` |
| `kl-badge` | Status label — `accent` / `success` / `warning` / `error` / `neutral`; always uppercase |
| `kl-product-card` | Product showcase — `name`, `description`, `href`, `logo-src`, `status` (live/beta/coming-soon) |
| `kl-metric` | KPI display — `value` (DM Mono), `label`, `trend` (up/down/neutral), `delta` |
| `kl-nav` | Studio nav — transparent → solid on scroll, mobile drawer; slots `brand`, default, `cta`, `drawer` |
| `kl-code` | Code display — `inline` or block; `language`, `copyable`, `line-numbers` |
| `kl-hero` | Landing hero — dark dot-grid surface; slots `eyebrow`, `title`, `subtitle`, `actions`, `visual`; `animated` staggers entrance |
| `kl-chart-line` | D3 line chart — teal line, optional area fill, time or linear x-scale |
| `kl-chart-bar` | D3 bar chart — same design language |

## Theming

Dark mode follows `prefers-color-scheme`; force with `<html data-theme="dark">` (technical pages) or `data-theme="light"` (consumer pages).

Every component exposes CSS custom properties (`--kl-button-bg`, `--kl-card-padding`, …) and `part` attributes for external styling. All values resolve to design tokens — no hardcoded colors.

## Development

```bash
pnpm dev          # demo page at localhost:5173
pnpm test         # vitest + happy-dom
pnpm build        # types + per-component ES modules to dist/
```

## Accessibility

WCAG 2.1 AA: visible teal focus rings, 44px touch targets on coarse pointers, `prefers-reduced-motion` respected everywhere, ARIA labels on charts/trends/nav.
