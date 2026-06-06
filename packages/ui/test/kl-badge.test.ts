import { describe, it, expect, afterEach } from 'vitest';
import '../src/components/kl-badge.js';
import type { KlBadge } from '../src/components/kl-badge.js';
import { fixture, cleanup } from './helpers.js';

describe('kl-badge', () => {
  afterEach(cleanup);

  it('registers the custom element', () => {
    expect(customElements.get('kl-badge')).toBeDefined();
  });

  it('renders slotted text inside the badge part', async () => {
    const el = await fixture<KlBadge>('<kl-badge>Beta</kl-badge>');
    const badge = el.shadowRoot!.querySelector('[part="badge"]');
    expect(badge).not.toBeNull();
    expect(el.textContent).toBe('Beta');
  });

  it('defaults to default variant and md size', async () => {
    const el = await fixture<KlBadge>('<kl-badge>X</kl-badge>');
    expect(el.variant).toBe('default');
    expect(el.size).toBe('md');
  });

  it('reflects variant and size attributes', async () => {
    const el = await fixture<KlBadge>('<kl-badge variant="accent" size="sm">X</kl-badge>');
    expect(el.getAttribute('variant')).toBe('accent');
    expect(el.getAttribute('size')).toBe('sm');
  });
});
