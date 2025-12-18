import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import VideoStage from "../components/VideoStage";
import StatBar from "../components/StatBar";
import PricePanel from "../components/PricePanel";
import SoundButton from "../components/SoundButton";
import HUDPanel from "../components/HUDPanel";
import Chip from "../components/Chip";
import { useAccentFromPoster } from "../hooks/useAccent";
import type { Car } from "../lib/storage";
import { loadMergedCars } from "../lib/cars";
import { setLastViewedCarId } from "../lib/storage";

export default function CarDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cars, setCars] = useState<Car[]>([]);
  const [active, setActive] = useState<Car | null>(null);
  const audioStopBus = React.useRef<(() => void) | null>(null);

  useEffect(() => {
    loadMergedCars()
      .then((list) => {
        setCars(list);
        const found = list.find((c) => c.id === id) ?? null;
        setActive(found);
        if (found) setLastViewedCarId(found.id);
      })
      .catch(() => {
        setCars([]);
        setActive(null);
      });
  }, [id]);

  useAccentFromPoster(active?.media?.poster ?? "");

  const stopAudio = () => audioStopBus.current?.();

  const idx = useMemo(() => {
    if (!active) return -1;
    return cars.findIndex((c) => c.id === active.id);
  }, [cars, active]);

  const prev = () => {
    if (!cars.length || idx < 0) return;
    stopAudio();
    const nextIdx = (idx - 1 + cars.length) % cars.length;
    navigate(`/cars/${encodeURIComponent(cars[nextIdx].id)}`);
  };

  const next = () => {
    if (!cars.length || idx < 0) return;
    stopAudio();
    const nextIdx = (idx + 1) % cars.length;
    navigate(`/cars/${encodeURIComponent(cars[nextIdx].id)}`);
  };

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rot = useTransform(mx, [-1, 1], [-2, 2]);
  const ty = useTransform(my, [-1, 1], [6, -6]);

  if (!active) {
    return (
      <div className="p-8 pt-28 text-zinc-200">
        <div className="text-sm text-zinc-400">Fahrzeug nicht gefunden.</div>
        <Link to="/fleet" className="inline-block mt-4 text-accent hover:underline">
          Zur Flotte
        </Link>
      </div>
    );
  }

  return (
    <section className="relative isolate overflow-hidden min-h-[calc(100dvh-76px)]">
      <div className="absolute inset-0 -z-10">
        <VideoStage src={active.media.video} poster={active.media.poster} />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,.55)_70%,rgba(0,0,0,.92)_100%)]" />
      </div>

      <div className="absolute inset-y-0 left-0 flex items-center z-10">
        <button
          onClick={prev}
          aria-label="Vorheriges Fahrzeug"
          className="mx-2 md:mx-4 h-10 w-10 rounded-full bg-white/10 hover:bg-white/20"
        >
          ◀
        </button>
      </div>
      <div className="absolute inset-y-0 right-0 flex items-center z-10">
        <button
          onClick={next}
          aria-label="Nächstes Fahrzeug"
          className="mx-2 md:mx-4 h-10 w-10 rounded-full bg-white/10 hover:bg-white/20"
        >
          ▶
        </button>
      </div>

      <div
        className="relative z-10 mx-auto max-w-7xl px-4 pt-28 pb-24"
        onMouseMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          mx.set(((e.clientX - r.left) / r.width) * 2 - 1);
          my.set(((e.clientY - r.top) / r.height) * 2 - 1);
        }}
      >
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <div className="text-zinc-300 uppercase text-xs tracking-wider">
              Detail (Fullscreen)
            </div>
            <AnimatePresence mode="wait">
              <motion.h1
                key={active.id + "-title"}
                className="text-4xl md:text-5xl font-bold leading-tight drop-shadow"
                initial={{ y: 12, opacity: 0 }}
                animate={{ y: 0, opacity: 1, transition: { delay: 0.05, duration: 0.5 } }}
                exit={{ y: -12, opacity: 0, transition: { duration: 0.25 } }}
              >
                <span className="text-accent-weak">{active.brand}</span> {active.model}
              </motion.h1>
            </AnimatePresence>
            <div className="mt-1 text-xs text-zinc-300/80">
              {active.year} • {active.drivetrain} • {active.gearbox}
            </div>
          </div>

          <div className="flex gap-3">
            <Link
              to="/fleet"
              className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-black/30 text-white px-4 py-2 font-semibold hover:border-white/25"
            >
              Zur Flotte
            </Link>
          </div>
        </div>

        <motion.div style={{ rotate: rot, y: ty }} className="mt-8 grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2 grid gap-6 sm:grid-cols-2">
            <HUDPanel>
              <StatBar label="Leistung" value={active.powerHp} max={1000} suffix=" PS" />
            </HUDPanel>
            <HUDPanel>
              <StatBar label="V-Max" value={active.topspeedKmh} max={400} suffix=" km/h" />
            </HUDPanel>
            <HUDPanel title="0–100">
              <div className="text-2xl">{active.accel0to100}s</div>
            </HUDPanel>
            <HUDPanel title="Verbrauch">
              <div className="text-2xl">{active.consumptionL100} L/100km</div>
            </HUDPanel>
          </div>

          <div className="flex flex-col gap-4">
            <HUDPanel>
              <SoundButton src={active.media.audio ?? ""} onStopOther={() => stopAudio()} />
            </HUDPanel>
            <HUDPanel>
              <PricePanel car={active} />
            </HUDPanel>
          </div>
        </motion.div>

        <div className="pointer-events-auto absolute left-0 right-0 bottom-6 z-10">
          <div className="mx-auto max-w-7xl px-4 flex gap-3 overflow-x-auto">
            {cars.map((c) => (
              <Chip
                key={c.id}
                active={c.id === active.id}
                onClick={() => {
                  stopAudio();
                  navigate(`/cars/${encodeURIComponent(c.id)}`);
                }}
              >
                {c.brand} {c.model}
              </Chip>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
