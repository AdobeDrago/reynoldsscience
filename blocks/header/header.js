import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

export default async function decorate(block) {
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);
  block.textContent = '';
  const [brand, links, inquiry] = [...fragment.querySelector('.default-content-wrapper').children];

  const top = document.createElement('div');
  top.className = 'header-top';
  const topInner = document.createElement('div');
  const label = document.createElement('span');
  label.textContent = inquiry.firstChild.textContent.trim();
  topInner.append(label, inquiry.querySelector('a'));
  top.append(topInner);

  const bar = document.createElement('div');
  bar.className = 'header-bar';
  const nav = document.createElement('nav');
  nav.setAttribute('aria-label', 'primary navigation');
  // the pipeline wraps list-item content in <p>: unwrap so links sit directly in <li>
  links.querySelectorAll('li > p').forEach((p) => p.replaceWith(...p.childNodes));
  nav.append(links);
  nav.querySelectorAll(':scope > ul > li').forEach((li) => {
    const sub = li.querySelector('ul');
    if (!sub) return;
    li.classList.add('has-sub');
    const btn = document.createElement('button');
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-label', 'Toggle submenu');
    btn.addEventListener('click', () => {
      const open = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!open));
    });
    li.querySelector('a').after(btn);
  });
  const brandLink = brand.querySelector('a');
  if (brandLink) {
    const sr = document.createElement('span');
    sr.className = 'sr-only';
    sr.textContent = 'Reynolds Science';
    brandLink.prepend(sr);
  }
  const inner = document.createElement('div');
  inner.append(brand, nav);
  bar.append(inner);

  const toggle = document.createElement('button');
  toggle.className = 'header-toggle';
  toggle.setAttribute('aria-label', 'Toggle menu');
  toggle.addEventListener('click', () => block.classList.toggle('open'));
  inner.append(toggle);

  block.append(top, bar);
}
