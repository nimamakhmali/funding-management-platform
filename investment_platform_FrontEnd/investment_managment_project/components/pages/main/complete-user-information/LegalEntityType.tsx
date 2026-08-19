import CompleteInformationCustomTitle from "@/components/ui/CompleteInformationCustomTitle";
import { COMPLETE_INFORMATION_CUSTOM_TITLE } from "@/lib/constants/complete-user-information";
import { Scale } from "lucide-react";
import { useFormContext } from "react-hook-form";

export default function LegalEntityType() {
  const { register } = useFormContext();
  return (
    <>
      <CompleteInformationCustomTitle
        title="نوع شخصیت حقوقی"
        icon={<Scale />}
      />
      <div className={"grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"}>
        {COMPLETE_INFORMATION_CUSTOM_TITLE.map((item) => (
          <fieldset key={item.id}>
            <legend className="sr-only">نوع شخصیت حقوقی</legend>
            <label
              className="cursor-pointer relative"
              htmlFor={`${item.name}-${item.id}`}
            >
              <input
                id={`${item.name}-${item.id}`}
                className="peer sr-only"
                type="radio"
                value={item.value}
                defaultChecked={item.id === "1"}
                {...register(item.name)}
              />
              <div className="h-full p-4 rounded-xl border border-gray-200 hover:border-primary/50 peer-checked:border-primary peer-checked:bg-primary/5 peer-checked:text-primary transition-all flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="material-symbols-outlined text-gray-400 peer-checked:text-primary"
                >
                  {item.icon}
                </span>
                <span className="font-bold text-sm">{item.title}</span>
              </div>
            </label>
          </fieldset>
        ))}
      </div>
    </>
  );
}
