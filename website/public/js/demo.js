/**
 * Live firmware demo — AegisBeacon.ino simulated in the browser.
 *
 * ES module extracted from the old inline <script> of demo.html:
 * virtual SSD1309 OLED, LEDs, 4-button keypad with long presses,
 * BEACON/SEARCH/CONFIG/EMERGENCY modes, Morse encoder (PARIS timing),
 * frequency planner, GPS DDM payload builder, RSSI scan with WebAudio
 * tone, piecewise battery curve and color-coded serial console.
 */
import { initTheme } from './theme.js';

// ── State ────────────────────────────────────────────────────────────
const SIM = {
  mode: 'beacon',            // beacon | search | config | emergency
  freqIdx: 0,
  adjust: 'VOL',             // VOL | WPM
  vol: 180,
  wpm: 13,
  power: 17,
  rssi: -87,
  battery: 87,
  cycle: 1,
  freqs: [433.500, 434.500, 435.000, 446.08125, 446.09375],
  hitCount: 0,
  payload: 'SOS DE MARIO ROSSI PSN N4553 E1230'
};

const MORSE = {
  'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.', 'G': '--.', 'H': '....', 'I': '..', 'J': '.---',
  'K': '-.-', 'L': '.-..', 'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.', 'S': '...', 'T': '-',
  'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-', 'Y': '-.--', 'Z': '--..', '0': '-----', '1': '.----', '2': '..---',
  '3': '...--', '4': '....-', '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.'
};

// ── DOM refs ─────────────────────────────────────────────────────────
const $ = id => document.getElementById(id);

// ── OLED render ──────────────────────────────────────────────────────
function renderOled() {
  const header = $('oled-header');
  const body = $('oled-body');
  header.className = 'flex justify-between items-center px-2 py-1 rounded text-[9px] sm:text-[10px] font-bold tracking-wider oled-invert';
  $('oled-mode-label').textContent =
    SIM.mode === 'beacon' ? 'TX BEACON' :
    SIM.mode === 'search' ? 'RX SEARCH' :
    SIM.mode === 'config' ? 'CONFIG MODE' : 'EMERGENCY TX';
  $('oled-cycle').textContent = SIM.mode === 'beacon' ? `cycle #${SIM.cycle}` : SIM.mode === 'search' ? `hits ${SIM.hitCount}` : '';
  $('oled-cycle').style.display = (SIM.mode === 'beacon' || SIM.mode === 'search') ? '' : 'none';
  $('oled-battery').textContent = batteryIcon();

  let html = '';
  const f = SIM.freqs[SIM.freqIdx] || SIM.freqs[0];
  if (SIM.mode === 'beacon') {
    html += `<div class="text-2xl sm:text-3xl font-bold text-white tracking-wider">${f.toFixed(3)} MHz</div>`;
    html += `<div class="text-sky-400">${SIM.payload}</div>`;
    html += `<div class="flex items-center gap-2"><div class="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden"><div class="h-full bg-emerald-400" style="width:${progressPct()}%"></div></div><span class="text-[9px] text-slate-400">TX</span></div>`;
    html += `<div class="text-[10px] text-slate-400">CH ${SIM.freqIdx + 1}/${SIM.freqs.length} · PWR ${SIM.power >= 0 ? '+' : ''}${SIM.power} dBm · ${SIM.wpm} WPM</div>`;
  } else if (SIM.mode === 'search') {
    html += `<div class="text-2xl sm:text-3xl font-bold text-white tracking-wider">${f.toFixed(3)} MHz</div>`;
    html += `<div class="flex items-center gap-2"><div class="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden"><div class="h-full bg-orange-400" style="width:${rssiPct()}%"></div></div><span class="text-[9px] text-slate-400">${SIM.rssi} dBm</span></div>`;
    html += `<div class="text-[10px]"><span class="text-emerald-400 font-bold">${signalClass()}</span> <span class="text-slate-400">· scan pass ${SIM.cycle}</span></div>`;
  } else if (SIM.mode === 'config') {
    html += `<div class="text-white font-bold">SSID: AegisBeacon</div>`;
    html += `<div class="text-sky-400">http://192.168.4.1</div>`;
    html += `<div class="text-[10px] text-slate-400 leading-relaxed">1. Connect to WiFi network<br>2. Open captive portal<br>3. Save & reboot</div>`;
  } else {
    html += `<div class="text-3xl sm:text-4xl font-black text-white oled-blink tracking-widest text-center">SOS</div>`;
    html += `<div class="text-center text-[10px] text-white font-bold">EMERGENCY BEACON TX</div>`;
    html += `<div class="text-center text-[10px] text-slate-300">${f.toFixed(3)} MHz · +22 dBm · 1760 Hz</div>`;
    html += `<div class="text-center text-[10px] text-emerald-300">N4553 E1230</div>`;
  }
  body.innerHTML = html;
}

