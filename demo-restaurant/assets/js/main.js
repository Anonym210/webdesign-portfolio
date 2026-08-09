/* =========================================================================
   AVERA — Contemporary Dining
   Reines JavaScript, keine Bibliotheken.
   ========================================================================= */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 1. Kopfzeile und Nach-oben-Knopf ---------- */
  var header = document.getElementById('header');
  var totop  = document.getElementById('totop');

  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    if (header) header.classList.toggle('is-stuck', y > 60);
    if (totop)  totop.classList.toggle('is-visible', y > 700);
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
      links[i].style.transitionDelay = open ? (0.06 * i + 0.1) + 's' : '0s';
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
      if (window.innerWidth > 860 && menu.classList.contains('is-open')) closeMenu();
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
    var offset = (header ? header.offsetHeight : 0) + 10;
    var top = target.getBoundingClientRect().top + window.pageYOffset - offset;
    window.scrollTo({ top: top, behavior: reduced ? 'auto' : 'smooth' });
    history.replaceState(null, '', id);
  });

  /* ---------- 4. Einblenden beim Scrollen ---------- */
  var rises = document.querySelectorAll('.rise');
  if (!('IntersectionObserver' in window) || reduced) {
    for (var r = 0; r < rises.length; r++) rises[r].classList.add('is-in');
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });
    for (var s = 0; s < rises.length; s++) io.observe(rises[s]);
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

  /* ---------- 6. Reservationsformular ---------- */
  /* ===== BEISPIELWEBSITE: Dieses Formular sendet NICHTS ===================
     Die Seite ist eine Gestaltungsdemo. Das Formular prueft die Eingaben und
     zeigt die Rueckmeldung, uebermittelt aber bewusst keine Daten: Empfaenger
     waere das Postfach des Portfolio-Betreibers, waehrend die
     Datenschutzerklaerung dieser Demo einen erfundenen Betrieb nennt. Die
     Pflichtangabe nach Art. 19 DSG waere damit falsch.

     Keine Uebermittlung = kein Datenschutzrisiko. Ein echtes Restaurant wuerde
     hier ein Reservationssystem anbinden, das freie Tische kennt, und die
     Datenschutzerklaerung entsprechend anpassen.
     ====================================================================== */

  var form = document.getElementById('resvForm');
  if (form) {
    var SUBMIT_LABEL = form.querySelector('button[type="submit"]').textContent;

    // Ein Tisch laesst sich nicht rueckwirkend reservieren
    var dateInput = document.getElementById('f-date');
    if (dateInput) dateInput.min = new Date().toISOString().split('T')[0];

    function mark(input, bad) {
      var f = input.closest('.field');
      if (f) f.classList.toggle('has-error', bad);
    }

    form.addEventListener('input', function (e) {
      if (e.target.matches('input, textarea')) mark(e.target, false);
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var ok   = true;
      var name = document.getElementById('f-name');
      var mail = document.getElementById('f-mail');
      var priv = document.getElementById('f-priv');

      if (!name.value.trim()) { mark(name, true); ok = false; }
      if (!/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(mail.value.trim())) { mark(mail, true); ok = false; }
      if (!priv.checked) {
        ok = false;
        priv.focus();
        priv.parentElement.style.color = '#E08C6E';
        window.setTimeout(function () { priv.parentElement.style.color = ''; }, 2500);
      }

      if (!ok) {
        var first = form.querySelector('.field.has-error input');
        if (first) first.focus();
        return;
      }

      /* ================= Kein Versand =================
         Siehe Erklaerung oben: die Eingaben verlassen den Browser nicht.
         Der Hinweiskasten sagt das dem Gast auch deutlich — eine Demo darf
         keine Reservation vortaeuschen, die niemand erhaelt. */
      var okBox = document.getElementById('okBox');

      form.reset();
      okBox.classList.add('is-visible');
      okBox.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'center' });
    });
  }

  /* ---------- 7. Jahreszahl ---------- */
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

})();
