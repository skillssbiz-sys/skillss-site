/* Login page glue (client-side only protection; see admin-auth.js). */
(function () {
  'use strict';
  var i18n = SkillssI18n, auth = SkillssAuth;
  if (auth.isAuthed()) { location.replace('dashboard.html'); return; }
  var form = document.getElementById('login-form'), err = document.getElementById('login-err'), btn = document.getElementById('login-btn');
  var msg = { key: '', secs: 0 }, timer = null;
  function show() {
    if (!msg.key) { err.textContent = ''; return; }
    err.textContent = i18n.t(msg.key) + (msg.secs ? ' ' + msg.secs + ' ' + i18n.t('a_sec') : '');
  }
  function tick() {
    var r = auth.lockRemaining();
    if (r > 0) { msg = { key: 'a_err_locked', secs: r }; btn.disabled = true; show(); timer = setTimeout(tick, 1000); }
    else { btn.disabled = false; if (msg.key === 'a_err_locked') { msg = { key: '', secs: 0 }; show(); } }
  }
  document.addEventListener('langchange', show);
  tick();
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var u = document.getElementById('a-user').value, p = document.getElementById('a-pass').value;
    if (!u.trim() || !p) { msg = { key: 'a_err_empty', secs: 0 }; show(); return; }
    btn.disabled = true;
    auth.login(u, p).then(function (r) {
      if (r.ok) { location.href = 'dashboard.html'; return; }
      document.getElementById('a-pass').value = '';
      if (r.nocrypto) { msg = { key: 'a_err_crypto', secs: 0 }; btn.disabled = false; }
      else if (r.locked) { clearTimeout(timer); tick(); return; }
      else { msg = { key: 'a_err_bad', secs: 0 }; btn.disabled = false; }
      show();
    });
  });
})();
