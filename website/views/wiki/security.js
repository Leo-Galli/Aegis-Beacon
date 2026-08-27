/**
 * Aegis-Beacon Wiki -- Security page.
 * Loads content from website/wiki/configuration-reference.md (security section)
 */

import { renderWikiPageLayout } from './layout.js';
import { loadWikiMarkdown } from './md-loader.js';

export async function renderSecurityPage(lang, dict, currentPath = '/') {
  const content = await loadWikiMarkdown('configuration-reference.md');
  return renderWikiPageLayout({
    pageId: 'security',
    title: 'Security & Legal',
    file: 'website/wiki/configuration-reference.md',
    content,
    lang,
    dict,
    currentPath
  });
}
