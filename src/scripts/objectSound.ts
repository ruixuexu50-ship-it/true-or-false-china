// Object sound — a tiny optional audio layer for the homepage object
// system (cabinet drawers + desk objects). WebAudio only, no assets.
//
// Off by default. Nothing plays until the user explicitly toggles sound
// on; every trigger is a direct result of a hover / click interaction.
// Sounds are very short, quiet, synthetic blips — no loops, no music.

let ctx: AudioContext | null = null;
let enabled = false;

export function soundEnabled(): boolean {
  return enabled;
}

export function toggleSound(): boolean {
  enabled = !enabled;
  if (enabled && !ctx) {
    const AC = window.AudioContext ?? (window as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (AC) ctx = new AC();
  }
  if (enabled && ctx?.state === "suspended") void ctx.resume();
  return enabled;
}

function blip(freqA: number, freqB: number, dur: number, gainPeak: number, type: OscillatorType) {
  if (!enabled || !ctx) return;
  const t0 = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freqA, t0);
  osc.frequency.exponentialRampToValueAtTime(freqB, t0 + dur);
  gain.gain.setValueAtTime(0.0001, t0);
  gain.gain.exponentialRampToValueAtTime(gainPeak, t0 + 0.008);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(gain).connect(ctx.destination);
  osc.start(t0);
  osc.stop(t0 + dur + 0.02);
}

/** Very soft tick — drawer / object hover. */
export function playTick() {
  blip(1750, 1300, 0.045, 0.028, "square");
}

/** Short paper/metal slide — drawer open / navigation intent. */
export function playOpen() {
  if (!enabled || !ctx) return;
  const t0 = ctx.currentTime;
  const dur = 0.14;
  const bufferSize = Math.floor(ctx.sampleRate * dur);
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
  }
  const noise = ctx.createBufferSource();
  noise.buffer = buffer;
  const filter = ctx.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.setValueAtTime(900, t0);
  filter.frequency.exponentialRampToValueAtTime(2600, t0 + dur);
  filter.Q.value = 1.1;
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.05, t0);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  noise.connect(filter).connect(gain).connect(ctx.destination);
  noise.start(t0);
  window.setTimeout(() => blip(1100, 900, 0.05, 0.028, "triangle"), dur * 1000 * 0.7);
}

/** Subtle pop — desk object press. */
export function playPop() {
  blip(420, 210, 0.07, 0.05, "triangle");
}