function batteryIcon() {
  const p = SIM.battery;
  if (SIM.mode === 'emergency') return '[SOS]';
  const seg = p > 75 ? 4 : p > 50 ? 3 : p > 25 ? 2 : p > 10 ? 1 : 0;
  const bar = p <= 10 ? '!' : '█'.repeat(seg) + ' '.repeat(Math.max(0, 4 - seg));
  return `[${bar}] ${p}%`;
}
function progressPct() { return 40 + (SIM.cycle * 7) % 55; }
function rssiPct() { return Math.max(5, Math.min(100, (SIM.rssi + 120) / 80 * 100)); }
function signalClass() { return SIM.rssi >= -60 ? 'STRONG' : SIM.rssi >= -80 ? 'MEDIUM' : SIM.rssi >= -90 ? 'WEAK' : 'QUIET'; }

// ── Status panel ─────────────────────────────────────────────────────
function renderStatus() {
  $('st-mode').textContent = SIM.mode.toUpperCase();
  $('st-freq').textContent = `${(SIM.freqs[SIM.freqIdx] || SIM.freqs[0]).toFixed(3)} MHz`;
  $('st-adj').textContent = SIM.adjust;
  $('st-vol').textContent = `${SIM.vol} / 255`;
  $('st-wpm').textContent = SIM.wpm;
  $('st-rssi').textContent = `${SIM.rssi} dBm`;
  $('st-bat').textContent = `${SIM.battery}% · ${Math.round(3.0 + SIM.battery / 100 * 1.2).toFixed(3)} V`;
  $('st-pwr').textContent = `${SIM.power >= 0 ? '+' : ''}${SIM.power} dBm`;

  const bat = SIM.battery;
  $('bat-fill').style.height = bat + '%';
  $('bat-fill').style.background = bat <= 10 ? '#f43f5e' : bat <= 25 ? '#f59e0b' : '#10b981';
  $('bat-label').textContent = `${bat}% · ${Math.round(3.0 + bat / 100 * 1.2).toFixed(3)} V`;
  $('bat-slider-val').textContent = bat + '%';

  // LEDs
  const red = $('led-red'), blue = $('led-blue');
  red.className = 'w-2.5 h-2.5 rounded-full ' + (SIM.mode === 'beacon' || SIM.mode === 'emergency' ? 'bg-red-500 animate-pulse' : 'bg-slate-800 dark:bg-slate-700');
  blue.className = 'w-2.5 h-2.5 rounded-full ' + (SIM.mode === 'search' ? 'bg-blue-500 animate-pulse' : 'bg-slate-800 dark:bg-slate-700');
}

