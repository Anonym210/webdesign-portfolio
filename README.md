# Envy Web — Verkaufsseite + zwei Beispielwebsites

```
📄 index.html         → Die Verkaufsseite. Liegt bewusst im Wurzelverzeichnis,
                        damit Besucher unter der Hauptadresse direkt hier landen.
📄 impressum.html     → Rechtstexte der Verkaufsseite
📄 datenschutz.html
📁 assets/            → CSS, JavaScript, Schriften und Bilder der Verkaufsseite
📁 demo-massage/      → Beispielwebsite „AURELIA Massage & Wellness"
📁 demo-thai/         → Beispielwebsite „SABAI Thai Massage"
📄 uebersicht.html    → Interne Projektübersicht (noindex, nicht verlinkt)
📄 robots.txt         → sperrt die Beispielwebsites für Suchmaschinen
📄 sitemap.xml
📄 CREDITS.md         → Bildquellen und Lizenzen
```

Alles ist **reines HTML, CSS und JavaScript** — kein Baukasten, kein WordPress,
keine Datenbank, keine externen Bibliotheken. Seit der letzten Überarbeitung
lädt die Seite auch **keine Schriften mehr von Google**: alle Schriftdateien
liegen unter `assets/fonts/`. Damit gibt es beim Seitenaufruf keinen einzigen
Request an einen fremden Server — das ist der Grund, warum die Aussage
„ohne Tracking, ohne Cookie-Banner" auf der Seite überhaupt stehen darf.

---

## ❗ Was vor dem Bewerben der Adresse noch fehlt

Diese Punkte kann nur der Betreiber ausfüllen — die Stellen sind im Code mit
eckigen Klammern markiert:

| Was | Wo |
|---|---|
| **Formspree-Adresse eintragen** | `assets/js/main.js`, Abschnitt 8, Zeile `FORM_ENDPOINT`. Solange dort die Beispieladresse steht, zeigt das Formular bewusst eine Fehlermeldung statt „gesendet" — damit keine Anfrage unbemerkt verloren geht. Dasselbe gilt für beide Demo-Websites |
| **Adresse im Impressum** | `impressum.html` — Strasse, PLZ, Ort. **Pflicht** nach Art. 3 Abs. 1 lit. s UWG |
| **Adresse im Datenschutz** | `datenschutz.html`, Abschnitt 1 |
| **Hosting-Anbieter benennen** | `datenschutz.html`, Abschnitt 8 |
| **Ort und Region** | `index.html` — `[Ort]` und `[Region]` im Hero, im Abschnitt „Über mich", im FAQ und im Kontaktbereich |
| **Portraitfoto** | `assets/img/portrait.jpg`, hochkant ca. 900 × 1100 px. Fehlt die Datei, zeigt der Abschnitt automatisch einen Hinweiskasten statt eines kaputten Bildes |
| **Eigene E-Mail-Adresse** | Aktuell `ejdin.aliti@greenecoservice.ch`. Eine Adresse auf der eigenen Domain wirkt stimmiger — kommt in `index.html` (Kontakt, Fehlermeldung, Footer, strukturierte Daten) und in beiden Rechtstexten vor |

Telefon und WhatsApp (076 522 05 25) sind bereits überall eingetragen.

---

## 0. Wo alles liegt

| | |
|---|---|
| **Live-Adresse (Verkaufsseite)** | https://anonym210.github.io/webdesign-portfolio/ |
| Beispiel AURELIA | https://anonym210.github.io/webdesign-portfolio/demo-massage/ |
| Beispiel SABAI | https://anonym210.github.io/webdesign-portfolio/demo-thai/ |
| Projektübersicht (intern) | https://anonym210.github.io/webdesign-portfolio/uebersicht.html |
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

### Marke

| | |
|---|---|
| **Name** | Envy Web |
| **Logo** | Buchstabe „E" im dunklen Quadrat, darunter „ENVY / Web" |
| **Wunschdomain** | `envyweb.ch` — noch nicht registriert |
| **Claim (Titel & Footer)** | Websites, um die man Sie beneidet. |
| **Claim (Hero-Eyebrow)** | Neid ist das beste Kompliment |

