interface Props {
  title: string;
  icon: React.ReactNode;
}

export default function CompleteInformationCustomTitle({ icon, title }: Props) {
  return (
    <div className="flex items-center gap-2 mb-6 border-b border-[#f1f0f5] pb-2 my-6">
      <span className="text-[#8b5cf6]">{icon}</span>
      <h3 className="text-lg font-bold text-text-main">{title}</h3>
    </div>
  );
}
