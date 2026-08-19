"use client";

import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SaveBarProps {
  onCancel?: () => void;
  isSubmitting?: boolean;
}

export function SaveButton({
  onCancel,
  isSubmitting = false,
}: SaveBarProps) {
  return (
    <div className="flex justify-end gap-3 mb-8">
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
        size={"lg"}
        className="text-primary border-gray-200 gap-3 hover:text-primary"
      >
        انصراف
      </Button>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="gap-3 text-white"
        size={"lg"}
      >
        <Save className="size-4" />
        ذخیره تنظیمات
      </Button>
    </div>
  );
}