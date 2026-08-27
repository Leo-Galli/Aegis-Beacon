/**
 * Aegis-Beacon Wiki -- Hardware page.
 * Loads content from website/wiki/hardware-components.md
 */

import { renderWikiPageLayout } from './layout.js';
import { loadWikiMarkdown } from './md-loader.js';

export async function renderHardwarePage(lang, dict, currentPath = '/') {
  const content = await loadWikiMarkdown('hardware-components.md');
  return renderWikiPageLayout({
    pageId: 'hardware',
    title: 'Hardware Components',
    file: 'website/wiki/hardware-components.md',
    content,
    lang,
    dict,
    currentPath
  });
}
