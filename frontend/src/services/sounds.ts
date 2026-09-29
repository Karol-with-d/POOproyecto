let audioCtx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  const AudioCtx = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioCtx) return null;
  if (!audioCtx) audioCtx = new AudioCtx();
  return audioCtx;
}

export function unlockAudio(): void {
  const ctx = getCtx();
  if (ctx && ctx.state === 'suspended') {
    void ctx.resume();
  }
}

function tone(freq: number, start: number, dur: number, type: OscillatorType, volume: number): void {
  const ctx = getCtx();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const t0 = ctx.currentTime + start;
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  gain.gain.setValueAtTime(0.0001, t0);
  gain.gain.exponentialRampToValueAtTime(volume, t0 + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(t0);
  osc.stop(t0 + dur + 0.02);
}

export function playClick(): void {
  unlockAudio();
  tone(523, 0, 0.07, 'triangle', 0.05);
  tone(784, 0.04, 0.09, 'sine', 0.035);
}

export function playSuccess(): void {
  unlockAudio();
  tone(523, 0, 0.12, 'sine', 0.06);
  tone(659, 0.09, 0.12, 'sine', 0.06);
  tone(784, 0.18, 0.2, 'triangle', 0.05);
}

export function playMiss(): void {
  unlockAudio();
  tone(196, 0, 0.14, 'sine', 0.045);
  tone(155, 0.1, 0.16, 'triangle', 0.035);
}

export function playPop(): void {
  unlockAudio();
  tone(440, 0, 0.1, 'sine', 0.045);
}

export function playFromFeedback(value: unknown): void {
  if (value == null || value === '') return;
  if (value === 'correct') {
    playSuccess();
    return;
  }
  if (value === 'wrong') {
    playMiss();
    return;
  }
  if (typeof value === 'object' && value && 'type' in value) {
    const kind = (value as { type?: string }).type;
    if (kind === 'success') playSuccess();
    if (kind === 'error') playMiss();
    return;
  }
  if (typeof value === 'string') {
    const bad = /incorrect|intént|faltan|casi|wrong/i.test(value);
    const good = /excelente|perfecto|felicidades|encontrado|complet/i.test(value);
    if (good && !bad) playSuccess();
    else if (bad) playMiss();
  }
}
