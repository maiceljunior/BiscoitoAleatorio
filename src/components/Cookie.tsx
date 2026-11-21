import { motion, useAnimationControls } from "motion/react";
import { useEffect, useId } from "react";

interface Props {
  hits: number;
  hitsToBreak: number;
  broken: boolean;
  hitKey: number;
}

// Rachaduras que vão aparecendo a cada martelada, alternando entre as metades.
const CRACKS_LEFT = ["M150 82 L134 100 L142 114 L120 130", "M80 150 L98 156 L92 172 L110 182", "M116 66 L108 86 L120 94"];
const CRACKS_RIGHT = ["M214 64 L204 88 L220 98 L210 120", "M256 136 L236 142 L244 160 L224 170", "M196 180 L210 164 L202 152"];

const VIEWBOX = "0 0 320 250";

function Crack({ d }: { d: string }) {
  return (
    <motion.path
      d={d}
      fill="none"
      stroke="#6b3206"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 0.18 }}
    />
  );
}

/**
 * Biscoito da sorte em SVG (formato dobrado, como o emoji 🥠).
 *
 * Cada metade é uma camada HTML separada: ao quebrar, elas se afastam com
 * transição CSS de transform, que roda na placa de vídeo (sem redesenhar o SVG
 * a cada quadro). Isso deixa a quebra fluida mesmo em celulares simples.
 */
export function Cookie({ hits, hitsToBreak, broken, hitKey }: Props) {
  const shake = useAnimationControls();
  const uid = useId().replace(/:/g, "");
  const progress = hitsToBreak ? hits / hitsToBreak : 0;
  const leftCracks = Math.ceil(progress * CRACKS_LEFT.length);
  const rightCracks = Math.floor(progress * CRACKS_RIGHT.length + 0.34);

  useEffect(() => {
    if (!hitKey || broken) return;
    void shake.start({
      rotate: [0, -6, 5, -3, 2, 0],
      scale: [1, 0.93, 1.04, 1],
      transition: { duration: 0.35 },
    });
  }, [hitKey, broken, shake]);

  const layer = "absolute inset-0 size-full overflow-visible";
  const split = "transition-[transform,opacity] duration-700 ease-[cubic-bezier(0.2,1.5,0.4,1)] will-change-transform";

  return (
    <motion.div className="relative aspect-[320/250] w-full will-change-transform" animate={shake} aria-hidden="true">
      {/* Sombra + papelzinho (somem ao quebrar) */}
      <svg viewBox={VIEWBOX} className={`${layer} transition-opacity duration-300 ${broken ? "opacity-0" : "opacity-100"}`}>
        <defs>
          <radialGradient id={`shadow-${uid}`}>
            <stop offset="0%" stopColor="#000" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#000" stopOpacity="0" />
          </radialGradient>
        </defs>
        <ellipse cx="168" cy="232" rx="120" ry="16" fill={`url(#shadow-${uid})`} />
        <path d="M142 164 L214 214 L200 232 L130 180 Z" fill="#fbf6ea" />
        <path d="M142 164 L214 214" stroke="#d9cfbb" strokeWidth="1.5" />
      </svg>

      {/* Metade de trás (direita) */}
      <div
        className={`${layer} ${split}`}
        style={{
          transformOrigin: "50% 52%",
          transform: broken ? "translate(19%, 7%) rotate(18deg)" : "none",
        }}
      >
        <svg viewBox={VIEWBOX} className={layer}>
          <defs>
            <linearGradient id={`back-${uid}`} x1="1" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f7b55a" />
              <stop offset="100%" stopColor="#c46a1b" />
            </linearGradient>
          </defs>
          <path d="M178 38 C245 40 290 92 280 152 C274 188 242 208 206 202 C180 198 158 186 140 168 C150 120 165 80 178 38 Z" fill={`url(#back-${uid})`} />
          {/* lado de dentro da dobra, mais escuro */}
          <path d="M188 54 C178 102 162 146 152 178" fill="none" stroke="#8f4511" strokeWidth="13" strokeLinecap="round" opacity="0.6" />
          <path d="M258 96 C268 114 270 136 264 156" fill="none" stroke="#ffd79a" strokeWidth="5" strokeLinecap="round" opacity="0.55" />
          {CRACKS_RIGHT.slice(0, rightCracks).map((d) => (
            <Crack key={d} d={d} />
          ))}
        </svg>
      </div>

      {/* Metade da frente (esquerda) */}
      <div
        className={`${layer} ${split}`}
        style={{
          transformOrigin: "50% 52%",
          transform: broken ? "translate(-19%, 9%) rotate(-20deg)" : "none",
        }}
      >
        <svg viewBox={VIEWBOX} className={layer}>
          <defs>
            <linearGradient id={`dough-${uid}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#ffd28a" />
              <stop offset="50%" stopColor="#f2a541" />
              <stop offset="100%" stopColor="#d47b22" />
            </linearGradient>
          </defs>
          <path d="M178 38 C115 38 55 90 52 150 C50 180 72 198 98 193 C118 189 130 178 140 168 C150 120 165 80 178 38 Z" fill={`url(#dough-${uid})`} />
          {/* borda do vinco */}
          <path d="M178 38 C165 80 150 120 140 168" fill="none" stroke="#b5600f" strokeWidth="5" strokeLinecap="round" />
          <path d="M88 96 C104 70 130 54 156 50" fill="none" stroke="#ffe6b8" strokeWidth="7" strokeLinecap="round" opacity="0.7" />
          {CRACKS_LEFT.slice(0, leftCracks).map((d) => (
            <Crack key={d} d={d} />
          ))}
        </svg>
      </div>
    </motion.div>
  );
}
