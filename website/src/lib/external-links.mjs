/**
 * rehype plugin: force every external link to open in a real browser tab.
 *
 * When a visitor opens the site inside an in-app browser (WhatsApp, Discord,
 * Telegram, Instagram, Facebook, X...), a plain <a href="https://..."> link
 * stays inside that sandboxed webview. Adding target="_blank" with
 * rel="noopener noreferrer" makes the host app hand the link to the system
 * browser instead, which is what the project wants: the wiki is full of links
 * to datasheets, shop pages, repeater directories and regulatory texts that
 * must leave the embedded webview.
 *
 * The plugin walks the HAST tree, finds <a> elements whose href is absolute
 * (http/https), and rewrites them with target="_blank" and a merged rel that
 * always contains noopener noreferrer. Internal links (/wiki/..., #anchors)
 * are left untouched.
 */

const EXTERNAL_RE = /^https?:\/\//i;

function isExternalUrl(href) {
  if (typeof href !== 'string') return false;
  return EXTERNAL_RE.test(href);
}

function walk(node) {
  if (!node || typeof node !== 'object') return;
  const children = node.children;
  if (Array.isArray(children)) {
    for (const child of children) {
      if (child && child.type === 'element' && child.tagName === 'a') {
        const props = child.properties || {};
        if (isExternalUrl(props.href)) {
          props.target = '_blank';
          const relSet = new Set(
            String(props.rel || '')
              .split(/\s+/)
              .filter(Boolean)
          );
          relSet.add('noopener');
          relSet.add('noreferrer');
          props.rel = Array.from(relSet).join(' ');
        }
      }
      walk(child);
    }
  }
}

export default function externalLinks() {
  return (tree) => walk(tree);
}