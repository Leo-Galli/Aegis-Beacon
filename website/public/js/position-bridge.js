/* Aegis-Beacon position bridge client.
 *
 * Two data paths:
 *  1. URL parameters: the bridge (or a shared link) opens
 *     /report-position?lat=..&lng=..&alt=..&sats=..&freq=..&mode=..&payload=..
 *     and this script fills the form on load.
 *  2. Live sync: the companion bridge script (bridge/aegis-serial-bridge.py)
 *     serves a tiny HTTP endpoint on the loopback interface. This page polls
 *     it; when the bridge sees the page is open it stops opening new tabs and
 *     just streams fresh positions here.
 *
 * Chrome, Edge and Firefox allow HTTPS pages to talk to http://127.0.0.1, so
 * live sync works there. Safari blocks it; the URL-parameter path still works
 * in every browser.
 */
(function () {
  'use strict';

  var BRIDGE_BASE = 'http://127.0.0.1:8765';
  var POLL_MS = 1500;
  var BRIDGE_TIMEOUT_MS = 7000;

  var lastAppliedTs = 0;
  var bridgeSeen = false;

  function $(id) { return document.getElementById(id); }

  function setStatus(el, text, tone) {
    if (!el) return;
    el.textContent = text;
    el.classList.remove('pos-status--ok', 'pos-status--warn', 'pos-status--idle');
    if (tone) el.classList.add('pos-status--' + tone);
  }

  function fillValue(id, value) {
    var el = $(id);
    if (el && value !== undefined && value !== null && value !== '') el.value = String(value);
  }

  /* Parse either a raw AEGIS:POS: line or a plain "k=v;k=v" string. */
  function parseLine(text) {
    if (!text) return null;
    var body = text.trim();
    var m = body.match(/^AEGIS:POS:(.*)$/i);
    if (m) body = m[1].trim();
    if (!body) return null;

    var data = {};
    var pairs = body.split(';');
    for (var i = 0; i < pairs.length; i++) {
      var pair = pairs[i].trim();
      if (!pair) continue;
      var eq = pair.indexOf('=');
      if (eq < 0) continue;
      var key = pair.slice(0, eq).trim().toLowerCase();
      var value = pair.slice(eq + 1).trim();
      if (!key || !value) continue;
      if (key === 'lat' || key === 'lng' || key === 'lon') {
        var num = parseFloat(value);
        if (isFinite(num)) data[key === 'lon' ? 'lng' : key] = num;
      } else if (key === 'alt' || key === 'sats') {
        var n = parseFloat(value);
        if (isFinite(n)) data[key] = n;
      } else if (key === 'freq') {
        var f = parseFloat(value);
        if (isFinite(f)) data.freq = f;
      } else {
        data[key] = value;
      }
    }
    return data;
  }

  function applyData(data) {
    if (!data) return;
    if (data.lat !== undefined && data.lng !== undefined) {
      fillValue('pos-lat', data.lat.toFixed ? data.lat.toFixed(6) : data.lat);
      fillValue('pos-lng', data.lng.toFixed ? data.lng.toFixed(6) : data.lng);
    }
    fillValue('pos-alt', data.alt !== undefined ? Math.round(data.alt) : '');
    fillValue('pos-sats', data.sats !== undefined ? Math.round(data.sats) : '');
    fillValue('pos-freq', data.freq !== undefined ? Number(data.freq).toFixed(3) : '');
    fillValue('pos-mode', data.mode ? String(data.mode).toUpperCase() : '');
    fillValue('pos-payload', data.payload || '');

    var status = $('pos-status');
    var maps = $('pos-maps-link');
    if (data.lat !== undefined && data.lng !== undefined) {
      var lat = Number(data.lat);
      var lng = Number(data.lng);
      if (isFinite(lat) && isFinite(lng)) {
        if (maps) {
          maps.href = 'https://www.google.com/maps?q=' + encodeURIComponent(lat + ',' + lng);
          maps.classList.remove('is-hidden');
        }
        var osm = $('pos-osm-link');
        if (osm) {
          osm.href = 'https://www.openstreetmap.org/?mlat=' + lat + '&mlon=' + lng + '#map=15/' + lat + '/' + lng;
          osm.classList.remove('is-hidden');
        }
      }
    }
    var when = new Date().toLocaleTimeString();
    setStatus(status, 'Position received from device at ' + when + '.', 'ok');
  }

  function applyFromUrl() {
    var q = new URLSearchParams(window.location.search);
    var data = {};
    ['lat', 'lng', 'alt', 'sats', 'freq', 'mode', 'payload'].forEach(function (k) {
      var v = q.get(k);
      if (v !== null && v !== '') data[k] = k === 'sats' || k === 'alt' ? parseFloat(v) : v;
    });
    if (data.lat !== undefined && data.lng !== undefined) {
      data.lat = parseFloat(data.lat);
      data.lng = parseFloat(data.lng);
      if (isFinite(data.lat) && isFinite(data.lng)) applyData(data);
    }
  }

  function pollBridge() {
    var status = $('pos-status');
    fetch(BRIDGE_BASE + '/stream?from=page&_=' + Date.now(), { mode: 'cors', cache: 'no-store' })
      .then(function (res) { if (!res.ok) throw new Error('HTTP ' + res.status); return res.json(); })
      .then(function (json) {
        if (!bridgeSeen) {
          bridgeSeen = true;
          setStatus(status, 'Bridge connected. Waiting for fresh device data...', 'idle');
        }
        if (json && json.ts && json.ts > lastAppliedTs) {
          lastAppliedTs = json.ts;
          applyData(json);
        }
      })
      .catch(function () {
        if (bridgeSeen) {
          bridgeSeen = false;
          setStatus(status, 'Bridge link lost. Reconnect the bridge script or use the link it opens.', 'warn');
        } else {
          var statusText = status && status.textContent;
          if (!statusText || statusText.indexOf('Position received') !== 0) {
            setStatus(status, 'No bridge detected on this device. Open the link generated by the bridge script, or paste an AEGIS:POS: line below.', 'warn');
          }
        }
      });
  }

  function buildShareLink() {
    var params = new URLSearchParams();
    [['lat', 'pos-lat'], ['lng', 'pos-lng'], ['alt', 'pos-alt'], ['sats', 'pos-sats'],
     ['freq', 'pos-freq'], ['mode', 'pos-mode'], ['payload', 'pos-payload']].forEach(function (pair) {
      var el = $(pair[1]);
      if (el && el.value) params.set(pair[0], el.value);
    });
    var qs = params.toString();
    return window.location.origin + '/report-position' + (qs ? '?' + qs : '');
  }

  function init() {
    var paste = $('pos-paste');
    if (!paste) return;

    applyFromUrl();

    paste.addEventListener('input', function () {
      var data = parseLine(paste.value);
      if (data && data.lat !== undefined && data.lng !== undefined) {
        applyData(data);
      }
    });

    var copyBtn = $('pos-copy-link');
    if (copyBtn) {
      copyBtn.addEventListener('click', function () {
        var link = buildShareLink();
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(link).then(function () {
            copyBtn.textContent = 'Copied';
            setTimeout(function () { copyBtn.textContent = 'Copy link with position'; }, 1600);
          });
        } else {
          window.prompt('Copy this link:', link);
        }
      });
    }

    /* Heartbeat + live updates. A failed poll leaves the URL-param result in
       place; a successful one switches to live streaming. */
    pollBridge();
    window.setInterval(pollBridge, POLL_MS);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();