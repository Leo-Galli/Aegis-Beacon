/**
 * Dictionary-driven i18n.
 *
 * The Node.js renderer injects the active language dictionary into
 * `window.AEGIS_I18N` (replacing the `<!-- AEGIS-I18N -->` placeholder).
 * This module applies it to every `[data-key]` element and wires the footer
 * language selector (EN / FR / IT / ES) with client-side persistence
 * (localStorage + cookie) so the preference survives navigation.
 *
 * Protected technical terms and the product name "Aegis-Beacon" carry
 * `notranslate` / `translate="no"` markers and are never touched.
 */

const LANGS = ['en', 'it', 'fr', 'es'];
let dict = window.AEGIS_I18N || {};

function currentLang() {
  const m = window.location.search.match(/[?&]lang=([a-z]{2})/i);
  if (m && LANGS.indexOf(m[1].toLowerCase()) !== -1) return m[1].toLowerCase();
  try {
    const stored = localStorage.getItem('aegis-lang');
    if (stored && LANGS.indexOf(stored) !== -1) return stored;
  } catch (_) { /* storage unavailable */ }
  const serverLang = document.documentElement.lang || 'en';
  if (LANGS.indexOf(serverLang) !== -1) return serverLang;
  const nav = (navigator.language || 'en').slice(0, 2).toLowerCase();
  return LANGS.indexOf(nav) !== -1 ? nav : 'en';
}

function applyTo(el, key) {
  const val = dict[key];
  if (!val) return;
  // Values carrying protected markup (notranslate spans) are trusted HTML.
  if (/<[a-z][^>]*>/i.test(val)) { el.innerHTML = val; return; }
  // Plain values: replace text nodes only, preserving child spans (e.g. pulse dot).
  const texts = [];
  for (let i = 0; i < el.childNodes.length; i++) {
    if (el.childNodes[i].nodeType === 3) texts.push(el.childNodes[i]);
  }
  if (texts.length === 0) { el.appendChild(document.createTextNode(val)); return; }
  texts[0].nodeValue = val;
  for (let j = 1; j < texts.length; j++) texts[j].nodeValue = '';
}

function applyTranslations() {
  const els = document.querySelectorAll('[data-key]');
  for (let i = 0; i < els.length; i++) {
    applyTo(els[i], els[i].getAttribute('data-key'));
  }
  document.documentElement.lang = currentLang();
  const links = document.querySelectorAll('.language-link');
  for (let k = 0; k < links.length; k++) {
    const l = (links[k].getAttribute('href') || '').match(/lang=([a-z]{2})/i);
    const active = !!(l && l[1].toLowerCase() === currentLang());
    links[k].classList.toggle('language-link-active', active);
  }
}

function switchLang(lang) {
  try { localStorage.setItem('aegis-lang', lang); } catch (_) { /* storage unavailable */ }
  document.cookie = 'aegis-lang=' + lang + ';path=/;max-age=31536000';
  fetch('/i18n/' + lang + '.json')
    .then((r) => r.json())
    .then((d) => {
      dict = d;
      const url = new URL(window.location.href);
      url.searchParams.set('lang', lang);
      window.history.replaceState(null, '', url.toString());
      applyTranslations();
      document.documentElement.lang = lang;
    })
    .catch(() => { window.location.href = '?lang=' + lang; });
}

export function initI18n() {
  const links = document.querySelectorAll('.language-link');
  for (let i = 0; i < links.length; i++) {
    links[i].addEventListener('click', (e) => {
      const l = (links[i].getAttribute('href') || '').match(/lang=([a-z]{2})/i);
      if (l) { e.preventDefault(); switchLang(l[1].toLowerCase()); }
    });
  }
  applyTranslations();
}
