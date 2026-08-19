import {
  ShieldCheck,
  BadgeCheck,
  Scale,
} from "lucide-react";

const badges = [
  {
    title: "نظارت قانونی",
    icon: ShieldCheck,
  },
  {
    title: "تضمین شده",
    icon: BadgeCheck,
  },
  {
    title: "شفافیت کامل",
    icon: Scale,
  },
];

export default function SecurityBadges() {
  return (
    <section
      className="
        flex
        justify-center
        gap-8
        py-2
      "
    >
      {badges.map((badge) => {
        const Icon = badge.icon;

        return (
          <div
            key={badge.title}
            className="
              flex
              flex-col
              items-center
              gap-2
            "
          >
            <Icon className="h-6 w-6 text-gray-400" />

            <span className="text-xs font-bold text-muted-foreground">
              {badge.title}
            </span>
          </div>
        );
      })}
    </section>
  );
}