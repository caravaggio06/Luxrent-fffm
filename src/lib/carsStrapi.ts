import type { Car } from "./storage";

type StrapiEntity<T> = {
  id: number;
  attributes: T;
};

type StrapiListResponse<T> = {
  data: Array<StrapiEntity<T>> | null;
  meta?: unknown;
  error?: { status: number; name: string; message: string; details?: unknown };
};

type StrapiCarAttributes = {
  slug?: string;

  brand?: string;
  model?: string;
  year?: number;

  dailyPrice?: number;
  weekendPrice?: number;
  deposit?: number;

  powerHp?: number;
  accel0to100?: number;
  accelTo100?: number;
  topspeedKmh?: number;
  consumptionL100?: number;

  drivetrain?: string;
  gearbox?: string;

  media?:
    | {
        poster?: string | null;
        video?: string | null;
        audio?: string | null;
      }
    | null;
};

function getStrapiBaseUrl(): string {
  const raw = import.meta.env.VITE_STRAPI_URL as string | undefined;
  return (raw && raw.trim().length ? raw.trim() : "http://192.168.0.206:1337").replace(/\/+$/, "");
}

function toNumber(v: unknown, fallback = 0): number {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string" && v.trim().length) {
    const n = Number(v);
    if (Number.isFinite(n)) return n;
  }
  return fallback;
}

function toString(v: unknown, fallback = ""): string {
  return typeof v === "string" ? v : fallback;
}

function mapStrapiCarToCar(entity: StrapiEntity<StrapiCarAttributes>): Car {
  const a = entity.attributes ?? ({} as StrapiCarAttributes);

  const slug = a.slug && a.slug.trim().length ? a.slug.trim() : String(entity.id);

  const accel =
    typeof a.accel0to100 !== "undefined"
      ? a.accel0to100
      : typeof a.accelTo100 !== "undefined"
      ? a.accelTo100
      : 0;

  return {
    id: slug,
    brand: toString(a.brand, ""),
    model: toString(a.model, ""),
    year: toNumber(a.year, 0),

    dailyPrice: toNumber(a.dailyPrice, 0),
    weekendPrice: toNumber(a.weekendPrice, 0),
    deposit: toNumber(a.deposit, 0),

    powerHp: toNumber(a.powerHp, 0),
    accel0to100: toNumber(accel, 0),
    topspeedKmh: toNumber(a.topspeedKmh, 0),
    consumptionL100: toNumber(a.consumptionL100, 0),

    drivetrain: toString(a.drivetrain, ""),
    gearbox: toString(a.gearbox, ""),

    media: {
      poster: a.media?.poster ?? "",
      video: a.media?.video ?? "",
      audio: a.media?.audio ?? "",
    },
  } as Car;
}

async function parsePossiblyHtmlWrappedJson<T>(r: Response): Promise<T> {
  try {
    return (await r.json()) as T;
  } catch {
    const t = await r.text();
    const m = t.match(/\{[\s\S]*\}/);
    if (!m) throw new Error("Response ist kein gültiges JSON");
    return JSON.parse(m[0]) as T;
  }
}

export async function strapiListCars(): Promise<Car[]> {
  const base = getStrapiBaseUrl();
  const url = `${base}/api/cars`;

  const r = await fetch(url);
  if (!r.ok) {
    throw new Error(`Strapi cars konnten nicht geladen werden (${r.status})`);
  }

  const payload = await parsePossiblyHtmlWrappedJson<StrapiListResponse<StrapiCarAttributes>>(r);

  if (payload.error) {
    throw new Error(`Strapi Fehler: ${payload.error.message ?? "Unbekannter Fehler"}`);
  }

  const data = payload.data;
  if (!Array.isArray(data)) return [];

  return data.map(mapStrapiCarToCar);
}

export async function strapiGetCarBySlug(slug: string): Promise<Car | null> {
  const list = await strapiListCars();
  return list.find((c) => c.id === slug) ?? null;
}
