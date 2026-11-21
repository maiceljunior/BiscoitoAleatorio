import { AZAR, SORTE } from "../data/frases";
import { load, save } from "./storage";

export type Kind = "sorte" | "azar";

export interface Fortune {
  id: number;
  kind: Kind;
  text: string;
}

const ALL: Fortune[] = [
  ...SORTE.map((text) => ({ kind: "sorte" as const, text })),
  ...AZAR.map((text) => ({ kind: "azar" as const, text })),
].map((f, id) => ({ ...f, id }));

export const TOTAL_FRASES = ALL.length;

function shuffle<T>(list: T[]): T[] {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * "Saco embaralhado": tira as frases sem repetir até passar por todas,
 * e só então embaralha de novo. O progresso fica salvo no navegador.
 */
export function drawFortune(): Fortune {
  let bag = load<number[]>("bag", []).filter((id) => id < ALL.length);
  if (!bag.length) bag = shuffle(ALL.map((f) => f.id));
  const id = bag.pop()!;
  save("bag", bag);
  return ALL[id];
}
