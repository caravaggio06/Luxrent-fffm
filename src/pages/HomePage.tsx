import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import StartScreen from "../components/StartScreen";
import VideoStage from "../components/VideoStage";
import { useAccentFromPoster } from "../hooks/useAccent";
import type { Car } from "../lib/storage";
import { loadMergedCars } from "../lib/cars";
import { getLastViewedCarId } from "../lib/storage";

export default function HomePage() {
  const [splash, setSplash] = useState(true);
  const [cars, setCars] = useState<Car[]>([]);
  const [active, setActive] = useState<Car | null>(null);

  useEffect(() => {
    loadMergedCars()
      .then((list) => {
        setCars(list);
        const last = getLastViewedCarId();
        const preferred = last ? list.find((c) => c.id === last) : null;
        setActive(preferred ?? list[0] ?? null);
      })
      .catch(() => {
        setCars([]);
        setActive(null);
      });
  }, []);

  useAccentFromPoster(active?.media?.poster ?? "");

  const hero = useMemo(() => {
    if (!active) return null;
    return (
      <section className="relative isolate overflow-hidden min-h-[calc(100dvh-76px)]">
        <div className="absolute inset-0 -z-10">
          <VideoStage src={active.media.video} poster={active.media.poster} />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,.55)_70%,rgba(0,0,0,.92)_100%)]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 pt-28 pb-16">
          <div className="text-zinc-300 uppercase text-xs tracking-wider">
            Need-for-Speed Vibes • Statisch • Ohne Backend
          </div>
          <h1 className="mt-2 text-4xl md:text-6xl font-bold leading-tight drop-shadow">
            <span className="text-accent-weak">{active.brand}</span> {active.model}
          </h1>
          <p className="mt-4 max-w-xl text-zinc-200/90">
            Fullscreen-Stage, HUD-Overlay, Soundcheck und dynamische Akzentfarbe –
            gepflegt über JSON + optional eigene Fahrzeuge via localStorage.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/fleet"
              className="inline-flex items-center justify-center rounded-xl bg-white text-zinc-900 px-5 py-3 font-semibold"
            >
              Flotte ansehen
            </Link>
            <Link
              to="/create"
              className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-black/30 text-white px-5 py-3 font-semibold hover:border-white/25"
            >
              Fahrzeug anlegen
            </Link>
          </div>

          <div className="mt-10 grid md:grid-cols-3 gap-6">
            <div className="bg-zinc-900/50 p-6 rounded-2xl border border-white/10">
              <div className="font-semibold mb-1">Master/Detail</div>
              <p className="text-sm text-zinc-300">
                Fleet als Grid, Detail als Fullscreen-Stage mit HUD.
              </p>
            </div>
            <div className="bg-zinc-900/50 p-6 rounded-2xl border border-white/10">
              <div className="font-semibold mb-1">CreateCar</div>
              <p className="text-sm text-zinc-300">
                Validiertes Formular (zod + react-hook-form) speichert in localStorage.
              </p>
            </div>
            <div className="bg-zinc-900/50 p-6 rounded-2xl border border-white/10">
              <div className="font-semibold mb-1">Deeplinks</div>
              <p className="text-sm text-zinc-300">
                Routen funktionieren direkt: <code>/cars/:id</code>.
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }, [active]);

  if (!active) {
    return <div className="p-8 pt-28 text-zinc-200">Lädt…</div>;
  }

  return (
    <>
      <StartScreen show={splash} onDone={() => setSplash(false)} />
      {hero}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-xs uppercase tracking-wider text-zinc-400 mb-3">
          Schnellzugriff
        </div>
        <div className="flex gap-3 overflow-x-auto">
          {cars.map((c) => (
            <Link
              key={c.id}
              to={`/cars/${encodeURIComponent(c.id)}`}
              className="px-3 py-2 rounded-xl border border-white/15 text-zinc-200 hover:border-white/25 whitespace-nowrap"
            >
              {c.brand} {c.model}
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
