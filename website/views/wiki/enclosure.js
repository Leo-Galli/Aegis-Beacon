/**
 * Aegis-Beacon Wiki -- Enclosure page.
 * Loads content from website/wiki/software-build-process.md
 */

import { renderWikiPageLayout } from './layout.js';
import { loadWikiMarkdown } from './md-loader.js';

export async function renderPage() {
  const content = await loadWikiMarkdown('software-build-process.md');
  return renderWikiPageLayout({
    pageId: 'enclosure',
    title: 'Software Build Process',
    file: 'website/wiki/software-build-process.md',
    content,
  });
}
