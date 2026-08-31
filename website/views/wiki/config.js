/**
 * Aegis-Beacon Wiki -- Configuration page.
 * Loads content from website/wiki/configuration-reference.md
 */

import { renderWikiPageLayout } from './layout.js';
import { loadWikiMarkdown } from './md-loader.js';

export async function renderPage() {
  const content = await loadWikiMarkdown('configuration-reference.md');
  return renderWikiPageLayout({
    pageId: 'config',
    title: 'Configuration Reference',
    file: 'website/wiki/configuration-reference.md',
    content,
  });
}
