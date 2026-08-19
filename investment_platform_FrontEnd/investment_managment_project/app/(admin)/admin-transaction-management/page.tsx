import AdminTransactionTable from "@/components/pages/admin/admin-transaction-management/AdminTransactionTable"
import Container from "@/components/ui/Container"
import AdminTransactionManagement from "@/components/pages/admin/admin-transaction-management/AdminTransactionFilterSection"
export default function Page(){
    return(
      <Container>
        <AdminTransactionManagement  />
       <AdminTransactionTable />
      </Container>
      
    )
}