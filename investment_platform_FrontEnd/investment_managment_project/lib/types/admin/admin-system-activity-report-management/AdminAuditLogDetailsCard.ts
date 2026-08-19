export type AdminAuditLogChange ={
  before: string;
  after: string;
}

export type AdminAuditLogActor ={
  name: string;
  role: string;
  ip: string;
  browser: string;
}

export type AdminAuditLogMetadata ={
  module: string;
  time: string;
}

export type AdminAuditLogDetails ={
  id: string;
  changes: AdminAuditLogChange;
  actor: AdminAuditLogActor;
  metadata: AdminAuditLogMetadata;
}