"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import type { ContactFormData } from "@/lib/types/contact.types";
import { CONTACT_SUBJECTS } from "@/lib/constants/contact.constants";

export default function ContactForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>();

  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: ContactFormData) => {
    setLoading(true);

    try {
      console.log(data);

      await new Promise((res) => setTimeout(res, 1000));

      alert("پیام ارسال شد ✔");
      reset();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-surface border border-border rounded-2xl shadow-md p-6 sm:p-10">
      <h2 className="text-xl font-bold text-text-main mb-6">
        فرم ارسال پیام
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

        <div>
          <Input
            {...register("fullname", {
              required: "نام الزامی است",
              minLength: { value: 3, message: "نام خیلی کوتاه است" },
            })}
            placeholder="نام و نام خانوادگی"
          />
          {errors.fullname && (
            <p className="text-error text-sm mt-1">
              {errors.fullname.message}
            </p>
          )}
        </div>

        <div>
          <Input
            {...register("email", {
              required: "ایمیل الزامی است",
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: "ایمیل نامعتبر است",
              },
            })}
            placeholder="ایمیل"
          />
          {errors.email && (
            <p className="text-error text-sm mt-1">
              {errors.email.message}
            </p>
          )}
        </div>

        <div>
          <Input
            {...register("phone", {
              required: "شماره تماس الزامی است",
              minLength: { value: 10, message: "شماره نامعتبر است" },
            })}
            placeholder="شماره تماس"
          />
          {errors.phone && (
            <p className="text-error text-sm mt-1">
              {errors.phone.message}
            </p>
          )}
        </div>

        <select
          {...register("subject", {
            required: "انتخاب موضوع الزامی است",
          })}
          className="w-full rounded-xl border-2 border-gray-100  bg-gray-50 px-4 py-3 text-sm outline-none transition-all focus:ring-0"
        >
          <option value="" >انتخاب موضوع</option>
          {CONTACT_SUBJECTS.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        <textarea
          {...register("message", {
            required: "پیام الزامی است",
            minLength: { value: 10, message: "پیام خیلی کوتاه است" },
          })}
          rows={5}
          placeholder="متن پیام"
          className="w-full rounded-xl border-2 border-gray-100 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition-all hover:border-gray-200 focus:border-primary focus:bg-white focus:ring-0"
        />

        {errors.message && (
          <p className="text-error text-sm">
            {errors.message.message}
          </p>
        )}

        <button
          disabled={loading}
          className="w-full bg-primary text-white py-3 rounded-lg font-bold hover:bg-primary-dark transition disabled:opacity-60"
        >
          {loading ? "در حال ارسال..." : "ارسال پیام"}
        </button>
      </form>
    </div>
  );
}