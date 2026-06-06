import { describe, it, expect, afterEach } from 'vitest';
import '../src/components/kl-divider.js';
import type { KlDivider } from '../src/components/kl-divider.js';
import { fixture, cleanup } from './helpers.js';

describe('kl-divider', () => {
  afterEach(cleanup);

  it('registers the custom element', () => {
    expect(customElements.get('kl-divider')).toBeDefined();
  });

  it('renders a horizontal separator by default', async () => {
    const el = await fixture<KlDivider>('<kl-divider></kl-divider>');
    const divider = el.shadowRoot!.querySelector('[part="divider"]')!;
    expect(divider.getAttribute('role')).toBe('separator');
    expect(divider.getAttribute('aria-orientation')).toBe('horizontal');
    expect(divider.classList.contains('plain')).toBe(true);
  });

  it('renders a centered label when slotted', async () => {
    const el = await fixture<KlDivider>('<kl-divider>Open source</kl-divider>');
    const divider = el.shadowRoot!.querySelector('[part="divider"]')!;
    expect(divider.classList.contains('plain')).toBe(false);
    expect(el.shadowRoot!.querySelector('.kl-label')).not.toBeNull();
  });

  it('supports vertical orientation', async () => {
    const el = await fixture<KlDivider>('<kl-divider orientation="vertical"></kl-divider>');
    expect(
      el.shadowRoot!.querySelector('[part="divider"]')!.getAttribute('aria-orientation'),
    ).toBe('vertical');
  });
});
