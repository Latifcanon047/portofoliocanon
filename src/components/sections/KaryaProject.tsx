"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { KARYA, activeProject, scrollProgress } from "@/lib/karya";
import { PROJECTS } from "@/lib/karyaData";
import type { ProjectData } from "@/lib/karyaData";
import { useTypewriter } from "@/lib/useTypewriter";

// Cincin mulai muncul saat atas section ada di 40% tinggi layar (sebelum pin),
// dan baru memudar 15% tinggi layar setelah pin lepas.
const PRESENCE_ENTER_VH = 0.4;
const PRESENCE_EXIT_VH = 0.15;

// Kecepatan ketik (ms per huruf). Makin kecil makin cepat.
const TYPE_TITLE_MS = 70; // judul bernomor (kiri)
const TYPE_INTRO_MS = 14; // penjelasan project (kiri)

// Efek geser per kata (kanan ke kiri) untuk teks kartu di bawah cincin.
const WORD_STAGGER_MS = 70; // jeda antar kata
const DESC_EXTRA_DELAY_MS = 80; // jeda tambahan sebelum deskripsi mulai

// Teks yang diketik. Bagian yang belum diketik tetap memakan tempat (invisible),
// jadi tata letak dan baris baru sudah final sejak awal dan tidak bergeser.
export function Typed({
  full,
  text,
  cursor,
  accentChars = 0,
}: {
  full: string;
  text: string;
  cursor: boolean;
  accentChars?: number;
}) {
  return (
    <>
      <span className="sr-only">{full}</span>
      <span aria-hidden>
        <span className="text-accent">{text.slice(0, accentChars)}</span>
        {text.slice(accentChars)}
        {cursor && <span className="karya-cursor" />}
        <span className="invisible">{full.slice(text.length)}</span>
      </span>
    </>
  );
}

// Tiap kata menggeser masuk dari kanan sambil memudar, bergantian per kata.
// Kata yang belum muncul tetap memakan tempat, jadi tata letak tidak bergeser.
function SlideWords({
  text,
  enabled,
  delayMs = 0,
}: {
  text: string;
  enabled: boolean;
  delayMs?: number;
}) {
  const words = text.split(" ");
  return (
    <>
      <span className="sr-only">{text}</span>
      <span aria-hidden>
        {words.map((word, i) => (
          <span key={i}>
            <span
              className={enabled ? "karya-word" : "opacity-0"}
              style={{ animationDelay: `${delayMs + i * WORD_STAGGER_MS}ms` }}
            >
              {word}
            </span>{" "}
          </span>
        ))}
      </span>
    </>
  );
}

// Teks kartu di bawah cincin. Dipasang dengan `key` per kartu, jadi
// animasinya mengulang dari awal setiap kartu berganti.
function CardCaption({
  title,
  description,
  enabled,
}: {
  title: string;
  description: string;
  enabled: boolean;
}) {
  const titleWords = title.split(" ").length;

  return (
    <>
      <h3 className="text-xl font-semibold text-foreground">
        {" "}
        <SlideWords text={title} enabled={enabled} />
      </h3>
      <p className="mx-auto mt-2 max-w-md text-sm text-foreground/85">
        {" "}
        <SlideWords
          text={description}
          enabled={enabled}
          delayMs={titleWords * WORD_STAGGER_MS + DESC_EXTRA_DELAY_MS}
        />
      </p>
    </>
  );
}

