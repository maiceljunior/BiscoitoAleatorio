import { motion } from "motion/react";
import { useMemo } from "react";

export type BurstKind = "crumbs" | "confetti" | "gloom";

interface Props {
  kind: BurstKind;
  /** Muda a cada explosão, para recriar as partículas. */
  seed: number;
  count?: number;
}

const PALETTE: Record<BurstKind, string[]> = {
  crumbs: ["#f2a541", "#ffd28a", "#c46a1b", "#e08a2c"],
  confetti: ["#f5c542", "#ffe9a3", "#ff8a5b", "#7ee8a1", "#ffffff"],
  gloom: ["#b48cff", "#6c4bb0", "#8f7fb3", "#3d2b63"],
};

/** Partículas que explodem a partir do centro: farelos, confete ou "nuvem de azar". */
export function Burst({ kind, seed, count = kind === "crumbs" ? 14 : 36 }: Props) {
  const particles = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const angle = (Math.PI * 2 * i) / count + Math.random() * 0.6;
        const distance = (kind === "crumbs" ? 60 : 140) + Math.random() * (kind === "crumbs" ? 70 : 160);
        return {
          x: Math.cos(angle) * distance,
          y: Math.sin(angle) * distance * (kind === "gloom" ? 0.5 : 1) - (kind === "confetti" ? 60 : 0),
          fall: kind === "gloom" ? 40 + Math.random() * 60 : 120 + Math.random() * 120,
          size: kind === "crumbs" ? 4 + Math.random() * 7 : 6 + Math.random() * 8,
          rotate: Math.random() * 540 - 270,
          color: PALETTE[kind][i % PALETTE[kind].length],
          delay: Math.random() * 0.08,
          round: kind !== "confetti" || Math.random() > 0.5,
        };
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [seed, kind, count],
  );

  return (
    <div className="pointer-events-none absolute left-1/2 top-1/2 z-20" aria-hidden="true">
      {particles.map((p, i) => (
        <motion.span
          key={`${seed}-${i}`}
          className="absolute block"
          style={{
            width: p.size,
            height: p.round ? p.size : p.size * 0.45,
            background: p.color,
            borderRadius: p.round ? "50%" : 2,
            boxShadow: kind === "confetti" ? `0 0 8px ${p.color}` : undefined,
          }}
          initial={{ x: 0, y: 0, opacity: 1, rotate: 0, scale: 1 }}
          animate={{
            x: [0, p.x, p.x * 1.05],
            y: [0, p.y, p.y + p.fall],
            opacity: [1, 1, 0],
            rotate: p.rotate,
            scale: kind === "gloom" ? [1, 2.4, 3] : [1, 1, 0.6],
          }}
          transition={{ duration: kind === "crumbs" ? 0.8 : 1.6, delay: p.delay, ease: "easeOut", times: [0, 0.45, 1] }}
        />
      ))}
    </div>
  );
}
