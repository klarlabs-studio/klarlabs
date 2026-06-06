import type { LitElement } from 'lit';

/** Mount markup, return the first element, wait for Lit render. */
export async function fixture<T extends LitElement>(markup: string): Promise<T> {
  const wrapper = document.createElement('div');
  wrapper.innerHTML = markup;
  document.body.appendChild(wrapper);
  const el = wrapper.firstElementChild as T;
  await el.updateComplete;
  return el;
}

/** Remove all fixtures between tests. */
export function cleanup(): void {
  document.body.innerHTML = '';
}
