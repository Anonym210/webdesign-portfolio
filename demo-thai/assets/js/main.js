/* =========================================================================
   SABAI — Thai Massage & Körperarbeit
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
        links[i].style.transitionDelay = open ? (0.06 * i + 0.1) + 's' : '0s';
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

  /* ---------- 6. FAQ ---------- */
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

  /* ---------- 7. Galerie-Lightbox ---------- */
  var gallery = document.getElementById('gallery');
  var lb      = document.getElementById('lightbox');

  if (gallery && lb) {
    var lbImg  = document.getElementById('lbImg');
    var lbCap  = document.getElementById('lbCap');
    var btns   = Array.prototype.slice.call(gallery.querySelectorAll('button'));
    var index  = 0;
    var lastFocus = null;

    function show(i) {
      index = (i + btns.length) % btns.length;
      var b = btns[index];
      var thumb = b.querySelector('img');
      // data-src erlaubt eine groessere Fassung; sonst das Vorschaubild nehmen
      lbImg.src = b.getAttribute('data-src') || thumb.getAttribute('src');
      lbImg.alt = thumb.alt;
      lbCap.textContent = b.getAttribute('data-cap') || '';
    }
    function openLb(i) {
      lastFocus = document.activeElement;
      show(i);
      lb.classList.add('is-open');
      document.body.classList.add('is-locked');
      document.getElementById('lbClose').focus();
    }
    function closeLb() {
      lb.classList.remove('is-open');
      document.body.classList.remove('is-locked');
      if (lastFocus) lastFocus.focus();
    }

    gallery.addEventListener('click', function (e) {
      var b = e.target.closest('button');
      if (b) openLb(btns.indexOf(b));
    });
    document.getElementById('lbClose').addEventListener('click', closeLb);
    document.getElementById('lbPrev').addEventListener('click', function () { show(index - 1); });
    document.getElementById('lbNext').addEventListener('click', function () { show(index + 1); });
    lb.addEventListener('click', function (e) { if (e.target === lb) closeLb(); });

    document.addEventListener('keydown', function (e) {
      if (!lb.classList.contains('is-open')) return;
      if (e.key === 'Escape')     closeLb();
      if (e.key === 'ArrowLeft')  show(index - 1);
      if (e.key === 'ArrowRight') show(index + 1);
    });

    var startX = null;
    lb.addEventListener('touchstart', function (e) { startX = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener('touchend', function (e) {
      if (startX === null) return;
      var dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 50) show(dx > 0 ? index - 1 : index + 1);
      startX = null;
    });
  }

  /* ---------- 8. Terminformular ---------- */
  var form = document.getElementById('terminForm');
  if (form) {
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
        priv.parentElement.style.color = '#A8452C';
        window.setTimeout(function () { priv.parentElement.style.color = ''; }, 2500);
      }

      if (!ok) {
        var first = form.querySelector('.field.has-error input');
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
          btn.textContent = 'Anfrage senden';
        }, 4000);
      }, 800);
    });
  }

  /* ---------- 9. Jahreszahl ---------- */
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
