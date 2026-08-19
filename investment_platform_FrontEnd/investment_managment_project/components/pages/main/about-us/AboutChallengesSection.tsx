import { challenges } from "@/lib/constants/about-us/challenges.data";
import ChallengeCard from "./ChallengeCard";

export default function AboutChallengesSection() {
  return (
    <section className="bg-surface py-24">

      <div className="mx-auto max-w-7xl px-6">

        <div className="mx-auto mb-16 max-w-3xl text-center">

          <h2 className="mb-4 text-3xl font-bold text-text-main">
            چالش‌هایی که حل می‌کنیم
          </h2>

          <p className="text-text-muted">
            ما پیچیدگی‌های فرآیندهای سنتی را با راهکارهای مهندسی‌شده جایگزین می‌کنیم.
          </p>

        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">

          {challenges.map((challenge) => (
            <ChallengeCard
              key={challenge.id}
              challenge={challenge}
            />
          ))}

        </div>

      </div>

    </section>
  );
}