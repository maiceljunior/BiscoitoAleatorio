import { motion } from "motion/react";
import { useState } from "react";
import type { Fortune } from "../lib/deck";

interface Props {
  fortune: Fortune;
  onAgain: () => void;
}

/** Papelzinho que sai do biscoito com a mensagem. */
export function FortuneCard({ fortune, onAgain }: Props) {
  const lucky = fortune.kind === "sorte";
  const [copied, setCopied] = useState(false);

  async function share() {
    const text = `🥠 ${fortune.text}\n— Biscoito Aleatório`;
    try {
      if (navigator.share) {
        await navigator.share({ text });
        return;
      }
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // compartilhamento cancelado
    }
  }

  return (
    <motion.div
      className="relative z-30 mx-auto w-full max-w-lg"
      initial={{ opacity: 0, y: 40, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 120, damping: 15, delay: 0.25 }}
    >
      <motion.div
        className="paper origin-center rounded-md px-6 py-7 text-center text-night shadow-[0_20px_60px_rgb(0_0_0/0.45)] will-change-transform sm:px-10"
        initial={{ scaleX: 0.08, rotate: -3 }}
        animate={{ scaleX: 1, rotate: lucky ? -1 : 1.5 }}
        transition={{ type: "spring", stiffness: 90, damping: 13, delay: 0.35 }}
      >
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-extrabold uppercase tracking-widest ${
            lucky ? "bg-luck/30 text-[#7a5200]" : "bg-bad/25 text-bad-dark"
          }`}
        >
          {lucky ? "✦ Biscoito da sorte" : "☁ Biscoito pessimista"}
        </span>
        <motion.p
          className="mt-4 font-display text-2xl leading-snug sm:text-[1.7rem]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          “{fortune.text}”
        </motion.p>
        <p className="mt-4 text-xs font-semibold text-night/45">nº {String(fortune.id + 1).padStart(4, "0")}</p>
      </motion.div>

      <motion.div
        className="mt-6 flex flex-wrap justify-center gap-3"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
      >
        <button
          type="button"
          autoFocus
          onClick={onAgain}
          className="rounded-full bg-cookie px-6 py-3 font-extrabold text-night shadow-lg shadow-cookie/30 transition hover:scale-105 hover:bg-[#ffb85c] active:scale-95"
        >
          🥠 Novo biscoito
        </button>
        <button
          type="button"
          onClick={share}
          className="rounded-full bg-white/10 px-5 py-3 font-bold transition hover:bg-white/20"
        >
          {copied ? "Copiado!" : "Compartilhar"}
        </button>
      </motion.div>
    </motion.div>
  );
}
