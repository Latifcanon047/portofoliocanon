"use client";

import { Suspense } from "react";
import KartuRing from "./KartuRing";
import { PROJECTS } from "@/lib/karyaData";

export default function Scene() {
  return (
    <>
      {PROJECTS.map((project) => (
        <Suspense key={project.id} fallback={null}>
          <KartuRing project={project} />
        </Suspense>
      ))}
    </>
  );
}
