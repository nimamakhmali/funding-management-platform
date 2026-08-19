export interface Cards{
  id: string | number; 
  title: string;
  value: string;
  unit?: string;
  growth?: string;
  icon: React.ElementType; 
  label: string;
  color: string;
}