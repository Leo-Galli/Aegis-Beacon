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
 *
 * Every applied position is also broadcast as a window "aegis:position"
 * CustomEvent so the page's map can draw the marker and the movement track.
 */
(function () {
  'use strict';

  var BRIDGE_BASE = 'http://127.0.0.1:8765';
  var POLL_MS = 1500;

  var lastAppliedTs = 0;
  var bridgeSeen = false;
  var lastFixState = null;

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

  function sanitizeText(value, maxLen) {
    if (value === undefined || value === null) return '';
    var s = String(value)
      .replace(/[\u0000-\u001f\u007f]/g, '')   /* drop control characters */
      .trim();
    if (maxLen && s.length > maxLen) s = s.slice(0, maxLen);
    return s;
  }

  function validCoord(lat, lng) {
    return isFinite(lat) && isFinite(lng) &&
           Math.abs(lat) <= 90 && Math.abs(lng) <= 180;
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
      if (key === 'lat' || key === 'lng' || key === 'lon' || key === 'alt' ||
          key === 'sats' || key === 'freq' || key === 'fix' || key === 'age') {
        var num = parseFloat(value);
        if (isFinite(num)) data[key === 'lon' ? 'lng' : key] = num;
      } else {
        data[key] = sanitizeText(value, key === 'payload' ? 128 : 32);
      }
    }
    return normalize(data);
  }

  /* Range-checks and normalizes a position record. Returns null when invalid. */
  function normalize(data) {
    if (!data) return null;
    if (data.lat !== undefined && data.lng !== undefined &&
        !validCoord(Number(data.lat), Number(data.lng))) {
      return null;
    }
    var out = {};
    ['lat', 'lng', 'alt', 'sats', 'freq', 'fix', 'age'].forEach(function (k) {
      if (data[k] !== undefined && data[k] !== null && data[k] !== '') out[k] = Number(data[k]);
    });
    ['mode', 'payload'].forEach(function (k) {
      var v = sanitizeText(data[k], k === 'payload' ? 128 : 32);
      if (v) out[k] = k === 'mode' ? v.toUpperCase() : v;
    });
    return out;
  }

  function applyData(raw) {
    var data = normalize(raw);
    if (!data) return;

    if (data.lat !== undefined && data.lng !== undefined) {
      fillValue('pos-lat', Number(data.lat).toFixed(6));
      fillValue('pos-lng', Number(data.lng).toFixed(6));
    }
    fillValue('pos-alt', data.alt !== undefined ? Math.round(data.alt) : '');
    fillValue('pos-sats', data.sats !== undefined ? Math.round(data.sats) : '');
    fillValue('pos-freq', data.freq !== undefined ? Number(data.freq).toFixed(3) : '');
    fillValue('pos-mode', data.mode || '');
    fillValue('pos-payload', data.payload || '');

    var status = $('pos-status');
    var maps = $('pos-maps-link');
    var osm = $('pos-osm-link');
    if (data.lat !== undefined && data.lng !== undefined) {
      var lat = Number(data.lat);
      var lng = Number(data.lng);
      if (maps) {
        maps.href = 'https://www.google.com/maps?q=' + encodeURIComponent(lat + ',' + lng);
        maps.classList.remove('is-hidden');
      }
      if (osm) {
        osm.href = 'https://www.openstreetmap.org/?mlat=' + lat + '&mlon=' + lng + '#map=15/' + lat + '/' + lng;
        osm.classList.remove('is-hidden');
      }
    }

    var isLive = data.fix !== 0;
    if (isLive !== lastFixState) {
      lastFixState = isLive;
      if (status) {
        if (isLive) {
          setStatus(status, 'Position received from device at ' + new Date().toLocaleTimeString() + '.', 'ok');
        } else {
          setStatus(status, 'Position received (last known fix, GPS not updating).', 'warn');
        }
      }
    }

    /* Broadcast to the page map so it can draw the marker and track. */
    window.dispatchEvent(new CustomEvent('aegis:position', { detail: data }));
  }

  function applyFromUrl() {
    var q = new URLSearchParams(window.location.search);
    var data = {};
    ['lat', 'lng', 'alt', 'sats', 'freq', 'fix', 'age', 'mode', 'payload'].forEach(function (k) {
      var v = q.get(k);
      if (v !== null && v !== '') data[k] = v;
    });
    var norm = normalize(data);
    if (norm) applyData(norm);
  }

  function pollBridge() {
    var status = $('pos-status');
    fetch(BRIDGE_BASE + '/stream?from=page&_=' + Date.now(), { mode: 'cors', cache: 'no-store' })
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
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
      if (data) applyData(data);
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

    pollBridge();
    window.setInterval(pollBridge, POLL_MS);
  }

  try {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
    } else {
      init();
    }
  } catch (err) {
    /* Never let a client error break the page. */
    window.dispatchEvent(new CustomEvent('aegis:client-error', { detail: String(err) }));
  }
})();