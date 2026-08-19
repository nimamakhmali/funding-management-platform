type ProjectOwnerProgressProps = {
  progress: number;
};

export default function ProjectOwnerProgress({
  progress,
}: ProjectOwnerProgressProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-sm">
        <span className="font-bold text-text-secondary">
          پیشرفت جذب سرمایه
        </span>

        <span className="font-black text-primary">
          {progress}٪
        </span>
      </div>

      <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-primary transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}