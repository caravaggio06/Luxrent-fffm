# TODO für LUXRENT
# TODO für LUXRENT

## Sprint A – Kursanforderungen (React Content App)
- [ ] Navigation mit `react-router-dom` (mind. 3 Pages)
  - [ ] Home (Start/Splash + Hero)
  - [ ] Fleet (Master: Liste/Grid)
  - [ ] Detail (Detailansicht je Fahrzeug)
- [ ] Master/Detail umgesetzt
  - [ ] Master: Grid/List aller Fahrzeuge (Poster + Key-Stats)
  - [ ] Detail: Fullscreen-Video-Stage + HUD + Preise + Soundcheck
- [ ] Mind. 5 wiederverwendbare Components nachweisbar
  - Bereits vorhanden: StartScreen, CarSwitch, VideoStage, StatBar, PricePanel, SoundButton
  - [ ] Optional: Card, Chip, HUDPanel (für noch klarere Wiederverwendung)
- [ ] Mind. 1 Custom Hook
  - Bereits vorhanden: `useAccentFromPoster`
  - [ ] Dokumentieren (kurz) in README
- [ ] Mind. 1 Formular zur Content-Erstellung mit Validierung
  - [ ] CreateCar Page: neues Fahrzeug anlegen
  - [ ] Validierung: Pflichtfelder + Zahlen > 0 + Media-Pfade
- [ ] Persistenz (Minimum): localStorage
  - [ ] userCars speichern/lesen (Merge mit `cars.json`)
  - [ ] Optional: lastViewedCar speichern

## Sprint B – UX/Design Finish (LUX-Style)
- [ ] Fullscreen-Stage absolut stabil (kein Scroll-Offset nach Splash; kein `body{display:flex;}` etc.)
- [ ] Nahtlose Video-Übergänge final (Crossfade-Dauer, Preload, Pause alter Layer)
- [ ] HUD-Animationen (Stagger-In bei Wechsel)
- [ ] Akzentfarben: Caching pro Poster; Fallback-Farbe; kein Flackern
- [ ] Soundcheck: immer nur 1 Audio aktiv; stoppt beim Wechsel sicher
- [ ] Performance
  - [ ] Preload next/prev (poster + video)
  - [ ] OG/SEO minimal (Titel, Description, OG-Image)
  - [ ] Media-Empfehlungen in README (Encoding, Größen)
- [ ] Deployment
  - [ ] `npm run build` + `npm run dev -- --host 0.0.0.0 --port 4173`
  - [ ] Nginx-Snippet (Caching: Medien long-cache, `cars.json` no-cache)

## Sprint C – Dokumentation
- [ ] README: Setup, Dev/Build/Preview, Datenpflege (cars.json), Kurs-Checkliste (Häkchen)
- [ ] Screenshots/GIFs (optional) für Präsentation