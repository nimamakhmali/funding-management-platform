"use client";
import { Building2, User } from "lucide-react";
import { useState } from "react";
import LegalPersonForm from "./LegalPersonForm";
import RealPersonForm from "./RealPersonForm";
import SelectionCard from "./SelectionCard";

export default function ChooseUserAccount() {
  const [selectedType, setSelectedType] = useState<"real" | "legal">("real");

  const handleTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedType(event.target.value as "real" | "legal");
  };

  return (
    <>
      <section
        className="grid grid-cols-1 gap-4 md:gap-6 md:grid-cols-2"
        role="radiogroup"
        aria-label="انتخاب نوع حساب کاربری"
      >
        <SelectionCard
          id="type_real"
          name="account_type"
          value="real"
          icon={<User />}
          title="شخص حقیقی"
          description="برای افراد عادی"
          isChecked={selectedType === "real"}
          onChange={handleTypeChange}
        />
        <SelectionCard
          id="type_legal"
          name="legal"
          value="legal"
          icon={<Building2 />}
          title="شخص حقوقی"
          description="برای شرکت‌ها و سازمان‌ها"
          isChecked={selectedType === "legal"}
          onChange={handleTypeChange}
        />
      </section>
      <div>
        {selectedType === "real" ? <RealPersonForm /> : <LegalPersonForm />}
      </div>
    </>
  );
}
