# Envy Web — Verkaufsseite + drei Beispielwebsites

```
📄 index.html         → Die Verkaufsseite. Liegt bewusst im Wurzelverzeichnis,
                        damit Besucher unter der Hauptadresse direkt hier landen.
📄 impressum.html     → Rechtstexte der Verkaufsseite
📄 datenschutz.html
📁 assets/            → CSS, JavaScript, Schriften und Bilder der Verkaufsseite
📁 demo-immobilien/   → Beispielwebsite „ARVEN Immobilien“ (22 Seiten)
📁 demo-massage/      → Beispielwebsite „AURELIA Massage & Wellness“
                        (seit August 2026 nicht mehr auf der Verkaufsseite
                        verlinkt, bleibt aber erreichbar)
📁 demo-thai/         → Beispielwebsite „SABAI Thai Massage“
📁 demo-restaurant/   → Beispielwebsite „AVERA Contemporary Dining“
📄 uebersicht.html    → Interne Projektübersicht (noindex, nicht verlinkt)
📄 robots.txt         → sperrt nur uebersicht.html und die Vorschaubild-Quelle;
                        die Demos regeln ihr "noindex" selbst (siehe unten)
📄 404.html           → eigene Fehlerseite (GitHub Pages nutzt sie automatisch)
📄 sitemap.xml
📄 favicon.svg        → Seitensymbol; jede Demo hat ihr eigenes im Unterordner
📄 favicon.ico        → dasselbe Symbol als Rueckfallebene (16/32/48 Pixel)
📄 CREDITS.md         → Bildquellen und Lizenzen
```

Alles ist **reines HTML, CSS und JavaScript** — kein Baukasten, kein WordPress,
keine Datenbank, keine externen Bibliotheken. Seit der letzten Überarbeitung
lädt die Seite auch **keine Schriften mehr von Google**: alle Schriftdateien
liegen unter `assets/fonts/`. Damit gibt es beim Seitenaufruf keinen einzigen
Request an einen fremden Server — das ist der Grund, warum die Aussage
„ohne Tracking, ohne Cookie-Banner“ auf der Seite überhaupt stehen darf.

---

## ✅ Stand der Pflichtangaben

Bereits erledigt: Formspree-Adresse (`FORM_ENDPOINT` in allen drei `main.js`),
Adresse und Ort in Impressum, Datenschutz, Hero und Kontaktbereich,
Hosting-Anbieter (GitHub Pages, `datenschutz.html` Abschnitt 7),
Telefon und WhatsApp (076 522 05 25),
E-Mail-Adresse auf der eigenen Domain (`ejdin.aliti@envyweb.ch`).

Damit sind alle Pflichtangaben gesetzt.

**Wenn die E-Mail-Adresse einmal wechselt**, kommt sie an diesen Stellen vor —
am einfachsten mit einer projektweiten Suche nach der alten Adresse ersetzen:

| Wo | Wie oft |
|---|---|
| `index.html`, `en/index.html`, `fr/index.html` | Kontaktbereich, Fehlermeldung des Formulars, Footer, strukturierte Daten (`"email"`) |
| `impressum.html`, `datenschutz.html` — je auch in `en/` und `fr/` | je einmal |
| `llms.txt` | Abschnitt „Kontakt" |

Nicht anfassen: die Adressen in `demo-massage/`, `demo-thai/` und
`demo-restaurant/` gehören zu den erfundenen Beispielbetrieben.

---

## 0. Wo alles liegt

| | |
|---|---|
| **Live-Adresse (Verkaufsseite)** | https://envyweb.ch/ |
| Beispiel ARVEN | https://envyweb.ch/demo-immobilien/ |
| Beispiel SABAI | https://envyweb.ch/demo-thai/ |
| Beispiel AVERA | https://envyweb.ch/demo-restaurant/ |
| Beispiel AURELIA (nicht mehr verlinkt) | https://envyweb.ch/demo-massage/ |
| Projektübersicht (intern) | https://envyweb.ch/uebersicht.html |
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
| **Logo** | Monogramm: kursives „E“ mit Glanzstern auf violettem Verlauf, daneben „ENVY / Web“ |
| **Domain** | `envyweb.ch` — registriert bei Hostpoint, verbunden mit GitHub Pages |
| **Claim (Titel & Footer)** | Websites, um die man Sie beneidet. |
| **Claim (Hero-Eyebrow)** | Neid ist das beste Kompliment |

