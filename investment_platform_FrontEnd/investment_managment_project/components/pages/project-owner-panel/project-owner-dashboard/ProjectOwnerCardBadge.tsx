type ProjectOwnerCardBadgeProps = {
  text: string;
  icon?: React.ReactNode;
  className: string;
};

export default function ProjectOwnerCardBadge({
  text,
  icon,
  className,
}: ProjectOwnerCardBadgeProps) {
  return (
    <span
      className={`mr-2 inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-xs font-bold ${className}`}
    >
      {icon}
      {text}
    </span>
  );
}