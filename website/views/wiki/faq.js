/**
 * Aegis-Beacon Wiki -- FAQ page.
 * Loads content from website/wiki/faq.md
 */

import { renderWikiPageLayout } from './layout.js';
import { loadWikiMarkdown } from './md-loader.js';

export async function renderFaqPage(lang, dict, currentPath = '/') {
  const content = await loadWikiMarkdown('faq.md');
  return renderWikiPageLayout({
    pageId: 'faq',
    title: 'FAQ',
    file: 'website/wiki/faq.md',
    content,
    lang,
    dict,
    currentPath
  });
}
