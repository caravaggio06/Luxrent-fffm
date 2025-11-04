import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function StartScreen({ show, onDone }: { show: boolean; onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2000);
    const handler = () => onDone();
    window.addEventListener("keydown", handler);
    window.addEventListener("click", handler);
    return () => { clearTimeout(t); window.removeEventListener("keydown", handler); window.removeEventListener("click", handler); };
  }, [onDone]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-50 bg-black flex items-center justify-center"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.6 } }}
        >
          <motion.div
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1, transition: { duration: 0.6, ease: [0.2,0.8,0.2,1] } }}
            className="text-center"
          >
            <div className="text-sm tracking-widest text-zinc-400">LUX•RENT</div>
            <div className="mt-1 text-3xl font-semibold">Luxuswagen</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
