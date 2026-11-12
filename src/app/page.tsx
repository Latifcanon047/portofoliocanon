import SceneCanvas from "@/components/canvas/SceneCanvas";
import Karya from "@/components/sections/Karya";

export default function Home() {
  return (
    <>
      <SceneCanvas />
      <main className="relative z-10">
        <Karya />
      </main>
    </>
  );
}
