"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { KARYA } from "@/lib/karya";
import { useTypewriter } from "@/lib/useTypewriter";
import { HERO_CAR, heroCar } from "@/lib/heroCar";
import { playSound } from "@/lib/heroAudio";
import { Typed } from "./KaryaProject";

const SLIDES = [
  { title: "Halo, aku Canon.", text: "Fullstack Web Developer." },
  {
    title: "Masalah nyata, solusi nyata.",
    text: "Aku memecahkan masalah nyata dengan teknologi, dari ide sampai produk jadi.",
  },
  {
    title: "Yang kukerjakan.",
    text: "Aplikasi web full-stack: antarmuka, backend, database, sampai deploy.",
  },
  {
    title: "Stack-ku.",
    text: "Next.js, TypeScript, Tailwind CSS, Zustand, Prisma, PostgreSQL, dan Cloudinary.",
  },
  {
    title: "Sudah rilis.",
    text: "Nodea dan Jawhan sudah live, lihat di bawah.",
  },
];

// Jarak scroll per langkah slide (vh). Makin kecil makin cepat lewat hero.
const HERO_SCROLL_PER_SLIDE = 70;

// Kecepatan ketik (ms per huruf).
const TYPE_TITLE_MS = 50;
const TYPE_TEXT_MS = 14;

// Satu slide. Dipasang dengan `key`, jadi mengetik ulang tiap slide berganti.
function HeroSlide({ title, text }: { title: string; text: string }) {
  const t = useTypewriter(title, true, TYPE_TITLE_MS);
  const d = useTypewriter(
    text,
    true,
    TYPE_TEXT_MS,
    title.length * TYPE_TITLE_MS + 200,
  );

  return (
    <>
      <h2 className="text-3xl font-bold text-white md:text-4xl">
        <Typed full={title} text={t.text} cursor={!t.done} />
      </h2>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-white/85 md:text-base">
        {" "}
        <Typed full={text} text={d.text} cursor={t.done} />
      </p>
    </>
  );
}

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const count = SLIDES.length;
  const slide = SLIDES[active];

  // Geber tiap titik berganti (maju maupun mundur), bukan saat pertama render.
  const prevActive = useRef(0);
  useEffect(() => {
    if (prevActive.current !== active) playSound("geber");
    prevActive.current = active;
  }, [active]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const pinDistance = () =>
      window.innerHeight * (((count - 1) * HERO_SCROLL_PER_SLIDE) / 100);

    const sync = (progress: number) =>
      setActive(Math.round(progress * (count - 1)));

    const pin = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top top",
      end: () => `+=${pinDistance()}`,
      pin: true,
      invalidateOnRefresh: true,
      snap: {
        snapTo: 1 / (count - 1),
        directional: false,
        duration: KARYA.snapDuration,
        delay: KARYA.snapDelay,
        ease: "power2.inOut",
      },
      onUpdate: (self) => sync(self.progress),
      onRefresh: (self) => sync(self.progress),
    });

    // Mobil pergi sedikit setelah pin hero selesai (halaman mulai turun ke Karya),
    // dan kembali parkir saat scroll naik lagi.
    const leave = ScrollTrigger.create({
      start: () => pin.end + (window.innerHeight * HERO_CAR.leaveVh) / 100,
      end: "max",
      onEnter: () => {
        heroCar.parked = false;
      },
      onLeaveBack: () => {
        heroCar.parked = true;
      },
      onRefresh: (self) => {
        heroCar.parked = self.scroll() < self.start;
      },
    });

    return () => {
      leave.kill();
      pin.kill(true);
    };
  }, [count]);

  const toKarya = () =>
    document.getElementById("karya")?.scrollIntoView({ behavior: "smooth" });

  return (
    <section ref={sectionRef} id="hero" className="relative h-screen">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 hidden w-[55%] bg-linear-to-r from-black via-black/70 to-transparent md:block"
      />
      <h1 className="sr-only">Canon, Fullstack Web Developer</h1>

      <div className="relative flex h-full flex-col px-6 py-8 md:grid-cols-[1fr_1fr] md:gap-10 md:px-12">
        <div className="flex flex-col justify-center">
          <div className="flex flex-col items-start gap-6 md:flex-row md:items-center md:gap-8">
            <div className="relative h-40 w-40 shrink-0 overflow-hidden rounded-full border-2 border-accent md:h-56 md:w-56 2xl:h-64 2xl:w-64">
              <Image
                src="/foto/canon.jpg"
                alt="Foto Canon"
                fill
                priority
                sizes="(min-width: 1536px) 256px, 224px"
                className="object-cover"
                style={{ objectPosition: "50% 35%" }}
              />
            </div>

            <div className="min-w-0 flex-1">
              <div aria-live="polite" className="min-h-48 md:translate-y-8">
                {" "}
                <HeroSlide key={active} title={slide.title} text={slide.text} />
              </div>

              <div
                role="img"
                aria-label={`Slide ${active + 1} dari ${count}`}
                className="mt-16 flex gap-3"
              >
                {Array.from({ length: count }, (_, i) => (
                  <span
                    key={i}
                    className={`h-2.5 w-2.5 rounded-full bg-accent transition-all duration-300 ${
                      i === active ? "scale-125 opacity-100" : "opacity-30"
                    }`}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={toKarya}
                className="mt-6 inline-block rounded-full border border-accent px-5 py-2 text-sm font-semibold text-accent transition-colors hover:bg-accent hover:text-background"
              >
                Lihat karya
              </button>
            </div>
          </div>
        </div>

        {/* Slot kanan: BMW atau video (Langkah 5b) */}
        <div aria-hidden className="hidden md:block" />
      </div>
    </section>
  );
}
