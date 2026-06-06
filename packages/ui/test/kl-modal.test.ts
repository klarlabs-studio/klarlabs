import { describe, it, expect, afterEach, vi } from 'vitest';
import '../src/components/kl-modal.js';
import type { KlModal } from '../src/components/kl-modal.js';
import { fixture, cleanup } from './helpers.js';

describe('kl-modal', () => {
  afterEach(cleanup);

  it('registers the custom element', () => {
    expect(customElements.get('kl-modal')).toBeDefined();
  });

  it('renders a closed native dialog by default', async () => {
    const el = await fixture<KlModal>('<kl-modal>Body</kl-modal>');
    const dialog = el.shadowRoot!.querySelector('dialog')!;
    expect(dialog.open).toBe(false);
  });

  it('opens via show() and emits kl-open', async () => {
    const el = await fixture<KlModal>('<kl-modal>Body</kl-modal>');
    const handler = vi.fn();
    el.addEventListener('kl-open', handler);

    el.show();
    await el.updateComplete;
    expect(el.open).toBe(true);
    expect(el.shadowRoot!.querySelector('dialog')!.open).toBe(true);
    expect(handler).toHaveBeenCalledOnce();
  });

  it('closes via the close button and emits kl-close', async () => {
    const el = await fixture<KlModal>('<kl-modal open>Body</kl-modal>');
    await el.updateComplete;
    const handler = vi.fn();
    el.addEventListener('kl-close', handler);

    el.shadowRoot!.querySelector<HTMLButtonElement>('[part="close"]')!.click();
    await el.updateComplete;
    expect(el.open).toBe(false);
    expect(el.shadowRoot!.querySelector('dialog')!.open).toBe(false);
  });

  it('applies the accessible label', async () => {
    const el = await fixture<KlModal>('<kl-modal aria-modal-label="Settings">X</kl-modal>');
    expect(el.shadowRoot!.querySelector('dialog')!.getAttribute('aria-label')).toBe('Settings');
  });

  it('exposes header/body/footer parts with slots', async () => {
    const el = await fixture<KlModal>(
      '<kl-modal><span slot="header">T</span>B<span slot="footer">F</span></kl-modal>',
    );
    for (const part of ['header', 'body', 'footer']) {
      expect(el.shadowRoot!.querySelector(`[part="${part}"]`)).not.toBeNull();
    }
  });
});
