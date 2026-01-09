import { useEffect, useMemo, useState } from "react";
import { fsListCars, type Car as FsCar } from "../lib/carsFirestore";

type JsonCar = {
  id: string;
  brand: string;
  model: string;
  year: number;
  dailyPrice: number;
  weekendPrice: number;
  deposit: number;
  powerHp: number;
  accel0to100: number;
  topspeedKmh: number;
  consumptionL100: number;
  drivetrain: string;
  gearbox: string;
  media: { poster?: string; video?: string; audio?: string };
};

type Car = JsonCar;

function mergeCars(baseCars: Car[], fsCars: FsCar[]): Car[] {
  const baseIds = new Set(baseCars.map((c) => c.id));
  const remoteById = new Map(fsCars.map((c) => [c.id, c] as const));

  const mergedBase = baseCars.map((c) => {
    const remote = remoteById.get(c.id);
    return remote ? ({ ...c, ...(remote as any) } as Car) : c;
  });

  const extras = fsCars
    .filter((c) => !baseIds.has(c.id))
    .map((c) => ({ ...(c as any) } as Car));

  return [...mergedBase, ...extras];
}

async function fetchJsonCars(): Promise<Car[]> {
  const r = await fetch("/data/cars.json");
  if (!r.ok) throw new Error("cars.json konnte nicht geladen werden");
  return (await r.json()) as Car[];
}

export default function Fleet() {
  const [jsonCars, setJsonCars] = useState<Car[]>([]);
  const [fsCars, setFsCars] = useState<FsCar[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;

    async function run() {
      setLoading(true);
      setError(null);

      try {
        const [base, remote] = await Promise.all([fetchJsonCars(), fsListCars()]);
        if (!alive) return;
        setJsonCars(base);
        setFsCars(remote);
      } catch (e) {
        if (!alive) return;
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

  const cars = useMemo(() => mergeCars(jsonCars, fsCars), [jsonCars, fsCars]);

  if (loading) {
    return (
      <section className="max-w-7xl mx-auto px-4 pt-28 pb-16">
        <div className="text-zinc-300 uppercase text-xs tracking-wider">Fleet</div>
        <h1 className="mt-2 text-3xl md:text-4xl font-bold">Fahrzeuge</h1>
        <div className="mt-8 text-zinc-300">Lade Fahrzeuge…</div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="max-w-7xl mx-auto px-4 pt-28 pb-16">
        <div className="text-zinc-300 uppercase text-xs tracking-wider">Fleet</div>
        <h1 className="mt-2 text-3xl md:text-4xl font-bold">Fahrzeuge</h1>
        <div className="mt-8 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-200">
          Fehler: {error}
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-4 pt-28 pb-16">
      <div className="text-zinc-300 uppercase text-xs tracking-wider">Fleet</div>
      <h1 className="mt-2 text-3xl md:text-4xl font-bold">Fahrzeuge</h1>

      {import.meta.env.DEV ? (
        <div className="mt-2 text-xs text-zinc-400">
          JSON: {jsonCars.length} | Firestore: {fsCars.length} | Merged: {cars.length}
        </div>
      ) : null}

      {cars.length === 0 ? (
        <div className="mt-8 text-zinc-300">Keine Fahrzeuge gefunden.</div>
      ) : (
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
                ) : null}
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
      )}
    </section>
  );
}
