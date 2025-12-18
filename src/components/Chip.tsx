import React from "react";

export default function Chip({
  active,
  children,
  onClick,
}: {
  active?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "px-3 py-2 rounded-xl border whitespace-nowrap transition-colors",
        active
          ? "border-accent text-white"
          : "border-white/15 text-zinc-300 hover:border-white/25",
      ].join(" ")}
    >
      {children}
    </button>
  );
}
