import { useEffect } from "react";

/**
 * Ermittelt dominante/Ø-Farbe über Canvas-Sampling.
 * Keine Fremdpakete, funktioniert in Vite/Build & Browser.
 */
export function useAccentFromPoster(posterUrl: string) {
  useEffect(() => {
    if (!posterUrl) return;

    const img = new Image();
    img.crossOrigin = "anonymous"; // gleiches Origin empfohlen
    img.src = posterUrl;

    img.onload = () => {
      try {
        // kleines Canvas für schnelles Sampling
        const w = 32, h = 32;
        const canvas = document.createElement("canvas");
        canvas.width = w; canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        ctx.drawImage(img, 0, 0, w, h);
        const { data } = ctx.getImageData(0, 0, w, h);

        // Mittelwert mit leichter Gewichtung auf gesättigte Pixel
        let rSum = 0, gSum = 0, bSum = 0, weightSum = 0;
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i], g = data[i+1], b = data[i+2], a = data[i+3];
          if (a < 200) continue;
          const max = Math.max(r,g,b), min = Math.min(r,g,b);
          const sat = max - min + 1;            // 1..255
          const weight = 0.5 + sat / 255;       // 0.5..1.5
          rSum += r * weight; gSum += g * weight; bSum += b * weight;
          weightSum += weight;
        }
        if (weightSum === 0) return;
        const r = Math.round(rSum / weightSum);
        const g = Math.round(gSum / weightSum);
        const b = Math.round(bSum / weightSum);

        const weak = [
          Math.min(255, Math.round(r*0.55 + 115)),
          Math.min(255, Math.round(g*0.55 + 115)),
          Math.min(255, Math.round(b*0.55 + 115)),
        ];

        document.documentElement.style.setProperty("--accent", `${r} ${g} ${b}`);
        document.documentElement.style.setProperty("--accent-weak", `${weak[0]} ${weak[1]} ${weak[2]}`);
      } catch {
        // still & silent
      }
    };
  }, [posterUrl]);
}
