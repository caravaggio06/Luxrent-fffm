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

function firstIds(list: { id: string }[], n: number): string[] {
  return list.slice(0, n).map((c) => c.id);
}

export default function Debug() {
  const [jsonCars, setJsonCars] = useState<Car[]>([]);
  const [fsCars, setFsCars] = useState<FsCar[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!import.meta.env.DEV) return;

    let alive = true;

    async function run() {
      setLoading(true);
      setError(null);

      try {
        const [base, remote] = await Promise.all([fetchJsonCars(), fsListCars()]);
        if (!alive) return;

        setJsonCars(base);
        setFsCars(remote);

        const merged = mergeCars(base, remote);

        console.log("[debug] jsonCars", base);
        console.log("[debug] fsCars", remote);
        console.log("[debug] mergedCars", merged);
      } catch (e) {
        if (!alive) return;
        const msg = e instanceof Error ? e.message : "Unbekannter Fehler";
        setError(msg);
        console.log("[debug] error", e);
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

  const mergedCars = useMemo(() => mergeCars(jsonCars, fsCars), [jsonCars, fsCars]);

  if (!import.meta.env.DEV) {
    return (
      <section className="max-w-7xl mx-auto px-4 pt-28 pb-16">
        <div className="text-zinc-300 uppercase text-xs tracking-wider">Debug</div>
        <h1 className="mt-2 text-3xl md:text-4xl font-bold">Nicht verfügbar</h1>
        <div className="mt-8 text-zinc-300">Diese Seite ist nur in DEV verfügbar.</div>
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-4 pt-28 pb-16">
      <div className="text-zinc-300 uppercase text-xs tracking-wider">Debug</div>
      <h1 className="mt-2 text-3xl md:text-4xl font-bold">Firestore Reads</h1>

      {loading ? <div className="mt-8 text-zinc-300">Lade…</div> : null}

      {error ? (
        <div className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-200">
          Fehler: {error}
        </div>
      ) : null}

      <div className="mt-8 grid md:grid-cols-3 gap-6">
        <div className="rounded-2xl border border-white/10 bg-zinc-900/60 p-5">
          <div className="font-semibold">cars.json</div>
          <div className="mt-2 text-sm text-zinc-300">Count: {jsonCars.length}</div>
          <div className="mt-3 text-xs text-zinc-400 break-words">
            {firstIds(jsonCars, 10).join(", ") || "—"}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-zinc-900/60 p-5">
          <div className="font-semibold">Firestore</div>
          <div className="mt-2 text-sm text-zinc-300">Count: {fsCars.length}</div>
          <div className="mt-3 text-xs text-zinc-400 break-words">
            {firstIds(fsCars, 10).join(", ") || "—"}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-zinc-900/60 p-5">
          <div className="font-semibold">Merged</div>
          <div className="mt-2 text-sm text-zinc-300">Count: {mergedCars.length}</div>
          <div className="mt-3 text-xs text-zinc-400 break-words">
            {firstIds(mergedCars, 20).join(", ") || "—"}
          </div>
        </div>
      </div>
    </section>
  );
}
