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
  if (ctx.state === 'suspended') {
    void ctx.resume().then(() => {
      if (ctx.state === 'running') tone(freq, start, dur, type, volume);
    });
    return;
  }
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

export function playWhoosh(): void {
  unlockAudio();
  tone(220, 0, 0.18, 'sine', 0.03);
  tone(330, 0.06, 0.16, 'triangle', 0.035);
  tone(494, 0.12, 0.14, 'sine', 0.03);
}

export function playBubble(): void {
  unlockAudio();
  tone(620, 0, 0.08, 'sine', 0.04);
  tone(820, 0.05, 0.1, 'triangle', 0.03);
}

export function playSparkle(): void {
  unlockAudio();
  tone(880, 0, 0.08, 'sine', 0.035);
  tone(1174, 0.07, 0.09, 'triangle', 0.03);
  tone(1568, 0.14, 0.1, 'sine', 0.025);
}

export function playCrack(): void {
  unlockAudio();
  tone(180, 0, 0.06, 'square', 0.04);
  tone(90, 0.04, 0.1, 'sawtooth', 0.03);
  tone(720, 0.08, 0.12, 'triangle', 0.035);
}

export function playSizzle(): void {
  unlockAudio();
  tone(140, 0, 0.16, 'sawtooth', 0.03);
  tone(210, 0.05, 0.18, 'triangle', 0.035);
  tone(360, 0.12, 0.2, 'sine', 0.03);
}

export function playLevelUp(): void {
  unlockAudio();
  tone(523, 0, 0.1, 'triangle', 0.05);
  tone(659, 0.08, 0.1, 'sine', 0.05);
  tone(784, 0.16, 0.12, 'triangle', 0.055);
  tone(1046, 0.26, 0.22, 'sine', 0.05);
}

export function playFanfare(): void {
  unlockAudio();
  tone(523, 0, 0.12, 'triangle', 0.055);
  tone(659, 0.1, 0.12, 'sine', 0.055);
  tone(784, 0.2, 0.14, 'triangle', 0.06);
  tone(1046, 0.32, 0.28, 'sine', 0.06);
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
