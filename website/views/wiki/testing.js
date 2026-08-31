/**
 * Aegis-Beacon Wiki -- Testing page.
 * Loads content from website/wiki/troubleshooting.md
 */

import { renderWikiPageLayout } from './layout.js';
import { loadWikiMarkdown } from './md-loader.js';

export async function renderPage() {
  const content = await loadWikiMarkdown('troubleshooting.md');
  return renderWikiPageLayout({
    pageId: 'testing',
    title: 'Troubleshooting',
    file: 'website/wiki/troubleshooting.md',
    content,
  });
}
