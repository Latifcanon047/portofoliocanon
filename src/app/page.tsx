import SceneCanvas from "@/components/canvas/SceneCanvas";
import Hero from "@/components/sections/Hero";
import Karya from "@/components/sections/Karya";

export default function Home() {
  return (
    <>
      <SceneCanvas />
      <main className="relative z-10">
        <Hero />
        <Karya />{" "}
      </main>
    </>
  );
}
