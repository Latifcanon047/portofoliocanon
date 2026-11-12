import type { Orientation } from "./karyaData";

// Semua knob "rasa" ada di sini, tinggal tweak.
export const KARYA = {
  scrollPerCard: 100, // vh per langkah kartu
  damping: 6, // makin besar = makin responsif, makin kecil = makin "melayang"
  presenceIn: 6, // kecepatan cincin MUNCUL (makin besar = makin cepat)
  presenceOut: 22, // kecepatan cincin HILANG (sengaja lebih cepat)
  frontScale: 0.12, // kartu depan membesar 12%
  dimMin: 0.3, // kecerahan kartu yang jauh (0 = hitam, 1 = normal)
  snapDuration: 0.6, // detik, tarikan ke kartu terdekat
  snapDelay: 0.15, // detik jeda setelah scroll berhenti sebelum snap
  minSlots: 8, // jumlah slot minimal di cincin (8 = 45° per kartu)
};

// Ukuran kartu 3D (satuan scene). width/height = ukuran screenshot,
// bezel = tebal bingkai di sekelilingnya, gap = jarak antar kartu di cincin.
export const CARD_LAYOUT: Record<
  Orientation,
  { width: number; height: number; gap: number; bezel: number }
> = {
  landscape: { width: 3.2, height: 2, gap: 1.3, bezel: 0 }, // 16:10
  portrait: { width: 1.2, height: 1.91, gap: 0.85, bezel: 0 }, // ~10:16
};

// Jumlah slot di cincin. Kalau kartu asli lebih sedikit dari minSlots,
// sisa slot diisi pengulangan kartu supaya tetangga kiri-kanan tetap kelihatan.
export function ringSlots(count: number) {
  return Math.max(count, KARYA.minSlots);
}

export function ringRadius(orientation: Orientation, slots: number) {
  const l = CARD_LAYOUT[orientation];
  const chord = l.width + l.bezel * 2 + l.gap;
  return chord / (2 * Math.sin(Math.PI / Math.max(slots, 2)));
}

// Ditulis oleh ScrollTrigger, dibaca useFrame. Bukan state React.
export const scrollProgress: Record<string, number> = {};
export const activeProject: { current: string | null } = { current: null };
