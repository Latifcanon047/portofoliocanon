import SceneCanvas from "@/components/canvas/SceneCanvas";
import SoundToggle from "@/components/SoundToggle";
import RotateHint from "@/components/RotateHint";
import Hero from "@/components/sections/Hero";
import Karya from "@/components/sections/Karya";
import Tentang from "@/components/sections/Tentang";
export default function Home() {
  return (
    <>
      <SceneCanvas />
      <SoundToggle />
      <RotateHint />{" "}
      <main className="relative z-10">
        <Hero />
        <Karya />
        <Tentang />{" "}
      </main>
    </>
  );
}
