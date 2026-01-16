import { useEffect, useMemo, useState } from "react";
import { loadCarsMergedWithSources } from "../lib/cars";
import type { Car } from "../lib/storage";

function firstIds(list: { id: string }[], n: number): string[] {
  return list.slice(0, n).map((c) => c.id);
}

export default function Debug() {
  const [base, setBase] = useState<Car[]>([]);
  const [remote, setRemote] = useState<Car[]>([]);
  const [local, setLocal] = useState<Car[]>([]);
  const [merged, setMerged] = useState<Car[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!import.meta.env.DEV) return;

    let alive = true;

    async function run() {
      setLoading(true);
      setError(null);

      try {
        const res = await loadCarsMergedWithSources();
        if (!alive) return;

        setBase(res.base);
        setRemote(res.remote);
        setLocal(res.local);
        setMerged(res.merged);

        console.log("[debug] baseCars", res.base);
        console.log("[debug] strapiCars", res.remote);
        console.log("[debug] localCars", res.local);
        console.log("[debug] mergedCars", res.merged);
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
      base,
      remote,
      local,
      merged,
    }),
    [base, remote, local, merged]
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
      <h1 className="mt-2 text-3xl md:text-4xl font-bold">Car Loader</h1>

      {loading ? <div className="mt-8 text-zinc-300">Lade…</div> : null}

      {error ? (
        <div className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-200">
          Fehler: {error}
        </div>
      ) : null}

      <div className="mt-8 grid md:grid-cols-4 gap-6">
        <div className="rounded-2xl border border-white/10 bg-zinc-900/60 p-5">
          <div className="font-semibold">base (cars.json)</div>
          <div className="mt-2 text-sm text-zinc-300">Count: {memo.base.length}</div>
          <div className="mt-3 text-xs text-zinc-400 break-words">
            {firstIds(memo.base, 20).join(", ") || "—"}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-zinc-900/60 p-5">
          <div className="font-semibold">remote (Strapi)</div>
          <div className="mt-2 text-sm text-zinc-300">Count: {memo.remote.length}</div>
          <div className="mt-3 text-xs text-zinc-400 break-words">
            {firstIds(memo.remote, 20).join(", ") || "—"}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-zinc-900/60 p-5">
          <div className="font-semibold">local (localStorage)</div>
          <div className="mt-2 text-sm text-zinc-300">Count: {memo.local.length}</div>
          <div className="mt-3 text-xs text-zinc-400 break-words">
            {firstIds(memo.local, 20).join(", ") || "—"}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-zinc-900/60 p-5">
          <div className="font-semibold">merged</div>
          <div className="mt-2 text-sm text-zinc-300">Count: {memo.merged.length}</div>
          <div className="mt-3 text-xs text-zinc-400 break-words">
            {firstIds(memo.merged, 30).join(", ") || "—"}
          </div>
        </div>
      </div>
    </section>
  );
}
