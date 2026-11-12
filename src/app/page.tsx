import SceneCanvas from "@/components/canvas/SceneCanvas";
import SoundToggle from "@/components/SoundToggle";
import Hero from "@/components/sections/Hero";
import Karya from "@/components/sections/Karya";

export default function Home() {
  return (
    <>
      <SceneCanvas />
      <SoundToggle />{" "}
      <main className="relative z-10">
        <Hero />
        <Karya />{" "}
      </main>
    </>
  );
}
