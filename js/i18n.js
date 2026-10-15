/* Shared RU/EN dictionary and language switcher (used by the site and the admin pages).
   Elements use data-i18n (text), data-i18n-aria (aria-label), data-i18n-placeholder. */
(function () {
  'use strict';
  var DICT = {
    ru: {
      skip: 'Перейти к содержимому', menuToggle: 'Меню',
      nav_about: 'О нас', nav_products: 'Продукция', nav_why: 'Почему мы', nav_contact: 'Контакты',
      cta_quote: 'Запросить предложение', cta_products: 'Смотреть продукцию',
      hero_eyebrow: 'Экспорт медицинского оборудования',
      hero_title: 'Надёжные поставки медицинского оборудования на международные рынки',
      hero_lead: 'Skillss помогает клиникам, дистрибьюторам и закупочным организациям получать медицинские изделия и расходные материалы — с понятной коммуникацией на каждом этапе.',
      about_eyebrow: 'О нас', about_title: 'Мост между производителями и покупателями',
      about_p1: 'Skillss занимается экспортом медицинского оборудования и расходных материалов. Мы подбираем продукцию под задачи заказчика, координируем документы и организуем доставку.',
      about_p2: 'Наша цель — сделать процесс закупки простым, прозрачным и предсказуемым для партнёров в разных странах.',
      products_eyebrow: 'Продукция', products_title: 'Категории оборудования',
      products_sub: 'Примеры направлений. Конкретный ассортимент уточняется по запросу.',
      p1_title: 'Диагностическое оборудование', p1_text: 'Устройства для диагностики и обследования пациентов.',
      p2_title: 'Хирургические инструменты', p2_text: 'Инструменты и наборы для хирургических и амбулаторных процедур.',
      p3_title: 'Расходные материалы', p3_text: 'Одноразовые изделия и материалы для ежедневной работы клиник.',
      p4_title: 'Мониторинг пациента', p4_text: 'Оборудование для наблюдения за состоянием пациентов.',
      p5_title: 'Стоматология и имплантология', p5_text: 'Материалы и принадлежности для стоматологических кабинетов.',
      p6_title: 'Нужно что-то другое?', p6_text: 'Расскажите, что вы ищете — мы постараемся подобрать подходящее решение.',
      card_ask: 'Запросить →',
      why_eyebrow: 'Почему мы', why_title: 'Что вы получаете, работая с Skillss',
      w1_title: 'Тщательный подбор', w1_text: 'Внимательный выбор поставщиков и продукции под ваши требования.',
      w2_title: 'Поддержка с документами', w2_text: 'Помощь в подготовке и оформлении сопроводительной документации.',
      w3_title: 'Логистика', w3_text: 'Организация упаковки и доставки до согласованного пункта назначения.',
      w4_title: 'Быстрая связь', w4_text: 'Понятная и оперативная коммуникация на русском и английском языках.',
      contact_eyebrow: 'Контакты', contact_title: 'Запросить коммерческое предложение',
      contact_text: 'Заполните форму, и мы свяжемся с вами. Или напишите нам напрямую:',
      f_name: 'Имя', f_email: 'Email', f_company: 'Компания', f_product: 'Интересующая продукция',
      f_message: 'Сообщение', f_submit: 'Отправить запрос',
      opt_choose: 'Выберите категорию', opt_other: 'Другое',
      err_required: 'Обязательное поле', err_email: 'Введите корректный email',
      f_success: 'Спасибо! Ваш запрос принят (демо-режим: данные пока никуда не отправляются).',
      footer_rights: 'Все права защищены.', footer_admin: 'Вход для администратора',
      /* admin */
      a_title: 'Вход для администратора', a_sub: 'Войдите, чтобы открыть панель управления.',
      a_notice: 'Это демонстрационная заглушка без реальной защиты. Для настоящей аутентификации нужен серверный бэкенд. Не вводите здесь реальные пароли.',
      a_email: 'Email', a_password: 'Пароль', a_login: 'Войти', a_back: '← На сайт',
      a_err: 'Введите email и пароль',
      d_title: 'Панель управления', d_products: 'Продукция', d_inquiries: 'Запросы', d_settings: 'Настройки',
      d_logout: 'Выйти', d_site: 'Открыть сайт', d_demo: 'Демо-режим: данные не сохраняются, защиты нет.',
      d_products_empty: 'Пока нет товаров', d_products_hint: 'Здесь позже можно будет добавлять и редактировать продукцию.',
      d_inq_empty: 'Пока нет запросов', d_inq_hint: 'Запросы клиентов появятся здесь после подключения бэкенда.',
      d_set_empty: 'Настройки пока недоступны', d_set_hint: 'Здесь появятся настройки сайта и учётной записи.',
      d_add: 'Добавить товар (скоро)'
    },
    en: {
      skip: 'Skip to content', menuToggle: 'Menu',
      nav_about: 'About', nav_products: 'Products', nav_why: 'Why Us', nav_contact: 'Contact',
      cta_quote: 'Request a quote', cta_products: 'View products',
      hero_eyebrow: 'Medical equipment export',
      hero_title: 'Reliable medical equipment supply for international markets',
      hero_lead: 'Skillss helps clinics, distributors and procurement organizations source medical devices and supplies, with clear communication at every step.',
      about_eyebrow: 'About', about_title: 'A bridge between manufacturers and buyers',
      about_p1: 'Skillss exports medical equipment and consumables. We match products to the customer\u2019s needs, coordinate documentation and arrange delivery.',
      about_p2: 'Our goal is to make purchasing simple, transparent and predictable for partners in different countries.',
      products_eyebrow: 'Products', products_title: 'Equipment categories',
      products_sub: 'Example product areas. The exact range is confirmed on request.',
      p1_title: 'Diagnostic equipment', p1_text: 'Devices for patient diagnostics and examination.',
      p2_title: 'Surgical instruments', p2_text: 'Instruments and sets for surgical and outpatient procedures.',
      p3_title: 'Consumables', p3_text: 'Single-use items and materials for everyday clinical work.',
      p4_title: 'Patient monitoring', p4_text: 'Equipment for observing patient condition.',
      p5_title: 'Dental & implant supplies', p5_text: 'Materials and accessories for dental practices.',
      p6_title: 'Need something else?', p6_text: 'Tell us what you are looking for and we will try to find a suitable solution.',
      card_ask: 'Enquire \u2192',
      why_eyebrow: 'Why Us', why_title: 'What you get when working with Skillss',
      w1_title: 'Careful sourcing', w1_text: 'Attentive selection of suppliers and products to match your requirements.',
      w2_title: 'Documentation support', w2_text: 'Help preparing and arranging the accompanying documents.',
      w3_title: 'Logistics', w3_text: 'Packing and delivery arranged to the agreed destination.',
      w4_title: 'Responsive communication', w4_text: 'Clear, prompt communication in Russian and English.',
      contact_eyebrow: 'Contact', contact_title: 'Request a quote',
      contact_text: 'Fill in the form and we will get back to you. Or email us directly:',
      f_name: 'Name', f_email: 'Email', f_company: 'Company', f_product: 'Product interest',
      f_message: 'Message', f_submit: 'Send request',
      opt_choose: 'Choose a category', opt_other: 'Other',
      err_required: 'This field is required', err_email: 'Enter a valid email address',
      f_success: 'Thank you! Your request was received (demo mode: nothing is sent anywhere yet).',
      footer_rights: 'All rights reserved.', footer_admin: 'Admin login',
      a_title: 'Admin login', a_sub: 'Sign in to open the dashboard.',
      a_notice: 'This is a demo placeholder with no real security. Real authentication requires a backend. Do not enter real passwords here.',
      a_email: 'Email', a_password: 'Password', a_login: 'Sign in', a_back: '← Back to site',
      a_err: 'Enter an email and a password',
      d_title: 'Dashboard', d_products: 'Products', d_inquiries: 'Inquiries', d_settings: 'Settings',
      d_logout: 'Log out', d_site: 'View site', d_demo: 'Demo mode: data is not saved and there is no security.',
      d_products_empty: 'No products yet', d_products_hint: 'You will be able to add and edit products here later.',
      d_inq_empty: 'No inquiries yet', d_inq_hint: 'Customer inquiries will appear here once a backend is connected.',
      d_set_empty: 'Settings are not available yet', d_set_hint: 'Site and account settings will appear here.',
      d_add: 'Add product (coming soon)'
    }
  };

  var KEY = 'skillss-lang';
  function get() {
    var l = null;
    try { l = localStorage.getItem(KEY); } catch (e) {}
    return DICT[l] ? l : 'ru';
  }
  function t(key) { var l = get(); return (DICT[l] && DICT[l][key]) || key; }

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

  window.SkillssI18n = { t: t, apply: apply, get: get };

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.lang__btn').forEach(function (b) {
      b.addEventListener('click', function () { apply(b.getAttribute('data-lang')); });
    });
    apply(get());
  });
})();
