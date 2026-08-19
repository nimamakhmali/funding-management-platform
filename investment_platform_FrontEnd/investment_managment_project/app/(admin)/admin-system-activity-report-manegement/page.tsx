import AdminAuditLogTable from "@/components/pages/admin/admin-system-activity-report-management/AdminAuditLogTable";
import AdminSystemActivityFilterManagement from "@/components/pages/admin/admin-system-activity-report-management/AdminSystemActivityFilterSection";
import AuditLogDetailsCard from "@/components/pages/admin/admin-system-activity-report-management/AuditLogDetailsCard";
import Container from "@/components/ui/Container";
import { auditLogDetails } from "@/lib/constants/admin/admin-system-activity-report-management/AdminAuditLogDetailsData";
import AdminSystemActivityHeader from "@/components/pages/admin/admin-system-activity-report-management/AdminSystemActivityHeader";
export default function Page(){
    return(
        <Container>
         <AdminSystemActivityHeader />
         <AdminSystemActivityFilterManagement />
         <AdminAuditLogTable />
          <AuditLogDetailsCard
          details={auditLogDetails}
      />
        </Container>
    )
}