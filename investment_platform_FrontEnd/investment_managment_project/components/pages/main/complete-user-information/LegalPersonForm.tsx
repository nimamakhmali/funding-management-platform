"use client";

import CompleteInformationFooter from "@/components/ui/CompleteInformationFooter";
import {
  CompleteInformationFormValues,
  completeInformationResolver,
} from "@/lib/validation/complete-information.validation";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useCompleteLegalEntityProfile } from "@/lib/hooks/auth/useAuthMutations";
import { useAuthStore } from "@/lib/store/auth.store";
import { normalizePhoneNumber } from "@/lib/utils/auth.utils";

import AuthenticationStatus from "./AuthenticationStatus";
import BasicCompanyInformation from "./BasicCompanyInformation";
import ContactInformation from "./ContactInformation";
import LegalEntityType from "./LegalEntityType";
import RegisterComponyInformation from "./RegisterComponyInformation";

// نگاشت نوع شخصیت حقوقی فرانت به مقدار مورد نظر بک‌اند
function mapEntityType(
  subtype: "non-governmental" | "governmental" | "educational"
): "COMPANY" | "ORGANIZATION" {
  if (subtype === "governmental" || subtype === "educational") {
    return "ORGANIZATION";
  }
  return "COMPANY";
}

export default function LegalPersonForm() {
  const { phoneNumber } = useAuthStore();
  const completeProfileMutation = useCompleteLegalEntityProfile();

  const methods = useForm<CompleteInformationFormValues>({
    resolver: completeInformationResolver,
    mode: "onTouched",
    criteriaMode: "all",
    defaultValues: {
      legal_entity_subtype: "non-governmental",
      companyNameFn: "",
      companyNameEn: "",
      CeoNameFn: "",
      managerNameFa: "",
      country: "",
      province: "",
      city: "",
      postalCode: "",
      phone: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit: SubmitHandler<CompleteInformationFormValues> = async (
    data
  ) => {
    const phone = phoneNumber
      ? normalizePhoneNumber(phoneNumber)
      : "";

    if (!phone) {
      return;
    }

    await completeProfileMutation.mutateAsync({
      phone_number: phone,
      entity_type: mapEntityType(data.legal_entity_subtype),
      company_name_persian: data.companyNameFn,
      company_name_latin: data.companyNameEn,
      ceo_name: data.CeoNameFn,
      surname: data.managerNameFa,
      password: data.password,
      password_confirm: data.confirmPassword,
      country: data.country,
      province: data.province,
      postal_code: data.postalCode,
      contact_number: data.phone || "",
      email: data.email || "",
    });
  };

  return (
    <FormProvider {...methods}>
      <form
        id="legal-person-form"
        onSubmit={methods.handleSubmit(onSubmit)}
        className="flex flex-col gap-1.5"
      >
        <LegalEntityType />

        <BasicCompanyInformation />

        <RegisterComponyInformation />

        <ContactInformation />

        <AuthenticationStatus />

        <CompleteInformationFooter
          formId="legal-person-form"
          isSubmitting={
            methods.formState.isSubmitting ||
            completeProfileMutation.isPending
          }
        />
      </form>
    </FormProvider>
  );
}