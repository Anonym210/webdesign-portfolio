/* =========================================================================
   Envy Web — Interaktion
   Reines JavaScript, keine Bibliotheken.
   ========================================================================= */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 1. Header + Back-to-top ---------- */
  var header = document.getElementById('header');
  var totop  = document.getElementById('totop');

  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    if (header) header.classList.toggle('is-stuck', y > 40);
    if (totop)  totop.classList.toggle('is-visible', y > 800);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (totop) {
    totop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
    });
  }

  /* ---------- 2. Mobiles Menue ----------
     Ein einziger Zustandsschalter statt classList.toggle an mehreren Stellen —
     so koennen Menue, Body-Sperre und die ARIA-Angaben nicht auseinanderlaufen.
     Das Menue liegt per CSS unter dem Header, damit der Burger-Button immer
     anklickbar bleibt und das Menue auch wieder schliesst. */
  var burger = document.getElementById('burger');
  var menu   = document.getElementById('mobilemenu');

  function setMenu(open) {
    if (!menu) return;
    menu.classList.toggle('is-open', open);
    document.body.classList.toggle('is-locked', open);
    if (burger) {
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      burger.setAttribute('aria-label', open ? 'Menü schliessen' : 'Menü öffnen');
    }
    var links = menu.querySelectorAll('a');
    for (var i = 0; i < links.length; i++) {
      links[i].style.transitionDelay = open ? (0.05 * i + 0.08) + 's' : '0s';
    }
  }
  function closeMenu() { setMenu(false); }

  if (burger && menu) {
    burger.addEventListener('click', function () {
      setMenu(!menu.classList.contains('is-open'));
    });
    menu.addEventListener('click', function (e) {
      if (e.target.closest('a')) closeMenu();
    });
    // Beim Wechsel auf Desktopbreite darf keine gesperrte Seite zurueckbleiben
    window.addEventListener('resize', function () {
      if (window.innerWidth > 920 && menu.classList.contains('is-open')) closeMenu();
    });
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' || e.key === 'Esc') closeMenu();
  });

  /* ---------- 3. Sanftes Scrollen ---------- */
  document.addEventListener('click', function (e) {
    var link = e.target.closest ? e.target.closest('a[href^="#"]') : null;
    if (!link) return;
    var id = link.getAttribute('href');
    if (!id || id === '#' || id.length < 2) return;
    var target = document.querySelector(id);
    if (!target) return;

    e.preventDefault();
    closeMenu();
    var offset = (header ? header.offsetHeight : 0) + 12;
    var top = target.getBoundingClientRect().top + window.pageYOffset - offset;
    window.scrollTo({ top: top, behavior: reduced ? 'auto' : 'smooth' });
    history.replaceState(null, '', id);
  });

  /* ---------- 4. Scroll-Reveal ---------- */
  var reveals = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window) || reduced) {
    for (var r = 0; r < reveals.length; r++) reveals[r].classList.add('is-in');
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    for (var s = 0; s < reveals.length; s++) io.observe(reveals[s]);
  }

  /* ---------- 5. Aktiver Navigationspunkt ---------- */
  var sections = document.querySelectorAll('main section[id]');
  var navLinks = document.querySelectorAll('.nav a[href^="#"]');
  if (sections.length && navLinks.length && 'IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var id = '#' + entry.target.id;
        for (var i = 0; i < navLinks.length; i++) {
          navLinks[i].classList.toggle('is-active', navLinks[i].getAttribute('href') === id);
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    for (var t = 0; t < sections.length; t++) spy.observe(sections[t]);
  }

  /* ---------- 6. FAQ-Akkordeon ---------- */
  var faq = document.getElementById('faqBox');
  if (faq) {
    faq.addEventListener('click', function (e) {
      var btn = e.target.closest('.faq__q');
      if (!btn) return;

      var item   = btn.parentElement;
      var panel  = item.querySelector('.faq__a');
      var isOpen = item.classList.contains('is-open');

      var openItems = faq.querySelectorAll('.faq__item.is-open');
      for (var i = 0; i < openItems.length; i++) {
        if (openItems[i] === item) continue;
        openItems[i].classList.remove('is-open');
        openItems[i].querySelector('.faq__a').style.height = '0px';
        openItems[i].querySelector('.faq__q').setAttribute('aria-expanded', 'false');
      }

      if (isOpen) {
        panel.style.height = '0px';
        item.classList.remove('is-open');
        btn.setAttribute('aria-expanded', 'false');
      } else {
        panel.style.height = panel.firstElementChild.offsetHeight + 'px';
        item.classList.add('is-open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });

    window.addEventListener('resize', function () {
      var open = faq.querySelector('.faq__item.is-open .faq__a');
      if (open) open.style.height = open.firstElementChild.offsetHeight + 'px';
    });
  }

  /* ---------- 7. Live-Vorschauen skalieren --------------------------------
     Die eingebettete Website wird in voller Desktopbreite (1440 px) geladen
     und anschliessend passgenau auf die Kartenbreite herunterskaliert.
     So sieht man das echte Desktop-Layout statt der Mobilansicht.
     ---------------------------------------------------------------------- */
  var previews = document.querySelectorAll('[data-preview]');
  var BASE_WIDTH = 1440;

  function scalePreviews() {
    for (var i = 0; i < previews.length; i++) {
      var box    = previews[i];
      var frame  = box.querySelector('iframe');
      if (!frame) continue;

      var scale  = box.clientWidth / BASE_WIDTH;
      frame.style.transform = 'scale(' + scale + ')';
      frame.style.height    = (box.clientHeight / scale) + 'px';
    }
  }

  if (previews.length) {
    scalePreviews();
    window.addEventListener('resize', scalePreviews);
    window.addEventListener('load', scalePreviews);
    // Nach dem Laden der Schriften erneut messen
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(scalePreviews);
  }

  /* ---------- 8. Kontaktformular ---------- */
  /* ===== ANPASSEN: Adresse des Formular-Dienstes ==========================
     1. Kostenloses Konto auf formspree.io anlegen
     2. Neues Formular anlegen — Sie erhalten eine Adresse wie
        https://formspree.io/f/xayzabcd
     3. Diese Adresse hier unten eintragen (die Zeile mit FORM_ENDPOINT)
     4. Die allererste Testanfrage einmal per E-Mail bestaetigen

     Bis dahin zeigt das Formular eine Fehlermeldung mit E-Mail und Telefon
     an — statt einer falschen Erfolgsmeldung.
     ====================================================================== */
  var FORM_ENDPOINT = 'https://formspree.io/f/DEINE-FORM-ID';
  var IS_CONFIGURED = FORM_ENDPOINT.indexOf('DEINE-FORM-ID') === -1;

  var form = document.getElementById('contactForm');
  if (form) {
    var SUBMIT_LABEL = form.querySelector('button[type="submit"]').textContent;
    if (IS_CONFIGURED) { form.setAttribute('action', FORM_ENDPOINT); form.setAttribute('method', 'POST'); }
    function markError(input, hasError) {
      var field = input.closest('.field');
      if (field) field.classList.toggle('has-error', hasError);
    }

    form.addEventListener('input', function (e) {
      if (e.target.matches('input, textarea')) markError(e.target, false);
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var ok   = true;
      var name = document.getElementById('c-name');
      var mail = document.getElementById('c-mail');
      var msg  = document.getElementById('c-msg');
      var priv = document.getElementById('c-privacy');

      if (!name.value.trim()) { markError(name, true); ok = false; }
      if (!/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(mail.value.trim())) { markError(mail, true); ok = false; }
      if (!msg.value.trim())  { markError(msg, true);  ok = false; }
      if (!priv.checked) {
        ok = false;
        priv.focus();
        priv.parentElement.style.color = '#C2593F';
        setTimeout(function () { priv.parentElement.style.color = ''; }, 2500);
      }

      if (!ok) {
        var firstErr = form.querySelector('.field.has-error input, .field.has-error textarea');
        if (firstErr) firstErr.focus();
        return;
      }

      /* ================= Versand =================
         Solange bei FORM_ENDPOINT noch die Beispieladresse steht, meldet das
         Formular BEWUSST einen Fehler statt "gesendet". Eine Anfrage, die
         niemand bekommt, darf nicht als erfolgreich bestaetigt werden. */
      var okBox  = document.getElementById('formOk');
      var errBox = document.getElementById('formErr');
      var btn    = form.querySelector('button[type="submit"]');

      okBox.classList.remove('is-visible');
      errBox.classList.remove('is-visible');

      function fail(grund) {
        errBox.classList.add('is-visible');
        btn.disabled = false;
        btn.textContent = SUBMIT_LABEL;
        errBox.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'center' });
        if (window.console) window.console.error('Formularversand fehlgeschlagen:', grund);
      }

      if (!IS_CONFIGURED) {
        fail('FORM_ENDPOINT ist noch nicht eingetragen (assets/js/main.js).');
        return;
      }

      btn.disabled = true;
      btn.textContent = 'Wird gesendet …';

      window.fetch(FORM_ENDPOINT, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      }).then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res;
      }).then(function () {
        okBox.classList.add('is-visible');
        form.reset();
        btn.textContent = 'Anfrage gesendet';
        okBox.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'center' });
        window.setTimeout(function () {
          btn.disabled = false;
          btn.textContent = SUBMIT_LABEL;
        }, 5000);
      })['catch'](fail);
    });
  }

  /* ---------- 9. Jahreszahl ---------- */
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  /* ---------- 10. Paketdetails ----------
     Auf dem Handy bleibt der Block eingeklappt (kuerzerer Weg zum Kontakt),
     ab Tabletbreite ist er offen. Ohne JavaScript ist er zwar zu, laesst sich
     aber ganz normal per Klick oeffnen — <details> braucht kein Skript. */
  var planinfo = document.getElementById('planinfo');
  if (planinfo && window.matchMedia('(min-width:761px)').matches) planinfo.open = true;
})();
