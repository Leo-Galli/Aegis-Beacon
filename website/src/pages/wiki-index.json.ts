/**
 * wiki-index.json
 *
 * Prerendered static index of every wiki page, generated at build time so the
 * in-browser chat widget can search the documentation without any backend.
 * The client fetches this file once, runs a lightweight keyword retrieval
 * against the visitor's question, and feeds the best-matching excerpts to the
 * local LLM as reference notes.
 *
 * Each entry keeps the payload small: id, title, group, description and the
 * opening ~900 characters of the page body as plain text.
 */
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { WIKI_NAV } from '../lib/wiki-nav';

export const prerender = true;

const SNIPPET_LEN = 900;

/** Convert markdown to readable plain text (links, images, code and markup removed). */
function toPlainText(md: string): string {
  return md
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/<[^>]+>/g, ' ')
    .replace(/^\s{0,3}#{1,6}\s+/gm, '')
    .replace(/^\s*>\s*!?\[[^\]]*\]\s*/gim, '')
    .replace(/^\s*>\s?/gm, '')
    .replace(/^\s*\|?[\s\-|+]+\|?\s*$/gm, '')
    .replace(/[*_`~]/g, '')
    .replace(/^\s*[-*+]\s+/gm, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Cut a string at a word boundary, never mid-word. */
function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const space = cut.lastIndexOf(' ');
  return (space > max * 0.6 ? cut.slice(0, space) : cut).trim() + ' ...';
}

export const GET: APIRoute = async () => {
  const entries = await getCollection('wiki');

  const groupOf = new Map<string, string>();
  for (const group of WIKI_NAV) {
    for (const page of group.pages) {
      if (!groupOf.has(page.id)) groupOf.set(page.id, group.label);
    }
  }

  const items = entries.map((entry) => {
    const data = entry.data as { title: string; description?: string };
    const title = (data.title || entry.id).trim();
    const description = (data.description || '').trim();
    const snippet = truncate(toPlainText(entry.body ?? ''), SNIPPET_LEN);
    return {
      id: entry.id,
      title,
      group: groupOf.get(entry.id) ?? '',
      description,
      snippet,
    };
  });

  return new Response(JSON.stringify(items), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
};
