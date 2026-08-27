/**
 * Aegis-Beacon Wiki -- Morse Engine page.
 * Loads content from website/wiki/morse-code-engine.md
 */

import { renderWikiPageLayout } from './layout.js';
import { loadWikiMarkdown } from './md-loader.js';

export async function renderMorsePage(lang, dict, currentPath = '/') {
  const content = await loadWikiMarkdown('morse-code-engine.md');
  return renderWikiPageLayout({
    pageId: 'morse',
    title: 'Morse Code Engine',
    file: 'website/wiki/morse-code-engine.md',
    content,
    lang,
    dict,
    currentPath
  });
}
