export type AdminAuditLogType =
  | "balance"
  | "setting"
  | "delete-user";

export type AdminAuditLog ={
  id: string;
  type: AdminAuditLogType;
  description: string;

  user: {
    id: string;
    name: string;
    initials: string;
  };

  createdAt: string;
}