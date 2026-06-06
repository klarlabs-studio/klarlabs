# Klarlabs Design System — Specification v0.1

> Implemented in [`packages/ui`](../packages/ui). This document is the source-of-truth spec.

**Studio identity:** Smart. Präzise. Wertig. Verlässlich.
**Philosophy:** "We build tools that make complex things clear."
**Origin:** Munich, Germany. European-first, internationally legible.

## Design direction

Refined monochrome with a single precise accent. The quiet confidence of a well-engineered instrument — precise and purposeful, not cold or clinical. The studio identity never fights with its products; it frames them.

**Reference points:** Linear's precision; Bauhaus (function defines form); German engineering (every element earns its place).

**Not:** startup-generic (no purple gradients, no Inter, no blobs), artisan/craft-heavy, cold corporate, maximalist. Restraint is the point.

## Color

- Accent: Klarlabs Teal `#0D9488` (light `#14B8A6`, dim `#0D948820`, border `#0D948840`)
- Monochrome ink scale: `#0A0A0B` → `#3F3F46` → `#71717A` → `#A1A1AA`
- Surfaces light: `#FFFFFF` / `#FAFAFA` / `#F4F4F5`; borders `#E4E4E7` / `#D4D4D8`
- Surfaces dark: `#09090B` / `#111113` / `#18181B`; borders `#27272A` / `#3F3F46`
- Semantic: success `#16A34A`, warning `#D97706`, error `#DC2626`, info = accent

Dark mode is **default for technical/developer pages** (agent-go, mcp-go, Obvia, Nomi); light for consumer products (Pet Medical, Brotwerk) and the studio landing page may go dark-first. Both always implemented. Token implementation: `prefers-color-scheme` + `data-theme="dark|light"` override on `<html>`.

## Typography

- **DM Sans** (display + UI) + **DM Mono** (code + data), Google Fonts
- Scale: Major Third (1.25) — xs 0.64rem … 3xl 3.052rem
- Display: DM Sans 700, tracking −0.03em. Body: 400, leading 1.6
- Labels/badges: 500, uppercase, tracking 0.08em, size xs
- Never below 12px in production

## Spacing & layout

4px base unit (`--kl-space-1..32`), radius 4/8/12/16/full, layered shadows, content widths 320–1536px, z-scale 0/10/100/200/300/400.

## Motion

Durations 50–600ms, default ease `cubic-bezier(0.16, 1, 0.3, 1)`. Purposeful only; fast by default (150–250ms); `prefers-reduced-motion` always respected; staggered page-load reveals.

## Modern CSS requirements

Container queries where possible; CSS Grid for layout; logical properties; native nesting; `@layer reset, base, tokens, components, utilities, overrides`; `clamp()` fluid type; `:has()`; `color-mix()` for tints.

## Architecture

All components are **Lit web components** (`kl-` prefix) for framework-agnostic use (Astro, Vue, React, plain HTML):

- Static styles only (adoptedStyleSheets), design tokens with fallbacks
- Properties typed + reflected; slots for content projection
- `part` attributes exposed for external styling
- Documented CSS custom property API per component (`--kl-button-bg`, …)

D3 charts wrap D3 inside Lit: component owns DOM lifecycle, D3 owns the viz. Teal data color, 10% accent area fills, DM Mono labels, dashed grid at 50% opacity, viewBox + ResizeObserver responsive, line-draw animation on mount (reduced-motion aware).

## Components (v0.1)

`kl-button`, `kl-card`, `kl-badge`, `kl-product-card`, `kl-metric`, `kl-nav`, `kl-code`, `kl-chart-line`, `kl-chart-bar`, `kl-hero`. Planned: `kl-input`, `kl-divider`, `kl-toast`, `kl-modal`.

## Accessibility

WCAG 2.1 AA: contrast 4.5:1 body / 3:1 large; visible teal focus indicators (2px outline, 2px offset); full keyboard nav; ARIA + semantic HTML in shadow DOM; 44×44px touch targets; reduced motion.

## klarlabs.de landing page

Dark-first Astro + Lit. Structure: `kl-nav` → `kl-hero` ("We build tools that make complex things clear.", accent on "clear", dot-grid bg, staggered entrance) → product grid (`kl-product-card`: logo 40×40, name, one-liner, status badge, arrow; hover teal border + −2px lift) → OSS section (mono aesthetic, `kl-code` inline names, pkg.go.dev links, stars) → studio paragraph (Munich / independent) → footer (felixgeelhaar.de, GitHub, writing).

## Quality checklist

- [ ] Tokens only, no hardcoded values
- [ ] Dark mode tested
- [ ] Mobile-first (320 / 768 / 1280)
- [ ] Container queries where appropriate
- [ ] Modern CSS (grid, logical props, clamp, :has, nesting)
- [ ] `prefers-reduced-motion`
- [ ] Teal focus indicators
- [ ] Touch targets ≥ 44px
- [ ] `part` attributes exposed
- [ ] Charts responsive (viewBox + ResizeObserver)
- [ ] Fonts: preconnect + `font-display: swap`

---

*Klarlabs Design System v0.1 — June 2026 — klarlabs.de*
