export type ComparisonProject = {
  id: number;
  name: string;
  funded: number;
  target: number;
};

export const comparisonProjects: ComparisonProject[] = [
  {
    id: 1,
    name: "پروژه الف",
    funded: 75,
    target: 100,
  },
  {
    id: 2,
    name: "پروژه ب",
    funded: 45,
    target: 100,
  },
  {
    id: 3,
    name: "پروژه پ",
    funded: 90,
    target: 100,
  },
  {
    id: 4,
    name: "پروژه ت",
    funded: 30,
    target: 100,
  },
];