Vor der Registrierung prüfen: Domain bei [nic.ch](https://www.nic.ch),
Markenkonflikte bei [swissreg.ch](https://www.swissreg.ch) in Klasse 42.

### Eigene Domain

`envyweb.ch` ist bei Hostpoint registriert und per DNS auf GitHub Pages
verbunden: vier A-Records auf die GitHub-Pages-IPs (185.199.108–111.153),
vier AAAA-Records auf die zugehörigen IPv6-Adressen, sowie ein
CNAME-Record für `www` auf `anonym210.github.io`. Die Datei `CNAME` im
Repo-Root enthält `envyweb.ch`. In den Repo-Settings unter *Pages* ist die
Custom Domain eingetragen und „Enforce HTTPS" aktiviert.

> **Stand:** Impressum und Datenschutzerklärung sind vollständig ausgefüllt
> (Adresse, Kontakt, Hosting-Anbieter). Offen ist nur noch die E-Mail-Adresse
> auf eigener Domain — siehe Tabelle oben.

---

## 1. Lokal ansehen

Doppelklick auf `index.html`, `demo-massage/index.html`, `demo-thai/index.html`
oder `demo-restaurant/index.html`.

Auf der Verkaufsseite sind alle drei Beispielwebsites als *Live-Vorschau* im Browserfenster
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
| `index.html` | Der Markenname **Envy Web** ist bereits überall eingetragen. Falls Sie ihn später ändern: „Envy Web“, „ENVY“ und den Logo-Buchstaben „E“ ersetzen |
| `index.html` | Telefon **076 522 05 25**, WhatsApp sowie Ort und Region (Dübendorf / Grossraum Zürich) sind eingetragen |
| `index.html` | Falls die Nummer wechselt: `tel:+41765220525` und `https://wa.me/41765220525` anpassen (WhatsApp-Format: `41` + Nummer ohne führende 0) |
| `index.html` | Abschnitt **Pakete**: Preise prüfen. Eingetragen sind CHF 890.– / CHF 1'690.– / ab CHF 2'900.–, Betreuung CHF 29.–/Monat (1 Std. inkl.) und CHF 30.–/Stunde für Änderungen ohne Paket. Bewusst am unteren Rand des Schweizer Markts, solange noch keine Referenzen mit Kundenstimmen live sind |
| `impressum.html` | Adresse ist eingetragen (**Pflicht** nach Art. 3 Abs. 1 lit. s UWG). Es ist hinterlegt, dass keine MWST-Pflicht besteht |
| `datenschutz.html` | Vollständig ausgefüllt: Abschnitt 1 (Adresse), Abschnitt 7 (Hoster: GitHub Pages). Der Text richtet sich nach revDSG und nennt Formspree als Auftragsbearbeiter |
| Favicon / Logo | Der Buchstabe „E“ steht an drei Stellen: im `<link rel="icon">` im Kopf und zweimal als `<span class="brand__mark">E</span>` |

**Farbe ändern:** in `assets/css/style.css` ganz oben im Block `:root`
die Zeilen `--accent` und `--accent-deep` anpassen. Die ganze Seite zieht mit.

### 2.2 Demo-Massage-Website

Diese Seite ist als **Verkaufsargument** gedacht — Sie zeigen sie im Gespräch und
sagen: „So etwas baue ich für Sie.“ Alle Inhalte sind erfunden (Adresse, Preise,
Bewertungen, Name „Marie Lindner“).

Wenn Sie sie an einen echten Massage-Kunden verkaufen, ersetzen Sie:
Firmenname, Adresse, Telefon, E-Mail, Öffnungszeiten, Behandlungen, Preisliste,
die Zitate im Abschnitt „Stimmen“ sowie Impressum und Datenschutz.

Die Preise sind bereits auf Schweizer Niveau gesetzt (CHF 95.– bis CHF 320.–,
10er-Karte ab CHF 1'080.–) — realistisch für eine Einzelpraxis. Im Impressum ist
ausserdem ein EMR-Eintrag vorgesehen: Ohne EMR- oder ASCA-Anerkennung zahlen
Zusatzversicherungen nicht, deshalb steht das auf fast jeder echten
Massage-Website. Bei einem Kunden ohne Anerkennung diesen Abschnitt streichen.

> ⚠️ Die Zahlen in der dunklen Leiste („12 Jahre Erfahrung“, „100 % Bio-Öle“)
> und die drei Kundenzitate im Abschnitt „Stimmen“ sind Demo-Werte. Erfundene
> Angaben und Bewertungen auf einer echten Kundenseite sind wettbewerbsrechtlich
> angreifbar — vor dem Livegang durch echte Werte ersetzen oder entfernen.

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

**Die vier Bausteine, die den Auftritt tragen:**

| Baustein | Klasse | Was er tut |
|---|---|---|
| Objektliste | `.oliste` | Projekte und Wohnungen stehen als Liste mit Linien statt als Kartenraster — das erlaubt viel grössere Titel und wirkt wie ein Bestandsverzeichnis. Das Bild erscheint beim Überfahren und folgt dem Zeiger (`main.js`, Abschnitt 12). Ohne Zeiger — also auf dem Handy — steht es fest in der Zeile. |
| Klebende Bildspalte | `.story--klebe` | Das Bild bleibt stehen, während der Text daneben weiterläuft. Nur ab 1041 px, darunter stehen beide ohnehin übereinander. |
| Redaktionsspalte | `.artikelzone` | Beitragsseiten haben links eine klebende Metaleiste (Thema, Datum, Lesezeit, Autor) und rechts die Textspalte. |
| Zweispaltiger Kopf | `.pagehero--zwei` | Titel links gross, Vorspann rechts unten auf derselben Grundlinie. Wird nur auf Seiten gesetzt, deren Kopf sonst nichts weiter enthält. |

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

### 2.4 Demo-Restaurant-Website

Die dritte Demo ist ein **Restaurant** — die einzige dunkle Seite im Portfolio.
Sie beweist im Gespräch, dass nicht jede Website hell und freundlich aussehen
muss, und deckt mit der Gastronomie eine Branche ab, die auf der Verkaufsseite
ohnehin zuoberst in der Liste „Passend für“ steht.

| Unterschied | AURELIA / SABAI | AVERA |
|---|---|---|
| Grundton | hell, warm | Russ, Tannengrün, Messing |
| Schriften | Cormorant / Marcellus | Bodoni Moda + Jost |
| Aufbau | Karten und Bildstrecken | zwei randlose Bildbänder, eine gesetzte Menükarte |
| Formular | Terminanfrage | Reservation mit Datum, Uhrzeit, Anzahl Gäste |
| Stimmung | Praxis am Vormittag | Restaurant am Abend |

**Gestalterische Kniffe, die Sie übernehmen können:**

- Auf dunklem Grund ist reines Weiss zu hart. Der Textton ist deshalb
  `--linen` (#F3EEE4) und nie #FFFFFF; die Dunkeltöne sind leicht ins Braune
  gezogen statt neutralgrau.
- Die Kursive der Bodoni trägt den ganzen Auftritt: In jeder Überschrift steht
  genau ein `<em>` in Messing. Mehr Auszeichnung würde die Wirkung sofort
  verbrauchen.
- Die Menükarte ist ein eigenes Objekt mit doppelter Rahmenlinie
  (`.card::before`). Sie zitiert die gedruckte Karte, ohne sie nachzuäffen.
- Beide Bildbänder (Hero, Der Raum) legen den Text über einen Verlauf statt
  über eine flächige Abdunklung — so bleibt das Foto sichtbar und die Schrift
  trotzdem lesbar.

**Farben ändern:** in `demo-restaurant/assets/css/style.css` im Block `:root`.
Die wichtigsten sind `--brass` (Akzent), `--night` (Grundfläche) und
`--forest` (die grünen Bänder).

**Herkunft:** Marke, Texte und Bildmotive stammen aus dem Repository
`Anonym210/avera-restaurant-portfolio`. Dort liegt AVERA als Next.js-Anwendung
mit Cloudflare Worker und Datenbank — auf GitHub Pages nicht lauffähig. Diese
Fassung ist ein statischer Nachbau im Stil der übrigen Demos.

---

### 2.5 Demo-Immobilien-Website

Die vierte Demo ist ein **Immobilienunternehmen** (Ankauf → Sanierung →
Vermietung/Verkauf) — und die einzige, die **nicht als Onepager** gebaut ist.
Sie ersetzt AURELIA im Referenzen-Raster der Verkaufsseite.

**Die 22 Seiten im Überblick:**

| Bereich | Dateien |
|---|---|
| Start | `index.html` |
| Projekte | `projekte.html` + 6 Detailseiten `projekt-*.html` |
| Wohnungen mieten | `wohnungen.html` + 3 Detailseiten `wohnung-*.html` |
| Journal | `journal.html` + 4 Fachbeiträge `journal-*.html` |
| Verkaufen | `verkaufen.html` (Landingpage für Eigentümerschaften) |
| Firma | `ueber-uns.html`, `kontakt.html` |
| Rechtstexte | `impressum.html`, `datenschutz.html` |

| Unterschied | übrige Demos | ARVEN |
|---|---|---|
| Aufbau | Onepager | 22 Seiten mit eigener Navigation |
| Grundton | warm (Bronze, Gold, Messing) | Lehm und Sand, Terrakotta und Ocker |
| Schriften | Cormorant / Marcellus / Bodoni | Instrument Serif + Instrument Sans |
| Formular | Termin/Reservation | drei Fassungen: Ankaufsanfrage, Preiseinschätzung, Besichtigung |
| Besonderes | — | Objektliste mit Bildvorschau am Zeiger, klebende Bildspalte, Redaktionsspalte im Journal, Objektfilter, Zahlen-Zähler, Laufband, Seitenübergänge |

**Wo was gepflegt wird:**

- **Navigation** steht in jeder Seite im `<header>` und im `<nav class="mobilemenu">`.
  Kommt ein Eintrag dazu, muss er in beiden stehen — und im Fussbereich.
- **Wohnungen** sind statisches HTML in `wohnungen.html` (Übersichtskarte)
  und der zugehörigen `wohnung-*.html`. Eine Wohnung, die weg ist, wird zur
  „vermietet“-Karte: Klasse `object--belegt` statt `object--link`, und der
  Link im `<h3>` fällt weg.
- **Journalbeiträge** bestehen aus der Kachel in `journal.html` und der
  eigenen Seite. Der Fliesstext liegt in `<div class="artikel">` — die
  Bausteine dort (`.fakten` für Tabellen, `blockquote`, `ol.reihenfolge`)
  reichen für die meisten Texte aus.
- **Filterzähler**: Die Einheit steht am Element selbst
  (`data-einheit-ein="Wohnung" data-einheit-mehr="Wohnungen"`), damit
  dieselbe JavaScript-Funktion Projekte und Wohnungen zählen kann.

**Gestalterische Kniffe, die Sie übernehmen können:**

- Die Seitenübergänge kommen aus zwei Zeilen CSS (`@view-transition`) —
  Browser ohne Unterstützung wechseln einfach hart, nichts geht kaputt.
- Wie bei den übrigen Demos trägt **genau ein kursives `<em>`** je
  Überschrift die Auszeichnung — hier in Terrakotta. Die Kursive von
  Instrument Serif ist deutlich schmaler als die Aufrechte, deshalb läuft
  sie im Stylesheet mit `font-size:1.06em`; ohne das wirkt das
  Akzentwort kleiner als seine Nachbarn.
- **Instrument Serif hat nur einen Schnitt.** Der Kontrast kommt aus
  Grösse und Kursive, nicht aus Fettungen. Ein `font-weight:600` auf einer
  Überschrift würde der Browser rechnen — das Ergebnis sieht schlechter aus
  als das Original. Deshalb steht in `fonts.css` bewusst kein
  Gewichtsbereich für die Serife.
- Jede Unterseite trägt eine grosse **Geisterzahl** im Seitenkopf
  (`.pagehero__ghost`) — 24 Projekte, 31 Wohnungen, 4 Beiträge, 10 Tage
  bis zum Angebot.
- Die Verkaufsseite stellt **Vermittlung und Direktankauf gegenüber**
  (`.gegen`) und nennt im Fusstext offen den Nachteil des Direktankaufs.
  Ein eingeräumter Nachteil macht die übrigen Aussagen glaubwürdiger.
- Der Hinweis unter den Objektkarten („Diese Seite ist unsere Visitenkarte,
  nicht unser Schaufenster") beantwortet die Frage nach der Objektpflege,
  bevor ein Interessent sie stellt.

**Farben ändern:** in `demo-immobilien/assets/css/style.css` im Block `:root`.
Die wichtigsten sind `--clay` (Akzent, gebrannter Ton), `--paper`
(Grundfläche in Lehm), `--deep` (dunkle Bänder) und `--ocker` (Zweitakzent).
Die Namen sagen, was sie sind — wer die Farbe wechselt, muss den Namen
mitwechseln, sonst steht später ein Blau unter dem Namen `--clay`.

---

## 2.6 Sprachen pflegen (Deutsch / Englisch / Französisch)

Die Verkaufsseite gibt es dreimal. **Deutsch ist die Leitfassung** — Änderungen
immer zuerst dort, dann nachziehen:

| | |
|---|---|
| Deutsch | `index.html`, `impressum.html`, `datenschutz.html` (Wurzelverzeichnis) |
| Englisch | `en/…` |
| Französisch | `fr/…` |

Der Umschalter oben rechts besteht aus **reinen Links, ohne JavaScript**.
Es gibt bewusst **keine** automatische Weiterleitung anhand der Browsersprache:
das bricht den Zurück-Knopf und verhindert, dass Google die Sprachfassungen
einzeln aufnimmt.

**Was jetzt dreifach existiert — bei jeder Änderung alle drei anfassen:**

- Preise (890 / 1'690 / 2'900, Betreuung 29.– mit 1 Std., Stundensatz 30.–, Sprache 390.–)
- Telefonnummer, WhatsApp-Link, E-Mail-Adresse
- alle Texte der Startseite
- die FAQ — **und zwar doppelt je Sprache:** sichtbar *und* als `FAQPage`-Strukturdaten
  im selben Dokument. Beide müssen wortgleich bleiben, sonst melden Google und
  die KI-Suchen etwas anderes, als auf der Seite steht.

**Pfade in `en/` und `fr/`:** Diese Ordner haben **keine** eigenen Assets, sondern
verweisen mit `../assets/…` auf die gemeinsamen Dateien — CSS, JavaScript,
Schriften und Bilder existieren also nur einmal. Beim Kopieren einer Datei ins
Sprachverzeichnis müssen alle `assets/…` und `demo-…`-Pfade auf `../` umgestellt
werden. Kontrolle (muss leer bleiben):

```
grep -nE '(href|src)="(assets/|demo-)' en/*.html fr/*.html
```

**Kein `<base>`-Tag einbauen.** Das sieht nach der eleganten Lösung für die Pfade
aus, biegt aber jeden der über 30 Sprunglinks (`#kontakt` usw.) auf die Basis-URL
um und zerstört das sanfte Scrollen.

**hreflang:** Der Vier-Zeilen-Block im `<head>` ist in allen drei Fassungen einer
Seite buchstabengleich. Nie sprachspezifisch anpassen — nur so erkennt Google sie
als zusammengehörig. Dasselbe gilt für die Alternates in `sitemap.xml`.

**Rechtstexte:** Englisch und Französisch tragen oben einen Hinweis, dass die
deutsche Fassung rechtlich massgebend ist. Gesetzesbezeichnungen (UWG, MWSTG,
DSG/LPD) bleiben mit dem Schweizer Original stehen.

**Texte, die JavaScript erzeugt** (Burger-Beschriftung, „Wird gesendet …") stehen
gesammelt in `assets/js/main.js`, Abschnitt 0. Die Datei ist für alle Sprachen
dieselbe und wählt anhand von `<html lang>` aus.

---

## 3. Eigene Referenzen einbauen

Im Portfolio stehen aktuell drei Referenzen (alle drei Demos). So fügen Sie Ihre
bereits gebauten Seiten hinzu:

1. **Screenshot machen** — Browserfenster auf ca. 1440 px Breite ziehen,
   Screenshot der Startseite aufnehmen, als JPG speichern.
2. Datei nach `assets/img/` legen, z. B. `referenz-1.jpg`.
3. In `index.html` den Abschnitt `<!-- ============ REFERENZEN ============ -->`
   suchen. Dort steht ein **auskommentierter Vorlage-Block**
   („VORLAGE FÜR EIGENE REFERENZEN“). Diesen kopieren, die Kommentarzeichen
   `<!--` und `-->` entfernen und anpassen:
   - Bildpfad
   - Branche / Art des Projekts
   - Name des Unternehmens
   - Beschreibung (2–3 Sätze: Aufgabe → Lösung → Ergebnis)
   - Stichworte und Link
4. Die neue Karte hinter die bestehenden setzen — oder eine Demo ersetzen,
   sobald Sie genug echte Kundenprojekte haben.

### Vorschaubild einer Seite, die mit im Paket liegt

Früher stand hier ein `<iframe>` mit der echten Seite. Das kostete über ein
Megabyte, bevor ein Besucher etwas gesehen hatte, deshalb stehen dort jetzt
Standbilder. Ein Klick öffnet weiterhin die echte Seite:

```html
<div class="livepreview">
  <img src="assets/img/vorschau-ordnername.webp" alt="Startseite von …" loading="lazy" width="1440" height="990">
  <a class="livepreview__veil" href="../ordnername/index.html" target="_blank" rel="noopener" aria-label="Website öffnen"></a>
</div>
```

Das Bild erzeugt `node tools/vorschaubilder.js` — einmal laufen lassen, dann
liegen WebP und JPEG in einfacher und doppelter Auflösung in `assets/img/`.

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
4. Dasselbe in `demo-massage/assets/js/main.js`, `demo-thai/assets/js/main.js`
   und `demo-restaurant/assets/js/main.js`, falls auch die Beispielformulare
   wirklich zustellen sollen.
5. Die allererste Testanfrage abschicken und die Bestätigungsmail von Formspree
   anklicken — sonst kommt nichts an.

### Warum das Formular vorher einen Fehler zeigt

Solange die Beispieladresse eingetragen ist, meldet das Formular
„Die Anfrage konnte nicht übermittelt werden“ und nennt E-Mail und Telefonnummer.
Das ist bewusst so: Eine Anfrage, die niemand bekommt, darf nicht als
„gesendet“ bestätigt werden — sonst gehen echte Aufträge unbemerkt verloren.

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
automatisch, beim Webspace meist ein Klick „SSL/Let's Encrypt“).

Beim Upload auf klassischen Webspace kommt der **Inhalt** des jeweiligen Ordners
ins Wurzelverzeichnis — also `index.html` direkt in `httpdocs/` bzw. `public_html/`,
nicht den Ordner selbst.

---

## 5b. Schweizer Besonderheiten

Beide Seiten sind auf den Schweizer Markt ausgelegt:

- **Sprache** — durchgehend Schweizer Rechtschreibung, also `ss` statt `ß`.
  `lang="de-CH"` ist gesetzt, damit Browser und Vorlesehilfen richtig arbeiten.
- **Währung** — CHF mit Apostroph als Tausendertrennzeichen (`1'690.–`) und
  `exkl. MWST`. Falls Sie unter CHF 100'000 Jahresumsatz bleiben und nicht
  mehrwertsteuerpflichtig sind: den Zusatz `exkl. MWST` streichen.
- **Impressum** — nach Art. 3 Abs. 1 lit. s UWG. Pflicht sind Name,
  vollständige Adresse und E-Mail-Adresse. Kein „§ 5 DDG“, kein Rundfunkstaatsvertrag.
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
- **Strukturierte Daten** (schema.org) für Google — `ProfessionalService` und
  `FAQPage` auf der Verkaufsseite, bei der Massage-Demo `HealthAndBeautyBusiness`
  mit Adresse und Öffnungszeiten
- **KI-Sichtbarkeit** — `llms.txt` im Wurzelverzeichnis fasst Leistungen, Preise
  und Kontakt für Sprachmodelle zusammen; die `FAQPage`-Strukturdaten lassen
  sich von ChatGPT, Perplexity & Co. direkt als Frage-Antwort-Paare auslesen.
  Bei Änderungen an der FAQ in `index.html` beide Stellen synchron halten
- **Barrierefreiheit** — Alt-Texte, sichtbare Fokusrahmen, ARIA-Beschriftungen,
  Respektieren von „Bewegung reduzieren“ in den Systemeinstellungen
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
| ARVEN | Instrument Serif, Instrument Sans (eigene Kopie im Demo-Ordner) |
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

- Die drei Beispielwebsites tragen `noindex, nofollow` und blenden beim
  direkten Aufruf einen Hinweis „Beispielwebsite“ ein — in der eingebetteten
  Vorschau auf der Verkaufsseite bleibt er ausgeblendet.
- `robots.txt` sperrt die Demos BEWUSST NICHT: Google kann das `noindex`
  nur lesen, wenn der Crawl erlaubt ist. Ein Disallow würde die Anweisung
  unsichtbar machen und die URLs könnten als „indexiert, obwohl blockiert“
  auftauchen. Gesperrt sind nur `uebersicht.html` (nirgends verlinkt) und
  `assets/social-preview.html`.
- `sitemap.xml` enthält nur die Verkaufsseite.
- Bei einem Domainwechsel: Adresse in `CNAME`, `robots.txt`, `sitemap.xml`
  sowie bei `canonical`, `og:url` und `og:image` in `index.html`, `en/index.html`
  und `fr/index.html` ersetzen.

---

## 7. Ordnerstruktur

```
index.html                Verkaufsseite, Deutsch (Wurzelverzeichnis = Hauptadresse)
impressum.html
datenschutz.html
en/                       dieselben drei Seiten auf Englisch (nutzen ../assets/)
fr/                       dieselben drei Seiten auf Französisch
uebersicht.html           interne Projektübersicht, noindex
robots.txt  sitemap.xml  llms.txt  .nojekyll
favicon.svg  favicon.ico   Seitensymbol als echte Dateien — als data:-URI im
                          HTML kann Google es nicht crawlen und zeigt statt-
                          dessen eine graue Weltkugel im Suchergebnis
assets/
├── css/style.css          Alle Stile, oben in :root die Farben
├── css/fonts.css          Lokale @font-face-Regeln
├── js/main.js             Menü, Reveal, FAQ, Vorschau-Skalierung, Formular
├── fonts/                 Instrument Serif + Inter als WOFF2
├── img/                   social-preview.png, portrait.jpg, später Referenzen
└── social-preview.html    Quelle für das Vorschaubild

demo-immobilien/          Beispielwebsite ARVEN (mehrseitig, 12 Seiten)
├── index.html  projekte.html  ueber-uns.html  kontakt.html
├── projekt-stadthaus.html   (Detailseite, im Verkauf: Exposé + Grundriss)
├── projekt-feldweg.html  projekt-kirchweg.html  projekt-buchenweg.html
├── projekt-halden.html  projekt-lindenhof.html
├── impressum.html  datenschutz.html
└── assets/css · js · fonts · img (JPEG + WebP + AVIF, srcset-Varianten)

Die wiederkehrenden Demodaten der ARVEN-Demo (Firma, UID CHE-318.742.965,
24 Projekte, 31 Wohnungen, sechs Projektdossiers) sind bewusst als
statisches HTML gepflegt — die Seite funktioniert vollständig ohne
JavaScript. Meldungstexte, die JavaScript ausgibt, stehen zentral in
assets/js/main.js, Abschnitt 0.

demo-massage/             Beispielwebsite AURELIA (nicht mehr verlinkt)
├── index.html  impressum.html  datenschutz.html
└── assets/css · js · fonts · img (13 Bilder)

demo-thai/                Beispielwebsite SABAI
├── index.html  impressum.html  datenschutz.html
└── assets/css · js · fonts · img (8 Bilder)

demo-restaurant/          Beispielwebsite AVERA
├── index.html  impressum.html  datenschutz.html
└── assets/css · js · fonts · img (3 Bilder)
```

Bildquellen und Lizenzen stehen in **[CREDITS.md](CREDITS.md)**.
