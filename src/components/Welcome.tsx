import { motion } from "motion/react";
import { useState, type FormEvent } from "react";
import { TOTAL_FRASES } from "../lib/deck";
import { Cookie } from "./Cookie";
import { InstallApp } from "./InstallApp";

export function Welcome({ onStart }: { onStart: (name: string) => void }) {
  const [name, setName] = useState("");

  function submit(e: FormEvent) {
    e.preventDefault();
    const clean = name.trim();
    if (clean) onStart(clean);
  }

  return (
    <motion.section
      className="mx-auto flex min-h-dvh max-w-md flex-col items-center justify-center px-6 py-12 text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <motion.div
        className="w-56"
        animate={{ y: [0, -10, 0], rotate: [-3, 3, -3] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <Cookie hits={0} hitsToBreak={3} broken={false} hitKey={0} />
      </motion.div>

      <h1 className="mt-6 font-display text-5xl font-extrabold leading-none tracking-tight sm:text-6xl">
        Biscoito
        <span className="block bg-gradient-to-r from-luck via-cookie to-bad bg-clip-text italic text-transparent">Aleatório</span>
      </h1>
      <p className="mt-4 text-white/70">
        Quebre o biscoito com o martelo e descubra o que ele reserva pra você. Pode ser sorte… ou não.
      </p>

      <form onSubmit={submit} className="mt-8 flex w-full flex-col gap-3">
        <label htmlFor="name" className="sr-only">
          Seu nome
        </label>
        <input
          id="name"
          autoFocus
          maxLength={20}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Como você se chama?"
          className="h-14 rounded-2xl border border-white/15 bg-white/5 px-5 text-center text-lg outline-none transition placeholder:text-white/40 focus:border-cookie focus:bg-white/10"
        />
        <button
          type="submit"
          disabled={!name.trim()}
          className="h-14 rounded-2xl bg-cookie text-lg font-extrabold text-night shadow-lg shadow-cookie/30 transition hover:bg-[#ffb85c] active:scale-[0.98] disabled:opacity-40"
        >
          Pegar meu biscoito
        </button>
        <InstallApp variant="full" />
      </form>
      <p className="mt-6 text-xs text-white/40">{TOTAL_FRASES.toLocaleString("pt-BR")} mensagens diferentes esperando por você</p>
    </motion.section>
  );
}
