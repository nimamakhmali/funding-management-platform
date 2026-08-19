type ProjectOwnerActiveProjectHeaderProps = {
  title: string;
  status: string;
};

export default function ProjectOwnerActiveProjectHeader({
  title,
  status,
}: ProjectOwnerActiveProjectHeaderProps) {
  return (
    <div className="flex items-center justify-between border-b border-slate-50 p-6">
      <h3 className="text-lg font-bold text-text-main">
        {title}
      </h3>

      <span className="rounded-full bg-primary/10 px-3 py-1 text-[10px] font-black text-primary uppercase">
        {status}
      </span>
    </div>
  );
}