export default function KaryaProject({ project }: { project: ProjectData }) {
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  // Menjadi true sekali saat section pertama kali masuk; pemicu animasi teks.
  const [entered, setEntered] = useState(false);
  const count = project.cards.length;
  const card = project.cards[active];
  // Nomor project mengikuti urutan di PROJECTS (1, 2, ...).
  const number = PROJECTS.findIndex((p) => p.id === project.id) + 1;

  const titleText = `${number}. ${project.name}`;
  const title = useTypewriter(titleText, entered, TYPE_TITLE_MS);
  const intro = useTypewriter(
    project.description,
    entered,
    TYPE_INTRO_MS,
    titleText.length * TYPE_TITLE_MS + 250,
  );

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const vh = () => window.innerHeight;
    const pinDistance = () =>
      vh() * (((count - 1) * KARYA.scrollPerCard) / 100);

    const sync = (progress: number) => {
      scrollProgress[project.id] = progress;
      setActive(Math.round(progress * (count - 1)));
    };

    // Trigger 1: mengunci section dan menghasilkan progres kartu.
    const pin = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top top",
      end: () => `+=${pinDistance()}`,
      pin: true,
      invalidateOnRefresh: true,
      snap: {
        snapTo: 1 / (count - 1),
        directional: false, // snap ke kartu TERDEKAT, bukan selalu ke berikutnya
        duration: KARYA.snapDuration,
        delay: KARYA.snapDelay,
        ease: "power2.inOut",
      },
      onUpdate: (self) => sync(self.progress),
      onRefresh: (self) => sync(self.progress),
    });

    // Trigger 2: menentukan cincin mana yang tampil. Rentangnya sengaja
    // lebih lebar dari pin, supaya kartu pertama dan terakhir tidak hilang.
    const presence = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: () => `top ${PRESENCE_ENTER_VH * 100}%`,
      end: () =>
        `+=${vh() * PRESENCE_ENTER_VH + pinDistance() + vh() * PRESENCE_EXIT_VH}`,
      invalidateOnRefresh: true,
      onToggle: (self) => {
        if (self.isActive) {
          activeProject.current = project.id;
          setEntered(true);
        } else {
          setEntered(false);
          if (activeProject.current === project.id) {
            activeProject.current = null;
          }
        }
      },
      onRefresh: (self) => {
        if (self.isActive) {
          activeProject.current = project.id;
          setEntered(true);
        }
      },
    });

    return () => {
      pin.kill(true);
      presence.kill();
      delete scrollProgress[project.id];
      if (activeProject.current === project.id) activeProject.current = null;
    };
  }, [project.id, count]);

  return (
    <section
      ref={sectionRef}
      id={`karya-${project.id}`}
      className="relative h-screen"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 hidden w-[55%] bg-linear-to-r from-black via-black/70 to-transparent md:block"
      />
      {/*
        Layar lebar (md+): dua kolom. Kiri = judul + penjelasan + tombol demo,
        kanan = ruang cincin (cincin digambar di Canvas) + titik + teks kartu.
        HP: urutan ke bawah = judul, ruang cincin, penjelasan, titik + teks kartu.
        `contents` melebur pembungkus kolom di HP supaya `order` bisa mengatur urutannya.
      */}
      <div className="relative flex h-full flex-col px-6 py-8 md:grid md:grid-cols-[2fr_3fr] md:gap-10 md:px-12">
        {" "}
        <div className="contents md:flex md:flex-col md:justify-center">
          <div className="order-1 md:order-none">
            <p className="text-xs font-semibold uppercase tracking-widest text-accent">
              {" "}
              Karya
            </p>
            <h2 className="mt-2 text-4xl font-bold text-white md:text-6xl">
              {" "}
              <Typed
                full={titleText}
                text={title.text}
                cursor={entered && !title.done}
                accentChars={String(number).length + 1}
              />
            </h2>
          </div>

          <div className="order-3 mt-4 md:order-none md:mt-8">
            <p className="max-w-lg text-sm leading-relaxed text-white/85 md:text-base">
              {" "}
              <Typed
                full={project.description}
                text={intro.text}
                cursor={entered && title.done}
              />
            </p>
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-block rounded-full border border-accent px-5 py-2 text-sm font-semibold text-accent transition-colors hover:bg-accent hover:text-background"
            >
              Lihat demo live
            </a>
          </div>
        </div>
        <div className="contents md:flex md:flex-col">
          {/* Ruang kosong: di sinilah cincin 3D terlihat */}
          <div aria-hidden className="order-2 flex-1 md:order-none" />

          <div className="order-4 text-center md:order-none">
            <div
              role="img"
              aria-label={`Kartu ${active + 1} dari ${count}`}
              className="mb-5 flex justify-center gap-3"
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

            <div aria-live="polite">
              <CardCaption
                key={`${project.id}-${active}`}
                title={card.title}
                description={card.description}
                enabled={entered}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
