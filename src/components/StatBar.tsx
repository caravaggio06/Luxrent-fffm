import React from "react";
type Props = { label: string; value: number; max: number; suffix?: string };
export default function StatBar({ label, value, max, suffix }: Props) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <div className="space-y-1">
      <div className="text-xs uppercase tracking-wide text-zinc-400">{label}</div>
      <div className="h-2 bg-zinc-800 rounded">
        <div
          className="h-2 rounded bg-white/80 transition-[width] duration-500"
          style={{ width: `${pct}%` }}
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
          role="progressbar"
        />
      </div>
      <div className="text-xs text-zinc-400">{value}{suffix ?? ""}</div>
    </div>
  );
}
