/**
 * Aegis-Beacon Wiki -- Markdown Loader
 *
 * Loads .md files from website/wiki/ and renders them as HTML.
 * Supports GitHub-style alerts (> [!WARNING], > [!NOTE], etc.)
 */

import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const WIKI_DIR = join(__dirname, '..', '..', 'wiki');

/**
 * Simple Markdown to HTML converter.
 * Supports: headings, bold, italic, code, links, tables, blockquotes, lists, alerts.
 */
function mdToHtml(md) {
  let html = md;

  // Escape HTML
  html = html.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  // Code blocks (``` ... ```)
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) => {
    return `<pre><code class="language-${lang || 'text'}">${code.trim()}</code></pre>`;
  });

  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

  // Headings
  html = html.replace(/^### (.+)$/gm, '<h3 id="$1">$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2 id="$1">$1</h2>');
  html = html.replace(/^# (.+)$/gm, '<h1 id="$1">$1</h1>');

  // Bold and italic
  html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');

  // GitHub-style alerts
  html = html.replace(/^&gt; \[!WARNING\]\n(.+)$/gm, '<div class="wiki-alert wiki-alert-warning"><strong>Warning:</strong> $1</div>');
  html = html.replace(/^&gt; \[!NOTE\]\n(.+)$/gm, '<div class="wiki-alert wiki-alert-note"><strong>Note:</strong> $1</div>');
  html = html.replace(/^&gt; \[!TIP\]\n(.+)$/gm, '<div class="wiki-alert wiki-alert-tip"><strong>Tip:</strong> $1</div>');
  html = html.replace(/^&gt; \[!IMPORTANT\]\n(.+)$/gm, '<div class="wiki-alert wiki-alert-important"><strong>Important:</strong> $1</div>');
  html = html.replace(/^&gt; \[!INFO\]\n(.+)$/gm, '<div class="wiki-alert wiki-alert-info"><strong>Info:</strong> $1</div>');

  // Blockquotes (after alerts)
  html = html.replace(/^&gt; (.+)$/gm, '<blockquote>$1</blockquote>');

  // Tables
  html = html.replace(/^\|(.+)\|$/gm, (match, content) => {
    const cells = content.split('|').map(c => c.trim());
    if (cells.every(c => /^[-:]+$/.test(c))) {
      return '<!-- table-separator -->';
    }
    const isHeader = false; // We'll handle this differently
    return `<tr>${cells.map(c => `<td>${c}</td>`).join('')}</tr>`;
  });

  // Wrap table rows
  html = html.replace(/((?:<tr>.*<\/tr>\n?)+)/g, (match) => {
    const rows = match.replace(/<!-- table-separator -->\n?/g, '').trim();
    if (!rows) return '';
    // First row is header
    const firstRow = rows.replace(/<tr>(.*?)<\/tr>/, '<thead><tr>$1</tr></thead>');
    const bodyRows = rows.replace(/<tr>(.*?)<\/tr>\n?/, '');
    return `<table>${firstRow}<tbody>${bodyRows}</tbody></table>`;
  });

  // Unordered lists
  html = html.replace(/^- (.+)$/gm, '<li>$1</li>');
  html = html.replace(/((?:<li>.*<\/li>\n?)+)/g, '<ul>$1</ul>');

  // Ordered lists
  html = html.replace(/^\d+\. (.+)$/gm, '<li>$1</li>');

  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

  // Horizontal rules
  html = html.replace(/^---$/gm, '<hr>');

  // Paragraphs (wrap remaining text)
  html = html.replace(/^(?!<[hultpbo])((?!<).+)$/gm, '<p>$1</p>');

  // Clean up empty paragraphs
  html = html.replace(/<p>\s*<\/p>/g, '');

  // Clean up consecutive blockquotes
  html = html.replace(/<\/blockquote>\n<blockquote>/g, '<br>');

  return html;
}

/**
 * Load a wiki .md file and return rendered HTML.
 */
export async function loadWikiMarkdown(filename) {
  try {
    const filePath = join(WIKI_DIR, filename);
    const md = await readFile(filePath, 'utf-8');
    return mdToHtml(md);
  } catch (err) {
    console.error(`[WIKI] Failed to load ${filename}:`, err.message);
    return `<p class="text-red-500">Error loading page content.</p>`;
  }
}

/**
 * Get list of available wiki .md files.
 */
export async function getWikiPages() {
  const { readdir } = await import('node:fs/promises');
  const files = await readdir(WIKI_DIR);
  return files.filter(f => f.endsWith('.md')).map(f => f.replace('.md', ''));
}
