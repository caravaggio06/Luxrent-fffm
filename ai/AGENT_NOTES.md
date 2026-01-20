# Agent Notes für LUXRENT

## 2025-12-18 17:18

- Commit: KI-Bootstrapping (ARCHITEKTUR/TODO/AGENT_NOTES)

  Geänderte Dateien:
```
A	ai/AGENT_NOTES.md
A	ai/ARCHITEKTUR_LUXRENT.md
A	ai/TODO.md
```

## 2025-12-18 17:28

- Commit: chore(ai): Architektur + TODO aktualisiert

  Geänderte Dateien:
```
M	.gitignore
M	ai/AGENT_NOTES.md
M	ai/ARCHITEKTUR_LUXRENT.md
M	ai/TODO.md
```

## 2025-12-18 17:35

- Commit: feat: React Hook Form, React Router und Zod als Abhängigkeiten hinzufügen

  Geänderte Dateien:
```
M	package.json
```

## 2025-12-18 17:36

- Commit: feat: Router-Pages, CreateCar-Formular und localStorage-Persistenz hinzufügen

Co-authored-by: aider (gpt-5.2) <aider@aider.chat>

  Geänderte Dateien:
```
M	README.md
M	package.json
M	src/App.tsx
A	src/components/CarCard.tsx
A	src/components/Chip.tsx
A	src/components/HUDPanel.tsx
M	src/components/PricePanel.tsx
M	src/components/SoundButton.tsx
M	src/components/StartScreen.tsx
A	src/lib/cars.ts
A	src/lib/storage.ts
M	src/main.tsx
A	src/pages/CarDetailPage.tsx
A	src/pages/ContactPage.tsx
A	src/pages/CreateCarPage.tsx
A	src/pages/FleetPage.tsx
A	src/pages/HomePage.tsx
A	src/pages/TermsPage.tsx
```

## 2026-01-09 11:27

- Commit: feat: Seiten für Flotte, Auto erstellen und Autodetails hinzufügen

  Geänderte Dateien:
```
A	src/pages/CarDetail.tsx
A	src/pages/CreateCar.tsx
A	src/pages/Fleet.tsx
```

## 2026-01-09 11:28

- Commit: feat: Integriere Firestore-Persistenz für Fahrzeuge mit Fallbacks

Co-authored-by: aider (gpt-5.2) <aider@aider.chat>

  Geänderte Dateien:
```
M	src/pages/CarDetail.tsx
M	src/pages/CreateCar.tsx
M	src/pages/Fleet.tsx
```

## 2026-01-09 12:15

- Commit: fix: Firestore-only Autos in Fleet und Detailansicht korrekt mergen

Co-authored-by: aider (gpt-5.2) <aider@aider.chat>

  Geänderte Dateien:
```
M	src/pages/CarDetail.tsx
M	src/pages/Fleet.tsx
```

## 2026-01-09 12:20

- Commit: feat: DEV-Debug-Route hinzufügen und Firestore-Reads in Fleet anzeigen

Co-authored-by: aider (gpt-5.2) <aider@aider.chat>

  Geänderte Dateien:
```
M	src/App.tsx
A	src/pages/Debug.tsx
M	src/pages/Fleet.tsx
```

## 2026-01-09 12:24

- Commit: fix: Gemergte Fahrzeugliste korrekt rendern und Poster-Fallback ergänzen

Co-authored-by: aider (gpt-5.2) <aider@aider.chat>

  Geänderte Dateien:
```
M	src/pages/CarDetail.tsx
M	src/pages/Fleet.tsx
```

## 2026-01-09 12:41

- Commit: feat: Firestore-Anbindung für Autos hinzufügen und JSON-Werte anpassen

  Geänderte Dateien:
```
M	public/data/cars.json
A	src/lib/carsFirestore.ts
```

## 2026-01-09 12:41

- Commit: fix: Kanonischen Car-Loader nutzen und Merge mit localStorage ergänzen

Co-authored-by: aider (gpt-5.2) <aider@aider.chat>

  Geänderte Dateien:
```
M	src/lib/cars.ts
M	src/lib/carsFirestore.ts
M	src/pages/Debug.tsx
M	src/pages/Fleet.tsx
```

