import React from "react";
import { Link } from "react-router-dom";
import type { Car } from "../lib/storage";

export default function CarCard({ car }: { car: Car }) {
  return (
    <Link
      to={`/cars/${encodeURIComponent(car.id)}`}
      className="group rounded-2xl border border-white/10 bg-zinc-900/40 overflow-hidden hover:border-white/20 transition-colors"
    >
      <div className="relative aspect-[16/10]">
        <img
          src={car.media.poster}
          alt={`${car.brand} ${car.model}`}
          className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
          loading="lazy"
        />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,.35)_70%,rgba(0,0,0,.75)_100%)]" />
      </div>
      <div className="p-4">
        <div className="text-xs uppercase tracking-wider text-zinc-400">
          {car.brand}
        </div>
        <div className="text-lg font-semibold leading-tight">{car.model}</div>
        <div className="mt-2 text-xs text-zinc-300/80">
          {car.year} • {car.drivetrain} • {car.gearbox}
        </div>
        <div className="mt-3 text-sm text-zinc-200">
          <span className="text-zinc-400">ab</span> € {car.dailyPrice}{" "}
          <span className="text-zinc-400">/ Tag</span>
        </div>
      </div>
    </Link>
  );
}
