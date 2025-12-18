# Architektur LUXRENT

## Zweck
LUX•RENT ist ein statisches Fullscreen-Frontend für eine Luxuswagen-Vermietung im Stil von „Need for Speed“: Fahrzeugwechsel mit Video-Stage, HUD-Overlay (Stats/Preise), optionaler Soundcheck pro Fahrzeug und dynamischer Akzentfarbe (automatisch aus dem Fahrzeug-Poster extrahiert). Keine Backend-Pflege notwendig: die Flotte wird über eine JSON-Datei gepflegt.

## Tech-Stack
- Sprache/Framework: React 18 (TypeScript/TSX), optional gemischt mit JSX möglich
- Build/Dev: Vite (dev/build/preview), npm
- UI/Animation: Tailwind (CDN), Framer Motion
- Hosting: statisches Hosting (Nginx, Vercel, GitHub Pages); Build-Output `dist/`

## Verzeichnisstruktur (wichtigste)
- `public/`
  - `public/data/cars.json` – zentrale Fahrzeugdaten (Flotte)
  - `public/images/` – Poster/Thumbnails
  - `public/videos/` – MP4/WebM Video-Clips pro Fahrzeug
  - `public/audio/` – Soundcheck-Clips pro Fahrzeug
- `src/`
  - `src/App.tsx` – App-Shell, Navigation, Sections/Pages, State (active car), Preload/Deeplink (falls aktiv)
  - `src/components/`
    - `CarSwitch.tsx` – Fullscreen Stage + HUD + Controls (prev/next, chips)
    - `VideoStage.tsx` – nahtloser Video-Wechsel (Doppel-Layer Crossfade)
    - `StatBar.tsx` – Stat-Balken (Leistung/Vmax etc.)
    - `PricePanel.tsx` – Preise (Tag/Wochenende/Kaution)
    - `SoundButton.tsx` – Soundcheck (Audio start/stop)
    - `StartScreen.tsx` – Splash/Intro Screen
  - `src/hooks/`
    - `useAccent.ts` – `useAccentFromPoster` (Canvas-Sampling; setzt CSS-Variablen)
  - `src/utils/`
    - `preload.ts` – Preload helpers (poster/video)
    - `format.ts` – Formatter (z. B. EUR)

## Wichtige Komponenten
- `StartScreen`: Minimaler Startscreen (edel, schwarz); blockt UI bis „Start“.
- `CarSwitch`: Kern-UI – zeigt aktives Fahrzeug als Fullscreen-Stage (Video), HUD, Preise und Wechsel-Controls.
- `VideoStage`: Realisiert „nahtlosen“ Übergang zwischen Fahrzeugvideos (Crossfade, Preload, Pause alter Layer).
- `SoundButton`: Spielt pro Fahrzeug ein Audio-Clip ab; stoppt automatisch bei Fahrzeugwechsel.
- `useAccentFromPoster`: Extrahiert Akzentfarbe aus Poster; setzt globale CSS-Variablen `--accent` und `--accent-weak`.

## APIs / Endpoints
- `GET /data/cars.json` – lädt die Flotte (statisch aus `public/data/`)
- Statisch ausgelieferte Assets:
  - `GET /videos/<slug>.mp4`
  - `GET /images/<slug>-poster.jpg`
  - `GET /audio/<slug>.mp3`

## Datenmodell
Quelle: `public/data/cars.json` (Array).

Minimal erwartete Felder (empfohlen):
- `id` (string, slug; eindeutig)
- `brand` (string)
- `model` (string)
- `year` (number)
- `dailyPrice` (number)
- `weekendPrice` (number)
- `deposit` (number)
- `powerHp` (number)
- `accel0to100` (number)
- `topspeedKmh` (number)
- `consumptionL100` (number)
- `drivetrain` (string)
- `gearbox` (string)
- `media.poster` (string, Pfad unter `/images/...`)
- `media.video` (string, Pfad unter `/videos/...`)
- `media.audio` (string, Pfad unter `/audio/...`, optional)

Beispiel:
```json
{
  "id": "ferrari-296-gtb",
  "brand": "Ferrari",
  "model": "296 GTB",
  "year": 2024,
  "dailyPrice": 1590,
  "weekendPrice": 3990,
  "deposit": 5000,
  "powerHp": 830,
  "accel0to100": 2.9,
  "topspeedKmh": 330,
  "consumptionL100": 8.6,
  "drivetrain": "RWD",
  "gearbox": "Auto",
  "media": {
    "poster": "/images/ferrari-296-gtb-poster.jpg",
    "video": "/videos/ferrari-296-gtb.mp4",
    "audio": "/audio/ferrari-296-gtb.mp3"
  }
}
```

## Offene Punkte
Siehe TODO.md
