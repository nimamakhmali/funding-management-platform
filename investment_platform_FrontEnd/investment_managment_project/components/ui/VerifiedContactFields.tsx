import React from "react";
import FormInputContext from "./FormInputContext";
import { VerifiedField } from "../pages/main/complete-user-information/VerifiedField";

interface ContactField {
  label: string;
  value: string;
  type: "text" | "email" | "tel";
  badgeText?: string;
}

interface VerifiedContactFieldsProps {
  fields?: ContactField[];
  heading?: string;
}

const defaultFields: ContactField[] = [
  {
    label: "شماره موبایل",
    value: "0912 345 6789",
    type: "tel",
  },
];

export const VerifiedContactFields: React.FC<
  VerifiedContactFieldsProps
> = ({
  fields = defaultFields,
  heading = "اطلاعات تماس تایید شده",
}) => {
    return (
      <section
        className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#f8f9fc] p-6 rounded-xl border border-dashed border-gray-200"
        aria-labelledby="verified-contact-heading"
      >
        <h2 id="verified-contact-heading" className="sr-only">
          {heading}
        </h2>

        {/* موبایل تایید شده */}
        <VerifiedField
          label={fields[0].label}
          value={fields[0].value}
          type="tel"
        />

        {/* ایمیل قابل ویرایش */}
        <FormInputContext
          name="email"
          label="ایمیل"
          type="email"
          placeholder="example@email.com"
          autoComplete="email"
        />
      </section>
    );
  };