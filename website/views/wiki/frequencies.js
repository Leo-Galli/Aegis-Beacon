/**
 * Aegis-Beacon Wiki -- Frequency Table page.
 * Loads content from website/wiki/frequency-compatibility.md
 */

import { renderWikiPageLayout } from './layout.js';
import { loadWikiMarkdown } from './md-loader.js';

export async function renderPage() {
  const content = await loadWikiMarkdown('frequency-compatibility.md');
  return renderWikiPageLayout({
    pageId: 'frequencies',
    title: 'Frequency Compatibility',
    file: 'website/wiki/frequency-compatibility.md',
    content,
  });
}
