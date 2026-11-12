"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTypewriter } from "@/lib/useTypewriter";
import { Typed } from "./KaryaProject";

// Teks (ubah di sini).
const ABOUT_TITLE = "Tentang saya";
const ABOUT_TEXT =
  "Aku Latief, fullstack web developer. Aku suka memecahkan masalah nyata dengan teknologi, dari ide sampai produk jadi: antarmuka, backend, database, sampai deploy. Sejauh ini aku sudah membuat Nodea, Jawhan, Dapur Seblak, dan Absensi Pesantren.";

const SKILLS = [
  {
    group: "Frontend",
    items: ["Next.js", "TypeScript", "Tailwind CSS", "Zustand"],
  },
  { group: "Backend & Data", items: ["Prisma", "PostgreSQL", "MySQL"] },
  { group: "Payment & Security", items: ["Payment (Midtrans)", "Security"] },
  { group: "Media & Deploy", items: ["Cloudinary"] },
];

const EDUCATION = {
  program: "Pesantren Tahfidh plus Programming",
  place: "STFQ Bandung",
  note: "Program 2 tahun, sedang berjalan (sudah 1 tahun)",
};

// Bayangan teks kolom kanan (ubah angka terakhir untuk kuat/lemahnya).
const SHADOW = "[text-shadow:0_1px_8px_rgba(0,0,0,0.35)]";

// Mengetik mulai saat atas section ada di sekian % tinggi layar.
const ENTER_AT = 0.6;

// Kecepatan ketik (ms per huruf).
const TYPE_TITLE_MS = 70;
const TYPE_TEXT_MS = 14;

export default function Tentang() {
  const sectionRef = useRef<HTMLElement>(null);
  const [entered, setEntered] = useState(false);

  const title = useTypewriter(ABOUT_TITLE, entered, TYPE_TITLE_MS);
  const text = useTypewriter(
    ABOUT_TEXT,
    entered,
    TYPE_TEXT_MS,
    ABOUT_TITLE.length * TYPE_TITLE_MS + 250,
  );

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const st = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: `top ${ENTER_AT * 100}%`,
      end: "bottom top",
      onToggle: (self) => setEntered(self.isActive),
      onRefresh: (self) => {
        if (self.isActive) setEntered(true);
      },
    });

    return () => st.kill();
  }, []);

  return (
    <section ref={sectionRef} id="tentang" className="relative min-h-screen">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 hidden w-[55%] bg-linear-to-r from-black via-black/70 to-transparent md:block"
      />

      <div className="relative flex min-h-screen flex-col gap-10 px-6 py-8 md:grid md:grid-cols-[2fr_3fr] md:gap-10 md:px-12">
        <div className="flex flex-col justify-center">
          <h2 className="mt-2 text-4xl font-bold text-white md:text-6xl">
            <Typed
              full={ABOUT_TITLE}
              text={title.text}
              cursor={entered && !title.done}
            />
          </h2>
          <p className="mt-4 max-w-lg text-sm leading-relaxed text-white/85 md:mt-8 md:text-base">
            <Typed
              full={ABOUT_TEXT}
              text={text.text}
              cursor={entered && title.done}
            />
          </p>
        </div>

        <div className="flex flex-col justify-center gap-8 md:pl-10 [text-shadow:0_0_3px_rgba(255,255,255,0.7),0_0_10px_rgba(255,255,255,0.55)]">
          <div className="flex flex-col gap-5">
            {SKILLS.map((s) => (
              <div key={s.group}>
                <h3 className="text-xs font-semibold uppercase tracking-widest text-foreground">
                  {s.group}
                </h3>
                <ul className="mt-2 flex flex-wrap gap-2">
                  {s.items.map((item) => (
                    <li
                      key={item}
                      className="rounded-full bg-accent px-4 py-1.5 text-sm font-semibold text-foreground"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-foreground">
              Pendidikan
            </h3>
            <p className="mt-2 text-lg font-semibold text-foreground">
              {EDUCATION.program}
            </p>
            <p className="text-sm text-foreground/85">{EDUCATION.place}</p>
            <p className="text-sm text-foreground/85">{EDUCATION.note}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
