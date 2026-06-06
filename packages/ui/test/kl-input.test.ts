import { describe, it, expect, afterEach } from 'vitest';
import '../src/components/kl-input.js';
import type { KlInput } from '../src/components/kl-input.js';
import { fixture, cleanup } from './helpers.js';

describe('kl-input', () => {
  afterEach(cleanup);

  it('registers the custom element', () => {
    expect(customElements.get('kl-input')).toBeDefined();
  });

  it('renders label, placeholder, and type', async () => {
    const el = await fixture<KlInput>(
      '<kl-input label="Email" type="email" placeholder="you@klarlabs.de"></kl-input>',
    );
    const label = el.shadowRoot!.querySelector('[part="label"]')!;
    const input = el.shadowRoot!.querySelector('input')!;
    expect(label.textContent!.trim()).toBe('Email');
    expect(input.type).toBe('email');
    expect(input.getAttribute('placeholder')).toBe('you@klarlabs.de');
  });

  it('syncs value from user input', async () => {
    const el = await fixture<KlInput>('<kl-input></kl-input>');
    const input = el.shadowRoot!.querySelector('input')!;
    input.value = 'hello';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    expect(el.value).toBe('hello');
  });

  it('shows error text with role=alert and aria-invalid', async () => {
    const el = await fixture<KlInput>('<kl-input error="Required field"></kl-input>');
    const error = el.shadowRoot!.querySelector('[part="error"]')!;
    expect(error.getAttribute('role')).toBe('alert');
    expect(error.textContent).toBe('Required field');
    expect(el.shadowRoot!.querySelector('input')!.getAttribute('aria-invalid')).toBe('true');
  });

  it('shows helper text only without an error', async () => {
    const el = await fixture<KlInput>('<kl-input helper="Min 8 chars"></kl-input>');
    const helper = el.shadowRoot!.querySelector('[part="helper"]')!;
    expect(helper.textContent).toBe('Min 8 chars');
    expect(helper.hasAttribute('hidden')).toBe(false);

    el.error = 'Too short';
    await el.updateComplete;
    expect(helper.hasAttribute('hidden')).toBe(true);
    expect(el.shadowRoot!.querySelector('[part="error"]')!.hasAttribute('hidden')).toBe(false);
  });

  it('disables the native input', async () => {
    const el = await fixture<KlInput>('<kl-input disabled></kl-input>');
    expect(el.shadowRoot!.querySelector('input')!.disabled).toBe(true);
  });

  it('delegates focus() to the native input', async () => {
    const el = await fixture<KlInput>('<kl-input></kl-input>');
    el.focus();
    expect(el.shadowRoot!.activeElement).toBe(el.shadowRoot!.querySelector('input'));
  });
});
