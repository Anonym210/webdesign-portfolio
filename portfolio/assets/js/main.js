/* =========================================================================
   ALITI Webdesign — Interaktion
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

  /* ---------- 2. Mobiles Menue ---------- */
  var burger = document.getElementById('burger');
  var menu   = document.getElementById('mobilemenu');

  function closeMenu() {
    if (!menu) return;
    menu.classList.remove('is-open');
    document.body.classList.remove('is-locked');
    if (burger) burger.setAttribute('aria-expanded', 'false');
  }

  if (burger && menu) {
    burger.addEventListener('click', function () {
      var open = menu.classList.toggle('is-open');
      document.body.classList.toggle('is-locked', open);
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      burger.setAttribute('aria-label', open ? 'Menü schliessen' : 'Menü öffnen');

      var links = menu.querySelectorAll('a');
      for (var i = 0; i < links.length; i++) {
        links[i].style.transitionDelay = open ? (0.05 * i + 0.08) + 's' : '0s';
      }
    });
    menu.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') closeMenu();
    });
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMenu();
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
  var form = document.getElementById('contactForm');
  if (form) {
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

      /* --------------------------------------------------------------
         WICHTIG — Formularversand aktivieren:

         Aktuell wird die Anfrage nur bestaetigt, aber NICHT versendet.
         Fuer den Livebetrieb eine Variante waehlen:

         a) Formspree (kostenlos, kein Server noetig)
            1. Konto auf formspree.io anlegen, Formular erstellen
            2. Im HTML ergaenzen:
               <form action="https://formspree.io/f/DEINE-ID" method="POST">
            3. Diesen preventDefault-Block loeschen

         b) Netlify Forms (wenn ueber Netlify gehostet)
            Dem <form>-Tag  netlify  und  name="kontakt"  hinzufuegen

         c) Eigenes PHP-Skript auf dem Webspace
            fetch('kontakt.php', { method:'POST', body:new FormData(form) })
         -------------------------------------------------------------- */

      var okBox = document.getElementById('formOk');
      var btn   = form.querySelector('button[type="submit"]');
      btn.disabled = true;
      btn.textContent = 'Wird gesendet …';

      setTimeout(function () {
        okBox.classList.add('is-visible');
        btn.textContent = 'Anfrage gesendet';
        form.reset();
        okBox.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'center' });
        setTimeout(function () {
          btn.disabled = false;
          btn.textContent = 'Anfrage senden';
        }, 4000);
      }, 700);
    });
  }

  /* ---------- 9. Jahreszahl ---------- */
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
