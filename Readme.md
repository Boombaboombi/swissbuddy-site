# SwissBuddy – Integrationsprojekt

SwissBuddy ist eine Progressive Web App (PWA), die Zugezogenen in der Schweiz hilft, Sprache, Kultur und Alltag spielerisch zu lernen.

- **assets/** → Bilder und Icons
- **css/** → Stylesheets
- **js/** → JavaScript (Quiz, Sprachlogik etc.)
- **index.html** → Startseite der App
- **manifest.json** → App-Metadaten für PWA
- **sw.js** → Service Worker (Offline-Funktion)

# Installationshandbuch – SwissBuddy (lokaler Betrieb mit VS Code & Live Server)

**Ziel:** SwissBuddy lokal im Browser starten, ohne Backend.  
**Voraussetzungen:** Internetzugang (für den Währungsrechner), aktueller Browser (Chrome/Edge/Firefox/Safari).

---

## 1. Visual Studio Code installieren

1. Öffne https://code.visualstudio.com und lade **Visual Studio Code** für dein System herunter.
2. Installiere VS Code mit den Standardoptionen.
3. Starte VS Code nach der Installation.

---

## 2. Live Server Erweiterung installieren

1. Öffne in VS Code die **Extensions** (links: Viereck‑Icon oder `Ctrl+Shift+X` / `Cmd+Shift+X`).
2. Suche nach **„Live Server“** (Autor: _Ritwick Dey_).
3. Klicke **Install**.
   > Erweiterungs-ID: `ritwickdey.LiveServer`

**Optional – Einstellungen:**

- Port fix setzen: _Settings_ → suche nach **Live Server › Settings: Port** → z. B. `5500`.
- Standardbrowser bestimmen: _Settings_ → **Live Server › Settings: Custom Browser** → z. B. `chrome`.

---

## 3. Projektordner öffnen

1. Entpacke dein SwissBuddy‑Projekt (ZIP) an einen beliebigen Ort.
2. In VS Code: **File → Open Folder…** und den **Projektordner** wählen.
3. Warte, bis VS Code den Ordner geladen hat.

> Hinweis: Das Projekt ist eine schlanke Frontend‑App. Ein Backend ist **nicht** nötig.

---

## 4. Live Server starten

**Variante A (empfohlen):**

- Öffne die Start‑Datei (z. B. `index.html`) im Editor.
- Rechtsklick in den Editor → **„Open with Live Server“**.
- Der Browser öffnet sich unter einer Adresse wie `http://127.0.0.1:5500/` oder `http://localhost:5500/`.

**Variante B (über Statusleiste):**

- Klicke unten rechts in der Statusleiste auf **„Go Live“**.
- Der Browser startet automatisch.

**Beenden:**

- In VS Code unten rechts **„Port: 5500“** / **„Live Server“** anklicken → **Stop**.

---

## 5. Nutzung

- Navigiere über die Top‑Leiste: **Start**, **Vokabeln**, **ÖV‑Tipps**, **Quiz**, **Währungsrechner**.
- **Sprachen**: Rechts oben die UI‑Sprache (DE/TH/IT/EN/FR) wählen.
- **Dark‑Mode**: Schalter daneben.
- **Währungsrechner**: Internetverbindung erforderlich (Abfrage von Kursen).

---

## 6. Troubleshooting

**Seite lädt nicht / 404**

- Sicherstellen, dass Live Server auf den **richtigen Ordner** zeigt (Projekt‑Wurzel).
- Prüfe, ob du die korrekte Start‑Datei (meist `index.html`) geöffnet hast.

**Port schon belegt**

- _Settings_ → „Live Server › Settings: Port“ anpassen (z. B. 5501). Dann erneut **Go Live**.

**Leere Seite / CORS‑Fehler beim Währungsrechner**

- Internet aktiv? Einige öffentliche APIs erlauben nur HTTPS. Live Server verwendet HTTP; falls eine API blockiert, teste in **Chrome/Edge** oder verwende alternativ einen lokalen **HTTPS‑Server** (siehe unten).

**Keine Sprachausgabe (TTS)**

- Die Aussprache nutzt die **Web Speech Synthesis API** des Geräts. Nicht alle Stimmen sind gleich verfügbar. Auf iOS klingt die Stimme oft metallisch – das ist erwartbar.

**Langsame Ladezeiten / alte Version**

- Browser‑Cache leeren (**Hard Reload**: `Ctrl+F5` / `Cmd+Shift+R`) oder Live Server neu starten.

---

## 7. Alternative Startvarianten (ohne Live Server)

Wenn du lieber einen anderen lokalen Server verwendest:

**Python 3 (Windows/macOS/Linux)**

```bash
# im Projektordner
python -m http.server 5500
# Browser öffnen: http://localhost:5500/
```

**Node.js „serve“ (falls Node installiert ist)**

```bash
# einmalig installieren
npm -g install serve
# im Projektordner starten
serve -l 5500
```

---

## 8. Optional: Lokales HTTPS (nur wenn eine API es verlangt)

1. Mit `mkcert` oder `openssl` ein lokales Zertifikat erzeugen.
2. Einen HTTPS‑fähigen Dev‑Server nutzen (z. B. `http-server` mit `--ssl` oder ein leichtes Node/Express‑Setup).
3. Live Server selbst dient primär HTTP; für die meisten Tests genügt das.

---

## 9. Systemvoraussetzungen und Rechte

- **Windows/macOS/Linux** werden unterstützt.
- Firewall‑Nachfragen beim ersten Start zulassen, damit der lokale Port erreichbar ist.
- Keine Administratorrechte notwendig (nur Installation von VS Code).

---

## 10. Kurzübersicht – Start in 30 Sekunden

1. VS Code öffnen → **Ordner öffnen** (SwissBuddy).
2. `index.html` wählen → Rechtsklick **Open with Live Server**.
3. Browser öffnet sich → SwissBuddy bedienen.
