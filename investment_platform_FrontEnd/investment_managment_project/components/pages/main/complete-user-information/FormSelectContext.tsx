import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Controller, useFormContext } from "react-hook-form";

type Option = {
  label: string;
  value: string;
};

interface Props {
  label?: string;
  labelClassName?: string;
  name: string;
  inputStyle?: string;
  options: Option[];
  placeholder?: string;
}

export default function FormSelectContext({
  label,
  labelClassName,
  name,
  inputStyle,
  options,
  placeholder,
}: Props) {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const error = errors?.[name]?.message as string | undefined;
  const hasError = !!error;

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label
          htmlFor={name}
          className={cn("text-sm font-medium text-gray-600", labelClassName)}
        >
          {label}
        </label>
      )}

      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <>
            <Select
              dir="rtl"
              value={field.value ?? ""}
              onValueChange={field.onChange}
            >
              <SelectTrigger
                className={cn(
                  "w-full rounded-xl border-2 bg-gray-50 px-4 py-3 text-sm transition-all outline-none ",
                  "focus:ring-0 py-5.5",
                  hasError
                    ? "border-red-500 bg-red-50 text-red-900 focus:border-red-500"
                    : "border-gray-200 text-gray-900 focus:border-primary focus:bg-white hover:border-primary",
                  inputStyle,
                )}
              >
                <SelectValue id={name} placeholder={placeholder} />
              </SelectTrigger>

              <SelectContent
                className="z-50 bg-white"
                position="popper"
                sideOffset={8}
              >
                {options.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    className="py-2"
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {hasError && (
              <span className="text-[11px] font-medium text-red-500 mt-0.5">
                {error}
              </span>
            )}
          </>
        )}
      />
    </div>
  );
}
