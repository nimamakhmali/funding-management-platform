"use client";

import { useRef } from "react";
import {
  CloudUpload,
  File as FileIcon,
  FileImage,
  FileText,
  Trash2,
} from "lucide-react";

import {
  Control,
  Controller,
  FieldValues,
  Path,
} from "react-hook-form";

import { cn } from "@/lib/utils";

type FormFileUploadFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // MB
};

function formatFileSize(size: number) {
  if (size < 1024) return `${size} B`;

  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(1)} KB`;
  }

  return `${(size / 1024 / 1024).toFixed(1)} MB`;
}

function getFileIcon(file: File) {
  if (file.type.startsWith("image/")) {
    return <FileImage className="h-5 w-5 text-primary" />;
  }

  if (file.type === "application/pdf") {
    return <FileText className="h-5 w-5 text-primary" />;
  }

  return <FileIcon className="h-5 w-5 text-primary" />;
}

function FormFileUploadField<T extends FieldValues>({
  control,
  name,
  label,
  accept = ".pdf,.jpg,.jpeg,.png",
  multiple = true,
  maxSize = 10,
}: FormFileUploadFieldProps<T>) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const files: File[] = field.value ?? [];

        const handleFiles = (selectedFiles: File[]) => {
          const validFiles = selectedFiles.filter(
            (file) => file.size <= maxSize * 1024 * 1024
          );

          if (multiple) {
            field.onChange([...files, ...validFiles]);
          } else {
            field.onChange(validFiles.slice(0, 1));
          }
        };

        const handleInputChange = (
          e: React.ChangeEvent<HTMLInputElement>
        ) => {
          const selectedFiles = Array.from(e.target.files ?? []);
          handleFiles(selectedFiles);
        };

        const handleDrop = (
          e: React.DragEvent<HTMLLabelElement>
        ) => {
          e.preventDefault();

          const selectedFiles = Array.from(e.dataTransfer.files);
          handleFiles(selectedFiles);
        };

        const removeFile = (index: number) => {
          field.onChange(files.filter((_, i) => i !== index));
        };

        return (
          <div className="flex flex-col gap-3">

            {label && (
              <label className="text-sm font-medium text-text-main dark:text-white">
                {label}
              </label>
            )}

            <label
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              className={cn(
                "border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center gap-4 cursor-pointer transition-all",
                "border-gray-200 hover:border-primary hover:bg-primary/5",
                fieldState.error && "border-red-500"
              )}
            >
              <CloudUpload className="h-8 w-8 text-primary" />

              <div>
                <p className="font-medium text-text-main dark:text-white">
                  فایل‌های پروژه را اینجا رها کنید
                </p>

                <p className="text-sm text-gray-500 mt-1">
                  یا{" "}
                  <span className="text-primary font-semibold">
                    انتخاب فایل
                  </span>
                </p>

                <p className="text-xs text-gray-400 mt-2">
                  PDF, JPG, PNG - حداکثر {maxSize}MB
                </p>
              </div>

              <input
                ref={inputRef}
                hidden
                type="file"
                multiple={multiple}
                accept={accept}
                onChange={handleInputChange}
              />
            </label>

            {files.length > 0 && (
              <div className="space-y-2">

                {files.map((file, index) => (
                  <div
                    key={`${file.name}-${index}`}
                    className="flex items-center justify-between rounded-lg border border-gray-200 dark:border-[#3d384e] bg-gray-50 dark:bg-white/5 p-3"
                  >
                    <div className="flex items-center gap-3">

                      {getFileIcon(file)}

                      <div>
                        <p className="text-sm font-medium text-text-main dark:text-white">
                          {file.name}
                        </p>

                        <p className="text-xs text-gray-500">
                          {formatFileSize(file.size)}
                        </p>
                      </div>

                    </div>

                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}

              </div>
            )}

            {fieldState.error && (
              <p className="text-xs text-red-500 font-medium">
                {fieldState.error.message}
              </p>
            )}

          </div>
        );
      }}
    />
  );
}

export default FormFileUploadField;