/**
 * Aegis-Beacon Wiki -- Firmware page.
 * Loads content from website/wiki/firmware-overview.md
 */

import { renderWikiPageLayout } from './layout.js';
import { loadWikiMarkdown } from './md-loader.js';

export async function renderFirmwarePage(lang, dict, currentPath = '/') {
  const content = await loadWikiMarkdown('firmware-overview.md');
  return renderWikiPageLayout({
    pageId: 'firmware',
    title: 'Firmware Overview',
    file: 'website/wiki/firmware-overview.md',
    content,
    lang,
    dict,
    currentPath
  });
}
