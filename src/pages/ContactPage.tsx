import React from "react";

export default function ContactPage() {
  return (
    <section className="max-w-7xl mx-auto px-4 pt-28 pb-16 grid md:grid-cols-2 gap-6">
      <form className="bg-zinc-900/60 p-6 rounded-2xl border border-white/10 space-y-3">
        <div className="text-lg font-semibold">Anfrage</div>
        <input
          className="w-full px-3 py-2 rounded bg-zinc-800 border border-white/10"
          placeholder="Name"
        />
        <input
          className="w-full px-3 py-2 rounded bg-zinc-800 border border-white/10"
          placeholder="E-Mail"
        />
        <input
          className="w-full px-3 py-2 rounded bg-zinc-800 border border-white/10"
          placeholder="Telefon"
        />
        <textarea
          className="w-full px-3 py-2 rounded bg-zinc-800 border border-white/10"
          placeholder="Wunschdatum, Fahrzeug"
        />
        <button className="w-full rounded-xl bg-white text-zinc-900 py-3 font-semibold">
          Absenden
        </button>
        <div className="text-xs text-zinc-500">
          Hinweis: Kein Backend – Formular ist nur UI.
        </div>
      </form>

      <div className="bg-zinc-900/60 p-6 rounded-2xl border border-white/10">
        <div className="text-lg font-semibold mb-2">Direktkontakt</div>
        <p className="text-sm text-zinc-300">Telefon: +49 176 12345678</p>
        <p className="text-sm text-zinc-300">E-Mail: info@k-co.tech</p>
      </div>
    </section>
  );
}
