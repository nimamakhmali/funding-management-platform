"use client";
import { Download, Eye } from "lucide-react";

export default function ProfitReportTableAction({ id }: { id: string }) {
  return (
    <div className="flex items-center gap-5">
      <button onClick={() => console.log(id)}>
        <Eye />
      </button>
      <button className="" onClick={() => console.log(id)}>
        <Download />
      </button>
    </div>
  );
}
