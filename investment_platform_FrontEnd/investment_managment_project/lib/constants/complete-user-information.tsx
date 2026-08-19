import { Building, GraduationCap, Landmark } from "lucide-react";
import { ReactNode } from "react";

type LegalEntityOption = {
  id: string;
  title: string;
  icon: ReactNode;
  name: string;
  value: string;
};
export const COMPLETE_INFORMATION_CUSTOM_TITLE: LegalEntityOption[] = [
  {
    id: "1",
    title: "شرکت، مؤسسه یا نهاد غیردولتی",
    icon: <Building />,
    name: "legal_entity_subtype",
    value: "non-governmental",
  },
  {
    id: "2",
    title: "وزارتخانه، سازمان یا شرکت دولتی",
    icon: <Landmark />,
    name: "legal_entity_subtype",
    value: "governmental",
  },
  {
    id: "3",
    title: "مرکز آموزشی و پژوهشی",
    icon: <GraduationCap />,
    name: "legal_entity_subtype",
    value: "educational",
  },
];
