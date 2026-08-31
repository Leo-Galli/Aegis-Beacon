/**
 * Aegis-Beacon Wiki -- Support page.
 * Loads content from website/wiki/troubleshooting.md
 */

import { renderWikiPageLayout } from './layout.js';
import { loadWikiMarkdown } from './md-loader.js';

export async function renderPage() {
  const content = await loadWikiMarkdown('troubleshooting.md');
  return renderWikiPageLayout({
    pageId: 'support',
    title: 'Support & Troubleshooting',
    file: 'website/wiki/troubleshooting.md',
    content,
  });
}
