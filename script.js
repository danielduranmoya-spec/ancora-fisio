/* =========================================================
   ÁNCORA Fisioterapia · script
   Todo lo editable está en CONFIG y ZONAS (al principio).
   ========================================================= */
(function () {
  'use strict';

  /* ---------- Datos editables ---------- */
  var CONFIG = {
    telefono: '+34600000000',          // para los enlaces tel:
    telefonoVisible: '600 000 000',    // como se muestra en la web
    whatsapp: '34600000000',           // número para wa.me, sin + ni espacios
    mensaje: 'Hola, quiero pedir una primera valoración en ÁNCORA Fisioterapia.',
    zonaHoraria: 'Europe/Madrid',
    // 0 = domingo, 1 = lunes … 6 = sábado. Tramos 'HH:MM'.
    horario: {
      0: [],
      1: [['08:00', '14:00'], ['16:00', '21:00']],
      2: [['08:00', '14:00'], ['16:00', '21:00']],
      3: [['08:00', '14:00'], ['16:00', '21:00']],
      4: [['08:00', '14:00'], ['16:00', '21:00']],
      5: [['08:00', '14:00'], ['16:00', '21:00']],
      6: [['09:00', '13:00']]
    },
    mapa: 'https://www.openstreetmap.org/export/embed.html?bbox=-6.3520%2C38.9145%2C-6.3400%2C38.9205&layer=mapnik&marker=38.9175%2C-6.3460',
    claveConsentimiento: 'ancora-consent'
  };

  var ORDEN = ['cervical', 'hombro', 'lumbar', 'rodilla', 'tobillo'];

  var ZONAS = {
    cervical: {
      nombre: 'Cervical',
      motivo: 'dolor cervical',
      cta: 'Pedir valoración cervical',
      nota: '',
      lead: 'Cuello cargado, rigidez al girar la cabeza o dolores de cabeza que empiezan en la nuca. Casi siempre tiene que ver con cómo trabajas y duermes, y se puede cambiar.',
      sesion: '50 min',
      sesiones: '4–6',
      vemos: ['Cervicalgia y rigidez de cuello', 'Dolor de cabeza tensional', 'Latigazo cervical tras un accidente'],
      tratamos: ['Terapia manual y movilización suave', 'Punción seca solo si está indicada', 'Ejercicios de control para hacer en casa']
    },
    hombro: {
      nombre: 'Hombro',
      motivo: 'dolor de hombro',
      cta: 'Pedir valoración de hombro',
      nota: '',
      lead: 'Dolor al levantar el brazo, al dormir de lado o al ponerte una chaqueta. El tendón necesita carga bien dosificada, no reposo absoluto.',
      sesion: '50 min',
      sesiones: '6–8',
      vemos: ['Tendinopatía del manguito rotador', 'Hombro congelado (capsulitis)', 'Recuperación tras luxación o cirugía'],
      tratamos: ['Ejercicio de fuerza progresivo', 'Terapia manual para ganar movilidad', 'Pautas para dormir y trabajar sin dolor']
    },
    lumbar: {
      nombre: 'Lumbar',
      motivo: 'dolor lumbar',
      cta: 'Pedir valoración lumbar',
      nota: 'La consulta más frecuente',
      lead: 'El dolor de espalda baja casi nunca es «una vértebra fuera de sitio». Buscamos qué lo provoca y te damos herramientas para que no vuelva.',
      sesion: '50 min',
      sesiones: '4–8',
      vemos: ['Lumbalgia aguda o que se repite', 'Ciática y dolor que baja por la pierna', 'Hernia o protrusión discal'],
      tratamos: ['Explicación clara de qué te pasa', 'Terapia manual para bajar el dolor', 'Ejercicio progresivo para casa y trabajo']
    },
    rodilla: {
      nombre: 'Rodilla',
      motivo: 'dolor de rodilla',
      cta: 'Pedir valoración de rodilla',
      nota: '',
      lead: 'Dolor al subir escaleras, al correr o después de una operación de ligamento. Recuperamos fuerza con pruebas medibles antes de darte el alta.',
      sesion: '50 min',
      sesiones: '8–12',
      vemos: ['Dolor en la parte delantera de la rodilla', 'Tendinopatía rotuliana', 'Readaptación tras cirugía de ligamento cruzado'],
      tratamos: ['Fuerza guiada con cargas medidas', 'Pruebas de salto y equilibrio', 'Plan de vuelta al deporte por fases']
    },
    tobillo: {
      nombre: 'Tobillo y pie',
      motivo: 'dolor de tobillo o pie',
      cta: 'Pedir valoración de tobillo',
      nota: '',
      lead: 'Esguinces que no terminan de curar, dolor en el talón al levantarte o molestias en el tendón de Aquiles. Volvemos a darle estabilidad al apoyo.',
      sesion: '50 min',
      sesiones: '3–6',
      vemos: ['Esguince de tobillo y tobillo inestable', 'Fascitis plantar', 'Tendinopatía de Aquiles'],
      tratamos: ['Ejercicio de equilibrio y fuerza', 'Terapia manual del pie y el tobillo', 'Consejo de calzado y vuelta a correr']
    }
  };

  var PRECIO = { sesion: '42 €', bono: '34 € con bono 10' };

  /* ---------- Utilidades ---------- */
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }

  function waLink(msg) {
    return 'https://wa.me/' + CONFIG.whatsapp + '?text=' + encodeURIComponent(msg || CONFIG.mensaje);
  }

  function storageGet(key) {
    try { return window.localStorage.getItem(key); } catch (e) { return null; }
  }
  function storageSet(key, value) {
    try { window.localStorage.setItem(key, value); } catch (e) { /* sin almacenamiento: no pasa nada */ }
  }

  /* ---------- Enlaces de contacto ---------- */
  function applyContactLinks(ctx) {
    $$('[data-wa]', ctx).forEach(function (a) {
      a.href = waLink(a.getAttribute('data-wa-msg'));
      a.target = '_blank';
      a.rel = 'noopener';
    });
    $$('[data-tel]', ctx).forEach(function (a) { a.href = 'tel:' + CONFIG.telefono; });
    $$('[data-tel-text]', ctx).forEach(function (el) { el.textContent = CONFIG.telefonoVisible; });
  }

  /* ---------- Mapa del cuerpo ---------- */
  function zoneMarkup(key) {
    var z = ZONAS[key];
    var n = ORDEN.indexOf(key) + 1;
    var num = (n < 10 ? '0' : '') + n;
    var li = function (t) { return '<li>' + t + '</li>'; };
    var msg = 'Hola, quiero pedir una valoración por ' + z.motivo + ' en ÁNCORA Fisioterapia.';
    return '' +
      '<div class="zone-panel__top">' +
        '<p class="mono">Zona ' + num + ' / 0' + ORDEN.length + '</p>' +
        (z.nota ? '<p class="tag">' + z.nota + '</p>' : '') +
      '</div>' +
      '<h3 class="zone-panel__title">' + z.nombre + '</h3>' +
      '<p class="zone-panel__lead">' + z.lead + '</p>' +
      '<dl class="zone-facts">' +
        '<div><dt>Sesión</dt><dd>' + z.sesion + '</dd></div>' +
        '<div><dt>Sesiones habituales</dt><dd>' + z.sesiones + '</dd></div>' +
        '<div><dt>Precio</dt><dd>' + PRECIO.sesion + '<small>' + PRECIO.bono + '</small></dd></div>' +
      '</dl>' +
      '<div class="zone-lists">' +
        '<div><h4 class="mono">Lo que solemos ver</h4><ul>' + z.vemos.map(li).join('') + '</ul></div>' +
        '<div><h4 class="mono">Cómo lo tratamos</h4><ul>' + z.tratamos.map(li).join('') + '</ul></div>' +
      '</div>' +
      '<a class="btn btn--primary" data-wa data-wa-msg="' + msg + '" href="' + waLink(msg) + '">' + z.cta + '</a>';
  }

  function initBodyMap() {
    var map = $('[data-body-map]');
    var panel = $('[data-zone-panel]');
    var inner = $('[data-zone-inner]');
    var chipsWrap = $('[data-zone-chips]');
    if (!map || !panel || !inner || !chipsWrap) return;

    var chips = $$('.chip', chipsWrap);
    var hotspots = $$('.hotspot', map);
    var current = map.getAttribute('data-active') || 'lumbar';
    var timer = null;

    function mark(key) {
      chips.forEach(function (c) { c.setAttribute('aria-pressed', String(c.getAttribute('data-zone') === key)); });
      hotspots.forEach(function (h) { h.classList.toggle('is-active', h.getAttribute('data-zone') === key); });
      map.setAttribute('data-active', key);
    }

    function swap(key) {
      inner.innerHTML = zoneMarkup(key);
      applyContactLinks(inner);
    }

    function select(key) {
      if (!ZONAS[key] || key === current) return;
      current = key;
      mark(key);
      if (reduceMotion) { swap(key); return; }
      clearTimeout(timer);
      panel.classList.remove('is-entering');
      panel.classList.add('is-leaving');
      timer = setTimeout(function () {
        swap(key);
        panel.classList.remove('is-leaving');
        void panel.offsetWidth; // reinicia la animación de entrada
        panel.classList.add('is-entering');
      }, 150);
    }

    chips.forEach(function (c) {
      c.addEventListener('click', function () { select(c.getAttribute('data-zone')); });
    });
    hotspots.forEach(function (h) {
      h.addEventListener('click', function () { select(h.getAttribute('data-zone')); });
    });

    // Flechas, Inicio y Fin para moverse entre zonas con el teclado
    chipsWrap.addEventListener('keydown', function (e) {
      var i = chips.indexOf(document.activeElement);
      if (i === -1) return;
      var next = null;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = (i + 1) % chips.length;
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = (i - 1 + chips.length) % chips.length;
      else if (e.key === 'Home') next = 0;
      else if (e.key === 'End') next = chips.length - 1;
      if (next === null) return;
      e.preventDefault();
      chips[next].focus();
      select(chips[next].getAttribute('data-zone'));
    });

    mark(current);
    swap(current);
  }

  /* ---------- Horario: abierto ahora ---------- */
  function toMin(hhmm) {
    var p = hhmm.split(':');
    return parseInt(p[0], 10) * 60 + parseInt(p[1], 10);
  }
  function fmt(hhmm) {
    var p = hhmm.split(':');
    return parseInt(p[0], 10) + ':' + p[1];
  }
  var DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];

  function nowInClinic() {
    try {
      var parts = new Intl.DateTimeFormat('en-GB', {
        timeZone: CONFIG.zonaHoraria,
        weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23'
      }).formatToParts(new Date());
      var get = function (t) { for (var i = 0; i < parts.length; i++) if (parts[i].type === t) return parts[i].value; return ''; };
      var day = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }[get('weekday')];
      return { day: day, mins: parseInt(get('hour'), 10) * 60 + parseInt(get('minute'), 10) };
    } catch (e) {
      var d = new Date();
      return { day: d.getDay(), mins: d.getHours() * 60 + d.getMinutes() };
    }
  }

  function hoursStatus(now) {
    var today = CONFIG.horario[now.day] || [];
    for (var i = 0; i < today.length; i++) {
      var s = toMin(today[i][0]), e = toMin(today[i][1]);
      if (now.mins >= s && now.mins < e) {
        return { open: true, text: 'Abierto ahora · cierra a las ' + fmt(today[i][1]) };
      }
    }
    for (var j = 0; j < today.length; j++) {
      if (toMin(today[j][0]) > now.mins) {
        return { open: false, text: 'Cerrado · abre hoy a las ' + fmt(today[j][0]) };
      }
    }
    for (var k = 1; k <= 7; k++) {
      var d = (now.day + k) % 7;
      var tramos = CONFIG.horario[d] || [];
      if (tramos.length) {
        var cuando = k === 1 ? 'mañana' : 'el ' + DIAS[d];
        return { open: false, text: 'Cerrado · abre ' + cuando + ' a las ' + fmt(tramos[0][0]) };
      }
    }
    return { open: false, text: 'Cerrado' };
  }

  function initHours() {
    var status = $('[data-status]');
    var text = $('[data-status-text]');
    if (!status || !text) return;
    function update() {
      var now = nowInClinic();
      var st = hoursStatus(now);
      status.setAttribute('data-state', st.open ? 'open' : 'closed');
      text.textContent = st.text;
      $$('.hours tr[data-days]').forEach(function (tr) {
        var days = tr.getAttribute('data-days').split(',').map(Number);
        tr.classList.toggle('is-today', days.indexOf(now.day) !== -1);
      });
    }
    update();
    setInterval(update, 60 * 1000);
  }

  /* ---------- Consentimiento y mapa ---------- */
  function loadMap() {
    var box = $('[data-map]');
    if (!box || box.querySelector('iframe')) return;
    var iframe = document.createElement('iframe');
    iframe.src = CONFIG.mapa;
    iframe.title = 'Mapa con la ubicación de ÁNCORA Fisioterapia en Mérida';
    iframe.loading = 'lazy';
    iframe.referrerPolicy = 'no-referrer';
    box.appendChild(iframe);
    var ph = $('[data-map-placeholder]');
    if (ph) ph.hidden = true;
  }
  function unloadMap() {
    var box = $('[data-map]');
    if (!box) return;
    var iframe = box.querySelector('iframe');
    if (iframe) iframe.remove();
    var ph = $('[data-map-placeholder]');
    if (ph) ph.hidden = false;
  }

  function initConsent() {
    var banner = $('[data-cookie-banner]');
    var mobileCta = $('[data-mobile-cta]');
    var stored = storageGet(CONFIG.claveConsentimiento);

    function setCtaBlocked(blocked) {
      if (mobileCta) mobileCta.classList.toggle('is-blocked', blocked);
      document.dispatchEvent(new CustomEvent('ancora:cta'));
    }

    function hide() {
      if (!banner || banner.hidden) return;
      if (reduceMotion) { banner.hidden = true; setCtaBlocked(false); return; }
      banner.classList.add('is-leaving');
      setTimeout(function () {
        banner.hidden = true;
        banner.classList.remove('is-leaving');
        setCtaBlocked(false);
      }, 180);
    }
    function show() {
      if (!banner) return;
      banner.hidden = false;
      setCtaBlocked(true);
    }

    if (stored === 'accepted') loadMap();
    if (!stored) show();

    $$('[data-consent]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var value = btn.getAttribute('data-consent');
        storageSet(CONFIG.claveConsentimiento, value);
        if (value === 'accepted') loadMap(); else unloadMap();
        hide();
      });
    });
    $$('[data-open-cookies]').forEach(function (btn) {
      btn.addEventListener('click', show);
    });
    var loadBtn = $('[data-map-load]');
    if (loadBtn) loadBtn.addEventListener('click', loadMap);
  }

  /* ---------- Cabecera y CTA móvil ---------- */
  function initHeader() {
    var header = $('[data-header]');
    if (!header) return;
    var ticking = false;
    function update() {
      header.classList.toggle('is-scrolled', window.scrollY > 8);
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; window.requestAnimationFrame(update); }
    }, { passive: true });
    update();
  }

  function initMobileCta() {
    var cta = $('[data-mobile-cta]');
    var hero = $('[data-hero]');
    var contact = $('[data-contact]');
    if (!cta || !hero || !('IntersectionObserver' in window)) return;
    var heroVisible = true;
    var contactVisible = false;
    function update() {
      var show = !heroVisible && !contactVisible && !cta.classList.contains('is-blocked');
      cta.classList.toggle('is-visible', show);
    }
    new IntersectionObserver(function (entries) {
      heroVisible = entries[0].isIntersecting; update();
    }, { threshold: 0 }).observe(hero);
    if (contact) {
      new IntersectionObserver(function (entries) {
        contactVisible = entries[0].isIntersecting; update();
      }, { threshold: 0 }).observe(contact);
    }
    document.addEventListener('ancora:cta', update);
  }

  /* ---------- Entradas al hacer scroll ---------- */
  function initReveal() {
    var items = $$('.reveal');
    if (reduceMotion || !('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('is-in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    items.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Arranque ---------- */
  function init() {
    applyContactLinks(document);
    initBodyMap();
    initHours();
    initConsent();
    initHeader();
    initMobileCta();
    initReveal();
    $$('[data-year]').forEach(function (el) { el.textContent = String(new Date().getFullYear()); });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

  // Datos accesibles desde la consola del navegador: __ancora.config, __ancora.zonas
  window.__ancora = { config: CONFIG, zonas: ZONAS };
})();
