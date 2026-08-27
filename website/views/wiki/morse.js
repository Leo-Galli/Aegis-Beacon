/**
 * Aegis-Beacon Wiki -- Morse Code Engine page.
 */
import { renderWikiPageLayout } from './layout.js';

function renderContent() {
  return `
    <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">The Morse engine generates CW timing using software delays with PARIS-standard calibration.</p>
    <h2 class="text-lg font-bold text-slate-900 dark:text-white pt-4">Timing Parameters</h2>
    <div class="overflow-x-auto">
      <div class="bg-white dark:bg-[#0f1626] border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden min-w-[300px]">
        <table class="w-full text-left"><thead><tr class="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800"><th class="py-2 px-4 text-[10px] font-mono font-bold text-slate-500 uppercase">Element</th><th class="py-2 px-4 text-[10px] font-mono font-bold text-slate-500 uppercase">Duration</th></tr></thead><tbody class="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
        <tr class="border-b border-slate-100 dark:border-slate-800"><td class="py-2 px-4 font-bold text-slate-900 dark:text-white">Dot</td><td class="py-2 px-4 font-mono text-orange-600 dark:text-orange-400">1200 / WPM ms</td></tr>
        <tr class="border-b border-slate-100 dark:border-slate-800"><td class="py-2 px-4 font-bold text-slate-900 dark:text-white">Dash</td><td class="py-2 px-4 font-mono text-orange-600 dark:text-orange-400">3 x dot ms</td></tr>
        <tr class="border-b border-slate-100 dark:border-slate-800"><td class="py-2 px-4 font-bold text-slate-900 dark:text-white">Intra-character</td><td class="py-2 px-4 font-mono text-orange-600 dark:text-orange-400">1 x dot ms</td></tr>
        <tr class="border-b border-slate-100 dark:border-slate-800"><td class="py-2 px-4 font-bold text-slate-900 dark:text-white">Inter-character</td><td class="py-2 px-4 font-mono text-orange-600 dark:text-orange-400">3 x dot ms</td></tr>
        <tr><td class="py-2 px-4 font-bold text-slate-900 dark:text-white">Word gap</td><td class="py-2 px-4 font-mono text-orange-600 dark:text-orange-400">7 x dot ms</td></tr>
        </tbody></table>
      </div>
    </div>
    <h2 class="text-lg font-bold text-slate-900 dark:text-white pt-4">Audio Generation</h2>
    <p class="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">600 Hz CW tone via DAC1 (GPIO 25). DAC output toggles between 0V (silence) and ~2.5V (tone). Volume: DEFAULT_AUDIO_VOL (0-255, default 180).</p>
    <h2 class="text-lg font-bold text-slate-900 dark:text-white pt-4">Payload Format</h2>
    <div class="p-3 bg-slate-950 rounded-lg font-mono text-[11px] text-sky-200 break-all">
      <span class="text-orange-400">SOS</span> <span class="text-slate-500">DE</span> <span class="text-emerald-400">FIRST LAST</span> <span class="text-slate-500">PSN</span> <span class="text-cyan-400">N4553 E01230</span>
    </div>
    <h2 class="text-lg font-bold text-slate-900 dark:text-white pt-4">Character Set</h2>
    <p class="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">Full ITU Morse: A-Z, 0-9, punctuation. SOS is hardcoded as emergency prefix.</p>
  `;
}

export function renderMorsePage(lang, dict, currentPath = '/') {
  return renderWikiPageLayout({ pageId: 'morse', title: 'Morse Code Engine', file: 'wiki/morse.md', content: renderContent(), lang, dict, currentPath });
}
