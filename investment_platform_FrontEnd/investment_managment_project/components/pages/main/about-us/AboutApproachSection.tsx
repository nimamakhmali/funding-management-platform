import ApproachContent from "./ApproachContent";
import ApproachImage from "./ApproachImage";

export default function AboutApproachSection() {
  return (
    <section className="border-y border-border bg-background py-20">

      <div className="mx-auto max-w-7xl px-6">

        <div className="grid items-start gap-16 lg:grid-cols-2">

          <ApproachContent />

          <ApproachImage />

        </div>

      </div>

    </section>
  );
}