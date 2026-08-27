/**
 * Aegis-Beacon Wiki -- Power Management page.
 * Loads content from website/wiki/power-management.md
 */

import { renderWikiPageLayout } from './layout.js';
import { loadWikiMarkdown } from './md-loader.js';

export async function renderPowerPage(lang, dict, currentPath = '/') {
  const content = await loadWikiMarkdown('power-management.md');
  return renderWikiPageLayout({
    pageId: 'power',
    title: 'Power Management',
    file: 'website/wiki/power-management.md',
    content,
    lang,
    dict,
    currentPath
  });
}
