"use client";

import { useSyncExternalStore } from "react";
import { isSoundOn, setSoundOn, subscribeSound } from "@/lib/heroAudio";

export default function SoundToggle() {
  const on = useSyncExternalStore(subscribeSound, isSoundOn, () => false);

  return (
    <button
      type="button"
      onClick={() => setSoundOn(!on)}
      className="fixed bottom-6 right-6 z-30 flex items-center gap-2 rounded-full border border-accent bg-black/40 px-4 py-2 text-sm font-semibold text-accent backdrop-blur transition-colors hover:bg-accent hover:text-background"
    >
      <svg
        aria-hidden
        viewBox="0 0 24 24"
        className="h-4 w-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M11 5 6 9H3v6h3l5 4V5z" />
        {on ? (
          <>
            <path d="M15.5 8.5a5 5 0 0 1 0 7" />
            <path d="M18.5 5.5a9 9 0 0 1 0 13" />
          </>
        ) : (
          <path d="m16 9 5 6m0-6-5 6" />
        )}
      </svg>
      {on ? "Suara nyala" : "Suara mati"}
    </button>
  );
}
