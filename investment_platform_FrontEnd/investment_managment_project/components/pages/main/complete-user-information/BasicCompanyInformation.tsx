import CompleteInformationCustomTitle from "@/components/ui/CompleteInformationCustomTitle";
import FormInputContext from "@/components/ui/FormInputContext";
import { Building, LockKeyhole } from "lucide-react";

export default function BasicCompanyInformation() {
  return (
    <>
      <CompleteInformationCustomTitle
        title="اطلاعات پایه سازمان"
        icon={<Building />}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <FormInputContext
          name="companyNameFn"
          label="نام شرکت / سازمان (فارسی)"
        />

        <FormInputContext
          name="companyNameEn"
          label="نام شرکت / سازمان (لاتین)"
        />

        <FormInputContext
          name="CeoNameFn"
          label="نام مدیرعامل یا مدیر سازمان (فارسی)"
        />

        <FormInputContext
          name="managerNameFa"
          label="نام خانوادگی مدیر (فارسی)"
        />

      </div>

      <CompleteInformationCustomTitle
        title="تنظیم رمز عبور"
        icon={<LockKeyhole />}
      />


      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <FormInputContext
          name="password"
          label="رمز عبور"
          type="password"
          autoComplete="new-password"

        />

        <FormInputContext
          name="confirmPassword"
          label="تکرار رمز عبور"
          type="password"
          autoComplete="new-password"

        />

      </div>
    </>
  );
}