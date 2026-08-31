/**
 * Aegis-Beacon Wiki -- OLED Display page.
 * Loads content from website/wiki/oled-display.md
 */

import { renderWikiPageLayout } from './layout.js';
import { loadWikiMarkdown } from './md-loader.js';

export async function renderPage() {
  const content = await loadWikiMarkdown('oled-display.md');
  return renderWikiPageLayout({
    pageId: 'display',
    title: 'OLED Display',
    file: 'website/wiki/oled-display.md',
    content,
  });
}
