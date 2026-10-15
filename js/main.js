/* Skillss landing page behaviour: mobile menu, sticky-nav shadow, scroll reveal, quote form. */
(function () {
  'use strict';
  var i18n = window.SkillssI18n;

  // Mobile menu
  var burger = document.getElementById('burger');
  var nav = document.getElementById('nav');
  var menu = document.getElementById('menu');
  function setMenu(open) {
    nav.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', String(open));
  }
  burger.addEventListener('click', function () { setMenu(!nav.classList.contains('is-open')); });
  menu.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () { setMenu(false); });
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });

  // Nav shadow on scroll
  function onScroll() { nav.classList.toggle('is-scrolled', window.scrollY > 8); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Fade-in on scroll
  var items = document.querySelectorAll('.reveal');
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || !('IntersectionObserver' in window)) {
    items.forEach(function (el) { el.classList.add('is-visible'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-visible'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    items.forEach(function (el) { io.observe(el); });
  }

  document.getElementById('year').textContent = new Date().getFullYear();

  // Product card links preselect the product in the form
  var select = document.getElementById('f-product');
  document.querySelectorAll('[data-product]').forEach(function (a) {
    a.addEventListener('click', function () { select.value = a.getAttribute('data-product'); });
  });

  /* PLACEHOLDER form handling: no backend. We only validate on the client and show a
     success message. Nothing is transmitted or stored. Connect a real endpoint later. */
  var form = document.getElementById('quote-form');
  var success = document.getElementById('form-success');
  function setErr(name, key) {
    var el = form.querySelector('[data-err="' + name + '"]');
    var input = form.elements[name];
    el.textContent = key ? i18n.t(key) : '';
    el.setAttribute('data-key', key || '');
    input.setAttribute('aria-invalid', key ? 'true' : 'false');
  }
  document.addEventListener('langchange', function () {
    form.querySelectorAll('.err').forEach(function (el) {
      var k = el.getAttribute('data-key'); if (k) el.textContent = i18n.t(k);
    });
  });
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    success.hidden = true;
    var ok = true;
    var f = form.elements;
    if (!f.name.value.trim()) { setErr('name', 'err_required'); ok = false; } else setErr('name', '');
    var em = f.email.value.trim();
    if (!em) { setErr('email', 'err_required'); ok = false; }
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) { setErr('email', 'err_email'); ok = false; }
    else setErr('email', '');
    if (!f.message.value.trim()) { setErr('message', 'err_required'); ok = false; } else setErr('message', '');
    if (!ok) { var bad = form.querySelector('[aria-invalid="true"]'); if (bad) bad.focus(); return; }
    form.reset();
    success.hidden = false;
  });
})();
