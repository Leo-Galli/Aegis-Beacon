/**
 * Aegis-Beacon Wiki -- GPS Integration page.
 * Loads content from website/wiki/gps-integration.md
 */

import { renderWikiPageLayout } from './layout.js';
import { loadWikiMarkdown } from './md-loader.js';

export async function renderPage() {
  const content = await loadWikiMarkdown('gps-integration.md');
  return renderWikiPageLayout({
    pageId: 'gps',
    title: 'GPS Integration',
    file: 'website/wiki/gps-integration.md',
    content,
  });
}
