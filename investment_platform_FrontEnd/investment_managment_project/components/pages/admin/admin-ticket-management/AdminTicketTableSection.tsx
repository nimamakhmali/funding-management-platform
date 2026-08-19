import { ReusableTable } from "@/components/ui/ReusableTable";
import { ADMIN_TICKET_COLUMNS } from "./AdminTicketTableColumns";
import { TICKET_TABLE_DATA } from 
"@/lib/constants/admin/admin-ticket-management/AdminTicketTable";

export default function AdminTicketTableSection() {
  return (
    <ReusableTable
      columns={ADMIN_TICKET_COLUMNS}
      data={TICKET_TABLE_DATA}
      enablePagination
      itemsPerPage={2}
      emptyMessage="هیچ تیکتی یافت نشد"
    />
  );
}