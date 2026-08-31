/**
 * Aegis-Beacon Wiki -- Assembly Guide page.
 * Loads content from website/wiki/assembly-guide.md
 */

import { renderWikiPageLayout } from './layout.js';
import { loadWikiMarkdown } from './md-loader.js';

export async function renderPage() {
  const content = await loadWikiMarkdown('assembly-guide.md');
  return renderWikiPageLayout({
    pageId: 'assembly',
    title: 'Assembly Guide',
    file: 'website/wiki/assembly-guide.md',
    content,
  });
}
