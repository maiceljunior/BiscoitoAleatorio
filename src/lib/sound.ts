// Sons do jogo: o áudio original do biscoito quebrando + pequenos efeitos
// sintetizados na hora (sem arquivos extras).

let ctx: AudioContext | null = null;
const breakAudio = typeof Audio !== "undefined" ? new Audio("/audio/quebrando.mp3") : null;

function audio() {
  ctx ??= new AudioContext();
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

/** "Toc" curto da martelada, mais agudo a cada golpe. */
export function playHit(strength: number) {
  const ac = audio();
  const now = ac.currentTime;
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = "triangle";
  osc.frequency.setValueAtTime(180 + strength * 70, now);
  osc.frequency.exponentialRampToValueAtTime(60, now + 0.12);
  gain.gain.setValueAtTime(0.35, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
  osc.connect(gain).connect(ac.destination);
  osc.start(now);
  osc.stop(now + 0.16);
}

export function playBreak() {
  if (!breakAudio) return;
  breakAudio.currentTime = 0;
  breakAudio.volume = 0.8;
  void breakAudio.play().catch(() => {});
}

/** Acorde que sobe (sorte) ou desce (azar). */
export function playReveal(lucky: boolean) {
  const ac = audio();
  const notes = lucky ? [523.25, 659.25, 783.99, 1046.5] : [392, 349.23, 311.13, 261.63];
  notes.forEach((freq, i) => {
    const t = ac.currentTime + 0.25 + i * 0.11;
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.type = lucky ? "sine" : "sawtooth";
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(lucky ? 0.12 : 0.05, t + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.5);
    osc.connect(gain).connect(ac.destination);
    osc.start(t);
    osc.stop(t + 0.55);
  });
}
