
import { StepCardProps } from "@/lib/types/step";


export default function StepCard({
  title,
  description,
  icon: Icon,
  index,
}: StepCardProps) {
  return (
    <div className="flex flex-col items-center text-center">

      <div className="relative mb-4 flex h-20 w-20 items-center justify-center rounded-full border-2 border-primary/20 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
        <Icon className="h-8 w-8 text-primary" />
      </div>

      <h3 className="text-lg font-bold text-text-main">
        {index}. {title}
      </h3>

      <p className="mt-1 text-sm text-text-muted  max-width: 180px">
        {description}
      </p>
    </div>
  );
}