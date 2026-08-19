import { Check } from "lucide-react";
import {
  approachData,
  approachItems,
} from "@/lib/constants/about-us/approach.data";

export default function ApproachContent() {
  return (
    <div>

      <h2 className="mb-6 text-3xl font-bold text-text-main">
        {approachData.title}
      </h2>

      <p className="mb-8 text-lg leading-relaxed text-text-muted">
        {approachData.description}
      </p>

      <ul className="space-y-6">

        {approachItems.map((item) => (
          <li
            key={item.id}
            className="flex gap-4"
          >
            <div className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary">

              <Check className="h-4 w-4" />

            </div>

            <div>

              <h4 className="text-lg font-bold text-text-main">
                {item.title}
              </h4>

              <p className="mt-1 text-sm text-text-muted">
                {item.description}
              </p>

            </div>

          </li>
        ))}

      </ul>

    </div>
  );
}