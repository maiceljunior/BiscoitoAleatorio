import { useState, type CSSProperties } from "react";
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
    // Animações em CSS (transform/opacity): rodam na placa de vídeo, sem JS por quadro.
    <div className="anim-card relative z-30 mx-auto w-full max-w-lg">
      <div
        className="paper anim-paper rounded-md px-6 py-7 text-center text-night shadow-[0_14px_34px_rgb(0_0_0/0.4)] sm:px-10"
        style={{ "--tilt": lucky ? "-1deg" : "1.5deg" } as CSSProperties}
      >
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-extrabold uppercase tracking-widest ${
            lucky ? "bg-luck/30 text-[#7a5200]" : "bg-bad/25 text-bad-dark"
          }`}
        >
          {lucky ? "✦ Biscoito da sorte" : "☁ Biscoito pessimista"}
        </span>
        <p className="anim-fade mt-4 font-display text-2xl leading-snug sm:text-[1.7rem]" style={{ animationDelay: "850ms" }}>
          “{fortune.text}”
        </p>
        <p className="mt-4 text-xs font-semibold text-night/45">nº {String(fortune.id + 1).padStart(4, "0")}</p>
      </div>

      <div className="anim-fade mt-6 flex flex-wrap justify-center gap-3" style={{ animationDelay: "1050ms" }}>
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
      </div>
    </div>
  );
}
