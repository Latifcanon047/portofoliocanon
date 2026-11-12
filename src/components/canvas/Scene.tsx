"use client";

import { Suspense } from "react";
import KartuRing from "./KartuRing";
import HeroCar from "./HeroCar";
import { PROJECTS } from "@/lib/karyaData";

export default function Scene() {
  return (
    <>
      <Suspense fallback={null}>
        <HeroCar />
      </Suspense>
      {PROJECTS.map((project) => (
        <Suspense key={project.id} fallback={null}>
          <KartuRing project={project} />
        </Suspense>
      ))}
    </>
  );
}
