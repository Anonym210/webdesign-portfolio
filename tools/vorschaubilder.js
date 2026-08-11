/* =========================================================================
   Vorschaubilder der Beispielwebsites neu erzeugen
   -------------------------------------------------------------------------
   Im Hero und bei den drei Referenzen stand frueher je ein <iframe> mit
   der echten Demoseite. Das sah gut aus, kostete aber ueber ein Megabyte,
   bevor ein Besucher irgendetwas gesehen hatte. Jetzt stehen dort
   Standbilder; ein Klick oeffnet weiterhin die echte Seite.

   Wenn Sie eine der drei Demoseiten aendern, einmal dieses Skript laufen
   lassen, dann stimmen die Bilder wieder:

       node tools/vorschaubilder.js

   Es startet einen kleinen Server auf dem Projektordner, laedt jede Demo
   in 1440 Pixel Breite (dieselbe Breite, mit der die Rahmen frueher
   geladen wurden, damit das Desktop-Layout erscheint und nicht die
   Handyansicht), fotografiert den oberen Ausschnitt und uebergibt ihn an
   tools/vorschaubilder.py. Das legt je Stelle vier Dateien in assets/img
   ab: WebP und JPEG, in einfacher und doppelter Aufloesung.

   Voraussetzungen: Node mit Playwright und Python mit Pillow.
   ========================================================================= */
const path = require('path');
const http = require('http');
const fs = require('fs');
const { execSync, execFileSync } = require('child_process');

const WURZEL = path.resolve(__dirname, '..');
const ROH = path.join(WURZEL, 'tools', '.roh');
const PORT = 8477;
const BASIS_BREITE = 1440;

/* Die vier Stellen. Das Seitenverhaeltnis kommt aus style.css:
     Hero            .hero .livepreview      4 / 3.4
     Referenzkarten  .project .livepreview  16 / 11
   Die Zielbreiten entsprechen der Breite, in der das Bild auf einem
   gewoehnlichen Bildschirm tatsaechlich erscheint. */
const STELLEN = [
  { name: 'vorschau-thai-hero',  pfad: '/demo-thai/',        verhaeltnis: 4 / 3.4, breite: 600 },
  { name: 'vorschau-massage',    pfad: '/demo-massage/',     verhaeltnis: 16 / 11, breite: 380 },
  { name: 'vorschau-thai',       pfad: '/demo-thai/',        verhaeltnis: 16 / 11, breite: 380 },
  { name: 'vorschau-restaurant', pfad: '/demo-restaurant/',  verhaeltnis: 16 / 11, breite: 380 },
];

const MIME = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png',
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8', '.xml': 'application/xml; charset=utf-8' };

function playwrightLaden() {
  const versuche = [
    () => require('playwright'),
    () => require(path.join(execSync('npm root -g', { encoding: 'utf8' }).trim(), 'playwright')),
    () => {
      // Playwright liegt haeufig nur im Zwischenspeicher von npx.
      const cache = path.join(process.env.LOCALAPPDATA || process.env.HOME, 'npm-cache', '_npx');
      for (const ordner of fs.readdirSync(cache)) {
        const p = path.join(cache, ordner, 'node_modules', 'playwright');
        if (fs.existsSync(p)) return require(p);
      }
      throw new Error('nicht im npx-Zwischenspeicher');
    },
  ];
  for (const v of versuche) { try { return v(); } catch (e) {} }
  console.error('Playwright wurde nicht gefunden. Einmal einrichten mit:\n' +
                '  npm install -D playwright && npx playwright install chromium');
  process.exit(1);
}

const wait = ms => new Promise(r => setTimeout(r, ms));

(async () => {
  const { chromium } = playwrightLaden();
  fs.mkdirSync(ROH, { recursive: true });

  const server = http.createServer((req, res) => {
    let rel = decodeURIComponent(req.url.split('?')[0]);
    if (rel.endsWith('/')) rel += 'index.html';
    const voll = path.join(WURZEL, rel);
    fs.readFile(voll, (err, daten) => {
      if (err) { res.writeHead(404); res.end('nicht gefunden'); return; }
      res.writeHead(200, { 'Content-Type': MIME[path.extname(voll).toLowerCase()] || 'application/octet-stream' });
      res.end(daten);
    });
  });
  await new Promise(r => server.listen(PORT, r));

  const browser = await chromium.launch();
  const auftrag = [];

  for (const s of STELLEN) {
    const hoehe = Math.round(BASIS_BREITE / s.verhaeltnis);
    const page = await browser.newPage({
      viewport: { width: BASIS_BREITE, height: hoehe },
      deviceScaleFactor: 2,
      // Die Demos haben eigene Auftrittsanimationen. Ohne diese Zeile
      // erwischt der Screenshot sie mitten in der Bewegung.
      reducedMotion: 'reduce',
    });
    await page.goto('http://localhost:' + PORT + s.pfad, { waitUntil: 'networkidle' });
    // Der Hinweisbalken der Demo wird fuer das Standbild ausgeblendet: die
    // Karte auf der Hauptseite kennzeichnet das Beispiel bereits zweifach,
    // mit dem Etikett oben und mit "Inhalte erfunden" darunter. Auf der
    // Demoseite selbst bleibt der Balken selbstverstaendlich stehen.
    await page.addStyleTag({ content: '.demoflag{ display:none !important; }' });
    await wait(1500);
    const datei = path.join(ROH, s.name + '.png');
    await page.screenshot({ path: datei });
    await page.close();
    auftrag.push({ roh: datei, name: s.name, breite: s.breite, verhaeltnis: s.verhaeltnis });
    console.log('fotografiert:', s.pfad, BASIS_BREITE + 'x' + hoehe);
  }

  await browser.close();
  server.close();

  // Skalieren und in die Endformate bringen uebernimmt Python mit Pillow.
  const py = path.join(WURZEL, 'tools', 'vorschaubilder.py');
  execFileSync('python', [py, JSON.stringify(auftrag)], { stdio: 'inherit' });
  fs.rmSync(ROH, { recursive: true, force: true });
})().catch(e => { console.error(e); process.exit(1); });
