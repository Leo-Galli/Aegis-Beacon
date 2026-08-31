/**
 * Aegis-Beacon Wiki -- Glossary page.
 * Loads content from website/wiki/glossary.md
 */

import { renderWikiPageLayout } from './layout.js';
import { loadWikiMarkdown } from './md-loader.js';

export async function renderPage() {
  const content = await loadWikiMarkdown('glossary.md');
  return renderWikiPageLayout({
    pageId: 'glossary',
    title: 'Glossary',
    file: 'website/wiki/glossary.md',
    content,
  });
}
