/**
 * Entry point for the index page (technical manual & build wiki).
 * The HTML is a static shell — every behaviour lives in these modules.
 */
import { initTheme } from './theme.js';
import { initI18n } from './i18n.js';
import { initTabs } from './tabs.js';
import { initTerminal } from './terminal.js';

initTheme();
initI18n();
initTabs();
initTerminal();
