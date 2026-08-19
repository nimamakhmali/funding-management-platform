export interface SubItem {
  title: string;
  href: string;
  id: string
}

export type Sidebar = {
  id: string,
  href: string,
  title: string,
  icon: React.ElementType,
  subItems?: SubItem[], 
}

