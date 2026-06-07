# Klarlabs Product Standards v1

Decided 2026-06-07 (Felix + audit of all 9 product repos). Every Klarlabs
product converges on these patterns. Deviations require a documented
exception in this file.

## Scope

**SaaS products** (full standard): Obvia, Pet Medical, Brotwerk,
KraftSport Coach, Nexa, Lexora.

**Sanctioned exceptions** (partial standard — marketing + beta labeling only):
- **Armada, Dispatch** — Atlassian Forge apps: tenancy = per-Atlassian-site,
  auth = Forge, in-app UI = Atlassian UI Kit (locked by platform).
- **Nomi** — local-first desktop/daemon: per-user, bearer token, shadcn UI.
- **Nox** — OSS CLI/scanner: no tenancy/auth; site follows marketing standard.

## 1. Deployment

- SaaS products run on the Klarlabs k3s cluster (Hetzner, EU).
- Images on **GHCR** under the product's org/owner; semver tags.
- CI builds + pushes on tag; **Keel** rolls deployments
  (`keel.sh/policy: minor`, poll @5m). No manual kubectl in the loop.
- One namespace per product. PodSecurity `restricted` compliant.
- TLS via cert-manager (`letsencrypt-prod`), ingress traefik.
- **Migration**: KraftSport Coach moves from GCP Cloud Run to k3s.

## 2. Tenancy

- **Multi-tenant, shared-schema Postgres with Row-Level Security** as the
  security boundary (Lexora pattern: app connects as non-superuser with
  `FORCE ROW LEVEL SECURITY`; RLS isolation test suite runs on every PR).
- **Two tenant types** (Pet Medical pattern): `individual` (auto-created at
  registration) and `organization` (multi-user, roles).
- Tenant context derived server-side from the session/token — never from
  client-supplied headers.
- Per-tenant rate limiting (fortify, Redis-backed store) before GA.

## 3. Auth (per-product identity)

Each product owns its identity bounded context. No central Klarlabs SSO
(revisit when cross-product accounts become a real user need).

Standard methods, all three:
1. **Magic link** (email, 15-min TTL) — the default CTA
2. **Passkeys** (WebAuthn) — promoted after first login
3. **Password + optional TOTP 2FA** — fallback

Sessions: HttpOnly Secure cookies, server-side session store with
revocation. Argon2id for password hashing. Standard flows: register,
verify email, reset, logout-everywhere.

**No OAuth social login** in the baseline (decision 2026-06-07).

## 4. Domains & marketing/product split

Marketing and product are **separate deployables** — separate repo or a
`/site` directory deployed independently (never one app serving both).

| Surface | Domain | Content |
|---|---|---|
| Marketing | `<product-domain>` + `www` (301 → apex) | Static Astro. Pitch, pricing, legal, waitlist. No auth. |
| Product | `app.<product-domain>` | The actual application. |
| API | `api.<product-domain>` | Public API if any. |

Reference implementation: Pet Medical (`pet-medical.de` /
`app.pet-medical.de` / `api.pet-medical.de`, legacy URLs 301-mapped).

Every marketing page links back to the studio via `kl-klarlabs-badge`.

## 5. Public Beta labeling

Nothing has been publicly launched. Until a product's GA decision:
- Marketing hero: `kl-badge variant="accent"` with **"Public Beta"**
  (exact wording) next to the product name.
- Product app shell: persistent "Public Beta" badge in the nav.
- klarlabs.de product grid + Unterseiten: status `beta` → renders
  "Public Beta" (already live).
- Replace ad-hoc wording ("pilot", "private alpha", "closed beta") with
  "Public Beta" everywhere user-facing; internal gating (waitlists,
  signup-disabled flags) may remain.

## 6. Design system

- `@klarlabs-studio/ui` published to **GitHub Packages**
  (`npm.pkg.github.com`, scope @klarlabs-studio — GH Packages requires scope = owner).
- **Marketing sites**: full adoption — tokens.css + kl- components,
  DM Sans/DM Mono, `data-theme` per product (see design-system spec v2).
