# Webdesign-Paket: Portfolio + Demo-Website

Zwei fertige, eigenständige Websites:

```
📄 index.html        → Startseite mit Verweis auf beide Websites
📁 portfolio/        → Ihre eigene Seite, mit der Sie Webseiten verkaufen
📁 demo-massage/     → Demo-Website „AURELIA Massage & Wellness" als Referenz
📄 CREDITS.md        → Bildquellen und Lizenzen
```

Die `index.html` im Hauptordner ist nur die Übersicht für dieses Projekt.
Wenn Sie einem Kunden eine einzelne Website übergeben, laden Sie ausschliesslich
den Inhalt des jeweiligen Unterordners hoch — die Übersicht bleibt hier.

Beides ist **reines HTML, CSS und JavaScript** — kein Baukasten, kein WordPress,
keine Datenbank, keine Abhängigkeiten. Das heisst: schnell, wartbar, überall
lauffähig und für den Kunden problemlos übertragbar.

---

## 0. Wo alles liegt

| | |
|---|---|
| **Live-Adresse** | https://anonym210.github.io/webdesign-portfolio/ |
| Portfolio | https://anonym210.github.io/webdesign-portfolio/portfolio/ |
| Demo-Massage | https://anonym210.github.io/webdesign-portfolio/demo-massage/ |
| **Code** | https://github.com/Anonym210/webdesign-portfolio |

Die Seiten liegen auf GitHub Pages und sind öffentlich erreichbar.

### Änderungen veröffentlichen

Nach jeder Änderung an den Dateien im Terminal in diesem Ordner:

```
git add -A
git commit -m "Kurz beschreiben, was geändert wurde"
git push
```

Nach etwa einer Minute ist die Live-Adresse aktualisiert. Die Änderung ist
also erst online, wenn Sie `git push` ausgeführt haben — Speichern allein
genügt nicht.

### Eigene Domain verbinden

Wenn Sie später eine `.ch`-Domain haben: im Repo unter
*Settings → Pages → Custom domain* eintragen und beim Domain-Anbieter einen
CNAME-Eintrag auf `anonym210.github.io` setzen. HTTPS aktiviert GitHub
danach automatisch.

> **Vor dem ernsthaften Einsatz:** Das Impressum enthält noch Platzhalter in
> eckigen Klammern. Solange dort keine echten Angaben stehen, sollten Sie die
> Adresse nicht aktiv bewerben — siehe Abschnitt 2.1.

---

## 1. Lokal ansehen

Doppelklick auf `portfolio/index.html` oder `demo-massage/index.html`.

Auf der Portfolio-Seite ist die Demo-Website als *Live-Vorschau* im Browserfenster
eingebettet — in Chrome und Edge funktioniert das auch per Doppelklick (getestet).

> Sollte die Vorschau in Ihrem Browser leer bleiben, starten Sie kurz einen
> lokalen Server — im Projektordner Terminal öffnen und eingeben:
>
> ```
> python -m http.server 8000
> ```
>
> Dann im Browser `http://localhost:8000/portfolio/` aufrufen.

---

## 2. Was Sie zuerst ändern sollten

### 2.1 Portfolio (Ihre eigene Seite)

| Wo | Was |
|---|---|
| `portfolio/index.html` | „ALITI" durch Ihren Namen / Firmennamen ersetzen (Suchen & Ersetzen) |
| `portfolio/index.html` | Telefonnummer `+41 00 000 00 00` ersetzen — kommt im Kontaktbereich, im Footer und in den strukturierten Daten vor. Die E-Mail `ejdin.aliti@greenecoservice.ch` ist bereits überall eingetragen |
| `portfolio/index.html` | WhatsApp-Link `https://wa.me/41000000000` auf Ihre Nummer setzen (Format: `41` + Nummer ohne führende 0 — aus 079 123 45 67 wird `41791234567`) |
| `portfolio/index.html` | Abschnitt **Pakete**: Preise prüfen. Eingetragen sind CHF 890.– / CHF 1'690.– / ab CHF 2'900.– sowie Betreuung ab CHF 29.–/Monat — marktübliche Werte für Einzelunternehmer in der Schweiz |
| `portfolio/impressum.html` | Alle `[Platzhalter]` in eckigen Klammern ersetzen — **Pflicht** nach Art. 3 Abs. 1 lit. s UWG (Name, vollständige Adresse, E-Mail) |
| `portfolio/datenschutz.html` | Abschnitt 1 und 7 ausfüllen (Ihre Daten, Ihr Hoster). Text richtet sich nach revDSG |
| Favicon / Logo | Der Buchstabe „A" steht an drei Stellen: im `<link rel="icon">` im Kopf und zweimal als `<span class="brand__mark">A</span>` |

**Farbe ändern:** in `portfolio/assets/css/style.css` ganz oben im Block `:root`
die Zeilen `--accent` und `--accent-deep` anpassen. Die ganze Seite zieht mit.

### 2.2 Demo-Massage-Website

