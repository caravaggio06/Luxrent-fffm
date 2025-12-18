import type { Car } from "./storage";
import { getUserCars, mergeCars } from "./storage";

export async function fetchBaseCars(): Promise<Car[]> {
  const r = await fetch("/data/cars.json");
  if (!r.ok) throw new Error("cars.json konnte nicht geladen werden");
  return (await r.json()) as Car[];
}

export async function loadMergedCars(): Promise<Car[]> {
  const base = await fetchBaseCars();
  const user = getUserCars();
  return mergeCars(base, user);
}
