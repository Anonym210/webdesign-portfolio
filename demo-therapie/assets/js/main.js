/* =========================================================================
   VITA — Therapeutische Massage
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
    if (header) header.classList.toggle('is-stuck', y > 20);
    if (totop)  totop.classList.toggle('is-visible', y > 700);
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
    var offset = (header ? header.offsetHeight : 0) + 8;
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
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
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
    }, { rootMargin: '-40% 0px -55% 0px' });
    for (var t = 0; t < sections.length; t++) spy.observe(sections[t]);
  }

  /* ---------- 6. Beschwerde-Auswahl ------------------------------------
     Kernstueck der Seite: Besucher waehlt eine Koerperregion und sieht
     sofort die passende Behandlung samt Dauer, Preis und Kassenlage.
     Neue Region ergaenzen = einen Eintrag in EMPFEHLUNG hinzufuegen und
     einen Knopf mit passendem data-key ins HTML setzen.
     -------------------------------------------------------------------- */
  var EMPFEHLUNG = {
    nacken: {
      region: 'Nacken & Schultern',
      titel:  'Triggerpunkt-Therapie',
      warum:  'Bei steifem Nacken sitzt die Ursache meist in wenigen verhärteten Punkten im Trapezius. Wir lösen sie gezielt statt grossflächig zu kneten.',
      dauer:  '45 Min.',
      preis:  'CHF 110.–',
      anzahl: '3–5',
      kasse:  true
    },
    ruecken: {
      region: 'Unterer Rücken',
      titel:  'Klassische Massage · 60 Min.',
      warum:  'Beschwerden im unteren Rücken kommen häufig aus verkürzten Hüftbeugern vom vielen Sitzen. Deshalb behandeln wir Rücken und Hüfte zusammen.',
      dauer:  '60 Min.',
      preis:  'CHF 135.–',
      anzahl: '2–4',
      kasse:  true
    },
    kopf: {
      region: 'Kopfschmerzen',
      titel:  'Triggerpunkt-Therapie · Nacken',
      warum:  'Spannungskopfschmerz entsteht oft im Nacken und in der Kaumuskulatur. Löst sich dort die Spannung, verschwindet häufig auch der Kopfschmerz.',
      dauer:  '45 Min.',
      preis:  'CHF 110.–',
      anzahl: '3–6',
      kasse:  true
    },
    beine: {
      region: 'Beine & Knie',
      titel:  'Sportmassage',
      warum:  'Knieschmerzen beim Laufen kommen selten aus dem Knie. Wir arbeiten an Oberschenkel, Wade und dem Bandapparat rundherum.',
      dauer:  '60 Min.',
      preis:  'CHF 140.–',
      anzahl: '2–4',
      kasse:  true
    },
    fuss: {
      region: 'Füsse',
      titel:  'Fussreflexzonen',
      warum:  'Bei Fersensporn, müden Füssen oder nach langen Steh-Schichten. Wirkt zusätzlich beruhigend auf den ganzen Körper.',
      dauer:  '45 Min.',
      preis:  'CHF 105.–',
      anzahl: '2–3',
      kasse:  true
    },
    stress: {
      region: 'Nur abschalten',
      titel:  'Entspannungsmassage',
      warum:  'Kein Befund, kein Programm — ruhige Ganzkörpermassage in gleichmässigem Tempo. Ohne therapeutisches Ziel.',
      dauer:  '60 Min.',
      preis:  'CHF 120.–',
      anzahl: 'nach Bedarf',
      kasse:  false
    }
  };

  var chips  = document.querySelectorAll('.chip[data-key]');
  var result = document.getElementById('result');

  if (chips.length && result) {
    var el = {
      region:  document.getElementById('r-region'),
      titel:   document.getElementById('r-title'),
      warum:   document.getElementById('r-why'),
      dauer:   document.getElementById('r-dur'),
      preis:   document.getElementById('r-price'),
      anzahl:  document.getElementById('r-count'),
      paytext: document.getElementById('r-paytext'),
      pay:     document.getElementById('r-pay')
    };

    function zeige(key) {
      var d = EMPFEHLUNG[key];
      if (!d) return;

      // Kurz ausblenden, damit der Wechsel sichtbar ist
      result.classList.add('is-swapping');
      window.setTimeout(function () {
        el.region.textContent = d.region;
        el.titel.textContent  = d.titel;
        el.warum.textContent  = d.warum;
        el.dauer.textContent  = d.dauer;
        el.preis.textContent  = d.preis;
        el.anzahl.textContent = d.anzahl;
        el.paytext.textContent = d.kasse
          ? 'Über die Zusatzversicherung abrechenbar'
          : 'Wird von der Zusatzversicherung nicht vergütet';
        el.pay.style.color = d.kasse ? '' : 'var(--ink-mute)';
        result.classList.remove('is-swapping');
      }, reduced ? 0 : 160);
    }

    for (var c = 0; c < chips.length; c++) {
      chips[c].addEventListener('click', function () {
        for (var i = 0; i < chips.length; i++) chips[i].setAttribute('aria-selected', 'false');
        this.setAttribute('aria-selected', 'true');
        zeige(this.getAttribute('data-key'));

        // Auswahl ins Kontaktformular übernehmen
        var sel = document.getElementById('f-region');
        if (sel) {
          var wanted = this.textContent.trim();
          for (var o = 0; o < sel.options.length; o++) {
            if (sel.options[o].text === wanted) { sel.selectedIndex = o; break; }
          }
        }
      });

      // Mit Pfeiltasten durch die Auswahl gehen
      chips[c].addEventListener('keydown', function (e) {
        if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
        e.preventDefault();
        var list = Array.prototype.slice.call(chips);
        var i = list.indexOf(this) + (e.key === 'ArrowRight' ? 1 : -1);
        var next = list[(i + list.length) % list.length];
        next.focus();
        next.click();
      });
    }
  }

  /* ---------- 7. FAQ ---------- */
  var faq = document.getElementById('faq');
  if (faq) {
    faq.addEventListener('click', function (e) {
      var btn = e.target.closest('.faq__q');
      if (!btn) return;

      var item   = btn.parentElement;
      var panel  = item.querySelector('.faq__a');
      var isOpen = item.classList.contains('is-open');

      var open = faq.querySelectorAll('.faq__i.is-open');
      for (var i = 0; i < open.length; i++) {
        if (open[i] === item) continue;
        open[i].classList.remove('is-open');
        open[i].querySelector('.faq__a').style.height = '0px';
        open[i].querySelector('.faq__q').setAttribute('aria-expanded', 'false');
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
      var o = faq.querySelector('.faq__i.is-open .faq__a');
      if (o) o.style.height = o.firstElementChild.offsetHeight + 'px';
    });
  }

  /* ---------- 8. Terminformular ---------- */
  var form = document.getElementById('terminForm');
  if (form) {
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
      var msg  = document.getElementById('f-msg');
      var priv = document.getElementById('f-priv');

      if (!name.value.trim()) { mark(name, true); ok = false; }
      if (!/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(mail.value.trim())) { mark(mail, true); ok = false; }
      if (!msg.value.trim()) { mark(msg, true); ok = false; }
      if (!priv.checked) {
        ok = false;
        priv.focus();
        priv.parentElement.style.color = '#B3341C';
        window.setTimeout(function () { priv.parentElement.style.color = ''; }, 2500);
      }

      if (!ok) {
        var first = form.querySelector('.field.has-error input, .field.has-error textarea');
        if (first) first.focus();
        return;
      }

      /* --------------------------------------------------------------
         DEMO: Die Anfrage wird nur bestaetigt, nicht versendet.
         Fuer den Livebetrieb eine Variante waehlen:

         a) Formspree — <form action="https://formspree.io/f/ID" method="POST">
            und diesen preventDefault-Block entfernen
         b) Netlify — dem <form>-Tag  netlify  und  name="termin"  geben
         c) Eigenes PHP — fetch('kontakt.php', {method:'POST', body:new FormData(form)})

         ACHTUNG: Dieses Formular erfasst Gesundheitsangaben. Diese sind
         nach Art. 5 lit. c DSG besonders schuetzenswert — der Versand
         muss verschluesselt erfolgen und der Anbieter sollte in der
         Schweiz oder im EU-Raum hosten.
         -------------------------------------------------------------- */

      var box = document.getElementById('okBox');
      var btn = form.querySelector('button[type="submit"]');
      btn.disabled = true;
      btn.textContent = 'Wird gesendet …';

      window.setTimeout(function () {
        box.classList.add('is-visible');
        btn.textContent = 'Anfrage gesendet';
        form.reset();
        box.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'center' });
        window.setTimeout(function () {
          btn.disabled = false;
          btn.textContent = 'Termin anfragen';
        }, 4000);
      }, 700);
    });
  }

  /* ---------- 9. Jahreszahl ---------- */
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
