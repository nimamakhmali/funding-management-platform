"use client";
import {Check } from "lucide-react";

export default function AdminProfitDistributionButton() {
  return (
    <button className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-lg text-sm font-bold transition-all shadow-lg shadow-primary/25">
      <Check />
    تایید توزیع سود
    </button>
  );
}