Vor der Registrierung prüfen: Domain bei [nic.ch](https://www.nic.ch),
Markenkonflikte bei [swissreg.ch](https://www.swissreg.ch) in Klasse 42.

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

Doppelklick auf `index.html`, `demo-massage/index.html` oder
`demo-thai/index.html`.

Auf der Verkaufsseite sind beide Beispielwebsites als *Live-Vorschau* im Browserfenster
eingebettet — in Chrome und Edge funktioniert das auch per Doppelklick (getestet).

> Sollte die Vorschau in Ihrem Browser leer bleiben, starten Sie kurz einen
> lokalen Server — im Projektordner Terminal öffnen und eingeben:
>
> ```
> python -m http.server 8000
> ```
>
> Dann im Browser `http://localhost:8000/` aufrufen.

---

## 2. Was Sie zuerst ändern sollten

### 2.1 Verkaufsseite (Ihre eigene Seite)

| Wo | Was |
|---|---|
| `index.html` | Der Markenname **Envy Web** ist bereits überall eingetragen. Falls Sie ihn später ändern: „Envy Web", „ENVY" und den Logo-Buchstaben „E" ersetzen |
| `index.html` | Telefon **076 522 05 25** und WhatsApp sind eingetragen. Zu ersetzen bleiben `[Ort]` und `[Region]` |
| `index.html` | Falls die Nummer wechselt: `tel:+41765220525` und `https://wa.me/41765220525` anpassen (WhatsApp-Format: `41` + Nummer ohne führende 0) |
| `index.html` | Abschnitt **Pakete**: Preise prüfen. Eingetragen sind CHF 890.– / CHF 1'690.– / ab CHF 2'900.– sowie Betreuung ab CHF 29.–/Monat — marktübliche Werte für Einzelunternehmer in der Schweiz |
| `impressum.html` | Strasse, PLZ und Ort ergänzen — **Pflicht** nach Art. 3 Abs. 1 lit. s UWG. Es ist hinterlegt, dass keine MWST-Pflicht besteht |
| `datenschutz.html` | Abschnitt 1 (Adresse) und Abschnitt 8 (Hoster) ausfüllen. Der Text richtet sich nach revDSG und nennt Formspree bereits als Auftragsbearbeiter |
| Favicon / Logo | Der Buchstabe „E" steht an drei Stellen: im `<link rel="icon">` im Kopf und zweimal als `<span class="brand__mark">E</span>` |

**Farbe ändern:** in `assets/css/style.css` ganz oben im Block `:root`
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

### 2.3 Demo-Thai-Website

Die zweite Demo ist eine **Thai-Massage-Praxis** — bewusst eine andere
Bild- und Farbwelt als AURELIA, damit Sie im Gespräch zwei echte
Alternativen zeigen können.

| Unterschied | AURELIA | SABAI |
|---|---|---|
| Ausrichtung | Wellness allgemein | Thai-Massage, Sport, Tiefengewebe |
| Grundton | helles Creme, Bronze | warmer Sand, Teakholz, Gold, Jade |
| Schriften | Cormorant Garamond + Jost | Marcellus + Karla |
| Aufbau | Bildhero, Karten, Galerie | Bildhero, grosse Bild-Text-Blöcke, dunkles Teakband |
| Stimmung | hell und leicht | warm, dunkel, abendlich |

**Gestalterische Kniffe, die Sie übernehmen können:**

- Alle Fotos tragen die Klasse `warm` (`filter: sepia(.14) saturate(1.06)`).
  Das zieht Bilder aus unterschiedlichen Quellen auf einen gemeinsamen
  warmen Ton — ohne diesen Trick wirkt jede Bildersammlung zusammengewürfelt.
- Die sechs Rituale wechseln die Seite (`nth-child(even)` setzt das Bild
  nach rechts). Das ergibt Rhythmus, ohne dass man Karten braucht.
- Das dunkle Teakband in der Mitte gibt der Seite Tiefe und trennt
  Behandlungen von Preisen.

**Farben ändern:** in `demo-thai/assets/css/style.css` im Block `:root`.
Die wichtigsten sind `--gold` (Akzent), `--teak` (dunkle Bänder) und
`--sand` (Grundfläche).

---

## 3. Eigene Referenzen einbauen

Im Portfolio stehen aktuell zwei Referenzen (beide Demos). So fügen Sie Ihre
bereits gebauten Seiten hinzu:

1. **Screenshot machen** — Browserfenster auf ca. 1440 px Breite ziehen,
   Screenshot der Startseite aufnehmen, als JPG speichern.
2. Datei nach `assets/img/` legen, z. B. `referenz-1.jpg`.
3. In `index.html` den Abschnitt `<!-- ============ REFERENZEN ============ -->`
   suchen. Dort steht ein **auskommentierter Vorlage-Block**
   („VORLAGE FÜR EIGENE REFERENZEN"). Diesen kopieren, die Kommentarzeichen
   `<!--` und `-->` entfernen und anpassen:
   - Bildpfad
   - Branche / Art des Projekts
   - Name des Unternehmens
   - Beschreibung (2–3 Sätze: Aufgabe → Lösung → Ergebnis)
   - Stichworte und Link
4. Die neue Karte hinter die bestehenden setzen — oder eine Demo ersetzen,
   sobald Sie genug echte Kundenprojekte haben.

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

Der Versand ist **fertig eingebaut** — es fehlt nur noch die eigene Adresse des
Formulardienstes. Alle drei Websites benutzen denselben Mechanismus.

### Einrichten (einmalig, ca. 5 Minuten)

1. Kostenloses Konto auf [formspree.io](https://formspree.io) anlegen.
2. Neues Formular anlegen — Sie bekommen eine Adresse wie
   `https://formspree.io/f/xayzabcd`.
3. Diese Adresse eintragen in **`assets/js/main.js`**, Abschnitt 8:
   ```js
   var FORM_ENDPOINT = 'https://formspree.io/f/xayzabcd';
   ```
4. Dasselbe in `demo-massage/assets/js/main.js` und `demo-thai/assets/js/main.js`,
   falls auch die Beispielformulare wirklich zustellen sollen.
5. Die allererste Testanfrage abschicken und die Bestätigungsmail von Formspree
   anklicken — sonst kommt nichts an.

### Warum das Formular vorher einen Fehler zeigt

Solange die Beispieladresse eingetragen ist, meldet das Formular
„Die Anfrage konnte nicht übermittelt werden" und nennt E-Mail und Telefonnummer.
Das ist bewusst so: Eine Anfrage, die niemand bekommt, darf nicht als
„gesendet" bestätigt werden — sonst gehen echte Aufträge unbemerkt verloren.

### Was sonst noch eingebaut ist

- **Spamfalle** (`_gotcha`): ein für Menschen unsichtbares Feld. Füllt ein Bot es
  aus, verwirft Formspree die Anfrage.
- **Betreffzeile** (`_subject`), damit die Mail im Postfach sofort erkennbar ist.
- **Fehlerbehandlung**: Bei Netzproblemen oder Serverfehlern erscheint die
  Fehlermeldung mit direkter E-Mail und Telefonnummer statt einer stillen Panne.
- **Prüfung im Browser** vor dem Versand: Name, E-Mail-Format, Nachricht und
  die Datenschutz-Einwilligung.

### Andere Wege

| Dienst | Änderung |
|---|---|
| **Web3Forms** | `FORM_ENDPOINT` auf `https://api.web3forms.com/submit` setzen und im HTML ein verstecktes Feld `access_key` ergänzen |
| **Netlify Forms** | Nur bei Hosting über Netlify: dem `<form>` `data-netlify="true"` und `name="kontakt"` geben |
| **Eigenes PHP** | `FORM_ENDPOINT` auf `'kontakt.php'` setzen — der `fetch`-Aufruf funktioniert unverändert |

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

### Schriften — bereits lokal eingebunden

Die Schriften kommen **nicht** mehr von Google. Unter `assets/fonts/` liegen die
WOFF2-Dateien, eingebunden über `assets/css/fonts.css`. Geladen werden nur die
Zeichensätze *latin* und *latin-ext*, damit die Dateien klein bleiben.

| Website | Schriften |
|---|---|
| Verkaufsseite | Instrument Serif, Inter |
| AURELIA | Cormorant Garamond, Jost |
| SABAI | Marcellus, Karla |

Wer eine Schrift austauschen will: neue WOFF2-Dateien bei
[google-webfonts-helper](https://gwfh.mranftl.com) holen, nach `assets/fonts/`
legen und in `assets/css/fonts.css` die `@font-face`-Regeln anpassen.

### Social-Vorschaubild

`assets/img/social-preview.png` (1200 × 630 px) ist das Bild, das beim Teilen des
Links in WhatsApp, LinkedIn oder Facebook erscheint. Die **Quelle** dazu ist
`assets/social-preview.html` — Text oder Farben dort ändern und das Bild neu
erzeugen (der genaue Befehl steht als Kommentar in der Datei).

### Suchmaschinen

- `robots.txt` sperrt `demo-massage/`, `demo-thai/` und `uebersicht.html`.
- Beide Beispielwebsites tragen zusätzlich `noindex, nofollow` und blenden beim
  direkten Aufruf einen Hinweis „Beispielwebsite" ein — in der eingebetteten
  Vorschau auf der Verkaufsseite bleibt er ausgeblendet.
- `sitemap.xml` enthält nur die Verkaufsseite.
- Bei eigener Domain: Adresse in `robots.txt`, `sitemap.xml` sowie bei
  `canonical`, `og:url` und `og:image` in `index.html` ersetzen.

---

## 7. Ordnerstruktur

```
index.html                Verkaufsseite (Wurzelverzeichnis = Hauptadresse)
impressum.html
datenschutz.html
uebersicht.html           interne Projektübersicht, noindex
robots.txt  sitemap.xml  .nojekyll
assets/
├── css/style.css          Alle Stile, oben in :root die Farben
├── css/fonts.css          Lokale @font-face-Regeln
├── js/main.js             Menü, Reveal, FAQ, Vorschau-Skalierung, Formular
├── fonts/                 Instrument Serif + Inter als WOFF2
├── img/                   social-preview.png, später portrait.jpg und Referenzen
└── social-preview.html    Quelle für das Vorschaubild

demo-massage/             Beispielwebsite AURELIA
├── index.html  impressum.html  datenschutz.html
└── assets/css · js · fonts · img (13 Bilder) · img-reserve (2 Bilder)

demo-thai/                Beispielwebsite SABAI
├── index.html  impressum.html  datenschutz.html
└── assets/css · js · fonts · img (8 Bilder)
```

Bildquellen und Lizenzen stehen in **[CREDITS.md](CREDITS.md)**.
