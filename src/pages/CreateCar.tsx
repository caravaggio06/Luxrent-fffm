import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { fsUpsertCar, type Car } from "../lib/carsFirestore";

const schema = z.object({
  id: z
    .string()
    .min(1, "ID ist erforderlich")
    .regex(/^[a-z0-9-]+$/, "ID nur in Kleinbuchstaben, Zahlen und '-' (slug)"),
  brand: z.string().min(1, "Marke ist erforderlich"),
  model: z.string().min(1, "Modell ist erforderlich"),
  year: z.coerce.number().int().min(1900).max(2100),
  dailyPrice: z.coerce.number().positive(),
  weekendPrice: z.coerce.number().positive(),
  deposit: z.coerce.number().nonnegative(),
  powerHp: z.coerce.number().positive(),
  accel0to100: z.coerce.number().positive(),
  topspeedKmh: z.coerce.number().positive(),
  consumptionL100: z.coerce.number().positive(),
  drivetrain: z.string().min(1),
  gearbox: z.string().min(1),
  media: z.object({
    poster: z.string().optional(),
    video: z.string().optional(),
    audio: z.string().optional(),
  }),
});

type FormValues = z.infer<typeof schema>;

export default function CreateCar() {
  const navigate = useNavigate();

  const [values, setValues] = useState<FormValues>({
    id: "",
    brand: "",
    model: "",
    year: new Date().getFullYear(),
    dailyPrice: 1000,
    weekendPrice: 2500,
    deposit: 5000,
    powerHp: 500,
    accel0to100: 3.5,
    topspeedKmh: 300,
    consumptionL100: 10,
    drivetrain: "RWD",
    gearbox: "Auto",
    media: { poster: "", video: "", audio: "" },
  });

  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const canSubmit = useMemo(() => !submitting, [submitting]);

  function setField<K extends keyof FormValues>(key: K, v: FormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: v }));
  }

  function setMediaField(key: keyof FormValues["media"], v: string) {
    setValues((prev) => ({ ...prev, media: { ...prev.media, [key]: v } }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    setFieldErrors({});

    const parsed = schema.safeParse(values);
    if (!parsed.success) {
      const next: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const path = issue.path.join(".");
        next[path] = issue.message;
      }
      setFieldErrors(next);
      setFormError("Bitte prüfe die Eingaben.");
      return;
    }

    const car: Car = {
      ...parsed.data,
      media: {
        poster: parsed.data.media.poster?.trim() || undefined,
        video: parsed.data.media.video?.trim() || undefined,
        audio: parsed.data.media.audio?.trim() || undefined,
      },
    };

    try {
      setSubmitting(true);
      await fsUpsertCar(car);
      navigate("/fleet");
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Speichern fehlgeschlagen");
    } finally {
      setSubmitting(false);
    }
  }

  const err = (name: string) => fieldErrors[name];

  return (
    <section className="max-w-7xl mx-auto px-4 pt-28 pb-16">
      <div className="text-zinc-300 uppercase text-xs tracking-wider">Create</div>
      <h1 className="mt-2 text-3xl md:text-4xl font-bold">Fahrzeug anlegen</h1>

      <form onSubmit={onSubmit} className="mt-8 bg-zinc-900/60 p-6 rounded-2xl border border-white/10 space-y-4">
        {formError ? (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-red-200">{formError}</div>
        ) : null}

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-zinc-300">ID (slug)</label>
            <input
              className="mt-1 w-full px-3 py-2 rounded bg-zinc-800 border border-white/10"
              value={values.id}
              onChange={(e) => setField("id", e.target.value)}
              placeholder="z. B. ferrari-296-gtb"
            />
            {err("id") ? <div className="mt-1 text-xs text-red-200">{err("id")}</div> : null}
          </div>

          <div>
            <label className="text-sm text-zinc-300">Jahr</label>
            <input
              className="mt-1 w-full px-3 py-2 rounded bg-zinc-800 border border-white/10"
              value={values.year}
              onChange={(e) => setField("year", e.target.value as any)}
              inputMode="numeric"
            />
            {err("year") ? <div className="mt-1 text-xs text-red-200">{err("year")}</div> : null}
          </div>

          <div>
            <label className="text-sm text-zinc-300">Marke</label>
            <input
              className="mt-1 w-full px-3 py-2 rounded bg-zinc-800 border border-white/10"
              value={values.brand}
              onChange={(e) => setField("brand", e.target.value)}
            />
            {err("brand") ? <div className="mt-1 text-xs text-red-200">{err("brand")}</div> : null}
          </div>

          <div>
            <label className="text-sm text-zinc-300">Modell</label>
            <input
              className="mt-1 w-full px-3 py-2 rounded bg-zinc-800 border border-white/10"
              value={values.model}
              onChange={(e) => setField("model", e.target.value)}
            />
            {err("model") ? <div className="mt-1 text-xs text-red-200">{err("model")}</div> : null}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm text-zinc-300">Preis/Tag (€)</label>
            <input
              className="mt-1 w-full px-3 py-2 rounded bg-zinc-800 border border-white/10"
              value={values.dailyPrice}
              onChange={(e) => setField("dailyPrice", e.target.value as any)}
              inputMode="decimal"
            />
            {err("dailyPrice") ? <div className="mt-1 text-xs text-red-200">{err("dailyPrice")}</div> : null}
          </div>

          <div>
            <label className="text-sm text-zinc-300">Preis/Wochenende (€)</label>
            <input
              className="mt-1 w-full px-3 py-2 rounded bg-zinc-800 border border-white/10"
              value={values.weekendPrice}
              onChange={(e) => setField("weekendPrice", e.target.value as any)}
              inputMode="decimal"
            />
            {err("weekendPrice") ? <div className="mt-1 text-xs text-red-200">{err("weekendPrice")}</div> : null}
          </div>

          <div>
            <label className="text-sm text-zinc-300">Kaution (€)</label>
            <input
              className="mt-1 w-full px-3 py-2 rounded bg-zinc-800 border border-white/10"
              value={values.deposit}
              onChange={(e) => setField("deposit", e.target.value as any)}
              inputMode="decimal"
            />
            {err("deposit") ? <div className="mt-1 text-xs text-red-200">{err("deposit")}</div> : null}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm text-zinc-300">Leistung (PS)</label>
            <input
              className="mt-1 w-full px-3 py-2 rounded bg-zinc-800 border border-white/10"
              value={values.powerHp}
              onChange={(e) => setField("powerHp", e.target.value as any)}
              inputMode="decimal"
            />
            {err("powerHp") ? <div className="mt-1 text-xs text-red-200">{err("powerHp")}</div> : null}
          </div>

          <div>
            <label className="text-sm text-zinc-300">0–100 (s)</label>
            <input
              className="mt-1 w-full px-3 py-2 rounded bg-zinc-800 border border-white/10"
              value={values.accel0to100}
              onChange={(e) => setField("accel0to100", e.target.value as any)}
              inputMode="decimal"
            />
            {err("accel0to100") ? <div className="mt-1 text-xs text-red-200">{err("accel0to100")}</div> : null}
          </div>

          <div>
            <label className="text-sm text-zinc-300">Vmax (km/h)</label>
            <input
              className="mt-1 w-full px-3 py-2 rounded bg-zinc-800 border border-white/10"
              value={values.topspeedKmh}
              onChange={(e) => setField("topspeedKmh", e.target.value as any)}
              inputMode="decimal"
            />
            {err("topspeedKmh") ? <div className="mt-1 text-xs text-red-200">{err("topspeedKmh")}</div> : null}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm text-zinc-300">Verbrauch (l/100km)</label>
            <input
              className="mt-1 w-full px-3 py-2 rounded bg-zinc-800 border border-white/10"
              value={values.consumptionL100}
              onChange={(e) => setField("consumptionL100", e.target.value as any)}
              inputMode="decimal"
            />
            {err("consumptionL100") ? <div className="mt-1 text-xs text-red-200">{err("consumptionL100")}</div> : null}
          </div>

          <div>
            <label className="text-sm text-zinc-300">Antrieb</label>
            <input
              className="mt-1 w-full px-3 py-2 rounded bg-zinc-800 border border-white/10"
              value={values.drivetrain}
              onChange={(e) => setField("drivetrain", e.target.value)}
              placeholder="RWD / AWD / FWD"
            />
            {err("drivetrain") ? <div className="mt-1 text-xs text-red-200">{err("drivetrain")}</div> : null}
          </div>

          <div>
            <label className="text-sm text-zinc-300">Getriebe</label>
            <input
              className="mt-1 w-full px-3 py-2 rounded bg-zinc-800 border border-white/10"
              value={values.gearbox}
              onChange={(e) => setField("gearbox", e.target.value)}
              placeholder="Auto / Manuell"
            />
            {err("gearbox") ? <div className="mt-1 text-xs text-red-200">{err("gearbox")}</div> : null}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm text-zinc-300">Poster-Pfad</label>
            <input
              className="mt-1 w-full px-3 py-2 rounded bg-zinc-800 border border-white/10"
              value={values.media.poster ?? ""}
              onChange={(e) => setMediaField("poster", e.target.value)}
              placeholder="/images/…"
            />
            {err("media.poster") ? <div className="mt-1 text-xs text-red-200">{err("media.poster")}</div> : null}
          </div>

          <div>
            <label className="text-sm text-zinc-300">Video-Pfad</label>
            <input
              className="mt-1 w-full px-3 py-2 rounded bg-zinc-800 border border-white/10"
              value={values.media.video ?? ""}
              onChange={(e) => setMediaField("video", e.target.value)}
              placeholder="/videos/…"
            />
            {err("media.video") ? <div className="mt-1 text-xs text-red-200">{err("media.video")}</div> : null}
          </div>

          <div>
            <label className="text-sm text-zinc-300">Audio-Pfad (optional)</label>
            <input
              className="mt-1 w-full px-3 py-2 rounded bg-zinc-800 border border-white/10"
              value={values.media.audio ?? ""}
              onChange={(e) => setMediaField("audio", e.target.value)}
              placeholder="/audio/…"
            />
            {err("media.audio") ? <div className="mt-1 text-xs text-red-200">{err("media.audio")}</div> : null}
          </div>
        </div>

        <div className="pt-2 flex items-center gap-3">
          <button
            type="submit"
            disabled={!canSubmit}
            className="px-4 py-2 rounded-xl bg-white text-black font-semibold disabled:opacity-60"
          >
            {submitting ? "Speichere…" : "Speichern"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/fleet")}
            className="px-4 py-2 rounded-xl border border-white/15 text-white hover:border-white/25 transition-colors"
          >
            Abbrechen
          </button>
        </div>
      </form>
    </section>
  );
}
