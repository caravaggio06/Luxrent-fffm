# LUX•RENT

Fullscreen-Frontend für eine Luxuswagen-Vermietung. Fokus: Need-for-Speed-ähnliches Erlebnis – Fahrzeugwechsel auf Video-Bühne, dynamisches HUD (Heads-Up-Display), automatische Farb-Anpassung aus dem Poster, optionaler Soundcheck. Rein statisch, gepflegt über eine JSON.

## Funktionsumfang

- Fullscreen-Video je Fahrzeug (`autoplay`, `loop`, `muted`, `poster`)
- Weicher Fahrzeugwechsel (Framer Motion: Fade, Scale, Parallax)
- HUD-Overlay: Leistungsbalken, 0–100, V-Max, Verbrauch, Preise
- Soundcheck-Button je Fahrzeug (Audio-Clip; Stop beim Wechsel)
- Dynamische Akzentfarben via Canvas-Sampling aus dem Poster
- Fahrzeug-Chips zum direkten Anwählen; Pfeile für Vor/Zurück
- Minimaler Splash-Screen; schwarzes UI mit Vignette
- Keine Backend-Pflege: Flotte aus `public/data/cars.json`
- Statische Auslieferung nach Vite-Build

## Tech-Stack

- React 18 + Vite (TypeScript)
- Framer Motion (Animationen)
- Tailwind via CDN (kein CSS-Build)
- Canvas-Sampling statt externer Color-Libs
- Statisches Hosting (Nginx o. ä.)

## Ordnerstruktur

luxrental/
├─ index.html
├─ package.json
├─ vite.config.ts
├─ src/
│ ├─ App.tsx
│ ├─ main.tsx
│ ├─ hooks/useAccent.ts
│ └─ components/
│ ├─ CarSwitch.tsx
│ ├─ StartScreen.tsx
│ ├─ StatBar.tsx
│ ├─ PricePanel.tsx
│ └─ SoundButton.tsx
└─ public/
├─ images/ # <slug>-poster.jpg
├─ videos/ # <slug>.mp4
├─ audio/ # <slug>.mp3
└─ data/
└─ cars.json # Fahrzeugdaten (Single Source of Truth)

markdown
Code kopieren

## Voraussetzungen

- Node.js ≥ 20
- Git (empfohlen: Git LFS für große Medien)
- Optional: Nginx oder DDEV (Docker) für Auslieferung

## Installation

