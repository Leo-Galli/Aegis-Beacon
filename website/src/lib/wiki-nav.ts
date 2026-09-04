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
      { id: 'first-use', label: 'First Use' },
      { id: 'build-configurations', label: 'Build Configurations' },
      { id: 'shopping-list', label: 'Shopping List' },
      { id: 'system-architecture', label: 'System Architecture' },
      { id: 'boot-process', label: 'Boot Process' },
      { id: 'faq', label: 'FAQ' },
      { id: 'troubleshooting', label: 'Troubleshooting' },
    ],
  },
  {
    label: 'Hardware & Components',
    blurb: 'Every module in the build: the ESP32, radio, OLED, GPS, charger and cell.',
    pages: [
      { id: 'hardware-components', label: 'Components' },
      { id: 'esp32-board-guide', label: 'ESP32 Board Guide' },
      { id: 'board-variants-and-clones', label: 'Board Variants' },
      { id: 'e22-radio-module-guide', label: 'E22 Radio Module' },
      { id: 'radio-module-variants', label: 'Radio Module Variants' },
      { id: 'oled-panel-guide', label: 'OLED Panel Guide' },
      { id: 'neo6m-gps-module-guide', label: 'NEO-6M GPS Module' },
      { id: 'gps-module-variants', label: 'GPS Module Variants' },
      { id: 'tp4056-charger-guide', label: 'TP4056 Charger' },
      { id: '18650-battery-guide', label: '18650 Battery' },
      { id: 'led-status-indicators', label: 'LED Indicators' },
    ],
  },
  {
    label: 'Build & Assembly',
    blurb: 'Wiring, soldering, enclosures and testing the physical build.',
    pages: [
      { id: 'circuit-description', label: 'Circuit Description' },
      { id: 'gpio-pin-mapping', label: 'GPIO Pin Map' },
      { id: 'electrical-specifications', label: 'Electrical Specs' },
      { id: 'assembly-guide', label: 'Assembly Guide' },
      { id: 'breadboard-prototyping', label: 'Breadboard First' },
      { id: 'soldering-basics', label: 'Soldering Basics' },
      { id: 'wiring-and-connectors', label: 'Wiring & Connectors' },
      { id: '3d-printing-guide', label: '3D Printing' },
      { id: 'enclosure-options', label: 'Enclosure Options' },
      { id: 'building-your-own-case', label: 'Custom Case' },
      { id: 'waterproofing-and-enclosure-sealing', label: 'Waterproofing' },
    ],
  },
  {
    label: 'Radio & RF Design',
    blurb: 'How the radio works, antennas, propagation and getting the link right.',
    pages: [
      { id: 'rf-basics', label: 'RF Basics' },
      { id: 'modulation-in-the-beacon', label: 'Modulation' },
      { id: 'antenna-design', label: 'Antenna Design' },
      { id: 'antenna-lengths', label: 'Antenna Lengths' },
      { id: 'antenna-types', label: 'Antenna Selection' },
      { id: 'ground-planes-and-counterpoises', label: 'Ground Planes' },
      { id: 'antenna-testing-and-tuning', label: 'Antenna Testing' },
      { id: 'rf-design-link-budget', label: 'RF & Link Budget' },
      { id: 'propagation-and-range', label: 'Propagation & Range' },
      { id: 'snow-and-signal-behavior', label: 'Snow & Signal' },
      { id: 'rf-interference-and-noise', label: 'Interference & Noise' },
      { id: 'rf-exposure-safety', label: 'RF Exposure Safety' },
      { id: 'troubleshooting-rf', label: 'RF Troubleshooting' },
    ],
  },
  {
    label: 'Frequencies & Regulation',
    blurb: 'Legal operation, frequency plans and radio etiquette.',
    pages: [
      { id: 'frequency-compatibility', label: 'Frequency Table' },
      { id: 'frequency-planning-examples', label: 'Planning Examples' },
      { id: 'multi-beacon-operations', label: 'Multi-Beacon Ops' },
      { id: 'regulatory-compliance', label: 'Regulations' },
      { id: 'radio-communication-basics', label: 'Radio Etiquette' },
      { id: 'signal-reporting-conventions', label: 'Signal Reports' },
      { id: 'comparison-with-alternatives', label: 'Alternatives' },
    ],
  },
  {
    label: 'Firmware & Modes',
    blurb: 'The code on the ESP32 and every operating mode it runs.',
    pages: [
      { id: 'firmware-overview', label: 'Firmware Overview' },
      { id: 'software-build-process', label: 'Build Process' },
      { id: 'upload-and-monitor', label: 'Upload & Monitor' },
      { id: 'operating-modes', label: 'Operating Modes' },
      { id: 'mode-beacon', label: 'BEACON Mode' },
      { id: 'mode-search', label: 'SEARCH Mode' },
      { id: 'mode-emergency', label: 'EMERGENCY Mode' },
      { id: 'mode-config', label: 'CONFIG Mode' },
      { id: 'morse-code-engine', label: 'Morse Engine' },
      { id: 'scan-engine-details', label: 'Scan Engine' },
      { id: 'reliability-and-safety-features', label: 'Reliability' },
    ],
  },
  {
    label: 'Configuration & Storage',
    blurb: 'NVS keys, the dashboard, HTTP API and persistent state.',
    pages: [
      { id: 'configuration-reference', label: 'Configuration Reference' },
      { id: 'dashboard-http-api', label: 'Dashboard HTTP API' },
      { id: 'wifi-config-portal', label: 'WiFi Config Portal' },
      { id: 'wifi-and-security', label: 'WiFi & Security' },
      { id: 'factory-reset-and-recovery', label: 'Factory Reset' },
      { id: 'rtc-ram-state', label: 'RTC RAM State' },
      { id: 'serial-debug-system', label: 'Serial Debug' },
      { id: 'boot-screens-and-errors', label: 'Boot Screens' },
      { id: 'button-system-details', label: 'Button System' },
    ],
  },
  {
    label: 'Display & Audio',
    blurb: 'The OLED interface, screens and the audio alert system.',
    pages: [
      { id: 'oled-display', label: 'OLED Display' },
      { id: 'operating-modes-oled', label: 'Mode Screens' },
      { id: 'audio-alert-system', label: 'Audio Alert System' },
      { id: 'audio-tone-details', label: 'Tone Details' },
      { id: 'morse-antenna-and-tone-relationship', label: 'Morse & Audio Sync' },
    ],
  },
  {
    label: 'Power & Battery',
    blurb: 'Current budgets, charging, runtimes and cold weather.',
    pages: [
      { id: 'power-management', label: 'Power Management' },
      { id: 'power-budget-and-runtimes', label: 'Runtimes' },
      { id: 'battery-selection', label: 'Battery Selection' },
      { id: 'battery-monitor-details', label: 'Battery Monitor' },
      { id: 'charging-and-cell-care', label: 'Charging & Cell Care' },
      { id: 'alternate-power-inputs', label: 'Alternate Power' },
      { id: 'safety-guidelines', label: 'Battery Safety' },
    ],
  },
  {
    label: 'GPS & Position',
    blurb: 'Getting a fix, payload coordinates and plotting the position.',
    pages: [
      { id: 'gps-integration', label: 'GPS Integration' },
      { id: 'gps-antenna-placement', label: 'Antenna Placement' },
      { id: 'gps-troubleshooting', label: 'GPS Troubleshooting' },
      { id: 'gps-coordinate-accuracy', label: 'Coordinate Accuracy' },
      { id: 'coordinate-plotting-and-maps', label: 'Plotting & Maps' },
    ],
  },
  {
    label: 'Receiving & Morse',
    blurb: 'Listening to the beacon: SDRs, decoders and learning to copy.',
    pages: [
      { id: 'receiver-compatibility', label: 'Receiver Compatibility' },
      { id: 'sdr-listening-guide', label: 'SDR Listening' },
      { id: 'morse-decoder-tools', label: 'Decoder Tools' },
      { id: 'reading-cw-by-ear', label: 'Reading CW by Ear' },
      { id: 'morse-practice', label: 'Morse Practice' },
      { id: 'morse-history-and-background', label: 'Morse Background' },
      { id: 'morse-abbreviations-and-prosigns', label: 'Abbreviations' },
      { id: 'dummy-load-and-bench-testing', label: 'Dummy Load Testing' },
    ],
  },
  {
    label: 'Field & Rescue Operations',
    blurb: 'Using the beacon for real: checklists, scenarios and search patterns.',
    pages: [
      { id: 'field-deployment', label: 'Deployment' },
      { id: 'outdoor-testing', label: 'Outdoor Testing' },
      { id: 'pre-trip-checklist', label: 'Pre-Trip Checklist' },
      { id: 'two-beacon-bench-test', label: 'Two-Beacon Test' },
      { id: 'search-patterns-and-procedure', label: 'Search Patterns' },
      { id: 'avalanche-rescue-operation', label: 'Avalanche Rescue' },
      { id: 'emergency-communications-plan', label: 'Comms Plan' },
      { id: 'emergency-response-scenarios', label: 'Response Scenarios' },
      { id: 'winter-operations', label: 'Winter Operations' },
      { id: 'field-maintenance-and-storage', label: 'Maintenance' },
    ],
  },
  {
    label: 'Project & Reference',
    blurb: 'Licensing, contributing, glossaries and the version history.',
    pages: [
      { id: 'contributing', label: 'Contributing' },
      { id: 'safety-and-liability', label: 'Safety & Liability' },
      { id: 'attribution-and-license', label: 'License & Attribution' },
      { id: 'glossary', label: 'Glossary' },
      { id: 'glossary-modes-and-settings', label: 'Modes & Settings Glossary' },
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
