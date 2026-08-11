# -*- coding: utf-8 -*-
"""Zweiter Schritt von tools/vorschaubilder.js: die Rohbilder zuschneiden,
   skalieren und in die Endformate bringen.

   Aufruf erfolgt aus dem Node-Skript, nicht von Hand:
       node tools/vorschaubilder.js

   Je Stelle entstehen vier Dateien in assets/img:
       name.webp     name.jpg        einfache Aufloesung
       name@2x.webp  name@2x.jpg     doppelte, fuer scharfe Bildschirme

   JPEG bleibt als Rueckfallebene fuer Browser ohne WebP erhalten.
"""
import io
import json
import os
import sys

from PIL import Image

WURZEL = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ZIEL = os.path.join(WURZEL, 'assets', 'img')

auftrag = json.loads(sys.argv[1])
zeilen = []
gesamt = 0

for stelle in auftrag:
    im = Image.open(stelle['roh']).convert('RGB')

    # Das Rohbild kommt in doppelter Aufloesung aus dem Browser. Auf das
    # Seitenverhaeltnis der Stelle beschneiden, falls es minim abweicht.
    soll_hoehe = int(round(im.width / stelle['verhaeltnis']))
    if im.height > soll_hoehe:
        im = im.crop((0, 0, im.width, soll_hoehe))

    for faktor in (1, 2):
        breite = stelle['breite'] * faktor
        hoehe = int(round(breite / stelle['verhaeltnis']))
        klein = im.resize((breite, hoehe), Image.LANCZOS)
        endung = '' if faktor == 1 else '@2x'
        basis = os.path.join(ZIEL, stelle['name'] + endung)

        klein.save(basis + '.jpg', 'JPEG', quality=84, optimize=True, progressive=True)
        klein.save(basis + '.webp', 'WEBP', quality=80, method=6)

        j = os.path.getsize(basis + '.jpg')
        w = os.path.getsize(basis + '.webp')
        gesamt += w
        zeilen.append('  %-26s %4dx%-4d  webp %5.0f KB   jpg %5.0f KB'
                      % (stelle['name'] + endung, breite, hoehe, w / 1024.0, j / 1024.0))

print('\n'.join(zeilen))
print('  %-26s               %5.0f KB' % ('WebP zusammen', gesamt / 1024.0))
