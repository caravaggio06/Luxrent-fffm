import React, { useEffect, useRef, useState } from "react";
import CarSwitch from "./components/CarSwitch";
import StartScreen from "./components/StartScreen";
import { useAccentFromPoster } from "./hooks/useAccent";

type Car = any;

export default function App() {
  const [cars, setCars] = useState<Car[]>([]);
  const [i, setI] = useState(0);
  const [splash, setSplash] = useState(true);
  const audioStopBus = useRef<(() => void) | null>(null);

  useEffect(() => {
    fetch("/data/cars.json").then(r => r.json()).then(setCars);
  }, []);

  useAccentFromPoster(cars[i]?.media?.poster ?? "");

  const stopAudio = () => audioStopBus.current?.();
  const prev = () => { stopAudio(); setI(v => (v - 1 + cars.length) % cars.length); };
  const next = () => { stopAudio(); setI(v => (v + 1) % cars.length); };

  if (!cars.length) return <div className="p-8">Lädt…</div>;

  return (
    <div className="min-h-dvh relative">
      <StartScreen show={splash} onDone={() => setSplash(false)} />

      {/* Fixed, transparenter Header über dem Fullscreen-Video */}
      <header className="fixed top-0 inset-x-0 z-20 bg-transparent h-[76px]">
        <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
          <div className="font-semibold tracking-wide">LUX•RENT</div>
          <nav className="flex gap-6 text-sm text-zinc-200">
            <a href="#fleet" className="hover:text-accent">Flotte</a>
            <a href="#terms" className="hover:text-accent">Konditionen</a>
            <a href="#contact" className="hover:text-accent">Kontakt</a>
          </nav>
        </div>
      </header>

      <main className="mx-auto">
        {/* Fullscreen-Hero mit Video und HUD (CarSwitch rendert selbst Fullscreen) */}
        <section id="fleet" className="scroll-mt-[76px]">
          <CarSwitch
            cars={cars}
            activeIndex={i}
            onPrev={prev}
            onNext={next}
            onStopAudio={stopAudio}
          />
        </section>

        {/* Nachgelagerte Sektionen */}
        <section id="terms" className="scroll-mt-[76px] max-w-7xl mx-auto px-4 py-16 grid md:grid-cols-3 gap-6">
          <div className="bg-zinc-900/60 p-6 rounded-2xl border border-white/10">
            <div className="font-semibold mb-1">Mietbedingungen</div>
            <p className="text-sm text-zinc-300">
              Mindestalter 25, gültige Kreditkarte, Kaution bei Abholung, 200km/Tag inklusive, Mehr-km €3,00.
            </p>
          </div>
          <div className="bg-zinc-900/60 p-6 rounded-2xl border border-white/10">
            <div className="font-semibold mb-1">Lieferung</div>
            <p className="text-sm text-zinc-300">
              Zustellung bundesweit auf Anfrage, Abholung in Wiesbaden möglich.
            </p>
          </div>
          <div className="bg-zinc-900/60 p-6 rounded-2xl border border-white/10">
            <div className="font-semibold mb-1">Versicherung</div>
            <p className="text-sm text-zinc-300">
              Vollkasko mit Selbstbeteiligung; Reduktion optional.
            </p>
          </div>
        </section>

        <section id="contact" className="scroll-mt-[76px] max-w-7xl mx-auto px-4 pb-20 grid md:grid-cols-2 gap-6">
          <form className="bg-zinc-900/60 p-6 rounded-2xl border border-white/10 space-y-3">
            <div className="text-lg font-semibold">Anfrage</div>
            <input className="w-full px-3 py-2 rounded bg-zinc-800 border border-white/10" placeholder="Name" />
            <input className="w-full px-3 py-2 rounded bg-zinc-800 border border-white/10" placeholder="E-Mail" />
            <input className="w-full px-3 py-2 rounded bg-zinc-800 border border-white/10" placeholder="Telefon" />
            <textarea className="w-full px-3 py-2 rounded bg-zinc-800 border border-white/10" placeholder="Wunschdatum, Fahrzeug" />
            <button className="w-full rounded-xl bg-white text-zinc-900 py-3 font-semibold">Absenden</button>
          </form>
          <div className="bg-zinc-900/60 p-6 rounded-2xl border border-white/10">
            <div className="text-lg font-semibold mb-2">Direktkontakt</div>
            <p className="text-sm text-zinc-300">Telefon: +49 176 72183329</p>
            <p className="text-sm text-zinc-300">E-Mail: info@k-co.tech</p>
          </div>
        </section>
      </main>

      <footer className="max-w-7xl mx-auto px-4 py-8 text-xs text-zinc-400">
        © {new Date().getFullYear()} LUX•RENT
      </footer>
    </div>
  );
}
