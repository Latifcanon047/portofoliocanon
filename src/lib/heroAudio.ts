// Audio hero. Default MATI: browser memblokir suara sebelum ada klik/tap,
// jadi baru aktif setelah pengunjung menekan tombol "Suara".
export type SoundName = "datang" | "geber" | "pergi";

const FILES: Record<SoundName, string> = {
  datang: "/audio/datang.mp3",
  geber: "/audio/geber.mp3",
  pergi: "/audio/pergi.mp3",
};

// Knob "rasa" audio.
export const SOUND: {
  volume: Record<SoundName, number>;
  minGapMs: Record<SoundName, number>;
} = {
  volume: { datang: 0.8, geber: 0.7, pergi: 0.9 }, // 0 sampai 1
  minGapMs: { datang: 0, geber: 300, pergi: 0 }, // jeda minimal antar putar ulang
};

const NAMES: SoundName[] = ["datang", "geber", "pergi"];
let enabled = false;
const listeners = new Set<() => void>();
const audios: Partial<Record<SoundName, HTMLAudioElement>> = {};
const lastPlay: Partial<Record<SoundName, number>> = {};

function getAudio(name: SoundName) {
  if (typeof window === "undefined") return null;
  let a = audios[name];
  if (!a) {
    a = new Audio(FILES[name]);
    a.preload = "auto";
    a.volume = SOUND.volume[name];
    audios[name] = a;
  }
  return a;
}

function stop(name: SoundName) {
  const a = audios[name];
  if (a) {
    a.pause();
    a.currentTime = 0;
  }
}

export function playSound(name: SoundName) {
  if (!enabled) return;
  const now = performance.now();
  if (now - (lastPlay[name] ?? -Infinity) < SOUND.minGapMs[name]) return;
  lastPlay[name] = now;

  // Mobil pergi memotong suara datang/geber; mobil datang memotong suara pergi.
  if (name === "pergi") {
    stop("datang");
    stop("geber");
  }
  if (name === "datang") stop("pergi");

  const a = getAudio(name);
  if (!a) return;
  a.currentTime = 0;
  a.play().catch(() => {}); // diblokir browser: diam saja
}

export function setSoundOn(on: boolean) {
  enabled = on;
  if (on)
    NAMES.forEach(getAudio); // mulai unduh
  else NAMES.forEach(stop);
  listeners.forEach((l) => l());
  // Klik ini adalah gesture: geber sekali sebagai tanda sekaligus membuka kunci audio.
  if (on) playSound("geber");
}

export const isSoundOn = () => enabled;

export function subscribeSound(cb: () => void) {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}
