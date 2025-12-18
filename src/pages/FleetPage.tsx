import React, { useEffect, useMemo, useState } from "react";
import CarCard from "../components/CarCard";
import type { Car } from "../lib/storage";
import { loadMergedCars } from "../lib/cars";

export default function FleetPage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [q, setQ] = useState("");

  useEffect(() => {
    loadMergedCars()
      .then(setCars)
      .catch(() => setCars([]));
  }, []);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return cars;
    return cars.filter((c) =>
      `${c.brand} ${c.model} ${c.id}`.toLowerCase().includes(query)
    );
  }, [cars, q]);

  return (
    <section className="max-w-7xl mx-auto px-4 pt-28 pb-16">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <div className="text-zinc-300 uppercase text-xs tracking-wider">
            Flotte (Master)
          </div>
          <h1 className="mt-2 text-3xl md:text-4xl font-bold">Fahrzeuge</h1>
          <p className="mt-2 text-sm text-zinc-300 max-w-2xl">
            Grid-Übersicht aller Fahrzeuge (cars.json + userCars aus localStorage).
            Klick führt zur Detailansicht mit Fullscreen-Stage.
          </p>
        </div>

        <div className="w-full sm:w-80">
          <label className="text-xs uppercase tracking-wide text-zinc-400">
            Suche
          </label>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="mt-1 w-full px-3 py-2 rounded bg-zinc-900/60 border border-white/10 text-zinc-100"
            placeholder="Ferrari, Huracán, …"
          />
        </div>
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((car) => (
          <CarCard key={car.id} car={car} />
        ))}
      </div>

      {!filtered.length ? (
        <div className="mt-10 text-sm text-zinc-400">Keine Treffer.</div>
      ) : null}
    </section>
  );
}
