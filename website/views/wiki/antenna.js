/**
 * Aegis-Beacon Wiki -- Antenna Design page.
 * Loads content from website/wiki/antenna-design.md
 */

import { renderWikiPageLayout } from './layout.js';
import { loadWikiMarkdown } from './md-loader.js';

export async function renderAntennaPage(lang, dict, currentPath = '/') {
  const content = await loadWikiMarkdown('antenna-design.md');
  return renderWikiPageLayout({
    pageId: 'antenna',
    title: 'Antenna Design',
    file: 'website/wiki/antenna-design.md',
    content,
    lang,
    dict,
    currentPath
  });
}
