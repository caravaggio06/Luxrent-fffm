import React from "react";
type Car = {
  dailyPrice: number; weekendPrice: number; deposit: number; id: string; brand: string; model: string;
};
export default function PricePanel({ car }: { car: Car }) {
  return (
    <div className="grid grid-cols-3 gap-4 text-center">
      <div className="rounded-xl bg-zinc-900 p-4">
        <div className="text-xs uppercase text-zinc-400">Tag</div>
        <div className="text-2xl font-semibold">€ {car.dailyPrice}</div>
      </div>
      <div className="rounded-xl bg-zinc-900 p-4">
        <div className="text-xs uppercase text-zinc-400">Wochenende</div>
        <div className="text-2xl font-semibold">€ {car.weekendPrice}</div>
      </div>
      <div className="rounded-xl bg-zinc-900 p-4">
        <div className="text-xs uppercase text-zinc-400">Kaution</div>
        <div className="text-2xl font-semibold">€ {car.deposit}</div>
      </div>
      <a
        href={`https://wa.me/4917672183329?text=Anfrage%20${encodeURIComponent(car.brand + " " + car.model)}`}
        className="col-span-3 mt-2 inline-flex items-center justify-center rounded-xl bg-white text-zinc-900 py-3 font-semibold"
      >Jetzt anfragen</a>
    </div>
  );
}
