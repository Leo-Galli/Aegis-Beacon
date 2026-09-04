/**
 * rehype plugin: render Obsidian-style callouts ([!WARNING], [!TIP], ...)
 * that are used throughout the wiki markdown files.
 *
 * Astro's markdown pipeline does not understand Obsidian callout syntax,
 * so they previously rendered as a blockquote containing the literal
 * "[!WARNING]" text. This plugin inspects the HAST tree, finds blockquotes
 * whose first paragraph starts with "[!TYPE]", and rewrites each one into a
 * styled <div class="wiki-alert wiki-alert-TYPE"> wrapper.
 */

const TYPE_LABELS = {
  warning: 'Warning',
  tip: 'Tip',
  note: 'Note',
  info: 'Info',
  important: 'Important',
};

// Marker: "[!WARNING]" optionally followed by an inline title on the same line.
const MARKER_RE = /^\[!(WARNING|TIP|NOTE|INFO|IMPORTANT)\](?:[ \t]+([^\n]*))?/i;

function textOf(node) {
  if (!node) return '';
  if (node.type === 'text') return node.value;
  if (Array.isArray(node.children)) return node.children.map(textOf).join('');
  return '';
}

function el(tagName, properties, children) {
  return { type: 'element', tagName, properties: properties || {}, children: children || [] };
}

function textNode(value) {
  return { type: 'text', value };
}

function rewriteBlockquote(blockquote) {
  const children = blockquote.children || [];
  const firstPara = children.find((c) => c && c.type === 'element' && c.tagName === 'p');
  if (!firstPara) return null;

  const full = textOf(firstPara);
  const match = full.match(MARKER_RE);
  if (!match) return null;

  const kind = match[1].toLowerCase();
  const title = (match[2] || '').trim() || TYPE_LABELS[kind] || 'Note';
  const consumed = match[0].length;

  // Remove the marker from the first text node of the paragraph.
  // The marker starts at the very beginning of the paragraph, so it should
  // live inside the paragraph's first text node. Bail out safely otherwise.
  const firstChild = firstPara.children[0];
  if (!firstChild || firstChild.type !== 'text') return null;
  const v = firstChild.value;
  if (!v.startsWith('[!')) return null;

  let remainder = v.slice(consumed);
  // If the remainder begins with newline(s) (marker line + soft-wrapped body),
  // trim them so the paragraph starts cleanly.
  const stripped = remainder.replace(/^\n+/, '');
  const hasInline = remainder !== stripped; // marker had its own line

  const firstChildren = firstPara.children.slice(1);
  if (stripped) firstChildren.unshift(textNode(stripped));
  const firstHasBody = firstChildren.some((c) => textOf(c).trim() !== '');

  const rest = children.filter((c) => c !== firstPara).filter((c) => !(c.type === 'element' && c.tagName === 'p' && textOf(c).trim() === ''));

  const body = [];
  if (firstHasBody) {
    firstPara.children = firstChildren;
    body.push(firstPara);
  }
  if (hasInline || true) {
    // Nothing to do — the title paragraph carries the inline title.
  }
  for (const child of rest) body.push(child);

  const props = { className: ['wiki-alert', `wiki-alert-${kind}`] };
  const clean = [el('p', { className: ['wiki-alert-title'] }, [textNode(title)]), ...body].filter(
    (c) => !(c.type === 'text' && !c.value.trim())
  );
  return el('div', props, clean);
}

function walk(node) {
  if (!node || typeof node !== 'object') return;
  if (Array.isArray(node.children)) {
    for (let i = 0; i < node.children.length; i++) {
      const child = node.children[i];
      if (child && child.type === 'element' && child.tagName === 'blockquote') {
        const replacement = rewriteBlockquote(child);
        if (replacement) {
          node.children[i] = replacement;
          // continue walking the replacement's children for nested callouts
          walk(replacement);
          continue;
        }
      }
      walk(child);
    }
  }
}

export default function obsidianCallouts() {
  return (tree) => walk(tree);
}
