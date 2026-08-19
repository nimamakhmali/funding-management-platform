type ProjectOwnerCardIconProps = {
  icon: React.ReactNode;
  className: string;
};

export default function ProjectOwnerCardIcon({
  icon,
  className,
}: ProjectOwnerCardIconProps) {
  return (
    <div
      className={`rounded-xl p-3 transition-all group-hover:bg-primary group-hover:text-white ${className}`}
    >
      {icon}
    </div>
  );
}