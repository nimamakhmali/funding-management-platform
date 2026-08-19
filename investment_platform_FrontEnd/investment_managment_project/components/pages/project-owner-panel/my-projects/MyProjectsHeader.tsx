import CreateProjectButton from "./CreateProjectButton";

export default function MyProjectsHeader() {
  return (
    <div className="flex justify-between items-center flex-wrap gap-4">
      <div>
        <h1 className="text-2xl font-bold text-text-main mb-2">
          پروژه های من
        </h1>
        <p className="text-text-sub text-sm">
          مدیریت وضعیت و پیگیری روند تامین مالی پروژه های فعال و غیرفعال
        </p>
      </div>
      <div className="flex gap-3">
        <CreateProjectButton />      
        </div>
    </div>
  );
}
