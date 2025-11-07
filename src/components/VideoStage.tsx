import React, { useEffect, useRef, useState } from "react";

type Props = {
  src: string;
  poster?: string;
  className?: string;
};

export default function VideoStage({ src, poster, className }: Props) {
  const aRef = useRef<HTMLVideoElement|null>(null);
  const bRef = useRef<HTMLVideoElement|null>(null);
  const [useA, setUseA] = useState(true);
  const [activeSrc, setActiveSrc] = useState(src);
  const [nextSrc, setNextSrc] = useState<string | null>(null);
  const [fading, setFading] = useState(false);

  // Initial
  useEffect(() => {
    const v = aRef.current; if (!v) return;
    v.muted = true; v.loop = true; v.playsInline = true;
    v.src = activeSrc; v.poster = poster ?? "";
    v.oncanplay = () => { v.play().catch(()=>{}); };
  }, []);

  // Wechsel
  useEffect(() => {
    if (src === activeSrc) return;
    setNextSrc(src);
  }, [src]);

  // Preload + Crossfade
  useEffect(() => {
    if (!nextSrc) return;
    const from = useA ? aRef.current : bRef.current;
    const to   = useA ? bRef.current : aRef.current;
    if (!from || !to) return;

    // Ziel vorbereiten
    to.muted = true; to.loop = true; to.playsInline = true;
    to.src = nextSrc; to.poster = poster ?? "";

    const onReady = () => {
      to.oncanplay = null;
      // Crossfade starten
      setFading(true);
      to.currentTime = 0;
      to.play().catch(()=>{});
      // 400ms Überblendung
      setTimeout(() => {
        setFading(false);
        setUseA(!useA);
        setActiveSrc(nextSrc);
        setNextSrc(null);
        // altes Video stoppen (Safari schont CPU)
        from.pause();
      }, 400);
    };

    to.oncanplay = onReady;
    // Safari-Fallback: force load
    to.load();

    return () => { to.oncanplay = null; };
  }, [nextSrc]);

  return (
    <div className={`absolute inset-0 ${className ?? ""}`}>
      {/* aktiver Layer */}
      <video
        ref={aRef}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-400 ${useA ? "opacity-100" : "opacity-0"}`}
      />
      {/* zweiter Layer für den Übergang */}
      <video
        ref={bRef}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-400 ${useA ? (fading ? "opacity-100" : "opacity-0") : "opacity-100"}`}
      />
    </div>
  );
}
