/**
 * Aegis-Beacon Wiki -- GPIO Pin Map page.
 * Loads content from website/wiki/gpio-pin-mapping.md
 */

import { renderWikiPageLayout } from './layout.js';
import { loadWikiMarkdown } from './md-loader.js';

export async function renderPinmapPage(lang, dict, currentPath = '/') {
  const content = await loadWikiMarkdown('gpio-pin-mapping.md');
  return renderWikiPageLayout({
    pageId: 'pinmap',
    title: 'GPIO Pin Mapping',
    file: 'website/wiki/gpio-pin-mapping.md',
    content,
    lang,
    dict,
    currentPath
  });
}
