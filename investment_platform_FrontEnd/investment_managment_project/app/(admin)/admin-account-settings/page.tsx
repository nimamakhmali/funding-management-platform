import AdminAccountHeader from "@/components/pages/admin/admin-account-settings/AdminAccountHeader";
import AdminSettingsForm from "@/components/pages/admin/admin-account-settings/AdminSettingsForm";
import Container from "@/components/ui/Container";


export default function Page() {
  return (
    <Container>
      <AdminAccountHeader />
      <AdminSettingsForm  />
    </Container>
  );
}