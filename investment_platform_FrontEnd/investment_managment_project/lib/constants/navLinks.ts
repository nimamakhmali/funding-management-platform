type NavLink={
id:string,
label:string,
href:string,
}


export const navLinks:NavLink[] = [
  {
    id:'haomePage',
    label: "صفحه اصلی",
    href: "/landing",

  },
  {
    id:"projects",
    label: "پروژه‌ها",
    href: "/projects",
  },
  {
    id:"aboutUs",
    label: "درباره ما",
    href: "/about-us",
  },
  {
    id:"contactUs",
    label: "تماس با ما",
    href: "/contact-us",
  },
] as const;