// ── Serial console ───────────────────────────────────────────────────
function serial(line) {
  const el = $('serial');
  el.innerHTML += line + '\n';
  el.scrollTop = el.scrollHeight;
}
const LOG_COLORS = { cyan: '#22d3ee', green: '#4ade80', magenta: '#e879f9', blue: '#60a5fa', white: '#e2e8f0', orange: '#fb923c', red: '#f87171' };
let simTick = 0;
function log(tag, color, msg) {
  simTick += 1000;
  const t = String(simTick).padStart(8, ' ');
  const c = LOG_COLORS[color] || '#e2e8f0';
  serial(`<span style="color:#64748b">[${t}]</span><span style="color:${c}">[${tag}]</span> <span style="color:#cbd5e1">${msg}</span>`);
}
function simBoot() {
  serial('╔══════════════════════════════════════════════════════════╗');
  serial('║  AEGIS-BEACON v5.4 — SX1262+GPS+BTN+BAT+SSD1309         ║');
  serial('╚══════════════════════════════════════════════════════════╝');
  log('INFO ', 'cyan', 'Boot #1  reset_reason=1  heap=290244 B  cpu=240MHz');
  log('BAT  ', 'green', 'Boot battery: ' + SIM.battery + '%  ' + Math.round(3.0 + SIM.battery / 100 * 1.2) + '00mV  charging=NO');
  log('OK   ', 'green', 'OLED ready — SSD1309 128x64');
  log('AUDIO', 'green', 'LEDC GPIO25 (DAC1) ch0 @ 40000 Hz 8-bit');
  log('MODE ', 'magenta', 'Starting: ' + SIM.mode.toUpperCase());
}
function simTx() {
  const f = SIM.freqs[SIM.freqIdx] || SIM.freqs[0];
  log('OK   ', 'green', `SX1262 CW TX ready: ${f.toFixed(3)} MHz @ ${SIM.power >= 0 ? '+' : ''}${SIM.power} dBm`);
  log('INFO ', 'cyan', `TX: "${SIM.payload}" (${SIM.payload.length} chars) @ ${SIM.wpm}WPM`);
  log('OK   ', 'green', `TX done: ${SIM.payload.length} chars in ${Math.round((SIM.payload.length * 6.5 * 1200 / SIM.wpm) / 1000)} ms`);
}
function simScan() {
  const idx = Math.floor(Math.random() * SIM.freqs.length);
  const f = SIM.freqs[idx];
  const r = -120 + Math.round(Math.random() * 75);
  const hit = r >= -90;
  log('SCAN ', 'blue', `[${idx}] ${f.toFixed(3)} MHz  RSSI=${r} dBm  ${hit ? '*** HIT ***' : 'quiet'}`);
  if (hit) { SIM.hitCount++; log('SCAN ', 'blue', `HIT: ${f.toFixed(3)} MHz ${r} dBm [${r >= -60 ? 'STRONG' : r >= -80 ? 'MEDIUM' : 'WEAK'}]  total=${SIM.hitCount}`); renderOled(); renderStatus(); }
}
function simGps() {
  log('GPS  ', 'cyan', 'Waiting for GPS fix (timeout 30s)...');
  setTimeout(() => {
    log('GPS  ', 'cyan', 'Fix acquired: 45.53124  12.30456  sats=6');
    log('INFO ', 'cyan', 'Payload ready: "' + SIM.payload + '"');
  }, 400);
}
function simSleep() {
  log('BAT  ', 'green', 'VBAT=' + Math.round(3.0 + SIM.battery / 100 * 1.2) + '00mV  pct=' + SIM.battery + '%  charging=NO');
  log('INFO ', 'cyan', 'Deep sleep 10 s...');
}

// ── Morse engine ─────────────────────────────────────────────────────
function dotMs() { return 1200 / SIM.wpm; }
function renderMorse() {
  const text = $('morse-input').value.toUpperCase();
  const d = dotMs();
  $('t-dot').textContent = Math.round(d) + ' ms';
  $('t-dash').textContent = Math.round(d * 3) + ' ms';
  $('t-intra').textContent = Math.round(d) + ' ms';
  $('t-inter').textContent = Math.round(d * 3) + ' ms';
  $('t-word').textContent = Math.round(d * 7) + ' ms';
  $('morse-timing').textContent = `dot ${Math.round(d)} ms · dash ${Math.round(d * 3)} ms`;

  let out = '';
  let units = 0;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch === ' ') { out += '<span class="text-slate-500"> / </span>'; units += 7; continue; }
    const code = MORSE[ch];
    if (!code) { out += `<span class="text-rose-400">?</span>`; continue; }
    for (const sym of code) {
      out += `<span class="${sym === '.' ? 'text-emerald-400' : 'text-orange-400'} font-bold">${sym === '.' ? '•' : '▬'}</span>`;
      units += sym === '.' ? 1 : 3;
      units += 1; // intra-char gap
    }
    units -= 1; // no gap after last symbol
    units += 3; // inter-char gap
    out += '<span class="text-slate-600"> </span>';
  }
  units -= 3;
  $('morse-output').innerHTML = out;
  const secs = (units * d / 1000);
  $('morse-meta').textContent = `${text.length} chars · ${units} units · ~${secs.toFixed(1)} s at ${SIM.wpm} WPM`;
}