```bash
git clone git@github.com:caravaggio06/Luxrent-fffm.git
cd Luxrent-fffm
npm i
Entwicklung
bash
Code kopieren
# lokaler Dev-Server
npm run dev

# Preview im LAN freigeben
npm run preview -- --host 0.0.0.0 --port 4173
# Zugriff: http://<VM-IP>:4173
Build und Deployment
bash
Code kopieren
# Production-Build
npm run build
Statisch via Nginx
bash
Code kopieren
sudo mkdir -p /var/www/luxrental
sudo rsync -a --delete dist/ /var/www/luxrental/
nginx
Code kopieren
server {
  listen 80;
  server_name _;
  root /var/www/luxrental;
  index index.html;
  location / { try_files $uri /index.html; }
}
bash
Code kopieren
sudo nginx -t && sudo systemctl reload nginx
Alternative: DDEV (statisch)
bash
Code kopieren
mkdir -p .ddev
ddev config --project-type=php --docroot=dist --create-docroot
npm run build
ddev start
Fahrzeuge pflegen
Medien ablegen:

swift
Code kopieren
public/images/<slug>-poster.jpg
public/videos/<slug>.mp4
public/audio/<slug>.mp3
public/data/cars.json erweitern:

json
Code kopieren
{
  "id": "lambo-huracan-sto",
  "brand": "Lamborghini",
  "model": "Huracán STO",
  "year": 2023,
  "dailyPrice": 1790,
  "weekendPrice": 4490,
  "deposit": 6000,
  "powerHp": 640,
  "accel0to100": 3.0,
  "topspeedKmh": 310,
  "drivetrain": "RWD",
  "gearbox": "Auto",
  "consumptionL100": 13.9,
  "media": {
    "poster": "/images/lambo-huracan-sto-poster.jpg",
    "video": "/videos/lambo-huracan-sto.mp4",
    "audio": "/audio/lambo-huracan-sto.mp3"
  }
}
Seite neu laden. Akzentfarben passen sich automatisch an (aus Poster).

Medien-Spezifikation
Video: 1920×1080, H.264, ~8–12 Mbps; poster passend exportieren

Poster: JPG 1600–1920 px Breite, 70–80 % Qualität, ≤ 300 KB

Audio: MP3 ≤ 256 kbps

Dateinamen: nur Kleinbuchstaben + Bindestriche, keine Leerzeichen

Barrierefreiheit / UX
Buttons mit aria-label

Videos muted, playsInline, loop für Autoplay-Konformität

Ausreichende Kontraste im HUD auf Schwarz

Performance
Nur aktives Fahrzeugvideo sichtbar/geladen

Canvas-Sampling auf 32×32 Pixel limitiert (einmalig pro Poster)

Statisches Hosting empfohlen

Caching:

/data/cars.json: Cache-Control: no-cache

Medien: Cache-Control: public, max-age=31536000, immutable

Troubleshooting
„Lädt…“ bleibt: cars.json muss unter /public/data/cars.json liegen; fetch("/data/cars.json") prüfen

Farben ändern sich nicht: Poster muss gleiche Origin haben (CORS)

Video spielt nicht: Autoplay erfordert muted; Browser-Konsole prüfen

LAN-Zugriff: npm run preview -- --host 0.0.0.0 --port 4173; Firewall/NAT freigeben

Lizenz / Rechte
Nur eigenes/lizenziertes Medienmaterial verwenden. Repo enthält keine Dritt-Assets.

Projektspezifische Lizenz ergänzen (falls benötigt).

Roadmap
Optionale WebM-Bereitstellung

Erweiterte HUD-Widgets (z. B. Telemetrie-Mock)

Light/Dark-Tuning für sehr helle Poster

Formular-Handling an Mail-Gateway

## Changelog

Versionierung nach SemVer. Änderungen protokollieren in `CHANGELOG.md`:
- Added: neue Features
- Changed: Änderungen am Verhalten
- Fixed: Bugfixes
- Removed: Deaktivierte/entfernte Teile

## Qualität / Code-Style

- TypeScript strict genug für Komponenten
- ESLint optional; Prettier empfohlen
- Benennung: `kebab-case` für Dateien, `PascalCase` für Komponenten

## Tests (leichtgewichtig)

- Visuelle Smoke-Tests manuell:
  - JSON lädt ohne 404
  - Video/Poster pro Fahrzeug vorhanden
  - Soundcheck stoppt beim Wechsel
  - Akzentfarbe wechselt beim Fahrzeugwechsel
- Optional: Playwright E2E-Skript später ergänzen

## Barrierefreiheit-Checkliste

- Fokus sichtbar auf interaktiven Elementen
- `aria-label` für Pfeil-Buttons
- Kontrast: HUD-Text ≥ 4.5:1
- Autoplay ohne Ton (`muted`) gewährleistet

## Browser-Support

- Chromium ≥ 100, Firefox ≥ 100, Safari ≥ 15.4
- Mobile iOS/Android: `playsInline` aktiv; Fullscreen-Video nicht erzwungen

## Sicherheit

- Keine Benutzereingaben serverseitig verarbeitet
- JSON nur lesend; CORS vermeiden, gleiche Origin nutzen
- Keine Third-Party-Tracker eingebunden

## SEO / Meta

- In `index.html` ergänzen:
  - `<title>` pro Marke
  - `meta name="description"`
  - Open-Graph: Poster eines Featured-Fahrzeugs

## Deployment-Notizen

- Statisch aus `dist/`
- Nginx: langes Caching für Medien, `no-cache` für `/data/cars.json`
- Optional CI: GitHub Actions → `npm ci && npm run build` → Artefakte deployen

## Git LFS

- Große Medien (`*.mp4`, `*.mp3`, `*.webm`) via LFS
- `git lfs install` lokal/CI sicherstellen

## Bekannte Einschränkungen

- Farb-Extraktion abhängig vom Poster (sehr dunkle Poster → geringe Varianz)
- Autoplay-Policy: Ton nur auf User-Interaktion
- Kein Formular-Backend; „Anfrage“-Formular nur UI

## Wartung / Zuständigkeit

- Maintainer: Kerem Kale (`@caravaggio06`)
- Issues/PRs über GitHub

## Lizenz

- Code: MIT (Platzhalter – anpassen)
- Medien: nicht enthalten bzw. separat lizensiert