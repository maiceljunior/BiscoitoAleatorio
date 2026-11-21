import { motion, useMotionValue, useSpring } from "motion/react";
import { useEffect, useState } from "react";

interface Props {
  /** Área onde o martelo substitui o cursor. */
  active: boolean;
  /** Muda a cada golpe, para disparar o movimento. */
  swingKey: number;
  /** Onde foi o último toque (celular), em coordenadas da janela. */
  tapAt: { x: number; y: number } | null;
}

/** Martelo que segue o mouse (no lugar do cursor) e bate a cada clique. */
export function Hammer({ active, swingKey, tapAt }: Props) {
  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const sx = useSpring(x, { stiffness: 900, damping: 50 });
  const sy = useSpring(y, { stiffness: 900, damping: 50 });
  const [fine, setFine] = useState(false);

  useEffect(() => {
    const mq = matchMedia("(pointer: fine)");
    const update = () => setFine(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!fine) return;
    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, [fine, x, y]);

  // No celular o martelo aparece onde a pessoa tocou.
  useEffect(() => {
    if (!fine && tapAt) {
      x.jump(tapAt.x);
      y.jump(tapAt.y);
    }
  }, [fine, tapAt, x, y]);

  const visible = fine ? active : Boolean(tapAt);

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-50"
      style={{ x: sx, y: sy }}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.15 }}
    >
      <motion.svg
        key={swingKey}
        width="86"
        height="86"
        viewBox="0 0 100 100"
        className="-translate-x-[18px] -translate-y-[70px] drop-shadow-[0_8px_10px_rgb(0_0_0/0.5)]"
        style={{ originX: "20%", originY: "80%" }}
        initial={{ rotate: swingKey ? -45 : 0 }}
        animate={{ rotate: swingKey ? [-45, 18, 0] : 0 }}
        transition={{ duration: 0.28, times: [0, 0.45, 1], ease: "easeOut" }}
      >
        {/* cabo */}
        <rect x="14" y="40" width="12" height="56" rx="5" transform="rotate(-35 20 80)" fill="#8b5a2b" />
        <rect x="16" y="44" width="4" height="48" rx="2" transform="rotate(-35 20 80)" fill="#a8743f" />
        {/* cabeça */}
        <g transform="rotate(-35 50 35)">
          <rect x="22" y="18" width="62" height="30" rx="7" fill="#9aa4b5" />
          <rect x="22" y="18" width="62" height="10" rx="5" fill="#c9d1dd" />
          <rect x="78" y="16" width="10" height="34" rx="4" fill="#6d7686" />
        </g>
      </motion.svg>
    </motion.div>
  );
}
