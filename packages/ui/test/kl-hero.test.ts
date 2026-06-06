import { describe, it, expect, afterEach } from 'vitest';
import '../src/components/kl-hero.js';
import type { KlHero } from '../src/components/kl-hero.js';
import { fixture, cleanup } from './helpers.js';

describe('kl-hero', () => {
  afterEach(cleanup);

  it('registers the custom element', () => {
    expect(customElements.get('kl-hero')).toBeDefined();
  });

  it('exposes section and content parts', async () => {
    const el = await fixture<KlHero>('<kl-hero></kl-hero>');
    expect(el.shadowRoot!.querySelector('[part="section"]')).not.toBeNull();
    expect(el.shadowRoot!.querySelector('[part="content"]')).not.toBeNull();
  });

  it('provides all five named slots', async () => {
    const el = await fixture<KlHero>('<kl-hero></kl-hero>');
    for (const name of ['eyebrow', 'title', 'subtitle', 'actions', 'visual']) {
      expect(el.shadowRoot!.querySelector(`slot[name="${name}"]`)).not.toBeNull();
    }
  });

  it('projects slotted content', async () => {
    const el = await fixture<KlHero>(
      '<kl-hero><h1 slot="title">We build tools that make complex things clear.</h1></kl-hero>',
    );
    const slot = el.shadowRoot!.querySelector<HTMLSlotElement>('slot[name="title"]')!;
    expect(slot.assignedElements()[0]?.textContent).toContain('complex things clear');
  });

  it('reflects animated attribute', async () => {
    const el = await fixture<KlHero>('<kl-hero animated></kl-hero>');
    expect(el.animated).toBe(true);
    expect(el.hasAttribute('animated')).toBe(true);
  });
});
