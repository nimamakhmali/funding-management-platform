import { missionData } from "@/lib/constants/about-us/mission.data";

export default function MissionContent() {
  return (
    <div className="space-y-8">

      <div>
        <div className="mb-3 flex items-center gap-2">
          <span className="height: 2px w-8 bg-primary" />

          <span className="text-sm font-bold tracking-wider text-primary">
            {missionData.mission.badge}
          </span>
        </div>

        <h2 className="mb-4 text-3xl font-bold text-text-main">
          {missionData.mission.title}
        </h2>

        <p className="leading-loose text-text-muted text-justify">
          {missionData.mission.description}
        </p>
      </div>

      <div>
        <div className="mb-3 flex items-center gap-2">
          <span className="height: 2px w-8 bg-primary" />

          <span className="text-sm font-bold tracking-wider text-primary">
            {missionData.vision.badge}
          </span>
        </div>

        <h2 className="mb-4 text-3xl font-bold text-text-main">
          {missionData.vision.title}
        </h2>

        <p className="leading-loose text-text-muted text-justify">
          {missionData.vision.description}
        </p>
      </div>

    </div>
  );
}