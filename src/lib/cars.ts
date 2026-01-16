import type { Car } from "./storage";
import { strapiListCars } from "./carsStrapi";

export async function fetchBaseCars(): Promise<Car[]> {
  const r = await fetch("/data/cars.json");
  if (!r.ok) throw new Error("cars.json konnte nicht geladen werden");
  return (await r.json()) as Car[];
}

export async function loadCarsMergedWithSources(): Promise<{
  base: Car[];
  remote: Car[];
  local: Car[];
  merged: Car[];
}> {
  // Firebase/Firestore/Local-Merge ist deaktiviert: nur noch Strapi ist Quelle.
  const remote = await strapiListCars();
  return { base: [], remote, local: [], merged: remote };
}

// Backwards-compatible: bisherige API
export async function loadMergedCars(): Promise<Car[]> {
  const { merged } = await loadCarsMergedWithSources();
  return merged;
}
