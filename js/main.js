/* Skillss public site: nav, reveal, data-driven products/settings, quote form (FormSubmit). */
(function () {
  'use strict';
  var i18n = window.SkillssI18n, D = window.SkillssData;
  var $ = function (id) { return document.getElementById(id); };
  var state = { products: [], settings: null, filter: 'all' };
  var FORM_ENDPOINT = 'https://formsubmit.co/ajax/skillssbiz@gmail.com';
  var QUOTES_KEY = 'skillss_quotes';

  // ---------- Nav ----------
  var burger = $('burger'), nav = $('nav'), menu = $('menu');
  function setMenu(open) { nav.classList.toggle('is-open', open); burger.setAttribute('aria-expanded', String(open)); }
  burger.addEventListener('click', function () { setMenu(!nav.classList.contains('is-open')); });
  menu.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });
  function onScroll() { nav.classList.toggle('is-scrolled', window.scrollY > 8); }
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
  $('year').textContent = new Date().getFullYear();

  // ---------- Reveal ----------
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var io = (!reduce && 'IntersectionObserver' in window) ? new IntersectionObserver(function (entries) {
    entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('is-visible'); io.unobserve(en.target); } });
  }, { threshold: 0.12 }) : null;
  function observe(root) {
    (root || document).querySelectorAll('.reveal:not(.is-visible)').forEach(function (el) {
      if (io) io.observe(el); else el.classList.add('is-visible');
    });
  }
  observe();

  // ---------- Helpers ----------
  function L(obj) { // localized value with fallback to the other language
    if (!obj) return '';
    if (typeof obj === 'string') return obj;
    var l = i18n.get();
    return obj[l] || obj[l === 'ru' ? 'en' : 'ru'] || '';
  }
  function h(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }

  var ICONS = {
    diagnostic: '<path d="M6 24h8l5-10 8 20 6-14 3 4h6"/><rect x="4" y="8" width="40" height="32" rx="5"/>',
    surgical: '<path d="M10 38 30 18"/><path d="M30 18c3-6 8-8 10-8 0 2-2 7-8 10z"/><path d="M8 40l4-1-3-3z"/>',
    consumables: '<rect x="12" y="18" width="24" height="24" rx="4"/><path d="M18 18v-6h12v6"/><path d="M24 25v10M19 30h10"/>',
    laboratory: '<path d="M18 6h12M20 6v12L9 38a3 3 0 0 0 3 4h24a3 3 0 0 0 3-4L28 18V6"/><path d="M14 30h20"/>',
    imaging: '<rect x="5" y="10" width="38" height="28" rx="5"/><circle cx="24" cy="24" r="8"/><path d="M24 20v8M20 24h8"/>'
  };
  function icon(cat) {
    var wrap = h('div', 'icon'); wrap.setAttribute('aria-hidden', 'true');
    wrap.innerHTML = '<svg viewBox="0 0 48 48">' + (ICONS[cat] || ICONS.consumables) + '</svg>'; // static trusted markup
    return wrap;
  }

  // ---------- Products ----------
  function renderChips() {
    var box = $('chips'); box.textContent = '';
    ['all'].concat(D.CATEGORIES).forEach(function (c) {
      var b = h('button', 'chip', i18n.t('cat_' + c)); b.type = 'button';
      b.setAttribute('aria-pressed', String(state.filter === c));
      b.addEventListener('click', function () { state.filter = c; renderChips(); renderProducts(); });
      box.appendChild(b);
    });
  }
  function renderProducts() {
    var grid = $('product-grid'); grid.textContent = '';
    var list = state.products.filter(function (p) { return state.filter === 'all' || p.category === state.filter; });
    if (!list.length) { grid.appendChild(h('p', 'muted', i18n.t('products_empty'))); return; }
    list.forEach(function (p) {
      var card = h('article', 'card reveal');
      card.appendChild(icon(p.category));
      var cat = h('span', 'card__cat', i18n.t('cat_' + p.category)); card.appendChild(cat);
      var tag = L(p.tag);
      if (tag) card.appendChild(h('span', 'tagbadge', tag));
      card.appendChild(h('h3', null, L(p.name)));
      card.appendChild(h('p', null, L(p.description)));
      var a = h('a', 'card__link', i18n.t('card_ask')); a.href = '#contact';
      a.addEventListener('click', function () { $('f-product').value = p.id; });
      card.appendChild(a);
      grid.appendChild(card);
    });
    observe(grid);
  }
  function renderSelect() {
    var sel = $('f-product'), prev = sel.value; sel.textContent = '';
    var o = h('option', null, i18n.t('opt_choose')); o.value = ''; sel.appendChild(o);
    state.products.forEach(function (p) { var op = h('option', null, L(p.name)); op.value = p.id; sel.appendChild(op); });
    var other = h('option', null, i18n.t('opt_other')); other.value = 'other'; sel.appendChild(other);
    sel.value = prev;
  }

  // ---------- Settings ----------
  function renderSettings() {
    var s = state.settings; if (!s) return;
    if (s.hero) {
      var t = L(s.hero.title), sub = L(s.hero.subtitle);
      if (t) $('hero-title').textContent = t;
      if (sub) $('hero-sub').textContent = sub;
    }
    var email = s.email || 'skillssbiz@gmail.com';
    var ce = $('c-email'); ce.textContent = email; ce.href = 'mailto:' + email;
    document.querySelectorAll('[data-contact-email]').forEach(function (a) { a.textContent = email; a.href = 'mailto:' + email; });
    var tg = (s.telegram || '').trim();
    if (/^https:\/\/t\.me\/[A-Za-z0-9_]{3,}$/.test(tg)) { $('c-telegram').href = tg; $('f-telegram').href = tg; }
    var ph = (s.phone || '').trim();
    $('c-phone-row').hidden = !ph;
    if (ph) { $('c-phone').textContent = ph; $('c-phone').href = 'tel:' + ph.replace(/[^\d+]/g, ''); }
    var ad = L(s.address).trim();
    $('c-address-row').hidden = !ad;
    if (ad) $('c-address').textContent = ad;

    var tg = $('testimonial-grid'); tg.textContent = '';
    (s.testimonials || []).forEach(function (x) {
      var f = h('figure', 'card quote reveal');
      if (x.example) f.appendChild(h('span', 'example-label', i18n.t('example_label')));
      var bq = h('blockquote', null, L(x.quote)); f.appendChild(bq);
      f.appendChild(h('figcaption', null, L(x.author)));
      tg.appendChild(f);
    });
    observe(tg);
  }

  function renderAll() { renderChips(); renderProducts(); renderSelect(); renderSettings(); }
  document.addEventListener('langchange', function () { if (state.settings) renderAll(); relocalizeErrors(); });

  var badge = $('preview-badge');
  function updateBadge() { badge.hidden = !(D.hasOverride('products') || D.hasOverride('settings')); }
  $('preview-reset').addEventListener('click', function () {
    D.clearOverride('products'); D.clearOverride('settings'); location.reload();
  });

  Promise.all([D.products(), D.settings()]).then(function (r) {
    state.products = Array.isArray(r[0]) ? r[0] : []; state.settings = r[1] || {};
    renderAll(); updateBadge();
  }).catch(function () {
    // Fall back gracefully: static HTML stays; form select still gets an "Other" option.
    renderSelect();
  });

  // ---------- Quote form ----------
  var form = $('quote-form'), success = $('form-success'), fail = $('form-error'), submit = $('f-submit');
  function setErr(name, key) {
    var el = form.querySelector('[data-err="' + name + '"]'), input = form.elements[name];
    el.textContent = key ? i18n.t(key) : ''; el.setAttribute('data-key', key || '');
    input.setAttribute('aria-invalid', key ? 'true' : 'false');
  }
  function relocalizeErrors() {
    form.querySelectorAll('.err').forEach(function (el) { var k = el.getAttribute('data-key'); if (k) el.textContent = i18n.t(k); });
  }
  function saveQuote(q) {
    try {
      var arr = JSON.parse(localStorage.getItem(QUOTES_KEY) || '[]'); if (!Array.isArray(arr)) arr = [];
      arr.unshift(q); localStorage.setItem(QUOTES_KEY, JSON.stringify(arr.slice(0, 500)));
    } catch (e) {}
  }
  function productLabel(id) {
    if (!id) return '';
    if (id === 'other') return i18n.t('opt_other');
    var p = state.products.filter(function (x) { return x.id === id; })[0];
    return p ? L(p.name) : id;
  }
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    success.hidden = true; fail.hidden = true;
    var f = form.elements, ok = true;
    if (!f.name.value.trim()) { setErr('name', 'err_required'); ok = false; } else setErr('name', '');
    var em = f.email.value.trim();
    if (!em) { setErr('email', 'err_required'); ok = false; }
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) { setErr('email', 'err_email'); ok = false; }
    else setErr('email', '');
    if (!f.message.value.trim()) { setErr('message', 'err_required'); ok = false; } else setErr('message', '');
    if (!ok) { var bad = form.querySelector('[aria-invalid="true"]'); if (bad) bad.focus(); return; }

    var payload = {
      name: f.name.value.trim(), email: em, company: f.company.value.trim(), country: f.country.value.trim(),
      product: productLabel(f.product.value), message: f.message.value.trim(),
      language: i18n.get(),
      _subject: 'Skillss site: quote request from ' + f.name.value.trim(),
      _template: 'table', _captcha: 'false', _honey: f._honey.value
    };
    var quote = {
      id: 'q' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      date: new Date().toISOString(), status: 'new', sent: false,
      name: payload.name, email: payload.email, company: payload.company, country: payload.country,
      product: payload.product, productId: f.product.value, message: payload.message, language: payload.language
    };

    var labelKey = 'f_submit';
    submit.disabled = true; submit.classList.add('is-loading'); submit.setAttribute('aria-busy', 'true');
    submit.textContent = i18n.t('f_sending'); submit.setAttribute('data-i18n', 'f_sending');

    function done() {
      submit.disabled = false; submit.classList.remove('is-loading'); submit.removeAttribute('aria-busy');
      submit.setAttribute('data-i18n', labelKey); submit.textContent = i18n.t(labelKey);
    }
    function failed() {
      saveQuote(quote);
      var body = payload.message + '\n\n' + payload.name + (payload.company ? ', ' + payload.company : '') + (payload.country ? ', ' + payload.country : '') + '\n' + payload.email;
      var addr = (state.settings && state.settings.email) || 'skillssbiz@gmail.com';
      $('form-mailto').href = 'mailto:' + addr + '?subject=' + encodeURIComponent('Skillss: ' + (payload.product || 'quote request')) + '&body=' + encodeURIComponent(body);
      fail.hidden = false; done();
    }
    fetch(FORM_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(payload)
    }).then(function (res) {
      return res.json().catch(function () { return {}; }).then(function (data) {
        window.__lastFormResponse = { status: res.status, data: data };
        if (res.ok && (data.success === true || data.success === 'true')) {
          quote.sent = true; saveQuote(quote); form.reset(); success.hidden = false; done();
        } else { failed(); }
      });
    }).catch(function () { window.__lastFormResponse = { error: true }; failed(); });
  });
})();
