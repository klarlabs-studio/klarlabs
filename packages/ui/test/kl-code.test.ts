import { describe, it, expect, afterEach } from 'vitest';
import '../src/components/kl-code.js';
import type { KlCode } from '../src/components/kl-code.js';
import { fixture, cleanup } from './helpers.js';

describe('kl-code', () => {
  afterEach(cleanup);

  it('registers the custom element', () => {
    expect(customElements.get('kl-code')).toBeDefined();
  });

  it('renders inline code when inline is set', async () => {
    const el = await fixture<KlCode>('<kl-code inline>npm i</kl-code>');
    expect(el.shadowRoot!.querySelector('code.inline')).not.toBeNull();
    expect(el.shadowRoot!.querySelector('pre')).toBeNull();
  });

  it('renders a block with pre by default', async () => {
    const el = await fixture<KlCode>('<kl-code>const x = 1;</kl-code>');
    expect(el.shadowRoot!.querySelector('pre')).not.toBeNull();
  });

  it('shows language label in the toolbar', async () => {
    const el = await fixture<KlCode>('<kl-code language="go">func main() {}</kl-code>');
    expect(el.shadowRoot!.querySelector('.toolbar .kl-label')!.textContent).toBe('go');
  });

  it('shows a copy button when copyable', async () => {
    const el = await fixture<KlCode>('<kl-code copyable>x</kl-code>');
    const button = el.shadowRoot!.querySelector('[part="copy-button"]');
    expect(button).not.toBeNull();
    expect(button!.getAttribute('aria-label')).toBe('Copy code');
  });

  it('hides toolbar without language or copyable', async () => {
    const el = await fixture<KlCode>('<kl-code>x</kl-code>');
    expect(el.shadowRoot!.querySelector('.toolbar')).toBeNull();
  });

  it('renders line numbers matching the line count', async () => {
    const el = await fixture<KlCode>(`<kl-code line-numbers>line1
line2
line3</kl-code>`);
    const lines = el.shadowRoot!.querySelector('.lines')!;
    expect(lines.textContent).toContain('1');
    expect(lines.textContent).toContain('3');
    expect(lines.getAttribute('aria-hidden')).toBe('true');
  });
});