// ── Frequency planner ────────────────────────────────────────────────
function renderFreqs() {
  const list = $('freq-list');
  list.innerHTML = '';
  SIM.freqs.forEach((f, i) => {
    const li = document.createElement('li');
    li.className = 'flex items-center justify-between bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded px-3 py-2';
    li.innerHTML = `<span><span class="text-slate-400">${i + 1}.</span> <span class="text-slate-900 dark:text-white font-bold">${f.toFixed(3)} MHz</span> ${i === 0 ? '<span class="text-[9px] text-orange-600 dark:text-orange-400 font-bold">PRIMARY</span>' : ''}</span>
          <button data-del="${i}" class="text-rose-500 hover:text-rose-400 font-mono text-[10px]">REMOVE</button>`;
    list.appendChild(li);
  });
  $('freq-add').disabled = SIM.freqs.length >= 10;
}

// ── Buttons (virtual keypad) ─────────────────────────────────────────
const LONG_PRESS_MS = { mode: 2000, sel: 3000 };
let pressTimer = null, pressMode = null;
function keyDown(name) {
  pressMode = name;
  pressTimer = setTimeout(() => {
    if (name === 'mode') { SIM.mode = 'emergency'; log('MODE ', 'magenta', 'Long press → EMERGENCY ACTIVATED'); }
    if (name === 'sel') { SIM.mode = 'config'; log('CFG  ', 'white', 'Long press → CONFIG portal (192.168.4.1)'); }
    renderOled(); renderStatus();
  }, LONG_PRESS_MS[name] || 2000);
}
function keyUp(name) {
  clearTimeout(pressTimer);
  if (pressMode !== name) return;
  if (name === 'mode') {
    if (SIM.mode === 'emergency') { /* already emergency */ }
    else { SIM.mode = SIM.mode === 'beacon' ? 'search' : 'beacon'; log('MODE ', 'magenta', 'Short press → ' + SIM.mode.toUpperCase()); }
  } else if (name === 'sel') {
    if (SIM.mode === 'config') { SIM.mode = 'beacon'; log('CFG  ', 'white', 'CONFIG saved → reboot into BEACON'); }
    else { SIM.adjust = SIM.adjust === 'VOL' ? 'WPM' : 'VOL'; log('BTN  ', 'white', 'Adjust target → ' + SIM.adjust); }
  } else if (name === 'up') {
    if (SIM.adjust === 'VOL') SIM.vol = Math.min(255, SIM.vol + 10);
    else SIM.wpm = Math.min(40, SIM.wpm + 1);
    log('BTN  ', 'white', `UP → ${SIM.adjust} ${SIM.adjust === 'VOL' ? SIM.vol : SIM.wpm}`);
  } else if (name === 'dn') {
    if (SIM.adjust === 'VOL') SIM.vol = Math.max(20, SIM.vol - 10);
    else SIM.wpm = Math.max(5, SIM.wpm - 1);
    log('BTN  ', 'white', `DN → ${SIM.adjust} ${SIM.adjust === 'VOL' ? SIM.vol : SIM.wpm}`);
  }
  renderOled(); renderStatus(); renderMorse();
}

function setMode(m) {
  SIM.mode = m;
  if (m === 'search') { SIM.rssi = -87; }
  log('MODE ', 'magenta', 'Switch → ' + m.toUpperCase());
  renderOled(); renderStatus();
}

// ── GPS payload builder ──────────────────────────────────────────────
function buildPayload() {
  const first = ($('gps-first').value || 'MARIO').toUpperCase().replace(/[^A-Z ]/g, '');
  const last = ($('gps-last').value || 'ROSSI').toUpperCase().replace(/[^A-Z ]/g, '');
  const lat = parseFloat($('gps-lat').value);
  const lon = parseFloat($('gps-lon').value);
  const latEnc = ddm(lat, true), lonEnc = ddm(lon, false);
  const name = (first + ' ' + last).trim();
  SIM.payload = `SOS DE ${name} PSN ${latEnc} ${lonEnc}`;
  $('gps-payload').textContent = SIM.payload;
  renderMorse(); renderOled();
}
function ddm(deg, isLat) {
  if (isNaN(deg)) return 'UNKN';
  const hemi = isLat ? (deg >= 0 ? 'N' : 'S') : (deg >= 0 ? 'E' : 'W');
  const abs = Math.abs(deg);
  const d = Math.floor(abs);
  const m = Math.floor((abs - d) * 60);
  return `${hemi}${String(d).padStart(2, '0')}${String(m).padStart(2, '0')}`;
}

