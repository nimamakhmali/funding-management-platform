import { Challenge } from "@/lib/types/challenge";

type ChallengeCardProps = {
  challenge: Challenge;
};

export default function ChallengeCard({
  challenge,
}: ChallengeCardProps) {
  const Icon = challenge.icon;

  return (
    <div className="group rounded-xl border border-border bg-background p-8 transition-all duration-300 hover:-translate-y-2 hover:border-primary/30 hover:shadow-lg">

      <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg border border-border bg-surface text-primary transition-all duration-300 group-hover:scale-110">

        <Icon className="h-6 w-6" />

      </div>

      <h3 className="mb-3 text-xl font-bold text-text-main">
        {challenge.title}
      </h3>

      <p className="text-sm leading-relaxed text-text-muted">
        {challenge.description}
      </p>

    </div>
  );
}