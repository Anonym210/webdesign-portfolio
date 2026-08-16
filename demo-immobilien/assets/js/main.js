/* =========================================================================
   ARVEN — Immobilien AG (Portfolio-Demonstration)
   Reines JavaScript, keine Bibliotheken. Eine Datei fuer alle Seiten;
   jeder Abschnitt prueft selbst, ob seine Elemente vorhanden sind.
   ========================================================================= */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 0. Zentrale Demodaten ----------
     Alles, was JavaScript an mehreren Stellen ausgibt, steht hier genau
     einmal — so koennen Meldungen und Kontaktangaben nicht auseinanderlaufen.
     (Die statischen Texte der Seiten sind bewusst im HTML: die Website
     funktioniert vollstaendig ohne JavaScript.) */
  var DATEN = {
    firma: 'ARVEN Immobilien AG',
    telefon: '044 234 56 78',
    telefonLink: '+41442345678',
    mail: 'kontakt@arven-immobilien.ch',
    rueckmeldung: 'innerhalb von zwei Arbeitstagen'
  };

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

  /* ---------- 2. Parallax auf dem Buehnenbild ---------- */
  var heroImg = document.querySelector('.hero__img');
  if (heroImg && !reduced) {
    var ticking = false;
    var parallax = function () {
      var y = window.scrollY || window.pageYOffset;
      if (y < window.innerHeight * 1.2) {
        heroImg.style.transform = 'translateY(' + (y * 0.12).toFixed(1) + 'px)';
      }
      ticking = false;
    };
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; window.requestAnimationFrame(parallax); }
    }, { passive: true });
  }

  /* ---------- 3. Mobiles Menue ----------
     Ein einziger Zustandsschalter; .menu-open am Header stellt Logo und
     Burger auf dunkle Zeichen, auch wenn die Seite mit hellem Buehnenkopf
     startet. Der Fokus bleibt im offenen Menue (Falle), Escape schliesst,
     danach kehrt der Fokus zum Burger zurueck. */
  var burger = document.getElementById('burger');
  var menu   = document.getElementById('mobilemenu');

  function menueElemente() {
    return menu ? menu.querySelectorAll('a, button') : [];
  }

  function setMenu(open) {
    if (!menu) return;
    menu.classList.toggle('is-open', open);
    document.body.classList.toggle('is-locked', open);
    if (header) header.classList.toggle('menu-open', open);
    if (burger) {
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      burger.setAttribute('aria-label', open ? 'Menü schliessen' : 'Menü öffnen');
    }
    var links = menu.querySelectorAll('a');
    for (var i = 0; i < links.length; i++) {
      links[i].style.transitionDelay = open ? (0.06 * i + 0.1) + 's' : '0s';
    }
    if (open) {
      var erst = menueElemente()[0];
      if (erst) erst.focus();
    } else if (burger) {
      burger.focus();
    }
  }
  function closeMenu() {
    if (menu && menu.classList.contains('is-open')) setMenu(false);
  }

  if (burger && menu) {
    burger.addEventListener('click', function () {
      setMenu(!menu.classList.contains('is-open'));
    });
    menu.addEventListener('click', function (e) {
      if (e.target.closest('a')) closeMenu();
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > 860 && menu.classList.contains('is-open')) closeMenu();
    });
    // Fokusfalle: Tab am Ende springt zum Anfang und umgekehrt.
    // Der Burger selbst bleibt erreichbar, weil er im fixierten Header liegt.
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Tab' || !menu.classList.contains('is-open')) return;
      var el = menueElemente();
      if (!el.length) return;
      var erstes = el[0], letztes = el[el.length - 1];
      if (e.shiftKey && document.activeElement === erstes) {
        e.preventDefault(); letztes.focus();
      } else if (!e.shiftKey && document.activeElement === letztes) {
        e.preventDefault(); erstes.focus();
      }
    });
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' || e.key === 'Esc') closeMenu();
  });

  /* ---------- 4. Sanftes Scrollen (nur Sprungziele derselben Seite) ---------- */
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

  /* ---------- 5b. Titel in Zeilen schneiden ----------
     Jede Zeile eines grossen Titels bekommt eine Maske, aus der sie
     hochfaehrt. Geschnitten wird an den <br>, die im HTML stehen; der
     Umbruch aendert sich dadurch nicht.

     Fuer Vorlesehilfen bleibt der Titel derselbe: die Huellen sind reine
     <span> ohne eigene Bedeutung, der Text steht unveraendert darin. Bei
     „weniger Bewegung“ wird gar nicht geschnitten. Das Aussehen steht in
     style.css, Abschnitt 24a. Dieser Abschnitt steht bewusst VOR dem
     Beobachter aus Abschnitt 5: Titel, die hier erst ein .rise bekommen,
     muessen von ihm noch eingesammelt werden. */
  if (!reduced) {
    var titel = document.querySelectorAll(
      '.hero h1, .pagehero h1, .head h2, .cta h2, .case h2, .grid-head h2, .story__copy h2'
    );

    Array.prototype.forEach.call(titel, function (t) {
      // Nur schneiden, wenn es wirklich mehrere Zeilen gibt.
      if (!t.querySelector('br')) return;

      var zeilen = [];
      var aktuell = document.createDocumentFragment();
      var kinder = Array.prototype.slice.call(t.childNodes);

      kinder.forEach(function (kind) {
        if (kind.nodeType === 1 && kind.tagName === 'BR') {
          zeilen.push(aktuell);
          aktuell = document.createDocumentFragment();
          return;
        }
        aktuell.appendChild(kind);
      });
      zeilen.push(aktuell);

      // Leere Fragmente (doppelte <br>) fallen weg
      zeilen = zeilen.filter(function (f) {
        return (f.textContent || '').trim() !== '';
      });
      if (zeilen.length < 2) {
        // Nichts gewonnen: Inhalt unveraendert zuruecklegen
        zeilen.forEach(function (f) { t.appendChild(f); });
        return;
      }

      t.textContent = '';
      zeilen.forEach(function (frag) {
        var aussen = document.createElement('span');
        aussen.className = 'zeile';
        var innen = document.createElement('span');
        innen.className = 'zeile__in';
        innen.appendChild(frag);
        aussen.appendChild(innen);
        t.appendChild(aussen);
      });

      t.classList.add('split');

      // Der umgebende Block soll nicht zusaetzlich als Ganzes hochfahren
      var block = t.closest('.rise');
      if (block) block.classList.add('hat-split');
      // Titel ausserhalb eines .rise-Blocks brauchen einen eigenen Ausloeser
      if (!block) { t.classList.add('rise'); t.classList.add('hat-split'); }
    });
  }

  /* ---------- 4b. Vorspanntexte wortweise enthuellen ----------
     Die grossen Titel fahren zeilenweise hoch (Abschnitt 5b), die Absaetze
     darunter standen dagegen einfach da. Hier bekommt jedes Wort eine
     eigene kleine Bewegung: Der Satz baut sich von links auf, statt als
     Block zu erscheinen.

     Fuer Vorlesehilfen aendert sich nichts: Die Woerter bleiben Text im
     selben Element, die Huellen sind bedeutungslose <span>. Zwischen den
     Woertern stehen weiterhin echte Leerzeichen, damit Markieren, Kopieren
     und die Wortsuche des Browsers unveraendert funktionieren.

     Verschachtelte Elemente (<a>, <em>, <b>) bleiben erhalten: der Baum
     wird durchlaufen, zerlegt werden nur die Textknoten darin. */
  if (!reduced) {
    var absaetze = document.querySelectorAll(
      '.lead, .bilanz__text, .grossezitat p, .bestand__hinweis, .gegen__fuss'
    );

    Array.prototype.forEach.call(absaetze, function (p) {
      if (p.getAttribute('data-woerter') === 'ja') return;
      // Sehr lange Absaetze bleiben, wie sie sind: hunderte Huellen kosten
      // Leistung, und den Aufbau sieht dabei ohnehin niemand mehr.
      var text = (p.textContent || '').trim();
      if (!text || text.length > 420) return;

      var zaehler = 0;

      function zerlege(knoten) {
        Array.prototype.slice.call(knoten.childNodes).forEach(function (kind) {
          if (kind.nodeType === 3) {
            var teile = kind.nodeValue.split(/(\s+)/);
            var frag = document.createDocumentFragment();
            teile.forEach(function (teil) {
              if (teil === '') return;
              if (/^\s+$/.test(teil)) {
                frag.appendChild(document.createTextNode(teil));
                return;
              }
              var wort = document.createElement('span');
              wort.className = 'wort';
              wort.style.setProperty('--i', zaehler++);
              wort.appendChild(document.createTextNode(teil));
              frag.appendChild(wort);
            });
            knoten.replaceChild(frag, kind);
          } else if (kind.nodeType === 1 && !kind.classList.contains('wort')) {
            zerlege(kind);
          }
        });
      }

      zerlege(p);
      if (!zaehler) return;
      p.setAttribute('data-woerter', 'ja');
      p.classList.add('woertlich');
      // Absaetze ohne umgebenden Ausloeser bekommen einen eigenen
      if (!p.closest('.rise')) p.classList.add('rise');
    });
  }

  /* ---------- 5. Einblenden beim Scrollen ----------
     threshold:0 statt 0.1 — bei hohen Bloecken (ganze Listen) hiess
     „10 % sichtbar“ sonst: mehrere hundert Pixel scrollen, bevor
     ueberhaupt etwas erscheint.

     Dazu ein Sicherheitsnetz: Was laengst im Bild steht, aber nie eine
     Meldung bekam (wiederhergestellte Scrollposition, Sprunganker,
     Eigenheiten einzelner Browser), wird beim naechsten Scrollen
     nachgereicht. Ohne das blieben ganze Abschnitte unsichtbar —
     leere Flaechen, wo Inhalt sein sollte. */
  var rises = document.querySelectorAll('.rise, .veilimg');
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
    }, { threshold: 0, rootMargin: '0px 0px -60px 0px' });
    for (var s = 0; s < rises.length; s++) io.observe(rises[s]);

    var nachreichen = function () {
      var vh = window.innerHeight;
      for (var i = 0; i < rises.length; i++) {
        var el = rises[i];
        if (el.classList.contains('is-in')) continue;
        if (el.getBoundingClientRect().top < vh - 40) {
          el.classList.add('is-in');
          io.unobserve(el);
        }
      }
    };
    var nachreichenGeplant = false;
    window.addEventListener('scroll', function () {
      if (nachreichenGeplant) return;
      nachreichenGeplant = true;
      window.requestAnimationFrame(function () {
        nachreichen();
        nachreichenGeplant = false;
      });
    }, { passive: true });
    // Rueckkehr aus dem Verlaufsspeicher: Zustand sofort nachziehen
    window.addEventListener('pageshow', function (e) {
      if (e.persisted) nachreichen();
    });
  }

  /* ---------- 5c. Zeitleiste: Bild folgt der Station ----------
     Sobald eine Station die Mitte des Bildschirms erreicht, wechselt das
     klebende Bild daneben. Der schmale Beobachtungsstreifen in der Mitte
     sorgt dafuer, dass immer genau eine Station als aktiv gilt. */
  var zeitliste = document.querySelector('.zeitraum .timeline');
  var zeitbilder = document.querySelectorAll('.zeitbild__f');
  if (zeitliste && zeitbilder.length) {
    var stationen = zeitliste.querySelectorAll('li[data-schritt]');

    var wecke = function (i) {
      for (var b = 0; b < zeitbilder.length; b++) {
        zeitbilder[b].classList.toggle('is-an', b === i);
      }
      for (var st = 0; st < stationen.length; st++) {
        stationen[st].classList.toggle('is-wach', st === i);
      }
    };

    if (!('IntersectionObserver' in window)) {
      // Ohne Beobachter: alle Stationen voll sichtbar, erstes Bild bleibt
      for (var f = 0; f < stationen.length; f++) stationen[f].classList.add('is-wach');
    } else {
      var zio = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var nr = parseInt(entry.target.getAttribute('data-schritt'), 10);
          if (!isNaN(nr)) wecke(nr);
        });
      }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });

      for (var z = 0; z < stationen.length; z++) zio.observe(stationen[z]);
      wecke(0);
    }
  }

  /* ---------- 6. Zahlen laufen hoch ----------
     Im HTML steht der Endwert — ohne JavaScript zeigt die Seite so die
     richtige Zahl. Das Skript setzt sie beim ersten Erscheinen auf 0
     und zaehlt hoch. Apostroph als Schweizer Tausendertrennzeichen. */
  function formatCH(n) {
    var t = String(Math.round(n));
    return t.replace(/\B(?=(\d{3})+(?!\d))/g, "'");
  }
  var counters = document.querySelectorAll('[data-to]');
  if (counters.length) {
    var startCount = function (el) {
      var ziel = parseFloat(el.getAttribute('data-to'));
      if (reduced || !('IntersectionObserver' in window)) { el.textContent = formatCH(ziel); return; }
      var t0 = null;
      var dauer = 1400;
      var tick = function (t) {
        if (!t0) t0 = t;
        var p = Math.min((t - t0) / dauer, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = formatCH(ziel * eased);
        if (p < 1) window.requestAnimationFrame(tick);
      };
      window.requestAnimationFrame(tick);
    };
    if (!('IntersectionObserver' in window) || reduced) {
      Array.prototype.forEach.call(counters, startCount);
    } else {
      var cio = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) { startCount(entry.target); cio.unobserve(entry.target); }
        });
      }, { threshold: 0.4 });
      Array.prototype.forEach.call(counters, function (el) { cio.observe(el); });
    }
  }

  /* ---------- 7. Laufband ---------- */
  var marquee = document.querySelector('.marquee__row');
  if (marquee && !reduced) {
    marquee.innerHTML += marquee.innerHTML;
    var kopien = marquee.children;
    for (var k = kopien.length / 2; k < kopien.length; k++) {
      kopien[k].setAttribute('aria-hidden', 'true');
    }
  }

  /* ---------- 8. Projektfilter ----------
     Zeigt und versteckt Karten nach data-status, meldet die Trefferzahl
     ueber eine aria-live-Region und merkt sich die Wahl in der Adresse
     (?stand=...), damit Zurueck-Navigation den Zustand behaelt. */
  var filter = document.querySelector('.filter');
  if (filter) {
    // Karten (frueher) und Listenzeilen (jetzt) tragen beide data-status,
    // damit derselbe Filter fuer beide Darstellungen reicht.
    var karten = document.querySelectorAll('[data-status]');
    var stand = document.getElementById('filterStand');

    function filterAnwenden(wahl, urlSchreiben) {
      var alle = filter.querySelectorAll('button[data-filter]');
      var gefunden = false;
      for (var i = 0; i < alle.length; i++) {
        var passtKnopf = alle[i].getAttribute('data-filter') === wahl;
        alle[i].setAttribute('aria-pressed', passtKnopf ? 'true' : 'false');
        if (passtKnopf) gefunden = true;
      }
      if (!gefunden) wahl = 'alle';

      var anzahl = 0;
      for (var j = 0; j < karten.length; j++) {
        var passt = wahl === 'alle' || karten[j].getAttribute('data-status') === wahl;
        karten[j].classList.toggle('is-hidden', !passt);
        karten[j].classList.remove('is-shown');
        if (passt) {
          anzahl++;
          void karten[j].offsetWidth;
          karten[j].classList.add('is-shown');
        }
      }
      if (stand) {
        // Einheit steht am Element, damit dieselbe Mechanik Projekte
        // (projekte.html) und Wohnungen (wohnungen.html) zaehlen kann.
        var ein  = stand.getAttribute('data-einheit-ein')  || 'Projekt';
        var mehr = stand.getAttribute('data-einheit-mehr') || 'Projekte';
        stand.textContent = anzahl + ' ' + (anzahl === 1 ? ein : mehr);
      }
      if (urlSchreiben) {
        var url = wahl === 'alle'
          ? window.location.pathname
          : window.location.pathname + '?stand=' + wahl;
        history.replaceState(null, '', url);
      }
    }

    filter.addEventListener('click', function (e) {
      var knopf = e.target.closest('button[data-filter]');
      if (knopf) filterAnwenden(knopf.getAttribute('data-filter'), true);
    });

    // Zustand aus der Adresse wiederherstellen
    var params = new URLSearchParams(window.location.search);
    filterAnwenden(params.get('stand') || 'alle', false);
  }

  /* ---------- 9. Kontaktformular ---------- */
  /* ===== PORTFOLIO-DEMONSTRATION: Dieses Formular sendet NICHTS =========
     Das Formular prueft die Eingaben vollstaendig und zeigt die
     Rueckmeldung, uebermittelt aber bewusst keine Daten: Empfaenger waere
     das Postfach des Portfolio-Betreibers, waehrend die Datenschutz-
     erklaerung dieser Demo ein erfundenes Unternehmen nennt. Die
     Pflichtangabe nach Art. 19 DSG waere damit falsch.
     Keine Uebermittlung = kein Datenschutzrisiko.
     ====================================================================== */
  var form = document.getElementById('offerForm');
  if (form) {
    var fehlerbox = document.getElementById('fehlerBox');
    var okBox = document.getElementById('okBox');
    var anliegen = document.getElementById('f-anliegen');

    /* --- 9a. Zweige: Felder passen sich dem Anliegen an --- */
    function zweigWechsel() {
      var wahl = anliegen ? anliegen.value : 'anbieten';
      var gruppen = form.querySelectorAll('[data-zweig]');
      for (var i = 0; i < gruppen.length; i++) {
        var passt = gruppen[i].getAttribute('data-zweig').split(' ').indexOf(wahl) !== -1;
        gruppen[i].hidden = !passt;
        // Versteckte Felder duerfen nicht validiert werden
        var felder = gruppen[i].querySelectorAll('input, select, textarea');
        for (var f = 0; f < felder.length; f++) felder[f].disabled = !passt;
      }
    }
    if (anliegen) {
      anliegen.addEventListener('change', zweigWechsel);
      zweigWechsel();
    }

    /* --- 9b. Feldpruefung --- */
    function feldFehler(input, schlecht) {
      var huelle = input.closest('.field, .consent');
      if (huelle) huelle.classList.toggle('has-error', schlecht);
      input.setAttribute('aria-invalid', schlecht ? 'true' : 'false');
      var err = huelle ? huelle.querySelector('.err') : null;
      if (err && err.id) {
        if (schlecht) input.setAttribute('aria-describedby', err.id);
        else input.removeAttribute('aria-describedby');
      }
    }

    form.addEventListener('input', function (e) {
      if (e.target.matches('input, select, textarea')) feldFehler(e.target, false);
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var fehler = [];

      function pruefe(id, bedingung, meldung) {
        var el = document.getElementById(id);
        if (!el || el.disabled) return;
        var schlecht = !bedingung(el);
        feldFehler(el, schlecht);
        if (schlecht) fehler.push({ el: el, meldung: meldung });
      }

      pruefe('f-name', function (el) { return el.value.trim().length > 0; },
             'Bitte tragen Sie Ihren Namen ein.');
      pruefe('f-mail', function (el) { return /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(el.value.trim()); },
             'Bitte prüfen Sie Ihre E-Mail-Adresse.');
      pruefe('f-priv', function (el) { return el.checked; },
             'Bitte bestätigen Sie die Datenschutzerklärung.');

      /* Weitere Pflichtfelder stehen im HTML, nicht hier: ein Feld mit
         data-pflicht="…" traegt seine eigene Fehlermeldung. So bleibt
         diese Datei fuer alle Seiten dieselbe. */
      var weitere = form.querySelectorAll('[data-pflicht]');
      for (var w = 0; w < weitere.length; w++) {
        (function (el) {
          if (!el.id) return;
          pruefe(el.id, function (e2) { return e2.value.trim().length > 0; },
                 el.getAttribute('data-pflicht'));
        })(weitere[w]);
      }

      /* Die Zusammenfassung soll der sichtbaren Reihenfolge folgen, nicht
         der Reihenfolge der Pruefungen — sonst springt der Blick. */
      fehler.sort(function (a, b) {
        var lage = a.el.compareDocumentPosition(b.el);
        return (lage & Node.DOCUMENT_POSITION_FOLLOWING) ? -1 : 1;
      });

      if (fehler.length) {
        if (okBox) okBox.classList.remove('is-visible');
        // Meldung zusaetzlich direkt beim Feld ausgeben
        for (var m = 0; m < fehler.length; m++) {
          var huelle = fehler[m].el.closest('.field, .consent');
          var stelle = huelle ? huelle.querySelector('.err') : null;
          if (stelle) stelle.textContent = fehler[m].meldung;
        }
        // Fehlerzusammenfassung: Liste mit Spruenge zu den Feldern
        if (fehlerbox) {
          var li = fehler.map(function (f) {
            return '<li><a href="#' + f.el.id + '">' + f.meldung + '</a></li>';
          }).join('');
          fehlerbox.innerHTML =
            '<b>Die Anfrage kann noch nicht geprüft werden:</b><ul>' + li + '</ul>';
          fehlerbox.hidden = false;
        }
        fehler[0].el.focus();
        return;
      }

      if (fehlerbox) fehlerbox.hidden = true;

      /* ================= Kein Versand =================
         Die Eingaben verlassen den Browser nicht; der Hinweiskasten
         sagt das deutlich. Eine Demo darf keine Anfrage vortaeuschen,
         die niemand erhaelt. */
      form.reset();
      zweigWechsel();
      if (okBox) {
        okBox.classList.add('is-visible');
        okBox.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'center' });
      }
    });

    // Klick in der Fehlerzusammenfassung fokussiert das Feld
    if (fehlerbox) {
      fehlerbox.addEventListener('click', function (e) {
        var a = e.target.closest('a[href^="#"]');
        if (!a) return;
        e.preventDefault();
        var ziel = document.querySelector(a.getAttribute('href'));
        if (ziel) ziel.focus();
      });
    }
  }

  /* ---------- 10. Demo-Plakette ----------
     Kleine, aufklappbare Kennzeichnung als Portfolio-Demonstration.
     Vollstaendig per Tastatur bedienbar, Zustand ueber aria-expanded. */
  var badgeKnopf = document.getElementById('demoKnopf');
  var badgePanel = document.getElementById('demoPanel');
  if (badgeKnopf && badgePanel) {
    badgeKnopf.addEventListener('click', function () {
      var offen = badgeKnopf.getAttribute('aria-expanded') === 'true';
      badgeKnopf.setAttribute('aria-expanded', offen ? 'false' : 'true');
      badgePanel.hidden = offen;
    });
    document.addEventListener('keydown', function (e) {
      if ((e.key === 'Escape' || e.key === 'Esc') && !badgePanel.hidden) {
        badgePanel.hidden = true;
        badgeKnopf.setAttribute('aria-expanded', 'false');
        badgeKnopf.focus();
      }
    });
    document.addEventListener('click', function (e) {
      if (!badgePanel.hidden && !e.target.closest('.demobadge')) {
        badgePanel.hidden = true;
        badgeKnopf.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ---------- 11. Dialog (Muster-Expose) ----------
     Fokus wandert in den Dialog und bleibt dort; Escape und der
     Hintergrund schliessen; danach kehrt der Fokus zum Ausloeser zurueck. */
  var modal = document.getElementById('modal');
  if (modal) {
    var modalAusloeser = null;

    function modalElemente() {
      return modal.querySelectorAll('a[href], button:not([disabled])');
    }
    function modalOeffnen() {
      modalAusloeser = document.activeElement;
      modal.hidden = false;
      document.body.classList.add('is-locked');
      var zu = modal.querySelector('.modal__zu');
      if (zu) zu.focus();
    }
    function modalSchliessen() {
      modal.hidden = true;
      document.body.classList.remove('is-locked');
      if (modalAusloeser && modalAusloeser.focus) modalAusloeser.focus();
    }

    var oeffner = document.querySelectorAll('[data-modal-open]');
    for (var m = 0; m < oeffner.length; m++) {
      oeffner[m].addEventListener('click', function (e) { e.preventDefault(); modalOeffnen(); });
    }
    modal.addEventListener('click', function (e) {
      if (e.target.closest('.modal__zu') || e.target.classList.contains('modal__hinter')) {
        modalSchliessen();
      }
    });
    document.addEventListener('keydown', function (e) {
      if (modal.hidden) return;
      if (e.key === 'Escape' || e.key === 'Esc') { modalSchliessen(); return; }
      if (e.key !== 'Tab') return;
      var el = modalElemente();
      if (!el.length) return;
      var erstes = el[0], letztes = el[el.length - 1];
      if (e.shiftKey && document.activeElement === erstes) { e.preventDefault(); letztes.focus(); }
      else if (!e.shiftKey && document.activeElement === letztes) { e.preventDefault(); erstes.focus(); }
    });
  }

  /* ---------- 12. (entfaellt) Bildvorschau am Zeiger ----------
     Hier folgte frueher das Motiv der Zeile dem Mauszeiger. Der Effekt war
     huebsch, aber die Liste zeigte bis zur ersten Zeigerbewegung gar kein
     Bild — auf Touchgeraeten und fuer Suchmaschinen also nie. Bei
     Wohnungen ist das Bild aber das Erste, was jemand sehen will.
     Es steht deshalb fest in der Zeile; Erscheinen und Aufziehen macht
     jetzt allein CSS (style.css, Abschnitt 30). Kein JavaScript noetig. */

  /* ---------- 12b. Vorher/Nachher-Vergleich ----------
     Die Fallstudie zeigt Rohbau und fertigen Zustand. Mit JavaScript
     werden die beiden Motive uebereinandergelegt und ein Schieberegler
     wischt zwischen ihnen. Der Regler ist ein natives <input type=range>
     ueber der ganzen Flaeche: Ziehen mit Maus und Finger sowie die
     Pfeiltasten funktionieren damit von selbst. Aussehen: style.css 31m. */
  var paar = document.querySelector('[data-vergleich]');
  if (paar) {
    paar.classList.add('is-vergleich');

    var linie = document.createElement('div');
    linie.className = 'vergleich__linie';
    linie.setAttribute('aria-hidden', 'true');
    linie.innerHTML =
      '<span class="vergleich__griff">' +
      '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">' +
      '<path d="M9 6 3 12l6 6M15 6l6 6-6 6"/></svg></span>';

    var regler = document.createElement('input');
    regler.type = 'range';
    /* Nicht bis an die Raender: Am Anschlag verdeckte ein Bild das andere
       vollstaendig. Man sah dann nur noch eine Aufnahme und konnte nicht
       mehr erkennen, dass hier zwei Zustaende uebereinanderliegen. Mit
       diesen Grenzen bleibt immer ein Streifen beider Bilder stehen. */
    regler.min = '6';
    regler.max = '94';
    regler.step = 'any';
    regler.value = '50';
    regler.setAttribute('aria-label',
      'Vergleich zwischen Rohbauphase und fertigem Zustand: Regler nach links und rechts bewegen');

    var beruehrt = false;
    regler.addEventListener('input', function () {
      paar.style.setProperty('--pos', regler.value + '%');
      if (!beruehrt) { beruehrt = true; paar.classList.add('is-benutzt'); }
    });

    var hinweis = document.createElement('span');
    hinweis.className = 'vergleich__hinweis';
    hinweis.setAttribute('aria-hidden', 'true');
    hinweis.textContent = 'Ziehen';

    paar.appendChild(linie);
    paar.appendChild(hinweis);
    paar.appendChild(regler);

    /* Einmaliger Schwenk, sobald der Vergleich ins Bild kommt: Er zeigt in
       einer Bewegung, dass hinter dem Bild ein zweites liegt. Danach bleibt
       der Regler dort stehen, wo ihn die Bewegung abgesetzt hat. */
    if (!reduced && 'IntersectionObserver' in window) {
      var geschwenkt = false;
      var vio = new IntersectionObserver(function (eintraege) {
        eintraege.forEach(function (e) {
          if (!e.isIntersecting || geschwenkt) return;
          geschwenkt = true;
          vio.unobserve(paar);
          var start = null, dauer = 2200;
          var schwenk = function (t) {
            if (beruehrt) return;               // Eingriff hat Vorrang
            if (!start) start = t;
            var p = Math.min((t - start) / dauer, 1);
            // weich hin und zurueck: 50 -> 78 -> 30 -> 50
            var weg = Math.sin(p * Math.PI * 2) * 24;
            var wert = 50 + weg;
            regler.value = wert;
            paar.style.setProperty('--pos', wert + '%');
            if (p < 1) window.requestAnimationFrame(schwenk);
          };
          window.setTimeout(function () {
            if (!beruehrt) window.requestAnimationFrame(schwenk);
          }, 500);
        });
      }, { threshold: 0.45 });
      vio.observe(paar);
    }
  }

  /* ---------- 12c. Lichtschein auf den Feldern ----------
     Die Mitte des Scheins folgt dem Zeiger. Statt an jedem Feld einen
     eigenen Beobachter zu haengen, hoert ein einziger Zuhoerer am Dokument
     mit und rechnet die Position in Prozent des jeweiligen Feldes um.
     Aussehen und Ein-/Ausblendung stehen in style.css, Abschnitt 31s.

     Nur fuer echte Zeigergeraete: Auf Fingerbedienung gaebe es keinen
     Schwebezustand, und bei „weniger Bewegung“ bleibt alles still. */
  var feldWahl = '.steps article, .steps > li, .values article, ' +
                 '.projektkachel, .weiterkarte, .team article';

  if (!reduced && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    var feldGeplant = false, letztesFeld = null, letzteX = 0, letzteY = 0;

    document.addEventListener('pointermove', function (e) {
      var feld = e.target.closest ? e.target.closest(feldWahl) : null;
      if (!feld) return;
      letztesFeld = feld; letzteX = e.clientX; letzteY = e.clientY;
      if (feldGeplant) return;
      feldGeplant = true;
      window.requestAnimationFrame(function () {
        feldGeplant = false;
        if (!letztesFeld) return;
        var r = letztesFeld.getBoundingClientRect();
        if (!r.width || !r.height) return;
        letztesFeld.style.setProperty('--mx', ((letzteX - r.left) / r.width * 100).toFixed(1) + '%');
        letztesFeld.style.setProperty('--my', ((letzteY - r.top) / r.height * 100).toFixed(1) + '%');
      });
    }, { passive: true });
  }

  /* ---------- 13. Jahreszahl ---------- */
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

})();
