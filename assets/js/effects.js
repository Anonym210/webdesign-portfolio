/* =========================================================================
   ENVY WEB — Zusatzeffekte
   -------------------------------------------------------------------------
   Gehoert zu assets/css/effects.css. Laeuft unabhaengig von main.js: faellt
   dieses Skript aus, sieht die Seite aus wie vorher, nur ohne die Effekte.

   Enthalten: Lichtkegel auf Karten (3), raeumliche Neigung (4),
   Einfaerben des Versprechens beim Scrollen (6), Zahlen hochzaehlen (8).
   Die Aurora aus Effekt 1 braucht kein Javascript, die laeuft in CSS.
   ========================================================================= */
(function () {
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion:reduce)').matches;
  // Nur Geraete mit echtem Zeiger bekommen die Hover-Effekte. Auf dem
  // Telefon wuerde "hover" beim Tippen haengenbleiben.
  var fine = window.matchMedia('(hover:hover) and (pointer:fine)').matches;

  /* ---------------------------------------------------------------------
     3. Lichtkegel: Zeigerposition als --mx / --my in das Element schreiben.
     Dieselbe Funktion versorgt auch die Glanzkante von Effekt 4.
     --------------------------------------------------------------------- */
  var trackPointer = function (el) {
    el.addEventListener('mousemove', function (ev) {
      var r = el.getBoundingClientRect();
      el.style.setProperty('--mx', (ev.clientX - r.left) + 'px');
      el.style.setProperty('--my', (ev.clientY - r.top) + 'px');
    });
  };

  if (fine) {
    document.querySelectorAll('.fx-spot').forEach(trackPointer);
  }

  /* ---------------------------------------------------------------------
     4. Raeumliche Neigung. Geschrieben wird nur in --rx / --ry, den
     Rest setzt effects.css zusammen. So bleibt der Anhebe-Effekt aus
     style.css erhalten, statt vom Skript ueberschrieben zu werden.
     --------------------------------------------------------------------- */
  if (fine && !reduce) {
    document.querySelectorAll('.fx-tilt').forEach(function (card) {
      trackPointer(card);

      card.addEventListener('mousemove', function (ev) {
        var r = card.getBoundingClientRect();
        var px = (ev.clientX - r.left) / r.width - 0.5;   // -0.5 bis +0.5
        var py = (ev.clientY - r.top) / r.height - 0.5;
        card.classList.add('is-tilting');
        card.style.setProperty('--ry', (px * 9).toFixed(2) + 'deg');
        card.style.setProperty('--rx', (-py * 9).toFixed(2) + 'deg');
      });

      // Beim Verlassen zurueck in die Ruhelage, und zwar weich: die
      // Klasse is-tilting nimmt die kurze Dauer wieder weg.
      card.addEventListener('mouseleave', function () {
        card.classList.remove('is-tilting');
        card.style.setProperty('--rx', '0deg');
        card.style.setProperty('--ry', '0deg');
      });
    });
  }

  /* ---------------------------------------------------------------------
     6. Das Versprechen faerbt sich beim Scrollen Wort fuer Wort ein.
     Zerlegt wird nur reiner Text; steht ein Element im Satz, bleibt es
     unangetastet. Bei reduzierter Bewegung wird gar nicht erst zerlegt.
     --------------------------------------------------------------------- */
  var readEl = document.querySelector('.fx-read');
  if (readEl && !reduce) {
    var words = readEl.textContent.replace(/\s+/g, ' ').trim().split(' ');
    readEl.textContent = '';
    words.forEach(function (w, i) {
      var s = document.createElement('span');
      s.textContent = w;
      readEl.appendChild(s);
      if (i < words.length - 1) {
        readEl.appendChild(document.createTextNode(' '));
      }
    });

    var spans = readEl.querySelectorAll('span');
    var painting = false;

    var paint = function () {
      var r = readEl.getBoundingClientRect();
      // 0 = der Kasten betritt das Bild von unten, 1 = er ist durch.
      var p = (window.innerHeight * 0.82 - r.top) / (r.height + window.innerHeight * 0.3);
      p = Math.max(0, Math.min(1, p));
      var n = Math.round(p * spans.length);
      for (var i = 0; i < spans.length; i++) {
        spans[i].classList.toggle('on', i < n);
      }
      painting = false;
    };

    window.addEventListener('scroll', function () {
      if (!painting) { painting = true; requestAnimationFrame(paint); }
    }, { passive: true });
    window.addEventListener('resize', paint, { passive: true });
    paint();
  }

  /* ---------------------------------------------------------------------
     8. Zahlen zaehlen hoch, genau einmal. Danach meldet sich der
     Beobachter ab, damit es beim Zurueckscrollen nicht wieder losgeht.
     --------------------------------------------------------------------- */
  var stats = document.querySelector('.fxstats');
  if (stats && 'IntersectionObserver' in window) {
    var run = function (b) {
      var to = parseFloat(b.getAttribute('data-to'));
      var suf = b.getAttribute('data-suf') || '';
      var start = null;

      // Die Einheit ('%', '/100', 'CHF') kommt in ein eigenes <i>. Nur so
      // laesst sie sich kleiner setzen als die Zahl davor, sonst wuerde
      // '96/100' genauso gross stehen wie die 96 und der Blick faende
      // keinen Halt mehr.
      var schreibe = function (n) {
        b.textContent = n;
        if (suf) {
          var einheit = document.createElement('i');
          einheit.textContent = suf;
          b.appendChild(einheit);
        }
      };

      if (reduce) { schreibe(to); return; }

      requestAnimationFrame(function step(t) {
        if (start === null) { start = t; }
        var p = Math.min(1, (t - start) / 1300);
        var eased = 1 - Math.pow(1 - p, 3);   // schnell an, weich aus
        schreibe(Math.round(to * eased));
        if (p < 1) { requestAnimationFrame(step); }
      });
    };

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) { return; }
        io.unobserve(e.target);
        e.target.querySelectorAll('b[data-to]').forEach(run);
      });
    }, { threshold: 0.35 });

    io.observe(stats);
  }

  /* ---------------------------------------------------------------------
     9. Aufklappbare Bloecke fahren beim Oeffnen weich in der Hoehe auf,
     statt zu springen. Betrifft zwei Stellen im Paketbereich: die Karte
     "Nach dem Livegang: Betreuung" und darunter den Block "Was genau
     enthalten ist und was nicht". Beide sind <details>, beide bekommen
     dieselbe Bewegung, damit sich die Seite an einer Stelle nicht anders
     anfuehlt als an der anderen.

     Die Zeilen darin kommen gestaffelt herein, das erledigt effects.css
     ueber die Klasse [open], Abschnitte 11 und 12. Ohne Javascript oder
     bei reduzierter Bewegung klappen die Bloecke ganz normal und sofort
     auf; <details> braucht kein Skript.
     --------------------------------------------------------------------- */
  function weichAufklappen(block, huelle) {
    if (!block || !huelle || reduce || typeof block.animate !== 'function') { return; }

    var kopf = block.querySelector('summary');
    if (!kopf) { return; }
    var lauf = null;
    var zielOffen = block.open;   // wohin die laufende Bewegung will

    kopf.addEventListener('click', function (ev) {
      ev.preventDefault();

      /* Die Hoehe messen, solange die alte Bewegung noch laeuft: cancel()
         setzt die Huelle sofort auf ihr natuerliches Mass zurueck, danach
         waere der Messwert die volle Hoehe und die neue Bewegung wuerde
         von dort losspringen. */
      var jetzt = null;
      if (lauf) {
        jetzt = huelle.getBoundingClientRect().height;
        lauf.cancel();
        lauf = null;
      } else {
        /* Laeuft nichts, steht die Wahrheit im DOM. Wichtig, weil main.js
           den Paketblock auf breiten Schirmen von aussen aufklappt. */
        zielOffen = block.open;
      }

      zielOffen = !zielOffen;

      // Nur waehrend der Bewegung abschneiden. Danach wieder frei,
      // sonst kappt die Huelle die Schatten der Karten.
      huelle.style.overflow = 'hidden';

      if (zielOffen) { block.open = true; }   // offen, damit messbar

      var voll = Math.max(huelle.scrollHeight, 1);
      var von = jetzt !== null ? jetzt
              : (zielOffen ? 0 : huelle.getBoundingClientRect().height);
      var bis = zielOffen ? voll : 0;

      /* Die Dauer richtet sich nach dem verbleibenden Weg. Sonst braucht
         ein Klick mitten in der Bewegung genauso lange wie einer aus dem
         Stand, obwohl kaum noch Strecke uebrig ist. */
      var dauer = Math.max(120, Math.round((zielOffen ? 480 : 330) * Math.abs(bis - von) / voll));

      lauf = huelle.animate(
        { height: [von + 'px', bis + 'px'] },
        { duration: dauer, easing: 'cubic-bezier(.16,1,.3,1)' }
      );
      lauf.onfinish = function () {
        huelle.style.overflow = '';
        if (!zielOffen) { block.open = false; }   // erst am Ende zuklappen
        lauf = null;
      };
    });
  }

  var pi = document.querySelector('.pi');
  if (pi) { weichAufklappen(pi, pi.querySelector('.pi__wrap')); }

  var care = document.querySelector('.care');
  if (care) { weichAufklappen(care, care.querySelector('.care__inhalt')); }

  /* ---------------------------------------------------------------------
     10. Gleitende Markierung im Kopfmenue.

     main.js setzt beim Scrollen die Klasse is-active um. Vorher sprang
     damit ein weisser Hintergrund von Link zu Link: der eine blendete
     aus, der andere ein, was unruhig aussah. Jetzt liegt eine einzelne
     Pille hinter den Links, die an die neue Stelle faehrt.

     Beobachtet wird das class-Attribut der Links, nicht der Scrollstand.
     So bleibt diese Datei unabhaengig davon, wie main.js den aktiven
     Punkt bestimmt.
     --------------------------------------------------------------------- */
  var leiste = document.querySelector('.nav');
  if (leiste && leiste.children.length) {
    var pille = document.createElement('span');
    pille.className = 'navpill';
    leiste.appendChild(pille);
    leiste.classList.add('nav--pill');

    var linkListe = leiste.querySelectorAll('a[href^="#"]');

    var setzePille = function () {
      var aktiv = leiste.querySelector('a.is-active');
      if (!aktiv) { pille.classList.remove('is-da'); return; }
      pille.style.width = aktiv.offsetWidth + 'px';
      pille.style.transform = 'translateX(' + aktiv.offsetLeft + 'px) scaleX(1)';
      pille.classList.add('is-da');
    };

    // Auf den Klassenwechsel der Links hoeren.
    if ('MutationObserver' in window) {
      var wache = new MutationObserver(setzePille);
      for (var li = 0; li < linkListe.length; li++) {
        wache.observe(linkListe[li], { attributes: true, attributeFilter: ['class'] });
      }
    }
    window.addEventListener('resize', setzePille, { passive: true });
    // Schriften koennen die Breiten noch verschieben, deshalb nachfassen.
    if (document.fonts && document.fonts.ready) { document.fonts.ready.then(setzePille); }
    setzePille();
  }
})();
