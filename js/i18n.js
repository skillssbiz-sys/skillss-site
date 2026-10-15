/* Shared RU/EN dictionary and language switcher (public site + admin).
   Static text: data-i18n (textContent), data-i18n-aria, data-i18n-placeholder.
   Dynamic content (products, settings, testimonials) is rendered by JS using SkillssI18n.t / .get. */
(function () {
  'use strict';
  var DICT = {
    ru: {
      skip: 'Перейти к содержимому', menuToggle: 'Меню',
      nav_about: 'О нас', nav_products: 'Продукция', nav_why: 'Почему мы', nav_how: 'Как это работает', nav_contact: 'Контакты',
      cta_quote: 'Запросить предложение', cta_products: 'Смотреть продукцию',
      hero_eyebrow: 'Экспорт медицинского оборудования',
      about_eyebrow: 'О нас', about_title: 'Мост между производителями и покупателями',
      about_p1: 'Skillss занимается экспортом медицинского оборудования и расходных материалов. Мы подбираем продукцию под задачи заказчика, координируем документы и организуем доставку.',
      about_p2: 'Наша цель — сделать процесс закупки простым, прозрачным и предсказуемым для партнёров в разных странах.',
      products_eyebrow: 'Продукция', products_title: 'Категории оборудования',
      products_sub: 'Примеры направлений. Конкретный ассортимент уточняется по запросу.',
      cat_all: 'Все', cat_diagnostic: 'Диагностика', cat_surgical: 'Хирургия', cat_consumables: 'Расходные материалы', cat_laboratory: 'Лаборатория', cat_imaging: 'Визуализация',
      card_ask: 'Запросить →', products_empty: 'В этой категории пока нет позиций.',
      why_eyebrow: 'Почему мы', why_title: 'Что вы получаете, работая с Skillss',
      w1_title: 'Тщательный подбор', w1_text: 'Внимательный выбор поставщиков и продукции под ваши требования.',
      w2_title: 'Поддержка с документами', w2_text: 'Помощь в подготовке и оформлении сопроводительной документации.',
      w3_title: 'Логистика', w3_text: 'Организация упаковки и доставки до согласованного пункта назначения.',
      w4_title: 'Быстрая связь', w4_text: 'Понятная и оперативная коммуникация на русском и английском языках.',
      how_eyebrow: 'Как это работает', how_title: 'Четыре простых шага',
      s1_title: 'Запрос', s1_text: 'Вы описываете, какая продукция вам нужна.',
      s2_title: 'Предложение', s2_text: 'Мы готовим коммерческое предложение.',
      s3_title: 'Документы и договор', s3_text: 'Согласуем документы и условия договора.',
      s4_title: 'Отгрузка', s4_text: 'Организуем упаковку и доставку.',
      test_eyebrow: 'Отзывы', test_title: 'Отзывы клиентов', example_label: 'пример – будет заменён',
      contact_eyebrow: 'Контакты', contact_title: 'Запросить коммерческое предложение',
      contact_text: 'Заполните форму, и мы свяжемся с вами. Или напишите нам напрямую:',
      tg_btn: 'Написать в Telegram', tg_footer: 'Telegram-бот', lbl_email: 'Email', lbl_phone: 'Телефон', lbl_address: 'Адрес',
      f_name: 'Имя', f_email: 'Email', f_company: 'Компания', f_country: 'Страна', f_product: 'Интересующая продукция',
      f_message: 'Сообщение', f_submit: 'Отправить запрос', f_sending: 'Отправка…',
      opt_choose: 'Выберите продукцию', opt_other: 'Другое',
      err_required: 'Обязательное поле', err_email: 'Введите корректный email',
      f_success: 'Спасибо! Ваш запрос отправлен. Мы свяжемся с вами по указанному email.',
      f_error: 'Не удалось отправить запрос. Попробуйте ещё раз или напишите нам напрямую:',
      f_mailto: 'Написать по email',
      preview_badge: 'Режим предпросмотра: показаны локальные изменения из админ-панели.', preview_reset: 'Сбросить',
      footer_rights: 'Все права защищены.', footer_admin: 'Вход для администратора',
      data_error: 'Не удалось загрузить данные.'
    },
    en: {
      skip: 'Skip to content', menuToggle: 'Menu',
      nav_about: 'About', nav_products: 'Products', nav_why: 'Why Us', nav_how: 'How it works', nav_contact: 'Contact',
      cta_quote: 'Request a quote', cta_products: 'View products',
      hero_eyebrow: 'Medical equipment export',
      about_eyebrow: 'About', about_title: 'A bridge between manufacturers and buyers',
      about_p1: 'Skillss exports medical equipment and consumables. We match products to the customer\u2019s needs, coordinate documentation and arrange delivery.',
      about_p2: 'Our goal is to make purchasing simple, transparent and predictable for partners in different countries.',
      products_eyebrow: 'Products', products_title: 'Equipment categories',
      products_sub: 'Example product areas. The exact range is confirmed on request.',
      cat_all: 'All', cat_diagnostic: 'Diagnostic', cat_surgical: 'Surgical', cat_consumables: 'Consumables', cat_laboratory: 'Laboratory', cat_imaging: 'Imaging',
      card_ask: 'Enquire \u2192', products_empty: 'No items in this category yet.',
      why_eyebrow: 'Why Us', why_title: 'What you get when working with Skillss',
      w1_title: 'Careful sourcing', w1_text: 'Attentive selection of suppliers and products to match your requirements.',
      w2_title: 'Documentation support', w2_text: 'Help preparing and arranging the accompanying documents.',
      w3_title: 'Logistics', w3_text: 'Packing and delivery arranged to the agreed destination.',
      w4_title: 'Responsive communication', w4_text: 'Clear, prompt communication in Russian and English.',
      how_eyebrow: 'How it works', how_title: 'Four simple steps',
      s1_title: 'Inquiry', s1_text: 'You describe the products you need.',
      s2_title: 'Quote', s2_text: 'We prepare a commercial offer.',
      s3_title: 'Documentation & contract', s3_text: 'We agree on documents and contract terms.',
      s4_title: 'Shipment', s4_text: 'We arrange packing and delivery.',
      test_eyebrow: 'Testimonials', test_title: 'What customers say', example_label: 'example \u2013 to be replaced',
      contact_eyebrow: 'Contact', contact_title: 'Request a quote',
      contact_text: 'Fill in the form and we will get back to you. Or email us directly:',
      tg_btn: 'Message on Telegram', tg_footer: 'Telegram bot', lbl_email: 'Email', lbl_phone: 'Phone', lbl_address: 'Address',
      f_name: 'Name', f_email: 'Email', f_company: 'Company', f_country: 'Country', f_product: 'Product of interest',
      f_message: 'Message', f_submit: 'Send request', f_sending: 'Sending\u2026',
      opt_choose: 'Choose a product', opt_other: 'Other',
      err_required: 'This field is required', err_email: 'Enter a valid email address',
      f_success: 'Thank you! Your request has been sent. We will reply to the email you provided.',
      f_error: 'Could not send your request. Please try again or email us directly:',
      f_mailto: 'Email us',
      preview_badge: 'Preview mode: showing local changes from the admin panel.', preview_reset: 'Reset',
      footer_rights: 'All rights reserved.', footer_admin: 'Admin login',
      data_error: 'Could not load data.'
    }
  };

  var KEY = 'skillss-lang';
  function get() {
    var l = null;
    try { l = localStorage.getItem(KEY); } catch (e) {}
    return DICT[l] ? l : 'ru';
  }
  function t(key) { var l = get(); return (DICT[l] && DICT[l][key]) || (DICT.en[key]) || key; }
  function extend(ru, en) {
    Object.keys(ru).forEach(function (k) { DICT.ru[k] = ru[k]; });
    Object.keys(en).forEach(function (k) { DICT.en[k] = en[k]; });
  }

  function apply(lang) {
    if (!DICT[lang]) lang = 'ru';
    try { localStorage.setItem(KEY, lang); } catch (e) {}
    document.documentElement.lang = lang;
    var d = DICT[lang];
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var k = el.getAttribute('data-i18n'); if (d[k] != null) el.textContent = d[k];
    });
    document.querySelectorAll('[data-i18n-aria]').forEach(function (el) {
      var k = el.getAttribute('data-i18n-aria'); if (d[k] != null) el.setAttribute('aria-label', d[k]);
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
      var k = el.getAttribute('data-i18n-placeholder'); if (d[k] != null) el.setAttribute('placeholder', d[k]);
    });
    document.querySelectorAll('.lang__btn').forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.getAttribute('data-lang') === lang));
    });
    document.dispatchEvent(new CustomEvent('langchange', { detail: lang }));
  }

  window.SkillssI18n = { t: t, apply: apply, get: get, extend: extend };

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.lang__btn').forEach(function (b) {
      b.addEventListener('click', function () { apply(b.getAttribute('data-lang')); });
    });
    apply(get());
  });
})();
