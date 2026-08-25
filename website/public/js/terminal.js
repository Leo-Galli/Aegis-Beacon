/**
 * TX/RX terminal emulator for the index page "Instrument Diagnostics"
 * section. Simulates the serial (UART) output stream of the firmware:
 * live clock, TX/RX mode toggle and GPS NMEA burst injection.
 */

const SIM_LABELS = {
  rxState: 'SYS_STATUS: STANDBY_RX',
  txState: 'SYS_STATUS: TRANSMITTING_TX',
  btnRx: 'Switch to Receive (RX)',
  btnTx: 'Switch to Transmit (TX)',
  txBody: [
    '<p class="text-orange-500 font-bold animate-pulse leading-tight">TRANSMISSION ENABLED — CONTINUOUS CW TX</p>',
    '<p class="text-slate-400 leading-tight">Carrier frequency: 433.500 MHz [UHF — EU ISM]</p>',
    '<p class="text-slate-500 leading-tight" id="gps-stream-row">GPS data state: polling the internal UART module...</p>'
  ].join(''),
  rxBody: [
    '<p id="init-line" class="leading-tight"><span class="text-slate-500">[ 12400][GPS  ]</span> <span class="text-cyan-400">Fix acquired: 45.53124  12.30456 sats=6</span></p>',
    '<p id="freq-line" class="leading-tight"><span class="text-slate-500">[   139][INFO ]</span> <span class="text-emerald-400">SX1262 CW TX ready: 433.500 MHz @ +17 dBm</span></p>',
    '<p id="volt-line" class="leading-tight"><span class="text-slate-500">[   140][INFO ]</span> <span class="text-slate-300">TX: "SOS DE MARIO ROSSI PSN N4553 E01230" (31 chars) @ 13WPM</span></p>'
  ].join(''),
  gpsUpdate: 'UART NMEA FRAME STABLE // FIX: LAT 45.8921 N — LON 12.1044 E [BURST INJECTED]',
  gpsAlert: 'HALT: Transmit status (TX) must be engaged to force NMEA data sentence injection.'
};

let currentEngineMode = 'RX';

export function initTerminal() {
  const toggleBtn = document.getElementById('btn-toggle-sys');
  const gpsBtn = document.getElementById('btn-trigger-gps');
  const panelBody = document.getElementById('terminal-body');
  const stateFlag = document.getElementById('state-indicator');
  const clock = document.getElementById('clock-display');

  if (!toggleBtn || !gpsBtn || !panelBody || !stateFlag) return;

  // Live clock in the terminal header.
  const tick = () => {
    if (clock) clock.textContent = new Date().toTimeString().split(' ')[0];
  };
  tick();
  setInterval(tick, 1000);

  toggleBtn.addEventListener('click', () => {
    if (currentEngineMode === 'RX') {
      currentEngineMode = 'TX';
      stateFlag.textContent = SIM_LABELS.txState;
      stateFlag.className = 'self-start sm:self-auto text-orange-700 dark:text-orange-400 font-bold px-2 py-0.5 border border-orange-300 dark:border-orange-900 bg-orange-50 dark:bg-orange-950/20 rounded';
      toggleBtn.textContent = SIM_LABELS.btnRx;
      panelBody.innerHTML = SIM_LABELS.txBody;
    } else {
      currentEngineMode = 'RX';
      stateFlag.textContent = SIM_LABELS.rxState;
      stateFlag.className = 'self-start sm:self-auto text-slate-700 dark:text-slate-300 font-bold px-2 py-0.5 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 rounded';
      toggleBtn.textContent = SIM_LABELS.btnTx;
      panelBody.innerHTML = SIM_LABELS.rxBody;
    }
  });

  gpsBtn.addEventListener('click', () => {
    if (currentEngineMode === 'TX') {
      const row = document.getElementById('gps-stream-row');
      if (row) {
        row.textContent = SIM_LABELS.gpsUpdate;
        row.className = 'text-white font-bold bg-slate-900 dark:bg-slate-800 border border-slate-800 dark:border-slate-700 p-1 text-center rounded mt-1 text-[9px] sm:text-[10px] break-all';
      }
    } else {
      alert(SIM_LABELS.gpsAlert);
    }
  });
}
