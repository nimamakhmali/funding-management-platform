import AdminUserTable from "@/components/pages/admin/admin-user-management/AdminUserTable"
import Container from "@/components/ui/Container"
import AdminUserManagementToolbar from "@/components/pages/admin/admin-user-management/AdminUserManagementToolbar"
import AdminUserManagementHeader from "@/components/pages/admin/admin-user-management/AdminUserManagementHeader"

export default function Page(){
    return(
        <Container>
            <AdminUserManagementHeader />
            <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
               <AdminUserManagementToolbar />
                <AdminUserTable />
            </div>
        </Container>

    )
}