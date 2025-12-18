import React, { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";

export default function SoundButton({
  src,
  onStopOther,
}: {
  src: string;
  onStopOther: () => void;
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
      setPlaying(false);
    };
  }, [src]);

  const toggle = () => {
    if (!src) return;

    if (!audioRef.current) {
      const a = new Audio(src);
      audioRef.current = a;
      a.onended = () => setPlaying(false);
    }

    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      onStopOther();
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
      setPlaying(true);
    }
  };

  return (
    <button
      onClick={toggle}
      className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white text-zinc-900 disabled:opacity-60"
      disabled={!src}
      aria-label="Soundcheck abspielen/pausieren"
      type="button"
    >
      {playing ? <Pause size={16} /> : <Play size={16} />}
      Soundcheck
    </button>
  );
}
