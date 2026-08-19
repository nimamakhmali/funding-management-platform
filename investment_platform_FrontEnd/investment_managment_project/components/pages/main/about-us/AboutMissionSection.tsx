import MissionContent from "./MissionContent";
import MissionImage from "./MissionImage";

export default function AboutMissionSection() {
  return (
    <section className="bg-background py-20">

      <div className="mx-auto max-w-7xl px-6">

        <div className="grid items-center gap-12 lg:grid-cols-2">

          <MissionContent />

          <MissionImage />

        </div>

      </div>

    </section>
  );
}