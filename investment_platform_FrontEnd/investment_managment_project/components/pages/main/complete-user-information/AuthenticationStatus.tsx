import CompleteInformationCustomTitle from "@/components/ui/CompleteInformationCustomTitle";
import { FingerprintPattern } from "lucide-react";
import AuthenticationStatusSwitch from "./AuthenticationStatusSwitch";
export default function AuthenticationStatus() {
  return (
    <section aria-labelledby="auth-status-heading">
      <h2 id="auth-status-heading" className="sr-only">
        وضعیت احراز هویت
      </h2>
      <CompleteInformationCustomTitle
        title="وضعیت احراز هویت"
        icon={<FingerprintPattern aria-hidden="true" />}
      />

      <AuthenticationStatusSwitch status="failed" />
    </section>
  );
}
