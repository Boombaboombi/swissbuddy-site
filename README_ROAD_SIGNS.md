# SwissBuddy Modul: Schweizer Verkehrstafeln auf Thai

Dieses Paket ergänzt SwissBuddy um ein neues Modul `#roadsigns`.

## Inhalt

- `assets/road-signs/ch/` – konvertierte Web-Bilder aus den hochgeladenen offiziellen Signalpaketen.
- `js/road-signs-data.js` – Datenstruktur mit Signalnummer, Kategorie, Bildpfad, Deutsch, Thai und einfacher Erklärung.
- `js/road-signs.js` – Renderer mit Suche, Kategorie-Filter, Wichtigkeitsfilter und Mini-Quiz.
- `css/road-signs.css` – Styles für Karten, Filter und Quiz.
- `index-road-signs-section.html` – Einfüge-Snippets für `index.html`.
- `sw-add-road-sign-assets.txt` – Assets, die optional in `sw.js` ergänzt werden können.
- `data/all-uploaded-signal-files-manifest.json` – Manifest aller hochgeladenen Quelldateien.

## Einbau in SwissBuddy

1. Kopiere die Ordner `assets`, `js` und `css` in dein SwissBuddy-Repo.
2. Öffne `index-road-signs-section.html` und füge die vier Snippets an den beschriebenen Stellen in `index.html` ein.
3. Erhöhe in `sw.js` den Cache-Namen, z. B. von `swissbuddy-v8` auf `swissbuddy-v9`.
4. Ergänze in `sw.js` die Einträge aus `sw-add-road-sign-assets.txt`, wenn das Modul offline funktionieren soll.
5. Lokal testen: `index.html` mit Live Server öffnen und `#roadsigns` anklicken.

## Hinweis

Die Thai-Texte sind eine Lernhilfe für Moon und andere Thai-Sprecher. Rechtlich verbindlich bleiben die offiziellen Schweizer Verkehrsregeln und Signale.
