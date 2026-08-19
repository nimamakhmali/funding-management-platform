import { MapPin, Phone, Mail } from "lucide-react";

export default function ContactInfo() {
  return (
    <div className="bg-surface border border-border rounded-2xl shadow-md p-6 space-y-4">
      <h3 className="font-bold text-text-main">اطلاعات تماس</h3>

      <div className="flex items-center gap-2 text-text-muted">
        <MapPin size={18} className="text-primary" />
        <span>تهران، خیابان ولیعصر</span>
      </div>

      <div className="flex items-center gap-2 text-text-muted">
        <Phone size={18} className="text-primary" />
        <span>021-88888888</span>
      </div>

      <div className="flex items-center gap-2 text-text-muted">
        <Mail size={18} className="text-primary" />
        <span>support@company.com</span>
      </div>
    </div>
  );
}