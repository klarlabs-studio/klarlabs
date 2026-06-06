import { describe, it, expect, afterEach } from 'vitest';
import '../src/components/kl-card.js';
import type { KlCard } from '../src/components/kl-card.js';
import { fixture, cleanup } from './helpers.js';

describe('kl-card', () => {
  afterEach(cleanup);

  it('registers the custom element', () => {
    expect(customElements.get('kl-card')).toBeDefined();
  });

  it('exposes container/header/body/footer parts', async () => {
    const el = await fixture<KlCard>('<kl-card>Body</kl-card>');
    for (const part of ['container', 'header', 'body', 'footer']) {
      expect(el.shadowRoot!.querySelector(`[part="${part}"]`)).not.toBeNull();
    }
  });

  it('defaults to the default variant', async () => {
    const el = await fixture<KlCard>('<kl-card>Body</kl-card>');
    expect(el.variant).toBe('default');
  });

  it('reflects variant attribute', async () => {
    const el = await fixture<KlCard>('<kl-card variant="interactive">Body</kl-card>');
    expect(el.getAttribute('variant')).toBe('interactive');
  });

  it('marks header/footer wrappers when slotted content exists', async () => {
    const el = await fixture<KlCard>(
      '<kl-card><span slot="header">H</span>Body<span slot="footer">F</span></kl-card>',
    );
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector('.header')!.classList.contains('has-content')).toBe(true);
    expect(el.shadowRoot!.querySelector('.footer')!.classList.contains('has-content')).toBe(true);
  });

  it('hides header/footer wrappers without slotted content', async () => {
    const el = await fixture<KlCard>('<kl-card>Body</kl-card>');
    expect(el.shadowRoot!.querySelector('.header')!.classList.contains('has-content')).toBe(false);
    expect(el.shadowRoot!.querySelector('.footer')!.classList.contains('has-content')).toBe(false);
  });
});
