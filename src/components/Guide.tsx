import { AnimatePresence, motion } from "motion/react";
import { useEffect } from "react";

export function Guide({ open, onClose }: { open: boolean; onClose: () => void }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[60] grid place-items-center bg-black/75 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="guide-title"
            className="w-full max-w-md rounded-3xl border border-white/10 bg-night-2 p-7 shadow-2xl"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="guide-title" className="font-display text-3xl font-extrabold">
              Guia do biscoito
            </h2>

            <h3 className="mt-6 text-sm font-extrabold uppercase tracking-widest text-cookie">Como jogar</h3>
            <ol className="mt-3 space-y-2 text-white/80">
              <li>1. Use o martelo para bater no biscoito (clique, toque ou aperte espaço).</li>
              <li>2. Algumas marteladas e ele quebra — cada biscoito é mais duro que outro.</li>
              <li>3. Leia a mensagem e pegue um novo biscoito quando quiser.</li>
            </ol>

            <h3 className="mt-6 text-sm font-extrabold uppercase tracking-widest text-cookie">Tipos de biscoito</h3>
            <ul className="mt-3 space-y-3">
              <li className="flex gap-3 rounded-2xl bg-luck/10 p-3">
                <span className="text-2xl">✦</span>
                <span>
                  <strong className="text-luck">Biscoito da sorte:</strong>{" "}
                  <span className="text-white/75">uma mensagem pra te dar aquele empurrão.</span>
                </span>
              </li>
              <li className="flex gap-3 rounded-2xl bg-bad/10 p-3">
                <span className="text-2xl">☁</span>
                <span>
                  <strong className="text-bad">Biscoito pessimista:</strong>{" "}
                  <span className="text-white/75">a verdade que ninguém pediu. Leve na brincadeira!</span>
                </span>
              </li>
            </ul>

            <button
              type="button"
              autoFocus
              onClick={onClose}
              className="mt-7 w-full rounded-2xl bg-white py-3 font-extrabold text-night transition hover:bg-white/90"
            >
              Bora quebrar!
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
