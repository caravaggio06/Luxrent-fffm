import React from "react";

export default function HUDPanel({
  title,
  children,
  className,
}: {
  title?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={[
        "rounded-2xl border border-white/10 bg-black/35 p-5 backdrop-blur",
        className ?? "",
      ].join(" ")}
    >
      {title ? (
        <div className="text-xs uppercase tracking-wide text-zinc-400 mb-2">
          {title}
        </div>
      ) : null}
      {children}
    </div>
  );
}
