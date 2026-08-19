type ProjectOwnerChartHeaderProps = {
  title: string;
};

export default function ProjectOwnerChartHeader({
  title,
}: ProjectOwnerChartHeaderProps) {
  return (
    <div className="mb-8 flex items-center justify-between">
      <h3 className="text-xl font-bold text-text-main">
        {title}
      </h3>

      <div className="flex rounded-lg border border-slate-100 bg-slate-50 p-1">
        <button className="rounded-md bg-primary px-4 py-1.5 text-xs font-bold text-white shadow-sm">
          سالیانه
        </button>

        <button className="rounded-md px-4 py-1.5 text-xs font-medium text-text-secondary transition-colors hover:text-primary">
          ماهیانه
        </button>
      </div>
    </div>
  );
}