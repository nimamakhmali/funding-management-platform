import { UserRoundSearch } from "lucide-react";
import CompleteInformationCustomTitle from "../../../ui/CompleteInformationCustomTitle";
import { VerifiedContactFields } from "../../../ui/VerifiedContactFields";

export default function ContactInformation() {
  return (
    <>
      <CompleteInformationCustomTitle
        icon={<UserRoundSearch />}
        title="اطلاعات تماس"
      />

      <VerifiedContactFields />
    </>
  );
}