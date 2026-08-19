export const LANGUAGE_OPTIONS = [
  {
    label: "فارسی (RTL)",
    value: "fa",
    code: "fa",
    disabled: false,
  },
  {
    label: "English (LTR)",
    value: "en",
    code: "en",
    disabled: true,
  },
] as const;

export const THEME_OPTIONS = [
  {
    label: "لایت مود",
    value: "light",
    icon: "light_mode",
  },
  {
    label: "دارک مود",
    value: "dark",
    icon: "dark_mode",
  },
] as const;