import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Car } from "../lib/storage";
import { addUserCar } from "../lib/storage";

const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const schema = z.object({
  id: z
    .string()
    .min(3, "Mindestens 3 Zeichen")
    .regex(slugRegex, "Nur Kleinbuchstaben, Zahlen und Bindestriche (slug)"),
  brand: z.string().min(1, "Pflichtfeld"),
  model: z.string().min(1, "Pflichtfeld"),
  year: z.coerce.number().int().min(1900).max(2100),
  dailyPrice: z.coerce.number().positive(),
  weekendPrice: z.coerce.number().positive(),
  deposit: z.coerce.number().nonnegative(),
  powerHp: z.coerce.number().positive(),
  accel0to100: z.coerce.number().positive(),
  topspeedKmh: z.coerce.number().positive(),
  consumptionL100: z.coerce.number().positive(),
  drivetrain: z.string().min(1, "Pflichtfeld"),
  gearbox: z.string().min(1, "Pflichtfeld"),
  media: z.object({
    poster: z.string().min(1, "Pflichtfeld"),
    video: z.string().min(1, "Pflichtfeld"),
    audio: z.string().optional().or(z.literal("")),
  }),
});

type FormValues = z.infer<typeof schema>;

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="text-xs uppercase tracking-wide text-zinc-400">{label}</div>
      <div className="mt-1">{children}</div>
      {error ? <div className="mt-1 text-xs text-red-300">{error}</div> : null}
    </div>
  );
}

