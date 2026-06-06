import { describe, it, expect, afterEach } from 'vitest';
import '../src/components/kl-product-card.js';
import type { KlProductCard } from '../src/components/kl-product-card.js';
import { fixture, cleanup } from './helpers.js';

describe('kl-product-card', () => {
  afterEach(cleanup);

  it('registers the custom element', () => {
    expect(customElements.get('kl-product-card')).toBeDefined();
  });

  it('renders name, description, and link', async () => {
    const el = await fixture<KlProductCard>(
      '<kl-product-card name="Obvia" description="Observability toolkit" href="/obvia"></kl-product-card>',
    );
    expect(el.shadowRoot!.querySelector('[part="name"]')!.textContent).toBe('Obvia');
    expect(el.shadowRoot!.querySelector('[part="description"]')!.textContent).toBe(
      'Observability toolkit',
    );
    expect(el.shadowRoot!.querySelector('a')!.getAttribute('href')).toBe('/obvia');
  });

  it('shows human-readable status labels', async () => {
    const el = await fixture<KlProductCard>(
      '<kl-product-card name="Nomi" status="coming-soon"></kl-product-card>',
    );
    expect(el.shadowRoot!.querySelector('[part="status"]')!.textContent).toBe('Coming soon');
  });

  it('falls back to first letter when no logo provided', async () => {
    const el = await fixture<KlProductCard>('<kl-product-card name="Brotwerk"></kl-product-card>');
    const fallback = el.shadowRoot!.querySelector('.logo-fallback')!;
    expect(fallback.textContent).toBe('B');
    expect(el.shadowRoot!.querySelector('img')).toBeNull();
  });

  it('renders logo image with empty alt when logo-src set', async () => {
    const el = await fixture<KlProductCard>(
      '<kl-product-card name="X" logo-src="/logo.svg"></kl-product-card>',
    );
    const img = el.shadowRoot!.querySelector('img')!;
    expect(img.getAttribute('src')).toBe('/logo.svg');
    expect(img.getAttribute('alt')).toBe('');
  });
});
