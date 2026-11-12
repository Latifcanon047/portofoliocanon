import { useEffect, useState } from "react";

/**
 * Efek ketik: menampilkan `text` huruf demi huruf.
 * - enabled = false: belum mulai (teks kosong).
 * - delayMs: jeda sebelum mulai mengetik.
 * - prefers-reduced-motion: teks langsung tampil penuh.
 * - Untuk mengulang dari awal, remount komponen pemakainya (ganti `key`).
 */
export function useTypewriter(
  text: string,
  enabled: boolean,
  speedMs: number,
  delayMs = 0,
) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!enabled) {
      setCount(0);
      return;
    }

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    let interval: ReturnType<typeof setInterval> | undefined;

    const start = setTimeout(
      () => {
        if (reduced) {
          setCount(text.length);
          return;
        }
        let i = 0;
        interval = setInterval(() => {
          i += 1;
          setCount(i);
          if (i >= text.length) clearInterval(interval);
        }, speedMs);
      },
      reduced ? 0 : delayMs,
    );

    return () => {
      clearTimeout(start);
      if (interval) clearInterval(interval);
    };
  }, [text, enabled, speedMs, delayMs]);

  return { text: text.slice(0, count), done: count >= text.length };
}
