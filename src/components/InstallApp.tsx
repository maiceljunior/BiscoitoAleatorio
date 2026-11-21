import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const isStandalone = () =>
  matchMedia("(display-mode: standalone)").matches ||
  (navigator as Navigator & { standalone?: boolean }).standalone === true;

const isIos = () => /iphone|ipad|ipod/i.test(navigator.userAgent);

/**
 * Botão "Instalar app".
 * Android/Chrome: abre o pedido de instalação nativo.
 * iPhone: explica o caminho Compartilhar → Adicionar à Tela de Início.
 * Já instalado: não aparece.
 */
export function InstallApp({ variant = "icon" }: { variant?: "icon" | "full" }) {
  const [promptEvent, setPromptEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [showIosTip, setShowIosTip] = useState(false);
  const [installed, setInstalled] = useState(isStandalone);

  useEffect(() => {
    const onPrompt = (e: Event) => {
      e.preventDefault();
      setPromptEvent(e as BeforeInstallPromptEvent);
    };
    const onInstalled = () => setInstalled(true);
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  if (installed || (!promptEvent && !isIos())) return null;

  async function install() {
    if (promptEvent) {
      await promptEvent.prompt();
      const { outcome } = await promptEvent.userChoice;
      if (outcome === "accepted") setInstalled(true);
      setPromptEvent(null);
    } else {
      setShowIosTip(true);
    }
  }

  return (
    <>
      {variant === "full" ? (
        <button
          type="button"
          onClick={install}
          className="flex h-12 items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/5 font-bold transition hover:bg-white/10"
        >
          📲 Instalar como app
        </button>
      ) : (
        <button
          type="button"
          onClick={install}
          className="flex h-10 items-center gap-1.5 rounded-full bg-cookie px-3 text-sm font-extrabold text-night transition hover:bg-[#ffb85c]"
          aria-label="Instalar o jogo como app"
        >
          📲 <span className="hidden sm:inline">Instalar</span>
        </button>
      )}

      <AnimatePresence>
        {showIosTip && (
          <motion.div
            className="fixed inset-0 z-[70] flex items-end justify-center bg-black/75 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowIosTip(false)}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              className="mb-[env(safe-area-inset-bottom)] w-full max-w-sm rounded-3xl bg-night-2 p-6 text-center shadow-2xl"
              initial={{ y: 60 }}
              animate={{ y: 0 }}
              exit={{ y: 60 }}
              onClick={(e) => e.stopPropagation()}
            >
              <p className="text-4xl">🥠</p>
              <h2 className="mt-2 font-display text-2xl font-extrabold">Instale no iPhone</h2>
              <ol className="mt-4 space-y-3 text-left text-white/85">
                <li>
                  1. Toque em <strong>Compartilhar</strong>{" "}
                  <span className="rounded bg-white/10 px-1.5">⬆︎</span> na barra do Safari.
                </li>
                <li>
                  2. Escolha <strong>Adicionar à Tela de Início</strong>.
                </li>
                <li>
                  3. Pronto: o Biscoito abre em tela cheia, como um app.
                </li>
              </ol>
              <button
                type="button"
                autoFocus
                onClick={() => setShowIosTip(false)}
                className="mt-6 w-full rounded-2xl bg-white py-3 font-extrabold text-night"
              >
                Entendi
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
