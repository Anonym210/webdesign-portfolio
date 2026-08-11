/* =========================================================================
   Envy Web — Interaktion
   Reines JavaScript, keine Bibliotheken.
   ========================================================================= */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 0. Sprache ----------
     Diese Datei wird von allen Sprachfassungen geteilt (/, /en/, /fr/) und
     nicht kopiert. Hier stehen nur die wenigen Texte, die das Skript selbst
     erzeugt; welche Sprache gilt, sagt das lang-Attribut von <html>.
     Alle uebrigen Texte kommen aus dem HTML und sind dadurch automatisch
     richtig — siehe SUBMIT_LABEL in Abschnitt 8. */
  var LANG = (document.documentElement.getAttribute('lang') || 'de').slice(0, 2).toLowerCase();
  var TEXT = {
    de: { menuOpen: 'Menü öffnen',     menuClose: 'Menü schliessen', sending: 'Wird gesendet …',  sent: 'Anfrage gesendet' },
    en: { menuOpen: 'Open menu',       menuClose: 'Close menu',      sending: 'Sending …',        sent: 'Message sent' },
    fr: { menuOpen: 'Ouvrir le menu',  menuClose: 'Fermer le menu',  sending: 'Envoi en cours …', sent: 'Demande envoyée' }
  };
  var T = TEXT[LANG] || TEXT.de;

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
      burger.setAttribute('aria-label', open ? T.menuClose : T.menuOpen);
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
    // Beim Wechsel auf Desktopbreite darf keine gesperrte Seite zurueckbleiben.
    // 1000 px ist dieselbe Grenze, ab der style.css den Burger einblendet —
    // die beiden Werte muessen zusammen geaendert werden.
    window.addEventListener('resize', function () {
      if (window.innerWidth > 1000 && menu.classList.contains('is-open')) closeMenu();
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

  /* ---------- 4b. Ueberschriften Wort fuer Wort ----------
     Die Ueberschriften stehen vollstaendig und lesbar im HTML. Hier werden
     sie nur in Woerter zerlegt, damit jedes einzeln einschweben kann.

     - Geschnitten wird ausschliesslich in Textknoten. <br> und <em> bleiben
       dadurch unangetastet, Zeilenumbruch und Kursivschrift bleiben, wo sie
       hingehoeren.
     - Die Leerzeichen zwischen den Woertern werden als eigene Textknoten
       wieder eingesetzt, sonst klebten die Woerter aneinander.
     - Pro Wort entstehen zwei Spans: aussen die Maske (.split__w), innen
       das bewegte Wort (.split__i). Bewegt wird nur das innere, das
       aeussere schneidet ab. Deshalb sieht es aus, als kaeme das Wort
       hinter einer Kante hervor, statt einfach aufzutauchen.
     - Am vorgelesenen Text aendert sich nichts, die Spans sind reine
       Huellen ohne eigene Bedeutung.
     - Bei reduzierter Bewegung wird gar nicht erst geschnitten.

     Die H1 im Hero laeuft beim Laden los, die H2 weiter unten erst, wenn
     ihr Block ins Bild kommt — das entscheidet .is-in aus Abschnitt 4.
     Das Aussehen steht in style.css, Abschnitte 19b und 19c. */
  var splitTitle = function (title, base, step) {
    var i = 0;

    var walk = function (node) {
      var kids = Array.prototype.slice.call(node.childNodes);
      kids.forEach(function (kid) {
        // Elementknoten (<em>, <br>) behalten wir und gehen hinein.
        if (kid.nodeType === 1) { walk(kid); return; }
        if (kid.nodeType !== 3) return;

        var parts = kid.nodeValue.split(/(\s+)/);
        var frag  = document.createDocumentFragment();
        var wortDavor = null;

        parts.forEach(function (part) {
          if (part === '') return;
          if (/^\s+$/.test(part)) {
            frag.appendChild(document.createTextNode(part));
            return;
          }
          // Alleinstehende Satzzeichen bekommen die Verzoegerung des Wortes
          // davor und kommen mit ihm zusammen an. Sonst schwebte im
          // franzoesischen Titel das "?" hinter allem anderen her, weil dort
          // ein Leerzeichen davorsteht.
          var alone = !/[0-9A-Za-z\u00C0-\u024F]/.test(part);
          var at    = alone && i > 0 ? i - 1 : i;

          // Ein alleinstehendes Satzzeichen wird an das Wort davor gehaengt,
          // mit geschuetztem Leerzeichen dazwischen. Grund: die Woerter sind
          // inline-block, also eigene Kaesten, und zwischen zwei solchen
          // Kaesten darf die Zeile umbrechen. Im franzoesischen Titel
          // "Vous trouvent-ils ?" landete das Fragezeichen sonst allein auf
          // der naechsten Zeile. Innerhalb EINES Kastens haelt das
          // geschuetzte Leerzeichen dagegen zuverlaessig.
          if (alone && wortDavor) {
            if (frag.lastChild && frag.lastChild.nodeType === 3) {
              frag.removeChild(frag.lastChild);
            }
            wortDavor.appendChild(document.createTextNode('\u00A0' + part));
            return;
          }

          var mask = document.createElement('span');
          mask.className = 'split__w';

          var word = document.createElement('span');
          word.className = 'split__i';
          word.textContent = part;
          word.style.animationDelay = (base + at * step).toFixed(3) + 's';

          mask.appendChild(word);
          wortDavor = word;
          if (!alone) i++;
          frag.appendChild(mask);
        });

        node.replaceChild(frag, kid);
      });
    };

    walk(title);
    title.classList.add('is-split');
  };

  if (!reduced) {
    var heroTitle = document.querySelector('.hero h1');
    if (heroTitle) splitTitle(heroTitle, 0.06, 0.055);

    // Jede H2, die in einem .reveal-Block steckt. Der Block bekommt
    // has-split, damit style.css sein eigenes Hochschieben abschalten kann.
    var subTitles = document.querySelectorAll('.reveal h2');
    for (var st = 0; st < subTitles.length; st++) {
      splitTitle(subTitles[st], 0.04, 0.05);
      var block = subTitles[st].closest('.reveal');
      if (block) block.classList.add('has-split');
    }
  }

  /* ---------- 4c. Branchenleiste als Laufband ----------
     Damit der Durchlauf nahtlos ist, muss die Zeile aus einer geraden Zahl
     gleicher Saetze bestehen: die Animation schiebt um genau die Haelfte
     der Gesamtbreite, und diese Haelfte muss auf eine Satzgrenze fallen.
     Deshalb wird zuerst gemessen, wie viele Saetze noetig sind, um die
     sichtbare Breite zu fuellen, und dann auf das Doppelte aufgefuellt.

     Die Kopien bekommen aria-hidden, sonst liest ein Screenreader dieselben
     Branchen mehrfach vor. Ohne JavaScript und bei reduzierter Bewegung
     bleibt die Zeile so stehen, wie sie im HTML steht. */
  var bRow  = document.querySelector('.branches__row');
  var bView = document.querySelector('.branches__viewport');
  if (bRow && bView && !reduced) {
    var satz = Array.prototype.slice.call(bRow.children);

    bRow.classList.add('is-marquee');
    var satzBreite = bRow.scrollWidth;
    var sichtbar   = bView.clientWidth;
    var noetig     = Math.max(1, Math.ceil(sichtbar / Math.max(satzBreite, 1)));

    for (var k = 1; k < noetig * 2; k++) {
      var kopie = document.createDocumentFragment();
      satz.forEach(function (chip) {
        var c = chip.cloneNode(true);
        c.setAttribute('aria-hidden', 'true');
        kopie.appendChild(c);
      });
      bRow.appendChild(kopie);
    }
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
  var FORM_ENDPOINT = 'https://formspree.io/f/xzepdone';
  var IS_CONFIGURED = FORM_ENDPOINT.indexOf('DEINE-FORM-ID') === -1;

  var form = document.getElementById('contactForm');
  if (form) {
    var SUBMIT_LABEL = form.querySelector('button[type="submit"]').textContent;
    var CHECK_SVG = '<svg class="btn__check" viewBox="0 0 24 24" fill="none" '
                  + 'stroke="currentColor" stroke-width="2.4" stroke-linecap="round" '
                  + 'stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>';
    if (IS_CONFIGURED) { form.setAttribute('action', FORM_ENDPOINT); form.setAttribute('method', 'POST'); }
    function markError(input, hasError) {
      var field = input.closest('.field');
      if (field) field.classList.toggle('has-error', hasError);
    }

    form.addEventListener('input', function (e) {
      if (e.target.matches('input, textarea')) markError(e.target, false);
      var consent = e.target.closest('.form__consent');
      if (consent) consent.classList.remove('has-error');
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
        priv.closest('.form__consent').classList.add('has-error');
        priv.focus();
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
        btn.classList.remove('is-done');
        btn.textContent = SUBMIT_LABEL;
        errBox.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'center' });
        if (window.console) window.console.error('Formularversand fehlgeschlagen:', grund);
      }

      if (!IS_CONFIGURED) {
        fail('FORM_ENDPOINT ist noch nicht eingetragen (assets/js/main.js).');
        return;
      }

      btn.disabled = true;
      btn.textContent = T.sending;

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
        /* Der Knopf bestaetigt selbst, statt nur seine Beschriftung zu
           wechseln: das Haekchen wird gezeichnet (siehe style.css,
           Abschnitt 19c). Der eingesetzte Inhalt ist fest im Skript
           hinterlegt, es landet nichts aus dem Formular im Markup. */
        btn.classList.add('is-done');
        btn.innerHTML = CHECK_SVG + T.sent;
        okBox.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'center' });
        window.setTimeout(function () {
          btn.disabled = false;
          btn.classList.remove('is-done');
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
