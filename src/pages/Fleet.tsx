import { useEffect, useState } from "react";
import { strapiListCars } from "../lib/carsStrapi";
import type { Car } from "../lib/storage";

export default function Fleet() {
  const [cars, setCars] = useState<Car[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;

    async function run() {
      setLoading(true);
      setError(null);

      try {
        const list = await strapiListCars();
        if (!alive) return;
        setCars(list);
      } catch (e) {
        if (!alive) return;
        setCars([]);
        setError(e instanceof Error ? e.message : "Unbekannter Fehler");
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    }

    run();
    return () => {
      alive = false;
    };
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-4 pt-28 pb-16">
      <div className="text-zinc-300 uppercase text-xs tracking-wider">Fleet</div>
      <h1 className="mt-2 text-3xl md:text-4xl font-bold">Fahrzeuge</h1>

      {loading ? <div className="mt-8 text-zinc-300">Lade Fahrzeuge…</div> : null}

      {error ? (
        <div className="mt-8 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-200">
          Fehler: {error}
        </div>
      ) : null}

      {!loading && !error && cars.length === 0 ? (
        <div className="mt-8 text-zinc-300">Keine Fahrzeuge gefunden.</div>
      ) : null}

      {!error && cars.length > 0 ? (
        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cars.map((c) => (
            <a
              key={c.id}
              href={`/cars/${encodeURIComponent(c.id)}`}
              className="group rounded-2xl border border-white/10 bg-zinc-900/60 overflow-hidden hover:border-white/20 transition-colors"
            >
              <div className="aspect-[16/10] bg-zinc-800">
                {c.media?.poster ? (
                  <img
                    src={c.media.poster}
                    alt={`${c.brand} ${c.model}`}
                    className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-zinc-400">
                    Kein Poster verfügbar
                  </div>
                )}
              </div>
              <div className="p-4 space-y-2">
                <div className="font-semibold">
                  {c.brand} {c.model}
                </div>
                <div className="text-sm text-zinc-300">
                  {c.year} • {c.powerHp} PS • 0–100: {c.accel0to100}s • Vmax: {c.topspeedKmh} km/h
                </div>
                <div className="text-sm text-zinc-200">
                  ab {c.dailyPrice} €/Tag • {c.weekendPrice} €/WE
                </div>
              </div>
            </a>
          ))}
        </div>
      ) : null}
    </section>
  );
}
