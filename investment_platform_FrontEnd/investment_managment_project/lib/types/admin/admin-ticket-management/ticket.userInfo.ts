export interface TicketStatusOption {
  label: string;
  value: string;
}


export interface TicketAssignee {
  id: number;
  name: string;
  department: string;
}


export interface TicketUserInfo {
  id: string;
  name: string;
  level: string;
  openTickets: number;
  avatar?: string;
}


export interface TicketData {
  user: TicketUserInfo;
  statuses: TicketStatusOption[];
  assignees: TicketAssignee[];

}