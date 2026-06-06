import { describe, it, expect, afterEach } from 'vitest';
import '../src/components/kl-button.js';
import type { KlButton } from '../src/components/kl-button.js';
import { fixture, cleanup } from './helpers.js';

describe('kl-button', () => {
  afterEach(cleanup);

  it('registers the custom element', () => {
    expect(customElements.get('kl-button')).toBeDefined();
  });

  it('renders a native button by default', async () => {
    const el = await fixture<KlButton>('<kl-button>Click</kl-button>');
    const button = el.shadowRoot!.querySelector('button');
    expect(button).not.toBeNull();
    expect(button!.getAttribute('part')).toBe('button');
    expect(button!.type).toBe('button');
  });

  it('reflects variant and size attributes', async () => {
    const el = await fixture<KlButton>('<kl-button variant="ghost" size="lg">X</kl-button>');
    expect(el.getAttribute('variant')).toBe('ghost');
    expect(el.getAttribute('size')).toBe('lg');
  });

  it('disables the native button when disabled', async () => {
    const el = await fixture<KlButton>('<kl-button disabled>X</kl-button>');
    expect(el.shadowRoot!.querySelector('button')!.disabled).toBe(true);
  });

  it('blocks interaction and sets aria-busy when loading', async () => {
    const el = await fixture<KlButton>('<kl-button loading>X</kl-button>');
    const button = el.shadowRoot!.querySelector('button')!;
    expect(button.disabled).toBe(true);
    expect(button.getAttribute('aria-busy')).toBe('true');
    expect(el.shadowRoot!.querySelector('.spinner')).not.toBeNull();
  });

  it('renders an anchor when href is set', async () => {
    const el = await fixture<KlButton>('<kl-button href="/products">Go</kl-button>');
    const anchor = el.shadowRoot!.querySelector('a');
    expect(anchor).not.toBeNull();
    expect(anchor!.getAttribute('href')).toBe('/products');
    expect(el.shadowRoot!.querySelector('button')).toBeNull();
  });

  it('adds rel=noopener noreferrer for target=_blank links', async () => {
    const el = await fixture<KlButton>(
      '<kl-button href="https://example.com" target="_blank">Go</kl-button>',
    );
    expect(el.shadowRoot!.querySelector('a')!.getAttribute('rel')).toBe('noopener noreferrer');
  });

  it('falls back to button rendering when disabled with href', async () => {
    const el = await fixture<KlButton>('<kl-button href="/x" disabled>Go</kl-button>');
    expect(el.shadowRoot!.querySelector('a')).toBeNull();
    expect(el.shadowRoot!.querySelector('button')!.disabled).toBe(true);
  });
});
