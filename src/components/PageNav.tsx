"use client";

// Tombol back/next di pojok kanan atas. Meniru spasi (ke bawah) dan shift+spasi (ke atas).
// Knob: STEP = fraksi tinggi layar per klik (spasi bawaan browser ~0.875).
const STEP = 1;

function go(dir: 1 | -1) {
  window.scrollBy({ top: dir * window.innerHeight * STEP, behavior: "smooth" });
}

const BTN =
  "grid h-10 w-10 place-items-center rounded-full border border-accent/60 bg-black/40 text-accent backdrop-blur transition-colors hover:bg-accent hover:text-background short:h-8 short:w-8";

export default function PageNav() {
  return (
    <div className="fixed right-4 top-4 z-30 flex gap-6 short:right-2 short:top-2 short:gap-4">
      {" "}
      <button
        type="button"
        aria-label="Kembali (shift + spasi)"
        onClick={(e) => {
          go(-1);
          e.currentTarget.blur();
        }}
        className={BTN}
      >
        <svg
          viewBox="0 0 24 24"
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M15 6l-6 6 6 6" />
        </svg>
      </button>
      <button
        type="button"
        aria-label="Lanjut (spasi)"
        onClick={(e) => {
          go(1);
          e.currentTarget.blur();
        }}
        className={BTN}
      >
        <svg
          viewBox="0 0 24 24"
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M9 6l6 6-6 6" />
        </svg>
      </button>
    </div>
  );
}
