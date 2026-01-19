import React from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import StatBar from "./StatBar";
import PricePanel from "./PricePanel";
import SoundButton from "./SoundButton";
import VideoStage from "./VideoStage";
import { useCars } from "../context/CarsContext";
import type { Car as StorageCar } from "../lib/storage";

type Car = StorageCar;

type Props = {
  cars?: Car[];
  activeIndex?: number;
  onPrev?: () => void;
  onNext?: () => void;
  onStopAudio?: () => void;
};

export default function CarSwitch(props: Props) {
  const ctx = useCars();

  const cars = props.cars ?? ctx.cars;
  const activeIndex = props.activeIndex ?? ctx.activeIndex;
  const setActiveIndex = ctx.setActiveIndex;

  const onPrev = props.onPrev ?? (() => setActiveIndex(Math.max(0, activeIndex - 1)));
  const onNext =
    props.onNext ??
    (() => {
      if (cars.length === 0) return;
      setActiveIndex((activeIndex + 1) % cars.length);
    });
  const onStopAudio = props.onStopAudio ?? (() => {});

  const car = cars[activeIndex];

  if (!car) {
    return null;
  }

  // HUD Parallax
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rot = useTransform(mx, [-1, 1], [-2, 2]);

  return (
    <section className="relative vh-100 isolate overflow-hidden">
      {/* VIDEO: Fullscreen, unter allen Overlays */}
      <div className="absolute inset-0 -z-10">
        {/* VIDEO-Layer */}
        <div className="absolute inset-0 -z-10">
          <VideoStage src={car.media.video} poster={car.media.poster} />
          <div className="absolute inset-0" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,.55)_70%,rgba(0,0,0,.9)_100%)]" />
        </div>
        {/* Vignette + Gradients */}
        <div className="absolute inset-0" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,.55)_70%,rgba(0,0,0,.9)_100%)]" />
      </div>

      {/* ARROWS */}
      <div className="absolute inset-y-0 left-0 flex items-center">
        <button
          onClick={onPrev}
          aria-label="Vorheriges Fahrzeug"
          className="mx-2 md:mx-4 h-10 w-10 rounded-full bg-white/10 hover:bg-white/20"
        >
          ◀
        </button>
      </div>
      <div className="absolute inset-y-0 right-0 flex items-center">
        <button
          onClick={onNext}
          aria-label="Nächstes Fahrzeug"
          className="mx-2 md:mx-4 h-10 w-10 rounded-full bg-white/10 hover:bg-white/20"
        >
          ▶
        </button>
      </div>

      {/* HUD LAYER */}
      <div
        className="relative z-10 mx-auto max-w-7xl px-4 pt-24"
        onMouseMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          mx.set(((e.clientX - r.left) / r.width) * 2 - 1);
          my.set(((e.clientY - r.top) / r.height) * 2 - 1);
        }}
      >
        {/* Titelzeile */}
        <div className="mb-6">
          <div className="text-zinc-300 uppercase text-xs tracking-wider">Luxusflotte</div>
          <AnimatePresence mode="wait">
            <motion.h1
              key={car.id + "-title"}
              className="text-4xl md:text-5xl font-bold leading-tight drop-shadow"
              initial={{ y: 12, opacity: 0 }}
              animate={{ y: 0, opacity: 1, transition: { delay: 0.1, duration: 0.5 } }}
              exit={{ y: -12, opacity: 0, transition: { duration: 0.25 } }}
            >
              <span className="text-accent-weak">{car.brand}</span> {car.model}
            </motion.h1>
          </AnimatePresence>
          <div className="mt-1 text-xs text-zinc-300/80">
            {car.year} • {car.drivetrain} • {car.gearbox}
          </div>
        </div>

        {/* HUD GRID */}
        <motion.div style={{ rotate: rot }} className="grid gap-6 md:grid-cols-3">
          {/* Linke Spalte: große Stats */}
          <div className="md:col-span-2 grid gap-6 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-black/30 p-5 backdrop-blur">
              <StatBar label="Leistung" value={car.powerHp} max={1000} suffix=" PS" />
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/30 p-5 backdrop-blur">
              <StatBar label="V-Max" value={car.topspeedKmh} max={400} suffix=" km/h" />
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/30 p-5 backdrop-blur">
              <div className="text-xs uppercase tracking-wide text-zinc-400 mb-1">0–100</div>
              <div className="text-2xl">{car.accel0to100}s</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/30 p-5 backdrop-blur">
              <div className="text-xs uppercase tracking-wide text-zinc-400 mb-1">Verbrauch</div>
              <div className="text-2xl">{car.consumptionL100} L/100km</div>
            </div>
          </div>

          {/* Rechte Spalte: Controls + Preise */}
          <div className="flex flex-col gap-4">
            <div className="rounded-2xl border border-white/10 bg-black/40 p-5 backdrop-blur">
              <SoundButton src={car.media.audio} onStopOther={onStopAudio} />
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/40 p-5 backdrop-blur">
              <PricePanel car={car} />
            </div>
          </div>
        </motion.div>

        {/* Chips unten */}
        <div className="pointer-events-auto absolute left-0 right-0 bottom-6 z-10">
          <div className="mx-auto max-w-7xl px-4 flex gap-3 overflow-x-auto">
            {cars.map((c: Car, idx: number) => (
              <button
                key={c.id}
                onClick={() => {
                  onStopAudio();
                  if (props.activeIndex !== undefined && props.onNext) {
                    // Falls die Steuerung weiterhin extern über Props läuft, nichts ändern
                    if (idx !== props.activeIndex) {
                      props.onNext();
                    }
                  } else {
                    // Fallback: Context-Variante
                    setActiveIndex(idx);
                  }
                }}
                className={`px-3 py-2 rounded-xl border ${
                  c.id === car.id ? "border-accent text-white" : "border-white/15 text-zinc-300"
                } whitespace-nowrap`}
              >
                {c.brand} {c.model}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
