/* DEMO-ONLY admin behaviour. A sessionStorage flag stands in for authentication.
   There is NO real security here; real auth needs a backend. */
(function () {
  'use strict';
  var FLAG = 'skillss-admin';
  var i18n = window.SkillssI18n;

  var loginForm = document.getElementById('login-form');
  if (loginForm) {
    var err = document.getElementById('login-err');
    try { if (sessionStorage.getItem(FLAG) === '1') location.replace('dashboard.html'); } catch (e) {}
    var errKey = '';
    document.addEventListener('langchange', function () { if (errKey) err.textContent = i18n.t(errKey); });
    loginForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var email = document.getElementById('a-email').value.trim();
      var pass = document.getElementById('a-pass').value;
      if (!email || !pass) { errKey = 'a_err'; err.textContent = i18n.t(errKey); return; }
      try { sessionStorage.setItem(FLAG, '1'); } catch (x) {}
      location.href = 'dashboard.html';
    });
  }

  var logout = document.getElementById('logout');
  if (logout) {
    logout.addEventListener('click', function () {
      try { sessionStorage.removeItem(FLAG); } catch (e) {}
      location.href = 'index.html';
    });
    var tabs = document.querySelectorAll('[data-tab]');
    tabs.forEach(function (b) {
      b.addEventListener('click', function () {
        tabs.forEach(function (t) { t.removeAttribute('aria-current'); });
        b.setAttribute('aria-current', 'page');
        document.querySelectorAll('.panel').forEach(function (p) { p.classList.remove('is-active'); });
        document.getElementById('panel-' + b.getAttribute('data-tab')).classList.add('is-active');
      });
    });
  }
})();
