import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { fsGetCar, fsListCars, type Car as FsCar } from "../lib/carsFirestore";

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
    .map((c) => ({ ...(c as any) } as Car);

  return [...mergedBase, ...extras];
}

async function fetchJsonCars(): Promise<Car[]> {
  const r = await fetch("/data/cars.json");
  if (!r.ok) throw new Error("cars.json konnte nicht geladen werden");
  return (await r.json()) as Car[];
}

export default function CarDetail() {
  const { id } = useParams<{ id: string }>();

  const [jsonCars, setJsonCars] = useState<Car[]>([]);
  const [fsCars, setFsCars] = useState<FsCar[]>([]);
  const [fallbackCar, setFallbackCar] = useState<Car | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;

    async function run() {
      if (!id) {
        setError("Keine Fahrzeug-ID in der Route.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      setFallbackCar(null);

      try {
        const [base, remote] = await Promise.all([fetchJsonCars(), fsListCars()]);
        if (!alive) return;
        setJsonCars(base);
        setFsCars(remote);
      } catch (e) {
        if (!alive) return;
        // Wir versuchen trotzdem noch den direkten Firestore-Fallback, falls JSON/Listen-Laden scheitert.
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
  }, [id]);

  const mergedCars = useMemo(() => mergeCars(jsonCars, fsCars), [jsonCars, fsCars]);

  const carFromMerged = useMemo(() => {
    if (!id) return null;
    return mergedCars.find((c) => c.id === id) ?? null;
  }, [mergedCars, id]);

  useEffect(() => {
    let alive = true;

    async function runFallback() {
      if (!id) return;
      if (carFromMerged) return;

      try {
        const c = await fsGetCar(id);
        if (!alive) return;
        setFallbackCar((c as any) ?? null);
      } catch (e) {
        if (!alive) return;
        setError((prev) => prev ?? (e instanceof Error ? e.message : "Unbekannter Fehler"));
      }
    }

    runFallback();
    return () => {
      alive = false;
    };
  }, [id, carFromMerged]);

  const car = carFromMerged ?? fallbackCar;

  if (loading && !car) {
    return (
      <section className="max-w-7xl mx-auto px-4 pt-28 pb-16">
        <div className="text-zinc-300 uppercase text-xs tracking-wider">Fahrzeug</div>
        <h1 className="mt-2 text-3xl md:text-4xl font-bold">Details</h1>
        <div className="mt-8 text-zinc-300">Lade…</div>
      </section>
    );
  }

  if (!car) {
    return (
      <section className="max-w-7xl mx-auto px-4 pt-28 pb-16">
        <div className="text-zinc-300 uppercase text-xs tracking-wider">Fahrzeug</div>
        <h1 className="mt-2 text-3xl md:text-4xl font-bold">Nicht gefunden</h1>
        {error ? (
          <div className="mt-8 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-200">
            Fehler: {error}
          </div>
        ) : (
          <div className="mt-8 text-zinc-300">
            Dieses Fahrzeug existiert nicht (oder ist nicht verfügbar).
          </div>
        )}
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-4 pt-28 pb-16">
      <div className="text-zinc-300 uppercase text-xs tracking-wider">Fahrzeug</div>
      <h1 className="mt-2 text-3xl md:text-4xl font-bold">
        {car.brand} {car.model}
      </h1>

      {error ? (
        <div className="mt-6 rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-4 text-yellow-100">
          Hinweis: {error}
        </div>
      ) : null}

      <div className="mt-8 grid md:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-white/10 bg-zinc-900/60 overflow-hidden">
          <div className="aspect-[16/10] bg-zinc-800">
            {car.media?.poster ? (
              <img
                src={car.media.poster}
                alt={`${car.brand} ${car.model}`}
                className="w-full h-full object-cover"
              />
            ) : null}
          </div>
          <div className="p-4 text-sm text-zinc-300">
            {car.year} • {car.drivetrain} • {car.gearbox} • {car.consumptionL100} l/100km
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-zinc-900/60 p-6 space-y-3">
          <div className="font-semibold">Performance</div>
          <div className="text-sm text-zinc-300">Leistung: {car.powerHp} PS</div>
          <div className="text-sm text-zinc-300">0–100 km/h: {car.accel0to100} s</div>
          <div className="text-sm text-zinc-300">Vmax: {car.topspeedKmh} km/h</div>

          <div className="pt-4 font-semibold">Preise</div>
          <div className="text-sm text-zinc-300">Tag: {car.dailyPrice} €</div>
          <div className="text-sm text-zinc-300">Wochenende: {car.weekendPrice} €</div>
          <div className="text-sm text-zinc-300">Kaution: {car.deposit} €</div>
        </div>
      </div>
    </section>
  );
}
