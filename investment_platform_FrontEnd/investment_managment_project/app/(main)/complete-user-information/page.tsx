import CompleteUserInformationContainerForm from "@/components/pages/main/complete-user-information/CompleteUserInformationContainerForm";
import CompleteUserInformationHeader from "@/components/pages/main/complete-user-information/CompleteUserInformationHeader";
import Container from "@/components/ui/Container";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "تکمیل اطلاعات کاربر",
};
export default function Page() {
  return (
    <Container className="max-w-[70%]">
      <CompleteUserInformationHeader />
      <CompleteUserInformationContainerForm />
    </Container>
  );
}
