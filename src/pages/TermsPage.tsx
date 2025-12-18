import React from "react";

export default function TermsPage() {
  return (
    <section className="max-w-7xl mx-auto px-4 pt-28 pb-16">
      <div className="text-zinc-300 uppercase text-xs tracking-wider">Konditionen</div>
      <h1 className="mt-2 text-3xl md:text-4xl font-bold">Mietbedingungen</h1>

      <div className="mt-8 grid md:grid-cols-3 gap-6">
        <div className="bg-zinc-900/60 p-6 rounded-2xl border border-white/10">
          <div className="font-semibold mb-1">Mietbedingungen</div>
          <p className="text-sm text-zinc-300">
            Mindestalter 25, gültige Kreditkarte, Kaution bei Abholung, 200km/Tag inklusive,
            Mehr-km €3,00.
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
      </div>
    </section>
  );
}
