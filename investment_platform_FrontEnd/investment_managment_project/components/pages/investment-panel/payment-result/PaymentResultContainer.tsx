import { Link } from "lucide-react";

interface Props {
  children: React.ReactNode;
}

export function PaymentResultContainer({
  children
}: Props) {
  return (
    <>
      <section className="mx-auto max-w-md overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
        {children}
      </section>
      
      <div className="text-center">
        <p className="text-sm text-text-sub mb-1">
          در صورت وجود هرگونه مغایرت، با پشتیبانی تماس بگیرید.
        </p>
        <button 
          className="text-primary hover:text-primary-hover text-sm font-medium border-b border-primary/30 hover:border-primary transition-colors pb-0.5" >
          تماس با پشتیبانی
        </button>
      </div>
    </>
  );
}