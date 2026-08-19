"use client";

import FormDatePickerField from "@/components/ui/FormDatePickerField";
import { FormInputField } from "@/components/ui/FormInputField";
import {
  RealPersonFormValues,
  realPersonResolver,
} from "@/lib/validation/real-person.validation";
import { useCompleteIndividualProfile } from "@/lib/hooks/auth/useAuthMutations";
import { useAuthStore } from "@/lib/store/auth.store";
import { normalizePhoneNumber } from "@/lib/utils/auth.utils";
import { IdCard } from "lucide-react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import CompleteInformationCustomTitle from "../../../ui/CompleteInformationCustomTitle";
import CompleteInformationFooter from "../../../ui/CompleteInformationFooter";
import AuthenticationStatus from "./AuthenticationStatus";
import ContactInformation from "./ContactInformation";
import FormInputContext from "@/components/ui/FormInputContext";

export default function RealPersonForm() {
  const { phoneNumber } = useAuthStore();
  const completeProfileMutation = useCompleteIndividualProfile();

  const methods = useForm<RealPersonFormValues>({
    resolver: realPersonResolver,
    mode: "onTouched",
    defaultValues: {
      firstName: "",
      lastName: "",
      nationalityCode: "",
      dateOfBirth: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit: SubmitHandler<RealPersonFormValues> = async (data) => {
    // شماره موبایل از store می‌آید (در مرحله ثبت‌نام ذخیره شده)
    
    const phone = phoneNumber
      ? normalizePhoneNumber(phoneNumber)
      : "";

    if (!phone) {
      return;
    }

      console.log("phone از store:", phoneNumber);
  console.log("phone normalized:", phone);
  console.log("data فرم:", data);
  console.log("payload نهایی:", {
    phone_number: phone,
    first_name: data.firstName,
    last_name: data.lastName,
    national_id: data.nationalityCode,
    date_of_birth: convertJalaliToGregorian(data.dateOfBirth),
    password: data.password,
    password_confirm: data.confirmPassword,
    email: data.email,
  });
  
    // تبدیل تاریخ شمسی به میلادی برای بک‌اند
    // فرمت ورودی: 1380/01/01 → خروجی: 2001-03-21
    const convertedDate = convertJalaliToGregorian(data.dateOfBirth);

    await completeProfileMutation.mutateAsync({
      phone_number: phone,
      first_name: data.firstName,
      last_name: data.lastName,
      national_id: data.nationalityCode,
      date_of_birth: convertedDate,
      password: data.password,
      password_confirm: data.confirmPassword,
      email: data.email || "",
    });
  };

  return (
    <FormProvider {...methods}>
      <CompleteInformationCustomTitle
        icon={<IdCard />}
        title="اطلاعات هویتی (حقیقی)"
      />
      <form
        id="real-person-form"
        onSubmit={methods.handleSubmit(onSubmit)}
        className="flex flex-col gap-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormInputField
            control={methods.control}
            name="firstName"
            label="نام"
          />

          <FormInputField
            control={methods.control}
            name="lastName"
            label="نام خانوادگی"
          />

          <FormInputField
            control={methods.control}
            name="nationalityCode"
            label="کد ملی"
          />

          <FormDatePickerField
            control={methods.control}
            name="dateOfBirth"
            label="تاریخ تولد"
            placeholder="13xx/xx/xx"
          />
        </div>

        <CompleteInformationCustomTitle
          title="تنظیم رمز عبور"
          icon={<IdCard />}
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

        <ContactInformation />

        <AuthenticationStatus />
      </form>

      <CompleteInformationFooter
        formId="real-person-form"
        isSubmitting={methods.formState.isSubmitting || completeProfileMutation.isPending}
      />
    </FormProvider>
  );
}

// ─── تبدیل تاریخ شمسی به میلادی ─────────────────────────────────────────────
function convertJalaliToGregorian(jalaliDate: string): string {
  // اگر تاریخ خالی بود یا قبلاً میلادی بود برگردان
  if (!jalaliDate) return "";
  if (jalaliDate.includes("-") && !jalaliDate.startsWith("13")) {
    return jalaliDate.split("T")[0];
  }

  try {
    // فرمت ورودی: 1380/01/01 یا 13800101
    const cleaned = jalaliDate.replace(/\//g, "").replace(/-/g, "");
    if (cleaned.length !== 8) return jalaliDate;

    const jy = parseInt(cleaned.substring(0, 4));
    const jm = parseInt(cleaned.substring(4, 6));
    const jd = parseInt(cleaned.substring(6, 8));

    // الگوریتم تبدیل جلالی به گرگوری
    const jy2 = jy - 979;
    const jm2 = jm - 1;
    const jd2 = jd - 1;

    let j_day_no =
      365 * jy2 +
      Math.floor(jy2 / 4) * 8 -
      Math.floor(jy2 / 100) * 97 +
      Math.floor(jy2 / 400) * 29 +
      Math.floor((jy2 + 31) / 33) * 11 +
      Math.floor((jy2 % 33 + 3) / 4);

    const jMonthDays = [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 29];
    for (let i = 0; i < jm2; i++) {
      j_day_no += jMonthDays[i];
    }
    j_day_no += jd2;

    let g_day_no = j_day_no + 79;

    const gy =
      979 +
      400 * Math.floor(g_day_no / 146097);
    g_day_no = g_day_no % 146097;

    let leap = true;
    if (g_day_no >= 36525) {
      g_day_no--;
      const gy2 = 100 * Math.floor(g_day_no / 36524);
      const gy3 = gy + gy2;
      g_day_no = g_day_no % 36524;

      if (g_day_no >= 365) g_day_no++;
      else leap = false;

      const gy4 = gy3 + 4 * Math.floor(g_day_no / 1461);
      g_day_no %= 1461;

      if (g_day_no >= 366) {
        leap = false;
        g_day_no--;
      }

      const gy5 = gy4 + Math.floor(g_day_no / 365);
      g_day_no = g_day_no % 365;

      const gMonthDays = [
        31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31,
      ];
      let gm = 0;
      for (; gm < 12 && g_day_no >= gMonthDays[gm]; gm++) {
        g_day_no -= gMonthDays[gm];
      }

      const gd = g_day_no + 1;
      const month = String(gm + 1).padStart(2, "0");
      const day = String(gd).padStart(2, "0");
      return `${gy5}-${month}-${day}`;
    }

    return jalaliDate;
  } catch {
    return jalaliDate;
  }
}