Diese Seite ist als **Verkaufsargument** gedacht — Sie zeigen sie im Gespräch und
sagen: „So etwas baue ich für Sie." Alle Inhalte sind erfunden (Adresse, Preise,
Bewertungen, Name „Marie Lindner").

Wenn Sie sie an einen echten Massage-Kunden verkaufen, ersetzen Sie:
Firmenname, Adresse, Telefon, E-Mail, Öffnungszeiten, Behandlungen, Preisliste,
die Zitate im Abschnitt „Stimmen" sowie Impressum und Datenschutz.

Die Preise sind bereits auf Schweizer Niveau gesetzt (CHF 95.– bis CHF 320.–,
10er-Karte ab CHF 1'080.–) — realistisch für eine Einzelpraxis. Im Impressum ist
ausserdem ein EMR-Eintrag vorgesehen: Ohne EMR- oder ASCA-Anerkennung zahlen
Zusatzversicherungen nicht, deshalb steht das auf fast jeder echten
Massage-Website. Bei einem Kunden ohne Anerkennung diesen Abschnitt streichen.

> ⚠️ Die Zahlen in der dunklen Leiste („12 Jahre Erfahrung", „4,9 von 5 · 128 Bewertungen")
> sind Demo-Werte. Erfundene Bewertungen auf einer echten Kundenseite sind
> wettbewerbsrechtlich angreifbar — vor dem Livegang durch echte Werte ersetzen
> oder den Abschnitt entfernen.

---

## 3. Eigene Referenzen einbauen

Im Portfolio gibt es aktuell eine echte Referenz (die Demo) und eine
Platzhalter-Karte. So fügen Sie Ihre bereits gebauten Seiten hinzu:

1. **Screenshot machen** — Browserfenster auf ca. 1440 px Breite ziehen,
   Screenshot der Startseite aufnehmen, als JPG speichern.
2. Datei nach `portfolio/assets/img/` legen, z. B. `referenz-1.jpg`.
3. In `portfolio/index.html` den Abschnitt `<!-- ============ REFERENZEN ============ -->`
   suchen. Dort steht ein **auskommentierter Vorlage-Block**
   („VORLAGE FÜR EIGENE REFERENZEN"). Diesen kopieren, die Kommentarzeichen
   `<!--` und `-->` entfernen und anpassen:
   - Bildpfad
   - Branche / Art des Projekts
   - Name des Unternehmens
   - Beschreibung (2–3 Sätze: Aufgabe → Lösung → Ergebnis)
   - Stichworte und Link
4. Eine Platzhalter-Karte (`project--empty`) löschen.

### Statt Screenshot: Live-Vorschau

Wenn die Website mit im Paket liegt (wie die Demo), können Sie sie live einbetten —
das wirkt deutlich stärker als ein Bild:

```html
<div class="livepreview" data-preview>
  <iframe src="../ordnername/index.html" title="Vorschau" loading="lazy" scrolling="no" tabindex="-1"></iframe>
  <a class="livepreview__veil" href="../ordnername/index.html" target="_blank" rel="noopener" aria-label="Website öffnen"></a>
</div>
```

Das JavaScript skaliert die Seite automatisch auf die Kartenbreite herunter.

---

## 4. Kontaktformular scharf schalten

**Beide Formulare bestätigen aktuell nur — sie versenden nichts.** Das ist Absicht,
damit die Demo ohne Server läuft. Für den Livebetrieb eine Variante wählen:

### Variante A — Formspree (am einfachsten, kostenlos für kleine Mengen)

1. Konto auf [formspree.io](https://formspree.io) anlegen, Formular erstellen, ID kopieren.
2. Im HTML das `<form>`-Tag ergänzen:
   ```html
   <form class="form" id="contactForm" action="https://formspree.io/f/IHRE-ID" method="POST">
   ```
3. In `assets/js/main.js` den Block unterhalb von `if (!ok) { … return; }` bis zum
   Ende des Submit-Handlers löschen — dann übernimmt der Browser den Versand.
   Die Validierung darüber bleibt aktiv.

### Variante B — Netlify Forms

Wenn Sie über Netlify hosten: dem `<form>`-Tag `netlify` und `name="kontakt"`
hinzufügen. Netlify erkennt das Formular beim Deployment automatisch.

### Variante C — Eigenes PHP auf dem Webspace

`kontakt.php` anlegen und im JavaScript statt der Demo-Bestätigung senden:
```js
fetch('kontakt.php', { method: 'POST', body: new FormData(form) })
```

Die passende Stelle ist in beiden `main.js`-Dateien mit einem grossen
Kommentarblock markiert.

---

## 5. Online stellen

| Weg | Aufwand | Kosten |
|---|---|---|
| **Netlify** — Ordner auf [app.netlify.com/drop](https://app.netlify.com/drop) ziehen | 1 Minute | kostenlos, eigene Domain möglich |
| **Cloudflare Pages** | 5 Minuten | kostenlos |
| **Infomaniak** (Schweizer Rechenzentrum, für Kunden oft ein Verkaufsargument) | FTP-Upload | ab ca. CHF 6/Monat |
| **Hostpoint** (Schweizer Anbieter, `.ch`-Domains) | FTP-Upload | ab ca. CHF 8/Monat |

Wichtig bei eigener Domain: **HTTPS aktivieren** (bei Netlify und Cloudflare
automatisch, beim Webspace meist ein Klick „SSL/Let's Encrypt").

Beim Upload auf klassischen Webspace kommt der **Inhalt** des jeweiligen Ordners
ins Wurzelverzeichnis — also `index.html` direkt in `httpdocs/` bzw. `public_html/`,
nicht den Ordner selbst.

---

## 5b. Schweizer Besonderheiten

Beide Seiten sind auf den Schweizer Markt ausgelegt:

- **Sprache** — durchgehend Schweizer Rechtschreibung, also `ss` statt `ss`.
  `lang="de-CH"` ist gesetzt, damit Browser und Vorlesehilfen richtig arbeiten.
- **Währung** — CHF mit Apostroph als Tausendertrennzeichen (`1'690.–`) und
  `exkl. MWST`. Falls Sie unter CHF 100'000 Jahresumsatz bleiben und nicht
  mehrwertsteuerpflichtig sind: den Zusatz `exkl. MWST` streichen.
- **Impressum** — nach Art. 3 Abs. 1 lit. s UWG. Pflicht sind Name,
  vollständige Adresse und E-Mail-Adresse. Kein „§ 5 DDG", kein Rundfunkstaatsvertrag.
- **Datenschutz** — nach revDSG (in Kraft seit 1. September 2023) mit Verweis
  auf den EDÖB. Der Text weist zusätzlich darauf hin, dass für Besucher aus der
  EU die DSGVO sinngemäss gilt — das ist bei Schweizer Websites mit
  grenznahem Publikum sinnvoll.
- **Zahlungsmittel** — in der Demo sind Debit-/Kreditkarte, TWINT und Rechnung
  hinterlegt statt EC-Karte und PayPal.
- **Telefonformat** — `+41`, in der Anzeige die gewohnte Schreibweise
  (`044 123 45 67`).

> **Ein Verkaufsargument, das oft zieht:** Hosting in einem Schweizer
> Rechenzentrum (Infomaniak, Hostpoint). Für Praxen, Treuhänder und Ärzte ist
> das häufig ausschlaggebend — und kostet Sie nichts extra.

---

## 6. Technisches (für Ihr Verkaufsgespräch)

Beide Seiten haben bereits eingebaut:

- **Responsiv** — Handy, Tablet, Desktop; Mobile-Menü mit Overlay
- **Keine Cookies, kein Tracking** → kein Cookie-Banner nötig
- **SEO-Grundlagen** — Seitentitel, Meta-Description, Open-Graph-Bild für
  WhatsApp/Facebook-Vorschau, saubere Überschriftenstruktur
- **Strukturierte Daten** (schema.org) für Google — bei der Massage-Demo als
  `HealthAndBeautyBusiness` mit Adresse und Öffnungszeiten
- **Barrierefreiheit** — Alt-Texte, sichtbare Fokusrahmen, ARIA-Beschriftungen,
  Respektieren von „Bewegung reduzieren" in den Systemeinstellungen
- **Performance** — Bilder mit `loading="lazy"`, keine Fremdbibliotheken;
  gesamtes JavaScript beider Seiten unter 10 KB
- **Rechtstexte** — Impressum und Datenschutz als eigene Seiten angelegt

### Schriften lokal einbinden (optional, datenschutzfreundlicher)

Die Schriften kommen aktuell von Google Fonts. Wer die Verbindung zu Google
vermeiden will:

1. Schriften bei [google-webfonts-helper](https://gwfh.mranftl.com) als WOFF2 laden
2. Nach `assets/fonts/` legen
3. Im HTML die beiden `<link>`-Zeilen zu `fonts.googleapis.com` entfernen
4. Im CSS `@font-face`-Regeln ergänzen
5. Im Datenschutztext den Abschnitt „Schriftarten" entfernen

---

## 7. Ordnerstruktur

```
portfolio/
├── index.html            Startseite
├── impressum.html
├── datenschutz.html
└── assets/
    ├── css/style.css     Alle Stile, oben in :root die Farben
    ├── js/main.js        Menü, Reveal, FAQ, Vorschau-Skalierung, Formular
    └── img/              (leer — hier kommen Ihre Referenz-Screenshots hin)

demo-massage/
├── index.html            Onepager
├── impressum.html
├── datenschutz.html
└── assets/
    ├── css/style.css
    ├── js/main.js        Menü, Reveal, FAQ, Galerie-Lightbox, Formular
    ├── img/              13 verwendete Bilder
    └── img-reserve/      2 Bilder in Reserve
```

Bildquellen und Lizenzen stehen in **[CREDITS.md](CREDITS.md)**.
