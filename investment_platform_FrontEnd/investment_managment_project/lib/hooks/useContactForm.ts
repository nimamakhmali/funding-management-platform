"use client";

import { useState } from "react";
import type { ContactFormData } from "../types/contact.types";

export function useContactForm() {
  const [loading, setLoading] = useState(false);

  const submit = async (data: ContactFormData) => {
    setLoading(true);

    try {
      console.log("FORM DATA:", data);

      await new Promise((res) => setTimeout(res, 1000));

      alert("پیام با موفقیت ارسال شد");
    } catch (e) {
      alert("خطا در ارسال پیام");
    } finally {
      setLoading(false);
    }
  };

  return { submit, loading };
}