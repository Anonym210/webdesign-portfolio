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

      if (reduce) { b.textContent = to + suf; return; }

      requestAnimationFrame(function step(t) {
        if (start === null) { start = t; }
        var p = Math.min(1, (t - start) / 1300);
        var eased = 1 - Math.pow(1 - p, 3);   // schnell an, weich aus
        b.textContent = Math.round(to * eased) + suf;
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
})();
