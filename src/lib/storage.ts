export type Car = {
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
  drivetrain: string;
  gearbox: string;
  consumptionL100: number;
  media: { poster: string; video: string; audio?: string };
};

const USER_CARS_KEY = "luxrent:userCars:v1";
const LAST_VIEWED_KEY = "luxrent:lastViewedCarId:v1";

function safeParseJson<T>(raw: string | null): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function getUserCars(): Car[] {
  const parsed = safeParseJson<unknown>(localStorage.getItem(USER_CARS_KEY));
  if (!Array.isArray(parsed)) return [];
  return parsed as Car[];
}

export function addUserCar(car: Car): Car[] {
  const current = getUserCars();
  const next = [car, ...current.filter((c) => c.id !== car.id)];
  localStorage.setItem(USER_CARS_KEY, JSON.stringify(next));
  return next;
}

export function getLastViewedCarId(): string | null {
  const v = localStorage.getItem(LAST_VIEWED_KEY);
  return v && v.trim().length ? v : null;
}

export function setLastViewedCarId(id: string) {
  localStorage.setItem(LAST_VIEWED_KEY, id);
}

export function mergeCars(baseCars: Car[], userCars: Car[]): Car[] {
  const byId = new Map<string, Car>();
  for (const c of baseCars) byId.set(c.id, c);
  for (const c of userCars) byId.set(c.id, c);
  return Array.from(byId.values());
}