- **Product apps**: tokens minimum (colors, type, spacing, motion via
  `--kl-*` custom properties + product accent), kl- components where they
  fit (Lit works inside Vue/Astro). Existing app-specific components may
  remain but consume the tokens.
- **Product accent** via `--kl-accent` override per product:

| Product | Theme | Accent |
|---|---|---|
| Obvia | dark | `#6366F1` indigo |
| Nox | dark | `#EF4444` red |
| Armada | dark | `#0D9488` teal |
| Pet Medical | light | `#0EA5E9` sky |
| Brotwerk | light | `#D97706` amber |
| KraftSport Coach | light | `#0D9488` teal |
| Nexa | light | `#8B5CF6` violet |
| Lexora | light | `#0D9488` teal |
| Dispatch | dark | `#0D9488` teal |

- Klarlabs teal always present: klarlabs badge, footer links.
- glossa-elements (i18n web components) is orthogonal — keep.
- Nexa drops IBM Plex for DM Sans/DM Mono.

## 7. Billing

Stripe, per-tenant plans (Pet Medical: caretaker/professional/practice;
Lexora: per-module). Webhook-driven entitlements. No billing during
Public Beta unless explicitly enabled per product.

## 8. Stack conventions (already mostly converged)

Go (DDD, hexagonal, bounded contexts) + Postgres (sqlc, golang-migrate)
+ Astro/Vue frontend islands + first-party libraries: bolt (logging),
fortify (resilience), statekit (state machines), agent-go/axi-go/mcp-go
(AI), chronos (time-series), mnemos (memory). OpenTelemetry + Prometheus.
TypeScript strict + zod at boundaries. TDD.

## 9. Gap matrix (audit 2026-06-07)

| Product | Tenancy gap | Auth gap | Split gap | DS gap | Beta gap |
|---|---|---|---|---|---|
| Pet Medical | RLS enforcement (has tenant_id, add RLS) | passkeys | — ✅ | tokens adoption | add badges |
| Lexora | — ✅ | magic link, passkeys, TOTP | — ✅ | adopt @klarlabs-studio/ui in /site | add badges |
| Obvia | RLS | passkeys (has rest) | **extract marketing site** | tokens adoption | replace "pilot" |
| Brotwerk | org tenancy + RLS | passkeys, password+TOTP | **extract marketing site** | tokens adoption | reword to Public Beta |
| KraftSport | org tenancy + RLS | magic link, passkeys, TOTP | **extract marketing site** | tokens adoption | replace "private alpha" + **GCP→k3s** |
| Nexa | RLS from day 1 | per plan ✅ (add TOTP) | plan /site | DM fonts + tokens | badge at launch |
| Armada | exception | exception | — ✅ (armada.run → klarlabs DS) | marketing site only | add badge |
| Dispatch | exception | exception | **create marketing site** | marketing site only | add badge |
| Nomi | exception | exception | create marketing page (klarlabs.de suffices) | exception | version-label OK |
| Nox | exception | exception | — ✅ (nox-hq.dev → klarlabs DS) | marketing site only | add badge |

## 10. Migration waves

1. **Wave 0 — beta labeling** (days): badges + wording on all marketing
   surfaces and app shells. klarlabs.de done 2026-06-07.
2. **Wave 1 — publish @klarlabs-studio/ui** (days): GitHub Packages, versioned;
   adopt in lexora/site + pet-medical-www first.
3. **Wave 2 — marketing extractions** (per product): Obvia, Brotwerk,
   KraftSport, Dispatch get standalone marketing sites on the standard
   domain layout, built with @klarlabs-studio/ui.
4. **Wave 3 — auth convergence**: shared Go auth library implementing the
   three methods; products adopt incrementally (Lexora first — fewest
   users; then Brotwerk, KraftSport, Obvia, Pet Medical).
5. **Wave 4 — tenancy/RLS**: RLS rollout in Pet Medical, Obvia, Brotwerk,
   KraftSport (with RLS test suites per Lexora pattern).
6. **Wave 5 — infra**: KraftSport GCP → k3s.

---
*Standards v1 — 2026-06-07. Owner: Felix. Change via PR to this file.*
