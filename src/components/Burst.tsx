import { useEffect, useMemo, useRef } from "react";

export type BurstKind = "crumbs" | "confetti" | "gloom";

interface Props {
  kind: BurstKind;
  /** Muda a cada explosão, para recriar as partículas. */
  seed: number;
  /** Espera antes de explodir (ms), para não disputar quadro com outras animações. */
  delay?: number;
}

const PALETTE: Record<BurstKind, string[]> = {
  crumbs: ["#f2a541", "#ffd28a", "#c46a1b", "#e08a2c"],
  confetti: ["#f5c542", "#ffe9a3", "#ff8a5b", "#7ee8a1", "#ffffff"],
  gloom: ["#b48cff", "#6c4bb0", "#8f7fb3", "#3d2b63"],
};

// Celular/tela de toque: menos partículas, para manter a animação lisa.
const lowPower =
  typeof window !== "undefined" &&
  (matchMedia("(pointer: coarse)").matches || (navigator.hardwareConcurrency ?? 8) <= 4);

const COUNT: Record<BurstKind, number> = lowPower
  ? { crumbs: 7, confetti: 16, gloom: 10 }
  : { crumbs: 14, confetti: 32, gloom: 18 };

const reduceMotion = typeof window !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Partículas que explodem a partir do centro: farelos, confete ou "nuvem de azar".
 *
 * Usa a Web Animations API animando só transform e opacity: o navegador roda isso
 * na placa de vídeo, sem trabalho do JavaScript a cada quadro.
 */
export function Burst({ kind, seed, delay = 0 }: Props) {
  const root = useRef<HTMLDivElement>(null);

  const particles = useMemo(() => {
    const count = COUNT[kind];
    return Array.from({ length: count }, (_, i) => {
      const angle = (Math.PI * 2 * i) / count + Math.random() * 0.6;
      const distance = (kind === "crumbs" ? 60 : 130) + Math.random() * (kind === "crumbs" ? 70 : 140);
      return {
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance * (kind === "gloom" ? 0.5 : 1) - (kind === "confetti" ? 60 : 0),
        fall: kind === "gloom" ? 30 + Math.random() * 50 : 110 + Math.random() * 110,
        size: kind === "crumbs" ? 4 + Math.random() * 7 : kind === "gloom" ? 14 + Math.random() * 14 : 6 + Math.random() * 8,
        rotate: Math.random() * 540 - 270,
        color: PALETTE[kind][i % PALETTE[kind].length],
        wait: delay + Math.random() * 80,
        round: kind !== "confetti" || Math.random() > 0.5,
      };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seed, kind]);

  useEffect(() => {
    const el = root.current;
    if (!el || reduceMotion) return;
    const duration = kind === "crumbs" ? 750 : kind === "gloom" ? 1300 : 1500;
    const animations = [...el.children].map((child, i) => {
      const p = particles[i];
      const end = kind === "gloom" ? 2.2 : 0.6;
      return (child as HTMLElement).animate(
        [
          { transform: "translate3d(0,0,0) rotate(0deg) scale(1)", opacity: 1 },
          { transform: `translate3d(${p.x}px, ${p.y}px, 0) rotate(${p.rotate * 0.6}deg) scale(1)`, opacity: 1, offset: 0.45 },
          { transform: `translate3d(${p.x * 1.05}px, ${p.y + p.fall}px, 0) rotate(${p.rotate}deg) scale(${end})`, opacity: 0 },
        ],
        { duration, delay: p.wait, easing: "cubic-bezier(0.2, 0.7, 0.3, 1)", fill: "both" },
      );
    });
    return () => animations.forEach((a) => a.cancel());
  }, [particles, kind]);

  return (
    <div ref={root} className="pointer-events-none absolute left-1/2 top-1/2 z-20" aria-hidden="true">
      {particles.map((p, i) => (
        <span
          key={`${seed}-${i}`}
          className="absolute block opacity-0 will-change-transform"
          style={{
            width: p.size,
            height: p.round ? p.size : p.size * 0.45,
            marginLeft: -p.size / 2,
            marginTop: -p.size / 2,
            background: kind === "gloom" ? `radial-gradient(circle, ${p.color} 0%, transparent 70%)` : p.color,
            borderRadius: p.round ? "50%" : 2,
          }}
        />
      ))}
    </div>
  );
}
