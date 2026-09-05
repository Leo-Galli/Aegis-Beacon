---
title: Robots and Sitemap
description: "The robots.txt and sitemap files: what they contain, why they exist, and how they are generated and verified."
---

# Robots and Sitemap

Two small files tell search engines how to crawl the site. Both are generated at build time and verified by CI, so they cannot silently go stale.

## robots.txt

The file at `/robots.txt` declares:

- Which crawlers may access the site
- Where the sitemap lives
- The disallowed paths (none for a public static site)

```
User-agent: *
Allow: /

Sitemap: https://aegis-beacon.vercel.app/sitemap-index.xml
```

## The sitemap

Astro's sitemap integration generates a sitemap of every public page at build time. For large sites it emits a sitemap index pointing to multiple sitemap files. The CI verifies that the built sitemap covers the expected page count (see [CI/CD](ci-cd)).

## Why they matter

| File | Effect |
| --- | --- |
| robots.txt | Keeps crawlers efficient and pointed at the sitemap |
| Sitemap | Tells engines which pages exist, including new wiki pages without waiting for link discovery |

## Verification

The CI script checks:

1. robots.txt exists and references the sitemap
2. The sitemap exists and parses
3. Every internal link resolves (no 404s)

A new page that fails these checks blocks the merge: that is the pipeline keeping search visibility honest.

## Related pages

- [SEO](seo) for the metadata layer
- [CI/CD](ci-cd) for the verification
- [Deployment](deployment) for the build