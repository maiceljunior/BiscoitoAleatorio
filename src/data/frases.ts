// Frases do biscoito. As 20 primeiras vêm do jogo original de 2022;
// as demais ficam nos arquivos sorte-*.ts e azar-*.ts.
import { AZAR_EXTRA } from "./azar";
import { SORTE_EXTRA } from "./sorte";

const SORTE_ORIGINAIS = [
  "A vida trará coisas boas se tiveres paciência.",
  "A melhor forma de prever o futuro é criá-lo.",
  "Deixe pra trás o que não te leva pra frente!",
  "Não compense na ira o que lhe falta na razão.",
  "Você é do tamanho do seu sonho.",
  "Você precisa fazer aquilo que pensa que não é capaz de fazer.",
  "A persistência é o caminho do êxito.",
  "Seja você mesmo, mas não seja sempre o mesmo.",
  "Sonhe, acredite, dedique-se e realize.",
  "Toda conquista começa com a decisão de tentar.",
];

const AZAR_ORIGINAIS = [
  "Se você está vivendo uma fase ruim, não se preocupe, logo vai piorar.",
  "Acredite. Você nasceu para conquistar grandes fracassos.",
  "Lute! Sem lutas não há derrotas.",
  "Pare de desejar e comece a desistir!",
  "Nunca é tarde para desistir.",
  "Quando a sua mente pensar em desistir, desista.",
  "Vai dar tudo certo.... Menos pra você!",
  "O universo não está nem aí para você!",
  "Se você está tenso com alguma situação, relaxe... O pior ainda está por vir.",
  "Com grandes sonhos, vêm grandes decepções.",
];

const unique = (list: string[]) => [...new Set(list.map((s) => s.trim()))];

export const SORTE = unique([...SORTE_ORIGINAIS, ...SORTE_EXTRA]);
export const AZAR = unique([...AZAR_ORIGINAIS, ...AZAR_EXTRA]);
