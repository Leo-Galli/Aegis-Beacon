/**
 * rehype plugin: decorate fenced code blocks with a console-style header bar.
 *
 * Fenced code in the wiki markdown becomes a bare <pre><code class="language-X">.
 * This plugin wraps each <pre> in a figure that carries a terminal-style header
 * (three traffic dots + the language label, uppercase, mono) so code samples
 * read as a deliberate part of the "field console" identity instead of a raw
 * grey rectangle. The original <pre> is preserved unchanged inside.
 *
 * The wrapper is a plain <div class="code-block"> so styling stays in CSS and
 * nothing else about the HTML tree (copy, anchors, inline code) is touched.
 */

const LANG_LABELS = {
  cpp: 'C++',
  c: 'C',
  js: 'JavaScript',
  ts: 'TypeScript',
  py: 'Python',
  bash: 'Bash',
  sh: 'Shell',
  json: 'JSON',
  yaml: 'YAML',
  yml: 'YAML',
  ini: 'INI',
  text: 'Text',
  html: 'HTML',
  css: 'CSS',
  arduino: 'Arduino',
  ino: 'Arduino',
  lora: 'LoRa',
  nmea: 'NMEA',
  morse: 'Morse',
};

function langOf(node) {
  const classes = String(node?.properties?.className || '');
  const match = classes.match(/(?:^|\s)language-([a-zA-Z0-9_-]+)/);
  return match ? match[1].toLowerCase() : '';
}

function el(tagName, properties, children) {
  return { type: 'element', tagName, properties: properties || {}, children: children || [] };
}

function textNode(value) {
  return { type: 'text', value };
}

function walk(node) {
  if (!node || typeof node !== 'object') return;
  if (Array.isArray(node.children)) {
    for (let i = 0; i < node.children.length; i++) {
      const child = node.children[i];
      if (child && child.type === 'element' && child.tagName === 'pre') {
        const codeEl = child.children.find((c) => c && c.type === 'element' && c.tagName === 'code');
        const lang = langOf(codeEl || child);
        const label = (lang && LANG_LABELS[lang]) || (lang ? lang.toUpperCase() : 'CODE');

        const bar = el('div', { className: ['code-block__bar'] }, [
          el('span', { className: ['code-block__dots'] }, [
            el('span', { className: ['code-block__dot', 'code-block__dot--red'] }),
            el('span', { className: ['code-block__dot', 'code-block__dot--yellow'] }),
            el('span', { className: ['code-block__dot', 'code-block__dot--green'] }),
          ]),
          el('span', { className: ['code-block__lang'] }, [textNode(label)]),
        ]);

        const figure = el(
          'div',
          { className: ['code-block'] },
          [bar, child]
        );
        node.children[i] = figure;
        continue;
      }
      walk(child);
    }
  }
}

export default function codeBlockHeader() {
  return (tree) => walk(tree);
}