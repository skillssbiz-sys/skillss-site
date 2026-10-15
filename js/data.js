/* Data layer: products and settings come from data/*.json (committed in the repo).
   The admin panel can store overrides in this browser's localStorage (preview only);
   when an override exists, the public site on the same browser uses it. */
(function () {
  'use strict';
  var base = new URL('../data/', document.currentScript.src).href;
  var KEYS = { products: 'skillss_products_override', settings: 'skillss_settings_override' };

  function readOverride(name) {
    try { var raw = localStorage.getItem(KEYS[name]); return raw ? JSON.parse(raw) : null; } catch (e) { return null; }
  }
  function fetchJson(file) {
    return fetch(base + file, { cache: 'no-store' }).then(function (r) {
      if (!r.ok) throw new Error(file + ' ' + r.status);
      return r.json();
    });
  }
  function load(name, withOverride) {
    var ov = withOverride ? readOverride(name) : null;
    if (ov) return Promise.resolve(ov);
    return fetchJson(name + '.json');
  }
  window.SkillssData = {
    KEYS: KEYS,
    // Effective data (override if present, else published JSON)
    products: function () { return load('products', true); },
    settings: function () { return load('settings', true); },
    // Published files only
    publishedProducts: function () { return load('products', false); },
    publishedSettings: function () { return load('settings', false); },
    hasOverride: function (name) { return !!readOverride(name); },
    saveOverride: function (name, value) { localStorage.setItem(KEYS[name], JSON.stringify(value)); },
    clearOverride: function (name) { localStorage.removeItem(KEYS[name]); },
    CATEGORIES: ['diagnostic', 'surgical', 'consumables', 'laboratory', 'imaging']
  };
})();