// ── Wire up ──────────────────────────────────────────────────────────
function wire() {
  ['mode', 'sel', 'up', 'dn'].forEach(n => {
    const el = $('key-' + n);
    el.addEventListener('mousedown', () => keyDown(n));
    el.addEventListener('mouseup', () => keyUp(n));
    el.addEventListener('mouseleave', () => { clearTimeout(pressTimer); pressMode = null; });
    el.addEventListener('touchstart', e => { e.preventDefault(); keyDown(n); });
    el.addEventListener('touchend', e => { e.preventDefault(); keyUp(n); });
  });
  document.querySelectorAll('.mode-card').forEach(c => c.addEventListener('click', () => setMode(c.dataset.setMode)));

  $('bat-slider').addEventListener('input', e => { SIM.battery = +e.target.value; renderOled(); renderStatus(); });
  $('morse-wpm').addEventListener('input', e => { SIM.wpm = +e.target.value; $('morse-wpm-val').textContent = SIM.wpm; renderMorse(); });
  $('morse-input').addEventListener('input', renderMorse);
  $('rssi-slider').addEventListener('input', e => {
    SIM.rssi = +e.target.value;
    $('rssi-val').textContent = SIM.rssi + ' dBm';
    $('rssi-class').textContent = signalClass();
    $('rssi-class').className = 'font-bold ' + (SIM.rssi >= -60 ? 'text-emerald-600 dark:text-emerald-400' : SIM.rssi >= -80 ? 'text-orange-600 dark:text-orange-400' : 'text-slate-500 dark:text-slate-400');
    $('rssi-fill').style.height = rssiPct() + '%';
    $('pitch-val').textContent = '~' + Math.round(440 + (SIM.rssi + 120) / 80 * 1760) + ' Hz';
    if (audioPlaying) { tone.frequency.setValueAtTime(currentPitchHz(), audioCtx.currentTime); }
    renderOled();
  });

  // WebAudio tone (SEARCH audio alert emulation) — idempotent on repeated clicks
  let audioCtx = null, tone = null, toneGain = null, audioPlaying = false;
  function currentPitchHz() { return Math.round(440 + (SIM.rssi + 120) / 80 * 1760); }
  $('audio-on').addEventListener('click', () => {
    try {
      if (!audioPlaying) {
        audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
        tone = audioCtx.createOscillator();
        toneGain = audioCtx.createGain();
        toneGain.gain.value = 0.04;
        tone.type = 'square';
        tone.frequency.value = currentPitchHz();
        tone.connect(toneGain).connect(audioCtx.destination);
        tone.start();
        audioPlaying = true;
        log('AUDIO', 'green', 'LEDC GPIO25 (DAC1) tone ' + currentPitchHz() + ' Hz (simulated)');
      } else {
        tone.frequency.setValueAtTime(currentPitchHz(), audioCtx.currentTime);
      }
    } catch (_) { log('AUDIO', 'red', 'Audio unavailable in this browser'); }
  });
  $('audio-off').addEventListener('click', () => {
    if (tone && audioPlaying) {
      try { tone.stop(); toneGain.disconnect(); audioCtx.close(); } catch (_) {}
      tone = null; toneGain = null; audioCtx = null; audioPlaying = false;
      log('AUDIO', 'green', 'Audio tone stopped — DAC parked at 1.65 V');
    }
  });
  $('freq-add').addEventListener('click', () => {
    const v = parseFloat($('freq-input').value);
    if (!isNaN(v) && SIM.freqs.length < 10) { SIM.freqs.push(v); renderFreqs(); log('CFG  ', 'white', 'Added frequency ' + v.toFixed(3) + ' MHz'); }
  });
  $('freq-list').addEventListener('click', e => {
    const btn = e.target.closest('[data-del]');
    if (btn) { SIM.freqs.splice(+btn.dataset.del, 1); renderFreqs(); renderOled(); }
  });

  document.querySelectorAll('[data-sim]').forEach(b => {
    b.addEventListener('click', () => {
      const a = { boot: simBoot, tx: simTx, scan: simScan, gps: simGps, sleep: simSleep, clear: () => { $('serial').innerHTML = ''; } };
      a[b.dataset.sim]();
    });
  });

  ['gps-first', 'gps-last', 'gps-lat', 'gps-lon'].forEach(id => $(id).addEventListener('input', buildPayload));
}

// ── Init ─────────────────────────────────────────────────────────────
initTheme();
renderFreqs();
renderMorse();
buildPayload();
renderOled();
renderStatus();
simBoot();
wire();
