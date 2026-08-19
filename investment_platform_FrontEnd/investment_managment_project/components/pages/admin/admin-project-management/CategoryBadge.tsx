type Props = {
  category: string;
};

export default function AdminProjectManagementCategoryBadge({ category }: Props) {
  return (
    <span className="inline-flex items-center rounded-lg bg-gray-100 px-3 py-1 text-[11px] font-black text-gray-700">
      {category}
    </span>
  );
}