// Single source of truth for wiki navigation: grouped, ordered page ids.
// Titles are resolved from each page's own frontmatter at render time; the
// `label` here is only a fallback short name.
export interface WikiGroup {
  label: string;
  blurb: string;
  pages: { id: string; label: string }[];
}

export const WIKI_NAV: WikiGroup[] = [
  {
    label: 'Getting Started',
    blurb: 'Start here: what the beacon is, how it works, and the fastest path to a working build.',
    pages: [
      { id: 'project-overview', label: 'Overview' },
      { id: 'quick-start-guide', label: 'Quick Start' },
      { id: 'system-architecture', label: 'System Architecture' },
      { id: 'boot-process', label: 'Boot Process' },
      { id: 'faq', label: 'FAQ' },
    ],
  },
  {
    label: 'Hardware & Assembly',
    blurb: 'Components, wiring, circuit design and the physical build.',
    pages: [
      { id: 'hardware-components', label: 'Components' },
      { id: 'circuit-description', label: 'Circuit Description' },
      { id: 'gpio-pin-mapping', label: 'GPIO Pin Map' },
      { id: 'electrical-specifications', label: 'Electrical Specs' },
      { id: 'assembly-guide', label: 'Assembly Guide' },
      { id: '3d-printing-guide', label: '3D Printing' },
    ],
  },
  {
    label: 'Radio & RF Design',
    blurb: 'Antennas, link budget, frequencies and legal operation.',
    pages: [
      { id: 'antenna-design', label: 'Antenna Design' },
      { id: 'antenna-lengths', label: 'Antenna Lengths' },
      { id: 'antenna-types', label: 'Antenna Selection' },
      { id: 'rf-design-link-budget', label: 'RF & Link Budget' },
      { id: 'frequency-compatibility', label: 'Frequency Table' },
    ],
  },
  {
    label: 'Firmware & Software',
    blurb: 'Everything that runs on the ESP32, from the Morse engine to the config portal.',
    pages: [
      { id: 'firmware-overview', label: 'Firmware Overview' },
      { id: 'software-build-process', label: 'Build Process' },
      { id: 'configuration-reference', label: 'Configuration' },
      { id: 'operating-modes', label: 'Operating Modes' },
      { id: 'morse-code-engine', label: 'Morse Engine' },
      { id: 'wifi-config-portal', label: 'WiFi Config Portal' },
      { id: 'dashboard-http-api', label: 'Dashboard HTTP API' },
      { id: 'gps-integration', label: 'GPS Integration' },
      { id: 'oled-display', label: 'OLED Display' },
      { id: 'audio-alert-system', label: 'Audio Alert System' },
      { id: 'rtc-ram-state', label: 'RTC RAM State' },
      { id: 'serial-debug-system', label: 'Serial Debug' },
      { id: 'reliability-and-safety-features', label: 'Reliability & Safety' },
    ],
  },
  {
    label: 'Power & Battery',
    blurb: 'Cell selection, charging, power management and cold-weather behavior.',
    pages: [
      { id: 'power-management', label: 'Power Management' },
      { id: 'battery-selection', label: 'Battery Selection' },
      { id: 'safety-guidelines', label: 'Safety' },
    ],
  },
  {
    label: 'Field Operations',
    blurb: 'Using the beacon for real: deployment, testing and troubleshooting.',
    pages: [
      { id: 'field-deployment', label: 'Deployment' },
      { id: 'outdoor-testing', label: 'Outdoor Testing' },
      { id: 'troubleshooting', label: 'Troubleshooting' },
      { id: 'troubleshooting-rf', label: 'RF Troubleshooting' },
    ],
  },
  {
    label: 'Reference & Project',
    blurb: 'Regulations, comparisons, contributing and the version history.',
    pages: [
      { id: 'regulatory-compliance', label: 'Regulations' },
      { id: 'comparison-with-alternatives', label: 'Alternatives' },
      { id: 'contributing', label: 'Contributing' },
      { id: 'glossary', label: 'Glossary' },
      { id: 'changelog', label: 'Changelog' },
    ],
  },
];

/** Flat ordered list of every wiki page id. */
export const WIKI_FLAT: string[] = WIKI_NAV.flatMap((g) => g.pages.map((p) => p.id));

/** Look up which group a page belongs to. */
export function groupForPage(id: string): WikiGroup | undefined {
  return WIKI_NAV.find((g) => g.pages.some((p) => p.id === id));
}

/** Resolve a page's fallback short label. */
export function labelForPage(id: string): string {
  for (const g of WIKI_NAV) {
    const p = g.pages.find((p) => p.id === id);
    if (p) return p.label;
  }
  return id;
}
