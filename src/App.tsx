import { AnimatePresence, motion } from "motion/react";
import { useCallback, useState, type MouseEvent } from "react";
import { Burst, type BurstKind } from "./components/Burst";
import { Cookie } from "./components/Cookie";
import { FortuneCard } from "./components/FortuneCard";
import { Guide } from "./components/Guide";
import { Hammer } from "./components/Hammer";
import { InstallApp } from "./components/InstallApp";
import { Welcome } from "./components/Welcome";
import { drawFortune, type Fortune } from "./lib/deck";
import { playBreak, playHit, playReveal } from "./lib/sound";
import { usePersistentState } from "./lib/storage";

const randomHits = () => 3 + Math.floor(Math.random() * 3); // 3 a 5 marteladas

export default function App() {
  const [name, setName] = usePersistentState("name", "");
  const [stats, setStats] = usePersistentState("stats", { sorte: 0, azar: 0 });
  const [soundOn, setSoundOn] = usePersistentState("sound", true);
  const [guideOpen, setGuideOpen] = useState(false);

  const [hits, setHits] = useState(0);
  const [hitsToBreak, setHitsToBreak] = useState(randomHits);
  const [hitKey, setHitKey] = useState(0);
  const [fortune, setFortune] = useState<Fortune | null>(null);
  const [bursts, setBursts] = useState<{ kind: BurstKind; seed: number }[]>([]);
  const [hovering, setHovering] = useState(false);
  const [tapAt, setTapAt] = useState<{ x: number; y: number } | null>(null);

  const broken = fortune !== null;

  const addBurst = (kind: BurstKind) => {
    const seed = Date.now() + Math.random();
    setBursts((list) => [...list.slice(-4), { kind, seed }]);
  };

  function hit(e: MouseEvent<HTMLButtonElement>) {
    if (broken) return;
    if (e.clientX || e.clientY) setTapAt({ x: e.clientX, y: e.clientY });

    const next = hits + 1;
    setHits(next);
    setHitKey((k) => k + 1);
    if (soundOn) playHit(next);
    addBurst("crumbs");

    if (next >= hitsToBreak) {
      const result = drawFortune();
      const lucky = result.kind === "sorte";
      setFortune(result);
      setStats((s) => ({ ...s, [result.kind]: s[result.kind] + 1 }));
      if (soundOn) {
        playBreak();
        playReveal(lucky);
      }
      setTimeout(() => addBurst(lucky ? "confetti" : "gloom"), 220);
    }
  }

  const again = useCallback(() => {
    setFortune(null);
    setHits(0);
    setHitsToBreak(randomHits());
    setBursts([]);
    setTapAt(null);
  }, []);

  if (!name) {
    return (
      <div className="sky relative min-h-dvh">
        <div className="stars pointer-events-none fixed inset-0" />
        <Welcome onStart={(n) => { setName(n); setGuideOpen(true); }} />
      </div>
    );
  }

  const mood = fortune?.kind;

  return (
    <div className="sky relative min-h-dvh overflow-hidden">
      <div className="stars pointer-events-none fixed inset-0" />

      {/* Clima da tela depois que o biscoito quebra */}
      <AnimatePresence>
        {mood && (
          <motion.div
            key={mood + hitKey}
            className="pointer-events-none fixed inset-0"
            style={{
              background:
                mood === "sorte"
                  ? "radial-gradient(600px 400px at 50% 40%, rgb(245 197 66 / 0.28), transparent 70%)"
                  : "radial-gradient(700px 500px at 50% 40%, rgb(108 75 176 / 0.35), transparent 70%)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: mood === "azar" ? [0, 1, 0.4, 1] : 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: mood === "azar" ? 0.6 : 0.8 }}
          />
        )}
      </AnimatePresence>

      <header className="relative z-40 mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 pb-4 pt-[max(1rem,env(safe-area-inset-top))] sm:px-6">
        <div className="min-w-0">
          <p className="font-display text-lg font-extrabold leading-none sm:text-xl">Biscoito Aleatório</p>
          <p className="truncate text-sm text-white/60">
            Olá, <span className="font-bold text-cookie">{name}</span>!{" "}
            <button type="button" className="underline-offset-2 hover:underline" onClick={() => setName("")}>
              trocar
            </button>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <InstallApp />
          <div className="hidden items-center gap-2 rounded-full bg-white/5 px-3 py-2 text-sm font-bold sm:flex" title="Seu placar">
            <span className="text-luck">✦ {stats.sorte}</span>
            <span className="text-white/25">|</span>
            <span className="text-bad">☁ {stats.azar}</span>
          </div>
          <button
            type="button"
            onClick={() => setSoundOn(!soundOn)}
            className="grid size-10 place-items-center rounded-full bg-white/5 text-lg transition hover:bg-white/15"
            aria-label={soundOn ? "Desligar som" : "Ligar som"}
            aria-pressed={soundOn}
          >
            {soundOn ? "🔊" : "🔇"}
          </button>
          <button
            type="button"
            onClick={() => setGuideOpen(true)}
            className="grid size-10 place-items-center rounded-full bg-white/5 font-extrabold transition hover:bg-white/15"
            aria-label="Guia do biscoito"
          >
            ?
          </button>
        </div>
      </header>

      <main className="relative z-10 mx-auto flex min-h-[calc(100dvh-80px)] max-w-5xl flex-col items-center justify-center px-4 pb-16">
        <div className="mb-2 flex items-center gap-2 rounded-full bg-white/5 px-3 py-1.5 text-sm font-bold sm:hidden">
          <span className="text-luck">✦ {stats.sorte}</span>
          <span className="text-white/25">|</span>
          <span className="text-bad">☁ {stats.azar}</span>
        </div>

        <div className={`relative w-full max-w-md ${broken ? "" : "cursor-none"}`}>
          {bursts.map((b) => (
            <Burst key={b.seed} kind={b.kind} seed={b.seed} />
          ))}

          <motion.button
            type="button"
            onClick={hit}
            onPointerEnter={() => setHovering(true)}
            onPointerLeave={() => setHovering(false)}
            disabled={broken}
            aria-label={broken ? "Biscoito quebrado" : `Bater no biscoito (${hits} de ${hitsToBreak} marteladas)`}
            className={`relative block w-full rounded-[40%] focus-visible:outline-offset-8 ${broken ? "cursor-default" : "cursor-none"}`}
            animate={broken ? { y: -40, scale: 0.8 } : { y: [0, -8, 0] }}
            transition={broken ? { type: "spring", stiffness: 120, damping: 16 } : { duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <Cookie hits={hits} hitsToBreak={hitsToBreak} broken={broken} hitKey={hitKey} />
          </motion.button>

          {!broken && (
            <div className="mt-4 flex flex-col items-center gap-3">
              <motion.p
                key={hits}
                className="text-center font-bold text-white/80"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
              >
                {hits === 0 ? "Bata no biscoito com o martelo!" : hits === hitsToBreak - 1 ? "Mais uma, tá quase!" : "Isso! Continua batendo…"}
              </motion.p>
              <div className="flex gap-1.5" aria-hidden="true">
                {Array.from({ length: hitsToBreak }, (_, i) => (
                  <motion.span
                    key={i}
                    className="h-1.5 w-6 rounded-full"
                    animate={{ backgroundColor: i < hits ? "#f2a541" : "rgba(255,255,255,0.15)" }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        <AnimatePresence mode="wait">
          {fortune && (
            <div key={fortune.id + "-" + hitKey} className="-mt-16 w-full">
              <FortuneCard fortune={fortune} onAgain={again} />
            </div>
          )}
        </AnimatePresence>
      </main>

      <Hammer active={hovering && !broken} swingKey={hitKey} tapAt={broken ? null : tapAt} />
      <Guide open={guideOpen} onClose={() => setGuideOpen(false)} />
    </div>
  );
}
