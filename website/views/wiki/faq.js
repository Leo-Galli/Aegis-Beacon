/**
 * Aegis-Beacon Wiki -- FAQ page.
 */
import { renderWikiPageLayout } from './layout.js';

function renderContent() {
  const faqs = [
    {
      q: 'What is the maximum range of the Aegis-Beacon?',
      a: 'In line-of-sight conditions, 15-25 km is achievable. Urban/forest range is typically 2-5 km. Underground/indoor penetration reaches 500m-1km depending on construction materials.'
    },
    {
      q: 'How long does the battery last?',
      a: 'In BEACON mode with 30-second TX intervals, a single 18650 cell (3000 mAh) provides approximately 65 hours of operation. Continuous EMERGENCY mode lasts 6-8 hours.'
    },
    {
      q: 'Do I need a license to operate?',
      a: 'At low power (+17 dBm / 50 mW) on ISM bands (433 MHz), operation is generally license-free in most countries. Higher power or non-ISM frequencies may require a license. Check local regulations.'
    },
    {
      q: 'Can I use this for regular communication?',
      a: 'Aegis-Beacon is designed for emergency beaconing, not two-way communication. It transmits Morse code only. For receiving, use a PMR446 radio, AM scanner, or SDR.'
    },
    {
      q: 'Is GPS required?',
      a: 'No. GPS is optional. Without GPS, the beacon transmits SOS + callsign only. With GPS, coordinates are embedded in the Morse payload for precise location.'
    },
    {
      q: 'What soldering skills are needed?',
      a: 'Basic SMD soldering (0805/0603 components) is required. A temperature-controlled iron with fine tip, solder paste, and optionally a hot-air rework station are recommended.'
    },
    {
      q: 'Can I change the frequency after building?',
      a: 'Yes. Connect to the WiFi portal (AEGIS-BEACON AP, 192.168.4.1) and configure any frequency between 410-525 MHz. Changes are saved to NVS and persist across power cycles.'
    },
    {
      q: 'What happens if the firmware crashes?',
      a: 'A 30-second hardware watchdog timer (TWDT) automatically resets the ESP32. The device resumes BEACON mode after reset. Configuration is preserved in NVS.'
    },
    {
      q: 'Can I use a different antenna?',
      a: 'Yes, any 50-ohm SMA antenna tuned to your operating frequency. Never transmit without an antenna or dummy load -- this will damage the power amplifier.'
    },
    {
      q: 'How do I update the firmware?',
      a: 'Connect via USB-TTL (CP2102/FTDI), pull GPIO0 to ground at startup for flash mode, then use PlatformIO: pio run --target upload.'
    },
    {
      q: 'What is the audio output for?',
      a: 'The 600 Hz Morse tone output on GPIO 25 allows direct headphone/speaker monitoring. Useful for field testing and signal verification without a separate receiver.'
    },
    {
      q: 'Is the enclosure weatherproof?',
      a: 'The Hammond 1593L provides IP54 splash resistance. For full waterproofing, apply silicone sealant around all cutouts and use rubber grommets on switch holes.'
    }
  ];

  const items = faqs.map((f, i) => `
    <details class="group border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
      <summary class="flex items-center justify-between p-4 cursor-pointer bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors">
        <span class="text-sm font-bold text-slate-900 dark:text-white pr-4">${f.q}</span>
        <svg class="w-4 h-4 text-slate-400 shrink-0 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
      </summary>
      <div class="p-4 pt-0 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">${f.a}</div>
    </details>`).join('');

  return `
    <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
      Frequently asked questions about the Aegis-Beacon emergency radio system.
    </p>

    <h2 class="text-lg font-bold text-slate-900 dark:text-white pt-4">Questions</h2>
    <div class="space-y-3">
      ${items}
    </div>

    <h2 class="text-lg font-bold text-slate-900 dark:text-white pt-6">Still Have Questions?</h2>
    <div class="p-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-lg">
      <p class="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
        Open an issue on <a href="https://github.com/Leo-Galli/Aegis-Beacon/issues" target="_blank" rel="noopener" class="text-orange-600 dark:text-orange-400 hover:underline">GitHub Issues</a> or check the
        <a href="/wiki/support" class="text-orange-600 dark:text-orange-400 hover:underline">Troubleshooting</a> page for detailed solutions.
      </p>
    </div>
  `;
}

export function renderFaqPage(lang, dict, currentPath = '/') {
  return renderWikiPageLayout({
    pageId: 'faq',
    title: 'FAQ',
    file: 'README.md',
    content: renderContent(),
    lang, dict, currentPath
  });
}
