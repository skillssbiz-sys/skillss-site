/* Admin dashboard: quote requests, products CRUD, site settings.
   All data lives in this browser (localStorage) for preview; "Export JSON" produces files
   the owner commits to data/ to publish. Client-side only: not real security. */
(function () {
  'use strict';
  var i18n = SkillssI18n, D = SkillssData, auth = SkillssAuth;
  if (!auth.isAuthed()) { location.replace('index.html'); return; }
  var QUOTES_KEY = 'skillss_quotes';
  var $ = function (id) { return document.getElementById(id); };
  function h(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }
  function L(o) { if (!o) return ''; var l = i18n.get(); return o[l] || o[l === 'ru' ? 'en' : 'ru'] || ''; }
  function toast(key) {
    var t = $('toast'); t.textContent = i18n.t(key); t.classList.add('is-on');
    clearTimeout(toast._t); toast._t = setTimeout(function () { t.classList.remove('is-on'); }, 2500);
  }
  function download(name, text, mime) {
    var blob = new Blob([text], { type: mime }), a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = name; document.body.appendChild(a); a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500);
  }

  // ---------- Shell: tabs, logout ----------
  var tabs = document.querySelectorAll('[data-tab]');
  tabs.forEach(function (b) {
    b.addEventListener('click', function () {
      tabs.forEach(function (t) { t.removeAttribute('aria-current'); });
      b.setAttribute('aria-current', 'page');
      document.querySelectorAll('.tab').forEach(function (p) { p.classList.remove('is-active'); });
      $('tab-' + b.getAttribute('data-tab')).classList.add('is-active');
    });
  });
  $('logout').addEventListener('click', function () { auth.logout(); location.href = 'index.html'; });

  // ---------- Quotes ----------
  function readQuotes() { try { var a = JSON.parse(localStorage.getItem(QUOTES_KEY) || '[]'); return Array.isArray(a) ? a : []; } catch (e) { return []; } }
  function writeQuotes(a) { localStorage.setItem(QUOTES_KEY, JSON.stringify(a)); }
  var STATUSES = ['new', 'progress', 'done'];
  function renderQuotes() {
    var box = $('q-list'); box.textContent = '';
    var qs = readQuotes();
    if (!qs.length) { box.appendChild(h('p', 'empty', i18n.t('q_empty'))); return; }
    qs.forEach(function (q) {
      var card = h('article', 'item');
      var head = h('div', 'item__head');
      head.appendChild(h('strong', null, q.name || ''));
      head.appendChild(h('span', 'muted', new Date(q.date).toLocaleString(i18n.get() === 'ru' ? 'ru-RU' : 'en-GB')));
      card.appendChild(head);
      var meta = h('p', 'item__meta');
      meta.textContent = [q.email, q.company, q.country].filter(Boolean).join(' · ');
      card.appendChild(meta);
      if (q.product) card.appendChild(h('p', 'item__meta', i18n.t('q_product') + ': ' + q.product));
      card.appendChild(h('p', 'item__body', q.message || ''));
      var foot = h('div', 'item__foot');
      foot.appendChild(h('span', q.sent ? 'pill pill--ok' : 'pill pill--warn', i18n.t(q.sent ? 'q_sent' : 'q_notsent')));
      var sel = h('select', 'sel'); sel.setAttribute('aria-label', i18n.t('q_status'));
      STATUSES.forEach(function (s) { var o = h('option', null, i18n.t('q_' + s)); o.value = s; sel.appendChild(o); });
      sel.value = q.status || 'new';
      sel.addEventListener('change', function () {
        var all = readQuotes(); all.forEach(function (x) { if (x.id === q.id) x.status = sel.value; }); writeQuotes(all);
      });
      foot.appendChild(sel);
      var del = h('button', 'btn btn--sm btn--danger', i18n.t('q_delete')); del.type = 'button';
      del.addEventListener('click', function () {
        if (!confirm(i18n.t('q_confirm'))) return;
        writeQuotes(readQuotes().filter(function (x) { return x.id !== q.id; })); renderQuotes();
      });
      foot.appendChild(del);
      card.appendChild(foot);
      box.appendChild(card);
    });
  }
  function csvCell(v) {
    v = v == null ? '' : String(v);
    if (/^[=+\-@\t\r]/.test(v)) v = "'" + v; // neutralise spreadsheet formula injection
    return '"' + v.replace(/"/g, '""') + '"';
  }
  $('q-csv').addEventListener('click', function () {
    var cols = ['date', 'status', 'name', 'email', 'company', 'country', 'product', 'message', 'sent', 'language', 'id'];
    var rows = [cols.map(csvCell).join(',')].concat(readQuotes().map(function (q) { return cols.map(function (c) { return csvCell(q[c]); }).join(','); }));
    download('quote-requests.csv', '\ufeff' + rows.join('\r\n'), 'text/csv;charset=utf-8');
  });
  $('q-json').addEventListener('click', function () {
    download('quote-requests.json', JSON.stringify(readQuotes(), null, 2), 'application/json');
  });

  // ---------- Products ----------
  var products = [];
  var catSel = $('p-cat');
  function fillCats() {
    var prev = catSel.value; catSel.textContent = '';
    D.CATEGORIES.forEach(function (c) { var o = h('option', null, i18n.t('cat_' + c)); o.value = c; catSel.appendChild(o); });
    if (prev) catSel.value = prev;
  }
  function saveProducts() { D.saveOverride('products', products); }
  function renderProducts() {
    var box = $('p-list'); box.textContent = '';
    if (!products.length) { box.appendChild(h('p', 'empty', i18n.t('p_empty'))); return; }
    products.forEach(function (p) {
      var row = h('article', 'item item--row');
      var info = h('div', 'item__info');
      info.appendChild(h('strong', null, L(p.name)));
      info.appendChild(h('span', 'pill', i18n.t('cat_' + p.category)));
      if (L(p.tag)) info.appendChild(h('span', 'pill pill--ok', L(p.tag)));
      info.appendChild(h('p', 'item__meta', L(p.description)));
      row.appendChild(info);
      var acts = h('div', 'btnrow');
      var ed = h('button', 'btn btn--sm btn--light', i18n.t('p_edit')); ed.type = 'button';
      ed.addEventListener('click', function () { openForm(p); });
      var del = h('button', 'btn btn--sm btn--danger', i18n.t('p_delete')); del.type = 'button';
      del.addEventListener('click', function () {
        if (!confirm(i18n.t('p_confirm'))) return;
        products = products.filter(function (x) { return x.id !== p.id; }); saveProducts(); renderProducts(); toast('saved');
      });
      acts.appendChild(ed); acts.appendChild(del); row.appendChild(acts);
      box.appendChild(row);
    });
  }
  var pform = $('p-form');
  function openForm(p) {
    pform.hidden = false; $('p-err').textContent = '';
    $('p-form-title').setAttribute('data-i18n', p ? 'p_form_edit' : 'p_form_add');
    $('p-form-title').textContent = i18n.t(p ? 'p_form_edit' : 'p_form_add');
    $('p-id').value = p ? p.id : '';
    catSel.value = p ? p.category : D.CATEGORIES[0];
    $('p-name-ru').value = p ? (p.name.ru || '') : ''; $('p-name-en').value = p ? (p.name.en || '') : '';
    $('p-desc-ru').value = p ? ((p.description || {}).ru || '') : ''; $('p-desc-en').value = p ? ((p.description || {}).en || '') : '';
    $('p-tag-ru').value = p ? ((p.tag || {}).ru || '') : ''; $('p-tag-en').value = p ? ((p.tag || {}).en || '') : '';
    pform.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); $('p-name-ru').focus();
  }
  $('p-add').addEventListener('click', function () { openForm(null); });
  $('p-cancel').addEventListener('click', function () { pform.hidden = true; });
  pform.addEventListener('submit', function (e) {
    e.preventDefault();
    var nr = $('p-name-ru').value.trim(), ne = $('p-name-en').value.trim();
    if ((!nr && !ne) || !catSel.value) { $('p-err').textContent = i18n.t('p_err'); return; }
    var obj = {
      id: $('p-id').value || ('p' + Date.now().toString(36)),
      category: catSel.value,
      name: { ru: nr || ne, en: ne || nr },
      description: { ru: $('p-desc-ru').value.trim(), en: $('p-desc-en').value.trim() },
      tag: { ru: $('p-tag-ru').value.trim(), en: $('p-tag-en').value.trim() }
    };
    var i = products.findIndex(function (x) { return x.id === obj.id; });
    if (i >= 0) products[i] = obj; else products.push(obj);
    saveProducts(); pform.hidden = true; renderProducts(); toast('saved');
  });
  $('p-export').addEventListener('click', function () {
    download('products.json', JSON.stringify(products, null, 2) + '\n', 'application/json');
  });
  $('p-reset').addEventListener('click', function () {
    if (!confirm(i18n.t('p_reset_confirm'))) return;
    D.clearOverride('products');
    D.publishedProducts().then(function (p) { products = p; renderProducts(); pform.hidden = true; toast('reset_done'); });
  });

  // ---------- Settings ----------
  var settings = null;
  function testiRow(t) {
    t = t || { example: true, quote: { ru: '', en: '' }, author: { ru: '', en: '' } };
    var row = h('div', 'trow');
    function field(key, labelKey, val, area) {
      var wrap = h('div', 'field'); var lab = h('label', null, i18n.t(labelKey)); lab.setAttribute('data-i18n', labelKey);
      var inp = h(area ? 'textarea' : 'input'); if (area) inp.rows = 2; else inp.type = 'text';
      inp.value = val || ''; inp.setAttribute('data-k', key);
      var id = 'tf-' + Math.random().toString(36).slice(2, 8); inp.id = id; lab.htmlFor = id;
      wrap.appendChild(lab); wrap.appendChild(inp); return wrap;
    }
    var r1 = h('div', 'row2'); r1.appendChild(field('quote_ru', 's_t_quote_ru', t.quote && t.quote.ru, true)); r1.appendChild(field('quote_en', 's_t_quote_en', t.quote && t.quote.en, true));
    var r2 = h('div', 'row2'); r2.appendChild(field('author_ru', 's_t_author_ru', t.author && t.author.ru)); r2.appendChild(field('author_en', 's_t_author_en', t.author && t.author.en));
    row.appendChild(r1); row.appendChild(r2);
    var cl = h('label', 'check'); var cb = document.createElement('input'); cb.type = 'checkbox'; cb.checked = !!t.example; cb.setAttribute('data-k', 'example');
    var sp = h('span', null, i18n.t('s_t_example')); sp.setAttribute('data-i18n', 's_t_example'); cl.appendChild(cb); cl.appendChild(sp); row.appendChild(cl);
    var rm = h('button', 'btn btn--sm btn--danger', i18n.t('s_t_remove')); rm.type = 'button'; rm.setAttribute('data-i18n', 's_t_remove');
    rm.addEventListener('click', function () { row.remove(); });
    row.appendChild(rm);
    return row;
  }
  function fillSettings(s) {
    settings = s || {};
    $('s-email').value = settings.email || ''; $('s-phone').value = settings.phone || ''; $('s-tg').value = settings.telegram || '';
    var a = settings.address || {}, hero = settings.hero || {}, ht = hero.title || {}, hs = hero.subtitle || {};
    $('s-addr-ru').value = a.ru || ''; $('s-addr-en').value = a.en || '';
    $('s-ht-ru').value = ht.ru || ''; $('s-ht-en').value = ht.en || '';
    $('s-hs-ru').value = hs.ru || ''; $('s-hs-en').value = hs.en || '';
    var box = $('s-testi'); box.textContent = '';
    (settings.testimonials || []).forEach(function (t) { box.appendChild(testiRow(t)); });
  }
  function collectSettings() {
    var testimonials = [];
    document.querySelectorAll('#s-testi .trow').forEach(function (row) {
      var g = function (k) { return row.querySelector('[data-k="' + k + '"]'); };
      var o = { example: g('example').checked, quote: { ru: g('quote_ru').value.trim(), en: g('quote_en').value.trim() }, author: { ru: g('author_ru').value.trim(), en: g('author_en').value.trim() } };
      if (o.quote.ru || o.quote.en) testimonials.push(o);
    });
    return {
      email: $('s-email').value.trim(), phone: $('s-phone').value.trim(), telegram: $('s-tg').value.trim(),
      address: { ru: $('s-addr-ru').value.trim(), en: $('s-addr-en').value.trim() },
      hero: { title: { ru: $('s-ht-ru').value.trim(), en: $('s-ht-en').value.trim() }, subtitle: { ru: $('s-hs-ru').value.trim(), en: $('s-hs-en').value.trim() } },
      testimonials: testimonials
    };
  }
  function trySave() {
    var s = collectSettings();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.email) || (s.telegram && !/^https:\/\/t\.me\/[A-Za-z0-9_]{3,}$/.test(s.telegram))) { $('s-err').textContent = i18n.t('s_err'); return null; }
    $('s-err').textContent = ''; D.saveOverride('settings', s); settings = s; return s;
  }
  $('s-form').addEventListener('submit', function (e) { e.preventDefault(); if (trySave()) toast('saved'); });
  $('s-t-add').addEventListener('click', function () { $('s-testi').appendChild(testiRow()); });
  $('s-export').addEventListener('click', function () {
    var s = trySave(); if (!s) return;
    download('settings.json', JSON.stringify(s, null, 2) + '\n', 'application/json');
  });
  $('s-reset').addEventListener('click', function () {
    if (!confirm(i18n.t('p_reset_confirm'))) return;
    D.clearOverride('settings');
    D.publishedSettings().then(function (s) { fillSettings(s); toast('reset_done'); });
  });

  // ---------- Init ----------
  document.addEventListener('langchange', function () { fillCats(); renderQuotes(); renderProducts(); });
  fillCats(); renderQuotes();
  D.products().then(function (p) { products = Array.isArray(p) ? p : []; renderProducts(); });
  D.settings().then(fillSettings);
})();
