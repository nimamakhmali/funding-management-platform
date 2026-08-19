import Link from "next/link";


import { footerSections, socialLinks } from "@/lib/constants/footer";
import Logo from "../ui/Logo";

export default function Footer() {

  return (
    <footer className="bg-surface border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12">

        <div className="flex flex-col lg:flex-row justify-between gap-12">

          <div className="max-w-sm">

            <Logo />

            <p className="text-sm text-text-muted leading-loose mt-4">
              ارائه دهنده راهکارهای جامع مدیریت سرمایه و زیرساخت‌های مالی
              برای سازمان‌های پیشرو. ما متعهد به شفافیت و امنیت هستیم.
            </p>

            <div className="flex items-center gap-4 mt-6">
              <span className="text-sm text-text-muted">
                ما را دنبال کنید:
              </span>

              <div className="flex items-center gap-3">
                {socialLinks.map(({ id, href, label, Icon }) => (
                  <a
                    key={id}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="text-text-muted hover:text-primary transition-colors"
                  >
                    <Icon />
                  </a>
                ))}
              </div>
            </div>

          </div>

          <div className="flex flex-wrap gap-16">

            {footerSections.map((section) => (
              <div key={section.id}>
                <h4 className="font-semibold text-text-main mb-4 text-sm">
                  {section.title}
                </h4>

                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link.id}>
                      <Link
                        href={link.href}
                        className="text-sm text-text-muted hover:text-primary transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div>
              <h4 className="font-semibold text-text-main mb-4 text-sm">
                تماس
              </h4>

              <ul className="space-y-3 text-sm text-text-muted">
                <li>تهران، خیابان ولیعصر</li>
                <li>contact@fintech-platform.ir</li>
                <li dir="ltr">+98 21 8888 0000</li>
              </ul>
            </div>

          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border text-center">
          <p className="text-xs text-text-muted">
            © 1405 تمامی حقوق محفوظ است. طراحی و توسعه توسط تیم فنی پلتفرم.
          </p>
        </div>

      </div>
    </footer>
  );
}