## 2026-01-09 12:45

- Commit: Anbindung FireBase

  Geänderte Dateien:
```
M	.gitignore
M	ai/AGENT_NOTES.md
M	package-lock.json
M	package.json
M	public/data/cars.json
A	public/images/bmw-m8.webp
D	public/images/ferrari-296-gtb-poster.jpg
A	public/images/ferrari.jpg
D	public/images/lambo-huracan-sto-poster.jpg
A	public/images/lambo-huracan-sto.webp
A	public/videos/bmw_m8.mp4
A	src/lib/firebase.ts
```

## 2026-01-16 12:08

- Commit: feat: Strapi Car-Collection und car.media-Komponente hinzufügen

Co-authored-by: aider (gpt-5.2) <aider@aider.chat>

  Geänderte Dateien:
```
A	backend/strapi/app/src/api/car/content-types/car/schema.json
A	backend/strapi/app/src/components/car/media.json
```

## 2026-01-16 12:22

- Commit: refactor: Ersetze Firestore durch Strapi als Car-Datenquelle

Co-authored-by: aider (gpt-5.2) <aider@aider.chat>

  Geänderte Dateien:
```
M	src/lib/cars.ts
M	src/lib/carsFirestore.ts
A	src/lib/carsStrapi.ts
M	src/lib/firebase.ts
M	src/pages/CarDetail.tsx
M	src/pages/Debug.tsx
```

## 2026-01-16 12:35

- Commit: refactor: Stelle Car-Loading auf Strapi um und deaktiviere Merge/Firebase

Co-authored-by: aider (gpt-5.2) <aider@aider.chat>

  Geänderte Dateien:
```
M	src/lib/cars.ts
M	src/lib/carsStrapi.ts
M	src/pages/Debug.tsx
M	src/pages/Fleet.tsx
```

## 2026-01-16 13:50

- Commit: fix: Unterstütze Strapi v4/v5 Entities beim Mapping von Autos

Co-authored-by: aider (gpt-5.2) <aider@aider.chat>

  Geänderte Dateien:
```
M	src/lib/carsStrapi.ts
```

## 2026-01-16 13:52

- Commit: Strapi anbindung

  Geänderte Dateien:
```
M	ai/AGENT_NOTES.md
A	backend/strapi/app/.env.example
A	backend/strapi/app/.gitignore
A	backend/strapi/app/README.md
A	backend/strapi/app/config/admin.ts
A	backend/strapi/app/config/api.ts
A	backend/strapi/app/config/database.ts
A	backend/strapi/app/config/middlewares.ts
A	backend/strapi/app/config/plugins.ts
A	backend/strapi/app/config/server.ts
A	backend/strapi/app/database/migrations/.gitkeep
A	backend/strapi/app/favicon.png
A	backend/strapi/app/package-lock.json
A	backend/strapi/app/package.json
A	backend/strapi/app/public/robots.txt
A	backend/strapi/app/public/uploads/.gitkeep
A	backend/strapi/app/src/admin/app.example.tsx
A	backend/strapi/app/src/admin/tsconfig.json
A	backend/strapi/app/src/admin/vite.config.example.ts
A	backend/strapi/app/src/api/.gitkeep
A	backend/strapi/app/src/api/car/controllers/car.ts
A	backend/strapi/app/src/api/car/routes/car.ts
A	backend/strapi/app/src/api/car/services/car.ts
A	backend/strapi/app/src/extensions/.gitkeep
A	backend/strapi/app/src/index.ts
A	backend/strapi/app/tsconfig.json
A	backend/strapi/app/types/generated/components.d.ts
A	backend/strapi/app/types/generated/contentTypes.d.ts
A	backend/strapi/docker-compose.yml
```

## 2026-01-19 18:33

- Commit: feat: füge CarsContext ein und nutze ihn in App und CarSwitch

Co-authored-by: aider (gpt-5.1) <aider@aider.chat>

  Geänderte Dateien:
```
M	src/App.tsx
M	src/components/CarSwitch.tsx
A	src/context/CarsContext.tsx
```
