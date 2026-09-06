---
title: Why the Dashboard Uses System Fonts
description: "The WiFi config dashboard stopped loading web fonts in v5.5: configuration happens offline, so it now uses fonts already on the device."
---

# Why the Dashboard Uses System Fonts

The WiFi captive-portal dashboard is the one screen you open when the beacon has **no internet**: the beacon is the access point. In v5.5 the dashboard stopped loading web fonts and now uses fonts installed on the device by default.

## The problem with web fonts

Until v5.4 the dashboard's CSS pulled fonts from an external font CDN, using an `@import` rule at the top of the stylesheet that referenced two webfont families (`Share Tech Mono` for body text and `Orbitron` for headings).

When you connect a phone to the beacon's AP, the phone usually has no internet (that is the whole point of the setup), so the fonts fail to load and the page falls back to whatever the browser picks, inconsistently. Worse, a phone that *does* roam to its own LTE mid-configuration gets a different look halfway through.

## The v5.5 approach

The dashboard now declares font stacks made of fonts already installed on every modern device:

```css
--font-display: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
--font-mono: ui-monospace, "Cascadia Mono", "SF Mono", Menlo, Consolas, "Liberation Mono", monospace;
```

- Headings and labels use the native UI font of the device doing the configuration.
- Data fields, coordinates and the payload preview use a native monospace face.

No network requests, no FOUT, identical look on phone, tablet and laptop.

## What changed visually

- The logotype and section headers were rebalanced (weights, letter-spacing, sizes) so they read well in Segoe UI / SF Pro / Roboto, not just Orbitron.
- The version string is now v5.5.

The same CSS is extracted at website build time for the [Config Dashboard](/config-dashboard) page, so the site and the device show the same dashboard.

## Related

- [Config Dashboard](config-dashboard)
- [WiFi Configuration Portal](wifi-config-portal)
- [Dashboard Rendering](dashboard-rendering)