export default function CreateCarPage() {
  const navigate = useNavigate();
  const [savedId, setSavedId] = useState<string | null>(null);

  const defaults = useMemo<FormValues>(
    () => ({
      id: "",
      brand: "",
      model: "",
      year: new Date().getFullYear(),
      dailyPrice: 1000,
      weekendPrice: 3000,
      deposit: 5000,
      powerHp: 500,
      accel0to100: 3.5,
      topspeedKmh: 300,
      consumptionL100: 12,
      drivetrain: "RWD",
      gearbox: "Auto",
      media: {
        poster: "/images/<slug>-poster.jpg",
        video: "/videos/<slug>.mp4",
        audio: "",
      },
    }),
    []
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: defaults,
    mode: "onBlur",
  });

  const id = watch("id");
  const poster = watch("media.poster");
  const video = watch("media.video");
  const audio = watch("media.audio");

  const onSubmit = async (values: FormValues) => {
    const car: Car = {
      id: values.id,
      brand: values.brand,
      model: values.model,
      year: values.year,
      dailyPrice: values.dailyPrice,
      weekendPrice: values.weekendPrice,
      deposit: values.deposit,
      powerHp: values.powerHp,
      accel0to100: values.accel0to100,
      topspeedKmh: values.topspeedKmh,
      consumptionL100: values.consumptionL100,
      drivetrain: values.drivetrain,
      gearbox: values.gearbox,
      media: {
        poster: values.media.poster,
        video: values.media.video,
        audio: values.media.audio ? values.media.audio : undefined,
      },
    };

    addUserCar(car);
    setSavedId(car.id);
  };

  return (
    <section className="max-w-7xl mx-auto px-4 pt-28 pb-16">
      <div className="text-zinc-300 uppercase text-xs tracking-wider">CreateCar</div>
      <h1 className="mt-2 text-3xl md:text-4xl font-bold">Neues Fahrzeug anlegen</h1>
      <p className="mt-2 text-sm text-zinc-300 max-w-2xl">
        Validiertes Formular (react-hook-form + zod). Speichert in localStorage und erscheint
        anschließend in der Flotte/Detailansicht (Merge mit cars.json).
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 grid lg:grid-cols-2 gap-6">
        <div className="bg-zinc-900/60 p-6 rounded-2xl border border-white/10 space-y-4">
          <Field label="ID (slug)" error={errors.id?.message}>
            <input
              className="w-full px-3 py-2 rounded bg-zinc-800 border border-white/10"
              placeholder="z. B. porsche-911-gt3"
              {...register("id")}
            />
          </Field>

          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Brand" error={errors.brand?.message}>
              <input
                className="w-full px-3 py-2 rounded bg-zinc-800 border border-white/10"
                placeholder="Porsche"
                {...register("brand")}
              />
            </Field>
            <Field label="Model" error={errors.model?.message}>
              <input
                className="w-full px-3 py-2 rounded bg-zinc-800 border border-white/10"
                placeholder="911 GT3"
                {...register("model")}
              />
            </Field>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <Field label="Year" error={errors.year?.message as string | undefined}>
              <input
                type="number"
                className="w-full px-3 py-2 rounded bg-zinc-800 border border-white/10"
                {...register("year")}
              />
            </Field>
            <Field label="Drivetrain" error={errors.drivetrain?.message}>
              <input
                className="w-full px-3 py-2 rounded bg-zinc-800 border border-white/10"
                placeholder="RWD / AWD"
                {...register("drivetrain")}
              />
            </Field>
            <Field label="Gearbox" error={errors.gearbox?.message}>
              <input
                className="w-full px-3 py-2 rounded bg-zinc-800 border border-white/10"
                placeholder="Auto / Manual"
                {...register("gearbox")}
              />
            </Field>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <Field label="Daily Price (€)" error={errors.dailyPrice?.message as string | undefined}>
              <input
                type="number"
                className="w-full px-3 py-2 rounded bg-zinc-800 border border-white/10"
                {...register("dailyPrice")}
              />
            </Field>
            <Field
              label="Weekend Price (€)"
              error={errors.weekendPrice?.message as string | undefined}
            >
              <input
                type="number"
                className="w-full px-3 py-2 rounded bg-zinc-800 border border-white/10"
                {...register("weekendPrice")}
              />
            </Field>
            <Field label="Deposit (€)" error={errors.deposit?.message as string | undefined}>
              <input
                type="number"
                className="w-full px-3 py-2 rounded bg-zinc-800 border border-white/10"
                {...register("deposit")}
              />
            </Field>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <Field label="Power (HP)" error={errors.powerHp?.message as string | undefined}>
              <input
                type="number"
                className="w-full px-3 py-2 rounded bg-zinc-800 border border-white/10"
                {...register("powerHp")}
              />
            </Field>
            <Field label="0–100 (s)" error={errors.accel0to100?.message as string | undefined}>
              <input
                type="number"
                step="0.1"
                className="w-full px-3 py-2 rounded bg-zinc-800 border border-white/10"
                {...register("accel0to100")}
              />
            </Field>
            <Field
              label="Top Speed (km/h)"
              error={errors.topspeedKmh?.message as string | undefined}
            >
              <input
                type="number"
                className="w-full px-3 py-2 rounded bg-zinc-800 border border-white/10"
                {...register("topspeedKmh")}
              />
            </Field>
          </div>

          <Field
            label="Consumption (L/100km)"
            error={errors.consumptionL100?.message as string | undefined}
          >
            <input
              type="number"
              step="0.1"
              className="w-full px-3 py-2 rounded bg-zinc-800 border border-white/10"
              {...register("consumptionL100")}
            />
          </Field>
        </div>

        <div className="bg-zinc-900/60 p-6 rounded-2xl border border-white/10 space-y-4">
          <div className="text-lg font-semibold">Media</div>

          <Field label="Poster Path" error={errors.media?.poster?.message}>
            <input
              className="w-full px-3 py-2 rounded bg-zinc-800 border border-white/10"
              placeholder="/images/<slug>-poster.jpg"
              {...register("media.poster")}
            />
          </Field>

          <Field label="Video Path" error={errors.media?.video?.message}>
            <input
              className="w-full px-3 py-2 rounded bg-zinc-800 border border-white/10"
              placeholder="/videos/<slug>.mp4"
              {...register("media.video")}
            />
          </Field>

          <Field label="Audio Path (optional)" error={errors.media?.audio?.message}>
            <input
              className="w-full px-3 py-2 rounded bg-zinc-800 border border-white/10"
              placeholder="/audio/<slug>.mp3"
              {...register("media.audio")}
            />
          </Field>

          <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
            <div className="text-xs uppercase tracking-wide text-zinc-400 mb-2">
              Vorschau (Pfade)
            </div>
            <div className="text-sm text-zinc-200 break-all">
              <div>
                <span className="text-zinc-400">id:</span> {id || "—"}
              </div>
              <div>
                <span className="text-zinc-400">poster:</span> {poster || "—"}
              </div>
              <div>
                <span className="text-zinc-400">video:</span> {video || "—"}
              </div>
              <div>
                <span className="text-zinc-400">audio:</span> {audio || "—"}
              </div>
            </div>
          </div>

          <button
            disabled={isSubmitting}
            className="w-full rounded-xl bg-white text-zinc-900 py-3 font-semibold disabled:opacity-60"
            type="submit"
          >
            Speichern (localStorage)
          </button>

          {savedId ? (
            <div className="rounded-2xl border border-white/10 bg-zinc-900/40 p-4">
              <div className="text-sm text-zinc-200">
                Gespeichert: <span className="font-semibold">{savedId}</span>
              </div>
              <div className="mt-3 flex gap-3">
                <button
                  type="button"
                  onClick={() => navigate(`/cars/${encodeURIComponent(savedId)}`)}
                  className="inline-flex items-center justify-center rounded-xl bg-white text-zinc-900 px-4 py-2 font-semibold"
                >
                  Zur Detailseite
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/fleet")}
                  className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-black/30 text-white px-4 py-2 font-semibold hover:border-white/25"
                >
                  Zur Flotte
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </form>
    </section>
  );
}
