import { PanelContentHeaders } from "@/lib/types/PanelContentHeader-types";
export default function PanelContentHeader({title, description}: PanelContentHeaders) {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div>
        <h1 className="text-2xl font-black text-text-main tracking-tight">
          {title}
        </h1>
        <p className="text-gray-500 mt-2 text-base font-sm">
          {description}
        </p>
      </div>
    </div>
  );
}