/* CLIENT-SIDE ONLY admin protection. This is NOT real security: anyone can read this file,
   bypass the session check or edit storage. Real authentication needs a backend.
   Credentials are never stored here, only a salted PBKDF2-HMAC-SHA-256 hash (Web Crypto). */
(function () {
  'use strict';
  var CFG = { salt: 'c74af4d6bdc99853a8bbad521c74a32a', iter: 150000, hash: '5fa22aacac84cc6e69e712a95ab413da382d4f76232f04de5940b5f102900949' };
  var SESSION = 'skillss_admin_session', LOCK = 'skillss_admin_lock', MAXAGE = 8 * 3600 * 1000;

  function hex(buf) { return Array.prototype.map.call(new Uint8Array(buf), function (b) { return ('0' + b.toString(16)).slice(-2); }).join(''); }
  function unhex(s) { var a = new Uint8Array(s.length / 2); for (var i = 0; i < a.length; i++) a[i] = parseInt(s.substr(i * 2, 2), 16); return a; }

  function derive(user, pass) {
    var enc = new TextEncoder();
    return crypto.subtle.importKey('raw', enc.encode(user.trim() + '\u0000' + pass), 'PBKDF2', false, ['deriveBits'])
      .then(function (key) {
        return crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt: unhex(CFG.salt), iterations: CFG.iter }, key, 256);
      }).then(hex);
  }
  function safeEqual(a, b) { if (a.length !== b.length) return false; var r = 0; for (var i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i); return r === 0; }

  function lockState() { try { return JSON.parse(localStorage.getItem(LOCK) || '{}'); } catch (e) { return {}; } }
  function lockRemaining() { var s = lockState(); return s.until && s.until > Date.now() ? Math.ceil((s.until - Date.now()) / 1000) : 0; }
  function fail() {
    var s = lockState(); s.fails = (s.fails || 0) + 1;
    if (s.fails >= 5) s.until = Date.now() + Math.min(60 * Math.pow(2, s.fails - 5), 900) * 1000;
    try { localStorage.setItem(LOCK, JSON.stringify(s)); } catch (e) {}
  }
  function clearFails() { try { localStorage.removeItem(LOCK); } catch (e) {} }

  function login(user, pass) {
    if (lockRemaining()) return Promise.resolve({ ok: false, locked: lockRemaining() });
    if (!window.crypto || !crypto.subtle) return Promise.resolve({ ok: false, nocrypto: true });
    return Promise.all([derive(user, pass), new Promise(function (r) { setTimeout(r, 700); })]).then(function (r) {
      if (safeEqual(r[0], CFG.hash)) {
        clearFails();
        var tok = Date.now() + ':' + hex(crypto.getRandomValues(new Uint8Array(16)));
        sessionStorage.setItem(SESSION, tok);
        return { ok: true };
      }
      fail();
      return { ok: false, locked: lockRemaining() };
    });
  }
  function isAuthed() {
    try {
      var t = sessionStorage.getItem(SESSION); if (!t) return false;
      var ts = parseInt(t.split(':')[0], 10);
      return !isNaN(ts) && Date.now() - ts < MAXAGE && /^\d+:[0-9a-f]{32}$/.test(t);
    } catch (e) { return false; }
  }
  function logout() { try { sessionStorage.removeItem(SESSION); } catch (e) {} }

  window.SkillssAuth = { login: login, isAuthed: isAuthed, logout: logout, lockRemaining: lockRemaining };
})();
