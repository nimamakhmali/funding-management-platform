import { PROJECT_OWNER_TIPS_CARD } from "@/lib/constants/project-owner-panel/project-owner-dashboard/ProjectOwnerTipsCard";

export default function ProjectOwnerTipsCard() {
  return (
    <section className="relative overflow-hidden rounded-2xl p-6 text-text-main shadow-lg">
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white transition-all duration-500 border border-gray-100" />

      <div className="relative z-10 flex flex-col gap-5">
        <div className="flex items-center gap-3">
          <div className="rounded-lg p-2">
            {PROJECT_OWNER_TIPS_CARD.icon}
          </div>

          <h4 className="text-lg font-bold">
            {PROJECT_OWNER_TIPS_CARD.title}
          </h4>
        </div>

        <p className="text-xs leading-relaxed text-text-main">
          {PROJECT_OWNER_TIPS_CARD.description}
        </p>

        <button className="w-full rounded-xl bg-primary px-4 py-3 text-xs font-bold text-gray-50 shadow-sm">
          {PROJECT_OWNER_TIPS_CARD.buttonText}
        </button>
      </div>
    </section>
  );
}