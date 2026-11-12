import { PROJECTS } from "@/lib/karyaData";
import KaryaProject from "./KaryaProject";

export default function Karya() {
  return (
    <div id="karya">
      {PROJECTS.map((project) => (
        <KaryaProject key={project.id} project={project} />
      ))}
    </div>
  );
}
