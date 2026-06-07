import { describe, it, expect, afterEach, vi } from 'vitest';
import '../src/components/kl-feature-card.js';
import '../src/components/kl-oss-card.js';
import '../src/components/kl-klarlabs-badge.js';
import '../src/components/kl-theme-toggle.js';
import type { KlFeatureCard } from '../src/components/kl-feature-card.js';
import type { KlOssCard } from '../src/components/kl-oss-card.js';
import type { KlKlarlabsBadge } from '../src/components/kl-klarlabs-badge.js';
import type { KlThemeToggle } from '../src/components/kl-theme-toggle.js';
import { fixture, cleanup } from './helpers.js';

afterEach(() => {
  cleanup();
  document.documentElement.removeAttribute('data-theme');
  window.localStorage.clear();
  vi.restoreAllMocks();
});

describe('kl-feature-card', () => {
  it('registers the custom element', () => {
    expect(customElements.get('kl-feature-card')).toBeDefined();
  });

  it('renders heading and body slots with accent border', async () => {
    const el = await fixture<KlFeatureCard>(
      '<kl-feature-card heading="Typed contracts"><span slot="icon">⚙</span>Schema-validated actions.</kl-feature-card>',
    );
    expect(el.shadowRoot!.querySelector('[part="heading"]')!.textContent).toBe('Typed contracts');
    expect(el.shadowRoot!.querySelector('slot[name="icon"]')).not.toBeNull();
    expect(el.shadowRoot!.querySelector('[part="card"]')).not.toBeNull();
  });
});

describe('kl-oss-card', () => {
  it('registers the custom element', () => {
    expect(customElements.get('kl-oss-card')).toBeDefined();
  });

  it('renders mono name, description, and links', async () => {
    const el = await fixture<KlOssCard>(
      '<kl-oss-card name="mcp-go" description="Go framework for MCP servers." repo-href="https://github.com/klarlabs-studio/mcp-go" docs-href="https://pkg.go.dev/github.com/klarlabs-studio/mcp-go"></kl-oss-card>',
    );
    expect(el.shadowRoot!.querySelector('[part="name"]')!.textContent).toBe('mcp-go');
    expect(el.shadowRoot!.querySelector('[part="description"]')!.textContent).toBe(
      'Go framework for MCP servers.',
    );
    const links = el.shadowRoot!.querySelectorAll('.links a');
    expect(links.length).toBe(2);
    expect(links[0]!.getAttribute('href')).toContain('pkg.go.dev');
  });

  it('omits the docs link when docs-href is empty', async () => {
    const el = await fixture<KlOssCard>(
      '<kl-oss-card name="fortify-ts" repo-href="https://github.com/x"></kl-oss-card>',
    );
    expect(el.shadowRoot!.querySelectorAll('.links a').length).toBe(1);
  });
});

describe('kl-klarlabs-badge', () => {
  it('registers the custom element', () => {
    expect(customElements.get('kl-klarlabs-badge')).toBeDefined();
  });

  it('links back to klarlabs.de with the product label', async () => {
    const el = await fixture<KlKlarlabsBadge>('<kl-klarlabs-badge></kl-klarlabs-badge>');
    const link = el.shadowRoot!.querySelector('a')!;
    expect(link.getAttribute('href')).toBe('https://klarlabs.de');
    expect(link.textContent).toContain('A Klarlabs Product');
  });

  it('accepts a custom href', async () => {
    const el = await fixture<KlKlarlabsBadge>('<kl-klarlabs-badge href="/"></kl-klarlabs-badge>');
    expect(el.shadowRoot!.querySelector('a')!.getAttribute('href')).toBe('/');
  });
});

describe('kl-theme-toggle', () => {
  it('registers the custom element', () => {
    expect(customElements.get('kl-theme-toggle')).toBeDefined();
  });

  it('toggles data-theme on <html> and persists to localStorage', async () => {
    document.documentElement.setAttribute('data-theme', 'dark');
    const el = await fixture<KlThemeToggle>('<kl-theme-toggle></kl-theme-toggle>');
    const button = el.shadowRoot!.querySelector('button')!;

    button.click();
    await el.updateComplete;
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    expect(localStorage.getItem('kl-theme')).toBe('light');

    button.click();
    await el.updateComplete;
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    expect(localStorage.getItem('kl-theme')).toBe('dark');
  });

  it('applies a saved preference on connect', async () => {
    localStorage.setItem('kl-theme', 'light');
    document.documentElement.setAttribute('data-theme', 'dark');
    await fixture<KlThemeToggle>('<kl-theme-toggle></kl-theme-toggle>');
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  });

  it('exposes an accessible pressed state', async () => {
    document.documentElement.setAttribute('data-theme', 'dark');
    const el = await fixture<KlThemeToggle>('<kl-theme-toggle></kl-theme-toggle>');
    const button = el.shadowRoot!.querySelector('button')!;
    expect(button.getAttribute('aria-label')).toBeTruthy();
    button.click();
    await el.updateComplete;
    expect(button.getAttribute('aria-label')).toBeTruthy();
  });
});
