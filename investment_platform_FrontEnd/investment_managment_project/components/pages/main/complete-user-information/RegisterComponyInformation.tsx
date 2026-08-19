import CompleteInformationCustomTitle from "@/components/ui/CompleteInformationCustomTitle";
import FormInputContext from "@/components/ui/FormInputContext";
import { BookOpenText } from "lucide-react";
import FormSelectContext from "./FormSelectContext";

const countries = [
  { label: "ایران", value: "IR" },
  { label: "ترکیه", value: "TR" },
  { label: "امارات متحده عربی", value: "AE" },
  { label: "عراق", value: "IQ" },
  { label: "آذربایجان", value: "AZ" },
  { label: "ارمنستان", value: "AM" },
  { label: "قطر", value: "QA" },
  { label: "عمان", value: "OM" },
  { label: "کویت", value: "KW" },
  { label: "عربستان سعودی", value: "SA" },
];

export default function RegisterComponyInformation() {
  return (
    <>
      <CompleteInformationCustomTitle
        title="اطلاعات ثبتی"
        icon={<BookOpenText />}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FormSelectContext
          name="country"
          label="کشور"
          options={countries}
          placeholder="انتخاب کشور"
        />

        <FormInputContext
          name="province"
          label="استان"
        />

        <FormInputContext
          name="city"
          label="شهر"
        />

        <FormInputContext
          name="postalCode"
          label="کد پستی"
        />

        <FormInputContext
          name="phone"
          label="شماره تلفن"
          placeholder="021-xxxxxxxx"
        />
      </div>
    </>
  );
}