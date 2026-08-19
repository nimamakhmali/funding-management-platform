import ContactCTA from "@/components/pages/main/contact-us/ContactCTA";
import ContactForm from "@/components/pages/main/contact-us/ContactForm";
import ContactHero from "@/components/pages/main/contact-us/ContactHero";
import ContactInfo from "@/components/pages/main/contact-us/ContactInfo";

export default function ContactPage() {
  return (
    <main className="bg-background min-h-screen">
      <ContactHero />

      <section className="max-w-7xl mx-auto px-4 pb-20 grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7">
          <ContactForm />
        </div>

        <div className="lg:col-span-5 space-y-6">
          <ContactInfo />
          <ContactCTA />
        </div>
      </section>
    </main>
  );
}