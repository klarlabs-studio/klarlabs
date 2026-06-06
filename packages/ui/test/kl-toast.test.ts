import { describe, it, expect, afterEach, vi } from 'vitest';
import '../src/components/kl-toast.js';
import type { KlToast } from '../src/components/kl-toast.js';
import { fixture, cleanup } from './helpers.js';

describe('kl-toast', () => {
  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });

  it('registers the custom element', () => {
    expect(customElements.get('kl-toast')).toBeDefined();
  });

  it('uses role=status by default and role=alert for error/warning', async () => {
    const info = await fixture<KlToast>('<kl-toast open>Saved</kl-toast>');
    expect(info.shadowRoot!.querySelector('[part="toast"]')!.getAttribute('role')).toBe('status');

    const error = await fixture<KlToast>('<kl-toast open variant="error">Failed</kl-toast>');
    expect(error.shadowRoot!.querySelector('[part="toast"]')!.getAttribute('role')).toBe('alert');
  });

  it('dismisses on button click and emits kl-dismiss', async () => {
    const el = await fixture<KlToast>('<kl-toast open duration="0">Saved</kl-toast>');
    const handler = vi.fn();
    el.addEventListener('kl-dismiss', handler);

    el.shadowRoot!.querySelector<HTMLButtonElement>('[part="dismiss"]')!.click();
    await el.updateComplete;
    expect(el.open).toBe(false);
    expect(handler).toHaveBeenCalledOnce();
  });

  it('auto-dismisses after duration', async () => {
    vi.useFakeTimers();
    const el = await fixture<KlToast>('<kl-toast duration="1000">Saved</kl-toast>');
    el.open = true;
    await el.updateComplete;

    vi.advanceTimersByTime(1100);
    expect(el.open).toBe(false);
  });

  it('stays open with duration=0', async () => {
    vi.useFakeTimers();
    const el = await fixture<KlToast>('<kl-toast open duration="0">Sticky</kl-toast>');
    vi.advanceTimersByTime(60_000);
    expect(el.open).toBe(true);
  });

  it('hides the dismiss button when not dismissible', async () => {
    const el = await fixture<KlToast>('<kl-toast open>X</kl-toast>');
    el.dismissible = false;
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector('[part="dismiss"]')).toBeNull();
  });
});
