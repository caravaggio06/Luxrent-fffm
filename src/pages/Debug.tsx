import { useEffect, useMemo, useState } from "react";
import { strapiListCars } from "../lib/carsStrapi";
import type { Car } from "../lib/storage";

function firstIds(list: { id: string }[], n: number): string[] {
  return list.slice(0, n).map((c) => c.id);
}

export default function Debug() {
  const [remote, setRemote] = useState<Car[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!import.meta.env.DEV) return;

    let alive = true;

    async function run() {
      setLoading(true);
      setError(null);

      try {
        const list = await strapiListCars();
        if (!alive) return;

        setRemote(list);

        console.log("[debug] strapiCars", list);
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

  const memo = useMemo(
    () => ({
      remote,
    }),
    [remote]
  );

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
      <h1 className="mt-2 text-3xl md:text-4xl font-bold">Strapi</h1>

      {loading ? <div className="mt-8 text-zinc-300">Lade…</div> : null}

      {error ? (
        <div className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-200">
          Fehler: {error}
        </div>
      ) : null}

      <div className="mt-8 grid md:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-white/10 bg-zinc-900/60 p-5">
          <div className="font-semibold">cars (Strapi)</div>
          <div className="mt-2 text-sm text-zinc-300">Count: {memo.remote.length}</div>
          <div className="mt-3 text-xs text-zinc-400 break-words">
            {firstIds(memo.remote, 50).join(", ") || "—"}
          </div>
        </div>
      </div>
    </section>
  );
}
