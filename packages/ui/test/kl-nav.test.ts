import { describe, it, expect, afterEach } from 'vitest';
import '../src/components/kl-nav.js';
import type { KlNav } from '../src/components/kl-nav.js';
import { fixture, cleanup } from './helpers.js';

describe('kl-nav', () => {
  afterEach(cleanup);

  it('registers the custom element', () => {
    expect(customElements.get('kl-nav')).toBeDefined();
  });

  it('renders a labelled nav landmark', async () => {
    const el = await fixture<KlNav>('<kl-nav></kl-nav>');
    const nav = el.shadowRoot!.querySelector('nav')!;
    expect(nav.getAttribute('aria-label')).toBe('Main');
  });

  it('opens and closes the mobile drawer', async () => {
    const el = await fixture<KlNav>('<kl-nav></kl-nav>');
    const toggle = el.shadowRoot!.querySelector<HTMLButtonElement>('.toggle')!;
    expect(toggle.getAttribute('aria-expanded')).toBe('false');

    toggle.click();
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector('.drawer')!.classList.contains('open')).toBe(true);
    expect(toggle.getAttribute('aria-expanded')).toBe('true');

    el.shadowRoot!.querySelector<HTMLButtonElement>('.drawer-close')!.click();
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector('.drawer')!.classList.contains('open')).toBe(false);
  });

  it('closes the drawer on Escape', async () => {
    const el = await fixture<KlNav>('<kl-nav></kl-nav>');
    el.shadowRoot!.querySelector<HTMLButtonElement>('.toggle')!.click();
    await el.updateComplete;

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector('.drawer')!.classList.contains('open')).toBe(false);
  });

  it('sets scrolled past the scroll threshold', async () => {
    const el = await fixture<KlNav>('<kl-nav scroll-threshold="10"></kl-nav>');
    expect(el.scrolled).toBe(false);

    Object.defineProperty(window, 'scrollY', { value: 50, configurable: true });
    window.dispatchEvent(new Event('scroll'));
    await el.updateComplete;
    expect(el.scrolled).toBe(true);
    expect(el.hasAttribute('scrolled')).toBe(true);

    Object.defineProperty(window, 'scrollY', { value: 0, configurable: true });
  });
});
