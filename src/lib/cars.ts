import type { Car } from "./storage";
import { getUserCars } from "./storage";
import { fsListCars } from "./carsFirestore";

export async function fetchBaseCars(): Promise<Car[]> {
  const r = await fetch("/data/cars.json");
  if (!r.ok) throw new Error("cars.json konnte nicht geladen werden");
  return (await r.json()) as Car[];
}

function mergeCarsWithPrecedence(params: {
  base: Car[];
  remote: Partial<Car>[];
  local: Partial<Car>[];
}): Car[] {
  const { base, remote, local } = params;

  const baseIds = new Set(base.map((c) => c.id));
  const remoteById = new Map<string, Partial<Car>>();
  const localById = new Map<string, Partial<Car>>();

  for (const r of remote) {
    if (r && typeof r.id === "string") remoteById.set(r.id, r);
  }
  for (const l of local) {
    if (l && typeof l.id === "string") localById.set(l.id, l);
  }

  // Base order beibehalten, dann mit remote überschreiben, dann mit local überschreiben
  const mergedBase = base.map((b) => {
    const r = remoteById.get(b.id);
    const l = localById.get(b.id);
    return {
      ...b,
      ...(r as any),
      ...(l as any),
    } as Car;
  });

  // Extras: erst remote, dann local (aber nur wenn nicht in base und noch nicht hinzugefügt)
  const extras: Car[] = [];
  const added = new Set<string>(mergedBase.map((c) => c.id));

  for (const r of remote) {
    const id = (r as any)?.id;
    if (!id || typeof id !== "string") continue;
    if (baseIds.has(id) || added.has(id)) continue;
    extras.push(r as Car);
    added.add(id);
  }

  for (const l of local) {
    const id = (l as any)?.id;
    if (!id || typeof id !== "string") continue;
    if (baseIds.has(id) || added.has(id)) continue;
    extras.push(l as Car);
    added.add(id);
  }

  return [...mergedBase, ...extras];
}

export async function loadCarsMergedWithSources(): Promise<{
  base: Car[];
  remote: Car[];
  local: Car[];
  merged: Car[];
}> {
  const [base, remote] = await Promise.all([fetchBaseCars(), fsListCars()]);
  const local = getUserCars();

  const merged = mergeCarsWithPrecedence({
    base,
    remote: remote as unknown as Partial<Car>[],
    local: local as unknown as Partial<Car>[],
  });

  return { base, remote: remote as unknown as Car[], local, merged };
}

// Backwards-compatible: bisherige API
export async function loadMergedCars(): Promise<Car[]> {
  const { merged } = await loadCarsMergedWithSources();
  return merged;
}
